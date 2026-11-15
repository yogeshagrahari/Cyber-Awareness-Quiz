import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { verifyPackageManifest } from '../../scripts/verify-package-manifest.mjs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const [workflow, refreshWorkflow, packageScript] = await Promise.all([
  readFile(resolve(root, '.github/workflows/cyberaware-ci.yml'), 'utf8'),
  readFile(resolve(root, '.github/workflows/react-frontend-ci.yml'), 'utf8'),
  readFile(resolve(root, 'scripts/package-release.mjs'), 'utf8')
]);

const section = (source, start, end) => {
  const from = source.indexOf(start);
  assert.notEqual(from, -1, `Missing workflow section: ${start}`);
  const to = end ? source.indexOf(end, from + start.length) : source.length;
  return source.slice(from, to === -1 ? source.length : to);
};

test('release archive output directory matches the GitHub artifact upload path', () => {
  const releaseJob = section(workflow, '  package-release:', null);
  assert.match(releaseJob, /working-directory:\s*frontend\s*\n\s*run:\s*npm run package:release/);
  assert.match(releaseJob, /path:\s*release-artifacts\/\*/);
  assert.match(packageScript, /resolve\(root, 'release-artifacts'\)/);
});

test('release packaging is downstream of both stable validation gates', () => {
  const legacyGate = section(workflow, '  legacy-gate:', '  react-gate:');
  const reactGate = section(workflow, '  react-gate:', '  package-release:');
  const releaseJob = section(workflow, '  package-release:', null);
  assert.match(legacyGate, /name:\s*Legacy validation gate/);
  assert.match(reactGate, /name:\s*React, browser and accessibility gate/);
  assert.match(releaseJob, /needs:\s*\[legacy-gate, react-gate\]/);
  assert.match(releaseJob, /github\.ref_name == 'main'/);
  assert.match(releaseJob, /github\.ref_name == 'master'/);
});

test('React matrix requires the reviewed lockfile and completes build, browser and axe acceptance before artifact upload', () => {
  const reactJob = section(workflow, '  react-build-browser-and-test:', '  legacy-gate:');
  const verifyIndex = reactJob.indexOf('npm run verify:lockfile');
  const installIndex = reactJob.indexOf('npm ci --no-audit --no-fund');
  const auditIndex = reactJob.indexOf('npm audit --audit-level=high');
  const buildIndex = reactJob.indexOf('npm run build');
  const e2eIndex = reactJob.indexOf('npm run test:e2e');
  const uploadIndex = reactJob.indexOf('name: cyberaware-react-dist-node-26');
  assert.ok(verifyIndex >= 0 && verifyIndex < installIndex && installIndex < auditIndex);
  assert.ok(auditIndex < buildIndex && buildIndex < e2eIndex && e2eIndex < uploadIndex);
  assert.match(reactJob, /npm run typecheck/);
  assert.match(reactJob, /npm run smoke:build/);
  assert.match(reactJob, /npm sbom --sbom-format=cyclonedx/);
  assert.match(reactJob, /npx playwright install --with-deps chromium firefox webkit/);
  assert.match(workflow, /node-version: \[\s*'22\.23\.5', '24\.22\.3', '26\.13\.1'\s*\]/);
});

test('dependency lock refresh is manual-only and cannot publish release archives', () => {
  const trigger = refreshWorkflow.slice(0, refreshWorkflow.indexOf('jobs:'));
  assert.match(trigger, /^on:\s*\n\s+workflow_dispatch:/m);
  assert.match(refreshWorkflow, /npm install --package-lock-only --ignore-scripts --no-audit --no-fund/);
  assert.match(refreshWorkflow, /npm audit --json/);
  assert.doesNotMatch(refreshWorkflow, /package:release|upload.*release/i);
});


