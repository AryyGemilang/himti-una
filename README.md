# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Pendaftaran dan dokumentasi HIMTI (lokal)

Website memakai React, TypeScript, dan Vite. GitHub Pages hanya menyajikan frontend statis; backend Node.js dan PostgreSQL berjalan terpisah di komputer lokal. Konfigurasi Vite meneruskan permintaan `/himti-una/api` dan `/himti-una/media` ke backend localhost.

### Persiapan Ubuntu

1. Pastikan PostgreSQL 16 aktif. Pada cluster lokal yang sudah terpasang, jalankan `sudo systemctl start postgresql@16-main` bila layanan belum aktif.
2. Pasang dependensi proyek dengan `npm install`.
3. Siapkan akun basis data lokal dengan `npm run db:setup`. Script ini membuat database `himti_local`, role pemilik/migration `himti_owner`, role runtime dengan hak baca/tulis `himti_app`, dan berkas `.env` berisi kata sandi acak. Script berhenti tanpa mengubah apa pun jika `.env`, salah satu role, atau database dengan nama tersebut sudah ada. Periksa konfigurasi yang ada sebelum melanjutkan.
4. Terapkan migration dengan `npm run db:migrate`. Migration memakai tabel catatan sendiri dan tidak menjatuhkan tabel atau menghapus data.
5. Daftarkan dokumentasi Screening Test yang tersedia dengan `npm run db:seed-screening`. Perintah ini idempoten, menyalin file ke `storage/media`, dan menambahkan metadata ke PostgreSQL tanpa menghapus sumber di `public/images/kegiatan/screening-test/`.
6. Buat dua akun admin secara terpisah:
   - `npm run admin:create -- documentation kominfo`
   - `npm run admin:create -- registration panitia`

   Terminal meminta kata sandi dua kali tanpa menampilkannya. Kata sandi minimal 12 karakter dan disimpan dalam bentuk hash. Tidak ada akun atau kata sandi bawaan.
7. Jalankan `npm run dev`. Vite menampilkan alamat frontend yang aktif (biasanya `http://localhost:5173/himti-una/`); backend mendengarkan hanya pada `127.0.0.1:3001`.

Admin dokumentasi mengelola judul, thumbnail, foto, dan video pada `/himti-una/admin/dokumentasi`. Admin pendaftaran mengelola kegiatan, pertanyaan formulir, jadwal, pendaftar, serta unduhan PDF dan CSV pada `/himti-una/admin/pendaftaran`. Pengunjung memakai halaman Pendaftaran dan Dokumentasi dari navigasi utama.

Pendaftaran mewajibkan email. Formulir dapat meminta NPM; batas tiga kiriman per email dan, jika dipilih, per NPM dihitung terpisah untuk setiap kegiatan. Penutupan manual langsung memblokir pengiriman backend. Pembukaan ulang harus menyimpan rentang waktu dengan waktu tutup. Peserta mengunduh bukti PDF dari respons formulir. Rekap admin tersedia sebagai PDF dan CSV yang dapat dibuka di aplikasi spreadsheet.

Dokumentasi publik memuat judul dan thumbnail pada daftar. Foto/video lengkap diminta saat detail dibuka; pemutar video memakai pemuatan `preload="none"`. Berkas yang diunggah disimpan pada `storage/media`, di luar database, dan folder itu diabaikan Git. Cadangkan folder tersebut secara terpisah dari backup PostgreSQL.

### Pemeriksaan lokal

- `npm run build` memeriksa TypeScript frontend/backend dan membangun frontend.
- `npm run lint` menjalankan Oxlint.
- `npm test` menjalankan tes unit yang tersedia.
- `http://127.0.0.1:3001/api/health` menunjukkan status koneksi database tanpa menampilkan kredensial.

Konfigurasi `.env` tidak boleh dimasukkan ke Git. Backend pada konfigurasi lokal sengaja hanya bind ke loopback. GitHub Pages hanya menyajikan frontend statis; sebelum pendaftaran dan dokumentasi berfungsi untuk publik, backend, PostgreSQL, dan penyimpanan media perlu di-host pada layanan terpisah dan alamat API produksi perlu dikonfigurasi.
