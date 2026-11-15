# CYBERAWARE 3D — Research, Content and Application Demonstrator

**Project owner:** Yogesh Kumar Agrahari  
**Group:** E  
**Role:** Security Training Design  
**Current release:** Library/content update candidate · 0.10.0-rc.16 (verified legacy static demonstrator; React migration remains gated)  
**Date:** 13 November 2026

## Project status

CYBERAWARE 3D combines the research manuscript, 115-question cybersecurity core bank, 18-scenario Expert Challenge, 38-source numbered research register and BibTeX-linked reference registry with a runnable client-side learning demonstrator. The combined bank now contains 133 scenarios across 44 categories (at least three questions per topic; Authentication has four). Topic-library practice can start immediately, including locked-level content; those locked-level attempts are saved as optional practice and do not count toward pathway unlocking. The application is a formative learning prototype, not a production learning management system or security certification platform.

The supplied `research-paper-preview.pdf` is preserved unchanged at `research/attachments/research-paper-preview.pdf` and linked from **Research sources → Project background & attached research paper** in the application. It is clearly labelled Draft v0.1 / preview layout / not submitted / no empirical results. See `docs/phase-23-library-and-background-update.md` for the change record and acceptance interpretation.

## Run the verified legacy demonstrator

Requirements: Node.js 22.23.5 or later on a supported LTS release. The dependency-free demonstrator requires no third-party package installation.

```bash
cd frontend
npm start
```

The server binds to `127.0.0.1` by default and opens at `http://127.0.0.1:4173`. Stop with `Ctrl+C`. The demo is not exposed to the local network unless an operator explicitly sets `HOST=0.0.0.0`; do not use that setting on an untrusted network or as a public deployment.

### Static Nginx staging deployment

For the dependency-free demonstrator, build the distribution with `cd frontend && npm run build`, copy the **contents** of `frontend/dist/` to `/usr/share/nginx/html/`, install `deploy/snippets/cyberaware-security-headers.conf` under `/etc/nginx/snippets/`, and enable `deploy/nginx-legacy-static.conf`. The Nginx profile preserves the `/data/` and `/videos/` URL mappings used by the application and is smoke-tested locally. Keep its port behind a trusted TLS-terminating ingress; configure HTTPS/HSTS, monitoring, backup/restore and rollback on the target host before public use. This is a staging deployment path, not a production approval. See `docs/phase-20-release-report.md`.


## Run the React + TypeScript + Vite migration

The migration candidate is in `frontend/react-app`. It declares pinned React 19.3.1, React DOM 19.3.1, TypeScript 7.0.2, Vite 8.3.8, `@vitejs/plugin-react` 6.3.0, Playwright 1.65.0 and axe-core Playwright 4.14.0. Development baseline is Node 26.13.1; CI verifies Node 22.23.5, 24.22.3 and 26.13.1.

Run the manual **CyberAware 3D React dependency lockfile refresh** GitHub Actions workflow, review its package-lock and audit artifact, and commit `frontend/react-app/package-lock.json`. Then install from that committed lockfile and start the application:

```bash
cd frontend/react-app
npm ci
npm run dev
```

Open `http://127.0.0.1:5174`. The asset sync validates and copies the canonical 133 question/media mappings (51 existing script packages and 82 owner-deferred media records) and 38 research references before serving.

The current authoring environment cannot reach `registry.npmjs.org`, so no genuine lockfile is present and a dependency-backed Vite build is not claimed. Local React tests and an offline structural TypeScript check pass, but they are not substitutes for the official TypeScript 7/Vite build and five-profile Playwright/axe acceptance configured in GitHub Actions. The standard CI never regenerates the lockfile. The dependency-free legacy demonstrator remains the verified fallback until those gates pass. See `docs/phase-9-react-migration.md`, `docs/phase-9-deployment-guide.md` and `docs/ci-configuration.md`.

## Application features

