# CYBERAWARE 3D — Complete Consolidated Handoff (v0.10.0-rc.16)

This is the **single consolidated ZIP** for the RC.16 project handoff. The source project and runnable demo are included as extracted folders. There are no nested ZIP archives and no separate source/demo downloads are required.

## Folder guide

- `01-COMPLETE-SOURCE/` — full project source, research, 133-question content library, frontend (legacy and React migration), tests, deployment files, CI, evidence and documentation.
- `02-RUNNABLE-DEMO/` — extracted runnable dependency-free legacy demonstrator, including its complete application files and local server.
- `03-ATTACHED-RESEARCH-PAPER/` — exact user-supplied nine-page research-paper PDF.
- `04-PROJECT-INSTRUCTIONS/` — supplied master prompt used as the requirements baseline.
- `05-RELEASE-DOCUMENTATION/` — RC.16 release report, Phase 23 report/checklist, topic coverage, validation evidence, SBOM and delivery notes.
- `06-INTEGRITY/` — SHA-256 manifest for the files in this consolidated package (manifest excludes itself).

## Run the included demo

Requirements: Node.js 22.23.5 or later on a supported LTS release. The demo has no third-party runtime dependencies.

```bash
cd 02-RUNNABLE-DEMO/frontend
npm start
```

Open `http://127.0.0.1:4173`. Stop the server with `Ctrl+C`.

## React migration

The full React + TypeScript + Vite migration source is included at:
`01-COMPLETE-SOURCE/frontend/react-app/`

Its reviewed dependency lockfile and official dependency-backed production build remain release gates. See the project README and release report before attempting a deployment.

## Included project content

- 133 questions total: 115 core questions and 18 Expert Challenge scenarios.
- 44 topics, with at least three questions per topic.
- Question explanations, individual answer-option rationales and research-reference mappings.
- The attached research paper is linked from the application Background/Research section and is also included separately in folder 03.

## Video status

Video generation remains deferred as requested. Existing scripts, storyboards, prompts, captions and manifest records are retained. No new MP4 files are claimed as generated. Newer question media entries are marked deferred.

## Release status — read before deployment

This is a verified RC.16/staging handoff, **not a production-approved release**. The official React/Vite production build, real-browser Playwright/axe acceptance, manual WCAG 2.2 AA review, deployment-host TLS/HSTS/monitoring/backup/rollback validation, and independent academic/security review remain outstanding. Do not represent these as passed.

## Integrity

Verify the extracted file tree against `06-INTEGRITY/FILE-MANIFEST-SHA256SUMS.txt` using SHA-256. The final consolidated ZIP's own SHA-256 is supplied in the delivery message.
