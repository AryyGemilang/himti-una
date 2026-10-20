export type Orang = {
  nama: string
  namaLengkap: string
  jabatan: string
  foto: string
}

export const PLACEHOLDER_FOTO = "/himti-una/images/pengurus/placeholder-person.svg"
export const PERIODE = "Periode Kepengurusan 2025/2026"

// Pemetaan aset mengikuti nama dan jabatan pada berkas foto yang tersedia.
export const FOTO_PENGURUS = {
  ketua: "/himti-una/images/pengurus/inti/muhammad-kenichiro-athallah-ketua-umum.webp",
  sekretaris: "/himti-una/images/pengurus/inti/pasya-sekretaris-umum.webp",
  bendahara: "/himti-una/images/pengurus/inti/natalie-bendahara-umum.webp",
  kepalaBidangHumas: "/himti-una/images/pengurus/kepala-bidang/yudha-kepala-bidang-humas.webp",
  kepalaBidangKaderisasi: "/himti-una/images/pengurus/kepala-bidang/milhan-kepala-bidang-kaderisasi.webp",
  kepalaBidangAgamaSosial: "/himti-una/images/pengurus/kepala-bidang/bagus-kepala-bidang-agama-sosial.webp",
} as const

export const dewanPengawas: Orang[] = [
  {
    nama: "Bintang",
    namaLengkap: "Bintang Fajar Ruslita Putra",
    jabatan: "Dewan Pengawas Organisasi",
    foto: "/himti-una/images/pengurus/dewan-pengawas/bintang-dewan-pengawas-organisasi.webp",
  },
  {
    nama: "Farhan",
    namaLengkap: "Farhan Fadli Manurung",
    jabatan: "Dewan Pengawas Organisasi",
    foto: "/himti-una/images/pengurus/dewan-pengawas/farhan-dewan-pengawas-organisasi.webp",
  },
  {
    nama: "Intan",
    namaLengkap: "Intan Nabila Sari",
    jabatan: "Dewan Pengawas Organisasi",
    foto: PLACEHOLDER_FOTO,
  },
]

export const pengurus = {
  ketua: {
    nama: "Keni",
    namaLengkap: "Muhammad Kenichiro Athallah",
    jabatan: "Ketua Umum",
    foto: FOTO_PENGURUS.ketua,
  } satisfies Orang,
  sekretaris: {
    nama: "Pasya",
    namaLengkap: "Rizki Pasya Astani",
    jabatan: "Sekretaris Umum",
    foto: FOTO_PENGURUS.sekretaris,
  } satisfies Orang,
  wakilSekretaris: {
    nama: "Arya",
    namaLengkap: "Arya Gemilang Sinuhaji",
    jabatan: "W. Sekretaris Umum",
    foto: PLACEHOLDER_FOTO,
  } satisfies Orang,
  bendahara: {
    nama: "Natalie",
    namaLengkap: "Natalie Audrey Simanjuntak",
    jabatan: "Bendahara Umum",
    foto: FOTO_PENGURUS.bendahara,
  } satisfies Orang,
  wakilBendahara: {
    nama: "Dewi",
    namaLengkap: "Dewi Ayu Lestari Br.Saragih",
    jabatan: "W. Bendahara Umum",
    foto: PLACEHOLDER_FOTO,
  } satisfies Orang,
}
