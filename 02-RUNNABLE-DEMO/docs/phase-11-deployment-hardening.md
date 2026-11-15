# Phase 11 — deployment hardening (video production excluded)

Release candidate: **0.10.0-rc.4**

## What changed

- Added `/healthz` to the verified dependency-free Node server. It supports GET and HEAD, returns only `ok`, and is marked `Cache-Control: no-store`.
- Added a hardened systemd unit. It binds the Node process to loopback, runs as a dedicated unprivileged `cyberaware` account, uses a read-only project tree, and enables systemd sandboxing controls.
- Added a loopback-only Nginx reverse-proxy example with an explicit hostname allow-list and bounded proxy timeouts. It is intended to sit behind an HTTPS-terminating ingress/load balancer.
- Removed FFmpeg installation and video-production-package validation from the core CI workflow. Video generation and media delivery are outside this phase, per project-owner direction.
- Added health endpoint regression coverage.

## Deploy the verified demonstrator

1. Install Node.js 22.23.5 or later on a supported LTS line and Nginx on the target host. The static Nginx legacy deployment does not require Node.js at runtime; Node is needed only for the local demo server and build/test tooling.
2. Copy the project to `/opt/cyberaware` and make it readable, but not writable, by the service account.
3. Create a dedicated account: `sudo useradd --system --home /opt/cyberaware --shell /usr/sbin/nologin cyberaware`.
4. Install `deploy/cyberaware3d.service` as `/etc/systemd/system/cyberaware3d.service`.
5. Replace `cyberaware.example.com` in `deploy/nginx-legacy-proxy.conf` with the approved hostname; configure the HTTPS ingress/load balancer to forward to `127.0.0.1:8080`.
6. Install the Nginx server block, validate with `sudo nginx -t`, then reload Nginx.
7. Start the app: `sudo systemctl daemon-reload && sudo systemctl enable --now cyberaware3d`.
8. Verify `curl -fsS http://127.0.0.1:4173/healthz` returns `ok` and the external HTTPS URL serves the app.

## Dependency/build status

The React migration still has no committed `package-lock.json`. In this environment, `npm view react@19.3.1` fails with `EAI_AGAIN registry.npmjs.org`; therefore a dependency-backed TypeScript 7 check and Vite production build cannot be truthfully reported here. The React CI workflow now generates a lockfile in its network-enabled runner, installs from it with `npm ci`, runs the official typecheck/build/smoke suite, and uploads the generated lockfile as a short-lived artifact for review. Download that artifact, inspect and commit `frontend/react-app/package-lock.json`, then change CI to require the committed lockfile and use `npm ci` directly. Do not deploy the React migration as the primary production app until this lockfile is reviewed and committed, the dependency-backed build passes, and browser acceptance is complete.

## Explicitly out of scope

Video generation, provider integration, MP4 creation, and video review are intentionally untouched. Existing manifests and authoring assets are retained without new media claims.

## Production caveats

The systemd and Nginx files are deployment examples, not a completed production deployment. The target host must supply TLS certificates and HSTS at the HTTPS edge, a real hostname, monitoring, backups/rollback, and operational ownership. Run the service under a dedicated account and keep `/opt/cyberaware` read-only to that account.
