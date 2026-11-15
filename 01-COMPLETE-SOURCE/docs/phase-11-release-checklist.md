# Phase 11 release checklist — 0.10.0-rc.4

## Completed in this phase
- [x] Add no-store `/healthz` GET/HEAD endpoint
- [x] Add server regression tests for health endpoint
- [x] Add hardened systemd service example
- [x] Add host-restricted loopback Nginx proxy example
- [x] Validate Nginx proxy configuration syntax
- [x] Validate systemd unit syntax
- [x] Run legacy and React domain tests
- [x] Run content/schema validation
- [x] Run static distribution and 215-route smoke tests
- [x] Remove FFmpeg and video production validation from core CI
- [x] Configure network-enabled React CI lockfile generation, `npm ci`, build, and lockfile artifact

## Required before React production release
- [ ] Download generated `package-lock.json` from React CI artifact
- [ ] Review dependency tree and license/security advisories
- [ ] Commit `frontend/react-app/package-lock.json`
- [ ] Change React CI to use committed lockfile with `npm ci` only
- [ ] Pass official TypeScript/React typecheck and Vite production build
- [ ] Pass React `dist-react` smoke test
- [ ] Pass Chromium, Firefox, and WebKit desktop/mobile acceptance
- [ ] Complete WCAG 2.2 AA keyboard, screen-reader, contrast, zoom, and reduced-motion checks
- [ ] Deploy to target host and validate TLS/HSTS, monitoring, backups, and rollback
- [ ] Obtain independent cybersecurity/instructional-design review
- [ ] Conduct approved learner evaluation

## Explicitly deferred by project owner
- [ ] Video provider integration and MP4 generation
- [ ] Video caption/media review and release
