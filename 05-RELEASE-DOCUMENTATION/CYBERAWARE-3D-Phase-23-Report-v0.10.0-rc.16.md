# Phase 23 — Topic Library Expansion and Attached Research Background

**Release candidate:** 0.10.0-rc.16  
**Date:** 13 November 2026  
**Owner:** Yogesh Kumar Agrahari  
**Video work:** Deferred by owner instruction.

## Objectives

1. Make topic quizzes discoverable and startable from the Library regardless of pathway unlock state.
2. Expand the question bank across all topic categories with complete answer-option rationales and research mappings.
3. Add the supplied research-paper PDF to the application's Research/Background area, with the manuscript's draft status accurately disclosed.
4. Preserve the existing four-level learning-path progression and ensure attempts on locked-level topic practice do not count toward pathway mastery.

## Implementation

- The Library now lists 44 topic categories and 133 questions: 115 core questions plus 18 Expert Challenge scenarios. Each category has at least three questions; Authentication has four.
- Topic practice includes questions from all mapped levels. Locked-level practice attempts are saved as optional practice but are excluded from mastery calculations until the learner is eligible for that level. Formal pathway gates are unchanged.
- The 133 items have 133 explanation records and 532 option-specific rationales. Their research IDs resolve against the 38-reference registry and BibTeX file. The new question records are marked pending cybersecurity and instructional-design review; structural validation is not expert approval.
- The attached nine-page PDF is preserved unchanged at `research/attachments/research-paper-preview.pdf` and served at `/data/research-paper-preview.pdf`. The Research view summarises pages 1–2, the conceptual framework diagram on page 5, and the architecture/learning-level diagrams on page 6.
- The UI and documentation explicitly state that the supplied paper is Draft v0.1, a preview layout rather than the official IEEEtran class, not submitted, and contains no empirical results. It is not described as accepted, published or peer-reviewed.
- Existing 51 video script/storyboard/caption packages are retained. The 82 new question-level video records are explicitly marked `deferred_by_owner_request`; no new scripts, captions or MP4s are fabricated.

## Validation

The phase is complete only for the locally executable checks reported in the release evidence. Required checks include content/reference/traceability validation, legacy and React source/domain tests, dependency-free static build and distribution smoke, the research PDF HTTP response, source inventory and ZIP integrity/hash verification.

A dependency-backed React/Vite production build is not claimed because the session cannot resolve the official npm registry. Real-browser Playwright/axe acceptance, manual WCAG review, human question review and production-host security checks remain outstanding.

## Acceptance interpretation

The Library's previous availability defect is addressed: all topic questions are presented and startable without unlocking the formal pathway. The question bank is materially expanded, but the new content still needs subject-matter and instructional-design review. The supplied paper is integrated as the background document, not represented as a final IEEE publication. Video production remains deferred.
