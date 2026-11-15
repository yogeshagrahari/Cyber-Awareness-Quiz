# Phase 21 release checklist — 0.10.0-rc.14

## Completed in this phase

- [x] Fix the unlabeled Reduced motion switch using its visible setting label and descriptive help text.
- [x] Add accessible names to the four pathway progress indicators and the JSON import file input.
- [x] Keep the Learning paths navigation item programmatically current while an assessment is active, matching its visual active state.
- [x] Add source-level accessibility regression tests and Playwright assertions for these controls.
- [x] Refresh CISA reference [38] to the 2026 Insider Threat Mitigation Guide resource listing; distinguish it from the 2024 fact sheet [32].
- [x] Record the limitation that the 21.27 MB CISA PDF was not downloaded or independently reviewed.
- [x] Preserve question/video IDs, mappings, scripts, captions and media state; no video generation or media review was performed.
- [x] Generate the source-only RC.14 ZIPs; verify source manifest hashes, ZIP integrity, SHA-256 checksums and extracted demo runtime smoke.

## Blocked by this environment

- [ ] Generate a trustworthy React `package-lock.json`, run `npm ci`, `npm audit`, and the official TypeScript/Vite build. The environment has no React node_modules/cache, Node 22.16.0 (below the declared 22.23.5 minimum), npm 10.9.2 (below the pinned 12.2.2), and npm registry DNS resolution failed (`EAI_AGAIN`). No lockfile was fabricated.
- [ ] Execute React Playwright/axe browser acceptance. The test cases were strengthened, but the React test dependencies and Vite output are not installed.
- [ ] Complete manual screen-reader, keyboard-only, 200%/400% zoom, contrast and reduced-motion testing.
- [ ] Complete target-host HTTPS/HSTS, monitoring, off-host backup/restore and rollback validation.
- [ ] Obtain independent cybersecurity SME and instructional-design approval and conduct learner evaluation.
- [ ] Download and review the full CISA 2026 Insider Threat Mitigation Guide before using it for detailed recommendations or statistics.

**Decision:** `0.10.0-rc.14` remains a source/staging candidate, not production-approved. The React build, dependency graph and browser acceptance remain hard release gates.
