# CYBERAWARE 3D — Phase 14 release hardening

**Release candidate:** 0.10.0-rc.7  
**Date:** 13 November 2026  
**Scope:** Distribution integration acceptance, deterministic release packaging, and CI collision/reliability improvements. Video production remains excluded.

## Changes delivered

### 1. Test the exact static distribution artifact
Added `npm run smoke:packaged`. It launches `frontend/dist/server.mjs` from the distribution directory on a dynamically allocated loopback port and checks:
- `/healthz` GET and HEAD responses, no-store behavior and readiness;
- root HTML and security headers;
- canonical question-bank delivery (45 core questions);
- HEAD response semantics;
- missing-route 404 behavior;
- unsupported-method 405 and Allow header;
- graceful SIGTERM shutdown.

This closes a gap where the source server and copied distribution routes had been tested separately, but the exact copied distribution server was not launched as an acceptance gate.

### 2. Remove fixed-port collisions from server tests
The source server and shutdown integration tests now allocate free loopback ports dynamically rather than assuming ports 4386 and 4387 are unused. This reduces flaky CI failures when test jobs execute in parallel or a developer already has a service running.

### 3. Reproducible release packaging
Added `scripts/package-release.mjs` and `npm run package:release`. It creates:
- the complete project source ZIP;
- the dependency-free runnable application demo ZIP;
- SHA-256 checksum sidecars.

The full source archive excludes Git metadata, `node_modules`, test results, Playwright reports, `.env*` files and OS metadata. The app demo package includes the legacy application, canonical static assets, deployment examples, backup script and operational documentation. The script validates ZIP integrity before writing checksums.

Core GitHub Actions now runs the packaged-distribution smoke and, on main/master pushes or manual dispatch, builds and uploads the release ZIPs and checksums. PRs still run the validation suite but do not publish release artifacts.

## Local verification

| Check | Result |
|---|---:|
| Legacy Node tests | 37/37 passed |
| React domain/data tests | 17/17 passed |
| Offline structural TypeScript check | Passed (TypeScript 5.8 + ambient shims; not official framework typecheck) |
| Canonical content validation | Passed |
| Dependency-free static build | Passed (copy-based) |
| Static distribution smoke | 215 routes passed |
| Packaged distribution server smoke | Passed |
| Nginx live HTTP smoke | 8/8 passed (including unprivileged temp-path isolation) |
| systemd unit syntax | Passed |
| Backup archive smoke | Passed |
| Workflow YAML syntax | Passed |
| High-confidence secret-pattern scan | Passed |
| ZIP creation and integrity | Passed |

The packaged distribution test was run locally against the copied `dist` server and completed its HTTP and graceful-shutdown checks. A system Chromium executable and Python Playwright package exist in the environment, but browser navigation to the local app is blocked by the environment's administrator policy. No cross-browser or axe result is claimed.

## Remaining release gates

1. npm registry DNS resolution is unavailable in this authoring runtime. The React package lockfile could not be generated; no fabricated lockfile is included.
2. Network-enabled CI must run `npm ci`, high-severity `npm audit`, the official TypeScript 7 project build, Vite 8.3.8 production build and React distribution smoke.
3. Playwright/axe desktop and mobile browser tests remain configured but unexecuted locally; inspect CI reports and resolve all critical/serious accessibility findings.
4. Complete manual keyboard, screen-reader, zoom, contrast and reduced-motion review.
5. Validate TLS/HSTS, monitoring, off-host backup replication, restore and rollback on the target host.
6. Complete independent cybersecurity/instructional-design review and learner evaluation.

## Release decision

The dependency-free demonstrator is verified, including its copied distribution server. The React migration remains a release candidate and is not production-approved until the network-enabled build, dependency audit, browser acceptance and deployment checks pass.

**Video generation, provider integration, MP4 creation and media review remain explicitly deferred by the project owner.**