- Dashboard with practice metrics, topic signals and transparent next-step recommendations.
- Beginner, Intermediate and Advanced pathways based on the expanded 115-question core bank.
- Topic library and category practice.
- Four-option quiz flow, feedback and all four option explanations.
- Research-reference identifiers and source library.
- Local progress, first-attempt score calculation, XP and achievements.
- Rule-based recommendations and provisional progression threshold.
- Question-level video manifest mappings for all 133 scenarios; 51 earlier script/storyboard/prompt/caption packages are retained. Media work for the 82 added questions is explicitly deferred; no MP4 generation is claimed.
- Four interactive defensive simulations: phishing inspection with a known-domain/destination comparison, password profile configuration, MFA fatigue response and ransomware incident-response sequencing.
- Locally generated WebGL wireframe scenes with pointer/keyboard rotation and a CSS 2D fallback; these are educational illustrations, not live system models.
- WebGL globe illustration with 2D fallback; not a live threat map.
- Reduced-motion control, responsive CSS layouts and local-data reset.

## Repository layout

- `research/`: IEEE-structured manuscript, literature synthesis, 38-source numbered reference registry, verification notes, research gap, method and traceability documents.
- `content/questions/`: canonical 115-question core bank, separate 18-scenario Expert Challenge bank, topic coverage report and schemas.
- `content/explanations/`: explanation records.
- `content/videos/`: 51 existing scripts, storyboards, prompts and caption drafts; new media work is owner-deferred until video phase.
- `content/video-manifest.json` and `content/expert-video-manifest.json`: core and Expert Challenge question-to-video mappings and actual media status.
- `frontend/react-app/`: React + TypeScript + Vite migration release candidate with typed quiz state, progress, validation, media gating and separate legacy simulation launcher.
- `frontend/`: dependency-free verified fallback, canonical asset sync, static data copy, tests and local server; `frontend/src/simulations.js` contains simulation decision models and the native WebGL scene renderer.
- `docs/`: architecture, stack decision, implementation report, test matrix, user guide, security analysis, local operation guide and learning journal.
- `tests/content/`: Python content-integrity validator.
- `.github/workflows/`: pinned-action CI for both legacy and React applications, plus a manual dependency-lock refresh workflow.
- `evidence/`: SBOM, test evidence, provider-neutral video queue/batch and review checklist templates.

## Verification commands

```bash
cd frontend
npm test
npm run validate:content
npm run security
npm run video:validate
npm run video:queue
npm run build
node --check src/app.js
node --check src/core.js
node --check src/globe.js
node --check server.mjs
npm run smoke:dist
npm run sbom
python3 ../scripts/generate_package_manifest.py
```

The static output is written to `frontend/dist`. To run that copy, execute `node server.mjs` from inside `frontend/dist`. This remains a copy-based static package, not a bundled or minified Vite build.

## Important implementation decision

The preferred architecture in the research design names React, TypeScript and Vite. The current environment did not provide a working npm registry connection, so installing those packages timed out. Rather than handing over an unbuildable source tree, Phase 3 uses native browser ES modules, semantic HTML/CSS, WebGL and Node built-ins. The migration plan is documented in `docs/stack-decision.md`. This is a deliberate temporary deviation, not a claim that React/Vite has been implemented.

## Honest limitations

- All 133 authored questions remain drafts pending independent cybersecurity SME and pedagogical approval. The bank now contains at least three questions in each of 44 topic categories.
- All 133 video mappings have explicit status. The 51 existing script/storyboard/prompt/caption packages remain available but require content review; 82 new video tasks are deferred by owner direction and have no placeholder scripts or captions. No MP4 is generated and no provider is connected.
- Expert Challenge is implemented as a separate six-scenario module, gated by a provisional Advanced practice threshold.
- The WebGL simulations have 2D fallbacks; manual target-browser rendering remains open because browser navigation is blocked by the execution environment.
- Automated browser E2E and manual WCAG 2.2 AA review remain outstanding. Browser navigation is blocked by this runtime administrator, so real browser/WebGL rendering and assistive-technology behavior cannot be verified in this environment.
- No human-subject study or efficacy evaluation has been conducted.
- The local demo server is not production hosting. Production deployment requires a managed static host or reviewed reverse proxy, HTTPS/HSTS, monitoring, operational ownership and a production security assessment.

## Academic integrity

Do not present quiz performance as proof of secure real-world behaviour. Do not claim IEEE acceptance, publication, peer review, experimental validation or generated media until each has actually occurred and been verified.


