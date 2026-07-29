# Database Backup va Restore

Loyiha **PostgreSQL 16** (`postgres:16-alpine`) ishlatadi. Backup scriptlari Docker Compose orqali ishlaydi.

Har kuni soat **02:00** da:
1. `pg_dump` → `gzip`
2. Google Drive'ga yuklash (`rclone`)
3. Serverda 7 kundan eski backuplarni o'chirish
4. Drive'da 30 kundan eski backuplarni o'chirish
5. Natijani `logs/backup.log` ga yozish
6. Telegram kanalga success/failure xabar yuborish

## Talablar

- Ishlayotgan `docker compose` stack (`db` va `app`)
- `.env` da `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- [rclone](https://rclone.org/) o'rnatilgan va Google Drive remote sozlangan
- Telegram: bot token + backup kanali

## Tez sozlash

### 1. rclone (Google Drive)

```bash
# O'rnatish (Debian/Ubuntu)
curl https://rclone.org/install.sh | sudo bash

# Sozlash
rclone config
# n) New remote
# name> gdrive
# Storage> drive  (Google Drive)
# client_id / client_secret> Enter (bo'sh qoldirish mumkin)
# scope> 1 (Full access)
# root_folder_id> Enter
# service_account_file> Enter
# Edit advanced?> n
# Use auto config?> y   # brauzer ochiladi, Google akkaunt bilan login
# Configure as team drive?> n
# y) Yes this is OK
# q) Quit
```

Remote papkani tekshirish:

```bash
rclone mkdir gdrive:ramz-group/backups
rclone lsd gdrive:ramz-group/
```

### 2. `.env` sozlash

`.env.backup.example` dagi qiymatlarni asosiy `.env` ga qo'shing:

```env
RCLONE_REMOTE=gdrive:ramz-group/backups
RCLONE_ENABLED=true
TELEGRAM_ENABLED=true
BACKUP_CHANNEL_ID=-100xxxxxxxxx
```

`PROJECT_NAME` loyiha root papka nomidan avtomatik olinadi. Retention: lokal **7** kun, Drive **30** kun (kodda static).

`DB_USER` / `DB_PASSWORD` / `DB_NAME` allaqachon `.env` da bo'lishi kerak.

### 3. Telegram backup kanali

1. Telegramda yangi **channel** oching (masalan: `Ramz Backup`)
2. [@BotFather](https://t.me/BotFather) dagi botni kanalga **admin** qilib qo'shing
3. Channel ID ni oling:
   - Kanalga biror xabar yozing
   - `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates` oching
   - yoki `@userinfobot` / `@getidsbot` dan channel id oling (`-100...` format)
4. `.env` ga yozing:

```env
BACKUP_CHANNEL_ID=-100xxxxxxxxxx
```

Mavjud `BOT_TOKEN` ishlatiladi.

### 4. Script huquqlari

```bash
chmod +x scripts/backup-db.sh scripts/restore-db.sh scripts/install-backup-cron.sh
```

### 5. Qo'lda backup (tekshiruv)

```bash
# Avval dry-run
./scripts/backup-db.sh --dry-run --verbose

# Haqiqiy backup
./scripts/backup-db.sh --verbose
```

Fayl formati: `backups/backup-2026-07-29_02-00-01.sql.gz`

### 6. Kunlik cron (02:00)

```bash
./scripts/install-backup-cron.sh
```

Boshqa vaqt:

```bash
CRON_SCHEDULE="0 3 * * *" ./scripts/install-backup-cron.sh
```

Tekshirish:

```bash
crontab -l
```

## Backup qanday ishlaydi

1. Lock file — bir vaqtda faqat bitta backup
2. Disk bo'sh joy tekshiruvi (`MIN_FREE_MB`)
3. `pg_dump` (Docker `db` servisi) + `gzip`
4. Fayl mavjudligi va hajm > 0 tekshiruvi (+ ixtiyoriy SHA256)
5. `rclone copy` → Google Drive
6. Lokal retention (7 kun)
7. Remote retention (30 kun, `rclone delete --min-age`)
8. `logs/backup.log` + Telegram xabar

Xatolik (`pg_dump`, `gzip`, upload, disk, permission) bo'lsa script darhol to'xtaydi (`set -Eeuo pipefail`).

## Restore

**Diqqat:** Restore paytida `app` servisi vaqtincha to'xtatiladi. Oldin yangi backup oling.

### Lokal

```bash
./scripts/restore-db.sh --list
./scripts/restore-db.sh backups/backup-2026-07-29_02-00-01.sql.gz
```

### Google Drive

```bash
./scripts/restore-db.sh --list-remote
./scripts/restore-db.sh --from-remote backup-2026-07-29_02-00-01.sql.gz
```

### Dry-run

```bash
./scripts/restore-db.sh --dry-run backups/backup-2026-07-29_02-00-01.sql.gz
```

## Loglar

```bash
tail -f logs/backup.log
tail -f logs/restore.log
tail -f logs/cron-backup.log
```

Log rotation: `backup.log` / `restore.log` ~10 MB dan oshsa avtomatik `.gz` qilib aylantiriladi.

## CLI flaglar

| Flag | Tavsif |
|------|--------|
| `--dry-run` | Hech narsa yozmasdan / o'chirmasdan simulyatsiya |
| `--verbose` | Batafsil log |
| `--no-upload` | Faqat lokal backup |
| `--no-telegram` | Telegram xabarsiz |

## Muammolarni hal qilish

| Muammo | Yechim |
|--------|--------|
| `PostgreSQL service is not running` | `docker compose up -d db` |
| `rclone not found` | rclone o'rnating, `rclone version` |
| `rclone remote is not configured` | `rclone config` → `gdrive` |
| Upload xatosi | `rclone lsd gdrive:` va internetni tekshiring |
| Telegram kelmayapti | Bot kanalda adminmi? `BACKUP_CHANNEL_ID` to'g'rimi? |
| `Another backup is already running` | Eski `logs/backup.lock` ni tekshiring / o'ching |
| `Insufficient disk space` | Diskni tozalang yoki `MIN_FREE_MB` ni kamaytiring |
| Cron ishlamayapti | `crontab -l`, `logs/cron-backup.log` |

## Papka strukturasi

```text
ramz-group/
├── backups/                 # lokal backuplar (gitignored)
├── logs/
│   ├── backup.log
│   ├── restore.log
│   ├── cron-backup.log
│   └── backup.lock
├── scripts/
│   ├── backup-db.sh
│   ├── restore-db.sh
│   ├── install-backup-cron.sh
│   └── lib/backup-common.sh
├── .env
└── .env.backup.example
```

> Specdagi `/opt/postgres-backup` o'rniga loyiha ichidagi papkalar ishlatiladi — Docker Compose stack bilan birga ko'chirish osonroq. Production'da `BACKUP_DIR` ni alohida diskka yo'naltirishingiz mumkin.

## Muhim eslatmalar

- `backups/` va `logs/` `.gitignore` da
- Restore dan oldin hozirgi holatning backupini oling
- `RCLONE_ENABLED=true` bo'lsa upload majburiy — muvaffaqiyatsiz bo'lsa script FAIL bo'ladi
- Telegram xatosi backupni FAIL qilmaydi (faqat warning)
