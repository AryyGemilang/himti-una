// GitHub Pages SPA support:
// - 404.html sebagai fallback umum
// - dist/bidang/<slug>/index.html per halaman detail agar deep-link
//   mengembalikan HTTP 200 (bukan 404) dan tetap SEO-friendly.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const dist = "dist"
const index = join(dist, "index.html")

if (!existsSync(index)) {
  console.error("spa-fallback: dist/index.html tidak ditemukan — jalankan build dulu.")
  process.exit(1)
}

const html = readFileSync(index, "utf8")

// Fallback umum
copyFileSync(index, join(dist, "404.html"))

// Slug harus sinkron dengan src/data/bidang.ts
const SLUGS = ["kaderisasi", "humas", "kominfo", "agama-sosial", "minat-bakat"]
const TITLES = {
  kaderisasi: "Bidang Kaderisasi",
  humas: "Bidang Humas",
  kominfo: "Bidang Kominfo",
  "agama-sosial": "Bidang Agama & Sosial",
  "minat-bakat": "Bidang Minat & Bakat",
}

for (const slug of SLUGS) {
  const dir = join(dist, "bidang", slug)
  mkdirSync(dir, { recursive: true })
  const page = html.replace(
    /<title>.*?<\/title>/,
    `<title>${TITLES[slug]} — HIMTI UNA</title>`
  )
  writeFileSync(join(dir, "index.html"), page)
}

console.log(`spa-fallback: 404.html + ${SLUGS.length} halaman bidang dibuat`)