## Phase 4 — Content quality and accessibility preflight (12 Nov 2026)

- Automated content preflight: PASS (45 questions; 15 per core level; 38 registered references resolved; no structural/heuristic findings).
- Video scripts, storyboards and caption drafts: 45/45 present. Rendered MP4 files: 0; no video generation is claimed.
- Automated application tests: 8/8 PASS. Content validator: PASS. High-confidence secret-pattern scan: PASS. Static copy build: PASS. CycloneDX SBOM regenerated.
- Human security/pedagogical review and full WCAG 2.2 AA browser/assistive-technology assessment remain pending. This package is for internal demonstration and expert review, not public release approval.
- Audit report: `docs/phase-4-content-and-accessibility-audit.md`; machine-readable evidence: `evidence/phase-4-content-audit.json`.


## Phase 5 — Expert Challenge integration (12 Nov 2026)

- Added six organizational-level Expert Challenge scenarios covering incident containment, supplier vulnerability prioritization, insider-risk governance, payment diversion, board risk communication and ransomware recovery.
- Added a separate Expert Challenge JSON bank, schema, explanation records, video manifest, six narration scripts, six storyboards, six generation prompts and six WebVTT caption drafts.
- Integrated the Expert Challenge pathway in the app. It unlocks after at least 10 Advanced first attempts at 75% first-attempt accuracy; this is a provisional practice gate, not certification.
- The 45-question core bank remains unchanged and separately validated.
- Expert Challenge MP4 files have not been generated; all media entries remain pending review.
- Content validator now audits 51 total question/video mappings while preserving the 45-core-bank acceptance constraint.


## Phase 5 — Release-hardening update (12 Nov 2026)

- Expert Challenge is active in the learning-path interface as a separate six-scenario module. Its gate requires at least 10 Advanced first attempts and at least 75% first-attempt accuracy. This is a practice rule only, not a validated competence threshold.
- Added visible keyboard focus styling and semantic progressbar labels/value text for pathway and quiz progress.
- Shortened Expert Challenge voiceover transcripts to a 30–60 second target while retaining detailed written option rationales. Caption drafts were synchronized to narration.
- Expanded validator coverage to 51 question/explanation/video/script/storyboard/prompt/caption mappings and 204 option rationales.
- The 13-test Node suite and Python content validator are the phase acceptance checks; latest results are recorded in `evidence/phase-5-release-audit.json`.
- Unresolved external gates: independent cybersecurity and instructional-design approval; MP4 generation and playback; full browser/screen-reader/contrast/zoom audit; React/TypeScript/Vite migration; production deployment. These are not marked complete.


## Phase 6 — Interactive simulation lab (12 Nov 2026)

- Added four guided activities: phishing inspection, password profile configuration, MFA fatigue response and ransomware incident-response sequencing.
- Added procedural native WebGL wireframes, pointer and arrow-key rotation, reduced-motion support and a CSS 2D fallback. No external model downloads, third-party graphics dependency or live network actions are required.
- Password lab accepts only non-secret characteristics; it has no password input. Persistent simulation progress excludes secret values and is cleared by Settings reset.
- The four simulations link to relevant question IDs and numbered manuscript references. Completion represents exercise completion only, not demonstrated real-world competence.
- Validation: 22/22 Node tests, 51-item content validation, high-confidence secret-pattern scan, JavaScript syntax, static build and 14-route distribution smoke test passed.
- Browser runtime visual verification remains pending: Playwright navigation to localhost was blocked by the runtime administrator and headless Chromium also reported EGL/ANGLE and DBus startup errors. Full WCAG 2.2 AA assessment, independent content review, React/Vite migration, 51 MP4 generation and empirical evaluation are still open.
- Design and validation records: `docs/simulation-lab-design.md` and `docs/phase-6-validation-report.md`.


## Phase 7 — Question-level video production pipeline (12 Nov 2026)

