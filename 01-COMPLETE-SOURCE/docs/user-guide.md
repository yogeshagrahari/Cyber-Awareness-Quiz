# CYBERAWARE 3D — Local Demonstrator User Guide

## Requirements

- Node.js 22.23.5 or later on a supported LTS line for the local server. No Node.js is needed at runtime when the built static distribution is served by Nginx.
- A modern browser with JavaScript enabled.
- No npm packages or external API keys are required for the current demonstrator.

## Start the application

From the `frontend` directory:

```bash
npm start
```

Open `http://localhost:4173` in the browser. Stop the server with `Ctrl+C`. For static staging deployment, copy the contents of `frontend/dist` to the Nginx document root and use `deploy/nginx-legacy-static.conf` with the shared security-header snippet; terminate TLS at a trusted ingress before external access.

Alternatively:

```bash
node server.mjs
```

The application loads the versioned question data and supporting assets from `frontend/public/data`.

## Learning workflow

1. Open **Overview** and select **Start learning**.
2. Complete the Beginner scenarios. Choose one answer and submit it.
3. Read the explanation for the selected option and all four answer choices.
4. Review the key takeaway, recommended defensive action and reference identifiers.
5. View the question's narration script while the corresponding MP4 asset is pending.
6. Continue through the pathway and view the session result.
7. Once the Advanced first-attempt threshold is met, use **Learning paths → Expert Challenge** for six separate organizational decision scenarios.
8. Use **Topic library** to practice a specific topic available in an unlocked level.
9. Use **My progress** to review first-attempt metrics and recent sessions.
10. Use **Settings** to enable reduced motion or clear local progress.

## Level progression

Beginner is available initially. Intermediate unlocks after at least ten unique Beginner first attempts with accuracy of 75% or higher. Advanced uses the same threshold for Intermediate. Expert Challenge unlocks after at least ten Advanced first attempts with at least 75% first-attempt accuracy. These are provisional learning heuristics, not certification or a measure of operational competence.

## Data storage

Progress and session history are stored in local storage in the current browser profile. Clearing site storage or using another browser/device can remove or hide this progress. No account sync is available.

## Video state

The combined manifests map all 133 questions. The 51 earlier question packages retain their written script/storyboard/prompt/caption drafts; 82 new video tasks are explicitly deferred by owner direction. No MP4 is claimed. The interface always presents written explanations and does not show fake script links for deferred items. Do not change an entry to `ready` unless the media file exists, captions and transcript are verified, and the content has passed human review.

## Troubleshooting

- If the page is opened directly as a `file://` URL, JSON fetches may fail. Start the local server instead.
- If port 4173 is occupied, run `PORT=4174 npm start` (PowerShell: `$env:PORT=4174; npm start`).
- If WebGL is unavailable, the 2D globe fallback is displayed; all core learning flows remain available.
- If progress is corrupted, the progress parser resets to an empty versioned state. You can also use **Settings → Reset data**.

## Background research paper

Open **Research sources** and use the **Project background & attached research paper** panel to read or download the supplied nine-page PDF. The UI identifies it as a draft preview (not submitted, not official IEEEtran layout, no empirical results); it must not be described as published or peer-reviewed.
