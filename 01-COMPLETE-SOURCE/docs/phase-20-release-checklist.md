# Phase 20 release checklist — 0.10.0-rc.13

## Completed in this package

- [x] Align visible app version strings with package metadata.
- [x] Correct the stale Node.js requirement in the React deployment guide.
- [x] Add a Nginx static profile for the dependency-free legacy distribution.
- [x] Add a legacy Nginx static smoke test for content routing, security headers, 404 handling, HEAD, method denial and range requests.
- [x] Wire the new smoke test into the legacy CI validation job.
- [x] Include the new static deployment instructions and release evidence in the application-demo ZIP recipe.
- [x] Re-run local legacy, React domain, content, source-integrity, secret-pattern, Nginx, backup and systemd syntax checks.
- [x] Preserve the research manuscript, references, traceability records, question bank, explanations, 3D simulations, adaptive logic and historical release evidence.
- [x] Leave video generation and media review untouched as requested.

## Still required before production approval

- [ ] Commit a human-reviewed React npm lockfile; run `npm ci` and high-severity dependency audit.
- [ ] Pass official TypeScript 7 and Vite production build and React distribution smoke on Node 22.23.5, 24.22.3 and 26.13.1.
- [ ] Pass Chromium, Firefox and WebKit E2E plus axe scans; complete manual keyboard, screen-reader, contrast and zoom review.
- [ ] Validate the selected Nginx configuration on the target host behind HTTPS/TLS; set HSTS at the trusted TLS edge.
- [ ] Verify production monitoring, off-host backups, restore and rollback.
- [ ] Obtain independent cybersecurity and instructional-design review and conduct a learner evaluation.
- [ ] Generate and review video assets in the later video phase.

**Decision:** `0.10.0-rc.13` is a staging/deployment candidate, not a production approval.
