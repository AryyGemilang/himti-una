import "../server/env.js"
import { randomUUID } from "node:crypto"
import { stdin, stdout } from "node:process"
import pg from "pg"
import { hashPassword } from "../server/passwords.js"

const { Pool } = pg
const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) throw new Error("DATABASE_URL belum diatur.")

async function secret(prompt: string) {
  if (!stdin.isTTY || !stdin.setRawMode) throw new Error("Jalankan perintah ini dari terminal interaktif agar kata sandi tidak tampil.")
  stdout.write(prompt)
  stdin.setRawMode(true)
  stdin.resume()
  stdin.setEncoding("utf8")
  let value = ""
  return new Promise<string>((resolve, reject) => {
    const onData = (input: string) => {
      for (const char of input) {
        if (char === "\u0003") {
          stdin.setRawMode(false)
          stdin.pause()
          stdout.write("\n")
          reject(new Error("Dibatalkan."))
          return
        }
        if (char === "\r" || char === "\n") {
          stdin.setRawMode(false)
          stdin.pause()
          stdin.removeListener("data", onData)
          stdout.write("\n")
          resolve(value)
          return
        }
        if (char === "\u007f" || char === "\b") value = value.slice(0, -1)
        else if (char >= " ") value += char
      }
    }
    stdin.on("data", onData)
  })
}

const args = process.argv.slice(2)
const role = args[0]
const username = args[1]
if ((role !== "documentation" && role !== "registration") || !username || !/^[a-zA-Z0-9._-]{3,40}$/.test(username)) {
  console.error("Pemakaian: npm run admin:create -- <documentation|registration> <username>")
  process.exit(1)
}

const password = await secret("Kata sandi admin (minimal 12 karakter): ")
const confirmation = await secret("Ulangi kata sandi: ")
if (password.length < 12 || password !== confirmation) throw new Error("Kata sandi harus minimal 12 karakter dan cocok.")
const pool = new Pool({ connectionString: databaseUrl, connectionTimeoutMillis: 5_000, application_name: "himti-admin-bootstrap" })
try {
  const hash = await hashPassword(password)
  await pool.query(
    "INSERT INTO admins(id, username, role, password_hash) VALUES ($1, $2, $3, $4)",
    [randomUUID(), username, role, hash],
  )
  console.log(`Akun admin ${role} berhasil dibuat.`)
} catch (error) {
  if (error instanceof Error && "code" in error && error.code === "23505") console.error("Username sudah dipakai; tidak ada data yang ditimpa.")
  else console.error("Akun admin gagal dibuat. Pastikan migration selesai dan PostgreSQL aktif.")
  process.exitCode = 1
} finally {
  await pool.end()
}
