import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { readFile } from 'node:fs/promises';

const here = dirname(fileURLToPath(import.meta.url));
const frontend = resolve(here, '..');
const dist = resolve(frontend, 'dist');
const port = Number(process.env.SMOKE_PORT || 47183);
const child = spawn(process.execPath, ['server.mjs'], { cwd: dist, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
const base = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try { const response = await fetch(`${base}/`); if (response.ok) { ready = true; break; } }
    catch { /* server is still starting */ }
    await delay(100);
  }
  assert.equal(ready, true, 'built distribution did not start');
  const routes = [
    '/', '/src/app.js', '/src/simulations.js', '/src/styles.css',
    '/data/question-bank.json', '/data/explanations.json', '/data/references.json',
    '/data/expert-challenge.json', '/data/expert-explanations.json',
    '/data/video-manifest.json', '/data/expert-video-manifest.json', '/data/research-paper-preview.pdf'
  ];
  for (const route of routes) {
    const response = await fetch(`${base}${route}`);
    assert.equal(response.status, 200, `${route} should be available in the built distribution`);
  }
  const [core, expert] = await Promise.all([
    readFile(resolve(dist, 'public/data/video-manifest.json'), 'utf8').then(JSON.parse),
    readFile(resolve(dist, 'public/data/expert-video-manifest.json'), 'utf8').then(JSON.parse)
  ]);
  const entries = [...core.entries, ...expert.entries];
  assert.equal(entries.length, 133);
  const scriptEntries = entries.filter(entry => entry.scriptPath);
  const deferredEntries = entries.filter(entry => entry.status === 'deferred_by_owner_request');
  assert.equal(scriptEntries.length, 51);
  assert.equal(deferredEntries.length, 82);
  const seen = new Set();
  for (const entry of entries) {
    assert.ok(!seen.has(entry.videoId), `duplicate videoId: ${entry.videoId}`);
    seen.add(entry.videoId);
    if (entry.status === 'deferred_by_owner_request') {
      assert.equal(entry.mediaFileExists, false);
      assert.equal(entry.scriptPath, null);
      assert.equal(entry.captionsPath, null);
      continue;
    }
    for (const [key, path] of Object.entries({ scriptPath: entry.scriptPath, storyboardPath: entry.storyboardPath, promptPath: entry.promptPath, captionsPath: entry.captionsPath })) {
      const route = `/${path.replace(/^content\//, 'data/')}`;
      const response = await fetch(`${base}${route}`);
      assert.equal(response.status, 200, `${entry.videoId} ${key} route missing: ${route}`);
      if (key === 'captionsPath') assert.match(await response.text(), /^WEBVTT/m, `${entry.videoId} caption route is not WebVTT`);
      else if (key === 'storyboardPath') assert.equal((await response.json()).videoId, entry.videoId, `${entry.videoId} storyboard identity mismatch`);
      else if (key === 'scriptPath') assert.match(await response.text(), /Narration transcript/, `${entry.videoId} script has no narration transcript`);
      else assert.ok((await response.text()).trim().length > 0, `${entry.videoId} prompt is empty`);
      routes.push(route);
    }
    if (entry.status === 'ready') {
      assert.equal(entry.mediaFileExists, true, `${entry.videoId} ready media flag mismatch`);
      const mediaRoute = `/${entry.plannedOutputPath.replace(/^public\//, '')}`;
      const media = await fetch(`${base}${mediaRoute}`, { method: 'HEAD' });
      assert.equal(media.status, 200, `${entry.videoId} MP4 missing from distribution`);
      assert.equal(media.headers.get('content-type'), 'video/mp4');
      assert.equal(media.headers.get('accept-ranges'), 'bytes');
      routes.push(mediaRoute);
    } else {
      assert.notEqual(entry.mediaFileExists, true, `${entry.videoId} pending asset must not be flagged as generated and ready`);
    }
  }
  const paper = await fetch(`${base}/data/research-paper-preview.pdf`);
  assert.equal(paper.status, 200);
  assert.equal(paper.headers.get('content-type'), 'application/pdf');
  assert.ok((await paper.arrayBuffer()).byteLength > 100000, 'attached research paper should be served intact');
  const head = await fetch(`${base}/`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(head.headers.get('x-content-type-options'), 'nosniff');
  assert.match(head.headers.get('content-security-policy') || '', /default-src 'self'/);
  const post = await fetch(`${base}/`, { method: 'POST' });
  assert.equal(post.status, 405);
  console.log(`DIST SMOKE: PASS (${routes.length} routes, 133 question mappings, 51 existing script/storyboard/prompt/caption records, 82 owner-deferred media records, attached PDF, ready-media HEAD checks, HEAD, security headers, method rejection)`);
} finally {
  child.kill('SIGTERM');
}
