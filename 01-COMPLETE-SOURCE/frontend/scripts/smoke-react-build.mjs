import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const frontend = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = resolve(process.env.CYBERAWARE_REACT_DIST_DIR || resolve(frontend, 'dist-react'));
const exists = async path => { try { await access(path); return true; } catch { return false; } };
assert.equal(await exists(resolve(dist, 'index.html')), true, 'React index.html missing; run Vite build first.');
assert.equal(await exists(resolve(dist, 'legacy.html')), true, 'Legacy simulation compatibility page missing.');
assert.equal(await exists(resolve(dist, 'legacy-src/app.js')), true, 'Legacy app module missing.');
const manifestPath = resolve(dist, '.vite/manifest.json');
assert.equal(await exists(manifestPath), true, 'Vite build manifest missing.');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const entry = Object.values(manifest).find(row => row.isEntry && row.file?.endsWith('.js'));
assert.ok(entry, 'No React entry chunk in Vite manifest.');
assert.equal(await exists(resolve(dist, entry.file)), true, `React entry chunk missing: ${entry.file}`);
const publicData = resolve(dist, 'data');
for (const name of ['question-bank.json','expert-challenge.json','explanations.json','expert-explanations.json','video-manifest.json','expert-video-manifest.json','references.json','research-paper-preview.pdf']) {
  assert.equal(await exists(resolve(publicData, name)), true, `Public data missing: ${name}`);
}
const questionsDoc = JSON.parse(await readFile(resolve(publicData, 'question-bank.json'), 'utf8'));
const expertQuestionsDoc = JSON.parse(await readFile(resolve(publicData, 'expert-challenge.json'), 'utf8'));
const core = JSON.parse(await readFile(resolve(publicData, 'video-manifest.json'), 'utf8'));
const expert = JSON.parse(await readFile(resolve(publicData, 'expert-video-manifest.json'), 'utf8'));
const videos = [...core.entries, ...expert.entries];
assert.equal(videos.length, questionsDoc.questions.length + expertQuestionsDoc.questions.length, 'Question-level video manifest entries must match the full question bank.');
for (const row of videos) {
  if (row.status === 'deferred_by_owner_request') {
    assert.equal(row.mediaFileExists, false);
    assert.equal(row.reviewStatus, 'deferred_by_owner_request');
    for (const field of ['scriptPath','storyboardPath','promptPath','captionsPath']) assert.equal(row[field], null);
    continue;
  }
  for (const [key, path] of Object.entries({scriptPath:row.scriptPath, storyboardPath:row.storyboardPath, promptPath:row.promptPath, captionsPath:row.captionsPath})) {
    const folder = key === 'scriptPath' ? 'scripts' : key === 'storyboardPath' ? 'storyboards' : key === 'promptPath' ? 'prompts' : 'captions';
    const name = String(path).split('/').at(-1);
    assert.equal(await exists(resolve(publicData, 'videos', folder, name)), true, `${row.videoId} missing ${key}`);
  }
  if (row.status === 'ready') {
    assert.equal(row.mediaFileExists, true);
    assert.equal(row.reviewStatus, 'approved');
    assert.equal(row.mediaValidated, true);
    const route = String(row.plannedOutputPath).replace(/^public\//, '');
    assert.equal(await exists(resolve(dist, route)), true, `${row.videoId} approved MP4 missing`);
  } else assert.notEqual(row.mediaFileExists, true, `${row.videoId} pending entry falsely claims media`);
}
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
assert.match(html, /\/assets\//, 'Built HTML does not reference hashed Vite assets.');
console.log(`REACT BUILD SMOKE: PASS (Vite manifest, app bundle, legacy page, 7 data files, ${videos.length} question/video mappings).`);
