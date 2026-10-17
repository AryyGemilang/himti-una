import type { Orang } from "./pengurus"
import { FOTO_PENGURUS, PLACEHOLDER_FOTO } from "./pengurus"

export type GaleriItem = {
  foto: string
  caption?: string
  tanggal?: string
}

export type BidangDetail = {
  slug: string
  nama: string
  namaPendek: string
  deskripsi: string
  head: Orang
  anggota: Orang[]
  tugas: string[]
  galeri: GaleriItem[]
}

// Deskripsi tugas & fungsi bersifat uraian fungsi umum bidang, bukan ketetapan resmi organisasi.
export const bidangList: BidangDetail[] = [
  {
    slug: "kaderisasi",
    nama: "Bidang Kaderisasi",
    namaPendek: "Kaderisasi",
    deskripsi:
      "Bidang yang berfokus pada pembinaan, pengembangan kualitas, dan regenerasi anggota HIMTI UNA.",
    head: { nama: "Kepala Bidang", jabatan: "Kepala Bidang Kaderisasi", foto: PLACEHOLDER_FOTO },
    anggota: [],
    tugas: [
      "Pengembangan kualitas dan kapasitas anggota HIMTI UNA.",
      "Pembinaan serta regenerasi keberlanjutan organisasi.",
      "Peningkatan kepemimpinan, kedisiplinan, dan tanggung jawab anggota.",
    ],
    galeri: [],
  },
  {
    slug: "humas",
    nama: "Bidang Humas",
    namaPendek: "Humas",
    deskripsi:
      "Bidang yang mengelola komunikasi organisasi dan membangun hubungan baik dengan pihak internal maupun eksternal.",
    head: { nama: "Yudha", jabatan: "Kepala Bidang Humas", foto: FOTO_PENGURUS.kepalaBidangHumas },
    anggota: [],
    tugas: [
      "Menjalin komunikasi organisasi dengan pihak internal dan eksternal.",
      "Menyebarkan informasi serta mengelola hubungan organisasi.",
      "Membangun citra positif HIMTI UNA.",
    ],
    galeri: [],
  },
  {
    slug: "kominfo",
    nama: "Bidang Kominfo",
    namaPendek: "Kominfo",
    deskripsi:
      "Bidang yang menangani informasi, komunikasi digital, publikasi kegiatan, dan dukungan teknologi organisasi.",
    head: { nama: "Kepala Bidang", jabatan: "Kepala Bidang Kominfo", foto: PLACEHOLDER_FOTO },
    anggota: [],
    tugas: [
      "Pengelolaan informasi dan komunikasi digital organisasi.",
      "Publikasi kegiatan serta pengelolaan media informasi.",
      "Dokumentasi visual dan dukungan teknologi informasi organisasi.",
    ],
    galeri: [],
  },
  {
    slug: "agama-sosial",
    nama: "Bidang Agama & Sosial",
    namaPendek: "Agama & Sosial",
    deskripsi:
      "Bidang yang mengembangkan kegiatan keagamaan dan sosial serta memperkuat kepedulian dan kebersamaan anggota.",
    head: { nama: "Kepala Bidang", jabatan: "Kepala Bidang Agama & Sosial", foto: PLACEHOLDER_FOTO },
    anggota: [],
    tugas: [
      "Pengembangan kegiatan keagamaan dan sosial.",
      "Penguatan kepedulian, solidaritas, dan kebersamaan.",
      "Pelaksanaan kegiatan sosial yang relevan bagi anggota dan masyarakat.",
    ],
    galeri: [],
  },
  {
    slug: "minat-bakat",
    nama: "Bidang Minat & Bakat",
    namaPendek: "Minat & Bakat",
    deskripsi:
      "Bidang yang memfasilitasi pengembangan minat, potensi, kreativitas, dan prestasi anggota HIMTI UNA.",
    head: { nama: "Kepala Bidang", jabatan: "Kepala Bidang Minat & Bakat", foto: PLACEHOLDER_FOTO },
    anggota: [],
    tugas: [
      "Pengembangan minat dan potensi anggota.",
      "Fasilitasi kegiatan kreatif, akademik, dan nonakademik sesuai program kerja.",
      "Mendorong kolaborasi, kreativitas, dan prestasi anggota.",
    ],
    galeri: [],
  },
]

export const getBidang = (slug: string) => bidangList.find(b => b.slug === slug)
