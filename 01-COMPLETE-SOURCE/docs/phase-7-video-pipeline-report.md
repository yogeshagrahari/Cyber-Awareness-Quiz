# CYBERAWARE 3D — Phase 7 Video Pipeline and Release Hardening Report

**Release:** 0.8.0  
**Date:** 12 November 2026  
**Scope:** 45 core questions + 6 Expert Challenge scenarios

## 1. Summary

Phase 7 implements a provider-neutral question-level video production workflow, content/caption synchronization, local media import validation, reviewer-gated media release, browser byte-range support and canonical asset synchronization. It does not claim AI videos are already generated. No external provider has been connected and no provider jobs have been submitted.

## 2. Content package audit

| Asset | Expected | Validated |
|---|---:|---:|
| Question mappings | 51 | 51 |
| Scripts with narration transcript | 51 | 51 |
| Storyboards | 51 | 51 |
| Visual prompts | 51 | 51 |
| WebVTT caption drafts | 51 | 51 |
| Registered reference mappings | All | All resolve |
| Caption text coverage | ≥95% | All pass |
| Storyboard narration drift | 0 | 0 after canonical synchronization |
| Caption timing/order findings | 0 | 0 |

An off-by-one word count in `VIDEO-ATTACH-B10` was corrected. The `Narration transcript` section in each canonical script is now the sole narration source; the `narration` field in the storyboard is synchronized from it.

## 3. Implemented pipeline

- `video:validate`: verifies manifest identities, question mappings, numbered research references, script/storyboard/prompt/caption paths, word counts, scene timing, WebVTT chronology, caption narration coverage and media/manifest consistency.
- `video:sync`: performs the validation and synchronizes storyboard narration from the canonical script.
- `video:queue`: creates a 51-job provider-neutral queue with deterministic idempotency keys and a ZIP containing each job's script, narration, storyboard, visual prompt, caption draft and question context. All jobs remain blocked until recorded human pre-generation approval.
- `video:review-content`: records question/script/storyboard/reference approval after completion of the required checklist.
- `video:import`: validates a local rendered asset with `ffprobe`, copies it to the manifest-defined output path, calculates SHA-256 and records `rendered_pending_human_review`.
- `video:approve`: requires a separate post-render review checklist, reruns media/caption/hash checks and only then changes the manifest to `ready`.

The learner app shows the MP4 only when the manifest marks it ready, the file exists and the media/caption endpoints pass checks. Video or caption errors trigger a transcript fallback.

## 4. Media requirements enforced

- MP4-compatible container.
- H.264 video, AAC audio, `yuv420p` pixel format.
- 16:9, at least 1280×720.
- 30–60 seconds, no more than 150 MB.
- Valid WebVTT, non-overlapping ordered cues, at least 95% narration token coverage, and captions ending within media duration.
- SHA-256 recorded and rechecked by project validation.

HTTP Range requests for MP4 return `206 Partial Content`; invalid ranges return `416 Range Not Satisfiable`.

## 5. Verification performed

- Node test suite: 33/33 PASS.
- Content/JSON Schema validator: PASS.
- New video pipeline validator: 51/51 assets PASS, no findings.
- High-confidence secret-pattern scan: PASS (not a full commercial secret-scanning product).
- Static build: PASS; canonical assets synchronized into frontend and dist.
- Built distribution smoke test: exhaustive script/storyboard/prompt/caption route checks for all 51 entries, plus app routes and security/method checks.
- CycloneDX SBOM regenerated.
- Isolated end-to-end workflow test on a temporary copy: content approval → queue eligible → local synthetic MP4 import and ffprobe validation → SHA-256 check → pending-review state → human checklist approval → ready manifest → static packaging. The synthetic fixture was test-only, was not added to the real project archive and is not claimed as educational or AI-generated video.

## 6. Current media status

| Metric | Current value |
|---|---:|
| Total video packages | 51 |
| Jobs eligible for provider submission | 0 |
| Jobs blocked pending human pre-generation review | 51 |
| Actual MP4 files in project | 0 |
| Approved playable MP4 files | 0 |
| Provider connected | No |

The queue is complete as a production handoff artifact, not as video production. Actual generation requires approved scripts and an authenticated provider. No external video-generation provider is configured and no external generation call has been made.

## 7. Outstanding release gates

- Independent cybersecurity SME approval of all 51 learning scenarios and sources.
- Instructional-design review and content approval records.
- Configure an approved AI video provider on a trusted backend and submit only independently approved jobs.
- Import and human-review all 51 actual video assets; verify pronunciation, factual accuracy, visual clarity, rights and synchronized captions.
- Browser testing of actual MP4 playback and seeking in target browsers.
- Complete WCAG 2.2 AA assessment with keyboard-only and screen-reader testing.
- React + TypeScript + Vite migration, production API/job backend, authenticated object storage and deployment.
- Human-subject evaluation for knowledge retention and transfer.

## 8. Reproduction

From `/frontend`:

```bash
npm test
npm run validate:content
npm run security
npm run video:validate
npm run video:queue
npm run build
npm run smoke:dist
npm run sbom
```

See `docs/video-production-pipeline.md` for checklists and operational command examples.
