# Phase 21 release report — 0.10.0-rc.14

**Date:** 13 November 2026  
**Scope:** React accessibility source hardening, CISA reference verification update and release-candidate maintenance.  
**Video scope:** Deferred by project owner. No video generation, video import, provider integration, MP4 review or video playback change was performed.

## Summary

Phase 21 advances the project from RC.13 to RC.14. It fixes several accessibility naming/state gaps in the React UI and updates reference [38] using CISA's 2026 Insider Threat Mitigation Guide resource listing. It also adds regression assertions for the changed semantics.

## Implemented changes

1. The Settings Reduced motion switch now derives its accessible name from the visible setting heading and references its explanatory text.
2. Each pathway `<progress>` element now has a clear accessible name.
3. The JSON import file input now exposes a direct accessible name.
4. The Learning paths navigation item now exposes `aria-current="page"` while the learner is inside an assessment, consistent with its active visual state.
5. React accessibility source tests and Playwright checks now assert these semantics.
6. Reference [38] now points to CISA's 2026 Insider Threat Mitigation Guide resource listing. The separate 2024 Insider Threats 101 fact sheet [32] is explicitly described as a 2024 resource. The CISA 2026 page summary and resource listing were verified; the linked 21.27 MB PDF was not downloaded or independently reviewed.

## Verification performed

- React source/domain suite: **PASS — 19/19** Node test cases (TypeScript strip-types execution; source and domain tests, not a browser render).
- Legacy application suite: **PASS — 49/49** Node tests.
- Offline TypeScript structural check: **PASS** with TypeScript 5.8.3 and local ambient React/Vite shims; this is not the declared TypeScript 7 framework build.
- Canonical content/traceability validator: **PASS** for 45 core questions, 6 expert scenarios, 51 explanations, 204 rationales and 38 reference mappings.
- High-confidence secret-pattern scan: **PASS** (guardrail only, not full SAST).
- Official React/Vite build and Playwright/axe: not run because required npm dependencies are absent, installed Node/npm versions are below the pinned CI baseline, and registry lookup failed with DNS `EAI_AGAIN`.
- Local Chromium loopback navigation was blocked by administrator policy (`ERR_BLOCKED_BY_ADMINISTRATOR`); no browser acceptance is claimed.
- No package lockfile was manually invented.
- Source inventory: **PASS — 1,155 tracked source files** matched SHA-256 and file-size entries.
- Source and demo ZIP archive integrity: **PASS**; both ZIP files passed `unzip -t` and both SHA-256 checks passed.
- Extracted app-demo ZIP smoke: **PASS**; HTTP `/healthz`, root HTML, canonical question-bank route (45 core questions) and RC.14 version label returned as expected.
- Research reference metadata was corroborated using CISA's indexed 2026 resource listing and release announcement; the complete PDF was not reviewed.

## Outstanding production gates

- Generate and review the lockfile in the pinned CI workflow; run `npm ci`, `npm audit --audit-level=high`, official TypeScript 7 typecheck, Vite build, smoke and complete Node matrix.
- Run Chromium, Firefox and WebKit Playwright/axe and manual WCAG 2.2 AA acceptance.
- Validate TLS/HSTS, host allow-list, monitoring, backups, restore and rollback on the actual deployment environment.
- Obtain independent security and instructional-design review and conduct learner evaluation.
- Review the full CISA 2026 PDF before relying on its detailed contents.
- Produce and review question-level video assets in the later video phase.

## Release decision

**0.10.0-rc.14 is not production-approved.** The changes improve source-level accessibility and research traceability, but the React build and real-browser acceptance gates remain unsatisfied. Quiz performance remains formative and is not certification or proof of real-world security behaviour.
