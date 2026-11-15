#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { constants as fsConstants } from 'node:fs';
import { copyFile, lstat, mkdir, readFile, rename, writeFile, appendFile } from 'node:fs/promises';
import { execFile as execFileCallback } from 'node:child_process';
import { promisify } from 'node:util';
import { basename, dirname, extname, isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const execFile = promisify(execFileCallback);
const frontendRoot = resolve(fileURLToPath(new URL('..', import.meta.url)));
const projectRoot = resolve(frontendRoot, '..');
const evidenceRoot = resolve(projectRoot, 'evidence');
const coreManifestPath = resolve(projectRoot, 'content/video-manifest.json');
const expertManifestPath = resolve(projectRoot, 'content/expert-video-manifest.json');

function inside(base, target) {
  const rel = relative(base, target);
  return rel === '' || (!rel.startsWith(`..${sep}`) && rel !== '..' && !isAbsolute(rel));
}
function sha256(value) { return createHash('sha256').update(value).digest('hex'); }
function words(value) { return String(value || '').match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || []; }
function normalizedWords(value) { return words(value).map(w => w.toLocaleLowerCase('en')); }
function extractNarration(script) {
  const match = String(script).match(/^## Narration transcript\s*\n([\s\S]*?)(?=\n## |\s*$)/m);
  return match?.[1]?.trim() || '';
}
function timeToSeconds(value) {
  const match = String(value).trim().match(/^(\d{2}):(\d{2}):(\d{2})\.(\d{3})$/);
  if (!match) return NaN;
  const [, hh, mm, ss, ms] = match;
  if (Number(mm) > 59 || Number(ss) > 59) return NaN;
  return Number(hh) * 3600 + Number(mm) * 60 + Number(ss) + Number(ms) / 1000;
}
export function parseVtt(vtt) {
  const source = String(vtt || '').replace(/^\uFEFF/, '').replace(/\r/g, '');
  if (!source.startsWith('WEBVTT')) throw new Error('Caption file must start with WEBVTT.');
  const lines = source.split('\n');
  const cues = [];
  for (let i = 0; i < lines.length; i++) {
    const timing = lines[i].match(/^(\d{2}:\d{2}:\d{2}\.\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}\.\d{3})(?:\s+.*)?$/);
    if (!timing) continue;
    const start = timeToSeconds(timing[1]);
    const end = timeToSeconds(timing[2]);
    if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) throw new Error(`Invalid WebVTT time range at line ${i + 1}.`);
    const textLines = [];
    for (let j = i + 1; j < lines.length && lines[j].trim(); j++) {
      if (lines[j].includes('-->')) break;
      textLines.push(lines[j].replace(/<[^>]+>/g, ' ').trim());
    }
    const text = textLines.join(' ').replace(/\s+/g, ' ').trim();
    if (!text) throw new Error(`Caption cue at line ${i + 1} has no text.`);
    cues.push({ start, end, text });
  }
  if (!cues.length) throw new Error('WebVTT contains no caption cues.');
  for (let i = 1; i < cues.length; i++) {
    if (cues[i].start < cues[i - 1].end - 0.001) throw new Error(`WebVTT cues overlap or are out of order at cue ${i + 1}.`);
  }
  return cues;
}
function captionCoverage(narration, cues) {
  const expected = normalizedWords(narration);
  const actual = normalizedWords(cues.map(c => c.text).join(' '));
  if (!expected.length) return 0;
  const available = new Map();
  for (const token of actual) available.set(token, (available.get(token) || 0) + 1);
  let matched = 0;
  for (const token of expected) {
    const count = available.get(token) || 0;
    if (count > 0) { matched++; available.set(token, count - 1); }
  }
  return matched / expected.length;
}
function parseSceneRange(value) {
  const match = String(value || '').match(/^(\d+(?:\.\d+)?)-(\d+(?:\.\d+)?)s$/);
  return match ? { start: Number(match[1]), end: Number(match[2]) } : null;
}

