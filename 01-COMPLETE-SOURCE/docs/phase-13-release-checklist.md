# Phase 13 release checklist — 0.10.0-rc.6

## Completed in source and locally verified
- [x] Node CI matrix targets Node 24.22.3 and 26.13.1
- [x] Pin npm CLI to 12.2.2
- [x] Refresh Playwright 1.65.0, axe-core Playwright 4.14.0 and Vite 8.3.8 pins
- [x] Add weekly Dependabot update configuration
- [x] Add `npm audit --audit-level=high` CI gate
- [x] Configure desktop Chromium, Firefox, WebKit and Pixel/iPhone mobile profiles
- [x] Expand axe checks across dashboard, assessment and primary learner views
- [x] Add E2E TypeScript project to the official `tsc -b` reference graph
- [x] Add validated quiz-progress JSON export/import with explicit replace confirmation
- [x] Check imports against canonical question IDs, pathway, topic, answer choice and scoring
- [x] Add server PORT/HOST validation and graceful SIGTERM/SIGINT shutdown
- [x] Add protected project backup script and test exclusions, checksum, permissions and path refusal
- [x] Add restore/rollback and learner-data portability documentation
- [x] Pass 37 legacy tests, 17 React domain/data tests, content validation, offline typecheck, static build, 215-route smoke, Nginx smoke, systemd check, backup smoke, YAML validation and secret scan
- [x] Regenerate SBOM and project file manifest

## Required before React production approval
- [ ] Run network-enabled React CI on Node 24.22.3 and 26.13.1
- [ ] Review generated package-lock artifact and commit `frontend/react-app/package-lock.json`
- [ ] Pass `npm ci` and `npm audit --audit-level=high`
- [ ] Pass official React/TypeScript 7 build and Vite 8.3.8 production build
- [ ] Pass React distribution smoke test
- [ ] Pass Playwright Chromium/Firefox/WebKit desktop and Pixel/iPhone mobile profiles
- [ ] Resolve all critical/serious axe findings
- [ ] Complete manual screen-reader, keyboard, zoom, contrast and reduced-motion review
- [ ] Run deployment TLS/HSTS, monitoring, off-host backup and restore/rollback drill
- [ ] Obtain independent cybersecurity/instructional-design review
- [ ] Conduct learner evaluation

## Explicitly deferred
- [ ] Video provider integration and MP4 generation
- [ ] Video caption/media review and video release acceptance
