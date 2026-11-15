# Phase 17 release report — 0.10.0-rc.10

**Scope:** fail-closed source inventory verification, archive-content verification, application-demo input validation, expanded high-confidence secret scanning, and supported Node.js LTS coverage. React lockfile, dependency-backed build, browser, production-host and independent-review blockers remain open. Video provider integration, MP4 generation and media review remain out of scope.

## Issues found and corrected

1. **The source integrity manifest was not checked by the packager.** The manifest was generated before release packaging, but the packaging script did not verify that the current file tree still matched every recorded digest/size or that new files were inventoried. Added `scripts/verify-package-manifest.mjs`, called before archive creation. It rejects missing/invalid manifests, duplicate or malformed records, changed files, untracked files, stale records and symbolic links. The full-source archive is then checked to ensure every inventoried file is present and excluded paths are absent.
2. **A non-existent demo input was silently listed.** Removed `frontend/legacy.html` from the application archive list (the maintained fallback page is `frontend/public/legacy.html`, included via `frontend/public`). Every explicitly listed demo input is now checked before `zip` runs.
3. **Archive exclusion checks and manifest exclusions needed to agree.** Aligned `.DS_Store`, `.env*`, `dist-react`, node_modules, test reports, release output and Git metadata exclusions. The source archive is scanned after creation for forbidden or sensitive path components.
4. **The secret scan missed important text/configuration files.** Expanded scanning to `.env` dotfiles, `.npmrc`, Markdown, text, TOML/INI/configuration, PEM/key/certificate, lock and common source files. Added high-confidence recognizers for additional AWS, GitLab, Slack, Stripe, npm and OpenAI project/service token patterns. The scanner remains a local pattern guardrail, not a full secret-scanning or SAST product.
5. **The tested Node matrix did not exercise the full declared engine range.** Unified CI now tests Node.js 22.23.5, 24.22.3 and 26.13.1, matching the declared engine floor and the active/maintenance LTS lines. All three are November 11, 2026 security releases.
6. **Regression coverage.** Added tests for manifest drift, missing inventory entries and required application-demo input paths, bringing the legacy suite to 43 tests.

## Local validation

The current runtime validation is recorded in `evidence/phase-17-local-validation.json`. This authoring container still runs Node.js 22.16.0 and npm 10.9.2, below the declared Node engine floor and pinned npm CLI. Therefore tests run here are useful local evidence but do not substitute for the three supported-version CI matrix. No registry-based dependency installation or React build was fabricated.

Verified locally:

- Legacy Node tests: 43/43 passed.
- React domain and source-accessibility tests: 17/17 passed.
- Canonical content validation: passed (45 core questions, 6 Expert Challenge scenarios, 51 explanation mappings, 204 option rationales, 38 reference mappings).
- Expanded high-confidence secret-pattern scan: passed.
- Legacy static compatibility build and 215-route smoke: passed.
- Exact packaged legacy distribution smoke: passed.
- Nginx live HTTP smoke: 8/8 passed.
- Protected backup smoke: passed.
- Systemd unit syntax: passed.
- Manifest verifier positive/negative tests and release workflow tests: passed.
- Source-only ZIP integrity, manifest membership, excluded-path scan and SHA-256 sidecars: passed.
- Extracted application-demo ZIP was launched from its packaged `frontend/dist/server.mjs`; health, root HTML, canonical question data, HEAD, method rejection, no-store health and graceful SIGTERM passed.

The 17 React tests are domain and source assertions only. They are not browser accessibility results. No MP4 generation was run or represented as complete.

## Remaining external gates

- Generate, review and commit a genuine `frontend/react-app/package-lock.json` through the manual lock-refresh workflow.
- Run unified CI successfully on Node.js 22.23.5, 24.22.3 and 26.13.1, including `npm ci`, `npm audit --audit-level=high`, official TypeScript 7, Vite build, React distribution smoke, Chromium/Firefox/WebKit desktop, Pixel/iPhone mobile Playwright and axe acceptance.
- Configure branch protection for the exact stable checks `Legacy validation gate` and `React, browser and accessibility gate`.
- Complete manual keyboard, screen-reader, zoom, contrast and assistive-technology accessibility review.
- Verify production TLS/HSTS, monitoring, off-host backups and restore/rollback on the actual host.
- Obtain independent cybersecurity/instructional-design review and learner evaluation.

## Release decision

**0.10.0-rc.10 is not production-approved.** The verified legacy demo and full source-only archive are suitable as internal handoff artifacts. The React production ZIP is not issued because there is no real committed lockfile or successful Vite/browser artifact in this environment. Do not promote the candidate until the external gates above pass.
