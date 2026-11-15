# Phase 3 Local Verification Record

**Date:** 12 November 2026  
**Environment:** Node.js v22.16.0; npm 10.9.2; Python 3; local built-in HTTP server.

## Results

- `npm test`: 7 tests passed, 0 failed.
- `npm run validate:content`: CONTENT QA PASS for 45 questions and all linked explanation, reference, video-script, storyboard, prompt and WebVTT records.
- `npm run security`: SECRET PATTERN SCAN PASS for the implemented high-confidence patterns; this is not a full secret-scanning product.
- `npm run build`: copy-based static distribution created in `frontend/dist`.
- `npm run sbom`: CycloneDX 1.6 file created at `evidence/cyberaware3d-sbom.cdx.json`.
- `node --check`: passed for `src/app.js`, `src/core.js`, `src/globe.js`, `server.mjs`, `scripts/build.mjs` and `scripts/generate-sbom.mjs`.
- Source-server and built-distribution smoke tests: root HTML and question bank returned HTTP 200; source video-script route returned HTTP 200; HEAD returned HTTP 200; unsupported POST returned HTTP 405. The static distribution also served its main page and question bank successfully.

## Browser limitation

A visual Playwright test was attempted with the system Chromium binary and the Playwright-managed browser. The managed Chromium executable was not installed, and the system browser denied navigation with `ERR_BLOCKED_BY_ADMINISTRATOR`. Therefore, no visual screenshot, interactive browser E2E pass, runtime WebGL shader compilation pass or manual accessibility conformance result is claimed.
