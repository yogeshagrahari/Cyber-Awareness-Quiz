# Question-Level Video Provider Integration Contract

**Current status:** provider-neutral workflow and local media import are implemented. No provider is configured, connected, or called by the application. No MP4 generation is claimed.

## Canonical lifecycle

`drafted` → `content_review_approved` → `eligible_for_provider_queue` → `queued` → `rendering` → `rendered_pending_human_review` → `ready`

Failure states: `generation_failed`, `validation_failed`, `rejected_by_reviewer`. Video IDs do not prove media existence. Only the `ready` state exposes media in the learner interface.

## Provider-neutral adapter

A trusted backend implementation must provide:

```ts
export interface VideoProvider {
  createJob(input: {
    videoId: string;
    questionId: string;
    script: string;
    storyboard: unknown;
    prompt: string;
    requestedFormat: 'mp4';
    aspectRatio: '16:9';
    captions: { language: string; vtt: string }[];
    idempotencyKey: string;
  }): Promise<{ providerJobId: string; state: 'queued' | 'rendering' }>;
  getJob(providerJobId: string): Promise<{
    state: 'queued' | 'rendering' | 'completed' | 'failed';
    assetUrl?: string;
    errorCode?: string;
  }>;
  downloadAsset(assetUrl: string): Promise<ReadableStream<Uint8Array>>;
}
```

The browser must never call a provider directly. Provider keys belong in a backend secret store. The current `frontend/src/services/video-provider.js` only asserts the adapter interface and contains an unconfigured stub; it does not call external services.

## Pre-generation review

All 133 mappings (115 core + 18 Expert Challenge) are blocked until content approval is recorded. Review must check factual accuracy, correct answer and distractors, references, narration/explanation consistency, storyboard and prompt, fictionalization, accessibility brief, and data minimization. `npm run video:review-content` records the required checklist and reviewer ID.

## Job packaging

`npm run video:queue` creates a provider-neutral job per video with a deterministic idempotency key and the script, storyboard, prompt, caption draft and question-bound reference IDs. It exports a JSON queue and a ZIP batch. Jobs remain blocked when pre-generation approval is absent. Queue generation is local only and does not submit or charge a provider.

## Import validation

`npm run video:import -- --video-id VIDEO-ID --file /absolute/path/to/video.mp4` requires `ffprobe` and validates an MP4-compatible container, H.264, AAC, `yuv420p`, 16:9, at least 1280×720, 30–60 seconds, no more than 150 MB, WebVTT syntax and timing, at least 95% narration token coverage, and SHA-256. The file is copied only to the manifest's allowlisted output path. It is marked `rendered_pending_human_review`, never automatically ready.

## Post-render human approval

Only after actual playback and human review of content, pronunciation, captions, readability, accessibility, rights and safe fictionalization may an authorized reviewer run `npm run video:approve` with a completed render checklist. The command reruns media and caption validation, stores reviewer metadata and sets `status: ready`. The app additionally checks the MP4 and WebVTT routes before showing playback; media errors trigger a transcript fallback.

## Security and cost controls

Use provider domain allowlists, verified webhooks, strict request timeouts, bounded retries, rate and spend limits, least privilege, idempotency, quarantined storage, file-signature/probe validation, content-type verification and immutable hashes. Never send learner performance or identity data to a video provider. Use only synthetic examples and fictional organizations/domains. Avoid real-person voice cloning and obtain rights for music, images, voices and generated media.

## Acceptance criteria

The full feature is complete only after at least one provider job has been created, polled, downloaded, imported, validated, human-reviewed and played from the application, including captions and transcript fallback. Failure, retry and provider timeout behavior must be tested. Until a real provider is connected and this process is completed, all 51 MP4 requirements remain open.
