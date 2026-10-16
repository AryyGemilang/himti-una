export type Orang = { nama: string; jabatan: string; foto: string }
export type Bidang = { nama: string; kabid: Orang; anggota: Orang[] }

const P = (label: string) =>
  `https://placehold.co/400x400/0d2b52/38BDF8?text=${encodeURIComponent(label)}&font=montserrat`

export const PLACEHOLDER_FOTO = P("Foto+Pengurus")
export const PERIODE = "Periode Kepengurusan 2025/2026" // ganti sesuai periode resmi

export const pengurus = {
  ketua: { nama: "Nama Ketua", jabatan: "Ketua Himpunan Mahasiswa Teknik Informatika", foto: "/images/pengurus/ketua.jpg" } as Orang,
  sekretaris: { nama: "Nama Sekretaris", jabatan: "Sekretaris", foto: "/images/pengurus/sekretaris.jpg" } as Orang,
  wakilSekretaris: { nama: "Nama Wakil Sekretaris", jabatan: "Wakil Sekretaris", foto: "/images/pengurus/wakil-sekretaris.jpg" } as Orang,
  bendahara: { nama: "Nama Bendahara", jabatan: "Bendahara", foto: "/images/pengurus/bendahara.jpg" } as Orang,
  wakilBendahara: { nama: "Nama Wakil Bendahara", jabatan: "Wakil Bendahara", foto: "/images/pengurus/wakil-bendahara.jpg" } as Orang,
  bidang: [
    { nama: "Bidang Akademik", kabid: { nama: "Nama Kepala Bidang", jabatan: "Kepala Bidang Akademik", foto: "/images/pengurus/kabid/akademik.jpg" },
      anggota: [1, 2, 3].map(i => ({ nama: "Nama Anggota", jabatan: "Anggota", foto: `/images/pengurus/anggota/akademik-${i}.jpg` })) },
    { nama: "Bidang Teknologi & IT", kabid: { nama: "Nama Kepala Bidang", jabatan: "Kepala Bidang Teknologi & IT", foto: "/images/pengurus/kabid/it.jpg" },
      anggota: [1, 2, 3].map(i => ({ nama: "Nama Anggota", jabatan: "Anggota", foto: `/images/pengurus/anggota/it-${i}.jpg` })) },
    { nama: "Bidang Minat & Bakat", kabid: { nama: "Nama Kepala Bidang", jabatan: "Kepala Bidang Minat & Bakat", foto: "/images/pengurus/kabid/minat.jpg" },
      anggota: [1, 2, 3].map(i => ({ nama: "Nama Anggota", jabatan: "Anggota", foto: `/images/pengurus/anggota/minat-${i}.jpg` })) },
    { nama: "Bidang Humas & Sosial", kabid: { nama: "Nama Kepala Bidang", jabatan: "Kepala Bidang Humas & Sosial", foto: "/images/pengurus/kabid/humas.jpg" },
      anggota: [1, 2, 3].map(i => ({ nama: "Nama Anggota", jabatan: "Anggota", foto: `/images/pengurus/anggota/humas-${i}.jpg` })) },
  ] as Bidang[],
}

export const dokumentasi = [
  { kategori: "Seminar", judul: "Judul Kegiatan", tanggal: "Tanggal", foto: "/images/dokumentasi/doc-1.jpg" },
  { kategori: "Workshop", judul: "Judul Kegiatan", tanggal: "Tanggal", foto: "/images/dokumentasi/doc-2.jpg" },
  { kategori: "Pelatihan", judul: "Judul Kegiatan", tanggal: "Tanggal", foto: "/images/dokumentasi/doc-3.jpg" },
  { kategori: "Sosial", judul: "Judul Kegiatan", tanggal: "Tanggal", foto: "/images/dokumentasi/doc-4.jpg" },
  { kategori: "Musyawarah", judul: "Judul Kegiatan", tanggal: "Tanggal", foto: "/images/dokumentasi/doc-5.jpg" },
  { kategori: "Kebersamaan", judul: "Judul Kegiatan", tanggal: "Tanggal", foto: "/images/dokumentasi/doc-6.jpg" },
]

const D = (label: string) =>
  `https://placehold.co/640x420/0d2b52/38BDF8?text=${encodeURIComponent(label)}&font=montserrat`

export function fotoOr(src: string): string {
  // fallback ditangani onError di <Foto>; fungsi ini hanya untuk konsistensi tipe
  return src
}
export { P, D }
