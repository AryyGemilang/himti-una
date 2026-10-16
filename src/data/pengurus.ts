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
    { nama: "Bidang Kaderisasi", kabid: { nama: "Kepala Bidang", jabatan: "Kepala Bidang Kaderisasi", foto: PLACEHOLDER_FOTO },
      anggota: [] },
    { nama: "Bidang Humas", kabid: { nama: "Kepala Bidang", jabatan: "Kepala Bidang Humas", foto: PLACEHOLDER_FOTO },
      anggota: [] },
    { nama: "Bidang Kominfo", kabid: { nama: "Kepala Bidang", jabatan: "Kepala Bidang Kominfo", foto: PLACEHOLDER_FOTO },
      anggota: [] },
    { nama: "Bidang Agama & Sosial", kabid: { nama: "Kepala Bidang", jabatan: "Kepala Bidang Agama & Sosial", foto: PLACEHOLDER_FOTO },
      anggota: [] },
    { nama: "Bidang Minat & Bakat", kabid: { nama: "Kepala Bidang", jabatan: "Kepala Bidang Minat & Bakat", foto: PLACEHOLDER_FOTO },
      anggota: [] },
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
