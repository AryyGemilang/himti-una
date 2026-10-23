import "../server/env.js"
import { copyFile, mkdir, readFile, stat } from "node:fs/promises"
import { createHash, randomUUID } from "node:crypto"
import { basename, resolve } from "node:path"
import pg from "pg"

const { Pool } = pg
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL belum dikonfigurasi. Atur koneksi PostgreSQL lokal di .env.")

const sourceDirectory = resolve(process.cwd(), "public/images/kegiatan/screening-test")
const mediaDirectory = resolve(process.cwd(), process.env.MEDIA_DIR || "./storage/media")
const slug = "screening-test-rekrutmen-anggota-himti"
const title = "Screening Test Rekrutmen Anggota HIMTI"
const description = "Dokumentasi proses screening test sebagai bagian dari rekrutmen anggota HIMTI UNA."

type SeedAsset = {
  name: string
  kind: "thumbnail" | "image" | "video"
  alt: string
  order: number
  poster?: string
}

const assets: SeedAsset[] = [
  { name: "video-sesi-01-poster.jpg", kind: "thumbnail", alt: "Pratinjau dokumentasi screening test HIMTI UNA", order: -1 },
  ...Array.from({ length: 8 }, (_, index) => ({
    name: `foto-sesi-${String(index + 1).padStart(2, "0")}.jpeg`,
    kind: "image" as const,
    alt: `Foto dokumentasi screening test HIMTI UNA ${index + 1}`,
    order: index,
  })),
  { name: "video-sesi-01.mp4", kind: "video", alt: "Video dokumentasi screening test HIMTI UNA sesi 1", order: 8, poster: "video-sesi-01-poster.jpg" },
  { name: "video-sesi-02.mp4", kind: "video", alt: "Video dokumentasi screening test HIMTI UNA sesi 2", order: 9, poster: "video-sesi-02-poster.jpg" },
]

const mimeTypes: Record<string, string> = {
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".mp4": "video/mp4",
}

function mimeType(name: string) {
  const extension = basename(name).slice(basename(name).lastIndexOf(".")).toLowerCase()
  const result = mimeTypes[extension]
  if (!result) throw new Error(`Format media tidak didukung: ${name}`)
  return result
}

function hash(buffer: Buffer) {
  return createHash("sha256").update(buffer).digest("hex")
}

async function copyVerified(name: string) {
  const source = resolve(sourceDirectory, name)
  const fileName = `screening-test-${basename(name)}`
  const destination = resolve(mediaDirectory, fileName)
  const sourceBytes = await readFile(source)
  await mkdir(mediaDirectory, { recursive: true, mode: 0o700 })
  try {
    const currentBytes = await readFile(destination)
    if (hash(currentBytes) !== hash(sourceBytes)) {
      throw new Error(`Berkas tujuan ${fileName} sudah ada dengan isi berbeda; migrasi dihentikan untuk mencegah penimpaan.`)
    }
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error
    await copyFile(source, destination)
    await stat(destination)
  }
  return fileName
}

const pool = new Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 5_000, application_name: "himti-screening-documentation-seed" })
const verifiedFiles = new Set<string>()
let insertedCount = 0

try {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [slug])
    let event = await client.query<{ id: string; title: string; thumbnail_path: string | null }>(
      "SELECT id,title,thumbnail_path FROM documentation_events WHERE slug=$1 FOR UPDATE",
      [slug],
    )
    if (event.rowCount && event.rows[0].title !== title) {
      throw new Error(`Slug dokumentasi ${slug} sudah dipakai oleh judul lain; tidak ada data yang diubah.`)
    }
    if (!event.rowCount) {
      event = await client.query(
        "INSERT INTO documentation_events(id,slug,title,description,event_date,published) VALUES($1,$2,$3,$4,NULL,true) RETURNING id,title,thumbnail_path",
        [randomUUID(), slug, title, description],
      )
    }
    const eventId = event.rows[0].id
    const existing = await client.query<{ original_name: string; file_path: string; kind: string }>(
      "SELECT original_name,file_path,kind FROM documentation_media WHERE event_id=$1",
      [eventId],
    )
    const existingNames = new Set(existing.rows.map(row => row.original_name))
    const storedPaths = new Map<string, string>()
    for (const asset of assets) {
      const filePath = await copyVerified(asset.name)
      storedPaths.set(asset.name, filePath)
      verifiedFiles.add(asset.name)
      const posterPath = asset.poster ? await copyVerified(asset.poster) : null
      if (asset.poster) {
        storedPaths.set(asset.poster, posterPath!)
        verifiedFiles.add(asset.poster)
      }
      if (existingNames.has(asset.name)) continue
      await client.query(
        `INSERT INTO documentation_media(id,event_id,kind,file_path,mime_type,original_name,alt_text,sort_order,poster_path)
         VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [randomUUID(), eventId, asset.kind, filePath, mimeType(asset.name), asset.name, asset.alt, asset.order, posterPath],
      )
      insertedCount += 1
    }

    const thumbnail = storedPaths.get("video-sesi-01-poster.jpg") || existing.rows.find(row => row.kind === "thumbnail")?.file_path
    if (thumbnail && !event.rows[0].thumbnail_path) {
      await client.query("UPDATE documentation_events SET thumbnail_path=$2,updated_at=now() WHERE id=$1", [eventId, thumbnail])
    }
    await client.query("COMMIT")
    console.log(`Dokumentasi ${title} siap: ${insertedCount} metadata baru ditambahkan; ${verifiedFiles.size} file sumber diverifikasi/disalin.`)
    console.log("Sumber asli tetap berada di public/images/kegiatan/screening-test/.")
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "Migrasi dokumentasi gagal.")
  process.exitCode = 1
} finally {
  await pool.end()
}
