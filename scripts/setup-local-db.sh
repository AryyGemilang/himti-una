#!/usr/bin/env bash
set -euo pipefail

ROLE="himti_app"
OWNER="himti_owner"
DATABASE="himti_local"

if [[ -e .env ]]; then
  echo ".env sudah ada; script berhenti tanpa mengubahnya. Periksa DATABASE_URL secara lokal." >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1 || ! command -v createdb >/dev/null 2>&1; then
  echo "psql dan createdb harus tersedia dari instalasi PostgreSQL." >&2
  exit 1
fi
if ! pg_isready >/dev/null 2>&1; then
  echo "PostgreSQL belum siap. Jalankan cluster lokal terlebih dahulu, lalu ulangi script ini." >&2
  exit 1
fi

role_exists="$(sudo -u postgres psql -Atqc "SELECT 1 FROM pg_roles WHERE rolname IN ('${ROLE}', '${OWNER}')" 2>/dev/null || true)"
database_exists="$(sudo -u postgres psql -Atqc "SELECT 1 FROM pg_database WHERE datname = '${DATABASE}'" 2>/dev/null || true)"
if [[ -n "$role_exists" || -n "$database_exists" ]]; then
  echo "Role himti_app/himti_owner atau database himti_local sudah ada. Tidak ada yang diubah; tinjau kondisi PostgreSQL sebelum melanjutkan." >&2
  exit 1
fi

database_password="$(openssl rand -hex 32)"
owner_password="$(openssl rand -hex 32)"
printf "CREATE ROLE himti_owner LOGIN PASSWORD '%s';\nCREATE ROLE himti_app LOGIN PASSWORD '%s';\n" "$owner_password" "$database_password" | sudo -u postgres psql -v ON_ERROR_STOP=1
sudo -u postgres createdb --owner="$OWNER" "$DATABASE"
sudo -u postgres psql -v ON_ERROR_STOP=1 --dbname="$DATABASE" <<'SQL'
GRANT CONNECT ON DATABASE himti_local TO himti_app;
GRANT USAGE ON SCHEMA public TO himti_app;
ALTER DEFAULT PRIVILEGES FOR ROLE himti_owner IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO himti_app;
SQL
umask 077
cat > .env <<EOF
DATABASE_URL=postgresql://${ROLE}:${database_password}@127.0.0.1:5432/${DATABASE}
MIGRATION_DATABASE_URL=postgresql://${OWNER}:${owner_password}@127.0.0.1:5432/${DATABASE}
API_PORT=3001
SESSION_COOKIE_SECURE=false
MEDIA_DIR=./storage/media
EOF
unset database_password
unset owner_password
echo "Database lokal dibuat. Runtime memakai hak data minimum; migration memakai role pemilik terpisah. Konfigurasi disimpan pada .env dengan izin terbatas."
