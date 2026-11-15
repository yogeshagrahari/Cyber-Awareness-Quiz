# Phase 16 release checklist — 0.10.0-rc.9

## Completed in source
- [x] Replace ephemeral per-run lock resolution with a committed-lockfile requirement in main CI.
- [x] Add fail-closed lockfile metadata, registry-origin, package-entry and Subresource Integrity verification.
- [x] Add a manual lockfile-refresh workflow that publishes the lockfile and npm-audit JSON for review but cannot publish release archives.
- [x] Consolidate legacy and React validation into one CI workflow.
- [x] Add stable non-matrix legacy and React aggregator gates.
- [x] Require both test matrices to pass before the release packaging job can run.
- [x] Add CI-contract regression tests for the artifact path, downstream release gates and lock-refresh workflow.
- [x] Restrict release packaging to `main` or `master` after upstream CI success.
- [x] Generate a full resolved-dependency CycloneDX SBOM from the locked installation in CI.
- [x] Package the exact React build artifact that passed browser acceptance as a separate React app ZIP.
- [x] Update release metadata and document the Phase 15 reproducibility limitation.
- [x] Preserve video work outside this phase.

## Required external actions
- [ ] Dispatch `CyberAware 3D React dependency lockfile refresh` on the intended release branch.
- [ ] Review dependency names, exact versions, registry sources and audit findings in the artifact.
- [ ] Commit `frontend/react-app/package-lock.json` to the repository.
- [ ] Pass `npm ci` and `npm audit --audit-level=high` on Node.js 24.22.3 and 26.13.1.
- [ ] Pass React domain tests, official TypeScript check, Vite build and distribution smoke on both Node.js versions.
- [ ] Pass Chromium, Firefox, WebKit desktop and Pixel/iPhone mobile Playwright acceptance.
- [ ] Resolve critical/serious axe findings; complete manual accessibility review.
- [ ] Configure branch protection to require the exact stable check names `Legacy validation gate` and `React, browser and accessibility gate` (not the matrix job IDs).
- [ ] Confirm full-source, legacy-demo and React-app release archives are created only by the downstream `package-release` job after both CI matrices pass.
- [ ] Verify TLS/HSTS, monitoring, off-host backup and restore/rollback on the production host.
- [ ] Obtain independent cybersecurity and instructional-design review and learner evaluation.

## Explicitly deferred
- [ ] Video provider integration, MP4 generation and media review.
