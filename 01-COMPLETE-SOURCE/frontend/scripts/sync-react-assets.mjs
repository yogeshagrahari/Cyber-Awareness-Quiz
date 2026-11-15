import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateProject } from './video-pipeline.mjs';

const frontend = resolve(fileURLToPath(new URL('..', import.meta.url)));
const projectRoot = resolve(frontend, '..');
const publicRoot = resolve(frontend, 'public');
const dataRoot = resolve(publicRoot, 'data');

const validation = await validateProject();
if (validation.errors.length) throw new Error(`React asset sync blocked by content/video validation:\n- ${validation.errors.join('\n- ')}`);
await mkdir(dataRoot, { recursive: true });

const mappings = [
  ['content/questions/question-bank.json', 'frontend/public/data/question-bank.json'],
  ['content/questions/question-schema.json', 'frontend/public/data/question-schema.json'],
  ['research/attachments/research-paper-preview.pdf', 'frontend/public/data/research-paper-preview.pdf'],
  ['content/questions/expert-challenge.json', 'frontend/public/data/expert-challenge.json'],
  ['content/explanations/explanations.json', 'frontend/public/data/explanations.json'],
  ['content/explanations/expert-explanations.json', 'frontend/public/data/expert-explanations.json'],
  ['content/video-manifest.json', 'frontend/public/data/video-manifest.json'],
  ['content/expert-video-manifest.json', 'frontend/public/data/expert-video-manifest.json']
];
for (const [source, target] of mappings) await cp(resolve(projectRoot, source), resolve(projectRoot, target));

const registry = JSON.parse(await readFile(resolve(projectRoot, 'research/reference-registry.json'), 'utf8'));
const references = (registry.references || []).map(ref => ({ id: String(ref.id), text: String(ref.fullCitation || ref.text || ''), url: typeof ref.url === 'string' ? ref.url : null }));
if (references.length !== 38 || references.some(ref => !ref.text.trim())) throw new Error(`Expected 38 complete research references; found ${references.length}.`);
await writeFile(resolve(dataRoot, 'references.json'), `${JSON.stringify(references, null, 2)}\n`);

const canonicalVideoRoot = resolve(projectRoot, 'content/videos');
const publicVideoRoot = resolve(dataRoot, 'videos');
for (const folder of ['scripts', 'captions', 'storyboards', 'prompts']) {
  await rm(resolve(publicVideoRoot, folder), { recursive: true, force: true });
  await mkdir(publicVideoRoot, { recursive: true });
  await cp(resolve(canonicalVideoRoot, folder), resolve(publicVideoRoot, folder), { recursive: true });
}
await rm(resolve(publicRoot, 'videos'), { recursive: true, force: true });
await cp(resolve(projectRoot, 'public/videos'), resolve(publicRoot, 'videos'), { recursive: true });

// Retain the verified imperative demonstrator as an isolated simulations fallback.
await rm(resolve(publicRoot, 'legacy-src'), { recursive: true, force: true });
await cp(resolve(frontend, 'src'), resolve(publicRoot, 'legacy-src'), { recursive: true });
let legacyHtml = await readFile(resolve(frontend, 'index.html'), 'utf8');
legacyHtml = legacyHtml.replace('href="src/styles.css"', 'href="/legacy-src/styles.css"')
  .replace('src="src/app.js"', 'src="/legacy-src/app.js"');
await writeFile(resolve(publicRoot, 'legacy.html'), legacyHtml);
console.log(`React public assets synchronized: ${references.length} references, ${validation.totals.questions} question/media packages, legacy simulation fallback.`);
