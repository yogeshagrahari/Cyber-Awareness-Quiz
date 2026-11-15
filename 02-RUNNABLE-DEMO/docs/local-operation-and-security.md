# Local Operation and Security Notes

## Default start

Requirements for the local Node server/build tools: Node.js 22.23.5 or later on a supported LTS line. A static Nginx deployment serves the built files without Node.js at runtime.

```bash
cd frontend
HOST=127.0.0.1 PORT=4173 npm start
```

Open `http://127.0.0.1:4173`.

## Network binding

The local demonstrator binds to `127.0.0.1` by default. It is intentionally not reachable from other devices on the LAN. To allow a trusted device on the same private network to reach it, an operator may explicitly set:

```bash
HOST=0.0.0.0 PORT=4173 npm start
```

The process prints a warning for all-interface binding. Do not forward this port to the internet or treat the Node static server as a production web server. For a static staging deployment, serve the contents of `frontend/dist` with `deploy/nginx-legacy-static.conf` behind a trusted TLS-terminating ingress. Configure HTTPS, HSTS, logging/monitoring, caching policy, backup/restore, rollback and operational ownership on the target host before public release.

## Security behavior verified locally

- Only GET and HEAD are accepted.
- Static content is resolved through the filesystem real path; symlinks that escape the project root are rejected.
- NUL/control characters and backslash path forms are rejected.
- 400/404/405 responses retain the defensive response headers.
- MP4 GET/HEAD byte ranges return 206 with correct Content-Range; invalid ranges return 416.
- Learner progress loaded from local storage is treated as untrusted and validated before use.

## Privacy

Learning activity remains in this browser's local storage. Do not use this demonstrator on a shared or managed device for confidential training results. Use Settings → Reset data to clear locally stored progress, session history and simulation completions. No account, password, OTP, session token or confidential organization information is requested.

## Production boundary

The project has no identity, authorization, server-side progress store, production job processor, media object storage, deployment environment, monitoring or data-retention policy. It is an internal demonstrator only. These capabilities need a new threat model and architecture review before production use.
