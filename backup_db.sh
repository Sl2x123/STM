#!/usr/bin/env bash
set -e

BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/pms_backup_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

# Detect running database container (prod or dev)
if docker ps --format '{{.Names}}' | grep -q "pms_prod_db"; then
    CONTAINER="pms_prod_db"
elif docker ps --format '{{.Names}}' | grep -q "pms_db"; then
    CONTAINER="pms_db"
else
    echo "❌ Error: Neither pms_prod_db nor pms_db container is running."
    exit 1
fi

echo "💾 Starting database backup from container [${CONTAINER}]..."

docker exec "$CONTAINER" pg_dump -U pms_user -d pms_db | gzip > "$BACKUP_FILE"

SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "✅ Backup successfully created: ${BACKUP_FILE} (${SIZE})"

# Auto-cleanup backups older than 14 days
find "$BACKUP_DIR" -type f -name "pms_backup_*.sql.gz" -mtime +14 -delete 2>/dev/null || true
echo "🧹 Old backups (>14 days) cleaned up."
