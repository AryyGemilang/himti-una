export type Orang = {
  nama: string
  namaLengkap: string
  jabatan: string
  foto: string
}

export const PLACEHOLDER_FOTO = "/himti-una/images/people/placeholder-person.svg"
export const PERIODE = "Periode Kepengurusan 2025/2026"

// Pemetaan aset mengikuti nama dan jabatan pada berkas foto yang tersedia.
export const FOTO_PENGURUS = {
  ketua: "/himti-una/images/people/Mhd Kenichiro Athallah - Ketua Himpunan.svg",
  sekretaris: "/himti-una/images/pengurus/Pasya - Sekretaris Umum.svg",
  bendahara: "/himti-una/images/pengurus/Natalie - Bendahara Umum.svg",
  kepalaBidangHumas: "/himti-una/images/pengurus/kabid/Yudha - Kabid Humas .svg",
  kepalaBidangKaderisasi: "/himti-una/images/pengurus/kabid/Milhan - kabid Kaderisasi.svg",
  kepalaBidangAgamaSosial: "/himti-una/images/pengurus/kabid/Bagus - kabid Agama & sosial.svg",
} as const

export const dewanPengawas: Orang[] = [
  {
    nama: "Bintang",
    namaLengkap: "Bintang Fajar Ruslita Putra",
    jabatan: "Dewan Pengawas Organisasi",
    foto: "/himti-una/images/pengurus/dewan_pengawas_organisasi/Bintang - dewan pengawas organisasi.svg",
  },
  {
    nama: "Farhan",
    namaLengkap: "Farhan Fadli Manurung",
    jabatan: "Dewan Pengawas Organisasi",
    foto: "/himti-una/images/pengurus/dewan_pengawas_organisasi/Farhan - dewan pengawas organisasi.svg",
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
