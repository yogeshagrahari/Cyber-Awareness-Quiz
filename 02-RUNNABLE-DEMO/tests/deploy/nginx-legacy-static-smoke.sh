#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIST="${CYBERAWARE_DIST_DIR:-$ROOT/frontend/dist}"
for command in nginx python3; do
  command -v "$command" >/dev/null 2>&1 || { echo "LEGACY STATIC NGINX SMOKE: missing required command: $command" >&2; exit 2; }
done
[[ -d "$DIST" && -f "$DIST/index.html" && -f "$DIST/server.mjs" ]] || { echo "LEGACY STATIC NGINX SMOKE: missing built distribution at $DIST" >&2; exit 2; }

TMP="$(mktemp -d)"
chmod 755 "$TMP"
PID=""
cleanup() {
  if [[ -n "$PID" ]]; then nginx -p "$TMP/" -c "$TMP/nginx.conf" -s quit >/dev/null 2>&1 || true; fi
  rm -rf "$TMP"
}
trap cleanup EXIT
mkdir -p "$TMP/www" "$TMP/snippets" "$TMP/logs" "$TMP/client_body_temp" "$TMP/proxy_temp" "$TMP/fastcgi_temp" "$TMP/uwsgi_temp" "$TMP/scgi_temp"
cp -a "$DIST/." "$TMP/www/"
cp "$ROOT/deploy/snippets/cyberaware-security-headers.conf" "$TMP/snippets/security.conf"
mkdir -p "$TMP/www/public/videos"
printf '0123456789abcdef' > "$TMP/www/public/videos/range-fixture.mp4"

PORT="$(python3 - <<'PY'
import socket
with socket.socket() as sock:
    sock.bind(('127.0.0.1', 0))
    print(sock.getsockname()[1])
PY
)"

python3 - "$ROOT/deploy/nginx-legacy-static.conf" "$TMP/nginx.conf" "$TMP" "$PORT" <<'PY'
from pathlib import Path
import sys
source = Path(sys.argv[1]).read_text()
tmp, port = Path(sys.argv[3]), sys.argv[4]
source = source.replace('listen 8080;', f'listen 127.0.0.1:{port};')
source = source.replace('root /usr/share/nginx/html;', f'root {tmp}/www;')
source = source.replace('root /usr/share/nginx/html/public;', f'root {tmp}/www/public;')
source = source.replace('/etc/nginx/snippets/cyberaware-security-headers.conf', f'{tmp}/snippets/security.conf')
Path(sys.argv[2]).write_text(f'''worker_processes 1;
pid {tmp}/nginx.pid;
error_log {tmp}/logs/error.log notice;
events {{ worker_connections 64; }}
http {{
  include /etc/nginx/mime.types;
  default_type application/octet-stream;
  access_log off;
  sendfile on;
  client_body_temp_path {tmp}/client_body_temp;
  proxy_temp_path {tmp}/proxy_temp;
  fastcgi_temp_path {tmp}/fastcgi_temp;
  uwsgi_temp_path {tmp}/uwsgi_temp;
  scgi_temp_path {tmp}/scgi_temp;
  {source}
}}
''')
PY

nginx -t -p "$TMP/" -c "$TMP/nginx.conf"
nginx -p "$TMP/" -c "$TMP/nginx.conf"
PID="$(cat "$TMP/nginx.pid")"
python3 - "$PORT" <<'PY'
import sys, time, urllib.error, urllib.request
base = f'http://127.0.0.1:{sys.argv[1]}'
def request(path, method='GET', headers=None):
    req = urllib.request.Request(base + path, method=method, headers=headers or {})
    try:
        with urllib.request.urlopen(req, timeout=3) as response:
            return response.status, {key.lower(): value for key, value in response.headers.items()}, response.read()
    except urllib.error.HTTPError as error:
        return error.code, {key.lower(): value for key, value in error.headers.items()}, error.read()
for _ in range(30):
    try:
        if request('/healthz')[0] == 200: break
    except Exception: time.sleep(0.1)
else: raise SystemExit('Nginx failed to start on the selected loopback port.')
checks = []
status, headers, body = request('/healthz'); checks.append(('healthz', status == 200 and body == b'ok\n' and headers.get('cache-control') == 'no-store'))
status, headers, body = request('/'); checks.append(('index', status == 200 and b'CYBERAWARE 3D' in body and headers.get('x-frame-options') == 'DENY'))
status, headers, body = request('/src/app.js'); checks.append(('application-module', status == 200 and b'initGlobe' in body and headers.get('x-content-type-options') == 'nosniff'))
status, headers, body = request('/data/question-bank.json'); checks.append(('canonical-content', status == 200 and headers.get('content-type', '').startswith('application/json') and b'"questions"' in body and headers.get('cache-control') == 'no-cache'))
status, _, _ = request('/data/not-found.json'); checks.append(('missing-data-404', status == 404))
status, _, _ = request('/videos/not-found.mp4'); checks.append(('missing-video-404', status == 404))
status, headers, body = request('/videos/range-fixture.mp4', headers={'Range': 'bytes=4-7'}); checks.append(('byte-range', status == 206 and headers.get('content-range') == 'bytes 4-7/16' and body == b'4567'))
status, _, _ = request('/public/data/question-bank.json'); checks.append(('public-tree-hidden', status == 404))
status, headers, body = request('/', method='HEAD'); checks.append(('head', status == 200 and body == b''))
status, _, _ = request('/', method='POST'); checks.append(('write-method-denied', status in (403, 405)))
for name, ok in checks:
    print(('PASS' if ok else 'FAIL') + ' ' + name)
    if not ok: print('  diagnostic:', status, headers, body[:80])
if not all(ok for _, ok in checks): raise SystemExit(1)
print(f'LEGACY STATIC NGINX SMOKE: PASS ({len(checks)} checks)')
PY
