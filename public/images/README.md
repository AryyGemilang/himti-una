# Panduan aset gambar HIMTI UNA

Seluruh aset yang dilayani langsung oleh situs disimpan di `public/images/`. Berkas di folder `public/` disajikan apa adanya; gunakan path situs dengan awalan `/himti-una/images/` pada HTML, JSX, CSS, dan data JavaScript.

## Struktur folder

| Folder | Isi dan penggunaan |
| --- | --- |
| `branding/` | Logo HIMTI UNA dan Universitas Asahan. `branding/mitra/` menyimpan logo organisasi mitra seperti PERMIKOMNAS. Favicon memakai logo HIMTI UNA di folder ini. |
| `home/hero/` | Foto utama hero Beranda. |
| `sejarah/` | Foto ketua yang ditampilkan pada linimasa sejarah HIMTI. |
| `tinjauan/` | Foto kelompok luar ruangan yang ditampilkan pada bagian Tentang. |
| `pengurus/inti/` | Ilustrasi ketua umum, sekretaris umum, dan bendahara umum. |
| `pengurus/kepala-bidang/` | Ilustrasi kepala bidang. |
| `pengurus/dewan-pengawas/` | Ilustrasi Dewan Pengawas Organisasi. |
| `pengurus/anggota/<nama-bidang>/` | Ilustrasi anggota per bidang: `agama-dan-sosial`, `humas`, `kominfo`, atau `minat-bakat`. |
| `pengurus/` | `placeholder-person.svg`, gambar pengganti saat foto pengurus belum tersedia. |
| `kegiatan/<nama-kegiatan>/` | Foto, video, dan poster dokumentasi kegiatan. Saat ini `kegiatan/screening-test/` berisi delapan foto, dua video, dan dua poster video. |

## Penamaan

- Gunakan huruf kecil dan tanda hubung sebagai pemisah kata.
- Sertakan fungsi, nama pemilik/jabatan, bidang, atau nama kegiatan yang memang diketahui.
- Untuk dokumentasi yang belum memiliki keterangan foto satu per satu, gunakan nomor urut, misalnya `foto-sesi-01.jpeg`.
- Pertahankan ekstensi dan format asli. Jangan mengganti nama berdasarkan dugaan isi foto.

## Menambah atau mengganti foto

1. Simpan berkas di folder sesuai halaman atau kegiatannya.
2. Beri nama dengan aturan di atas, lalu perbarui path pada komponen atau data yang menggunakannya.
3. Gunakan URL seperti `/himti-una/images/sejarah/nama-orang.jpg`; jangan menulis `public/` pada URL.
4. Untuk mengganti foto Beranda, perbarui `HERO_IMAGE` di `src/components/Hero.tsx`. Linimasa diperbarui di `src/components/Sejarah.tsx`, dokumentasi kegiatan di `src/components/Kegiatan.tsx`, dan data foto pengurus di `src/data/pengurus.ts` atau `src/data/bidang.ts`.
5. Cari nama/path lama di seluruh kode sebelum memindahkan atau mengganti nama berkas, kemudian periksa halaman yang menggunakannya.

## Pemetaan utama

| Aset | Lokasi penggunaan |
| --- | --- |
| `home/hero/musyawarah-besar-himti-una.jpg` | Hero Beranda (`src/components/Hero.tsx`). |
| `sejarah/*.jpg` | Foto linimasa halaman Sejarah (`src/components/Sejarah.tsx`). |
| `kegiatan/screening-test/foto-sesi-*.jpeg` | Galeri Kegiatan. |
| `kegiatan/screening-test/video-sesi-*.mp4` dan poster pasangannya | Galeri Kegiatan. |
| `pengurus/**/*.svg` | Foto ilustrasi pengurus dan anggota (`src/data/pengurus.ts`, `src/data/bidang.ts`). |
| `branding/*` | Navbar, footer, favicon, latar dekoratif, dan logo bagian situs. |
| `branding/mitra/logo-permikomnas.png` | Bagian Visi Misi. |
| `tinjauan/foto-kelompok-luar-ruangan.webp` | Strip foto terkompresi pada halaman Tentang (`src/components/Tentang.tsx`); JPEG asli tetap disimpan. |

## Hasil audit aset

- Semua 39 berkas aset di `public/images/` sudah dikategorikan dan namanya dinormalkan. Path dan referensi yang ditemukan diperbarui bersamaan dengan pemindahan.
- Perbandingan SHA-256 tidak menemukan berkas identik di `public/images/`. Foto screening memiliki adegan yang mirip, tetapi hash dan isi visualnya berbeda, jadi dipertahankan sebagai foto terpisah.
- Tidak ada berkas di `public/images/` yang dibiarkan tanpa kategori. `placeholder-person.svg` tetap digunakan sebagai foto cadangan.
- Versi WebP foto kelompok luar ruangan digunakan pada bagian Tentang (`src/components/Tentang.tsx`); JPEG asli dipertahankan.
- Audit kode tidak menemukan referensi untuk aset berikut di `src/assets/images/`; aset tersebut dibiarkan di tempatnya karena berada di luar folder publik dan tidak perlu dipindahkan untuk penataan ini: `illustrations/hero.png` (ilustrasi dekoratif), `logos/logo-una-reference.jpg`, `logos/logo-himti-reference.jpg` (gambar referensi logo), dan `icons/vite.svg` (ikon bawaan). Ketiganya bukan duplikat byte-identik dari aset publik.
