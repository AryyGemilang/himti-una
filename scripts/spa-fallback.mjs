// SPA fallback untuk GitHub Pages: salin index.html ke 404.html
// supaya deep-link /bidang/:slug/ tidak menghasilkan 404.
import { copyFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const dist = "dist"
const index = join(dist, "index.html")
const fallback = join(dist, "404.html")

if (!existsSync(index)) {
  console.error("spa-fallback: dist/index.html tidak ditemukan — jalankan build dulu.")
  process.exit(1)
}

copyFileSync(index, fallback)
console.log("spa-fallback: dist/404.html dibuat dari index.html")
