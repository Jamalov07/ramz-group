# Database Backup va Restore

Loyiha **PostgreSQL 16** (`postgres:16-alpine`) ishlatadi. Backup scriptlari Docker Compose orqali ishlaydi.

## Talablar

- Ishlayotgan `docker compose` stack (`db` va `app` servislari)
- `.env` faylida `DB_USER`, `DB_PASSWORD`, `DB_NAME` sozlangan
- Google Drive yuklash uchun: [rclone](https://rclone.org/) o'rnatilgan va sozlangan

## Tez sozlash

### 1. rclone (Google Drive)

```bash
rclone config
# Name: gdrive
# Storage: drive
# scope: drive (full access yoki folder scope)
# keyingi qadamlarni ekrandagi ko'rsatma bo'yicha to'ldiring
```

Remote nomi va papkani `.env` da belgilang:

```env
RCLONE_REMOTE=gdrive:ramz-group/backups
RCLONE_ENABLED=true
RETENTION_DAYS=7
```

### 2. Scriptlarni ishga tushirish huquqi

```bash
chmod +x scripts/backup-db.sh scripts/restore-db.sh scripts/install-backup-cron.sh
```

### 3. Qo'lda backup

```bash
./scripts/backup-db.sh
```

Backup fayl `backups/` papkasida `ramz_db_YYYYMMDD_HHMMSS.sql.gz` formatida saqlanadi.

### 4. Kunlik avtomatik backup (cron)

```bash
./scripts/install-backup-cron.sh
```

Default: har kuni soat **02:00** da backup olinadi. Vaqtni o'zgartirish:

```bash
CRON_SCHEDULE="0 3 * * *" ./scripts/install-backup-cron.sh
```

Log: `/var/log/ramz-backup.log`

## Backup qanday ishlaydi

1. `pg_dump` orqali PostgreSQL dump olinadi (`--clean --if-exists` bilan)
2. `gzip` bilan siqiladi va `backups/` ga yoziladi
3. **7 kundan** eski lokal `.sql.gz` fayllar o'chiriladi
4. `rclone copy` orqali Google Drive'ga yuklanadi

## Restore

**Diqqat:** Restore paytida `app` servisi vaqtincha to'xtatiladi.

### Lokal fayldan

```bash
./scripts/restore-db.sh backups/ramz_db_20260702_020000.sql.gz
```

### Google Drive'dan

```bash
# Remote ro'yxat
./scripts/restore-db.sh --list-remote

# Yuklab olish va restore
./scripts/restore-db.sh --from-remote ramz_db_20260702_020000.sql.gz
```

### Lokal backup ro'yxati

```bash
./scripts/restore-db.sh --list
```

## Docker Image (GHCR)

`main` branch'ga push qilinganda GitHub Actions image'ni GHCR ga yuboradi:

```
ghcr.io/jamalov07/ramz-group:latest
ghcr.io/jamalov07/ramz-group:<git-sha>
```

Image'ni VPS da ishlatish (ixtiyoriy):

```bash
docker login ghcr.io -u <github-username> -p <github-token-with-read:packages>
docker pull ghcr.io/jamalov07/ramz-group:latest
```

Mavjud `deploy.yml` workflow o'zgartirilmagan — VPS hali ham `git pull` + `docker compose build` orqali deploy qiladi.

## Muhim eslatmalar

- Backup fayllar `.gitignore` da (`backups/`) — git'ga commit qilinmaydi
- Production'da `BACKUP_DIR` ni alohida disk/papka qilib belgilash tavsiya etiladi
- Restore dan oldin hozirgi holatning backup nusxasini oling
- `rclone` sozlanmagan bo'lsa, lokal backup baribir yaratiladi, faqat upload o'tkazib yuboriladi
