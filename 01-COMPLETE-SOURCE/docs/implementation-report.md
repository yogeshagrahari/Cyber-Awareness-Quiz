# CYBERAWARE 3D — Technical Implementation Report

**Owner:** Yogesh Kumar Agrahari  
**Group:** E · **Role:** Security Training Design  
**Status date:** 13 November 2026  
**Release candidate:** 0.10.0-rc.16  
**Release status:** source/staging handoff candidate; not production-approved  
**Video work:** explicitly deferred by project owner; no MP4 generation or media review is claimed.

## 1. Scope and research foundation

The project combines an IEEE-structured research manuscript, literature review, research-gap analysis, Design Science Research methodology, ResearchGate-ready metadata, numbered reference registry, BibTeX bibliography, and research-to-feature/question traceability files. The manuscript distinguishes published findings from design hypotheses and planned evaluation. It does not claim experimental validation, IEEE acceptance, a DOI, or demonstrated learner efficacy.

The expanded content set contains 115 core scenario questions across Beginner, Intermediate and Advanced, plus 18 Expert Challenge scenarios: 133 questions across 44 topic categories, with at least three questions in every category. There are 133 matching explanation records, 532 option-specific rationales, 38 numbered research references, 51 existing script/storyboard/prompt/WebVTT packages, and 82 additional video manifest records explicitly deferred by owner request. New questions are structurally validated but remain pending cybersecurity SME and instructional-design approval; learner pilot evaluation remains outstanding. The supplied nine-page research-paper preview is preserved unchanged and linked in the Research/Background view, with its draft, non-submitted and no-empirical-results status disclosed.

## 2. Current application architecture

The verified runnable demonstrator is dependency-free and uses browser-native ES modules, semantic HTML, responsive CSS, a small Node.js static server, local JSON learning content and browser-local progress storage. No account, remote analytics service or database is required. The server binds to loopback by default and includes path-containment checks and defensive response headers.

A React + TypeScript + Vite migration is present in `frontend/react-app`. It contains the main learning views, typed learning-data/progress logic, accessible control semantics, unit/source tests, Playwright/axe test configuration and CI gates. However, no reviewed `package-lock.json` or installed React dependency tree is present in this handoff, and no official TypeScript 7/Vite production build is claimed. The React source must not be described as a production bundle until its lockfile, dependency audit, build and browser acceptance gates pass.

## 3. Learning, assessment and personalization

The demonstrator provides the three core pathways, optional Expert Challenge, topic practice across all 44 categories (independent of pathway unlock state), four-option questions, correct/incorrect feedback, option-specific explanations, research references, progress dashboard, first-attempt accuracy, XP, achievements, rule-based recommendations and local progress export/import/reset. First attempts determine mastery calculations; retries do not overwrite first-attempt outcomes. The provisional progression rule requires ten distinct first attempts and at least 75% first-attempt accuracy in the preceding level. Topic review is surfaced only after at least two first attempts and below 70% accuracy. These rules are practice heuristics, not validated competence measures.

## 4. 3D and simulations

The demonstrator includes a procedural WebGL globe illustration with a 2D fallback and four defensive simulations: phishing inspection, password-profile configuration, MFA fatigue response and ransomware incident-response sequencing. Simulation data are fictional. The scenes are not live threat maps or live network telemetry. A fully navigable 3D learning world, floating portals and a unified 3D achievement environment remain design opportunities, not delivered features.

## 5. Security, privacy and accessibility

The application does not request real passwords, OTPs, session tokens or confidential messages. Progress is held locally on the device. User-controlled local-storage content is bounded and schema-sanitized before it is used. Dynamic content is escaped before HTML insertion, local paths are constrained to the application root, and the demonstrator uses CSP and defensive HTTP headers. The secret-pattern scanner is a high-confidence guardrail, not a full SAST or secret-scanning product.

Source-level accessibility includes semantic controls, skip navigation, keyboard-oriented state/focus handling, reduced-motion preferences, progress labels, input labels, and 2D fallbacks for 3D content. Automated source tests and documented contrast token checks pass. Full WCAG 2.2 AA conformance is not claimed: manual keyboard, screen-reader, zoom, contrast and browser testing remain required.

## 6. DevSecOps, tests and reproducible release

The repository includes GitHub Actions CI, pinned action references, dependency-update configuration, a manual lockfile-refresh workflow, source inventory generation, SHA-256 verification, a CycloneDX source/declaration SBOM, content validation, secret-pattern scanning, Node unit/integration tests, static distribution build and smoke tests, Nginx smoke tests, backup safeguards and systemd syntax checks. The RC.16 local test results are recorded in `evidence/phase-23-validation.json`. The legacy Node suite passes 52/52; React source/domain checks pass 23/23; the canonical content validator, offline structural TypeScript check, dependency-free static build, 216-route smoke, packaged server/PDF smoke, security-pattern scan and owner-deferred video-manifest validation pass. This remains separate from the official React production build and browser acceptance.

The full-source manifest is deterministic and rejects symlinks and sensitive environment files. The release packager fails closed when a React production distribution is absent; source-only packaging is explicitly marked as non-production. The static legacy demonstrator is a compatibility/demo artifact, not a substitute for the intended React/Vite production build.

## 7. Limitations and pending acceptance

1. React dependency lockfile, `npm ci`, `npm audit`, official TypeScript/Vite production build and React distribution smoke are pending because this environment cannot resolve `nodejs.org` or `registry.npmjs.org`.
2. Chromium/Firefox/WebKit Playwright and axe acceptance, plus manual WCAG 2.2 AA testing, remain pending.
3. Target-host HTTPS/TLS, HSTS at the trusted edge, monitoring, log retention, off-host backups, restore and rollback have not been tested on a real deployment.
4. Independent cybersecurity SME and instructional-design review, and learner evaluation, have not occurred.
5. The full CISA 2026 Insider Threat Mitigation Guide PDF was not independently reviewed; reference [38] supports only the guide's existence and high-level resource metadata until that review occurs.
6. All question-level MP4s remain ungenerated and unreviewed by explicit owner instruction. The written explanation and transcript drafts remain the fallback.

## 8. Release interpretation

RC.16 is the updated local handoff candidate for the expanded Library and attached research-paper background. It is suitable for controlled local demonstration, source review and staging preparation. It is **not production-approved** and should not be publicly deployed or represented as a fully validated production release until all external, build, browser, security and human-review gates are closed.
