# CYBERAWARE 3D — Phase 7 Video Production and Integration

## Delivery status

- 133 question-to-video manifest mappings are present: 115 core learning questions and 18 Expert Challenge scenarios. The 51 pre-existing script/storyboard/prompt/caption packages remain; 82 new media tasks are explicitly deferred by owner direction and are not generation-ready.
- Every package includes a script with a canonical narration transcript, storyboard, visual prompt and WebVTT caption draft.
- The storyboard narration is synchronized from the script transcript; the script transcript is the only voiceover source of truth.
- No AI provider is configured in the application, no MP4 is included in this phase, and no media-generation claim is made.
- All 51 packages are currently blocked from provider submission until a human reviewer records pre-generation approval.

## Canonical data and synchronization

Canonical assets are stored under `/content/videos/{scripts,storyboards,prompts,captions}` and in the root manifests `/content/video-manifest.json` and `/content/expert-video-manifest.json`. The frontend copies are derived assets. `npm run build` refreshes `/frontend/public/data/videos` and the public manifests from those canonical sources before copying the static distribution. Never edit only the frontend mirror.

## Commands

Run from `/frontend`:

```bash
npm run video:validate
npm run video:sync
npm run video:queue
npm run build
npm test
npm run smoke:dist
```

`video:sync` validates files and synchronizes each storyboard's `narration` field from the script transcript. It does not approve content. `video:queue` creates:

- `/evidence/video-generation-queue.json`
- `/evidence/video-generation-batch.zip`
- `/evidence/video-generation-batch/VIDEO-ID/` folders containing `job.json`, narration, script, storyboard, visual prompt and captions.

The generated batch is provider-neutral and includes a stable idempotency key per video. It does not submit work to a provider. Each job is `blocked_pending_human_review` until a content review is recorded.

## Pre-generation review

A qualified reviewer must review the question, correct answer, distractor rationales, references, narration, storyboard, fictionalization, and accessibility brief. Copy `evidence/video-content-review-checklist.example.json`, set all required booleans to `true` only after review, then run:

```bash
npm run video:review-content -- --video-id VIDEO-PHISH-B01 --reviewer REVIEWER-ID --checklist /path/to/completed-checklist.json
```

Required keys: `factualAccuracy`, `correctAnswerAndDistractors`, `referencesVerified`, `narrationMatchesExplanation`, `scriptAndStoryboardReviewed`, `noSensitiveData`, `accessibilityBriefReviewed`.

The queue must be regenerated after approvals. A reviewer ID must be a pseudonymous organizational reviewer identifier; do not store personal identity data in the manifest.

## Provider adapter contract

The provider-independent contract is documented in `video-provider-integration.md`. A provider adapter must create an idempotent job, poll the job and deliver the MP4 to a trusted backend/import process. Provider credentials must never be placed in the frontend, generation batch, logs or manifests.

No adapter is activated in this delivery. Newly added library records are marked `deferred_by_owner_request` and deliberately have no placeholder script/caption paths. A provider account connection and application-side backend configuration remain prerequisites. No external provider is configured in this project and no generation job has been submitted.

## Media import and validation

The operator receives a rendered MP4 from the approved provider and imports it locally:

```bash
npm run video:import -- --video-id VIDEO-PHISH-B01 --file /absolute/path/to/render.mp4
```

Import validates:

- regular local file; manifest-derived output path only;
- MP4-compatible container;
- H.264 video, AAC narration audio and `yuv420p` pixel format;
- 16:9 aspect ratio, at least 1280×720;
- 30–60 second duration and 150 MB maximum file size;
- WebVTT syntax, cue ordering, caption-to-narration token coverage of at least 95%, and caption end time within the rendered duration;
- SHA-256 hash and recorded media metadata.

Import copies the asset to the manifest's predeclared `/public/videos/...` path and sets `rendered_pending_human_review`. The learner player deliberately does not expose it yet.

## Post-render human approval

The actual video must be reviewed for factual accuracy, match to the approved answer and distractor rationales, pronunciation, caption synchronization/readability, visual clarity, accessibility, rights and absence of sensitive or real-target data. Copy `evidence/video-render-review-checklist.example.json`, complete all booleans after review, then run:

```bash
npm run video:approve -- --video-id VIDEO-PHISH-B01 --reviewer REVIEWER-ID --checklist /path/to/completed-render-checklist.json
```

Only this transition sets `status: ready`. The manifest is updated in both canonical and frontend copies, and the review is appended to `/evidence/video-review-log.jsonl`. The learner app checks the approved state and media/caption endpoints before showing the player. Runtime media or caption errors return the user to the written transcript.

## Current limitations

- 133 MP4 files have not yet been generated.
- No provider job has been created or charged.
- Human content approval and rendered-video approval have not occurred.
- Browser playback of a real MP4 cannot be certified until actual media is imported and tested across target browsers.
- This static demonstrator includes a local media import tool; a production backend with authentication, private object storage, job queue, rate limiting, webhook verification and audit retention is still required for real automated provider integration.
