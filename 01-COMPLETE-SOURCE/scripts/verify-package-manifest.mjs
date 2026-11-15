import { readdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const EXCLUDED_DIRS = new Set([
  '.git',
  'node_modules',
  'release-artifacts',
  'test-results',
  'playwright-report',
  'dist-react',
  '__pycache__',
  '.pytest_cache',
  '.mypy_cache',
  '.ruff_cache',
  '.cache',
  'coverage',
  '.venv',
  'venv'
]);

const toPosix = value => value.split(sep).join('/');

async function listInventoryFiles(root, current = root, output = []) {
  const entries = await readdir(current, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const absolute = resolve(current, entry.name);
    const rel = toPosix(relative(root, absolute));
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) await listInventoryFiles(root, absolute, output);
      continue;
    }
    if (entry.isSymbolicLink()) {
      throw new Error(`Package manifest refuses symbolic links because their archived target may differ: ${rel}`);
    }
    if (!entry.isFile() || rel === 'package-manifest.json') continue;
    if (rel.split('/').some(part => part.startsWith('.env')) || entry.name === '.DS_Store') continue;
    output.push({ path: rel, absolute });
  }
  return output;
}

export async function verifyPackageManifest(rootDirectory) {
  const root = resolve(rootDirectory);
  const manifestPath = resolve(root, 'package-manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error('package-manifest.json is missing; generate it before release packaging.');
    throw new Error(`package-manifest.json is invalid: ${error.message}`);
  }

  if (manifest?.hashAlgorithm !== 'SHA-256' || manifest?.selfExcluded !== true || !Array.isArray(manifest.files)) {
    throw new Error('package-manifest.json has an unsupported or incomplete schema.');
  }
  if (manifest.fileCount !== manifest.files.length) {
    throw new Error(`package-manifest.json fileCount mismatch: ${manifest.fileCount} != ${manifest.files.length}.`);
  }

  const recorded = new Map();
  for (const entry of manifest.files) {
    if (!entry || typeof entry.path !== 'string' || !entry.path ||
        !Number.isSafeInteger(entry.sizeBytes) || entry.sizeBytes < 0 ||
        !/^[a-f0-9]{64}$/.test(entry.sha256)) {
      throw new Error('package-manifest.json contains a malformed file record.');
    }
    if (recorded.has(entry.path)) throw new Error(`package-manifest.json contains duplicate path: ${entry.path}`);
    recorded.set(entry.path, entry);
  }

  const currentFiles = await listInventoryFiles(root);
  const currentPaths = new Set(currentFiles.map(file => file.path));
  for (const file of currentFiles) {
    const expected = recorded.get(file.path);
    if (!expected) throw new Error(`Source file is missing from package-manifest.json: ${file.path}`);
    const bytes = await readFile(file.absolute);
    const sha256 = createHash('sha256').update(bytes).digest('hex');
    if (bytes.length !== expected.sizeBytes || sha256 !== expected.sha256) {
      throw new Error(`Source file differs from package-manifest.json: ${file.path}`);
    }
  }
  for (const path of recorded.keys()) {
    if (!currentPaths.has(path)) throw new Error(`Manifest entry has no corresponding source file: ${path}`);
  }

  return currentFiles.length;
}

if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const root = process.argv[2] || resolve(fileURLToPath(new URL('..', import.meta.url)));
  const count = await verifyPackageManifest(root);
  console.log(`PACKAGE MANIFEST VERIFICATION: PASS (${count} files match SHA-256 and size inventory)`);
}
