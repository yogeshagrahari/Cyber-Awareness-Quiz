# CYBERAWARE 3D — Phase 11 release hardening

**Release candidate:** 0.10.0-rc.4  
**Date:** 12 November 2026  
**Scope:** Application and deployment hardening. Video generation and production were explicitly excluded at the project owner's request.

## Delivered

1. Added `/healthz` to the dependency-free Node demonstrator. GET and HEAD are supported, the response is only `ok`, and it is never cached.
2. Added a systemd service example with a dedicated unprivileged service account, loopback binding, read-only project files, private temporary storage, and systemd sandboxing.
3. Added a loopback-only Nginx reverse-proxy example with an explicit host allow-list, bounded proxy timeouts, and a health route. It is designed to sit behind a separately managed HTTPS ingress.
4. Removed FFmpeg installation and the video-production package validation step from the core CI workflow. Existing video authoring assets are retained, but no provider, MP4, or video production work was performed.
5. Updated React CI to generate a lockfile in its network-enabled runner, install with `npm ci`, run the official React typecheck/Vite build/smoke path, and preserve the generated lockfile as a short-lived artifact for review.
6. Added `.npmrc` policy for strict engine enforcement and exact package saves.
7. Added regression coverage for readiness endpoint GET/HEAD and no-store behavior.

## Verification

| Check | Result |
|---|---:|
| Legacy Node tests | 35/35 passed |
| React domain/data tests | 14/14 passed |
| Offline structural TypeScript check | Passed (shim-based, not official framework typecheck) |
| Canonical content and schema validation | Passed (45 core + 6 Expert Challenge) |
| Legacy static package build | Passed (copy-based, not Vite) |
| Legacy distribution smoke test | Passed (215 routes) |
| Readiness endpoint | Passed |
| Nginx live HTTP smoke | 8/8 passed |
| Nginx reverse-proxy syntax | Passed |
| systemd service syntax | Passed |
| High-confidence secret-pattern scan | Passed |

## Remaining technical gates

- **React dependency graph:** no committed `package-lock.json` yet. `npm view react@19.3.1` failed with `EAI_AGAIN registry.npmjs.org` in this environment. The React CI workflow now resolves the lockfile in a network-enabled runner and uploads it for review. It must be reviewed and committed before production use.
- **React production build:** official TypeScript/React typecheck, Vite build, and `dist-react` smoke test remain unverified here.
- **Browser acceptance:** direct Chromium headless navigation timed out in this runtime. Desktop/mobile browser coverage and WCAG 2.2 AA assistive-technology checks remain outstanding.
- **Production operations:** the systemd and Nginx examples pass syntax checks, but target-host TLS/HSTS, ingress, monitoring, backups, and rollback still require deployment-specific verification.
- **Human validation:** independent cybersecurity/instructional-design review and learner evaluation remain pending.

## Release decision

The dependency-free legacy demonstrator is the verified runnable application, now with a readiness endpoint and hardened deployment examples. The React migration remains a release candidate until its dependency lockfile, official build, and browser acceptance gates pass. This phase does not claim production approval.

## Explicitly deferred

Video-provider integration, MP4 generation, caption/media review, and video release acceptance are intentionally deferred for the project owner to complete later.
