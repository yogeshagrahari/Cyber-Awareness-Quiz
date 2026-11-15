# Phase 15 release checklist — 0.10.0-rc.8

## Completed in source
- [x] Centralize React lockfile generation in one dedicated CI job.
- [x] Pin lockfile generation to Node.js 26.13.1 and npm 12.2.2.
- [x] Publish one lockfile artifact per workflow run.
- [x] Make all Node.js matrix jobs consume that same lockfile.
- [x] Install with `npm ci`; remove per-matrix lockfile regeneration.
- [x] Retain audit, typecheck, production build, distribution smoke and browser/accessibility gates.
- [x] Exclude generated archives, dependency caches, test reports and environment files from the source manifest.
- [x] Bump current release metadata to 0.10.0-rc.8.

## Required external verification
- [ ] Run the React workflow on GitHub Actions with npm registry access.
- [ ] Review and commit `frontend/react-app/package-lock.json` from the successful resolution job.
- [ ] Pass `npm ci` and `npm audit --audit-level=high` on both supported Node.js matrix versions.
- [ ] Pass official TypeScript 7 typecheck, Vite 8.3.8 build and React distribution smoke.
- [ ] Pass Chromium, Firefox, WebKit desktop and Pixel/iPhone mobile Playwright projects.
- [ ] Resolve all critical/serious axe findings and complete manual accessibility review.
- [ ] Complete production TLS/HSTS, monitoring, off-host backup and restore/rollback verification.
- [ ] Obtain independent expert review and learner evaluation.

## Explicitly deferred
- [ ] Video provider integration, MP4 generation and media review.