export function validateNarrationAssets({ script, storyboard, captions, entry }) {
  const errors = [];
  const narration = extractNarration(script);
  if (!narration) errors.push(`${entry.videoId}: missing canonical narration transcript.`);
  const narrationWordCount = words(narration).length;
  if (entry.wordCount !== narrationWordCount) errors.push(`${entry.videoId}: manifest wordCount ${entry.wordCount} != narration word count ${narrationWordCount}.`);
  if (storyboard.videoId !== entry.videoId || storyboard.questionId !== entry.questionId) errors.push(`${entry.videoId}: storyboard identity mismatch.`);
  if (!Array.isArray(storyboard.scenes) || !storyboard.scenes.length) errors.push(`${entry.videoId}: storyboard has no scenes.`);
  const storyboardNarration = String(storyboard.narration || '').trim();
  if (storyboardNarration !== narration) errors.push(`${entry.videoId}: storyboard narration has drifted from the canonical script transcript.`);
  const target = Number(storyboard.targetDurationSeconds ?? entry.targetDurationSeconds?.estimated);
  if (!Number.isFinite(target) || target < 30 || target > 60) errors.push(`${entry.videoId}: storyboard target duration must be 30–60 seconds.`);
  if (Array.isArray(storyboard.scenes) && storyboard.scenes.length) {
    const ranges = storyboard.scenes.map(scene => parseSceneRange(scene.time));
    if (ranges.some(x => !x)) errors.push(`${entry.videoId}: one or more storyboard scene ranges are malformed.`);
    else {
      if (ranges[0].start !== 0) errors.push(`${entry.videoId}: storyboard must begin at 0 seconds.`);
      for (let i = 1; i < ranges.length; i++) {
        if (ranges[i].start < ranges[i - 1].end || ranges[i].start > ranges[i - 1].end + 0.25) errors.push(`${entry.videoId}: storyboard scene timing overlaps or contains a gap before scene ${i + 1}.`);
      }
      if (Math.abs(ranges.at(-1).end - target) > 1.1) errors.push(`${entry.videoId}: storyboard scene timing does not end at target duration.`);
    }
  }
  let cues = [];
  try { cues = parseVtt(captions); }
  catch (error) { errors.push(`${entry.videoId}: ${error.message}`); }
  if (cues.length && narration) {
    const coverage = captionCoverage(narration, cues);
    if (coverage < 0.95) errors.push(`${entry.videoId}: captions cover ${(coverage * 100).toFixed(1)}% of narration; minimum is 95%.`);
    if (Math.abs(cues.at(-1).end - target) > 2.1) errors.push(`${entry.videoId}: captions end at ${cues.at(-1).end.toFixed(2)}s, target is ${target}s.`);
    if (cues[0].start > 0.5) errors.push(`${entry.videoId}: captions start too late.`);
  }
  return { errors, narration, narrationWordCount, cues, captionCoverage: cues.length && narration ? captionCoverage(narration, cues) : 0 };
}

async function readJson(path) { return JSON.parse(await readFile(path, 'utf8')); }
async function safeRead(path, label) {
  try { return await readFile(path, 'utf8'); }
  catch { throw new Error(`${label} not found: ${relative(projectRoot, path)}`); }
}
function resolveProjectAsset(relativePath, expectedPrefix) {
  if (typeof relativePath !== 'string' || relativePath.includes('\\') || relativePath.startsWith('/') || relativePath.split('/').includes('..')) {
    throw new Error(`Unsafe asset path: ${String(relativePath)}`);
  }
  if (!relativePath.startsWith(expectedPrefix)) throw new Error(`Asset path must start with ${expectedPrefix}: ${relativePath}`);
  const resolved = resolve(projectRoot, relativePath);
  if (!inside(projectRoot, resolved)) throw new Error(`Asset path escapes project root: ${relativePath}`);
  return resolved;
}
function normalizeEntries(docs) {
  const entries = [];
  for (const doc of docs) {
    if (!Array.isArray(doc.entries)) throw new Error('Video manifest entries must be an array.');
    entries.push(...doc.entries);
  }
  return entries;
}