- Added provider-neutral generation queue and a ZIP bundle with 51 question-bound jobs (45 core + 6 Expert Challenge), including the exact script narration, storyboard, prompt, caption draft, question mapping, research IDs and a deterministic idempotency key. No provider job is submitted by queue generation.
- The script's `Narration transcript` is the single source of truth. All 51 storyboard narration fields were synchronized to that transcript, and a new validator checks drift, word counts, storyboard timing, caption cue ordering, duration, and 95%+ narration text coverage. Fixed one off-by-one narration word count in `VIDEO-ATTACH-B10`.
- Added human pre-generation approval and post-render approval commands. Jobs remain blocked until the actual checklist is completed.
- Added a local MP4 import gate using `ffprobe`: H.264/AAC, yuv420p, 16:9, minimum 1280×720, 30–60 seconds, 150 MB maximum, caption sync and SHA-256. Imported media remains hidden from learners until human approval.
- Fixed source/mirror drift: `npm run build` now copies canonical scripts, storyboards, prompts, captions and manifests into the frontend static-data directory before packaging.
- Added MP4 HTTP byte-range support (206/416) for browser seeking and a playback/caption error fallback to the written transcript.
- Validation: 33/33 Node tests PASS; Python content and JSON Schema validation PASS; high-confidence secret-pattern scan PASS; all 51 video packages PASS; 51 generation jobs packaged with 0 eligible/51 blocked because content review has not been recorded; static build and exhaustive distribution route smoke test PASS; CycloneDX SBOM regenerated.
- Isolated workflow test using a temporary synthetic fixture verified pre-generation approval → queue eligibility → MP4 import/probe/hash → rendered-pending-review → checklist approval → ready manifest → static build. The synthetic test file was not included in the project archive and is not represented as educational or AI-generated media.
- Actual AI media remains open: no external provider is configured and no videos have been generated. Independent security/pedagogical approval, real MP4 review, target-browser and assistive-technology audit, React/Vite migration, production backend/deployment and learner evaluation remain release gates.
- Detailed procedure: `docs/video-production-pipeline.md` and `docs/video-provider-integration.md`; evidence: `evidence/video-generation-queue.json` and `evidence/video-generation-batch.zip`.


## Phase 8 — Local server security and accessibility hardening (12 Nov 2026)

- Changed the local HTTP demo's default bind address from all network interfaces to loopback (`127.0.0.1`). Network binding now requires an explicit `HOST` override and emits a warning when bound to all interfaces.
- Added resolved-path containment checks so symlinks inside the static tree cannot serve files outside the project root. Malformed paths, NUL/control bytes and backslashes are rejected safely.
- Applied defensive response headers to error responses as well as successful routes; added same-origin resource policy and restricted form/frame destinations.
- Corrected `HEAD` requests with MP4 byte ranges to return range metadata without a response body.
- Hardened learner progress parsing: local-storage content is bounded, rows are type-checked, IDs/levels/lengths/timestamps are validated, and duplicate mastery records are normalized before being used by the dashboard.
- Improved contrast for small secondary labels and added explicit contrast-ratio regression checks for five documented foreground/surface pairs. This is a limited token check, not a complete WCAG conformance audit.
- Validation: 35/35 Node tests PASS; 45 core + 6 Expert content/schema validation PASS; all 51 video packages PASS; secret-pattern scan PASS; static build PASS; 215-route distribution smoke test PASS; SBOM regenerated; package SHA-256 inventory regenerated.
- Browser navigation remains blocked by the execution environment's administrator policy. Manual keyboard-only, screen-reader, zoom, high-contrast and target-browser testing remain open. No MP4 media, independent expert approval or empirical efficacy results are claimed.
- Detailed record: `docs/phase-8-security-and-accessibility-hardening.md`; machine-readable record: `evidence/phase-8-audit.json`.


## Phase 9 migration status (12 Nov 2026)

- React screens implemented for overview, paths, topic practice, quizzes with four option rationales, progress, research references, achievements and settings.
- The 51 canonical scenario bank, 51 explanations, 51 video records and 38 references are validated at runtime; first-attempt scoring and progression gates are implemented in typed domain helpers.
- Media is only surfaced when manifest status, file-exists flag, review approval and media-validation flag all pass; otherwise the learner gets the transcript/script fallback.
- The existing four WebGL simulations remain accessible from the React app via a separate same-origin legacy page. They are not embedded because the application maintains a strict frame-deny policy.
- Local structural TypeScript check and seven React-domain/data tests pass. A real Vite build is not claimed because the npm registry was unavailable in this environment. The full migration CI workflow will install pinned dependencies and run the build when executed in GitHub Actions.


