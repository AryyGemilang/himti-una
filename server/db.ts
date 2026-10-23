import "./env.js"
import pg from "pg"

const { Pool } = pg
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL belum dikonfigurasi. Jalankan npm run db:setup atau isi koneksi lokal pada .env.")

export const pool = new Pool({
  connectionString: databaseUrl,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  application_name: "himti-registration-local",
})

pool.on("error", () => {
  console.error("Koneksi PostgreSQL idle mengalami kesalahan.")
})
