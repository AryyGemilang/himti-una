export type Orang = { nama: string; jabatan: string; foto: string }

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
}

export { P }
