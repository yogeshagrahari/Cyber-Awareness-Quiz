# CYBERAWARE 3D — Phase 13 release hardening

**Release candidate:** 0.10.0-rc.6  
**Date:** 12 November 2026  
**Scope:** Supported-runtime CI, browser acceptance automation, learner data portability, and service lifecycle/backup hardening. Video production is excluded at the project owner's request.

## Delivered

### 1. Supported Node LTS and dependency controls
- Set the development baseline to Node.js 26.13.1 and configured CI against Node.js 24.22.3 and 26.13.1.
- Pinned npm CLI to 12.2.2 in both CI workflows.
- Bumped the browser test toolchain to `@playwright/test` 1.65.0 and `@axe-core/playwright` 4.14.0, and Vite to 8.3.8. Other React/TypeScript pins remain unchanged.
- Added weekly Dependabot update configuration for React dependencies, root frontend metadata and GitHub Actions.
- Added `npm audit --audit-level=high` as a CI gate.
- React CI generates a lockfile from the pinned manifest, runs `npm ci`, performs official TypeScript/Vite build and smoke checks, and uploads both the generated lockfile and successful Node 26 React distribution. The reviewed lockfile is still not committed because this runtime cannot reach the npm registry.

### 2. Browser and accessibility acceptance
- Expanded Playwright profiles to desktop Chromium, Firefox and WebKit, plus Pixel 7 Chromium and iPhone 14 WebKit.
- Added checks for initial content load, primary navigation, keyboard quiz answering, persisted progress, reduced-motion control, progress export/import and document-level horizontal overflow.
- Expanded axe-core scans to the dashboard, assessment and primary learner views using WCAG 2.0/2.1/2.2 A/AA tags. CI fails on critical or serious axe findings.
- Added a dedicated TypeScript project for the Playwright configuration and E2E tests, so the official `tsc -b` checks those files too.
- Playwright/axe have not been executed locally because package installation and browser launch are blocked in the authoring runtime. Their implementation and CI wiring are complete; execution is an external gate.

### 3. Learner data portability
- Added quiz-progress JSON export in Settings.
- Added strict import parsing, a 2 MB limit, supported-format/version checks, normalized attempt validation, canonical question/level/category/option/scoring checks, and explicit confirmation before replacing local progress.
- Added unit tests for round-trip export/import, malformed/oversized/poisoned files and mismatch against canonical question records.
- The export covers quiz attempts only. It does not include Simulation Lab state, preferences, or cloud synchronization. Browser-local data that was cleared before export cannot be recovered by the server.

### 4. Service lifecycle and deployment backup
- The Node server now rejects malformed or out-of-range `PORT` values and invalid `HOST` strings before listening.
- Added graceful SIGTERM/SIGINT shutdown: stop accepting new connections, drain active requests, close idle connections and force-stop only after the systemd stop window.
- Added regression tests for invalid port/host and successful clean SIGTERM shutdown.
- Added `deploy/backup-cyberaware.sh` with an out-of-tree backup destination, restrictive permissions, lock against concurrent runs, exclusion of VCS/dependency/test artifacts and `.env*`, archive integrity validation and SHA-256 sidecar.
- Added a smoke test for checksums, exclusions, permissions and refusal to place backups inside the live project.
- Added a restore/rollback runbook. Deployment archive backups remain separate from browser-local quiz progress backups.

## Local verification results

| Check | Result |
|---|---:|
| Legacy Node test suite | 37/37 passed |
| React domain/data tests | 17/17 passed |
| Offline structural TypeScript check | Passed (local TypeScript 5.8 with shims; not the official TypeScript 7 framework check) |
| Canonical content/schema validation | Passed (45 core + 6 Expert Challenge, 204 answer rationales, 38 references) |
| Dependency-free static build | Passed (copy-based, not Vite) |
| Distribution smoke | 215 routes passed |
| Nginx live HTTP smoke | 8/8 passed |
| systemd unit syntax | Passed |
| Backup archive smoke | Passed |
| CI/Dependabot YAML syntax | Passed |
| High-confidence secret-pattern scan | Passed |
| CycloneDX SBOM generation | Passed (10 direct React toolchain dependencies; transitive resolution depends on lockfile) |
| ZIP integrity | Verified after packaging |

Local runtime note: the authoring runtime runs Node.js 22.16.0. The CI matrix targets the supported Node 24/26 patches above, but those exact runtimes were not available locally for execution.

The legacy test suite includes existing video-manifest/provider fail-closed tests. No video files were generated, edited or submitted to a provider.

## Remaining gates (not claimed as passed)

1. **React dependency resolution and committed lockfile:** npm registry DNS resolution failed in this environment. Obtain the `cyberaware-react-package-lock-node-26.13.1` or Node 24.22.3 CI artifact, review it, and commit `frontend/react-app/package-lock.json`.
2. **Official React build:** green network-enabled CI must demonstrate `npm ci`, high-severity `npm audit`, official React/TypeScript typecheck, Vite build and `smoke:build`.
3. **Browser acceptance:** Chromium, Firefox, WebKit and mobile Playwright/axe tests are configured but have not yet run. Review CI test reports and fix any surfaced violations.
4. **Manual accessibility:** automated axe checks do not replace manual keyboard, screen-reader, zoom, contrast, reduced-motion and assistive-technology validation.
5. **Production operations:** validate TLS/HSTS at the HTTPS ingress, certificate renewal, monitoring, off-host backup replication, restore drill and rollback on the actual target host.
6. **Human review:** independent cybersecurity/instructional-design review and learner evaluation remain pending.

## Release decision

The dependency-free demonstrator remains the verified runnable application. The React implementation is a migration candidate with a much stronger test and release pipeline, but **0.10.0-rc.6 is not production-approved** until network-enabled CI, reviewed lockfile, browser acceptance and deployment-specific checks are complete.

## Explicitly deferred by project owner

Video provider integration, MP4 generation, caption/media review and video release acceptance.
