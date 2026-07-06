#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-db.sh"
CRON_SCHEDULE="${CRON_SCHEDULE:-0 2 * * *}"
CRON_LOG="${CRON_LOG:-/var/log/ramz-backup.log}"

if [[ ! -x "$BACKUP_SCRIPT" ]]; then
  chmod +x "$BACKUP_SCRIPT"
fi

MARKER="ramz-group backup-db.sh"
CRON_LINE="$CRON_SCHEDULE $BACKUP_SCRIPT >> $CRON_LOG 2>&1 # $MARKER"

(
  crontab -l 2>/dev/null | grep -v "$MARKER" || true
  echo "$CRON_LINE"
) | crontab -

echo "Cron job installed:"
echo "  $CRON_LINE"
echo ""
echo "Verify with: crontab -l"
