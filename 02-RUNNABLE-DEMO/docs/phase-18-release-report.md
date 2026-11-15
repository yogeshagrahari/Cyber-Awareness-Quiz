# Phase 18 release report — 0.10.0-rc.11

**Scope:** deterministic source-manifest generation, symlink safety, manifest-policy regression tests, and complete React dependency-SBOM transfer into the gated release job. Video generation, provider integration and media review remain deferred.

## Issues corrected

1. **Manifest generator/verifier policy drift:** The verifier excluded `.DS_Store`, while the Python generator did not. The generator and verifier now use the same exclusions for `.DS_Store`, `.env*`, Git metadata, dependencies, generated release artifacts and test outputs.
2. **Symlink ambiguity:** The Python generator previously followed file symlinks through `Path.is_file()`. It now rejects symbolic links, matching the JavaScript verifier's fail-closed behavior.
3. **Missing generator regression coverage:** Added Python tests for exclusion consistency and symlink rejection, and added them to the required legacy CI matrix.
4. **React SBOM not included in release source evidence:** The successful Node 26 React CI leg already emitted a CycloneDX SBOM, but the separate release job downloaded only the React build. The release job now downloads the SBOM artifact, validates CycloneDX format and non-empty components, and does so before generating the source inventory. Thus the SBOM is included in the full-source archive and its manifest when the external React CI succeeds.
5. **Release metadata:** Advanced both frontend package manifests and React footer to `0.10.0-rc.11`; documented the new workflow and checks.

## Local validation

Local checks run in the current authoring environment. They do not substitute for the pinned Node.js 22.23.5/24.22.3/26.13.1 GitHub matrix or network-backed React build.

- Legacy Node tests: 44/44 passed (including the new release-workflow SBOM test).
- React domain/source tests: 17/17 passed.
- Python release-manifest regression tests: 2/2 passed.
- Canonical content validation and expanded secret-pattern scan: passed.
- Offline structural TypeScript check: passed with the locally available TypeScript 5.8.3 ambient-shim configuration; not the official TypeScript 7 project typecheck.
- Legacy copy-based static build: passed; 215 distribution routes passed smoke testing.
- Packaged distribution server smoke: passed.
- Nginx live HTTP smoke: 8/8 passed.
- Protected backup smoke and systemd unit validation: passed.
- Both GitHub workflow YAML files parsed; JavaScript scripts passed syntax checks.
- Source manifest generation and verification: 1,143 files; SHA-256/size inventory passed.
- Full-source and legacy-demo ZIP integrity and checksum verification: passed. The extracted application-demo server passed health, root, 45-question bank, POST rejection and graceful SIGTERM checks.

The current local source-only handoff cannot contain the resolved React SBOM because that file is produced only by the successful network-enabled React CI leg. The main CI release job fails closed if the SBOM artifact is missing or malformed. No React production build, lockfile or SBOM is fabricated locally.

## Remaining external release gates

- Generate, review and commit `frontend/react-app/package-lock.json` using the manual workflow.
- Pass `npm ci`, `npm audit --audit-level=high`, official TypeScript 7, Vite build and React distribution smoke on the pinned Node matrix.
- Pass desktop Chromium/Firefox/WebKit, mobile Playwright and axe scans; complete manual accessibility review.
- Confirm the React build and CycloneDX SBOM artifacts are uploaded by the successful Node 26 leg and downloaded by the release job.
- Verify production TLS/HSTS, monitoring, off-host backup, restore/rollback, and obtain independent security/instructional-design review and learner evaluation.

## Release decision

**0.10.0-rc.11 is not production-approved.** The local source-only archive and dependency-free legacy demo are internal handoff artifacts. The React production ZIP remains unavailable until the committed lockfile and all required React/browser/accessibility CI gates pass. Video production remains explicitly deferred.
