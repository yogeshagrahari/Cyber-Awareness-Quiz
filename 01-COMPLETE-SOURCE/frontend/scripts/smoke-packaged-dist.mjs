import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { access } from 'node:fs/promises';

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(process.env.CYBERAWARE_DIST_DIR || resolve(here, '../dist'));
await access(resolve(dist, 'server.mjs'));
await access(resolve(dist, 'index.html'));

async function freePort() {
  const server = createServer();
  await new Promise((ok, fail) => server.once('error', fail).listen(0, '127.0.0.1', ok));
  const port = server.address().port;
  await new Promise((ok, fail) => server.close(error => error ? fail(error) : ok()));
  return port;
}

const port = await freePort();
const child = spawn(process.execPath, ['server.mjs'], {
  cwd: dist,
  env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' },
  stdio: ['ignore', 'pipe', 'pipe']
});
let logs = '';
child.stdout.setEncoding('utf8').on('data', chunk => { logs += chunk; });
child.stderr.setEncoding('utf8').on('data', chunk => { logs += chunk; });
const base = `http://127.0.0.1:${port}`;
let ready = false;
try {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) throw new Error(`Packaged server exited early: ${logs}`);
    try {
      const response = await fetch(`${base}/healthz`, { signal: AbortSignal.timeout(1000) });
      if (response.status === 200 && (await response.text()) === 'ok\n') { ready = true; break; }
    } catch {}
    await delay(100);
  }
  assert.equal(ready, true, `Packaged server did not become ready. ${logs}`);

  const page = await fetch(`${base}/`);
  assert.equal(page.status, 200);
  assert.match(await page.text(), /CYBERAWARE 3D/);
  assert.equal(page.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(page.headers.get('x-frame-options'), 'DENY');

  const questionBank = await fetch(`${base}/data/question-bank.json`);
  assert.equal(questionBank.status, 200);
  assert.equal((await questionBank.json()).questions.length, 115);

  const expertBank = await fetch(`${base}/data/expert-challenge.json`);
  assert.equal(expertBank.status, 200);
  assert.equal((await expertBank.json()).questions.length, 18);

  const researchPaper = await fetch(`${base}/data/research-paper-preview.pdf`);
  assert.equal(researchPaper.status, 200);
  assert.equal(researchPaper.headers.get('content-type'), 'application/pdf');
  assert.ok((await researchPaper.arrayBuffer()).byteLength > 100000);

  const head = await fetch(`${base}/`, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal((await head.arrayBuffer()).byteLength, 0);

  const missing = await fetch(`${base}/not-a-real-route`);
  assert.equal(missing.status, 404);

  const post = await fetch(`${base}/`, { method: 'POST' });
  assert.equal(post.status, 405);
  assert.equal(post.headers.get('allow'), 'GET, HEAD');

  const healthHead = await fetch(`${base}/healthz`, { method: 'HEAD' });
  assert.equal(healthHead.status, 200);
  assert.equal(healthHead.headers.get('cache-control'), 'no-store');
  assert.equal((await healthHead.arrayBuffer()).byteLength, 0);
} finally {
  if (child.exitCode === null) {
    child.kill('SIGTERM');
    await Promise.race([
      new Promise(resolve => child.once('exit', resolve)),
      delay(5000).then(() => { child.kill('SIGKILL'); throw new Error('Packaged server did not stop after SIGTERM.'); })
    ]);
  }
}
assert.equal(child.exitCode, 0, `Packaged server exited abnormally. ${logs}`);
console.log('PACKAGED DIST SMOKE: PASS (health, root, 115 core + 18 expert questions, attached PDF, HEAD, 404, method guard, security headers, graceful shutdown)');
