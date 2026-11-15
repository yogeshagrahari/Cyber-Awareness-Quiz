# Phase 3 Test Matrix

**Execution date:** 12 November 2026

| Test ID | Test | Expected result | Actual result | Status |
|---|---|---|---|---|
| UNIT-01 | Parse malformed/incompatible local progress | Safe empty v1 state | Safe empty v1 state | PASS |
| UNIT-02 | Record correct/incorrect and duplicate answer | First unique response alone counts toward mastery | Verified | PASS |
| UNIT-03 | Progression threshold | At least 10 unique first attempts and >=75% accuracy | Boundary test verified | PASS |
| UNIT-04 | Weak-topic recommendation | Topic with >=2 attempts and <70% accuracy is suggested | Verified | PASS |
| DATA-01 | Question/explanation/video/reference ID parity | All 45 records resolve; no missing refs | 45/45 mappings; 36 numbered sources | PASS |
| DATA-02 | Generated-media status | No pending asset marked as generated/ready | 0 generated MP4s; manifest claim false | PASS |
| INT-01 | Local static server content routes | HTML, JSON, script routes return HTTP 200 | Verified with Node fetch | PASS |
| INT-02 | Response security headers | nosniff and CSP present | Verified | PASS |
| CONTENT-01 | Full content validator | Unique IDs, option rationales, source refs, storyboards, VTT timing pass | `CONTENT QA: PASS` | PASS |
| SYNTAX-01 | Node syntax checks | No parse errors | `node --check` passed on app, core, globe and server | PASS |
| SEC-01 | High-confidence secret-pattern scan | No private-key/AWS/GitHub/Google API token patterns | Scanner reports no findings | PASS |
| BUILD-01 | Create static distribution | Copy static app, data and server into `frontend/dist` | Build script completes; not bundled/minified | PASS |
| SBOM-01 | Generate CycloneDX SBOM | Valid JSON SBOM artefact created | File generated | PASS |
| E2E-01 | Visual browser flow: load, answer, feedback, continue, persist | All interactions work in browser | Not run; Chromium navigation blocked by environment policy (`ERR_BLOCKED_BY_ADMINISTRATOR`) | NOT RUN |
| WEBGL-01 | Compile and render globe shader | WebGL canvas renders; 2D fallback works | Not runtime-verified in browser | NOT RUN |
| A11Y-01 | Keyboard-only/manual screen-reader review | Main tasks operable and announced | Not performed | NOT RUN |
| A11Y-02 | WCAG 2.2 AA automated scan | No unresolved critical violations | Not performed | NOT RUN |
| RESPONSIVE-01 | Mobile/tablet/desktop visual regression | No clipping or unusable controls | CSS breakpoints authored; visual browser check not run | NOT RUN |
| MEDIA-01 | MP4 playback, caption synchronization and fallback | Validated media and transcript fallback | MP4s not generated; script fallback implemented | BLOCKED BY MEDIA |

## Reproduction

```bash
cd frontend
npm test
npm run validate:content
npm run security
npm run build
npm run sbom
node --check src/app.js
node --check src/core.js
node --check src/globe.js
node --check server.mjs
npm run sbom
```

Tests marked `NOT RUN` or `BLOCKED` must not be reported as passed.
