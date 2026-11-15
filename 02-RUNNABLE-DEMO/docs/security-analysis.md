# CYBERAWARE 3D — Phase 3 Security and Privacy Analysis

## Scope

This analysis covers the current local, static demonstrator. It is not a production penetration test or a full OWASP ASVS assessment.

## Assets and trust boundaries

| Asset | Location | Trust boundary |
|---|---|---|
| Question bank, explanations, video manifest | Static JSON in frontend public data | Public/read-only client content |
| Narration scripts and captions | Static Markdown/WebVTT | Public/read-only client content |
| Progress and session summaries | Browser local storage | User-controlled client storage; progress rows are now size-bounded and schema-sanitized before use |
| WebGL globe | Browser GPU context | Local rendering; no remote telemetry |
| Static server | Node built-in HTTP server | Loopback-only by default; explicit host override required for LAN access; no identity boundary |

## Threats and controls

| Threat | Current control | Residual risk / required follow-up |
|---|---|---|
| HTML/script injection through question content | HTML-escape dynamic strings before template insertion; no HTML from AI is accepted | Add CSP nonce/hash strategy and automated XSS tests during React migration |
| Accidental credential collection | No credential forms or backend endpoints; all scenarios are fictional | Verify all future simulation inputs remain synthetic |
| Data exfiltration through analytics | No remote analytics; progress only in local storage | User/device profile still contains local learning history; explain clearing and shared-device risks |
| Third-party font request | External font loading removed | No remote external requests should be added without privacy review |
| Clickjacking | `X-Frame-Options: DENY` and CSP `frame-ancestors 'none'`; response headers also apply to errors | Validate headers on production hosting |
| MIME sniffing | `X-Content-Type-Options: nosniff` and explicit static MIME map | Maintain MIME mapping when media formats are added |
| Cross-origin permissions | Restrictive camera, microphone and geolocation policy | Reassess only if a legitimate feature needs access |
| Path traversal and symlink escape | Decoded path validation, resolved-root containment after realpath, and symlink-outside-root regression test | Re-test on deployment platform; use a managed static host/CDN for production |
| Correct answer exposure | All question data is delivered client-side | The app is a formative learning tool, not a secure exam or proctored assessment |
| Video tampering / false readiness | Player only renders when manifest asserts both ready state and media file presence | Add hash/checksum and server-side media validation before release |
| Inaccurate AI educational content | Human review status is retained in manifest; drafts are clearly marked | SME approval and reference-by-claim review are still outstanding |

## Sensitive data policy

The application must never request or store real passwords, OTPs, session cookies, API keys, private messages or confidential organizational data. Do not use production attack data in scenario examples. Keep learner identity out of analytics unless a future approved research protocol requires a pseudonymous study identifier.

## Additional local-demo hardening (Phase 8)

- The demo server now binds to `127.0.0.1` by default. Explicit `HOST=0.0.0.0` binding is an operator decision and prints a network-exposure warning.
- Static paths are resolved through `realpath`; any symlink target outside the application root is rejected.
- NUL/control bytes and backslash path forms are rejected. 405, 404 and 400 responses use the defensive response-header policy.
- Learner progress JSON has a maximum input length and fields are validated before being used for mastery calculations or rendered UI.
- Secondary small-text colors were improved and five selected foreground/background pairs are checked by automated contrast regression tests. This does not prove full WCAG 2.2 AA conformance.

## Production blockers

Do not expose `server.mjs` directly to the public internet as a production service. Before deployment, add HTTPS and HSTS, production-grade static hosting, immutable/cache-aware asset headers, a reviewed CSP, automated security scanning, dependency inventory, logging/retention policy and an incident-response owner. If accounts or cloud sync are introduced, add a threat model for authentication, authorization, session handling, CSRF, rate limiting, data retention, backup and deletion.