## Phase 9 — React migration candidate and deployment hardening (12 Nov 2026)

- Added the React + TypeScript + Vite migration candidate with typed domain models, overview/path/topic/quiz/progress/research/achievement/settings views, first-attempt scoring, progression gates, local progress sanitization, research-reference rendering and strict video visibility gates.
- Kept the four legacy WebGL simulations as a separate same-origin page to preserve frame-deny policy; React launches this page in a new tab.
- Canonical asset sync validates and copies 51 questions, 51 explanations, 51 video mappings, 38 research references, scripts, storyboards, prompts, captions and the legacy fallback.
- Added Nginx deployment configuration with restrictive CSP, security headers, immutable hashed-asset caching, no-cache learning data, video byte-range support, health endpoint and 404 behavior for missing data/media.
- Verification in this environment: legacy Node tests 35/35 PASS; React domain/data tests 8/8 PASS; offline structural TypeScript check PASS; content/schema validator PASS; high-confidence secret scan PASS; video pipeline validation PASS (51 packages, 0 generated/ready MP4); static fallback build PASS; 215-route distribution smoke PASS; asset sync PASS; CycloneDX SBOM regenerated.
- The React dependency-backed Vite build is NOT verified: npm registry access timed out during package-lock-only resolution, and no package-lock.json is committed. The structural check uses local TypeScript 5.8 with an ambient React/Vite shim; it is not equivalent to the declared TypeScript 7 and actual React/Vite typecheck.
- No real-browser React/WebGL test, full WCAG 2.2 AA audit, independent cybersecurity/instructional-design approval, generated MP4s, or learner efficacy study is claimed. The legacy demonstrator remains the verified runnable fallback.
- React migration and deployment instructions: `docs/phase-9-react-migration.md`, `docs/phase-9-deployment-guide.md`, and `deploy/nginx-react.conf`.


## Phase 10 — React data integrity, accessibility feedback and release verification (12 Nov 2026)

- Hardened the React runtime content loader to reject malformed top-level payloads, duplicate question/explanation/video/reference identities, orphaned mappings, inconsistent correct-answer rationales/text, unresolved references, unsafe non-HTTPS research links, noncanonical transcript/caption paths and unapproved media claims.
- Added React regression coverage for malformed payloads/mappings, unsafe reference URLs, false media-ready claims and accessibility semantics; React suite is now 14/14 PASS. Legacy suite remains 35/35 PASS.
- Added a polite live region to the answer feedback and focus restoration as learners advance between question headings; external reference links explicitly use `noopener noreferrer`.
- Verified canonical content/schema and all 51 authored video packages; there are still 0 MP4s and 0 ready media entries. The high-confidence secret-pattern scan passes.
- Rebuilt the dependency-free legacy static distribution and passed the 215-route distribution smoke test. Nginx syntax and 8 isolated live HTTP checks passed (health endpoint, content, missing routes, byte ranges, no-store behavior and security headers).
- The offline TypeScript check passes with a local compiler and ambient shims only. The real React/Vite dependency-backed typecheck and build remain unverified because npm registry resolution timed out and no reviewed lockfile exists.
- Browser E2E, cross-browser and manual WCAG checks remain unverified: this runtime blocks browser navigation by administrator policy. Nginx production container/TLS/HSTS, expert approval, actual MP4 production and learner evaluation also remain external gates.
- Release decision: **0.10.0-rc.5 is still a migration candidate, not a production release.** See `docs/phase-10-quality-and-release-hardening.md`, `docs/phase-10-release-checklist.md` and `evidence/phase-10-release-audit.json`.


## Phase 11 — deployment hardening (v0.10.0-rc.4)

Phase 11 adds a no-store `/healthz` endpoint, a sandboxed systemd service example, and a loopback-only Nginx reverse-proxy example for the verified dependency-free demonstrator. Core CI no longer installs FFmpeg or runs the video production package validation step. Video generation and MP4 production are explicitly deferred by project-owner direction. The React/Vite migration remains a candidate until a reviewed lockfile, dependency-backed build, and browser acceptance tests are completed. See `docs/phase-11-deployment-hardening.md`.


