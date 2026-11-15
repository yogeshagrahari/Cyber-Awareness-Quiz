import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { mkdir, readFile, rm, symlink, unlink, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer as createNetServer } from 'node:net';

async function getFreePort() {
  const probe = createNetServer();
  await new Promise((resolve, reject) => probe.once('error', reject).listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise((resolve, reject) => probe.close(error => error ? reject(error) : resolve()));
  return port;
}
test('local server exposes content, defensive headers and byte-range media playback', async t => {
  const port = await getFreePort();
  const serverSource = await readFile(resolve('server.mjs'), 'utf8');
  assert.match(serverSource, /process\.env\.HOST \|\| '127\.0\.0\.1'/, 'local demo must default to loopback binding');
  const rangeFixture = resolve('public/videos/beginner/_range-test.mp4');
  const symlinkFixture = resolve('public/data/_outside-test');
  await mkdir(resolve('public/videos/beginner'), { recursive: true });
  await mkdir(resolve('public/data'), { recursive: true });
  await writeFile(rangeFixture, Buffer.from('0123456789abcdef'));
  try { await symlink('/etc/passwd', symlinkFixture); } catch { /* symlink tests may be unavailable on restricted hosts */ }
  t.after(async () => { await rm(rangeFixture, { force: true }); await unlink(symlinkFixture).catch(() => {}); });
  const child = spawn(process.execPath, ['server.mjs'], { env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' }, stdio: 'ignore' });
  t.after(() => child.kill('SIGTERM'));
  let response;
  for (let i = 0; i < 30; i++) {
    try { response = await fetch(`http://127.0.0.1:${port}/`); if (response.ok) break; }
    catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  assert.ok(response?.ok, 'server did not become ready');
  const health = await fetch(`http://127.0.0.1:${port}/healthz`);
  assert.equal(health.status, 200);
  assert.equal(await health.text(), 'ok\n');
  assert.equal(health.headers.get('cache-control'), 'no-store');
  const healthHead = await fetch(`http://127.0.0.1:${port}/healthz`, { method: 'HEAD' });
  assert.equal(healthHead.status, 200);
  assert.equal((await healthHead.arrayBuffer()).byteLength, 0);
  const html = await response.text();
  assert.match(html, /CYBERAWARE 3D/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.match(response.headers.get('content-security-policy') || '', /default-src 'self'/);
  assert.equal(response.headers.get('cross-origin-resource-policy'), 'same-origin');
  assert.equal(response.headers.get('x-permitted-cross-domain-policies'), 'none');
  const simulationModule = await fetch(`http://127.0.0.1:${port}/src/simulations.js`);
  assert.equal(simulationModule.status, 200);
  assert.match(await simulationModule.text(), /PHISHING_INDICATORS/);
  const styles = await fetch(`http://127.0.0.1:${port}/src/styles.css`);
  assert.equal(styles.status, 200);
  const data = await fetch(`http://127.0.0.1:${port}/data/question-bank.json`);
  assert.equal(data.status, 200);
  assert.equal((await data.json()).questions.length, 115);
  const paper = await fetch(`http://127.0.0.1:${port}/data/research-paper-preview.pdf`);
  assert.equal(paper.status, 200);
  assert.match(paper.headers.get('content-type') || '', /application\/pdf/);
  assert.equal((await paper.arrayBuffer()).byteLength > 100_000, true);
  const script = await fetch(`http://127.0.0.1:${port}/data/videos/scripts/VIDEO-PHISH-B01.md`);
  assert.equal(script.status, 200);
  assert.match(await script.text(), /VIDEO-PHISH-B01|urgent account warning/i);
  const expert = await fetch(`http://127.0.0.1:${port}/data/expert-challenge.json`);
  assert.equal(expert.status, 200);
  assert.equal((await expert.json()).questions.length, 18);
  const expertScript = await fetch(`http://127.0.0.1:${port}/data/videos/scripts/VIDEO-IR-E01.md`);
  assert.equal(expertScript.status, 200);
  assert.match(await expertScript.text(), /Containment Under Uncertainty/);
  const expertCaptions = await fetch(`http://127.0.0.1:${port}/data/videos/captions/VIDEO-IR-E01.vtt`);
  assert.equal(expertCaptions.status, 200);
  assert.match(await expertCaptions.text(), /^WEBVTT/m);
  const expertStoryboard = await fetch(`http://127.0.0.1:${port}/data/videos/storyboards/VIDEO-IR-E01.json`);
  assert.equal(expertStoryboard.status, 200);
  assert.equal(Array.isArray((await expertStoryboard.json()).scenes), true);
  const expertPrompt = await fetch(`http://127.0.0.1:${port}/data/videos/prompts/VIDEO-IR-E01.txt`);
  assert.equal(expertPrompt.status, 200);
  const rangeResponse = await fetch(`http://127.0.0.1:${port}/videos/beginner/_range-test.mp4`, { headers: { Range: 'bytes=4-10' } });
  assert.equal(rangeResponse.status, 206);
  assert.equal(rangeResponse.headers.get('content-range'), 'bytes 4-10/16');
  assert.equal(rangeResponse.headers.get('accept-ranges'), 'bytes');
  assert.equal(Buffer.from(await rangeResponse.arrayBuffer()).toString(), '456789a');
  const headRange = await fetch(`http://127.0.0.1:${port}/videos/beginner/_range-test.mp4`, { method: 'HEAD', headers: { Range: 'bytes=0-3' } });
  assert.equal(headRange.status, 206);
  assert.equal(headRange.headers.get('content-range'), 'bytes 0-3/16');
  assert.equal((await headRange.arrayBuffer()).byteLength, 0);
  const invalidRange = await fetch(`http://127.0.0.1:${port}/videos/beginner/_range-test.mp4`, { headers: { Range: 'bytes=40-50' } });
  assert.equal(invalidRange.status, 416);
  assert.equal(invalidRange.headers.get('content-range'), 'bytes */16');
  const method = await fetch(`http://127.0.0.1:${port}/data/expert-challenge.json`, { method: 'POST' });
  assert.equal(method.status, 405);
  assert.equal(method.headers.get('allow'), 'GET, HEAD');
  assert.equal(method.headers.get('x-content-type-options'), 'nosniff');
  const traversal = await fetch(`http://127.0.0.1:${port}/%2e%2e/%2e%2e/etc/passwd`);
  assert.notEqual(traversal.status, 200);
  const nullByte = await fetch(`http://127.0.0.1:${port}/data/%00.json`);
  assert.equal(nullByte.status, 400);
  const outsideSymlink = await fetch(`http://127.0.0.1:${port}/data/_outside-test`);
  if (outsideSymlink.status !== 404 && outsideSymlink.status !== 400) assert.fail('server must not serve a symlink outside the static root');
});


test('server rejects invalid TCP ports before listening', () => {
  const result = spawnSync(process.execPath, ['server.mjs'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '65536' },
    encoding: 'utf8',
    timeout: 5000
  });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /PORT must be an integer from 1 to 65535/);
  const invalidHost = spawnSync(process.execPath, ['server.mjs'], {
    cwd: process.cwd(),
    env: { ...process.env, PORT: '4388', HOST: 'bad host name' },
    encoding: 'utf8',
    timeout: 5000
  });
  assert.notEqual(invalidHost.status, 0);
  assert.match(invalidHost.stderr, /HOST must be a valid hostname or IP address/);
});

test('server drains active connections and exits cleanly on SIGTERM', async t => {
  const shutdownPort = await getFreePort();
  const child = spawn(process.execPath, ['server.mjs'], {
    env: { ...process.env, PORT: String(shutdownPort), HOST: '127.0.0.1' },
    stdio: 'ignore'
  });
  t.after(() => { if (child.exitCode === null && child.signalCode === null) child.kill('SIGKILL'); });
  let ready = false;
  for (let i = 0; i < 40; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${shutdownPort}/healthz`);
      if (response.ok) { ready = true; break; }
    } catch { await new Promise(resolve => setTimeout(resolve, 100)); }
  }
  assert.equal(ready, true, 'server did not become ready for shutdown test');
  child.kill('SIGTERM');
  const exit = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('server did not exit after SIGTERM')), 5000);
    child.once('exit', (code, signal) => { clearTimeout(timer); resolve({ code, signal }); });
  });
  assert.deepEqual(exit, { code: 0, signal: null });
});
