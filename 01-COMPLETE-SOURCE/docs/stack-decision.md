# Phase 3 Stack Decision

**Date:** 12 November 2026  
**Status:** Implemented demonstrator; React/Vite migration remains open.

## Decision

The current demonstrator uses native browser ES modules, semantic HTML, CSS, the WebGL 1.0 API, and a small Node.js built-in HTTP server. It has no third-party runtime or build dependencies. This is a deliberate temporary deviation from the preferred React + TypeScript + Vite stack.

## Reason

An attempt to install React, Vite, TypeScript and supporting packages did not complete because the package registry did not respond in the current environment. No partial dependency installation was accepted as a working build. To provide an executable deliverable rather than an unverified React source tree, the first demonstrator was implemented using browser-native modules and tested with Node's built-in test runner.

## Trade-offs

**Benefits:** no package installation; low dependency and supply-chain surface; fast local startup; content-driven modules; works as a static site; native browser video controls can be enabled when reviewed media exists.

**Costs:** no React component framework; no TypeScript compiler or Vite bundling; no lazy-loaded Three.js / React Three Fiber scene; DOM rendering uses string templates with explicit HTML escaping; this architecture will need refactoring if the project grows into a multi-user product.

## Migration plan

1. Keep the current JSON files as canonical content and preserve all question, explanation and video IDs.
2. Move `core.js` logic into typed domain modules with unit tests unchanged.
3. Introduce React components for navigation, dashboard, pathways, quiz, explanation, progress and research references.
4. Move the WebGL globe and any future React Three Fiber scenes behind an optional lazy-loaded visualization boundary.
5. Validate parity against the current behavior and ensure the semantic 2D experience remains available.
6. Add a package lockfile, dependency audit and production build only after dependency installation is available.

## Non-goals of this phase

No user accounts, server-side progress, AI-provider integration, real-time threat feed, remote analytics, public deployment or generated video files are included.
