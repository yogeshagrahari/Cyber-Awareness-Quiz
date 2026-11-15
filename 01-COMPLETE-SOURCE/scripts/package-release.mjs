import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile, rm, access, readdir, stat, mkdtemp } from 'node:fs/promises';
import { basename, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { verifyPackageManifest } from './verify-package-manifest.mjs';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const version = JSON.parse(await readFile(resolve(root, 'frontend/package.json'), 'utf8')).version;
const reactVersion = JSON.parse(await readFile(resolve(root, 'frontend/react-app/package.json'), 'utf8')).version;
if (reactVersion !== version) throw new Error(`Frontend and React package versions differ: ${version} != ${reactVersion}`);
if (!/^0\.\d+\.\d+-rc\.\d+$/.test(version)) throw new Error(`Unexpected release version: ${version}`);
const args = process.argv.slice(2);
const sourceOnly = args.includes('--source-only');
const outputArg = args.find(arg => !arg.startsWith('--'));
const output = resolve(outputArg || resolve(root, 'release-artifacts'));
await mkdir(output, { recursive: true });
const manifestCount = await verifyPackageManifest(root);

const fullName = `CYBERAWARE-3D-v${version}.zip`;
const appName = `CYBERAWARE-3D-App-Demo-v${version}.zip`;
const reactName = `CYBERAWARE-3D-React-App-v${version}.zip`;
const fullZip = resolve(output, fullName);
const appZip = resolve(output, appName);
const reactZip = resolve(output, reactName);
const reactDist = resolve(root, 'frontend/dist-react');
let reactFiles = [];
if (!sourceOnly) {
  try { await access(resolve(reactDist, 'index.html')); reactFiles = await readdir(reactDist); } catch { /* the required Vite build artifact is absent */ }
  let assetFiles = [];
  try {
    const assetsPath = resolve(reactDist, 'assets');
    if (!(await stat(assetsPath)).isDirectory()) throw new Error('assets is not a directory');
    assetFiles = await readdir(assetsPath);
  } catch { /* handled by the fail-closed check below */ }
  if (!reactFiles.includes('index.html') || !reactFiles.includes('assets') || assetFiles.length === 0) {
    throw new Error('React production distribution is missing or incomplete; release packaging requires the successful React build artifact. Use --source-only only for an explicitly partial local handoff.');
  }
}

for (const file of [fullZip, appZip, reactZip]) await rm(file, { force: true });

const excludes = [
  '.git/*', '*/.git/*',
  'release-artifacts/*',
  'frontend/dist-react/*', 'frontend/dist-react/**/*',
  'dist-react/*', '*/dist-react/*', '*/dist-react/**/*',
  '*/node_modules/*', 'node_modules/*',
  '*/test-results/*', 'test-results/*',
  '*/playwright-report/*', 'playwright-report/*',
  '*/__pycache__/*', '__pycache__/*',
  '*/.pytest_cache/*', '.pytest_cache/*',
  '*/.mypy_cache/*', '.mypy_cache/*',
  '*/.ruff_cache/*', '.ruff_cache/*',
  '*/.cache/*', '.cache/*',
  '*/coverage/*', 'coverage/*',
  '*/.venv/*', '.venv/*', '*/venv/*', 'venv/*',
  '*/.env*', '.env*',
  '.DS_Store', '*/.DS_Store'
];
execFileSync('zip', ['-qr', fullZip, '.', '-x', ...excludes], { cwd: root, stdio: 'inherit' });

const appPaths = [
  'README.md',
  'frontend/server.mjs', 'frontend/index.html',
  'frontend/src', 'frontend/public', 'frontend/dist', 'frontend/package.json',
  'deploy/cyberaware3d.service', 'deploy/nginx-legacy-proxy.conf',
  'deploy/nginx-legacy-static.conf', 'deploy/nginx-react.conf',
  'deploy/backup-cyberaware.sh', 'deploy/snippets',
  'tests/deploy/backup-smoke.sh', 'tests/deploy/nginx-live-smoke.sh',
  'tests/deploy/nginx-legacy-static-smoke.sh',
  'docs/phase-11-deployment-hardening.md',
  'docs/data-portability-and-recovery.md',
  'docs/phase-13-release-report.md',
  'docs/phase-13-release-checklist.md',
  'docs/phase-14-release-report.md',
  'docs/phase-14-release-checklist.md',
  'docs/phase-15-release-report.md',
  'docs/phase-15-release-checklist.md',
  'docs/phase-16-release-report.md',
  'docs/phase-16-release-checklist.md',
  'docs/phase-17-release-report.md',
  'docs/phase-17-release-checklist.md',
  'docs/phase-18-release-report.md',
  'docs/phase-18-release-checklist.md',
  'docs/phase-19-release-report.md',
  'docs/phase-19-release-checklist.md',
  'docs/phase-20-release-report.md',
  'docs/phase-20-release-checklist.md',
  'docs/phase-21-release-report.md',
  'docs/phase-21-release-checklist.md',
  'docs/phase-22-finalization-report.md',
  'docs/phase-22-finalization-checklist.md',
  'docs/phase-23-library-and-background-update.md',
  'docs/topic-library-coverage.md',
  'docs/master-prompt-acceptance-matrix.md',
  'docs/local-operation-and-security.md',
  'docs/security-analysis.md',
  'docs/user-guide.md'
];
for (const rel of appPaths) {
  try { await access(resolve(root, rel)); }
  catch { throw new Error(`Required application-demo input is missing: ${rel}`); }
}
execFileSync('zip', ['-qr', appZip, ...appPaths], { cwd: root, stdio: 'inherit' });

let releaseFiles = [fullZip, appZip];
if (!sourceOnly) {
  execFileSync('zip', ['-qr', reactZip, '.'], { cwd: reactDist, stdio: 'inherit' });
  releaseFiles.push(reactZip);
}

for (const file of releaseFiles) {
  execFileSync('unzip', ['-tqq', file]);
}

const manifest = JSON.parse(await readFile(resolve(root, 'package-manifest.json'), 'utf8'));
const archiveEntries = execFileSync('unzip', ['-Z1', fullZip], { encoding: 'utf8' })
  .split(/\r?\n/).map(path => path.trim()).filter(Boolean);
const packagedFiles = archiveEntries.filter(path => !path.endsWith('/'));
const uniqueArchiveFiles = new Set(packagedFiles);
if (uniqueArchiveFiles.size !== packagedFiles.length) throw new Error('Full-source archive contains duplicate file entries.');
const expectedArchiveFiles = new Set([...manifest.files.map(entry => entry.path), 'package-manifest.json']);
for (const path of expectedArchiveFiles) {
  if (!uniqueArchiveFiles.has(path)) throw new Error(`Full-source archive is missing an inventoried file: ${path}`);
}
for (const archivePath of archiveEntries) {
  const isDirectory = archivePath.endsWith('/');
  const path = archivePath.replace(/\/$/, '');
  if (!path) continue;
  if (!isDirectory && !expectedArchiveFiles.has(path)) throw new Error(`Full-source archive contains a file not covered by the manifest: ${path}`);
  const parts = path.split('/');
  if (parts.includes('..')) throw new Error(`Full-source archive contains a path traversal entry: ${path}`);
  if (parts.some(part => ['.git', 'node_modules', 'release-artifacts', 'test-results', 'playwright-report', 'dist-react', '__pycache__', '.pytest_cache', '.mypy_cache', '.ruff_cache', '.cache', 'coverage', '.venv', 'venv'].includes(part) || part.startsWith('.env')) || parts.at(-1) === '.DS_Store') {
    throw new Error(`Full-source archive contains excluded or sensitive path: ${path}`);
  }
}
const extractedSourceRoot = await mkdtemp(resolve(tmpdir(), 'cyberaware-release-source-'));
try {
  execFileSync('unzip', ['-q', fullZip, '-d', extractedSourceRoot]);
  const extractedFileCount = await verifyPackageManifest(extractedSourceRoot);
  if (extractedFileCount !== manifestCount) throw new Error(`Extracted source archive file-count mismatch: ${extractedFileCount} != ${manifestCount}`);
} finally {
  await rm(extractedSourceRoot, { recursive: true, force: true });
}
const sums = [];
for (const file of releaseFiles) {
  const bytes = await readFile(file);
  sums.push(`${createHash('sha256').update(bytes).digest('hex')}  ${basename(file)}`);
}
await writeFile(resolve(output, `CYBERAWARE-3D-v${version}-SHA256SUMS.txt`), `${sums.join('\n')}\n`);
const packageList = sourceOnly ? `${fullName}, ${appName}` : `${fullName}, ${appName}, ${reactName}`;
console.log(`RELEASE PACKAGING: PASS (${packageList}, ${manifestCount} manifest-verified source files included in archive, excluded-path scan, checksums${sourceOnly ? '; SOURCE-ONLY / NOT PRODUCTION' : ''})`);
