# Phase 16 release report — 0.10.0-rc.9

**Scope:** committed React dependency lockfile enforcement, unified CI release gate, full dependency SBOM and release candidate hardening. Video provider integration, MP4 generation and media review remain explicitly deferred.

## Issue found in Phase 15

The Phase 15 workflow generated one lockfile and shared it across the Node.js matrix within a single run. Because the lockfile was not committed, a later run could resolve a different transitive dependency graph. Also, the legacy workflow packaged release ZIPs independently of the React/browser workflow, so a legacy-green run could publish archives while React verification had failed or was still running.

## Changes delivered

1. **Fail-closed lockfile validation.** Added `frontend/react-app/scripts/verify-lockfile.mjs` and `npm run verify:lockfile`. It requires a lockfile v3 or newer, checks root package name/version, verifies direct dependencies and engine metadata match `package.json`, restricts resolved tarballs to HTTPS on `registry.npmjs.org`, rejects workspace/bundled package bypasses, validates SHA-512/SHA-384/SHA-256 integrity digests, and refuses to run without resolved package entries in the lockfile.
2. **Manual lockfile refresh path.** Reworked `.github/workflows/react-frontend-ci.yml` into a manual-only lockfile refresh workflow. It uses Node.js 26.13.1 and npm 12.2.2, creates a package-lock and npm-audit JSON review artifact, validates its consistency and explicitly asks for human review and commit. It does not publish a release.
3. **Unified required CI workflow.** `.github/workflows/cyberaware-ci.yml` now includes both the legacy compatibility matrix and React matrix. The React matrix validates the committed lockfile, runs `npm ci`, high-severity audit, domain/content tests, official TypeScript check, Vite production build, distribution smoke, five Playwright desktop/mobile profiles and axe checks.
4. **Release packaging is downstream-gated.** The `package-release` job depends on both matrix jobs and only runs on `main` or `master`. It generates the source integrity manifest and produces the full-source ZIP, legacy demo ZIP and React app ZIP only after legacy and React jobs pass.
5. **Resolved dependency SBOM and React distribution.** The Node 26 React job generates a CycloneDX SBOM from the installed locked dependency tree and publishes it as a separate CI artifact alongside the React production distribution artifact. The downstream packaging job downloads that exact distribution and creates a separate React application ZIP, in addition to the full source and legacy compatibility demo ZIPs. This replaces the previous direct-dependencies-only inventory as the release evidence artifact.
6. **Stable branch-protection contexts.** Added non-matrix `legacy-gate` and `react-gate` aggregator checks so repository branch protection can require stable names without binding directly to individual matrix legs.
7. **Release artifact path and documentation accuracy.** Corrected the CI upload glob to `release-artifacts/*`, matching the release script output directory. Added four regression tests for the upload path, release dependency gates, React acceptance ordering and manual-only lock refresh. Updated branch-protection instructions to use the exact stable aggregator names and changed React setup guidance to require the reviewed lockfile before `npm ci`.
8. **Documentation and metadata.** Updated project metadata to `0.10.0-rc.9`, corrected Phase 15 wording to distinguish within-run consistency from cross-run reproducibility, and added this report and checklist.

## Local validation performed

Local results are recorded in `evidence/phase-16-local-validation.json`. They include 41/41 legacy tests (including four new release-workflow contract tests), 17/17 React domain/source tests, source syntax, workflow YAML/topology checks, lockfile verifier positive/negative fixtures, content validation, high-confidence secret scan, static legacy build, 215-route and packaged-server smokes, 8/8 Nginx checks, backup smoke, systemd validation and packaging/checksum checks. The local package is explicitly source-only; the strict production packaging mode correctly refuses to create archives while the React build artifact is absent.

The current authoring environment uses Node.js 22.16.0, below the project's declared minimum Node.js 22.23.5, and cannot reach the npm registry. Therefore it cannot create a genuine lockfile, run `npm ci`, perform `npm audit`, run the declared TypeScript 7/Vite toolchain, or generate the true resolved-dependency SBOM. Those are not reported as passing.

## External gates still open

- Run the manual lockfile refresh workflow; review the complete package diff, resolved registry origins and audit JSON; commit `frontend/react-app/package-lock.json`.
- Run unified CI on the committed lockfile and resolve all failures in both Node.js versions.
- Complete manual accessibility assessment with keyboard-only use, screen readers, 200–400% zoom, focus order, reduced motion and contrast verification.
- Configure GitHub branch protection to require the stable checks **Legacy validation gate** and **React, browser and accessibility gate**; keep `package-release` downstream-only.
- Verify production TLS/HSTS, monitoring, off-host backups and a restore/rollback drill on the actual deployment host.
- Obtain independent cybersecurity/instructional-design review and learner evaluation.

## Release decision

**0.10.0-rc.9 is not production-approved.** The source and CI architecture are prepared for an immutable dependency graph and a single release gate. React CI is intentionally blocked until a genuine reviewed lockfile is committed. Production archives must not be promoted until the unified workflow, browser/accessibility acceptance and deployment checks pass.
