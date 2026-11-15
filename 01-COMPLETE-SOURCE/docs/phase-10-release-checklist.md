# Phase 10 release checklist — 0.10.0-rc.3

## Completed local engineering checks
- [x] React domain/data regression tests: 14/14
- [x] Legacy application tests: 35/35
- [x] Runtime content/mapping/URL/media-gate validation strengthened
- [x] Answer feedback live region and question-focus restoration added
- [x] Offline structural TypeScript check (shim-based only)
- [x] Content/schema and 51 video authoring package validation
- [x] High-confidence secret-pattern scan
- [x] Legacy copy-based build and 215-route smoke regenerated for rc.3
- [x] Package manifest and SHA-256 inventory regenerated for rc.3
- [x] Nginx syntax and 8 live route/header/range checks recorded via `tests/deploy/nginx-live-smoke.sh`

## Required before React production release
- [ ] Controlled dependency resolution and reviewed `frontend/react-app/package-lock.json`
- [ ] CI switched to `npm ci` after lockfile commit
- [ ] Dependency-backed React/TypeScript check and Vite production build
- [ ] Vite output smoke and functional browser checks
- [ ] Chromium, Firefox and WebKit desktop/mobile acceptance
- [ ] Keyboard, screen-reader, zoom, contrast and reduced-motion audit to WCAG 2.2 AA
- [ ] Container-level Nginx deployment validation, HTTPS/HSTS and operational rollback
- [ ] Independent security and instructional-design approval of 51 scenarios
- [ ] 51 approved MP4 files generated and reviewed; current count is zero
- [ ] Learner evaluation protocol/ethics review and actual evaluation

Do not mark a gate complete without reproducible evidence. Production approval remains withheld while any required gate is unchecked.