export async function validateProject({ synchronizeStoryboardNarration = false } = {}) {
  const errors = [];
  const coreDoc = await readJson(coreManifestPath);
  const expertDoc = await readJson(expertManifestPath);
  const docs = [coreDoc, expertDoc];
  const entries = normalizeEntries(docs);
  const ids = new Set();
  const questions = await readJson(resolve(frontendRoot, 'public/data/question-bank.json'));
  const expert = await readJson(resolve(frontendRoot, 'public/data/expert-challenge.json'));
  const referencesDoc = await readJson(resolve(projectRoot, 'research/reference-registry.json'));
  const refs = new Set((referencesDoc.references || []).map(ref => `[${ref.id}]`));
  const questionMap = new Map([...(questions.questions || []), ...(expert.questions || [])].map(q => [q.questionId, q]));
  if (questionMap.size < 1) errors.push('Question bank is empty.');
  if (entries.length !== questionMap.size) errors.push(`Expected ${questionMap.size} video manifest entries; found ${entries.length}.`);
  if (questionMap.size !== entries.length) errors.push('Question count and video manifest count differ.');
  let scriptCount = 0, storyboardCount = 0, captionCount = 0, promptCount = 0;
  let importedCount = 0, readyCount = 0;
  const rows = [];
  for (const entry of entries) {
    if (!entry.videoId || !entry.questionId) { errors.push('Manifest entry missing videoId or questionId.'); continue; }
    if (ids.has(entry.videoId)) errors.push(`Duplicate videoId: ${entry.videoId}.`);
    ids.add(entry.videoId);
    const q = questionMap.get(entry.questionId);
    if (!q) errors.push(`${entry.videoId}: unknown questionId ${entry.questionId}.`);
    else if (q.videoId !== entry.videoId) errors.push(`${entry.videoId}: question bank maps ${entry.questionId} to ${q.videoId}.`);
    for (const ref of entry.referenceIds || []) if (!refs.has(ref)) errors.push(`${entry.videoId}: unresolved research reference ${ref}.`);
    if (entry.status === 'deferred_by_owner_request') {
      if (entry.mediaFileExists !== false || entry.reviewStatus !== 'deferred_by_owner_request') errors.push(`${entry.videoId}: owner-deferred entry must not claim media or review approval.`);
      for (const field of ['scriptPath','storyboardPath','transcriptPath','captionsPath','promptPath']) if (entry[field] !== null) errors.push(`${entry.videoId}: deferred entry must not claim ${field}.`);
      try {
        const output = resolveProjectAsset(entry.plannedOutputPath, 'public/videos/');
        if (extname(output).toLowerCase() !== '.mp4') errors.push(`${entry.videoId}: deferred planned output must end in .mp4.`);
        try { await lstat(output); errors.push(`${entry.videoId}: deferred entry unexpectedly has an output file.`); }
        catch (error) { if (error?.code !== 'ENOENT') errors.push(`${entry.videoId}: cannot inspect deferred output: ${error.message}`); }
      } catch (error) { errors.push(`${entry.videoId}: ${error.message}`); }
      rows.push({ videoId: entry.videoId, questionId: entry.questionId, level: entry.level, wordCount: 0, captionCoverage: 0, status: entry.status, reviewStatus: entry.reviewStatus, mediaFileExists: false });
      continue;
    }
    const paths = {};
    try {
      paths.script = resolveProjectAsset(entry.scriptPath, 'content/videos/scripts/');
      paths.storyboard = resolveProjectAsset(entry.storyboardPath, 'content/videos/storyboards/');
      paths.captions = resolveProjectAsset(entry.captionsPath, 'content/videos/captions/');
      paths.prompt = resolveProjectAsset(entry.promptPath, 'content/videos/prompts/');
      paths.output = resolveProjectAsset(entry.plannedOutputPath, 'public/videos/');
      if (extname(paths.output).toLowerCase() !== '.mp4') errors.push(`${entry.videoId}: planned output must be an MP4.`);
    } catch (error) { errors.push(`${entry.videoId}: ${error.message}`); continue; }
    let script, storyboard, captions, prompt;
    try {
      [script, storyboard, captions, prompt] = await Promise.all([
        safeRead(paths.script, entry.videoId + ' script'),
        readJson(paths.storyboard),
        safeRead(paths.captions, entry.videoId + ' captions'),
        safeRead(paths.prompt, entry.videoId + ' prompt')
      ]);
    } catch (error) { errors.push(error.message); continue; }
    scriptCount++; storyboardCount++; captionCount++; promptCount++;
    const assetCheck = validateNarrationAssets({ script, storyboard, captions, entry });
    errors.push(...assetCheck.errors);
    if (synchronizeStoryboardNarration && storyboard.narration !== assetCheck.narration) {
      storyboard.narration = assetCheck.narration;
      await writeFile(paths.storyboard, `${JSON.stringify(storyboard, null, 2)}\n`);
    }
    if (!prompt.trim()) errors.push(`${entry.videoId}: generation prompt is empty.`);
    let outputExists = false;
    try {
      const outputStat = await lstat(paths.output);
      outputExists = outputStat.isFile() && !outputStat.isSymbolicLink();
      if (!outputExists) errors.push(`${entry.videoId}: planned MP4 output is not a regular file.`);
      else if (entry.mediaFileExists === true) {
        importedCount++;
        if (outputStat.size > 150 * 1024 * 1024) errors.push(`${entry.videoId}: MP4 exceeds the 150 MB limit.`);
        const probe = await runFfprobe(paths.output);
        const probeCheck = validateProbe(probe, entry, outputStat.size);
        errors.push(...probeCheck.errors.map(message => `${entry.videoId}: ${message}`));
        if (assetCheck.cues.length && assetCheck.cues.at(-1).end > probeCheck.duration + 0.5) errors.push(`${entry.videoId}: captions extend beyond actual MP4 duration.`);
        const fileHash = sha256(await readFile(paths.output));
        if (!entry.mediaSha256 || fileHash !== entry.mediaSha256) errors.push(`${entry.videoId}: MP4 SHA-256 does not match manifest.`);
        if (Number.isFinite(entry.actualDurationSeconds) && Math.abs(entry.actualDurationSeconds - probeCheck.duration) > 0.5) errors.push(`${entry.videoId}: recorded duration does not match ffprobe.`);
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') errors.push(`${entry.videoId}: cannot inspect planned media file: ${error.message}`);
    }
    if (entry.mediaFileExists === true && !outputExists) errors.push(`${entry.videoId}: manifest claims mediaFileExists but no MP4 exists.`);
    if (outputExists && entry.mediaFileExists !== true) errors.push(`${entry.videoId}: MP4 exists but manifest does not record the import.`);
    if (entry.status === 'ready') readyCount++;
    if (entry.status === 'ready' && entry.mediaFileExists !== true) errors.push(`${entry.videoId}: status is ready but mediaFileExists is not true.`);
    if (entry.status === 'ready' && entry.reviewStatus !== 'approved') errors.push(`${entry.videoId}: status is ready but human review is not approved.`);
    if (!entry.reviewStatus) errors.push(`${entry.videoId}: reviewStatus is missing.`);
    rows.push({ videoId: entry.videoId, questionId: entry.questionId, level: entry.level, wordCount: assetCheck.narrationWordCount, captionCoverage: Number(assetCheck.captionCoverage.toFixed(4)), status: entry.status, reviewStatus: entry.reviewStatus, mediaFileExists: entry.mediaFileExists });
  }
  for (const [questionId, q] of questionMap) if (!entries.some(e => e.questionId === questionId && e.videoId === q.videoId)) errors.push(`${questionId}: missing video manifest entry.`);
  if (synchronizeStoryboardNarration) {
    for (const doc of docs) {
      const path = doc === coreDoc ? coreManifestPath : expertManifestPath;
      await writeFile(path, `${JSON.stringify(doc, null, 2)}\n`);
      const publicPath = resolve(frontendRoot, 'public/data', basename(path));
      await writeFile(publicPath, `${JSON.stringify(doc, null, 2)}\n`);
    }
  }
  return { errors, totals: { questions: questionMap.size, videos: entries.length, scripts: scriptCount, storyboards: storyboardCount, captions: captionCount, prompts: promptCount, imported: importedCount, ready: readyCount }, rows, docs };
}

async function writeManifests(docs) {
  for (const doc of docs) {
    const ready = doc.entries.filter(e => e.status === 'ready').length;
    const imported = doc.entries.filter(e => e.mediaFileExists === true).length;
    const contentApproved = doc.entries.filter(e => e.contentReviewStatus === 'approved_for_generation').length;
    doc.mediaGenerationClaim = imported > 0;
    doc.contentReviewApprovedCount = contentApproved;
    doc.pendingContentReviewCount = doc.entries.length - contentApproved;
    doc.importedMediaCount = imported;
    doc.readyVideoCount = ready;
    doc.status = ready === doc.entries.length ? 'all_video_assets_ready' : imported > 0 ? 'media_imported_pending_or_partial_review' : 'scripts_storyboards_prompts_captions_drafted_mp4_not_generated';
    const target = doc === docs[0] ? coreManifestPath : expertManifestPath;
    await writeFile(target, `${JSON.stringify(doc, null, 2)}\n`);
    await writeFile(resolve(frontendRoot, 'public/data', basename(target)), `${JSON.stringify(doc, null, 2)}\n`);
  }
}

async function runFfprobe(path) {
  const { stdout } = await execFile('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', path], { timeout: 30000, maxBuffer: 4 * 1024 * 1024 });
  return JSON.parse(stdout);
}
export function validateProbe(probe, entry, fileSize) {
  const errors = [];
  const format = probe?.format || {};
  const streams = probe?.streams || [];
  const video = streams.find(s => s.codec_type === 'video');
  const audio = streams.find(s => s.codec_type === 'audio');
  const duration = Number(format.duration);
  if (!String(format.format_name || '').split(',').some(x => ['mp4', 'mov'].includes(x))) errors.push('Container is not MP4-compatible.');
  if (!video) errors.push('No video stream found.');
  if (!audio) errors.push('Narration audio stream is required.');
  if (video) {
    if (video.codec_name !== 'h264') errors.push('Video codec must be H.264 for broad browser support.');
    if (Number(video.width) < 1280 || Number(video.height) < 720) errors.push('Video resolution must be at least 1280×720.');
    const ratio = Number(video.width) / Number(video.height);
    if (!Number.isFinite(ratio) || Math.abs(ratio - 16 / 9) > 0.03) errors.push('Video aspect ratio must be 16:9.');
    if (!['yuv420p', 'yuvj420p'].includes(video.pix_fmt)) errors.push('Video pixel format must be yuv420p for browser compatibility.');
  }
  if (audio && audio.codec_name !== 'aac') errors.push('Audio codec must be AAC for broad browser support.');
  if (!Number.isFinite(duration) || duration < 30 || duration > 60) errors.push('Rendered duration must be between 30 and 60 seconds.');
  if (fileSize <= 0 || fileSize > 150 * 1024 * 1024) errors.push('MP4 file must be between 1 byte and 150 MB.');
  if (entry.targetDurationSeconds && Number.isFinite(duration)) {
    const min = Number(entry.targetDurationSeconds.min ?? 30);
    const max = Number(entry.targetDurationSeconds.max ?? 60);
    if (duration < min - 1 || duration > max + 1) errors.push(`Duration ${duration.toFixed(2)}s is outside manifest range ${min}–${max}s.`);
  }
  return { errors, duration, videoCodec: video?.codec_name || null, audioCodec: audio?.codec_name || null, width: video?.width || null, height: video?.height || null };
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const args = {};
  for (let i = 0; i < rest.length; i++) {
    if (rest[i].startsWith('--')) args[rest[i].slice(2)] = rest[i + 1]?.startsWith('--') || rest[i + 1] === undefined ? true : rest[++i];
  }
  return { command, args };
}
function allDocs() { return [coreManifestPath, expertManifestPath]; }
async function loadDocs() { return Promise.all(allDocs().map(readJson)); }
async function findEntry(videoId, docs) {
  for (const doc of docs) { const entry = doc.entries.find(e => e.videoId === videoId); if (entry) return { doc, entry }; }
  throw new Error(`Unknown video ID: ${videoId}`);
}

