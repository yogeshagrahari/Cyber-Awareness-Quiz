# Phase 19 release checklist — 0.10.0-rc.12

## Fixed and locally verified

- [x] Build the ignored static legacy distribution in the clean release-packaging runner.
- [x] Smoke-test the static distribution inside the release-packaging job before manifest generation.
- [x] Add a CI step to extract the exact application-demo ZIP and smoke-test its packaged server before upload.
- [x] Add a CI step to extract the exact React application ZIP and run the React distribution smoke before upload.
- [x] Extract the full-source ZIP locally/in the packaging job and re-verify every file size and SHA-256 hash.
- [x] Exclude Python bytecode, Python/test/tool caches, coverage and virtual-environment folders from the manifest and source archive.
- [x] Keep Python and JavaScript manifest exclusion policy aligned.
- [x] Require exact archive-file equality with the manifest inventory plus `package-manifest.json`.
- [x] Reject duplicate archive paths, unmanifested files, excluded paths and path traversal entries.
- [x] Require matching legacy and React package versions.
- [x] Require a non-empty React assets folder for a full React release archive.
- [x] Pass legacy, React domain/source, Python manifest, content, secret-pattern, Nginx, backup, systemd, syntax and archive checks locally.

## External gates still required

- [ ] Generate, review and commit the genuine React `package-lock.json`.
- [ ] Pass `npm ci` and `npm audit --audit-level=high` on Node.js 22.23.5, 24.22.3 and 26.13.1.
- [ ] Pass official TypeScript 7 and Vite production build plus React build smoke.
- [ ] Pass five Playwright desktop/mobile profiles and axe scans; close all serious/critical findings.
- [ ] Complete manual keyboard, screen-reader and responsive accessibility acceptance.
- [ ] Run unified GitHub CI and confirm both extracted-archive smoke checks succeed.
- [ ] Confirm package-release uploads React, source and legacy ZIPs and checksums from successful GitHub CI.
- [ ] Verify production TLS/HSTS, monitoring, off-host backups, restore and rollback.
- [ ] Obtain independent security/instructional-design review and learner evaluation.

**Decision:** `0.10.0-rc.12` remains NOT PRODUCTION APPROVED. Video provider work, MP4 generation and media review are intentionally deferred by the owner.
