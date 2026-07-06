#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

DB_USER="${DB_USER:-ramz_user}"
DB_NAME="${DB_NAME:-ramz_db}"
DB_SERVICE="${DB_SERVICE:-db}"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"
RCLONE_REMOTE="${RCLONE_REMOTE:-gdrive:ramz-group/backups}"
RCLONE_ENABLED="${RCLONE_ENABLED:-true}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

if ! docker compose ps --status running "$DB_SERVICE" 2>/dev/null | grep -q "$DB_SERVICE"; then
  log "ERROR: PostgreSQL service '$DB_SERVICE' is not running."
  exit 1
fi

mkdir -p "$BACKUP_DIR"

log "Creating backup: $BACKUP_FILE"
docker compose exec -T "$DB_SERVICE" \
  pg_dump -U "$DB_USER" -d "$DB_NAME" --no-owner --no-acl --clean --if-exists \
  | gzip > "$BACKUP_FILE"

log "Removing local backups older than $RETENTION_DAYS days"
find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +"$RETENTION_DAYS" -delete

if [[ "$RCLONE_ENABLED" == "true" ]]; then
  if ! command -v rclone >/dev/null 2>&1; then
    log "WARNING: rclone not found. Skipping Google Drive upload."
    exit 0
  fi

  REMOTE_NAME="${RCLONE_REMOTE%%:*}"
  if ! rclone config show "$REMOTE_NAME" >/dev/null 2>&1; then
    log "WARNING: rclone remote '$REMOTE_NAME' is not configured. Skipping upload."
    exit 0
  fi

  log "Uploading to $RCLONE_REMOTE"
  rclone copy "$BACKUP_FILE" "$RCLONE_REMOTE/" --log-level INFO
  log "Upload completed."
else
  log "RCLONE_ENABLED=false — upload skipped."
fi

log "Backup finished successfully."
