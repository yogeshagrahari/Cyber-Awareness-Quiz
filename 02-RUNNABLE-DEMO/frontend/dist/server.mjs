import { createServer } from 'node:http';
import { createReadStream, realpathSync, statSync } from 'node:fs';
import { extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const rootReal = realpathSync(root);
const portText = process.env.PORT || '4173';
const port = Number(portText);
if (!/^[1-9]\d{0,4}$/.test(portText) || !Number.isInteger(port) || port > 65535) {
  throw new Error('PORT must be an integer from 1 to 65535.');
}
// This is a local demonstrator. Network exposure must be an explicit operator choice.
const host = process.env.HOST || '127.0.0.1';
if (host.length > 255 || /[\u0000-\u0020\u007f]/.test(host)) {
  throw new Error('HOST must be a valid hostname or IP address without whitespace.');
}
const mime = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.pdf': 'application/pdf', '.svg': 'image/svg+xml',
  '.vtt': 'text/vtt; charset=utf-8', '.md': 'text/markdown; charset=utf-8',
  '.mp4': 'video/mp4', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp'
};

function parseByteRange(value, size) {
  if (!value) return null;
  const match = String(value).match(/^bytes=(\d*)-(\d*)$/);
  if (!match || (!match[1] && !match[2])) return { invalid: true };
  let start, end;
  if (!match[1]) {
    const suffix = Number(match[2]);
    if (!Number.isSafeInteger(suffix) || suffix <= 0 || size <= 0) return { invalid: true };
    start = Math.max(0, size - suffix); end = size - 1;
  } else {
    start = Number(match[1]); end = match[2] ? Number(match[2]) : size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || end < start || start >= size) return { invalid: true };
    end = Math.min(end, size - 1);
  }
  return { start, end };
}

function securityHeaders(contentType = 'text/plain; charset=utf-8') {
  return {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self'; img-src 'self' data:; media-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; frame-src 'none'; form-action 'self'; manifest-src 'self'",
    'X-Frame-Options': 'DENY',
    'X-Permitted-Cross-Domain-Policies': 'none',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Cache-Control': 'no-cache'
  };
}

function sendError(res, status, message, extraHeaders = {}) {
  const body = Buffer.from(message);
  res.writeHead(status, { ...securityHeaders(), ...extraHeaders, 'Content-Length': String(body.length) });
  res.end(body);
}

const server = createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendError(res, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
    return;
  }

  // Readiness endpoint for systemd, reverse proxies and container probes.
  // It exposes no project metadata and is deliberately never cached.
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    if (url.pathname === '/healthz') {
      const body = Buffer.from('ok\n');
      res.writeHead(200, { ...securityHeaders('text/plain; charset=utf-8'), 'Cache-Control': 'no-store', 'Content-Length': String(body.length) });
      if (req.method === 'HEAD') res.end(); else res.end(body);
      return;
    }
  } catch {
    sendError(res, 400, 'Bad request');
    return;
  }

  let candidate;
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.includes('\0') || pathname.includes('\\') || /[\u0000-\u001f\u007f]/.test(pathname)) {
      sendError(res, 400, 'Bad request');
      return;
    }
    const normalized = pathname.replace(/^\/+/, '');
    const relativePath = normalized === '' ? 'index.html' : normalized;
    const isPublicAsset = relativePath.startsWith('data/') || relativePath.startsWith('videos/') || relativePath.startsWith('models/') || relativePath.startsWith('textures/');
    candidate = resolve(join(rootReal, isPublicAsset ? 'public' : '', relativePath));
  } catch {
    sendError(res, 400, 'Bad request');
    return;
  }

  let file, stat;
  try {
    // Resolve symlinks before serving. Lexical containment alone does not stop
    // a symlink inside the static tree from pointing outside the project root.
    file = realpathSync(candidate);
    const relativeToRoot = relative(rootReal, file);
    if (relativeToRoot === '..' || relativeToRoot.startsWith(`..${sep}`) || isAbsolute(relativeToRoot)) {
      sendError(res, 404, 'Not found');
      return;
    }
    stat = statSync(file);
    if (!stat.isFile()) {
      sendError(res, 404, 'Not found');
      return;
    }
  } catch {
    sendError(res, 404, 'Not found');
    return;
  }

  const extension = extname(file).toLowerCase();
  const headers = securityHeaders(mime[extension] || 'application/octet-stream');
  if (extension === '.mp4') headers['Accept-Ranges'] = 'bytes';

  if (extension === '.mp4' && req.headers.range) {
    const range = parseByteRange(req.headers.range, stat.size);
    if (!range || range.invalid) {
      res.writeHead(416, { ...headers, 'Content-Range': `bytes */${stat.size}` });
      res.end();
      return;
    }
    headers['Content-Range'] = `bytes ${range.start}-${range.end}/${stat.size}`;
    headers['Content-Length'] = String(range.end - range.start + 1);
    res.writeHead(206, headers);
    if (req.method === 'HEAD') { res.end(); return; }
    createReadStream(file, { start: range.start, end: range.end }).pipe(res);
    return;
  }

  headers['Content-Length'] = String(stat.size);
  res.writeHead(200, headers);
  if (req.method === 'HEAD') { res.end(); return; }
  createReadStream(file).pipe(res);
});

let shuttingDown = false;
function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`CYBERAWARE 3D shutting down after ${signal}.`);
  const forceTimer = setTimeout(() => {
    server.closeAllConnections?.();
    process.exit(1);
  }, 9500);
  forceTimer.unref();
  server.close(error => {
    clearTimeout(forceTimer);
    if (error) {
      console.error('CYBERAWARE 3D shutdown error:', error.message);
      process.exitCode = 1;
    }
  });
  server.closeIdleConnections?.();
}
process.once('SIGTERM', () => shutdown('SIGTERM'));
process.once('SIGINT', () => shutdown('SIGINT'));

server.on('error', error => {
  console.error('CYBERAWARE 3D server error:', error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  const displayHost = host.includes(':') ? `[${host}]` : host;
  console.log(`CYBERAWARE 3D running at http://${displayHost}:${port}`);
  if (host === '0.0.0.0' || host === '::') console.warn('WARNING: this demo is network-accessible. Do not expose it to the internet as a production service.');
});
