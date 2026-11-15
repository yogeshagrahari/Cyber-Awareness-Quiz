# Phase 20 release report — 0.10.0-rc.13

**Date:** 13 November 2026  
**Scope:** Non-video release hardening, runtime handoff consistency, static deployment packaging and local validation.  
**Video scope:** Explicitly deferred by the project owner. No video provider, generation, import, media review or playback changes were performed in this phase.

## Summary

Phase 20 advances the supplied 0.10.0-rc.12 source candidate to 0.10.0-rc.13. The release revision corrects user-visible version strings, aligns the stale React deployment guide with the Node engine and CI matrix, adds a Nginx static deployment profile for the dependency-free legacy demonstrator, and adds an executable smoke test for that exact deployment path.

The existing React + TypeScript + Vite migration is preserved. It is not represented as a completed production build: a reviewed npm lockfile, `npm ci`, dependency audit, official TypeScript/Vite build, and browser/axe acceptance remain external release gates.

## Implemented changes

1. Updated both package versions to `0.10.0-rc.13` and corrected the legacy and React UI version labels.
2. Corrected the React deployment guide's stale Node.js baseline. The documented supported CI matrix remains Node.js `22.23.5`, `24.22.3` and `26.13.1`; npm CLI is pinned to `12.2.2` in CI.
3. Added `deploy/nginx-legacy-static.conf`. It serves the contents of `frontend/dist`, maps `/data`, `/videos`, `/models` and `/textures` to the same `public/` namespaces used by the local server, rejects methods other than GET/HEAD, disables directory listing, returns 404 for missing static assets, provides `/healthz`, and includes the project's defensive response headers.
4. Added `tests/deploy/nginx-legacy-static-smoke.sh` to validate the actual static legacy URL contract, content loading, missing-file behavior, method restriction, security headers and byte-range support.
5. Wired the static deployment smoke test into the legacy CI validation job and included the new deployment assets/report in the application-demo release archive definition.
6. Rebuilt both release archives, checked ZIP integrity, re-hashed the extracted 1,151-file source tree against its manifest, compared every application-demo file to its matching source file, and reran the packaged-server and Nginx smoke tests against the extracted demo ZIP.
6. Kept the app's local-only progress model and all explicit product limitations documented. No server-side accounts, database, cloud analytics, API service or authentication system is claimed.

## Local verification performed

| Check | Result | Scope / caveat |
|---|---:|---|
| Legacy Node test suite | PASS — 49/49 | Unit, data, server, simulation and release workflow tests |
| React domain/content suite | PASS — 17/17 | Does not build the React app or exercise a browser |
| Offline TypeScript structural check | PASS | Local TypeScript 5.8.3 shim configuration; not official TypeScript 7 project typecheck |
| Canonical content/traceability validation | PASS | 45 core questions, 6 Expert Challenge scenarios, 51 explanation mappings, 204 option rationales, 38 research references |
| High-confidence secret-pattern scan | PASS | Guardrail only; not full SAST or external secret scanning |
| Source syntax checks | PASS | Node syntax checks for legacy application/server modules |
| Package manifest verification | PASS — 1,151 files | Source file sizes and SHA-256 inventory; exact archive file-set and extracted-byte re-verification |
| Python package-manifest tests | PASS — 2/2 | Exclusion alignment and symbolic-link rejection |
| Backup smoke test | PASS | Checksums, exclusions, permissions and source-tree safety |
| Existing Nginx HTTP smoke | PASS — 8/8 | Existing React-style static Nginx sample test |
| New legacy static Nginx smoke | PASS — 10/10 | Static legacy URL mapping, 404, HEAD, method guard, headers and byte range |
| systemd unit syntax | PASS | Syntax validation only; not installed on a target host |
| Full-source ZIP integrity | PASS | 1,151 manifest-tracked files plus the manifest; archive extraction and SHA-256 re-verification |
| Application-demo ZIP integrity | PASS — 496 files | Extracted demo rechecked against source files; packaged-server smoke and 10/10 static Nginx smoke rerun against extracted ZIP |
| Release SHA-256 manifest | PASS | Both final ZIP checksums independently verified with `sha256sum -c` |

A real Chromium navigation attempt was made against the local demonstrator, but the browser runtime returned `ERR_BLOCKED_BY_ADMINISTRATOR` for loopback navigation. Therefore no real-browser, responsive, screen-reader or axe conformance result is claimed from this environment.

## Outstanding release gates

- Generate, inspect and commit `frontend/react-app/package-lock.json` from the official workflow.
- Run `npm ci`, `npm audit --audit-level=high`, official TypeScript 7 typecheck, Vite production build and React distribution smoke on all supported Node.js CI matrix versions.
- Run Chromium, Firefox and WebKit Playwright profiles and axe scans; complete manual keyboard, screen-reader, zoom, contrast and reduced-motion acceptance.
- Validate HTTPS/TLS, HSTS, host allow-list, monitoring, backups, restore and rollback on the actual target host.
- Obtain independent cybersecurity SME and instructional-design review of the question bank and learning objectives; conduct learner evaluation before making effectiveness claims.
- Produce and review videos in a later owner-managed phase.

## Release decision

**0.10.0-rc.13 is a strengthened staging/deployment candidate, not production-approved.** The dependency-free static demonstrator can be deployed behind a TLS-terminating ingress using the new Nginx configuration, subject to target-host security and operations validation. The React migration remains source-only until its dependency and browser gates pass. Quiz performance remains formative and is not certification or proof of secure real-world behaviour.
