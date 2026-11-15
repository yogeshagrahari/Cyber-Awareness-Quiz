# Phase 9 — React + TypeScript + Vite migration (0.10.0-rc.1)

Date: 12 November 2026

## Scope

Introduce a React + TypeScript + Vite application as the new frontend architecture without deleting the previously verified dependency-free demonstrator. The transition uses a strangler pattern: the React shell owns navigation, question delivery, first-attempt analytics, topic practice, research sources, achievements, settings, video gating and written fallbacks. The legacy WebGL simulation environment remains available as a separate same-origin page while its procedural 3D interactions are migrated component-by-component.

## Implemented

- React 19.3.1 + React DOM 19.3.1, TypeScript 7.0.2, Vite 8.3.7 and `@vitejs/plugin-react` 6.3.0 are pinned in `frontend/react-app/package.json`.
- Typed domain model, strict app/node TypeScript project references, React entry point, responsive application shell and accessible navigation.
- React views for overview, progressive paths, topic practice, assessment, progress, research references, achievements and settings.
- 51 canonical questions, 51 explanation records, 51 video mappings and 38 numbered references are loaded and validated at runtime.
- First-attempt mastery, duplicate-attempt handling, 75% / 10-answer unlock gates, topic recommendations and local-storage sanitization are implemented in typed domain helpers.
- Every answer explanation includes all four option rationales, a key takeaway, defensive action and linked source references.
- Question-level player only exposes media when the manifest is `ready`, `mediaFileExists` is true, `reviewStatus` is `approved`, and `mediaValidated` is true. Otherwise, the user receives a written transcript/script fallback.
- Video path helpers reject traversal and non-canonical paths.
- The simulation page opens the existing legacy simulation host in a separate tab. It is not embedded in an iframe, preserving `X-Frame-Options: DENY` and `frame-ancestors 'none'`.
- Canonical content sync validates the 51 question/media mappings, maps reference registry records into the frontend schema, copies the latest scripts/storyboards/prompts/captions, copies any approved media, and mirrors the legacy activity source.
- Nginx static deployment configuration and a React CI workflow were added.

## Automated validation performed in the authoring environment

- Local TypeScript structural check using the globally available TypeScript 5.8 compiler and a temporary React/Vite ambient shim: PASS.
- React domain/data tests on Node 22.16 using experimental TypeScript stripping: 7/7 PASS.
- Canonical data validation in React tests: 51 questions, 51 explanations, 51 video mappings and 38 references PASS.
- Media gating/path traversal tests: PASS.
- Canonical asset sync command: PASS; 38 references and 51 question/media packages synchronized.

## Not verified in this environment

The npm registry could not be reached (`EAI_AGAIN registry.npmjs.org`) and no React/Vite dependencies were cached. Consequently:

- `npm install` did not complete.
- A Vite production bundle was not generated.
- Package-lock generation and `npm ci` repeatability are pending.
- Actual React/@types/Vite typechecking was not run; the local shim check is structural, not a substitute for the official dependency-backed typecheck.
- Browser rendering, WebGL interaction, cross-browser behavior and full assistive-technology checks were not performed.

The React package is an authored migration release candidate, not a verified Vite-built production release. The previous dependency-free demonstrator remains the verified fallback.

## Run after registry access is available

```bash
cd frontend/react-app
npm install
npm run test
npm run typecheck
npm run build
npm run smoke:build
```

Commit the generated `package-lock.json` after dependency review. Subsequent CI and production builds should use `npm ci` against that committed lockfile.
