# Phase 22 finalization checklist — 0.10.0-rc.15

**Date:** 13 November 2026  
**Scope:** Close all locally executable non-video work, reconcile research and implementation statements, rerun release verification and archive a final handoff candidate.  
**Video:** Deferred by project owner. No video generation or human media review is included in this phase.

## Completed in this phase

- [x] Re-reviewed the RC.14 source archive, application demo, release report, evidence and master-prompt requirements before making changes.
- [x] Confirmed the pinned toolchain values are real current releases; retained the project's Node 26.13.1 / npm 12.2.2 baseline and existing supported Node CI matrix.
- [x] Bumped both application package versions and visible app version labels to `0.10.0-rc.15`.
- [x] Reconciled the IEEE manuscript's progression description with implementation: ten distinct first attempts and at least 75% first-attempt accuracy for progression; topic-review signal after at least two attempts and below 70%.
- [x] Reconciled the manuscript's 3D claims with delivered capability: WebGL globe, 2D fallback and four fictional defensive simulations. Explicitly documented unimplemented full-world / threat-map concepts as future work.
- [x] Rewrote the technical implementation report to distinguish the verified dependency-free demonstrator, React migration source, target architecture and pending production gates.
- [x] Re-ran legacy tests (49/49), React domain/source tests (19/19), offline structural TypeScript check, canonical content validator, high-confidence secret-pattern scan, dependency-free static build, 215-route distribution smoke and packaged-demo smoke.
- [x] Re-ran Nginx static smoke (10/10), Nginx live HTTP smoke (8/8), backup safeguards and systemd service syntax verification.
- [x] Regenerated the source inventory and verified all inventoried paths, sizes and SHA-256 hashes.
- [x] Prepared the RC.15 source ZIP, runnable legacy demo ZIP, checksum manifest, release report, final checklist and machine-readable validation evidence.

## Explicitly not completed / external gates

- [ ] React `package-lock.json`, `npm ci` and `npm audit --audit-level=high`. The installed runtime is Node 22.16.0 / npm 10.9.2, below the project baseline; the container cannot resolve `nodejs.org` or `registry.npmjs.org`. No fabricated lockfile is included.
- [ ] Official React TypeScript 7 / Vite production build and React distribution smoke. The React source is included, but there is no installed React dependency tree or `frontend/dist-react` bundle.
- [ ] React Playwright and axe acceptance in Chromium, Firefox and WebKit; manual keyboard, screen-reader, zoom, contrast and reduced-motion review.
- [ ] Real target-host TLS/HTTPS, HSTS at the trusted edge, monitoring, logging/retention, off-host backup restore and rollback validation.
- [ ] Independent cybersecurity SME and instructional-design review of all question stems, choices, rationales and citations.
- [ ] Learner pilot / controlled evaluation and ethics approval or exemption, as applicable. No effectiveness claim is made.
- [ ] Full review of the linked CISA 2026 Insider Threat Mitigation Guide PDF before citing it for detailed recommendations or statistics.
- [ ] Complete 3D-world elements identified as not yet delivered in the manuscript; current 3D scope is explicitly bounded in the technical report.
- [ ] Question-level video generation and review; deferred by owner and intentionally not performed.

## Release decision

`0.10.0-rc.15` is the **final locally reproducible handoff candidate from this execution**, not a production-approved release. It contains the full source, research, question and explanation datasets, scripts/storyboards/caption drafts, React migration source, dependency-free runnable demonstrator, deployment configs, tests, CI and evidence. The app-demo ZIP is the legacy demonstrator, not the React/Vite production build. Production approval remains blocked on the external gates above.
