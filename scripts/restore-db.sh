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
APP_SERVICE="${APP_SERVICE:-app}"
BACKUP_DIR="${BACKUP_DIR:-$PROJECT_DIR/backups}"
RCLONE_REMOTE="${RCLONE_REMOTE:-gdrive:ramz-group/backups}"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

usage() {
  cat <<EOF
Usage:
  $0 <backup-file.sql.gz>          Restore from local file
  $0 --from-remote <filename>      Download from Google Drive and restore
  $0 --list                        List local backups
  $0 --list-remote                 List remote backups on Google Drive

Examples:
  $0 backups/ramz_db_20260702_020000.sql.gz
  $0 --from-remote ramz_db_20260702_020000.sql.gz
EOF
}

resolve_backup_file() {
  local input="$1"

  if [[ -f "$input" ]]; then
    echo "$input"
    return
  fi

  if [[ -f "$BACKUP_DIR/$input" ]]; then
    echo "$BACKUP_DIR/$input"
    return
  fi

  log "ERROR: Backup file not found: $input"
  exit 1
}

download_remote_backup() {
  local filename="$1"
  local destination="$BACKUP_DIR/$filename"

  mkdir -p "$BACKUP_DIR"

  if ! command -v rclone >/dev/null 2>&1; then
    log "ERROR: rclone is required for remote restore."
    exit 1
  fi

  log "Downloading $filename from $RCLONE_REMOTE"
  rclone copy "$RCLONE_REMOTE/$filename" "$BACKUP_DIR/" --log-level INFO
  echo "$destination"
}

restore_backup() {
  local backup_file="$1"

  if ! docker compose ps --status running "$DB_SERVICE" 2>/dev/null | grep -q "$DB_SERVICE"; then
    log "ERROR: PostgreSQL service '$DB_SERVICE' is not running."
    exit 1
  fi

  log "Stopping app service '$APP_SERVICE' to avoid active connections..."
  docker compose stop "$APP_SERVICE" >/dev/null 2>&1 || true

  log "Restoring database from: $backup_file"
  gunzip -c "$backup_file" | docker compose exec -T "$DB_SERVICE" \
    psql -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1

  log "Starting app service '$APP_SERVICE'..."
  docker compose start "$APP_SERVICE" >/dev/null 2>&1 || docker compose up -d "$APP_SERVICE"

  log "Restore completed successfully."
}

case "${1:-}" in
  --list)
    ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null || log "No local backups found in $BACKUP_DIR"
    ;;
  --list-remote)
    rclone ls "$RCLONE_REMOTE/" 2>/dev/null || log "Remote backup list unavailable."
    ;;
  --from-remote)
    [[ -n "${2:-}" ]] || { usage; exit 1; }
    backup_file="$(download_remote_backup "$2")"
    restore_backup "$backup_file"
    ;;
  -h | --help)
    usage
    ;;
  "")
    usage
    exit 1
    ;;
  *)
    backup_file="$(resolve_backup_file "$1")"
    restore_backup "$backup_file"
    ;;
esac
