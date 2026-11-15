# CYBERAWARE 3D — Master-prompt acceptance matrix

**Assessment date:** 13 November 2026  
**Release checkpoint:** 0.10.0-rc.16  
**Interpretation:** `Included` means the source/artifact is present; `Validated` means the stated automated check passed; `Partial` means some requested feature or acceptance remains absent; `Deferred` means the owner asked for it to be handled later; `External` means a real deployment, repository or human review is required. Inclusion is not production acceptance.

| Master prompt area | Status | Evidence / remaining work |
|---|---|---|
| A — Academic research and methodology | **Partial** | Literature review, critical synthesis, scoped search log, evidence-bounded research gap, research questions, Design Science Research plan and evaluation protocol are included. The review is rapid/scoped rather than exhaustive systematic review; no learner research is claimed. |
| B — IEEE manuscript | **Partial** | IEEE-structured Markdown manuscript, figures/diagrams, citations and bibliography are included. It is not yet typeset in the official target venue's current IEEE template; all references and claims still need independent reviewer verification. Results correctly state no empirical learning results. |
| C — ResearchGate package | **Included** | Metadata, author, abstract, keywords, objectives, contribution, summary, selected references, publication status, suggested description/tags and supplement notes are included. Publication/DOI status remains unclaimed. |
| D — Research-to-feature traceability | **Validated structurally** | `traceability-matrix.csv`, `research-to-feature-map.md`, reference registry, BibTeX and question/explanation/video IDs; content validator confirms 115 core + 18 expert, 133 explanation mappings and 38 reference keys. |
| E — Progressive learning | **Included** | Beginner, Intermediate, Advanced and separate defensive Expert Challenge pathways, Expanded core questions across Beginner, Intermediate and Advanced, topic practice across every category and provisional transparent progression. Thresholds are heuristics, not validated mastery. |
| E — Question bank | **Validated structurally** | 115 core questions + 18 Expert Challenge scenarios (133 total) across 44 topics; at least three per topic, four options and 204 option rationales; human SME / instructional-design approval remains external. |
| F — Question-level AI videos | **Deferred** | 51 video IDs, scripts, storyboards, visual prompts, transcripts/caption drafts and manifests are present. Zero MP4 files are generated or reviewed. Owner explicitly deferred this part. |
| G — 3D environment | **Partial** | Procedural WebGL globe illustration, 2D fallback and four defensive simulations are present. Full 3D world, floating learning portals, live holographic threat map and integrated 3D achievements are not complete; browser/device rendering needs acceptance testing. |
| H — Adaptive learning and analytics | **Partial** | Local first-attempt scoring, topic signals, thresholds, rule-based recommendations, progress dashboard, XP and achievements are implemented. No ML/AI adaptive model, persistent account analytics or validated risk/competence inference exists. |
| I — Application UX/screens | **Partial** | Landing/dashboard, pathways, topics, quizzes, explanations, research, results/progress, recommendations, achievements, history/settings and simulation launcher are represented across the legacy demonstrator and React candidate. Cross-browser and manual accessibility acceptance remain external. |
| J — Technical architecture | **Partial** | Modular source, static JSON content, no unnecessary database, Node demo server, React migration source, deployment configuration and provider boundary documentation exist. React/Vite production bundle, backend identity/persistence services and full deployed architecture are not accepted/required yet. |
| K — Security/privacy | **Partial** | Local-first data model, synthetic data, path validation, HTML escaping, defensive headers, progress input bounds, secret-pattern scan and Nginx smoke tests are included. No full SAST, penetration test, dependency audit or host assessment is claimed. |
| K — Accessibility | **Partial** | Semantic controls, skip link, reduced-motion setting, focus handling, labels, contrast token tests and 2D alternatives are included. WCAG 2.2 AA is not claimed until browser and manual assistive-technology testing pass. |
| L — Testing / DevSecOps | **Partial** | 52 legacy tests, 23 React domain/source tests, content validator, source inventory, CI workflows, Nginx/backup/systemd smoke tests and direct-dependency SBOM are included. React lockfile, `npm ci`, `npm audit`, official TS7/Vite build, React Playwright/axe and target CI execution remain external. |
| L — Group E integration | **Partial / External** | CI and documentation integration points are present. Actual shared Group E repository integration, ownership handshake and pipeline compatibility require access to the team's repository and confirmation by collaborators. |
| M — Documentation/submission | **Partial** | Research package, technical report, architecture/security/user/deployment guides, learning journal, test matrix, evidence and release files are included. Final demonstration video and independent review evidence are not present. |
| N — Quality and delivery standards | **Partial** | IDs, status semantics, versioning, test evidence, source hashes and limitations are recorded. Production approval remains blocked on the external gates in the RC.15 checklist. |
| O — Initial research-first delivery | **Included** | Research-first sequence and initial manuscript/research package are present; subsequent source implementation followed. Additional source/venue verification remains required. |

## Release gate summary

**Validated locally:** legacy and React domain/source tests; content and mapping integrity; offline structural TS check; dependency-free static build and 216-route smoke; package smoke; Nginx static/live smoke; backup safeguards; systemd syntax; source manifest.

**Still required before production approval:** reviewed React lockfile; clean `npm ci`; `npm audit`; official TypeScript 7 build; Vite production bundle and smoke; Chromium/Firefox/WebKit Playwright/axe; manual WCAG 2.2 AA; host TLS/HSTS/monitoring/backup restore/rollback; full reference verification including the CISA 2026 guide PDF; expert content review; ethical learner evaluation; shared Group E repository integration.

**Not included by owner instruction:** MP4 video generation and review.

| Library availability | **Implemented** | Every topic now exposes all mapped questions regardless of pathway unlock state. Locked-level library attempts are retained but excluded from pathway mastery until eligible. |
| Attached research paper in Background | **Included** | Supplied 9-page PDF is preserved unchanged and linked from Research sources. It is labelled Draft v0.1, preview layout, not submitted, no empirical results; pages 1–2 ground the background summary, page 5 the conceptual framework and page 6 the architecture/level design. |
| Expanded question bank | **Draft pending review** | 115 core + 18 Expert Challenge questions, 532 option-specific rationales, 133 explanation mappings, 44 topic categories (minimum three per category). Independent SME and instructional-design approval remains open. |

| Expanded topic question library | **Validated structurally; content review pending** | 133 questions across 44 categories, minimum three per category, 532 option-specific rationales and 133 explanation mappings. New items require cybersecurity SME and instructional-design review. |
| Attached research paper in Background | **Included** | Original nine-page PDF is preserved and linked in the Research/Background view. It is labelled Draft v0.1, preview layout, not submitted and without empirical results. |