## Phase 12 — browser acceptance automation (v0.10.0-rc.5)

- Added Playwright browser coverage for initial learning-data load, primary navigation, keyboard-only quiz interaction, persisted progress and reduced-motion preference control.
- Added axe-core WCAG 2.0/2.1/2.2 A/AA tagged scans for the dashboard and assessment; CI fails on critical or serious findings.
- React CI now installs Chromium, runs browser acceptance after the production build, and uploads failure diagnostics. It also uploads the generated dependency lockfile for review.
- Revalidated 35 legacy tests, 14 React domain/data tests, 51 canonical content scenarios, offline structural TypeScript check, static fallback build, 215-route smoke test and high-confidence secret scan.
- Local Playwright/axe execution and the official Vite build remain unverified because this runtime cannot reliably resolve npm packages or launch Chromium. The network-enabled CI run must pass before the React app can be production-approved.
- Video provider integration, MP4 generation and video review remain explicitly deferred by the project owner.
- Release decision: **the dependency-free legacy demonstrator remains the locally verified runnable app; the React migration remains a candidate pending green network-enabled CI, reviewed lockfile, and manual accessibility/browser acceptance.**
- See `docs/phase-12-release-report.md`, `docs/phase-12-release-checklist.md` and `evidence/phase-12-release-audit.json`.


## Phase 13 — supported-runtime CI, data portability and service lifecycle (v0.10.0-rc.7)

- Updated the React toolchain to Playwright 1.65.0, axe-core Playwright 4.14.0 and Vite 8.3.8. CI now checks Node 24.22.3 and 26.13.1 with npm 12.2.2.
- Expanded browser acceptance profiles to desktop Chromium, Firefox and WebKit plus Pixel 7 Chromium and iPhone 14 WebKit. Automated axe scans run on dashboard, assessment and primary learner screens; the app is also checked for horizontal overflow.
- Added high-severity dependency audit to CI and a successful React distribution artifact upload on the Node 26 leg.
- Added validated JSON export/import of quiz progress. Imports are size-limited, strictly parsed, mapped to the current 51-question bank and require explicit confirmation before replacing the on-device progress.
- Hardened the Node service to reject invalid PORT/HOST values and drain connections gracefully on SIGTERM/SIGINT.
- Added a protected project backup script and tested its checksum, archive exclusions, permissions and refusal to write backups inside the live project tree.
- Local validation: 37/37 legacy Node tests; 17/17 React domain/data tests; content/schema, offline structural TypeScript, static build, 215-route smoke, Nginx 8-check smoke, systemd unit syntax, backup smoke, workflow YAML and high-confidence secret scan all pass.
- Not yet verified locally: dependency-backed React/Vite build, npm audit, Playwright/axe browser run, production deployment and manual accessibility. The npm registry and browser runtime remain blocked in this authoring environment; CI is configured to run these gates but has not been executed here.
- Quiz progress export excludes Simulation Lab activity and no cloud sync is provided. Video provider integration, MP4 generation and video review remain explicitly deferred by the project owner.
- Release decision: **the dependency-free application is verified; the React candidate remains blocked on green network-enabled CI/browser acceptance and review/commit of the generated dependency lockfile.**
- See `docs/phase-13-release-report.md`, `docs/phase-13-release-checklist.md`, `docs/data-portability-and-recovery.md` and `evidence/phase-13-release-audit.json`.


## Phase 14 — release packaging and distribution acceptance (v0.10.0-rc.7)

