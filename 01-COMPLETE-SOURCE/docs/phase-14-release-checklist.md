# Phase 14 release checklist — 0.10.0-rc.7

## Completed and locally verified
- [x] Packaged static distribution launches from `frontend/dist`
- [x] Readiness GET/HEAD, no-store headers and root HTML checks
- [x] Canonical question bank served by packaged distribution
- [x] HEAD, 404, 405 and security-header checks
- [x] Graceful shutdown verified for packaged distribution server
- [x] Source server tests use dynamically allocated ports
- [x] Nginx smoke uses isolated temporary directories suitable for unprivileged CI
- [x] Deterministic full-source and app-demo ZIP packaging
- [x] SHA-256 sidecars and archive integrity checks
- [x] Release archive excludes `.env*`, VCS, dependencies and test artifacts
- [x] Core CI runs packaged distribution smoke
- [x] Core CI builds/uploads release archives on main/master or manual dispatch
- [x] 37 legacy tests and 17 React domain/data tests pass
- [x] Content, static build, 215-route smoke, Nginx, systemd, backup and secret checks pass

## Still required before React production approval
- [ ] Generate and review `frontend/react-app/package-lock.json` in network-enabled CI
- [ ] Pass `npm ci` and `npm audit --audit-level=high`
- [ ] Pass official TypeScript 7 and Vite 8.3.8 production build
- [ ] Pass React distribution smoke
- [ ] Pass Playwright Chromium/Firefox/WebKit desktop and mobile tests
- [ ] Resolve all critical/serious axe findings
- [ ] Complete manual accessibility review
- [ ] Complete target-host TLS/HSTS, monitoring, off-host backup and restore/rollback drill
- [ ] Obtain independent expert review and learner evaluation

## Explicitly deferred
- [ ] Video provider integration, MP4 generation and media review
