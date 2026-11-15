# Content Authoring Report — CYBERAWARE 3D

**Version:** 1.1.0  
**Date:** 2026-11-12  
**Owner:** Yogesh Kumar Agrahari  
**Group:** E  
**Role:** Security Training Design

## Scope completed

- 45 original scenario-based questions: 15 Beginner, 15 Intermediate, 15 Advanced.
- Four answer options per question and exactly one designated correct answer.
- Option-specific rationale for all 180 options.
- Stable question, explanation and video IDs retained from the existing research scaffold.
- 45 question-level narration scripts, storyboards, visual prompts and WebVTT caption drafts.
- Updated reference register, bibliography, traceability CSV and video manifest.

## Authoring/validation checks

- Unique question IDs: 45.
- Correct answer count: 45.
- Exactly four options/question: True.
- Exactly one correct option/question: True.
- Every question has at least two supporting references: True.
- Explicit explanationId and videoId fields are present in every question: 45/45.
- One video manifest record/question: True.
- Every script, storyboard, caption and generation-prompt path exists: validated by `tests/content/validate_content.py`.
- Generated MP4 count: 0 (none claimed).

## Important evidence boundary

The numbered citations support the underlying defensive recommendations and research context. They do not prove that these 133 questions or their videos improve awareness, retention or real-world behaviour. Those are evaluation questions for a later, approved study. NIST, CISA, FBI, FTC, NSA and other official guidance is used for operational advice; peer-reviewed studies in the manuscript support learning-design rationale.

## Human review required before release

1. Validate technical content and local organizational reporting procedures.
2. Review item difficulty, ambiguity, reading level and distractor fairness with target learners.
3. Confirm every reference remains available and supports the specific claim.
4. Review captions, transcript, timing, contrast, motion and screen-reader companion text.
5. Pilot item performance and revise weak or non-discriminating questions.
6. Generate MP4s, then test video decoding, captions, playback controls and mapping.

## Files

- `content/questions/question-bank.json` and `.md`
- `content/explanations/explanations.json`
- `content/videos/scripts/` (45 Markdown files)
- `content/videos/storyboards/` (45 JSON files)
- `content/videos/prompts/` (45 text prompts)
- `content/videos/captions/` (45 WebVTT files)
- `content/video-manifest.json`
- `content/questions/question-schema.json`
- `tests/content/validate_content.py`
- `research/traceability-matrix.csv`
- `research/references.bib`
- `research/reference-verification.md`


## Phase 4 content QA revision (12 November 2026)

A test-taking cue was detected in the initial draft: correct answers were concentrated in B and C and no item used A. The option order was therefore rebalanced without changing any correct-answer text or the semantic link between option text and its rationale. Within each core level, correct answer positions are now A=4, B=4, C=4 and D=3 (overall A=12, B=12, C=12, D=9). Distractor order was also varied. The question, explanation, script, storyboard, caption and app datasets were regenerated or synchronized, and the local progress namespace was advanced to v2 because option identifiers changed.

This is structural balancing, not item-response analysis. Item difficulty, discrimination, ambiguity and fairness still require expert/learner review and pilot data.

The Phase 4 narration audit removed ellipsis truncation: each script names the safest answer and states a concise reason for all three incorrect options. Full option-specific explanations remain in the script and canonical question/explanation data. Storyboards and VTTs match the narration text.


## Library expansion (13 November 2026)

The canonical library was expanded to 115 core items and 18 Expert Challenge items, for 133 total questions across 44 categories. Each category now has at least three distinct scenario prompts; Authentication has four. Every item contains four answer options, one correct answer, option-specific rationales, a learning objective, defensive action, key takeaway, stable explanation/video IDs and references from the existing 38-source registry. All 82 newly added items are draft content pending subject-matter and instructional-design review. Their question-level video manifest records are marked `deferred_by_owner_request`; no missing scripts, captions or rendered MP4s are represented as complete.
