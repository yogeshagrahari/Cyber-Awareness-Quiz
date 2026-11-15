# Research Methodology — Design Science Research Plan

## 1. Methodological choice

A Design Science Research (DSR) approach is appropriate because the project develops and evaluates an educational/security artefact to address a defined problem. The process will follow the six activities described by Peffers et al. [2]:

1. Problem identification and motivation.
2. Definition of solution objectives.
3. Design and development.
4. Demonstration.
5. Evaluation.
6. Communication.

This approach is compatible with NIST SP 800-50 Rev. 1's lifecycle view of cybersecurity and privacy learning [1]. DSR does not substitute for a rigorous evaluation design.

## 2. Problem identification

Cybersecurity learning may be delivered through static material, periodic awareness campaigns, scenario training, serious games and adaptive platforms. Research reports positive outcomes for some theory-based interventions [3], yet the 2025 field RCT challenges the practical value of commonly deployed annual and embedded phishing training [7]. Game-based cybersecurity research includes diverse prototypes but uses heterogeneous evaluation methods, and some studies do not report formal evaluation [9].

The problem is therefore not simply a lack of awareness material. It is the need for a coherent and measurable learning system that helps non-specialist users practice threat recognition and safe decisions, while allowing the educational value of added modalities to be tested.

## 3. Objectives of the artefact

- O1: Provide a progressive curriculum differentiated by prior knowledge and scenario complexity.
- O2: Teach threat identification through realistic but fictional decision scenarios.
- O3: Explain why each response is safe or unsafe, not only reveal a correct option.
- O4: Connect each content item to sources and a learning objective.
- O5: Provide one question-specific video asset or explicit pending/failed status for every question.
- O6: Use 3D only where spatial representation helps and retain an equivalent 2D pathway.
- O7: Recommend practice using interpretable mastery evidence.
- O8: Collect the minimum privacy-conscious data required for evaluation and learner progress.

## 4. Research questions

The project questions are refined as follows:

- **RQ1:** How does a progressive, prior-knowledge-sensitive cybersecurity awareness curriculum affect immediate knowledge acquisition and delayed retention compared with a fixed-sequence curriculum?
- **RQ2:** To what extent do scenario-based decisions with option-specific feedback improve performance on novel cybersecurity decision tasks compared with informational content alone?
- **RQ3:** For which cybersecurity concepts, if any, does browser-based 3D visualization improve understanding or decision performance relative to a content-matched 2D representation?
- **RQ4:** Does a question-specific AI-generated explanatory video, added to the same reviewed written explanation, improve comprehension, delayed recall or perceived clarity compared with written explanation alone?
- **RQ5:** Does explicit citation-to-question-to-explanation-to-video traceability improve content auditability and reviewer confidence?
- **RQ6:** Does a transparent adaptive recommendation policy improve learning efficiency or knowledge-gap remediation compared with fixed progression?
- **RQ7:** What security, privacy, accessibility, usability and performance constraints arise in implementing a browser-first, AI-assisted cybersecurity learning platform?
- **RQ8:** Which outcome measures most reliably distinguish engagement and quiz performance from retained knowledge and transfer to unfamiliar scenarios?

## 5. Proposed design and development process

### Stage 1 — Research and requirements

Maintain a source register, evidence summary, learning-objective register, content taxonomy and risk register. Have cybersecurity subject-matter reviewers check each factual claim. Have a learning-design reviewer check objective alignment and cognitive demand. Establish the target audience and languages before instrument creation.

### Stage 2 — Artefact design

Design the question schema, identifier system, video manifest, mastery rules, 2D/3D representations, privacy model and testable requirements. Each question record must include:
- `questionId`, `level`, `category`, `learningObjectiveId`;
- scenario and four answer options;
- correct option and rationale;
- rationale for each incorrect option;
- `referenceIds`;
- `explanationId`, `videoId`;
- recommended defensive action;
- estimated time and content-review status.

The current delivery contains 45 complete question drafts (15 per core level), each with four options, one answer key, four option-specific rationales, source IDs, takeaway, defensive action, completion estimate, explanation ID and video ID. The 45-question bank has passed structural/content-link validation but still requires independent cybersecurity SME and instructional-design review before release.

### Stage 3 — Demonstration

A dependency-free local client-side demonstrator has been implemented. It includes Beginner, Intermediate and Advanced pathways, a topic library, a four-choice quiz and option-specific feedback, research source panel, local progress, rule-based recommendations, achievements, a WebGL globe illustration with a 2D fallback, and question-level script fallback. It uses fictional sample accounts, messages, prompts and synthetic progress. No actual phishing emails, credential capture or unauthorized testing are conducted. Browser visual E2E, WebGL runtime and manual accessibility verification remain outstanding.

### Stage 4 — Pilot

Conduct a small formative pilot with representative learners to identify confusing questions, ceiling/floor effects, accessibility problems, UI friction, caption issues and 3D performance issues. A pilot is for instrument refinement, not a definitive efficacy claim.

### Stage 5 — Controlled evaluation

The evaluation programme remains proposed and has not been conducted. It should be staged so each research question has an identifiable comparison:

- **Scenario instruction (RQ2):** compare information-only content with scenario-based decisions and option-specific feedback under matched content and exposure.
- **Media factors (RQ3–RQ4):** among scenario-based conditions, use a 2 × 2 factorial comparison of matched 2D versus browser-based 3D and written explanation alone versus written explanation plus question-level video.
- **Progression and adaptation (RQ1, RQ6):** use separate, adequately powered comparisons of progressive versus fixed sequencing and adaptive versus fixed recommendations after item quality is calibrated.
- **Traceability (RQ5):** run an expert audit task comparing a citation-to-content traceability view with a conventional content view; measure verification time, reference coverage, detected defects and reviewer confidence.

