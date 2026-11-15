# Proposed Technical Architecture — CYBERAWARE 3D

**Status:** Hybrid. A dependency-free static demonstrator is implemented in `frontend/`; this document records the proposed target architecture (React/TypeScript/Vite plus optional backend) and migration path.  
**Date:** 12 November 2026.

## 1. Architecture principles

1. Research and learning content are canonical data, separate from UI code.
2. 3D is optional progressive enhancement; core learning must work in 2D.
3. Video is supplementary; written explanation remains available.
4. AI providers are replaceable and accessible only from server-side integration.
5. The first version avoids unnecessary infrastructure.
6. Analytics are minimized and never used to infer a definitive real-world risk score.
7. Question, explanation, video and reference relationships use stable IDs.

## 2. Recommended stack

| Layer | Proposed technology | Reason |
|---|---|---|
| Frontend | React + TypeScript + Vite | Component architecture, static deployment and typed content |
| Styling | Tailwind CSS plus accessible primitives | Responsive consistency; verify focus and keyboard behavior |
| 3D | Three.js + React Three Fiber | Reusable declarative scene components; lazy loading |
| Content | Versioned JSON + JSON Schema/Zod validation | Static question bank and build-time validation |
| Video | HTML5 video player with WebVTT captions | Browser support, transcript and playback controls |
| Backend | Optional Node.js API (Fastify or Express) | Only for accounts, private AI calls or cohort management |
| Persistence | SQLite for single-instance demo; PostgreSQL for shared deployment | Add storage only when needed |
| Testing | Vitest, Testing Library, Playwright, axe-core | Unit, UI, E2E and accessibility checks |
| CI | GitHub Actions | Lint, type check, tests, build, audit, secret scan and SBOM |
| AI provider | Backend adapter interface | Replaceable vendor and secure secret handling |

## 3. Logical modules

- `learning-paths`: level definitions, topics, objectives and prerequisites.
- `question-engine`: question selection, answer handling and duplicate-submission prevention.
- `explanation-engine`: correct/incorrect rationales, references and action summary.
- `video-service`: manifest lookup, readiness state, player configuration and fallback.
- `progress-engine`: score aggregation and per-objective history.
- `recommendation-engine`: transparent rules and recommendation rationale.
- `visualization-3d`: optional React Three Fiber scenes and 2D equivalents.
- `dashboard`: progress, objective performance, recommendations and achievements.
- `content-validation`: schema, ID uniqueness, reference resolution and path validation.
- `privacy-analytics`: aggregate counts and limited pseudonymous progress, if enabled.
- `security-controls`: server validation, rate limiting, access control, secure sessions and audit events.

## 4. Proposed project structure

```text
CYBERAWARE-3D/
├── research/
│   ├── research-paper.md
│   ├── literature-review.md
│   ├── research-gap-analysis.md
│   ├── research-methodology.md
│   ├── references.bib
│   ├── research-to-feature-map.md
│   ├── traceability-matrix.csv
│   └── search-log.md
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── features/
│   │   │   ├── learning-paths/
│   │   │   ├── questions/
│   │   │   ├── explanations/
│   │   │   ├── videos/
│   │   │   ├── dashboard/
│   │   │   ├── recommendations/
│   │   │   └── achievements/
│   │   ├── scenes/
│   │   ├── content/
│   │   ├── services/
│   │   ├── styles/
│   │   └── tests/
│   └── public/
├── backend/                    # Optional until persistence/AI API is required
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── providers/
│   │   ├── middleware/
│   │   └── schemas/
│   └── tests/
├── content/
│   ├── questions/
│   ├── explanations/
│   ├── learning-objectives/
│   └── video-manifest.json
├── public/
│   ├── videos/
│   │   ├── beginner/
│   │   ├── intermediate/
│   │   ├── advanced/
│   │   └── expert/
│   ├── models/
│   └── textures/
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── e2e/
│   └── accessibility/
├── docs/
├── evidence/
├── .github/workflows/
├── .env.example
├── .gitignore
└── README.md
```

## 5. Content model and manifests

### Question record (schema illustration only; not the canonical JSON shape)

```json
{
  "questionId": "PHISH-B01",
  "level": "beginner",
  "category": "phishing_indicators",
  "learningObjectiveId": "LO-PHISH-01",
  "scenario": "A fictional message asks the learner to verify an account immediately.",
  "options": [
    { "id": "A", "text": "Open the link and enter credentials" },
    { "id": "B", "text": "Verify through the official site or known channel" },
    { "id": "C", "text": "Forward the message to friends" },
    { "id": "D", "text": "Reply with an OTP" }
  ],
  "correctOptionId": "B",
  "rationales": {
    "A": "Unsafe: the unexpected link may lead to an impostor site.",
    "B": "Correct: use a trusted route independent of the message.",
    "C": "Unsafe: forwarding may expose others to the message.",
    "D": "Unsafe: never disclose OTPs or authentication secrets."
  },
  "referenceIds": ["R1", "R6", "R7"],
  "explanationId": "EXPL-PHISH-B01",
  "videoId": "VIDEO-PHISH-B01",
  "defensiveAction": "Do not use the message link; report it and navigate independently.",
  "estimatedSeconds": 60,
  "reviewStatus": "draft"
}
```

