// GitHub Pages SPA support:
// - 404.html sebagai fallback umum
// - direktori route statis agar deep-link GitHub Pages mengembalikan HTTP 200.
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

// Route ini harus sinkron dengan src/App.tsx dan src/data/bidang.ts.
const PAGES = {
  "bidang/kaderisasi": "Bidang Kaderisasi",
  "bidang/humas": "Bidang Humas",
  "bidang/kominfo": "Bidang Kominfo",
  "bidang/agama-sosial": "Bidang Agama & Sosial",
  "bidang/minat-bakat": "Bidang Minat & Bakat",
}

for (const [route, title] of Object.entries(PAGES)) {
  const dir = join(dist, route)
  mkdirSync(dir, { recursive: true })
  const page = html.replace(
    /<title>.*?<\/title>/,
    `<title>${title}</title>`
  )
  writeFileSync(join(dir, "index.html"), page)
}

console.log(`spa-fallback: 404.html + ${Object.keys(PAGES).length} halaman route dibuat`)