Within each comparison, keep content, objectives, difficulty, time exposure and scoring consistent. Do not infer progression or adaptation effects from the media factorial study.

Recommended assessment schedule:
- T0: baseline knowledge and relevant prior-experience questionnaire.
- T1: immediate post-training assessment using items not identical to instructional questions.
- T2: delayed retention (for example, 2–4 weeks later).
- T3: novel scenario transfer task with decisions and rationale.

The delayed interval is a proposed parameter and should be fixed before data collection. Sample size must be determined by an a priori power analysis using the primary outcome and a defensible smallest effect of interest. Do not choose sample size after observing outcomes. The current web demonstrator has not been used with research participants and provides no basis for an effectiveness estimate. The current web demonstrator has not been used with research participants and provides no basis for an effectiveness estimate.

### Stage 6 — Evaluation and communication

Report the protocol, recruitment, exclusions, missing-data handling, instruments, reliability, analysis plan and deviations. Use mixed methods where practical:
- Quantitative: baseline-adjusted immediate score, delayed retention, novel-scenario decision score, completion time and usability scores.
- Qualitative: think-aloud observations or interviews on clarity, trust, cognitive load, confidence calibration and perceived usefulness.

Possible analyses include ANCOVA or regression adjusted for baseline knowledge, mixed-effects models for repeated assessments, confidence intervals and effect sizes. Use analysis appropriate to distribution, design and missingness. Pre-register hypotheses and primary outcomes where feasible.

## 6. Evaluation constructs and operationalization

| Construct | Candidate operational measure | Interpretation boundary |
|---|---|---|
| Immediate knowledge | Baseline-adjusted test score using alternate items | Short-term learning, not behaviour |
| Delayed retention | Score at pre-defined follow-up | Retention over the selected interval |
| Decision transfer | Score on unfamiliar scenario decisions and justifications | Simulated task transfer, not real incident outcomes |
| Option reasoning | Correct rationale / safe action selected | Evidence of reasoning in test scenarios |
| Engagement | Completion, return visits, time-on-task, self-report | Engagement is not effectiveness |
| Usability | System Usability Scale or equivalent, plus task metrics | User-perceived usability |
| Accessibility | WCAG 2.2 AA audit, keyboard and assistive-technology task tests | Conformance evidence reported by criterion |
| Performance | Web vitals, frame time and fallback success | Technical performance for tested hardware/network |
| Content quality | Expert rubric, citation coverage, factual error log | Human review required |
| Video quality | Caption/transcript completeness, script accuracy, audio intelligibility | Production quality is distinct from learning outcome |

## 7. Adaptive learning policy (proposed baseline)

For each learning objective, maintain separate records of first-attempt accuracy, recent accuracy, item difficulty, confidence (if collected) and delayed-retrieval performance. An initial policy should:
1. Recommend a targeted explanation when a learner misses an objective.
2. Follow with a distinct, isomorphic practice question rather than repeating the same item.
3. Schedule later retrieval for objectives with weak delayed performance.
4. Recommend progression when a configurable mastery rule across multiple distinct objectives is met.
5. Show why a recommendation appears.

The current demonstrator uses a provisional rule: flag a topic for review after at least two first-attempt items when accuracy is below 70%; unlock the next level after at least ten distinct first attempts at 75% or above in the previous level. A separate achievement badge uses an 80%-across-ten-items condition. These values are implementation heuristics, not validated cut-offs or a claim of mastery. The research evaluation should compare the adaptive policy with a fixed recommendation condition and calibrate thresholds from pilot item quality and learner outcomes. The system must avoid presenting a single score as a measure of actual cybersecurity risk or competence.

## 8. Ethics, privacy and safety

- Obtain institutional ethics approval or documented exemption before human-subject data collection, as applicable.
- Obtain informed consent; explain purpose, data collected, retention, withdrawal and contact routes.
- Minimize identifiers; pseudonymize study records; restrict access; define retention/deletion periods.
- Do not collect actual passwords, OTPs, recovery codes, session tokens or financial data.
- Do not launch real phishing campaigns or collect responses from unsuspecting third parties.
- Use fictional organizations, domains, contact names, credentials and QR destinations.
- Do not infer protected characteristics or use learner scores for employment, disciplinary or high-stakes decisions.
- Review AI outputs for factuality, stereotypes, impersonation risk, licensing, privacy and disclosure.
- Provide captions, transcripts, keyboard operation, reduced-motion and 2D alternatives.

## 9. Limitations and threats to validity

- **Construct validity:** quiz items may measure recall rather than safe decision-making.
- **Internal validity:** prior knowledge, motivation, video preference and device performance may confound outcomes.
- **External validity:** a student sample may not represent other populations, organizations, ages or languages.
- **Ecological validity:** synthetic scenarios are safer and easier to control than live threat environments.
- **Measurement reactivity:** repeated scenarios can train the test itself.
- **Attrition:** delayed follow-up may have differential dropout.
- **Novelty effect:** 3D and AI video may attract attention temporarily.
- **Researcher expectancy:** the team has an incentive to find the design effective; pre-registration and blind scoring help mitigate this.
- **Content drift:** phishing tactics and identity guidance change; sources and scripts need review dates.

## 10. Current methodological status

No participant recruitment, experiment, pilot, usability study, security test or quantitative analysis has been performed for CYBERAWARE 3D as of 12 November 2026. This document is a proposed protocol, not a report of completed empirical work.