async function createQueue() {
  const report = await validateProject();
  if (report.errors.length) throw new Error(`Video preflight failed:\n- ${report.errors.join('\n- ')}`);
  const docs = await loadDocs();
  const questions = await readJson(resolve(frontendRoot, 'public/data/question-bank.json'));
  const expert = await readJson(resolve(frontendRoot, 'public/data/expert-challenge.json'));
  const questionMap = new Map([...(questions.questions || []), ...(expert.questions || [])].map(q => [q.questionId, q]));
  const batchRoot = resolve(evidenceRoot, 'video-generation-batch');
  const entries = normalizeEntries(docs);
  const jobs = [];
  for (const entry of entries) {
    const script = await readFile(resolve(projectRoot, entry.scriptPath), 'utf8');
    const storyboard = await readJson(resolve(projectRoot, entry.storyboardPath));
    const prompt = await readFile(resolve(projectRoot, entry.promptPath), 'utf8');
    const captions = await readFile(resolve(projectRoot, entry.captionsPath), 'utf8');
    const question = questionMap.get(entry.questionId);
    const providerKey = process.env.VIDEO_PROVIDER || 'unconfigured';
    const assetVersion = String(entry.assetVersion || '1');
    const idempotencyKey = sha256(`${entry.videoId}\n${sha256(script)}\n${sha256(prompt)}\n${sha256(JSON.stringify(storyboard))}\nprovider=${providerKey}\nassetVersion=${assetVersion}`);
    const approved = entry.contentReviewStatus === 'approved_for_generation';
    const status = entry.mediaFileExists ? 'already_rendered' : approved ? 'eligible_for_provider_queue' : 'blocked_pending_human_review';
    const job = {
      videoId: entry.videoId, questionId: entry.questionId, level: entry.level, title: entry.title,
      status, blockReason: approved ? null : 'Question, explanation, narration and storyboard require recorded human approval before provider submission.',
      idempotencyKey, requestedFormat: 'mp4', aspectRatio: '16:9', targetDurationSeconds: entry.targetDurationSeconds,
      narration: extractNarration(script), script, storyboard, prompt, captions, referenceIds: entry.referenceIds,
      question: { title: question?.title, learningObjective: question?.learningObjective, scenario: question?.scenario, correctOptionId: question?.correctOptionId, correctAnswer: question?.correctAnswer, optionExplanations: question?.optionExplanations, keyTakeaway: question?.keyTakeaway, recommendedDefensiveAction: question?.recommendedDefensiveAction }
    };
    jobs.push(job);
    const out = resolve(batchRoot, entry.videoId);
    await mkdir(out, { recursive: true });
    await Promise.all([
      writeFile(resolve(out, 'job.json'), `${JSON.stringify(job, null, 2)}\n`),
      writeFile(resolve(out, 'narration.txt'), `${job.narration}\n`),
      writeFile(resolve(out, 'script.md'), script),
      writeFile(resolve(out, 'storyboard.json'), `${JSON.stringify(storyboard, null, 2)}\n`),
      writeFile(resolve(out, 'prompt.txt'), prompt),
      writeFile(resolve(out, 'captions.vtt'), captions)
    ]);
  }
  await writeManifests(docs);
  const queue = {
    project: 'CYBERAWARE 3D', version: '1.0.0', generatedAt: new Date().toISOString(), provider: null,
    providerConfigured: false, mediaGenerationClaim: false,
    total: jobs.length, eligible: jobs.filter(j => j.status === 'eligible_for_provider_queue').length,
    blockedPendingReview: jobs.filter(j => j.status === 'blocked_pending_human_review').length,
    alreadyRendered: jobs.filter(j => j.status === 'already_rendered').length,
    jobs: jobs.map(({ script, storyboard, prompt, captions, narration, question, ...meta }) => meta)
  };
  await mkdir(evidenceRoot, { recursive: true });
  await writeFile(resolve(evidenceRoot, 'video-generation-queue.json'), `${JSON.stringify(queue, null, 2)}\n`);
  await writeFile(resolve(evidenceRoot, 'video-generation-batch', 'README.md'), '# CYBERAWARE 3D — video generation batch\n\nEach folder contains one question-bound generation package: narration, script, storyboard, visual prompt, WebVTT draft and `job.json`. Do not submit a job while its status is `blocked_pending_human_review`. Keep the script transcript as the only narration source. Generated output must be H.264/AAC MP4, 16:9, 720p or higher, 30–60 seconds. Import with `npm run video:import -- --video-id VIDEO-ID --file /path/to/render.mp4`, then complete human validation and `npm run video:approve`.\n');
  const { stdout = '' } = await execFile('python3', ['-c', `import pathlib,zipfile\nr=pathlib.Path(${JSON.stringify(batchRoot)})\nout=pathlib.Path(${JSON.stringify(resolve(evidenceRoot, 'video-generation-batch.zip'))})\nwith zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:\n  for p in sorted(r.rglob('*')):\n    if p.is_file(): z.write(p,p.relative_to(r.parent))\nprint(out)`]);
  return { queue, zipPath: resolve(evidenceRoot, 'video-generation-batch.zip'), zipOutput: stdout.trim() };
}

