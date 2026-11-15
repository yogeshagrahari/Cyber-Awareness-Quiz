#!/usr/bin/env python3
"""High-confidence source/configuration secret scan; not a full SAST product."""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[2]
SKIP_DIRS = {'.git', 'node_modules', 'dist', 'dist-react', 'coverage', '__pycache__', 'release-artifacts', 'test-results', 'playwright-report'}
TEXT_SUFFIXES = {
    '.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx', '.json', '.html', '.css',
    '.yml', '.yaml', '.py', '.sh', '.ps1', '.md', '.txt', '.toml', '.ini',
    '.cfg', '.conf', '.xml', '.sql', '.pem', '.key', '.crt', '.cer',
    '.properties', '.lock', '.env'
}
SPECIAL_TEXT_NAMES = {'.env', '.npmrc', '.nvmrc', '.node-version', 'Dockerfile', 'Containerfile'}
PATTERNS = [
    ('private-key-block', re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----')),
    ('aws-access-key-id', re.compile(r'\b(?:AKIA|ASIA)[0-9A-Z]{16}\b')),
    ('github-token', re.compile(r'\bgh[pousr]_[A-Za-z0-9]{30,}\b')),
    ('gitlab-token', re.compile(r'\bglpat-[A-Za-z0-9_-]{20,}\b')),
    ('slack-token', re.compile(r'\bxox[baprs]-[A-Za-z0-9-]{10,}\b')),
    ('google-api-key', re.compile(r'\bAIza[0-9A-Za-z_-]{35}\b')),
    ('stripe-secret-key', re.compile(r'\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b')),
    ('npm-token', re.compile(r'\bnpm_[A-Za-z0-9]{30,}\b')),
    ('openai-project-or-service-key', re.compile(r'\bsk-(?:proj|svcacct)-[A-Za-z0-9_-]{20,}\b')),
]

findings = []
for path in ROOT.rglob('*'):
    if not path.is_file() or any(part in SKIP_DIRS for part in path.relative_to(ROOT).parts):
        continue
    if path.suffix.lower() not in TEXT_SUFFIXES and path.name not in SPECIAL_TEXT_NAMES and not path.name.startswith('.env.'):
        continue
    try:
        raw = path.read_bytes()
        if b'\x00' in raw:
            continue
        text = raw.decode('utf-8')
    except (OSError, UnicodeDecodeError):
        continue
    for line_number, line in enumerate(text.splitlines(), 1):
        for name, pattern in PATTERNS:
            if pattern.search(line):
                findings.append((path.relative_to(ROOT), line_number, name))

if findings:
    print('SECRET PATTERN SCAN: FAIL')
    for path, line, kind in findings:
        print(f' - {path}:{line}: {kind} (value redacted)')
    sys.exit(1)

print('SECRET PATTERN SCAN: PASS (expanded high-confidence patterns; not a full secret-scanning/SAST product).')
