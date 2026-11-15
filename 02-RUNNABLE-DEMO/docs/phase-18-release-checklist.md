# Phase 18 release checklist — 0.10.0-rc.11

## Implemented
- [x] Align manifest generator exclusions with manifest verifier.
- [x] Reject symlinks during manifest generation and verification.
- [x] Add Python tests for `.DS_Store`/`.env*`/generated-file exclusions and symlink rejection.
- [x] Run manifest regression tests in the legacy CI matrix.
- [x] Download the successful React dependency SBOM into the release job.
- [x] Validate CycloneDX format and non-empty component inventory before manifest generation.
- [x] Include downloaded SBOM in the full-source archive's SHA-256 inventory.
- [x] Keep React build, lockfile and browser acceptance gates fail-closed.
- [x] Keep video production and media review out of scope.

## External release gates
- [ ] Generate, review and commit the genuine React package lockfile.
- [ ] Pass `npm ci`, `npm audit --audit-level=high`, TypeScript, Vite and React distribution smoke.
- [ ] Pass desktop and mobile Playwright tests and axe scans.
- [ ] Verify the React build and SBOM artifacts are successfully transferred into the release job.
- [ ] Complete manual keyboard/screen-reader/zoom/contrast accessibility review.
- [ ] Verify production TLS/HSTS, monitoring, off-host backups and restore/rollback.
- [ ] Obtain independent cybersecurity/instructional-design review and learner evaluation.

## Release status

`0.10.0-rc.11` is a source-only/legacy-demo candidate, not a production approval. A React production archive must not be issued until the committed lockfile and all required CI gates succeed.
