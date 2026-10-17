export type Orang = { nama: string; jabatan: string; foto: string }

const P = (label: string) =>
  `https://placehold.co/400x400/0d2b52/38BDF8?text=${encodeURIComponent(label)}&font=montserrat`

export const PLACEHOLDER_FOTO = P("Foto+Pengurus")
export const PERIODE = "Periode Kepengurusan 2025/2026" // ganti sesuai periode resmi

// Foto pengurus periode berjalan belum tersedia di aset proyek, jadi gunakan placeholder bersama.
export const pengurus = {
  ketua: { nama: "Nama Ketua", jabatan: "Ketua Himpunan Mahasiswa Teknik Informatika", foto: PLACEHOLDER_FOTO } as Orang,
  sekretaris: { nama: "Nama Sekretaris", jabatan: "Sekretaris", foto: PLACEHOLDER_FOTO } as Orang,
  wakilSekretaris: { nama: "Nama Wakil Sekretaris", jabatan: "Wakil Sekretaris", foto: PLACEHOLDER_FOTO } as Orang,
  bendahara: { nama: "Nama Bendahara", jabatan: "Bendahara", foto: PLACEHOLDER_FOTO } as Orang,
  wakilBendahara: { nama: "Nama Wakil Bendahara", jabatan: "Wakil Bendahara", foto: PLACEHOLDER_FOTO } as Orang,
}

export { P }
