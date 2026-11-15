# CYBERAWARE 3D — Interactive Simulation Lab (Phase 6)

**Release:** 0.7.0  
**Date:** 12 November 2026  
**Implementation:** Native browser ES modules + locally rendered WebGL wireframes; no external graphics dependency.

## Purpose

Phase 6 adds four guided, defensive exercises that move beyond multiple-choice recall into applied inspection and decision sequencing. The exercises are fictional and run entirely in the browser. They do not send network traffic to target systems, collect credentials, request OTPs, or simulate an actual compromise.

## Simulations

| ID | Environment | Learner action | Completion condition | Linked question IDs |
|---|---|---|---|---|
| `phishing` | Supplier email inspection | Select four evidence-based indicators among six candidate details | Exact identification of four indicators; logo and polished grammar remain unselected | PHISH-B01, SENDER-B02, LINK-B03 |
| `password` | Password profile configuration | Set length to at least 16, uniqueness, password-manager use and MFA | All four educational profile checks pass | PASS-UNIQ-B04, PASS-MGR-B05, OTP-B06 |
| `mfa` | MFA fatigue response | Choose the safe action at each of three stages | Deny/report unexpected prompts; secure account by trusted route; preserve useful event context without secrets | MFA-FATIGUE-I05, ATO-I07, RESET-I13 |
| `incident` | Ransomware incident command | Choose the safe action at each of three stages | Isolate affected endpoint; report through approved channel; preserve evidence and follow authorized responders | IR-PRIORITY-A05, RANSOM-A12, LOGS-A10 |

## 3D implementation

`frontend/src/simulations.js` generates wireframe geometry and renders it through the browser WebGL 1 API. The scenes use procedural line geometry (cube, octahedron, ring and connected-node forms); no third-party 3D package, downloaded model, texture or external service is required. The user can rotate the visualization with pointer drag or arrow keys. Automatic motion is disabled by the reduced-motion preference. If WebGL or `ResizeObserver` cannot be initialized, the canvas is hidden and a CSS 2D illustration is shown.

The objects are educational illustrations, not interactive attack surfaces, live network topology, threat-intelligence feeds or technical visualizations of a real system. The assessment interactions are semantic HTML controls alongside the scene, not hit targets embedded in the WebGL canvas.

## State and privacy

The password exercise does not include a password text field. It stores only four boolean/numeric characteristics (length band, unique, manager, MFA) in in-memory state while the exercise is open. Persistent simulation progress stores only completion, best checklist score, attempt count and completion timestamp under `cyberaware3d.simulations.v1`. No input secret is requested or persisted. Local progress input is normalized against known simulation IDs and bounded numeric fields before display. The Settings reset action clears simulation progress together with quiz history and first-attempt data.

## Scoring semantics

- Phishing inspection uses exact-set evaluation: all four indicators must be selected and the two neutral details must not be selected.
- Password profile scoring is a four-check educational checklist, not a cryptographic entropy calculation, strength estimator, password audit or guarantee of security.
- MFA and incident-response sequences require the single correct defensive action at each stage. Wrong options provide feedback and permit retry without advancing the sequence.
- Completion records are engagement/progression metadata only. They do not indicate professional competence or prove real-world security behaviour.

## Evidence links

Question identifiers and numbered research references are displayed in each simulation's objective panel. The mapping is maintained in `SIMULATION_DEFS` in `frontend/src/simulations.js`; the underlying question bank and manuscript remain the canonical content sources.

## Limitations and future work

1. Independent cybersecurity subject-matter and instructional-design review remains required.
2. Browser-based keyboard, touch, screen-reader, zoom, contrast and visual-regression testing remains outstanding; automated source checks do not establish WCAG 2.2 AA conformance.
3. WebGL rendering was syntax-checked and integrated, but runtime rendering could not be verified in the current headless browser environment.
4. These are four focused scenario visualizations, not the complete 3D globe, network simulation, phishing desktop sandbox, password entropy model or account-authenticator emulator originally envisioned.
5. Three.js / React Three Fiber migration remains deferred because the current dependency-free project has no installed external runtime dependencies and the previous package registry attempt failed.