test('release package fails closed when the source inventory is stale or incomplete', async () => {
  const fixture = await mkdtemp(resolve(tmpdir(), 'cyberaware-manifest-'));
  try {
    await mkdir(resolve(fixture, 'src'));
    const source = 'verified release input\n';
    await writeFile(resolve(fixture, 'src/app.txt'), source);
    await mkdir(resolve(fixture, '__pycache__'), { recursive: true });
    await writeFile(resolve(fixture, '__pycache__/ignored.pyc'), 'generated cache');
    await mkdir(resolve(fixture, '.pytest_cache'), { recursive: true });
    await writeFile(resolve(fixture, '.pytest_cache/lastfailed'), 'generated cache');
    const manifest = {
      manifestVersion: '1.3.0',
      hashAlgorithm: 'SHA-256',
      selfExcluded: true,
      fileCount: 1,
      files: [{
        path: 'src/app.txt',
        sizeBytes: Buffer.byteLength(source),
        sha256: createHash('sha256').update(source).digest('hex')
      }]
    };
    await writeFile(resolve(fixture, 'package-manifest.json'), JSON.stringify(manifest));
    assert.equal(await verifyPackageManifest(fixture), 1, 'generated Python/test caches must be outside the source inventory');

    await writeFile(resolve(fixture, 'src/app.txt'), 'modified after manifest generation\n');
    await assert.rejects(() => verifyPackageManifest(fixture), /differs from package-manifest/);

    await writeFile(resolve(fixture, 'src/app.txt'), source);
    await writeFile(resolve(fixture, 'src/untracked.txt'), 'not inventoried');
    await assert.rejects(() => verifyPackageManifest(fixture), /missing from package-manifest/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test('application demo package only references existing required input paths', async () => {
  assert.match(packageScript, /Required application-demo input is missing/);
  assert.match(packageScript, /Full-source archive is missing an inventoried file/);
  assert.match(packageScript, /contains excluded or sensitive path/);
  assert.doesNotMatch(packageScript, /'frontend\/legacy\.html'/);
  for (const rel of [
    'frontend/server.mjs', 'frontend/index.html', 'frontend/src', 'frontend/public',
    'frontend/dist', 'deploy/cyberaware3d.service', 'deploy/nginx-react.conf'
  ]) {
    const { access } = await import('node:fs/promises');
    await access(resolve(root, rel));
  }
});


test('release packaging rebuilds and smokes the ignored legacy distribution in its clean workspace', () => {
  const releaseJob = section(workflow, '  package-release:', null);
  const buildIndex = releaseJob.indexOf('Build the static legacy distribution in the packaging workspace');
  const smokeIndex = releaseJob.indexOf('Smoke-test the static distribution in the packaging workspace');
  const manifestIndex = releaseJob.indexOf('Generate source integrity manifest');
  const packageIndex = releaseJob.indexOf('Build full-source, legacy-demo and React app release archives');
  assert.ok(buildIndex >= 0 && buildIndex < smokeIndex && smokeIndex < manifestIndex && manifestIndex < packageIndex);
  assert.match(releaseJob, /npm run build/);
  assert.match(releaseJob, /npm run smoke:packaged/);
});

test('release CI smoke-tests both extracted runnable application archives before upload', () => {
  const releaseJob = section(workflow, '  package-release:', null);
  const packageIndex = releaseJob.indexOf('Build full-source, legacy-demo and React app release archives');
  const extractedSmokeIndex = releaseJob.indexOf('Smoke-test the extracted application-demo release archive');
  const reactSmokeIndex = releaseJob.indexOf('Smoke-test the extracted React application release archive');
  const uploadIndex = releaseJob.indexOf('Upload release archives and SHA-256 checksums');
  assert.ok(packageIndex >= 0 && packageIndex < extractedSmokeIndex && extractedSmokeIndex < reactSmokeIndex && reactSmokeIndex < uploadIndex);
  assert.match(releaseJob, /CYBERAWARE_DIST_DIR=/);
  assert.match(releaseJob, /CYBERAWARE_REACT_DIST_DIR=/);
  assert.match(releaseJob, /unzip -q/);
});

test('release archives contain exactly the manifest inventory and the manifest file, then verify extracted hashes', () => {
  assert.match(packageScript, /contains duplicate file entries/);
  assert.match(packageScript, /contains a file not covered by the manifest/);
  assert.match(packageScript, /verifyPackageManifest\(extractedSourceRoot\)/);
  assert.match(packageScript, /__pycache__/);
});

test('release packaging downloads and validates the exact React dependency SBOM before inventory generation', () => {
  const releaseJob = section(workflow, '  package-release:', null);
  const downloadIndex = releaseJob.indexOf('name: cyberaware-react-dependency-sbom-node-26');
  const validateIndex = releaseJob.indexOf('Verify the React dependency SBOM before release packaging');
  const manifestIndex = releaseJob.indexOf('Generate source integrity manifest');
  assert.ok(downloadIndex >= 0 && downloadIndex < validateIndex && validateIndex < manifestIndex);
  assert.match(releaseJob, /path:\s*evidence/);
  assert.match(releaseJob, /cyberaware3d-react-dependency-sbom\.cdx\.json/);
});


test('release version metadata and visible interface labels stay aligned', async () => {
  const legacyPackage = JSON.parse(await readFile(resolve(root, 'frontend/package.json'), 'utf8'));
  const reactPackage = JSON.parse(await readFile(resolve(root, 'frontend/react-app/package.json'), 'utf8'));
  const [legacyIndex, legacyFallback, reactApp] = await Promise.all([
    readFile(resolve(root, 'frontend/index.html'), 'utf8'),
    readFile(resolve(root, 'frontend/public/legacy.html'), 'utf8'),
    readFile(resolve(root, 'frontend/react-app/src/App.tsx'), 'utf8')
  ]);
  assert.equal(legacyPackage.version, reactPackage.version);
  assert.ok(legacyIndex.includes(`APPLICATION <b>v${legacyPackage.version}</b>`));
  assert.ok(legacyFallback.includes(`APPLICATION <b>v${legacyPackage.version}</b>`));
  assert.ok(reactApp.includes(`REACT MIGRATION <b>${legacyPackage.version}</b>`));
});

test('legacy static Nginx configuration and smoke test are wired into package and CI', async () => {
  const [config, smoke, securityHeaders] = await Promise.all([
    readFile(resolve(root, 'deploy/nginx-legacy-static.conf'), 'utf8'),
    readFile(resolve(root, 'tests/deploy/nginx-legacy-static-smoke.sh'), 'utf8'),
    readFile(resolve(root, 'deploy/snippets/cyberaware-security-headers.conf'), 'utf8')
  ]);
  assert.match(workflow, /tests\/deploy\/nginx-legacy-static-smoke\.sh/);
  assert.match(packageScript, /'deploy\/nginx-legacy-static\.conf'/);
  assert.match(packageScript, /'tests\/deploy\/nginx-legacy-static-smoke\.sh'/);
  assert.match(config, /location \^~ \/data\//);
  assert.match(config, /location \^~ \/videos\//);
  assert.match(config, /cyberaware-security-headers\.conf/);
  assert.match(securityHeaders, /frame-ancestors 'none'/);
  assert.match(smoke, /LEGACY STATIC NGINX SMOKE: PASS/);
});
