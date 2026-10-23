import "./env.js"
import { readFile } from "node:fs/promises"
import { readdir } from "node:fs/promises"
import { resolve } from "node:path"
import pg from "pg"

const { Pool } = pg
const migrationUrl = process.env.MIGRATION_DATABASE_URL || process.env.DATABASE_URL
if (!migrationUrl) throw new Error("MIGRATION_DATABASE_URL belum diatur.")
const pool = new Pool({ connectionString: migrationUrl, connectionTimeoutMillis: 5_000, application_name: "himti-migrations" })

try {
  const client = await pool.connect()
  try {
    await client.query(`CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`)
    const directory = resolve(process.cwd(), "server/migrations")
    const files = (await readdir(directory)).filter(file => /^\d+_[a-z0-9_]+\.sql$/.test(file)).sort()
    for (const file of files) {
      const applied = await client.query("SELECT 1 FROM schema_migrations WHERE name = $1", [file])
      if (applied.rowCount) continue
      const sql = await readFile(resolve(directory, file), "utf8")
      await client.query("BEGIN")
      try {
        await client.query(sql)
        await client.query("INSERT INTO schema_migrations(name) VALUES ($1)", [file])
        await client.query("COMMIT")
        console.log(`Migration diterapkan: ${file}`)
      } catch (error) {
        await client.query("ROLLBACK")
        throw error
      }
    }
    console.log("Migration PostgreSQL selesai.")
  } finally {
    client.release()
  }
} catch (error) {
  console.error("Migration gagal. Periksa PostgreSQL lokal dan DATABASE_URL.")
  if (process.env.NODE_ENV === "development") console.error(error instanceof Error ? error.message : "Kesalahan tidak diketahui")
  process.exitCode = 1
} finally {
  await pool.end()
}