async function approveContent(args) {
  if (!args['video-id'] || !args.reviewer || !args.checklist) throw new Error('Usage: video:review-content -- --video-id VIDEO-ID --reviewer REVIEWER-ID --checklist checklist.json');
  const docs = await loadDocs();
  const { entry } = await findEntry(String(args['video-id']), docs);
  if (entry.mediaFileExists === true) throw new Error('Content review must happen before media import.');
  const checklist = await readJson(resolve(String(args.checklist)));
  const required = ['factualAccuracy', 'correctAnswerAndDistractors', 'referencesVerified', 'narrationMatchesExplanation', 'scriptAndStoryboardReviewed', 'noSensitiveData', 'accessibilityBriefReviewed'];
  const missing = required.filter(key => checklist[key] !== true);
  if (missing.length) throw new Error(`Pre-generation review checklist is incomplete: ${missing.join(', ')}`);
  const reviewer = String(args.reviewer).trim();
  if (reviewer.length < 2 || reviewer.length > 80 || /[\r\n]/.test(reviewer)) throw new Error('Reviewer ID must be 2–80 characters on one line.');
  Object.assign(entry, {
    contentReviewStatus: 'approved_for_generation',
    contentReviewedBy: reviewer,
    contentReviewedAt: new Date().toISOString(),
    contentReviewChecklist: checklist
  });
  await writeManifests(docs);
  await mkdir(evidenceRoot, { recursive: true });
  await appendFile(resolve(evidenceRoot, 'video-content-review-log.jsonl'), `${JSON.stringify({ videoId: entry.videoId, reviewer, reviewedAt: entry.contentReviewedAt, checklist })}\n`);
  return { videoId: entry.videoId, state: entry.contentReviewStatus, reviewer, reviewedAt: entry.contentReviewedAt };
}

