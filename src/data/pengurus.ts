export type Orang = { nama: string; jabatan: string; foto: string }

export const PLACEHOLDER_FOTO = "/himti-una/images/people/placeholder-person.svg"
export const PERIODE = "Periode Kepengurusan 2025/2026" // ganti sesuai periode resmi

// Pemetaan aset mengikuti nama dan jabatan yang tercantum pada nama berkas di public/images.
export const FOTO_PENGURUS = {
  ketua: "/himti-una/images/people/Mhd Kenichiro Athallah - Ketua Himpunan.svg",
  sekretaris: "/himti-una/images/pengurus/Pasya - Sekretaris Umum.svg",
  bendahara: "/himti-una/images/pengurus/Natalie - Bendahara Umum.svg",
  kepalaBidangHumas: "/himti-una/images/pengurus/kabid/Yudha - Kabid Humas .svg",
} as const

export const pengurus = {
  ketua: { nama: "Mhd Kenichiro Athallah", jabatan: "Ketua Himpunan Mahasiswa Teknik Informatika", foto: FOTO_PENGURUS.ketua } as Orang,
  sekretaris: { nama: "Pasya", jabatan: "Sekretaris Umum", foto: FOTO_PENGURUS.sekretaris } as Orang,
  wakilSekretaris: { nama: "Nama Wakil Sekretaris", jabatan: "Wakil Sekretaris", foto: PLACEHOLDER_FOTO } as Orang,
  bendahara: { nama: "Natalie", jabatan: "Bendahara Umum", foto: FOTO_PENGURUS.bendahara } as Orang,
  wakilBendahara: { nama: "Nama Wakil Bendahara", jabatan: "Wakil Bendahara", foto: PLACEHOLDER_FOTO } as Orang,
}
