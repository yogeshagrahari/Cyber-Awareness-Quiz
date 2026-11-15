# Phase 9 release-hardening report — 0.10.0-rc.2

Date: 12 November 2026

## Scope

Review and verify the React migration candidate, preserve the known-good legacy fallback, validate canonical content and video assets, and exercise the Nginx deployment configuration.

## Verified in this environment

| Check | Result |
|---|---:|
| Legacy Node tests | 35/35 PASS |
| React domain/data tests | 8/8 PASS |
| Offline structural TypeScript check (local TS 5.8 + ambient shim) | PASS |
| Content and JSON Schema validation | PASS: 51 scenarios, 204 rationales, 51 explanations, 38 numbered references |
| Video package validation | PASS: 51 scripts/storyboards/prompts/captions; 0 MP4 generated; 0 ready |
| High-confidence secret-pattern scan | PASS (not a complete secret scanner) |
| Canonical React asset synchronization | PASS |
| Legacy static build | PASS (copy-based, not Vite bundle) |
| Legacy distribution smoke | PASS: 215 routes |
| CycloneDX SBOM generation | PASS; direct React toolchain dependencies only until lockfile resolution |
| Nginx configuration syntax (`nginx -t` in isolated test prefix) | PASS |
| Nginx configuration syntax (`nginx -t` in isolated test prefix) | PASS |

## Dependency-backed React build limitation

`npm install --package-lock-only --ignore-scripts --no-audit --no-fund` in `frontend/react-app` timed out because the environment could not complete npm registry access. No `package-lock.json` was generated. The React app has not had a real dependency-backed Vite build, official React typecheck, or browser runtime test. The offline TypeScript shim check is a useful structural check only and must not be represented as a production build.

## Deployment configuration

`deploy/nginx-react.conf` and `deploy/snippets/cyberaware-security-headers.conf` are authored. They require validation in the target Nginx version/container, TLS termination, host allow-list, monitoring, CSP reporting and operational rollback configuration before production.

## Remaining release blockers

1. Generate and review `frontend/react-app/package-lock.json` in a network-enabled controlled environment; switch CI to `npm ci`.
2. Run actual dependency-backed TypeScript and Vite build; smoke-test `frontend/dist-react`.
3. Validate Nginx config in the deployment image and run container-level route/header/range tests.
4. Run Chromium, Firefox and WebKit browser tests on desktop/mobile; verify keyboard, screen reader, 200%/400% zoom, contrast and reduced motion for WCAG 2.2 AA.
5. Obtain independent cybersecurity SME and instructional-design approval for all 51 scenarios and supporting scripts.
6. Generate and review actual 51 MP4s through an approved provider; currently 0 exist.
7. Conduct a properly approved learner evaluation before making learning-effectiveness claims.

## Release decision

**0.10.0-rc.2 is a migration candidate, not a production release.** The dependency-free legacy demonstrator remains the verified runnable artifact.