- Added a packaged-distribution integration smoke test that starts the actual `frontend/dist/server.mjs` process on a dynamically allocated port and verifies readiness, root HTML, canonical question data, HEAD behavior, 404 handling, unsupported methods, security headers and graceful shutdown.
- Replaced hard-coded server test ports with dynamically allocated ports to reduce parallel-CI collisions.
- Added `scripts/package-release.mjs` to reproducibly create the full source archive, the dependency-free application demo archive and SHA-256 checksums. It excludes dependency trees, environment files, Git metadata and test reports.
- Added the packaged-distribution smoke test to core CI. The release workflow can now produce repeatable downloadable archives instead of relying on manual file selection.
- Local validation: 37/37 legacy Node tests, 17/17 React domain/data tests, offline structural TypeScript, content validation, static build, 215-route distribution smoke, packaged-server integration smoke, Nginx HTTP smoke, systemd syntax, backup smoke, CI YAML, secret scan and archive integrity all pass.
- The system browser and Python Playwright runtime are present, but browser navigation is blocked by the execution environment's administrator policy; real-browser acceptance remains a CI/host-side gate. npm registry DNS also remains unavailable, so no dependency-backed React build or lockfile is claimed.
- Release decision: legacy application remains verified; React migration remains blocked on network-enabled CI and browser acceptance. Video generation and review remain explicitly deferred.
- See `docs/phase-14-release-report.md`, `docs/phase-14-release-checklist.md` and `evidence/phase-14-release-audit.json`.


## Phase 15 — run-scoped React dependency resolution (v0.10.0-rc.8)

Phase 15 made both React Node.js matrix jobs consume one lockfile artifact per workflow run. This eliminated per-runner dependency resolution differences, but it did not establish reproducibility across separate runs because the generated lockfile was not committed. The source manifest excludes generated archives, dependency directories, test reports and environment files. Phase 16 replaces the run-scoped approach with a reviewed, committed lockfile requirement and a unified release gate.

## Phase 16 — committed dependency lock and unified release gate (v0.10.0-rc.9)

- React CI now requires `frontend/react-app/package-lock.json` in source control and validates its root package metadata against `package.json` before `npm ci`. CI never silently generates a replacement lockfile.
- The manual **CyberAware 3D React dependency lockfile refresh** workflow creates a lockfile and npm-audit JSON review artifact using Node.js 26.13.1 and npm 12.2.2. Review registry origins and dependency versions, then commit the lockfile before main CI can pass.
- Legacy and React verification now run in the same required CI workflow. Release ZIP packaging is a downstream job that runs only after both Node.js test matrices, React build, browser E2E and axe checks succeed.
- The React CI creates a complete resolved-dependency CycloneDX SBOM from the installed, locked dependency tree and publishes it beside the production React build.
- Added a lockfile consistency verifier, release checklist and regression tests for the CI artifact path and downstream release gates. Branch protection should require the stable **Legacy validation gate** and **React, browser and accessibility gate** checks; this repository snapshot cannot configure GitHub branch protection itself.
- Local validation is recorded in `evidence/phase-16-local-validation.json`. Network-dependent lockfile generation, `npm ci`, npm audit, full Vite build and Playwright/axe remain external until the workflow runs on GitHub Actions.

The current environment does not have npm registry access, so no lockfile has been fabricated or committed. React CI intentionally remains blocked until a real lockfile is generated, reviewed and committed. Production release remains disabled until all checks and operational gates pass. Video production and provider work remain deferred.



## Phase 17 — Release integrity and supported-runtime coverage (13 Nov 2026)

- Release packaging now checks the SHA-256 source manifest against the live tree and verifies that every inventoried file is present in the full-source archive.
- The packager rejects symlinks, missing app-demo inputs and excluded/sensitive paths in the resulting source archive.
- Secret-pattern scanning covers dot-env files, configuration/key formats and additional high-confidence token families.
- Unified CI now checks Node.js 22.23.5, 24.22.3 and 26.13.1. The local source-only package remains a release candidate; real React lockfile, Vite, browser/axe and production-host gates are still required.
- Report and checklist: `docs/phase-17-release-report.md` and `docs/phase-17-release-checklist.md`.


## Phase 18 — deterministic manifest generation and complete release SBOM (13 Nov 2026)

- Unified the Python manifest generator with the verifier's exclusion policy: `.DS_Store`, `.env*`, generated artifacts, dependency folders and Git metadata are excluded consistently. Symbolic links are rejected instead of being hashed through their targets.
- Added Python regression tests for the manifest exclusion policy and symlink rejection.
- Release packaging now downloads the exact resolved React dependency SBOM from the successful Node 26 CI leg, validates its CycloneDX structure, then includes it in the source archive's SHA-256 inventory.
- React lockfile generation, official dependency installation, Vite/browser/axe checks and production-host verification remain external release gates.
- Report and checklist: `docs/phase-18-release-report.md` and `docs/phase-18-release-checklist.md`.


