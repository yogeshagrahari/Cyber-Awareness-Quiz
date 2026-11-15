# Research Gap Analysis — CYBERAWARE 3D

## 1. Evidence-bounded starting point

Cybersecurity awareness games, phishing education, virtual/augmented environments, adaptive training concepts and AI-generated educational media all have prior research. The project must not claim to invent any of these individually.

The initial corpus includes:
- 53 cybersecurity serious-game papers in a 2014–early-2024 review [8].
- 230 primary studies in a 2018–2024 game-based cybersecurity awareness scoping review, with 57 games examined using a taxonomy [9].
- A 2024 review of 30 immersive-VR education studies [12].
- A 2025 review of AI-generated instructional videos that included 12 studies [14].
- A 2026 mapping study of 60 peer-reviewed generative-AI cybersecurity education/training/awareness studies [15].
- Empirical training research with both positive theory-based findings [3] and a large 2025 field RCT that challenges the practical effect of conventional annual and embedded phishing training [7].

## 2. Evidence-supported design opportunities

### G1 — Evaluation quality and outcome comparability

The 2026 game-based review identifies UX, educational effectiveness, engagement, comparative and mixed-method evaluation, and notes some systems lack formal evaluation. It recommends standardized testing and comparison groups [9]. A large field RCT highlights why outcome claims need practical evidence [7].

**Project response:** measure usability, immediate knowledge, delayed retention, novel-scenario transfer, engagement and accessibility separately. Compare the system with appropriate baseline conditions rather than reporting only completion and points.

### G2 — Breadth and differentiation of learner pathways

The 2026 review found game-based cybersecurity awareness studies most often target industry professionals and undergraduate students, while efforts for children and the general public are emerging [9].

**Project response:** organize the initial content for non-specialist adult/undergraduate learners across Beginner, Intermediate and Advanced levels, with an optional defensive Expert Challenge. Validate level boundaries through item review and pilot data.

### G3 — End-to-end evidence traceability

Prior research and product descriptions demonstrate educational games, training platforms and AI-supported content, but the initial scoped search did not verify a single published implementation that systematically exposes a complete citation → finding → learning objective → question → explanation → per-question video → test relationship across its curriculum.

**Project response:** maintain stable IDs and a CSV/JSON manifest for all content. This is a proposed engineering contribution based on the project requirement, not a claim that no other system has ever implemented traceability.

### G4 — Question-level AI-video governance in cybersecurity

AI teaching-video research suggests that AI videos can achieve comparable short-term exam outcomes in an adjacent subject [13], while a systematic review highlights motivation/social-presence limitations [14]. The cybersecurity GenAI mapping study raises accuracy, hallucination, bias and empirical-validation concerns [15].

**Project response:** generate each short video only from a human-reviewed script; bind it to one canonical question and explanation; retain citations; publish captions/transcript; record provider/model/version and generation status. Evaluate video as a supplement to written explanation.

### G5 — 3D as a testable representation, not decoration

Immersive-VR education evidence is promising [12], and a cybersecurity AR game exists [11]. Neither establishes that the proposed browser-based 3D experience improves non-specialist decisions over a 2D diagram.

**Project response:** use 3D only for spatially meaningful concepts and compare it with a content-matched 2D version. A complete 2D route remains available.

### G6 — Transparent adaptation and careful analytics

The 2026 GenAI mapping identifies limited personalization/adaptive feedback as a field challenge, while noting the evidence and governance risks [15]. Quiz scores alone cannot prove real-world security competence.

**Project response:** begin with transparent rules based on per-objective performance and delayed retrieval; show recommendation rationales; compare against fixed progression; avoid high-stakes profiling and opaque risk labels.

## 3. Proposed contribution statement

CYBERAWARE 3D proposes a **research-traceable progressive cybersecurity-awareness learning framework** combining:
1. Three differentiated core learning paths plus a defensive expert challenge.
2. Scenario-based decisions with feedback for every answer option.
3. A question-level educational video workflow with explicit generation status and human review.
4. Selective 3D concept visualization with accessible 2D alternatives.
5. Explainable adaptive recommendations driven by transparent mastery signals.
6. A research-to-content traceability model and multi-layer evaluation plan.

The contribution is the **integrated design, content provenance model and evaluation protocol**. It is not an assertion that progressive learning, gamification, 3D or AI-generated videos are independently novel.

## 4. Claims that must not be made yet

Until data are collected:
- Do not say CYBERAWARE 3D improves awareness, retention, behaviour or organizational security.
- Do not say 3D is more effective than 2D.
- Do not say AI-generated videos outperform human-created videos.
- Do not say the adaptive engine identifies actual security risk or competence.
- Do not say all 45 videos have been generated; only their reserved IDs exist.
- Do not describe the initial rapid review as PRISMA-compliant or exhaustive.

## 5. Evidence still needed

A stronger claim requires a reproducible systematic/scoping review with full screening log; expert review of each learning objective, question and script; pilot usability/accessibility testing; a powered controlled evaluation with appropriate comparators; delayed retention and novel-scenario transfer assessments; qualitative data on trust, clarity, cognitive load and accessibility; and replication across intended learner groups and languages.