This JSON is an architectural illustration, not the canonical field schema. The canonical 45-question draft lives in `content/questions/question-bank.json` and is validated by `tests/content/validate_content.py`. The full item drafts remain pending cybersecurity SME and instructional-design review.

### Video manifest entry (schema illustration)

```json
{
  "videoId": "VIDEO-PHISH-B01",
  "questionId": "PHISH-B01",
  "explanationId": "EXPL-PHISH-B01",
  "title": "Recognizing a phishing request",
  "durationSeconds": 45,
  "scriptPath": "content/videos/VIDEO-PHISH-B01.md",
  "videoPath": "public/videos/beginner/phish-b01.mp4",
  "captionsPath": "public/videos/beginner/phish-b01.en.vtt",
  "transcriptPath": "content/videos/VIDEO-PHISH-B01.transcript.md",
  "referenceIds": ["R1", "R6", "R7"],
  "status": "script_pending",
  "provider": null,
  "modelVersion": null,
  "reviewedAt": null
}
```

The current manifest uses explicit draft/not-generated states. Future service statuses may include `script_pending`, `generation_pending`, `rendering`, `review_pending`, `ready` and `failed`. `ready` is permitted only after the file exists and passes media validation, caption checks and human content review.

## 6. Adaptive recommendation baseline

An interpretable recommendation engine should compute summaries per learning objective, not a single opaque personal risk score. Candidate inputs include first-attempt accuracy, recent accuracy, item difficulty, time since last successful retrieval, delayed practice result and number of unique items attempted.

Recommendation outputs:
- `review_explanation`
- `practice_new_item`
- `schedule_retrieval`
- `ready_for_next_level`
- `continue_current_level`

Each recommendation should include the objective and rule that triggered it. The mastery threshold must be configurable and pilot-calibrated.

## 7. Security architecture

- Keep AI-provider keys in server-side environment or managed secrets only.
- Never place private keys in `VITE_*` variables or frontend bundles.
- Validate request bodies and query parameters with schemas.
- Apply server-side authorization for saved learner records.
- Protect sessions using secure, HttpOnly and appropriate SameSite cookies if cookie authentication is used.
- Apply CSRF mitigation where applicable; rate-limit authentication and provider endpoints.
- Encode untrusted text before rendering; do not accept arbitrary HTML from generated content.
- Use content-security policy and secure transport in production.
- Prefer no learner file uploads in version 1; validate file size, type and storage path if later enabled.
- Avoid storing raw IP addresses, message content, passwords or secrets in analytics.
- Scan dependencies and secrets in CI; generate an SBOM; pin third-party actions to immutable commit SHAs when practicable.
- Maintain a security contact and incident response path.

## 8. Accessibility and 3D fallback

- Main learning flow is semantic HTML and keyboard-operable without 3D.
- 3D is illustrative unless a fully keyboard-accessible alternative is provided.
- Provide textual description for every scene and a 2D equivalent.
- Respect reduced-motion preferences and offer a user setting.
- Provide captions, transcripts and accessible video controls.
- Do not autoplay sound.
- Test focus order, contrast, status announcements, labels and screen-reader feedback against WCAG 2.2 AA.

## 9. Performance strategy

- Split the 3D bundle and load it only on 3D screens.
- Compress textures and use low-poly assets.
- Set renderer quality based on device capability and preference.
- Avoid continuous render loops when scenes are static.
- Provide static diagrams if WebGL is missing or blocked.
- Use adaptive video bitrate or multiple encodings where supported.
- Lazy-load videos and preload metadata only.
- Record measured performance by device/network class; desktop results do not represent mobile performance.

## 10. CI and quality gates

1. Install dependencies using lockfile.
2. Lint.
3. Type check.
4. Validate question and video JSON schemas.
5. Check unique IDs and cross-manifest relationships.
6. Unit and integration tests.
7. Production build.
8. E2E tests.
9. Accessibility tests.
10. Dependency audit and SAST.
11. Secret scan.
12. SBOM generation.
13. Upload test reports and build artefacts.

Use minimal workflow permissions and avoid leaking secrets in logs. OWASP Top 10:2025, NIST SSDF and NIST CSF 2.0 provide implementation/security vocabulary, not a substitute for application-specific threat modelling and verification.

## 11. API boundary (only if backend becomes necessary)

Candidate routes:
- `GET /api/v1/content/levels`
- `GET /api/v1/questions/:questionId`
- `GET /api/v1/videos/:videoId`
- `GET /api/v1/progress` (authenticated)
- `PUT /api/v1/progress` (authenticated, validated)
- `GET /api/v1/recommendations` (authenticated or local-only)
- `POST /api/v1/video-jobs` (admin-only, server-side provider)
- `GET /api/v1/video-jobs/:jobId` (admin-only)

Do not create a video-generation endpoint until provider, authorization, cost controls, content review and abuse controls are specified.

## 12. Architecture decisions still open

- Institutional identity provider and account requirement.
- Whether the initial demo needs server persistence.
- Video-generation provider, usage rights and hosting.
- Intended audience age range and supported languages.
- Publication venue and formal evaluation design.
- Data-retention period and research ethics requirements.
- Mobile low-bandwidth content targets.
