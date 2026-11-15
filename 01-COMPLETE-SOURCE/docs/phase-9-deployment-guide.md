# CYBERAWARE 3D — React deployment guide

## Architecture boundary

The React application is a static client-side learning demonstrator. It has no user-account service, database, server-side analytics or video-generation backend. Learning progress is stored in the browser. Do not describe this as multi-user persistence or production identity management.

## Build prerequisites

- Node.js 22.23.5 or later on a supported LTS line (CI matrix: 22.23.5, 24.22.3 and 26.13.1).
- npm CLI 12.2.2 for the React migration workflow.
- npm access to install the exact versions listed in `frontend/react-app/package.json`.
- A reviewed and committed `frontend/react-app/package-lock.json` is mandatory before production CI adopts `npm ci`; it is not included in this candidate.

## Local development

```bash
cd frontend/react-app
npm install
npm run dev
```

The Vite server binds to `127.0.0.1:5174` by default. The start command first runs `../scripts/sync-react-assets.mjs`, which validates and synchronizes canonical questions, explanations, reference IDs, video manifests, storyboards, prompts, scripts, captions, approved media and the legacy simulation fallback.

## Production build

```bash
npm run test
npm run typecheck
npm run build
npm run smoke:build
```

The deployable static site is `frontend/dist-react`. Do not deploy `frontend/react-app/src` directly. The `smoke:build` command verifies Vite's build manifest, hashed entry asset, legacy fallback page, all seven data assets, and all 51 script/storyboard/prompt/caption mappings. Approved MP4 paths are checked when the manifest contains ready entries.

## Nginx example

Use `deploy/nginx-react.conf` as the starting configuration. First copy `deploy/snippets/cyberaware-security-headers.conf` to `/etc/nginx/snippets/cyberaware-security-headers.conf`; the snippet is included inside locations that add their own cache headers so Nginx does not silently drop the security-header set. Mount/copy `frontend/dist-react` to `/usr/share/nginx/html`. The configuration:

- denies framing and uses a restrictive same-origin CSP;
- applies MIME sniffing, referrer, permissions and cross-origin resource policy headers;
- sets long immutable cache only for Vite-hashed `/assets/` files;
- leaves `/data/` uncacheable so content corrections are visible;
- serves `/videos/` with byte-range support from Nginx;
- returns 404 for missing data/video assets instead of rewriting them to the SPA entry point;
- provides `/healthz` for orchestration health checks.

Terminate TLS at the load balancer or reverse proxy. Enforce HTTPS, HSTS at the TLS termination layer, host allow-lists and request-rate controls according to the actual hosting environment. Do not expose the legacy Node demo server as a production web server.

## Release checklist

- [ ] Generate and review `package-lock.json`; commit it; change CI to `npm ci`.
- [ ] Run dependency audit and review all transitive packages.
- [ ] Complete a real Vite build and distribution smoke test.
- [ ] Run browser tests in Chromium, Firefox and WebKit at desktop and mobile breakpoints.
- [ ] Complete keyboard-only, screen-reader, 200%/400% zoom, contrast and reduced-motion checks against WCAG 2.2 AA.
- [ ] Obtain independent cybersecurity subject-matter and instructional-design approval for all content.
- [ ] Generate, review and import actual MP4 assets; verify captions and transcript consistency.
- [ ] Configure monitoring, CSP reporting, hosting access controls and rollback process.
- [ ] Conduct learner evaluation before making effectiveness claims.

## Rollback

Retain the last known-good `frontend/dist` dependency-free demonstrator package. If the Vite build or deployed React app fails release checks, direct the demo route back to the verified legacy package rather than serving unbuilt TypeScript/TSX source.
