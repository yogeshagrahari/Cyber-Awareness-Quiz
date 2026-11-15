# CYBERAWARE 3D — Phase 8 Security and Accessibility Hardening

**Release:** 0.9.0  
**Date:** 12 November 2026  
**Scope:** Local demo server, client-side progress integrity, small-text color tokens, release reproducibility

## 1. Summary

Phase 8 fixes reproducible local-demo security and accessibility-source issues. It is not a production security certification, penetration test or complete WCAG 2.2 AA audit.

## 2. Security changes

### Network exposure

The static Node server now binds to `127.0.0.1` unless an operator explicitly configures `HOST`. The optional `0.0.0.0`/`::` binding logs a warning. The local demo is not suitable for public internet hosting.

### Path containment

The server decodes and validates URL paths, rejects NUL/control bytes and backslashes, resolves the candidate through `realpath`, and checks that the resolved path remains below the real application root. A symlink inside `public/` pointing to an external file is not served.

### Response policy

400, 404 and 405 responses now receive the defensive header policy. The policy includes `nosniff`, strict referrer behavior, CSP, anti-framing headers, same-origin resource policy, restricted permissions and an explicit `Allow` header for method rejection.

### Media range behavior

GET and HEAD requests for MP4 resources support valid byte ranges. HEAD returns the same 206 range metadata as GET but no body. Invalid ranges return 416.

### Local progress integrity

Progress data loaded from browser storage is treated as untrusted. Oversized values are rejected; question IDs, learning levels, category/objective lengths, selected-option IDs, timestamps and boolean outcomes are validated. Duplicate question attempts are normalized so only the earliest valid record counts toward mastery.

## 3. Accessibility source corrections

Several small secondary labels used colors with insufficient contrast against their dark surfaces. These were raised and selected foreground/surface pairs are now checked in the automated suite against the 4.5:1 WCAG AA normal-text threshold.

This check covers five declared tokens only. It does not audit every rendered component state, focus indicator, text overlay, chart, video control, zoom level or assistive-technology interaction.

## 4. Verification

Commands run from `frontend/`:

```bash
npm test
npm run validate:content
npm run security
npm run video:validate
npm run build
npm run smoke:dist
npm run sbom
python3 ../scripts/generate_package_manifest.py
```

Expected local checks: 35 Node tests, 45 core questions, six Expert Challenge scenarios, 51 scripts/storyboards/prompts/caption drafts, zero generated MP4 claims, static distribution smoke test and integrity inventory.

## 5. Residual issues

- Real browser navigation is blocked by the execution runtime's administrator policy. Visual rendering and interactive WebGL behavior cannot be confirmed here.
- Full keyboard-only, screen-reader, 200%/400% zoom, reflow, focus order, captions and WCAG 2.2 AA checks remain outstanding.
- No generated MP4s exist. The provider-independent queue and import gates remain prepared, but no provider job has been submitted.
- Independent cybersecurity and instructional-design approval remain outstanding.
- The current implementation is a dependency-free static demonstrator, not the preferred React + TypeScript + Vite architecture.
- Public deployment still requires HTTPS/HSTS, a managed static host or reviewed reverse proxy, monitoring, operational ownership, security review and an incident-response plan.

## 6. Release decision

**Internal demonstrator / technical review only. Not approved for production release.**
