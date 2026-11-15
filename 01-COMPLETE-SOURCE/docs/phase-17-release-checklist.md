# Phase 17 release checklist — 0.10.0-rc.10

## Completed in source and locally verified
- [x] Verify every source file against the generated SHA-256 inventory before packaging.
- [x] Reject malformed, duplicated, stale, missing, untracked and symlinked inventory entries.
- [x] Verify all inventoried files appear in the full-source ZIP.
- [x] Reject excluded/sensitive paths in the completed full-source archive.
- [x] Validate every explicit application-demo ZIP input path before creating the archive.
- [x] Remove the invalid legacy HTML path from the application-demo input list.
- [x] Expand secret-pattern scanning to dot-env/config/key files and additional high-confidence token patterns.
- [x] Add Node.js 22.23.5, 24.22.3 and 26.13.1 to legacy and React CI matrices.
- [x] Add manifest and application-demo package regression tests.
- [x] Run local 43/43 legacy tests and 17/17 React domain/source tests.
- [x] Run content, secret scan, legacy build/smokes, Nginx, backup and systemd checks.
- [x] Generate source-only archives and SHA-256 checksums.
- [x] Keep video generation and media review out of scope.

## Required external actions
- [ ] Run the manual lockfile refresh workflow on the intended repository branch.
- [ ] Inspect the lockfile, resolved dependency origins and complete audit JSON; commit the reviewed lockfile.
- [ ] Pass full CI on Node.js 22.23.5, 24.22.3 and 26.13.1.
- [ ] Pass npm audit, TypeScript, Vite build and React build smoke.
- [ ] Pass the full Chromium/Firefox/WebKit and mobile Playwright suite plus axe scans.
- [ ] Complete manual keyboard, screen-reader, zoom, contrast and assistive-technology review.
- [ ] Configure stable branch-protection checks: `Legacy validation gate` and `React, browser and accessibility gate`.
- [ ] Verify production HTTPS/TLS, HSTS, monitoring, off-host backups, restore and rollback.
- [ ] Obtain independent cybersecurity/instructional-design expert review and learner evaluation.

## Release status

`0.10.0-rc.10` is a source-only/legacy-demo handoff, not a production approval. No React production ZIP is available until the locked React CI artifact succeeds.
