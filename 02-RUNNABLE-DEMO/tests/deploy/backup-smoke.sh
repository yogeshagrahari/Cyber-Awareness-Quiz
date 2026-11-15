#!/usr/bin/env bash
set -Eeuo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
BACKUP_SCRIPT="$REPO_ROOT/deploy/backup-cyberaware.sh"
TMP_ROOT="$(mktemp -d)"
cleanup() { rm -rf -- "$TMP_ROOT"; }
trap cleanup EXIT

SOURCE="$TMP_ROOT/project"
BACKUPS="$TMP_ROOT/backups"
mkdir -p "$SOURCE/frontend/node_modules" "$SOURCE/content" "$SOURCE/frontend/react-app/test-results"
printf 'index\n' > "$SOURCE/frontend/index.html"
printf '{}\n' > "$SOURCE/content/questions.json"
printf 'ignored\n' > "$SOURCE/frontend/node_modules/ignored.js"
printf 'ignored\n' > "$SOURCE/frontend/react-app/test-results/trace.zip"
printf 'secret\n' > "$SOURCE/.env"
printf 'secret\n' > "$SOURCE/frontend/.env.production"

CYBERAWARE_ROOT="$SOURCE" CYBERAWARE_BACKUP_DIR="$BACKUPS" "$BACKUP_SCRIPT" >/dev/null
ARCHIVE="$(find "$BACKUPS" -maxdepth 1 -type f -name '*.tar.gz' -print -quit)"
[[ -n "$ARCHIVE" && -f "$ARCHIVE" ]]
(cd "$BACKUPS" && sha256sum -c "$(basename "$ARCHIVE").sha256" >/dev/null)
tar -tzf "$ARCHIVE" > "$TMP_ROOT/listing.txt"
grep -q 'frontend/index.html' "$TMP_ROOT/listing.txt"
grep -q 'content/questions.json' "$TMP_ROOT/listing.txt"
if grep -Eq 'node_modules|test-results|/\\.env' "$TMP_ROOT/listing.txt"; then
  printf 'Backup contains excluded development artifacts or environment files.\n' >&2
  exit 1
fi
[[ "$(stat -c '%a' "$BACKUPS")" == '700' ]]
[[ "$(stat -c '%a' "$ARCHIVE")" == '600' ]]

# Refuse to write a backup inside the source tree.
if CYBERAWARE_ROOT="$SOURCE" CYBERAWARE_BACKUP_DIR="$SOURCE/backups" "$BACKUP_SCRIPT" >/dev/null 2>&1; then
  printf 'Backup script allowed a backup directory inside the project tree.\n' >&2
  exit 1
fi

printf 'BACKUP SMOKE: PASS (checksum, exclusions, permissions, inside-tree refusal)\n'
