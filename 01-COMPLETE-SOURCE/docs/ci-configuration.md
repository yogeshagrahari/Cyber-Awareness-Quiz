# CI Configuration — Phase 19

The active workflow is `.github/workflows/cyberaware-ci.yml`. It runs the legacy compatibility suite and React migration suite on Node.js 22.23.5, 24.22.3 and 26.13.1, then exposes stable non-matrix gate checks for branch protection. Third-party GitHub Actions are pinned to immutable commit SHAs, checkout credentials are not persisted, and workflow permissions are read-only.

## Required repository checks

Configure branch protection or a ruleset to require these exact check names:

- `Legacy validation gate` — succeeds only when all three legacy Node.js matrix legs pass.
- `React, browser and accessibility gate` — succeeds only when all three React Node.js matrix legs pass, including the committed lockfile check, `npm ci`, `npm audit --audit-level=high`, React tests, official TypeScript build, Vite distribution smoke, five Playwright desktop/mobile profiles and axe scans.

The `package-release` job depends on both gates and is limited to `main`/`master`. It downloads the validated React build and CycloneDX SBOM, rebuilds the ignored legacy `frontend/dist/` in its own clean checkout, smoke-tests that distribution, generates a source inventory, and produces full-source, legacy-demo and React-app ZIPs. It then extracts both application ZIPs and runs their dedicated build smoke tests against the extracted distributions before uploading archives and SHA-256 checksums. This prevents the release job from depending on an ignored build directory or relying only on tests from a different runner.

## Dependency lockfile workflow

`.github/workflows/react-frontend-ci.yml` is manual-only. It creates `frontend/react-app/package-lock.json` and `dependency-audit.json` as review artifacts. A maintainer must inspect resolved versions, registry origins and audit findings, then commit the reviewed lockfile. The standard CI never regenerates the lockfile; it fails closed when the committed lock is absent or inconsistent with `package.json`.

The source-only local package is not a production release. The full React release archive is created only in CI after the React build, browser acceptance and accessibility workflow gates pass.

## Package inventory policy

The source manifest and release verifier share exclusions for dependency folders, release output, test/browser reports, Python bytecode/cache, tool caches, coverage output, virtual environments, `.env*` paths and `.DS_Store`. Symbolic links are rejected. The archive packager checks that its non-directory file list equals the complete manifest inventory plus `package-manifest.json`; it rejects missing, extra, duplicate, excluded and path-traversal entries.

## Permissions and limitations

Both workflows use `contents: read`. No deployment credentials, publishing tokens or environment secrets are required by these workflows. This repository snapshot cannot configure branch protection settings, trigger GitHub Actions in the owner's remote repository, or verify actual GitHub run results. The high-confidence source secret scanner is not a comprehensive secret-management or SAST solution. Playwright/axe CI is automated evidence, not a replacement for manual accessibility review.
