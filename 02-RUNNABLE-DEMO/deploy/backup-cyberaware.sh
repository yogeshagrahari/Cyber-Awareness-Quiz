#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

SOURCE_ROOT="${CYBERAWARE_ROOT:-/opt/cyberaware}"
BACKUP_DIR="${CYBERAWARE_BACKUP_DIR:-/var/backups/cyberaware3d}"

if [[ ! -d "$SOURCE_ROOT" ]]; then
  printf 'Source project directory does not exist: %s\n' "$SOURCE_ROOT" >&2
  exit 2
fi
SOURCE_ROOT="$(realpath -e -- "$SOURCE_ROOT")"
mkdir -p -m 0700 -- "$BACKUP_DIR"
BACKUP_DIR="$(realpath -e -- "$BACKUP_DIR")"

case "$BACKUP_DIR/" in
  "$SOURCE_ROOT/"*)
    printf 'Backup directory must be outside the source project.\n' >&2
    exit 2
    ;;
esac

chmod 0700 "$BACKUP_DIR"
exec 9>"$BACKUP_DIR/.backup.lock"
if ! flock -n 9; then
  printf 'Another CYBERAWARE 3D backup is already running.\n' >&2
  exit 3
fi

STAMP="$(date -u +%Y%m%dT%H%M%SZ)"
PROJECT_NAME="$(basename -- "$SOURCE_ROOT")"
ARCHIVE="$BACKUP_DIR/cyberaware3d-${STAMP}.tar.gz"
CHECKSUM="${ARCHIVE}.sha256"
TMP_ARCHIVE="$(mktemp "$BACKUP_DIR/.cyberaware3d-${STAMP}.XXXXXX")"
TMP_CHECKSUM="$(mktemp "$BACKUP_DIR/.cyberaware3d-${STAMP}.sha256.XXXXXX")"
cleanup() {
  rm -f -- "$TMP_ARCHIVE" "$TMP_CHECKSUM"
}
trap cleanup EXIT

tar -czf "$TMP_ARCHIVE" \
  --exclude-vcs \
  --exclude='node_modules' --exclude='*/node_modules' \
  --exclude='test-results' --exclude='*/test-results' \
  --exclude='playwright-report' --exclude='*/playwright-report' \
  --exclude='.env*' --exclude='*/.env*' \
  -C "$(dirname -- "$SOURCE_ROOT")" "$PROJECT_NAME"

tar -tzf "$TMP_ARCHIVE" >/dev/null
chmod 0600 "$TMP_ARCHIVE"
mv -- "$TMP_ARCHIVE" "$ARCHIVE"
(
  cd "$BACKUP_DIR"
  sha256sum "$(basename -- "$ARCHIVE")" > "$TMP_CHECKSUM"
)
chmod 0600 "$TMP_CHECKSUM"
mv -- "$TMP_CHECKSUM" "$CHECKSUM"

printf 'Backup created: %s\n' "$ARCHIVE"
printf 'Checksum file: %s\n' "$CHECKSUM"