async function importVideo(args) {
  if (!args['video-id'] || !args.file) throw new Error('Usage: video:import -- --video-id VIDEO-ID --file /absolute/path/to/render.mp4');
  const docs = await loadDocs();
  const { entry } = await findEntry(String(args['video-id']), docs);
  if (!entry.plannedOutputPath?.startsWith('public/videos/') || !/\.mp4$/i.test(entry.plannedOutputPath)) throw new Error('Manifest output path is not an approved public MP4 path.');
  const sourceArgument = String(args.file);
  if (!isAbsolute(sourceArgument)) throw new Error('Input media path must be absolute.');
  if (!/\.mp4$/i.test(sourceArgument)) throw new Error('Input media file must use the .mp4 extension.');
  const source = resolve(sourceArgument);
  const sourceStat = await lstat(source);
  if (!sourceStat.isFile() || sourceStat.isSymbolicLink()) throw new Error('Input media must be a regular, non-symlink file.');
  if (sourceStat.size <= 0 || sourceStat.size > 150 * 1024 * 1024) throw new Error('Input media must be between 1 byte and 150 MB.');
  const probe = await runFfprobe(source);
  const check = validateProbe(probe, entry, sourceStat.size);
  if (check.errors.length) throw new Error(`Media validation failed:\n- ${check.errors.join('\n- ')}`);
  const narration = extractNarration(await readFile(resolve(projectRoot, entry.scriptPath), 'utf8'));
  const captionText = await readFile(resolve(projectRoot, entry.captionsPath), 'utf8');
  const cues = parseVtt(captionText);
  if (cues.at(-1).end > check.duration + 0.5) throw new Error('Caption track extends beyond rendered media duration.');
  if (captionCoverage(narration, cues) < 0.95) throw new Error('Caption text does not cover at least 95% of the approved narration.');
  const destination = resolveProjectAsset(entry.plannedOutputPath, 'public/videos/');
  await mkdir(dirname(destination), { recursive: true });
  const temp = `${destination}.part-${process.pid}`;
  await copyFile(source, temp, fsConstants.COPYFILE_EXCL);
  await rename(temp, destination);
  const digest = createHash('sha256');
  const bytes = await readFile(destination);
  digest.update(bytes);
  const docsFresh = await loadDocs();
  const target = await findEntry(String(args['video-id']), docsFresh);
  Object.assign(target.entry, {
    status: 'rendered_pending_human_review', mediaFileExists: true,
    mediaSha256: digest.digest('hex'), actualDurationSeconds: Number(check.duration.toFixed(3)),
    mediaSizeBytes: sourceStat.size, mediaContainer: 'mp4', videoCodec: check.videoCodec, audioCodec: check.audioCodec,
    resolution: `${check.width}x${check.height}`, importedAt: new Date().toISOString(), reviewStatus: 'pending_human_review'
  });
  await writeManifests(docsFresh);
  return { videoId: target.entry.videoId, destination: relative(projectRoot, destination), size: sourceStat.size, duration: check.duration, sha256: target.entry.mediaSha256, state: target.entry.status };
}

