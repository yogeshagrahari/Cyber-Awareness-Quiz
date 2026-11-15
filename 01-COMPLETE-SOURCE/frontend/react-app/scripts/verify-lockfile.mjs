import { readFile } from 'node:fs/promises';
import { Buffer } from 'node:buffer';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(packageDir, 'package.json');
const lockfilePath = resolve(packageDir, 'package-lock.json');

const readJson = async (path, label) => {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') {
      throw new Error(`${label} is missing. Generate it with the manual React dependency-lock refresh workflow, review it, and commit it before running CI.`);
    }
    if (error instanceof SyntaxError) throw new Error(`${label} is not valid JSON: ${error.message}`);
    throw error;
  }
};

const [manifest, lockfile] = await Promise.all([
  readJson(manifestPath, 'frontend/react-app/package.json'),
  readJson(lockfilePath, 'frontend/react-app/package-lock.json')
]);

if (!Number.isInteger(lockfile.lockfileVersion) || lockfile.lockfileVersion < 3) {
  throw new Error(`Unsupported package-lock version: ${lockfile.lockfileVersion ?? 'missing'}; npm 12 lockfile version 3 or newer is required.`);
}

const root = lockfile.packages?.[''];
if (!root || typeof root !== 'object') {
  throw new Error('package-lock.json does not contain the root package entry at packages[""].');
}

for (const field of ['name', 'version']) {
  if (lockfile[field] !== manifest[field] || root[field] !== manifest[field]) {
    throw new Error(`Lockfile root ${field} mismatch: expected ${manifest[field]}, found ${root[field] ?? 'missing'}.`);
  }
}

for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies', 'engines']) {
  const expected = manifest[field] ?? {};
  const actual = root[field] ?? {};
  if (JSON.stringify(Object.entries(actual).sort(([a], [b]) => a.localeCompare(b))) !==
      JSON.stringify(Object.entries(expected).sort(([a], [b]) => a.localeCompare(b)))) {
    throw new Error(`Lockfile ${field} does not match package.json. Refresh and commit package-lock.json.`);
  }
}

const packageCount = Object.keys(lockfile.packages).filter(path => path.startsWith('node_modules/')).length;
if (packageCount === 0) throw new Error('package-lock.json contains no resolved dependency packages.');

for (const [location, descriptor] of Object.entries(lockfile.packages)) {
  if (!location.startsWith('node_modules/')) continue;
  if (descriptor?.link || descriptor?.inBundle) {
    throw new Error(`Resolved package ${location} must not be a workspace link or bundled dependency in this application lockfile.`);
  }
  if (typeof descriptor?.version !== 'string' || !descriptor.version) {
    throw new Error(`Resolved package ${location} is missing its exact package version.`);
  }
  if (typeof descriptor?.resolved !== 'string') {
    throw new Error(`Resolved package ${location} is missing its registry tarball URL.`);
  }
  let resolved;
  try { resolved = new URL(descriptor.resolved); } catch {
    throw new Error(`Resolved package ${location} has an invalid tarball URL.`);
  }
  if (resolved.protocol !== 'https:' || resolved.hostname !== 'registry.npmjs.org' ||
      resolved.username || resolved.password || resolved.search || resolved.hash) {
    throw new Error(`Resolved package ${location} uses an unapproved tarball origin or URL form: ${descriptor.resolved}`);
  }
  const integrityTokens = typeof descriptor.integrity === 'string' ? descriptor.integrity.trim().split(/\s+/) : [];
  const hasStrongIntegrity = integrityTokens.some(token => {
    const match = /^(sha512|sha384|sha256)-([A-Za-z0-9+/]+={0,2})$/.exec(token);
    if (!match) return false;
    const expectedBytes = match[1] === 'sha512' ? 64 : match[1] === 'sha384' ? 48 : 32;
    const digest = Buffer.from(match[2], 'base64');
    return digest.length === expectedBytes && digest.toString('base64') === match[2];
  });
  if (!hasStrongIntegrity) {
    throw new Error(`Resolved package ${location} is missing a valid SHA-512/SHA-384/SHA-256 Subresource Integrity digest.`);
  }
}

console.log(`LOCKFILE VALIDATION: PASS (lockfile v${lockfile.lockfileVersion}, ${packageCount} resolved packages, ${manifest.name}@${manifest.version})`);