## Phase 20 — Non-video release and static deployment hardening (13 Nov 2026)

- Updated package and interface version labels to 0.10.0-rc.13 and corrected a stale Node.js baseline in the React deployment guide.
- Added a Nginx static deployment profile for the verified dependency-free legacy distribution and a dedicated smoke test; integrated the test into legacy CI.
- Re-ran unit, domain, content traceability, manifest, secret-pattern, Nginx, backup and systemd syntax checks.
- Release remains a staging/deployment candidate: reviewed React lockfile, official React build, real-browser/axe and manual accessibility acceptance, target-host TLS/operations, expert review and learner evaluation remain open.
- Video work is explicitly deferred and was not performed.


## Phase 21 checkpoint — 0.10.0-rc.14

Phase 21 adds accessible names for React reduced-motion and progress controls, keeps the active pathway exposed during assessments, and refreshes the CISA insider-threat reference to the 2026 guide resource listing. React source/domain tests and the legacy suite pass locally. The official React dependency install/build/browser gates remain blocked in the authoring environment: no reviewed lockfile or installed React dependencies are present, the available Node/npm versions are below the pinned CI baseline, and npm registry DNS resolution failed. RC.14 is therefore a staging/source candidate, not a production-approved build. See `docs/phase-21-release-report.md` and `docs/phase-21-release-checklist.md`.


## Phase 22 — Finalization and evidence-aligned release handoff (13 Nov 2026)

- Re-ran the full offline application and content validation suites: 49/49 legacy tests, 19/19 React domain/source tests, canonical content/traceability validation, secret-pattern guardrail, offline TypeScript structural check, static distribution build and 215-route distribution smoke passed.
- Re-ran deployment safeguards: Nginx static smoke 10/10, Nginx live HTTP smoke 8/8, backup smoke passed, systemd unit syntax verified, and package manifest regenerated and verified.
- Reconciled the IEEE manuscript with the implemented 75% / 10-first-attempt progression rule and with the actually delivered 3D globe/simulation capabilities. Updated the technical implementation report to distinguish shipped, candidate and proposed features.
- Current React/Vite versions are retained; the required Node 26.13.1 and npm 12.2.2 baseline is documented. The official React build is still blocked in this environment because network DNS cannot resolve the official Node/npm package hosts; no lockfile or build artifact was fabricated.
- RC.15 is a final local handoff candidate, **not production-approved**. See `docs/phase-22-finalization-report.md`, `docs/phase-22-finalization-checklist.md`, and `evidence/phase-22-local-validation.json`.
- Video generation and media review remain deferred by the project owner.

For a line-by-line disposition of the original master prompt, see `docs/master-prompt-acceptance-matrix.md`.


## Phase 23 — Topic Library and research-background update (13 Nov 2026)

- Fixed Library discoverability: every topic is listed and can be practiced immediately, regardless of formal pathway unlock state. Locked-level topic attempts are saved as optional practice and excluded from pathway mastery; pathway unlock thresholds are unchanged.
- Expanded the bank to **133 questions across 44 topics** (115 core + 18 Expert Challenge), with at least three questions in each category, 133 explanation mappings and 532 option-specific rationales. Newly authored items remain pending cybersecurity SME and instructional-design review.
- Added the supplied nine-page PDF unchanged to `research/attachments/` and the app's public data folder. The Research sources view now includes a project-background summary and open/download links, while disclosing Draft v0.1, preview layout, not submitted and no empirical results.
- Retained the 51 existing video script/storyboard/prompt/caption sets. The 82 added question-level video records remain explicitly deferred; no videos or placeholder scripts were generated.
- Validation: 52/52 legacy tests, 23/23 React source/domain tests, content/traceability validation, offline structural TypeScript check, 216-route static smoke, packaged demo health/content/PDF smoke, security-pattern scan and video manifest validation passed locally. The official React Vite build and browser/axe acceptance remain blocked by missing lockfile/dependencies and npm registry DNS access.
- RC.16 is an updated local handoff candidate, **not production-approved**. Human content review, manual accessibility, target-host checks and React production gates remain open. See `docs/phase-23-library-and-background-update.md`, its checklist and `evidence/phase-23-validation.json`.
