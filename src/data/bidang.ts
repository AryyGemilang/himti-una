import type { Orang } from "./pengurus"
import { FOTO_PENGURUS, PLACEHOLDER_FOTO } from "./pengurus"

export type BidangDetail = {
  slug: string
  nama: string
  namaPendek: string
  deskripsi: string
  head: Orang
  anggota: Orang[]
  tugas: string[]
}

// Deskripsi tugas & fungsi bersifat uraian fungsi umum bidang, bukan ketetapan resmi organisasi.
export const bidangList: BidangDetail[] = [
  {
    slug: "kaderisasi",
    nama: "Bidang Kaderisasi",
    namaPendek: "Kaderisasi",
    deskripsi:
      "Bidang yang berfokus pada pembinaan, pengembangan kualitas, dan regenerasi anggota HIMTI UNA.",
    head: { nama: "Milhan", namaLengkap: "Milhan Dwi Fazril", jabatan: "Kadiv Kaderisasi", foto: FOTO_PENGURUS.kepalaBidangKaderisasi },
    anggota: [
      { nama: "Noviza", namaLengkap: "Noviza Syafira Nst", jabatan: "Anggota Kaderisasi", foto: PLACEHOLDER_FOTO },
      { nama: "Pandu", namaLengkap: "Pandu Perdana", jabatan: "Anggota Kaderisasi", foto: PLACEHOLDER_FOTO },
      { nama: "Raehan", namaLengkap: "Raehan Perdana Utama", jabatan: "Anggota Kaderisasi", foto: PLACEHOLDER_FOTO },
      { nama: "Nicolas", namaLengkap: "Nicolas Rajani Sianturi", jabatan: "Anggota Kaderisasi", foto: PLACEHOLDER_FOTO },
    ],
    tugas: [
      "Pengembangan kualitas dan kapasitas anggota HIMTI UNA.",
      "Pembinaan serta regenerasi keberlanjutan organisasi.",
      "Peningkatan kepemimpinan, kedisiplinan, dan tanggung jawab anggota.",
    ],
  },
  {
    slug: "humas",
    nama: "Bidang Humas",
    namaPendek: "Humas",
    deskripsi:
      "Bidang yang mengelola komunikasi organisasi dan membangun hubungan baik dengan pihak internal maupun eksternal.",
    head: { nama: "Yudha", namaLengkap: "Yudha Pratama Putra Sitorus", jabatan: "Kadiv Humas", foto: FOTO_PENGURUS.kepalaBidangHumas },
    anggota: [
      { nama: "Fadlan", namaLengkap: "Fadlan Youary Siregar", jabatan: "Anggota Humas", foto: PLACEHOLDER_FOTO },
      {
        nama: "Nina",
        namaLengkap: "Nina Dewani",
        jabatan: "Anggota Humas",
        foto: "/himti-una/images/pengurus/anggota/Humas/Nina - anggota Humas.svg",
      },
      {
        nama: "Dyta",
        namaLengkap: "Anan Dyta Juhaira",
        jabatan: "Anggota Humas",
        foto: "/himti-una/images/pengurus/anggota/Humas/Dyta - Anggota Humas.svg",
      },
    ],
    tugas: [
      "Menjalin komunikasi organisasi dengan pihak internal dan eksternal.",
      "Menyebarkan informasi serta mengelola hubungan organisasi.",
      "Membangun citra positif HIMTI UNA.",
    ],
  },
  {
    slug: "kominfo",
    nama: "Bidang Kominfo",
    namaPendek: "Kominfo",
    deskripsi:
      "Bidang yang menangani informasi, komunikasi digital, publikasi kegiatan, dan dukungan teknologi organisasi.",
    head: { nama: "Rizki", namaLengkap: "Muhammad Rizki Sitorus", jabatan: "Kadiv Kominfo", foto: PLACEHOLDER_FOTO },
    anggota: [
      { nama: "Dinda", namaLengkap: "Dinda Amalia Marpaung", jabatan: "Anggota Kominfo", foto: "/himti-una/images/pengurus/anggota/Kominfo/Dinda - Anggota Kominfo.svg" },
      { nama: "Nazwa", namaLengkap: "Nazwa Karlia Suci Amalia", jabatan: "Anggota Kominfo", foto: PLACEHOLDER_FOTO },
      { nama: "Aksa", namaLengkap: "Aksa Fajar Nirwansyah", jabatan: "Anggota Kominfo", foto: PLACEHOLDER_FOTO },
    ],
    tugas: [
      "Pengelolaan informasi dan komunikasi digital organisasi.",
      "Publikasi kegiatan serta pengelolaan media informasi.",
      "Dokumentasi visual dan dukungan teknologi informasi organisasi.",
    ],
  },
  {
    slug: "agama-sosial",
    nama: "Bidang Agama & Sosial",
    namaPendek: "Agama & Sosial",
    deskripsi:
      "Bidang yang mengembangkan kegiatan keagamaan dan sosial serta memperkuat kepedulian dan kebersamaan anggota.",
    head: { nama: "Bagus", namaLengkap: "Bagus Tata Abdillah", jabatan: "Kadiv Agama & Social", foto: FOTO_PENGURUS.kepalaBidangAgamaSosial },
    anggota: [
      { nama: "Rafif", namaLengkap: "Rafif Arya Pratama", jabatan: "Anggota Agama & Social", foto: PLACEHOLDER_FOTO },
      {
        nama: "Gilang",
        namaLengkap: "Gilang Ramadhansyah",
        jabatan: "Anggota Agama & Sosial",
        foto: "/himti-una/images/pengurus/anggota/Agama_&_Sosial/Gilang - Anggota Agama & Sosial.svg",
      },
      {
        nama: "Joshua",
        namaLengkap: "Joshua Pransiskus Sinurat",
        jabatan: "Anggota Agama & Social",
        foto: "/himti-una/images/pengurus/anggota/Agama_&_Sosial/Joshua - Agama & Sosial.svg",
      },
      { nama: "Ernita", namaLengkap: "Ernita Lumban Toruan", jabatan: "Anggota Agama & Social", foto: PLACEHOLDER_FOTO },
      { nama: "Dian", namaLengkap: "Dian Mawarni", jabatan: "Anggota Agama & Social", foto: PLACEHOLDER_FOTO },
    ],
    tugas: [
      "Pengembangan kegiatan keagamaan dan sosial.",
      "Penguatan kepedulian, solidaritas, dan kebersamaan.",
      "Pelaksanaan kegiatan sosial yang relevan bagi anggota dan masyarakat.",
    ],
  },
  {
    slug: "minat-bakat",
    nama: "Bidang Minat & Bakat",
    namaPendek: "Minat & Bakat",
    deskripsi:
      "Bidang yang memfasilitasi pengembangan minat, potensi, kreativitas, dan prestasi anggota HIMTI UNA.",
    head: { nama: "Riyan", namaLengkap: "M.Riyan Fahriza", jabatan: "Kadiv Minat & Bakat", foto: PLACEHOLDER_FOTO },
    anggota: [
      { nama: "Dini", namaLengkap: "Syafrina Andini", jabatan: "Anggota Minat & Bakat", foto: PLACEHOLDER_FOTO },
      {
        nama: "Citra",
        namaLengkap: "Citra Friska Della Andini",
        jabatan: "Anggota Minat & Bakat",
        foto: "/himti-una/images/pengurus/anggota/Minat_Bakat/Citra - Anggota Minat Bakat.svg",
      },
      { nama: "Hera", namaLengkap: "Hera Nur Paiza", jabatan: "Anggota Minat & Bakat", foto: PLACEHOLDER_FOTO },
      { nama: "Nabila", namaLengkap: "Nabila Adha", jabatan: "Anggota Minat & Bakat", foto: PLACEHOLDER_FOTO },
    ],
    tugas: [
      "Pengembangan minat dan potensi anggota.",
      "Fasilitasi kegiatan kreatif, akademik, dan nonakademik sesuai program kerja.",
      "Mendorong kolaborasi, kreativitas, dan prestasi anggota.",
    ],
  },
]

export const getBidang = (slug: string) => bidangList.find(b => b.slug === slug)
