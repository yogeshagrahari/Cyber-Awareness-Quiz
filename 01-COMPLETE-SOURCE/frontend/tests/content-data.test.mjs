import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const readJson = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));

test('question, explanation, video and reference datasets have consistent IDs', async () => {
  const [questions, explanations, videos, references] = await Promise.all([
    readJson('../public/data/question-bank.json'),
    readJson('../public/data/explanations.json'),
    readJson('../public/data/video-manifest.json'),
    readJson('../public/data/references.json')
  ]);
  assert.equal(questions.questions.length, 115);
  assert.equal(explanations.explanations.length, questions.questions.length);
  assert.equal(videos.entries.length, questions.questions.length);
  assert.equal(references.length, 38);
  const qids = new Set(questions.questions.map(q => q.questionId));
  assert.equal(qids.size, 115);
  for (const q of questions.questions) {
    assert.ok(explanations.explanations.some(e => e.questionId === q.questionId && e.explanationId === q.explanationId));
    const video = videos.entries.find(v => v.questionId === q.questionId && v.videoId === q.videoId);
    assert.ok(video);
    if (video.status === 'deferred_by_owner_request') { assert.equal(video.mediaFileExists, false); assert.equal(video.scriptPath, null); assert.equal(video.captionsPath, null); }
    for (const ref of q.referenceIds) assert.ok(references.some(r => `[${r.id}]` === ref), `${q.questionId} unresolved reference ${ref}`);
  }
});

test('no pending media entry is marked as a generated ready video', async () => {
  const videos = await readJson('../public/data/video-manifest.json');
  assert.equal(videos.entries.filter(v => v.mediaFileExists === true).length, 0);
  assert.equal(videos.mediaGenerationClaim, false);
});

test('correct answer positions remain varied in the expanded core bank', async () => {
  const bank = await readJson('../public/data/question-bank.json');
  const counts = Object.fromEntries(['A', 'B', 'C', 'D'].map(id => [id, bank.questions.filter(q => q.correctOptionId === id).length]));
  assert.ok(Object.values(counts).every(count => count > 0));
  assert.equal(bank.questionCount, bank.questions.length);
});

test('every library topic contains at least three questions', async () => {
  const [core, expert] = await Promise.all([readJson('../public/data/question-bank.json'), readJson('../public/data/expert-challenge.json')]);
  const counts = new Map();
  for (const question of [...core.questions, ...expert.questions]) counts.set(question.category, (counts.get(question.category) || 0) + 1);
  assert.equal(counts.size, 44);
  for (const [topic, count] of counts) assert.ok(count >= 3, `${topic} has only ${count} question(s)`);
});


test('Expert Challenge bank has complete, independent question/explanation/video mappings', async () => {
  const [bank, explanations, videos, refs] = await Promise.all([
    readJson('../public/data/expert-challenge.json'),
    readJson('../public/data/expert-explanations.json'),
    readJson('../public/data/expert-video-manifest.json'),
    readJson('../public/data/references.json')
  ]);
  assert.equal(bank.questionCount, 18);
  assert.equal(bank.questions.length, 18);
  assert.equal(explanations.explanations.length, 18);
  assert.equal(videos.entries.length, 18);
  assert.equal(videos.mediaGenerationClaim, false);
  assert.equal(new Set(bank.questions.map(q => q.questionId)).size, 18);
  for (const q of bank.questions) {
    assert.equal(q.level, 'Expert Challenge');
    assert.equal(q.options.length, 4);
    assert.equal(Object.keys(q.optionExplanations).length, 4);
    assert.equal(Object.values(q.optionExplanations).filter(x => x.isCorrect).length, 1);
    assert.equal(q.correctAnswer, q.options.find(o => o.id === q.correctOptionId).text);
    assert.ok(explanations.explanations.some(e => e.questionId === q.questionId && e.explanationId === q.explanationId));
    const entry = videos.entries.find(v => v.questionId === q.questionId);
    assert.ok(entry && entry.videoId === q.videoId);
    assert.equal(entry.mediaFileExists, false);
    if (entry.status === 'deferred_by_owner_request') assert.equal(entry.scriptPath, null);
    for (const ref of q.referenceIds) assert.ok(refs.some(r => `[${r.id}]` === ref));
  }
});

test('HTML document has essential navigation, skip link, language and non-blocking loading semantics', async () => {
  const html = await (await import('node:fs/promises')).readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<html lang="en">/);
  assert.match(html, /class="skip-link" href="#main-content"/);
  assert.match(html, /<nav[^>]+aria-label="Primary"/);
  assert.match(html, /<main id="main-content"[^>]+tabindex="-1"/);
  assert.match(html, /id="app-view"[^>]+aria-busy="true"/);
  const css = await (await import('node:fs/promises')).readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
  const app = await (await import('node:fs/promises')).readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /role=\"progressbar\" aria-label=\"Quiz progress\"/);
  assert.match(app, /aria-valuetext=\"\$\{Math\.min\(total, data\.answered\)\} of \${total} first attempts\"/);
});


test('simulation navigation, native WebGL module and 2D fallback are wired into the app', async () => {
  const [html, app, scene, css] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/app.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/simulations.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles.css', import.meta.url), 'utf8')
  ]);
  assert.match(html, /data-view="simulations"/);
  assert.match(app, /simulations:\s*renderSimulations/);
  assert.match(app, /initSimulationScene/);
  assert.match(scene, /getContext\('webgl'/);
  assert.match(scene, /stopSimulationScene/);
  assert.match(css, /\.simulation-scene/);
  assert.match(css, /\.scene-2d-fallback/);
});

test('phishing inspection provides a known-good supplier domain and a separate link destination preview', async () => {
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /Known domain/);
  assert.match(app, /northstar-supplies\.example/);
  assert.match(app, /Destination shown by the message preview/);
  assert.match(app, /northstar-supplies\.verify-account\.example/);
  assert.match(app, /Sign in through the link below within 10 minutes/);
});


test('small-text contrast tokens meet WCAG AA against their documented dark surfaces', async () => {
  const css = await readFile(new URL('../src/styles.css', import.meta.url), 'utf8');
  const luminance = hex => {
    const channels = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
    const linear = channels.map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const ratio = (a, b) => {
    const values = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (values[0] + 0.05) / (values[1] + 0.05);
  };
  const auditedPairs = [
    { selector: '.sidebar-label', foreground: '#92a8bf', background: '#07111f' },
    { selector: '.app-footer{', foreground: '#8fa4ba', background: '#07111f' },
    { selector: '.breadcrumbs b', foreground: '#7b90a7', background: '#07111f' },
    { selector: '.topic-meta', foreground: '#92a8bf', background: '#0d1a2b' },
    { selector: '.scene-overlay small', foreground: '#91a8bf', background: '#07111f' }
  ];
  for (const pair of auditedPairs) {
    assert.ok(css.includes(pair.selector), `missing CSS selector ${pair.selector}`);
    assert.ok(css.includes(`color:${pair.foreground}`), `missing audited foreground ${pair.foreground}`);
    assert.ok(ratio(pair.foreground, pair.background) >= 4.5, `${pair.selector} has contrast below 4.5:1`);
  }
});

test('attached research paper is bundled, served as PDF and linked from the background section', async () => {
  const { stat } = await import('node:fs/promises');
  assert.ok((await stat(new URL('../../research/attachments/research-paper-preview.pdf', import.meta.url))).size > 100_000);
  const app = await readFile(new URL('../src/app.js', import.meta.url), 'utf8');
  assert.match(app, /Project background & attached research paper/);
  assert.match(app, /research-paper-preview\.pdf/);
});
