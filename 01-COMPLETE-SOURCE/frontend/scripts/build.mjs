import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateProject } from './video-pipeline.mjs';

const frontend = resolve(fileURLToPath(new URL('..', import.meta.url)));
const projectRoot = resolve(frontend, '..');
const dist = resolve(frontend, 'dist');

const validation = await validateProject();
if (validation.errors.length) {
  throw new Error(`Build blocked by video/content validation:\n- ${validation.errors.join('\n- ')}`);
}

// Canonical video authoring sources live in /content/videos. Always refresh
// the static app mirror so scripts, captions, storyboards and prompts cannot drift.
const canonicalVideoRoot = resolve(projectRoot, 'content/videos');
const appVideoRoot = resolve(frontend, 'public/data/videos');
for (const folder of ['scripts', 'captions', 'storyboards', 'prompts']) {
  await rm(resolve(appVideoRoot, folder), { recursive: true, force: true });
  await mkdir(appVideoRoot, { recursive: true });
  await cp(resolve(canonicalVideoRoot, folder), resolve(appVideoRoot, folder), { recursive: true });
}
for (const file of ['video-manifest.json', 'expert-video-manifest.json']) {
  await cp(resolve(projectRoot, 'content', file), resolve(frontend, 'public/data', file));
}

// Rendered videos are imported into /public/videos and mirrored into the app.
const canonicalMediaRoot = resolve(projectRoot, 'public/videos');
const appMediaRoot = resolve(frontend, 'public/videos');
await rm(appMediaRoot, { recursive: true, force: true });
await mkdir(appMediaRoot, { recursive: true });
await cp(canonicalMediaRoot, appMediaRoot, { recursive: true });

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
for (const item of ['index.html', 'src', 'public', 'server.mjs']) {
  await cp(resolve(frontend, item), resolve(dist, item), { recursive: true });
}
await writeFile(resolve(dist, 'README.md'), '# CYBERAWARE 3D — Runnable Demo\n\nThis folder is the static runtime distribution. It contains the application, learning data, scripts/captions/storyboards/prompts and any approved media assets.\n\nRequirements: Node.js 22.23.5 or later. Start with `node server.mjs` and open `http://127.0.0.1:4173`.\n\nThe project source archive contains the tests and video authoring/import commands. This static demo does not submit jobs to an AI provider.\n');
const pkg = JSON.parse(await readFile(resolve(frontend, 'package.json'), 'utf8'));
await writeFile(resolve(dist, 'RUN.txt'), `CYBERAWARE 3D static distribution\nVersion: ${pkg.version}\nStart: node server.mjs\nOpen: http://localhost:4173\n`);
console.log(`Static distribution created at ${dist}`);
console.log('Canonical question-level video assets synchronized before packaging.');
console.log('Note: this is a copy-based static package, not a bundled/minified Vite build.');
