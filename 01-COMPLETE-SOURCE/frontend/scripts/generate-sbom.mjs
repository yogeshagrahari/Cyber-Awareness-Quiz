import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const outDir = new URL('../../evidence/', import.meta.url);
await mkdir(outDir, { recursive: true });
const fs = await import('node:fs/promises');
const legacyPackage = JSON.parse(await fs.readFile(new URL('../package.json', import.meta.url), 'utf8'));
const reactPackage = JSON.parse(await readFile(new URL('../react-app/package.json', import.meta.url), 'utf8'));
const components = [];
const dependsOn = [];
for (const [name, version] of Object.entries(reactPackage.dependencies || {})) {
  const ref = `pkg:npm/${name}@${version}`;
  components.push({ type: 'library', name, version, 'bom-ref': ref, scope: 'required', purl: ref });
  dependsOn.push(ref);
}
for (const [name, version] of Object.entries(reactPackage.devDependencies || {})) {
  const ref = `pkg:npm/${name}@${version}`;
  components.push({ type: 'library', name, version, 'bom-ref': ref, scope: 'optional', purl: ref });
  dependsOn.push(ref);
}
const stableSeed = JSON.stringify({ version: reactPackage.version, components, dependencies: [{ ref: 'cyberaware-3d', dependsOn }] });
const hex = createHash('sha256').update(stableSeed).digest('hex').slice(0, 32).split('');
hex[12] = '8';
hex[16] = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
const uuid = `${hex.slice(0,8).join('')}-${hex.slice(8,12).join('')}-${hex.slice(12,16).join('')}-${hex.slice(16,20).join('')}-${hex.slice(20,32).join('')}`;
const sbom = {
  bomFormat: 'CycloneDX', specVersion: '1.6', serialNumber: `urn:uuid:${uuid}`, version: 1,
  metadata: {
    tools: [{ vendor: 'CYBERAWARE 3D', name: 'generate-sbom.mjs', version: '2.0.0' }],
    component: {
      type: 'application', name: 'cyberaware-3d', version: reactPackage.version,
      description: 'React + TypeScript + Vite learning application with the dependency-free demonstrator retained as a compatibility fallback.',
      purl: `pkg:generic/cyberaware-3d@${reactPackage.version}`, 'bom-ref': 'cyberaware-3d'
    },
    properties: [{ name: 'legacy.frontend.version', value: legacyPackage.version }]
  },
  components,
  dependencies: [{ ref: 'cyberaware-3d', dependsOn }],
  annotations: [{ subjects: ['cyberaware-3d'], text: 'This SBOM enumerates direct runtime and development dependencies from frontend/react-app/package.json. A package-lock.json and resolved transitive dependency inventory are pending because the npm registry was unreachable during authoring; regenerate the SBOM after dependency installation and lockfile review.' }]
};
await writeFile(new URL('cyberaware3d-sbom.cdx.json', outDir), JSON.stringify(sbom, null, 2) + '\n');
console.log(`Wrote deterministic evidence/cyberaware3d-sbom.cdx.json (${components.length} declared direct React toolchain dependencies; transitive resolution pending lockfile).`);
