# CYBERAWARE 3D — Release checklist

## Verified local checks
- [x] Legacy application test suite
- [x] React domain/data tests
- [x] Offline structural TypeScript check (shim-based; not official dependency-backed typecheck)
- [x] 51-scenario content and JSON Schema validation
- [x] 51 video script/storyboard/prompt/caption validation
- [x] Canonical React asset synchronization
- [x] High-confidence secret-pattern scan
- [x] Legacy static build and 215-route smoke test
- [x] CycloneDX SBOM generated

## Required before a React production release
- [ ] Resolve and review `frontend/react-app/package-lock.json` in a network-enabled build environment
- [ ] Change React CI install to `npm ci` after lockfile is committed
- [ ] Dependency-backed `npm run typecheck` and `npm run build`
- [ ] `npm run smoke:build` against actual Vite output
- [ ] Nginx container configuration test and deployed HTTP checks
- [ ] Browser E2E on Chromium, Firefox and WebKit; desktop and mobile viewports
- [ ] Keyboard-only and screen-reader review
- [ ] 200%/400% zoom, contrast and reduced-motion review (WCAG 2.2 AA)
- [ ] Independent cybersecurity and instructional-design approval
- [ ] 51 real MP4 files generated, probed, caption-checked and human-reviewed
- [ ] Learner evaluation protocol and ethics review, then actual evaluation
- [ ] Production hosting, HTTPS/HSTS, monitoring, CSP reporting, access controls and rollback drill

Do not mark any unchecked item complete without evidence.