async function approveVideo(args) {
  if (!args['video-id'] || !args.reviewer || !args.checklist) throw new Error('Usage: video:approve -- --video-id VIDEO-ID --reviewer REVIEWER-ID --checklist checklist.json');
  const docs = await loadDocs();
  const { entry } = await findEntry(String(args['video-id']), docs);
  if (entry.mediaFileExists !== true || entry.status !== 'rendered_pending_human_review') throw new Error('Only an imported, pending-review video can be approved.');
  const checklistPath = resolve(String(args.checklist));
  const checklist = await readJson(checklistPath);
  const required = ['factualAccuracy', 'answerAndDistractorConsistency', 'narrationAndPronunciation', 'captionSynchronization', 'visualQuality', 'accessibility', 'rightsCleared', 'noSensitiveOrRealTargetData'];
  const missing = required.filter(key => checklist[key] !== true);
  if (missing.length) throw new Error(`Review checklist is incomplete: ${missing.join(', ')}`);
  const mediaPath = resolveProjectAsset(entry.plannedOutputPath, 'public/videos/');
  const mediaStat = await lstat(mediaPath);
  const probe = await runFfprobe(mediaPath);
  const probeCheck = validateProbe(probe, entry, mediaStat.size);
  if (probeCheck.errors.length) throw new Error(`Media no longer passes validation:\n- ${probeCheck.errors.join('\n- ')}`);
  const narration = extractNarration(await readFile(resolve(projectRoot, entry.scriptPath), 'utf8'));
  const captions = parseVtt(await readFile(resolve(projectRoot, entry.captionsPath), 'utf8'));
  if (captions.at(-1).end > probeCheck.duration + 0.5 || captionCoverage(narration, captions) < 0.95) throw new Error('Caption validation failed at approval stage.');
  const reviewer = String(args.reviewer).trim();
  if (reviewer.length < 2 || reviewer.length > 80 || /[\r\n]/.test(reviewer)) throw new Error('Reviewer ID must be 2–80 characters on one line.');
  Object.assign(entry, { status: 'ready', reviewStatus: 'approved', reviewedBy: reviewer, reviewedAt: new Date().toISOString(), reviewChecklist: checklist, mediaValidated: true });
  await writeManifests(docs);
  await mkdir(evidenceRoot, { recursive: true });
  await appendFile(resolve(evidenceRoot, 'video-review-log.jsonl'), `${JSON.stringify({ videoId: entry.videoId, reviewer, reviewedAt: entry.reviewedAt, mediaSha256: entry.mediaSha256, checklist })}\n`);
  return { videoId: entry.videoId, state: entry.status, reviewer, reviewedAt: entry.reviewedAt };
}

async function main() {
  const { command, args } = parseArgs(process.argv.slice(2));
  if (command === 'validate') {
    const result = await validateProject({ synchronizeStoryboardNarration: args['sync-narration'] === true });
    console.log(JSON.stringify({ totals: result.totals, errors: result.errors }, null, 2));
    if (result.errors.length) process.exitCode = 1;
  } else if (command === 'queue') {
    const result = await createQueue();
    console.log(JSON.stringify({ ...result.queue, zipPath: result.zipPath }, null, 2));
  } else if (command === 'review-content') {
    console.log(JSON.stringify(await approveContent(args), null, 2));
  } else if (command === 'import') {
    console.log(JSON.stringify(await importVideo(args), null, 2));
  } else if (command === 'approve') {
    console.log(JSON.stringify(await approveVideo(args), null, 2));
  } else {
    console.error('Commands: validate [--sync-narration], queue, review-content --video-id ID --reviewer ID --checklist checklist.json, import --video-id ID --file /path/file.mp4, approve --video-id ID --reviewer ID --checklist checklist.json');
    process.exitCode = 2;
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
