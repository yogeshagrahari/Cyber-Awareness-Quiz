# Phase 12 release checklist — 0.10.0-rc.5

## Completed
- [x] Add Playwright browser smoke tests for content, navigation, quiz, progress persistence and reduced motion
- [x] Add axe-core WCAG-tagged scans to dashboard and assessment
- [x] Fail browser CI on critical/serious axe findings
- [x] Install Chromium and execute browser tests in React CI
- [x] Preserve traces and screenshots on test failure
- [x] Run 35 legacy tests and 14 React domain/data tests
- [x] Validate all 51 content scenarios and 38 references
- [x] Build and smoke-test dependency-free legacy distribution

## Required before React production approval
- [ ] Network-enabled CI passes generated lockfile resolution and `npm ci`
- [ ] Review and commit `frontend/react-app/package-lock.json`
- [ ] Official TypeScript/React typecheck passes
- [ ] Vite production build and React distribution smoke test pass
- [ ] Playwright Chromium smoke tests and axe checks pass in CI
- [ ] Expand browser acceptance to Firefox and WebKit
- [ ] Complete manual keyboard, screen-reader, zoom, contrast, and reduced-motion testing
- [ ] Complete deployment-specific TLS/HSTS, monitoring, backup/restore and rollback checks
- [ ] Independent cybersecurity/instructional-design review
- [ ] Approved learner evaluation

## Explicitly deferred by project owner
- [ ] Video provider integration and MP4 generation
- [ ] Video caption/media review and release acceptance
