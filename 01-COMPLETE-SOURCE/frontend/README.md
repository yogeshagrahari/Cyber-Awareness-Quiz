# CYBERAWARE 3D Frontend — Migration Release Candidate 0.10.0-rc.16

Two frontend implementations are included during the migration window:

- `react-app/`: React 19 + TypeScript + Vite application. This is the migration release candidate; use the verified dependency-free demonstrator as the release fallback until the Vite dependency-backed build and browser acceptance tests pass.
- `index.html` + `src/`: verified legacy demonstrator retained as a compatibility fallback and simulation activity host. It is served as `/legacy.html` by the React app's public asset sync.

## React application

Requirements: Node.js 22.23.5 or later on a supported LTS release. Development baseline: Node 26.13.1; CI verifies Node 22.23.5, 24.22.3 and 26.13.1. npm CLI is pinned to 12.2.2.

After the manual lockfile-refresh workflow has run and its dependency lockfile has been reviewed and committed:

```bash
cd react-app
npm ci
npm run dev
```

Open `http://127.0.0.1:5174`. Before starting, the dev command validates the canonical question/video packages and synchronizes `/content` data, research references, the attached background research PDF, existing scripts/storyboards/prompts/captions, deferred video mappings and approved media, and the legacy simulations fallback into the Vite public directory.

```bash
npm run test:domain
npm run typecheck
npm run build
npm run preview
```

The package versions are pinned. Main CI requires a reviewed and committed `package-lock.json`, validates that its root metadata matches `package.json`, and installs with `npm ci`. It then performs `npm audit --audit-level=high`, the official TypeScript check, Vite build, distribution smoke test and Playwright/axe browser acceptance. It never regenerates the lockfile during a build. To create a candidate lockfile, manually run **CyberAware 3D React dependency lockfile refresh**, download its artifact, inspect dependency versions and audit findings, and commit it as `frontend/react-app/package-lock.json`. The authoring environment cannot reach the npm registry, so a real lockfile is not present in this source snapshot and a dependency-backed Vite build is not claimed.

## Legacy demonstrator

The original dependency-free application remains runnable from this folder with `node server.mjs` on `http://127.0.0.1:4173`. It is maintained as a fallback and for the existing WebGL simulation activity. The React app launches that activity in a separate tab rather than embedding it, preserving the legacy server's frame-deny policy.

## Data and media boundaries

Question, explanation, video manifest, reference and authoring assets are canonical under the project `/content` and `/research` folders. The Research sources view includes the attached nine-page draft PDF. The React sync step validates all 133 question/explanation/video relationships before copying them. Only media with `status: ready`, `mediaFileExists: true`, `reviewStatus: approved`, and `mediaValidated: true` is exposed in the React player. Draft scripts are not presented as generated videos.


## Browser acceptance

Run the browser and accessibility checks after installing the declared dependencies and browser engines:

```bash
npx playwright install --with-deps chromium firefox webkit
npm run test:e2e
```

The Playwright configuration covers desktop Chromium/Firefox/WebKit and mobile Pixel 7 Chromium/iPhone 14 WebKit profiles. axe-core runs tagged WCAG 2.0/2.1/2.2 A/AA scans on the dashboard, assessment and primary learner views. These automated scans do not replace manual screen-reader, keyboard, zoom, contrast and assistive-technology review. Main CI release packaging depends on the complete legacy and React test/build/browser jobs succeeding.

## Quiz progress portability

In the React application use **Settings → Export quiz progress** to save a JSON backup. **Import quiz progress** validates the file against the current canonical question bank and requires confirmation before replacing current quiz attempts. The export does not include Simulation Lab state, browser settings or cloud-synced records.


## Release package smoke

After building the dependency-free distribution, run:

```bash
npm run smoke:packaged
```

This starts the exact `dist/server.mjs` artifact on a free local port and checks readiness, static content, security headers, GET/HEAD handling, 404s, method rejection and graceful shutdown. To create a local source-only handoff package and SHA-256 checksums from the project root, use the explicit `--source-only` mode. A production release package without this flag requires a complete Vite build under `dist-react`:

```bash
node scripts/package-release.mjs --source-only
```


## Release artifacts

The gated release job publishes three ZIPs: the full source package, the dependency-free legacy application demo, and the built React static application distribution. The React distribution ZIP is produced from the exact build artifact that passed Vite smoke, Playwright and axe CI checks; it is not rebuilt during archive packaging.


## Phase 17 release integrity

Before packaging, `scripts/verify-package-manifest.mjs` checks that every source file still matches the generated inventory and that no tracked file is missing or untracked. Full-source archive membership and excluded/sensitive path components are checked before checksums are written. The application-demo ZIP also validates its required input paths before packaging.


## Phase 18 release evidence

The release job downloads the React CycloneDX dependency SBOM produced by the successful Node.js 26 build/browser leg, validates it, and includes it in the source package before generating the source SHA-256 inventory. The manifest generator and verifier share the same exclusions and reject symbolic links.
