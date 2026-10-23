import "./env.js"
import express, { type NextFunction, type Request, type Response } from "express"
import multer from "multer"
import { createHash, randomBytes, randomUUID } from "node:crypto"
import { mkdir, unlink } from "node:fs/promises"
import { basename, extname, resolve } from "node:path"
import { pool } from "./db.js"
import { verifyPassword } from "./passwords.js"
import { createPdf } from "./pdf.js"
import { isRegistrationOpen, normalizeEmail, normalizeNpm, reachedRegistrationLimit, validateAnswers, type FormField } from "./registration-rules.js"

type AdminRole = "documentation" | "registration"
type Admin = { id: string; username: string; role: AdminRole }
type AuthenticatedRequest = Request & { auth?: { admin: Admin; csrfToken: string } }
type EventRow = {
  id: string; slug: string; title: string; description: string; event_type: string; form_schema: FormField[];
  includes_npm: boolean; opens_at: Date; closes_at: Date; manual_closed: boolean; published: boolean; created_at: Date; updated_at: Date
}

const app = express()
const port = Number(process.env.API_PORT || 3001)
const mediaDir = resolve(process.env.MEDIA_DIR || "./storage/media")
const secureCookie = process.env.SESSION_COOKIE_SECURE === "true"
const maxLoginAttempts = new Map<string, { count: number; resetAt: number }>()
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const maxFileSize = 60 * 1024 * 1024
const mediaExtensions: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"],
  "video/mp4": [".mp4"], "video/webm": [".webm"],
}

await mkdir(mediaDir, { recursive: true })

app.disable("x-powered-by")
app.use(express.json({ limit: "1mb" }))
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin")
  res.setHeader("Cache-Control", req.path.startsWith("/api/admin") ? "no-store" : "public, max-age=60")
  if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    const origin = req.get("origin")
    if (origin && origin !== `${req.protocol}://${req.get("host")}`) return res.status(403).json({ error: "Permintaan lintas situs ditolak." })
  }
  next()
})
app.use("/media", express.static(mediaDir, { fallthrough: false, immutable: true, maxAge: "1y", setHeaders(res) { res.setHeader("X-Content-Type-Options", "nosniff") } }))

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize, files: 1 },
  fileFilter(_req, file, callback) {
    const extension = extname(cleanName(file.originalname)).toLowerCase()
    const allowed = (mediaExtensions[file.mimetype] || []).includes(extension)
    if (!allowed) return callback(new Error("Format harus sesuai dengan berkas: JPG, PNG, WebP, MP4, atau WebM."))
    callback(null, true)
  },
})

async function removeUnreferencedMedia(paths: Array<string | null | undefined>) {
  const candidates = [...new Set(paths.filter((path): path is string => Boolean(path)))]
  if (!candidates.length) return
  const references = await pool.query(
    "SELECT file_path AS path FROM documentation_media WHERE file_path=ANY($1::text[]) UNION SELECT poster_path AS path FROM documentation_media WHERE poster_path=ANY($1::text[])",
    [candidates],
  )
  const referenced = new Set(references.rows.map(row => row.path))
  await Promise.all(candidates.filter(path => !referenced.has(path)).map(path => unlink(resolve(mediaDir, path)).catch(() => undefined)))
}

function cookieValue(request: Request, name: string) {
  const header = request.headers.cookie || ""
  for (const item of header.split(";")) {
    const [key, ...value] = item.trim().split("=")
    if (key === name) return decodeURIComponent(value.join("="))
  }
  return undefined
}

const digest = (value: string) => createHash("sha256").update(value).digest("hex")

async function attachAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const token = cookieValue(req, "himti_admin")
  if (!token) return res.status(401).json({ error: "Silakan masuk sebagai admin." })
  try {
    const result = await pool.query(
      `SELECT a.id, a.username, a.role, s.csrf_token
       FROM admin_sessions s JOIN admins a ON a.id = s.admin_id
       WHERE s.token_hash = $1 AND s.expires_at > now() AND a.active = true`,
      [digest(token)],
    )
    if (!result.rowCount) return res.status(401).json({ error: "Sesi admin berakhir. Silakan masuk kembali." })
    const row = result.rows[0]
    req.auth = { admin: { id: row.id, username: row.username, role: row.role }, csrfToken: row.csrf_token }
    next()
  } catch {
    res.status(503).json({ error: "Layanan admin sementara tidak tersedia." })
  }
}

function requireRole(role: AdminRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.auth?.admin.role !== role) return res.status(403).json({ error: "Akun ini tidak memiliki izin untuk fitur tersebut." })
    next()
  }
}

function requireCsrf(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  if (!req.auth || req.get("x-csrf-token") !== req.auth.csrfToken) return res.status(403).json({ error: "Token keamanan tidak valid. Muat ulang halaman admin." })
  next()
}

function parseSchema(value: unknown): FormField[] | null {
  if (!Array.isArray(value) || value.length > 40) return null
  const fields: FormField[] = []
  const ids = new Set<string>()
  for (const item of value) {
    if (!item || typeof item !== "object") return null
    const candidate = item as Record<string, unknown>
    if (typeof candidate.id !== "string" || !/^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(candidate.id) || ids.has(candidate.id)) return null
    if (typeof candidate.label !== "string" || !candidate.label.trim() || candidate.label.length > 180) return null
    if (!["text", "textarea", "select", "checkbox"].includes(String(candidate.type))) return null
    if (typeof candidate.required !== "boolean") return null
    const field: FormField = { id: candidate.id, label: candidate.label.trim(), type: candidate.type as FormField["type"], required: candidate.required }
    if (field.type === "select" || field.type === "checkbox") {
      if (!Array.isArray(candidate.options) || candidate.options.length < 1 || candidate.options.length > 30) return null
      const options = candidate.options.map(option => typeof option === "string" ? option.trim() : "")
      if (options.some(option => !option || option.length > 120) || new Set(options).size !== options.length) return null
      field.options = options
    }
    ids.add(field.id)
    fields.push(field)
  }
  return fields
}

function eventStatus(row: EventRow, now = Date.now()) {
  return isRegistrationOpen(row, now)
}

function publicEvent(row: EventRow) {
  const isOpen = eventStatus(row)
  const now = Date.now()
  const status = !row.published ? "draft" : row.manual_closed || now >= new Date(row.closes_at).getTime() ? "closed" : now < new Date(row.opens_at).getTime() ? "scheduled" : "open"
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    type: row.event_type,
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    registrationOpen: isOpen,
    status,
    formUrl: isOpen ? `/pendaftaran/${encodeURIComponent(row.slug)}` : null,
  }
}

function assertEventInput(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : ""
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : ""
  const description = typeof body.description === "string" ? body.description.trim() : ""
  const eventType = body.eventType
  const opensAt = new Date(String(body.opensAt || ""))
  const closesAt = new Date(String(body.closesAt || ""))
  const fields = parseSchema(body.fields)
  if (!title || title.length > 180) return { error: "Judul kegiatan wajib diisi, maksimal 180 karakter." }
  if (!slugPattern.test(slug)) return { error: "Slug gunakan huruf kecil, angka, dan tanda hubung." }
  if (description.length > 6000) return { error: "Deskripsi maksimal 6.000 karakter." }
  if (!["training", "competition", "recruitment", "other"].includes(String(eventType))) return { error: "Jenis kegiatan tidak valid." }
  if (!Number.isFinite(opensAt.getTime()) || !Number.isFinite(closesAt.getTime()) || closesAt <= opensAt) return { error: "Waktu penutupan harus sesudah waktu pembukaan." }
  if (!fields) return { error: "Susunan pertanyaan formulir tidak valid (maksimal 40 pertanyaan)." }
  if (body.includesNpm !== undefined && typeof body.includesNpm !== "boolean") return { error: "Pilihan NPM tidak valid." }
  return { data: { title, slug, description, eventType, opensAt: opensAt.toISOString(), closesAt: closesAt.toISOString(), fields, includesNpm: body.includesNpm === true } }
}

function asEvent(row: Record<string, unknown>): EventRow {
  return row as unknown as EventRow
}

function cleanName(value: string) {
  return basename(value).replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(0, 160) || "media"
}

function validMediaSignature(buffer: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
  if (mimeType === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  if (mimeType === "image/webp") return buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP"
  if (mimeType === "video/mp4") return buffer.toString("ascii", 4, 8) === "ftyp"
  if (mimeType === "video/webm") return buffer.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
  return false
}

function csvCell(value: unknown) {
  let text = value === null || value === undefined ? "" : Array.isArray(value) ? value.join(", ") : String(value)
  if (/^[\t\r ]*[=+@-]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}

app.get("/api/health", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store")
  try {
    await pool.query("SELECT 1")
    res.json({ ok: true, database: "connected" })
  } catch {
    res.status(503).json({ ok: false, database: "unavailable" })
  }
})

app.get("/api/events", async (_req, res) => {
  res.setHeader("Cache-Control", "no-store")
  const result = await pool.query<EventRow>("SELECT * FROM registration_events WHERE published = true ORDER BY opens_at DESC")
  res.json(result.rows.map(publicEvent))
})

app.get("/api/events/:slug/form", async (req, res) => {
  res.setHeader("Cache-Control", "no-store")
  const result = await pool.query<EventRow>("SELECT * FROM registration_events WHERE slug = $1 AND published = true", [req.params.slug])
  const row = result.rows[0]
  if (!row || !eventStatus(row)) return res.status(404).json({ error: "Halaman pendaftaran tidak ditemukan." })
  res.json({ ...publicEvent(row), includesNpm: row.includes_npm, fields: row.form_schema })
})

app.post("/api/registrations/:slug", async (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const npm = normalizeNpm(req.body?.npm)
  if (!emailPattern.test(email) || email.length > 254) return res.status(400).json({ error: "Masukkan alamat email yang valid." })
  if (npm.length > 40) return res.status(400).json({ error: "NPM maksimal 40 karakter." })
  const client = await pool.connect()
  let pdf: Buffer
  let registrationId = ""
  try {
    await client.query("BEGIN")
    const eventResult = await client.query<EventRow>("SELECT * FROM registration_events WHERE slug = $1 AND published = true FOR SHARE", [req.params.slug])
    const event = eventResult.rows[0]
    if (!event || !eventStatus(event)) {
      await client.query("ROLLBACK")
      return res.status(404).json({ error: "Halaman pendaftaran tidak ditemukan." })
    }
    if (event.includes_npm && !npm) {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: "NPM wajib diisi untuk kegiatan ini." })
    }
    if (!event.includes_npm && npm) {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: "Formulir ini tidak menerima data NPM." })
    }
    const answerError = validateAnswers(event.form_schema, req.body?.answers)
    if (answerError) {
      await client.query("ROLLBACK")
      return res.status(400).json({ error: answerError })
    }
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))", [event.id, `email:${email}`])
    if (event.includes_npm) await client.query("SELECT pg_advisory_xact_lock(hashtext($1), hashtext($2))", [event.id, `npm:${npm}`])
    const emailCount = await client.query("SELECT count(*)::int AS total FROM registrations WHERE event_id = $1 AND lower(email) = $2", [event.id, email])
    const npmCount = event.includes_npm
      ? await client.query("SELECT count(*)::int AS total FROM registrations WHERE event_id = $1 AND upper(npm) = $2", [event.id, npm])
      : { rows: [{ total: 0 }] }
    if (reachedRegistrationLimit(emailCount.rows[0].total, npmCount.rows[0].total, event.includes_npm)) {
      await client.query("ROLLBACK")
      return res.status(409).json({ error: "Batas tiga pendaftaran untuk email atau NPM ini pada kegiatan tersebut sudah tercapai." })
    }
    registrationId = randomUUID()
    const submittedAt = new Date()
    const answers = req.body.answers as Record<string, unknown>
    await client.query(
      `INSERT INTO registrations(id, event_id, email, npm, answers, schema_snapshot, submitted_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7)`,
      [registrationId, event.id, email, event.includes_npm ? npm : null, JSON.stringify(answers), JSON.stringify(event.form_schema), submittedAt],
    )
    const pairs = [
      { label: "Kegiatan", value: event.title },
      { label: "Nomor pendaftaran", value: registrationId },
      { label: "Email", value: email },
      ...(event.includes_npm ? [{ label: "NPM", value: npm }] : []),
      ...event.form_schema.map(field => ({ label: field.label, value: Array.isArray(answers[field.id]) ? (answers[field.id] as string[]).join(", ") : String(answers[field.id] ?? "—") })),
      { label: "Waktu pendaftaran", value: new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(submittedAt) + " WIB" },
    ]
    pdf = await createPdf("Bukti Pendaftaran", "Simpan dokumen ini sebagai bukti pengiriman formulir.", pairs)
    await client.query("COMMIT")
  } catch (error) {
    try { await client.query("ROLLBACK") } catch { /* koneksi telah ditutup */ }
    if (error instanceof Error && "code" in error && error.code === "23505") return res.status(409).json({ error: "Pendaftaran tidak dapat disimpan karena data serupa sudah tercatat." })
    console.error("Pendaftaran gagal diproses.")
    return res.status(503).json({ error: "Pendaftaran belum tersimpan. Silakan coba kembali." })
  } finally {
    client.release()
  }
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", `attachment; filename="bukti-pendaftaran-${registrationId.slice(0, 8)}.pdf"`)
  res.setHeader("Cache-Control", "no-store")
  res.send(pdf!)
})

app.get("/api/documentation", async (_req, res) => {
  const result = await pool.query(
    `SELECT id, slug, title, description, event_date, thumbnail_path
     FROM documentation_events WHERE published = true ORDER BY event_date DESC NULLS LAST, created_at DESC`,
  )
  res.json(result.rows.map(row => ({ ...row, thumbnailUrl: row.thumbnail_path ? `/media/${encodeURIComponent(row.thumbnail_path)}` : null })))
})

app.get("/api/documentation/:slug", async (req, res) => {
  const result = await pool.query("SELECT id, slug, title, description, event_date FROM documentation_events WHERE slug = $1 AND published = true", [req.params.slug])
  if (!result.rowCount) return res.status(404).json({ error: "Dokumentasi tidak ditemukan." })
  const event = result.rows[0]
  const media = await pool.query("SELECT id, kind, file_path, poster_path, mime_type, alt_text, sort_order FROM documentation_media WHERE event_id = $1 AND kind <> 'thumbnail' ORDER BY sort_order, created_at", [event.id])
  res.json({ ...event, media: media.rows.map(item => ({ ...item, url: `/media/${encodeURIComponent(item.file_path)}`, posterUrl: item.poster_path ? `/media/${encodeURIComponent(item.poster_path)}` : null })) })
})

const loginLimiter = (req: Request, res: Response, next: NextFunction) => {
  const key = req.ip || "local"
  const now = Date.now()
  const current = maxLoginAttempts.get(key)
  if (current && current.resetAt > now && current.count >= 8) return res.status(429).json({ error: "Terlalu banyak percobaan masuk. Coba lagi beberapa menit." })
  next()
}

app.post("/api/admin/login", loginLimiter, async (req, res) => {
  const username = typeof req.body?.username === "string" ? req.body.username.trim() : ""
  const password = typeof req.body?.password === "string" ? req.body.password : ""
  const key = req.ip || "local"
  const record = maxLoginAttempts.get(key)
  try {
    const result = await pool.query("SELECT id, username, role, password_hash FROM admins WHERE username = $1 AND active = true", [username])
    const account = result.rows[0]
    if (!account || !(await verifyPassword(password, account.password_hash))) {
      const current = record && record.resetAt > Date.now() ? record : { count: 0, resetAt: Date.now() + 10 * 60_000 }
      current.count += 1
      maxLoginAttempts.set(key, current)
      return res.status(401).json({ error: "Nama pengguna atau kata sandi salah." })
    }
    maxLoginAttempts.delete(key)
    const token = randomBytes(32).toString("base64url")
    const csrfToken = randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + 8 * 60 * 60_000)
    await pool.query("DELETE FROM admin_sessions WHERE expires_at <= now()")
    await pool.query("INSERT INTO admin_sessions(id, admin_id, token_hash, csrf_token, expires_at) VALUES ($1, $2, $3, $4, $5)", [randomUUID(), account.id, digest(token), csrfToken, expiresAt])
    res.cookie("himti_admin", token, { httpOnly: true, sameSite: "strict", secure: secureCookie, path: "/", expires: expiresAt })
    res.setHeader("Cache-Control", "no-store")
    res.json({ admin: { username: account.username, role: account.role }, csrfToken })
  } catch {
    res.status(503).json({ error: "Layanan admin sementara tidak tersedia." })
  }
})

app.get("/api/admin/session", attachAdmin, (req: AuthenticatedRequest, res) => {
  res.setHeader("Cache-Control", "no-store")
  res.json({ admin: req.auth!.admin, csrfToken: req.auth!.csrfToken })
})

app.post("/api/admin/logout", attachAdmin, requireCsrf, async (req: AuthenticatedRequest, res) => {
  const token = cookieValue(req, "himti_admin")
  if (token) await pool.query("DELETE FROM admin_sessions WHERE token_hash = $1", [digest(token)])
  res.clearCookie("himti_admin", { httpOnly: true, sameSite: "strict", secure: secureCookie, path: "/" })
  res.status(204).end()
})

const adminBase = "/api/admin"

app.get(`${adminBase}/events`, attachAdmin, requireRole("registration"), async (_req, res) => {
  const result = await pool.query<EventRow>("SELECT * FROM registration_events ORDER BY created_at DESC")
  res.json(result.rows.map(row => ({ ...row, ...publicEvent(row), manual_closed: row.manual_closed, published: row.published })))
})

app.post(`${adminBase}/events`, attachAdmin, requireRole("registration"), requireCsrf, async (req, res) => {
  const parsed = assertEventInput(req.body || {})
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  try {
    const data = parsed.data!
    const result = await pool.query(
      `INSERT INTO registration_events(id, slug, title, description, event_type, form_schema, includes_npm, opens_at, closes_at, published)
       VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7,$8,$9,$10) RETURNING *`,
      [randomUUID(), data.slug, data.title, data.description, data.eventType, JSON.stringify(data.fields), data.includesNpm, data.opensAt, data.closesAt, req.body.published === true],
    )
    res.status(201).json({ ...result.rows[0], registrationOpen: eventStatus(asEvent(result.rows[0])) })
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "23505") return res.status(409).json({ error: "Slug kegiatan sudah digunakan." })
    throw error
  }
})

app.put(`${adminBase}/events/:id`, attachAdmin, requireRole("registration"), requireCsrf, async (req, res) => {
  const parsed = assertEventInput(req.body || {})
  if (parsed.error) return res.status(400).json({ error: parsed.error })
  const data = parsed.data!
  try {
    const result = await pool.query(
      `UPDATE registration_events SET slug=$2,title=$3,description=$4,event_type=$5,form_schema=$6::jsonb,includes_npm=$7,
       opens_at=$8,closes_at=$9,manual_closed=$10,published=$11,updated_at=now() WHERE id=$1 RETURNING *`,
      [req.params.id, data.slug, data.title, data.description, data.eventType, JSON.stringify(data.fields), data.includesNpm, data.opensAt, data.closesAt, req.body.manualClosed === true, req.body.published === true],
    )
    if (!result.rowCount) return res.status(404).json({ error: "Kegiatan tidak ditemukan." })
    res.json({ ...result.rows[0], registrationOpen: eventStatus(asEvent(result.rows[0])) })
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "23505") return res.status(409).json({ error: "Slug kegiatan sudah digunakan." })
    throw error
  }
})

app.post(`${adminBase}/events/:id/close`, attachAdmin, requireRole("registration"), requireCsrf, async (req, res) => {
  const result = await pool.query("UPDATE registration_events SET manual_closed=true,updated_at=now() WHERE id=$1 RETURNING id", [req.params.id])
  if (!result.rowCount) return res.status(404).json({ error: "Kegiatan tidak ditemukan." })
  res.json({ ok: true, registrationOpen: false })
})

app.get(`${adminBase}/registrations`, attachAdmin, requireRole("registration"), async (req, res) => {
  const eventId = typeof req.query.eventId === "string" ? req.query.eventId : ""
  const search = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 160) : ""
  const page = Math.max(1, Number.parseInt(String(req.query.page || "1"), 10) || 1)
  const pageSize = Math.min(100, Math.max(10, Number.parseInt(String(req.query.pageSize || "50"), 10) || 50))
  const offset = (page - 1) * pageSize
  const filterValues = [eventId, search]
  const count = await pool.query(
    `SELECT count(*)::int AS total FROM registrations r JOIN registration_events e ON e.id=r.event_id
     WHERE ($1 = '' OR r.event_id::text = $1)
       AND ($2 = '' OR r.email ILIKE '%' || $2 || '%' OR COALESCE(r.npm,'') ILIKE '%' || $2 || '%' OR e.title ILIKE '%' || $2 || '%')`,
    filterValues,
  )
  const result = await pool.query(
    `SELECT r.id, r.event_id, e.title AS event_title, r.email, r.npm, r.answers, r.schema_snapshot, r.submitted_at
     FROM registrations r JOIN registration_events e ON e.id=r.event_id
     WHERE ($1 = '' OR r.event_id::text = $1)
       AND ($2 = '' OR r.email ILIKE '%' || $2 || '%' OR COALESCE(r.npm,'') ILIKE '%' || $2 || '%' OR e.title ILIKE '%' || $2 || '%')
     ORDER BY r.submitted_at DESC LIMIT $3 OFFSET $4`,
    [...filterValues, pageSize, offset],
  )
  res.json({ items: result.rows, total: count.rows[0].total, page, pageSize })
})

app.get(`${adminBase}/registrations/:id`, attachAdmin, requireRole("registration"), async (req, res) => {
  const result = await pool.query(
    `SELECT r.id,r.email,r.npm,r.answers,r.schema_snapshot,r.submitted_at,e.title AS event_title
     FROM registrations r JOIN registration_events e ON e.id=r.event_id WHERE r.id=$1`,
    [req.params.id],
  )
  if (!result.rowCount) return res.status(404).json({ error: "Data pendaftar tidak ditemukan." })
  res.json(result.rows[0])
})

app.get(`${adminBase}/registrations.csv`, attachAdmin, requireRole("registration"), async (_req, res) => {
  const eventId = typeof _req.query.eventId === "string" ? _req.query.eventId : ""
  const search = typeof _req.query.q === "string" ? _req.query.q.trim().slice(0, 160) : ""
  const result = await pool.query(
    `SELECT r.id,e.title AS event_title,r.email,r.npm,r.answers,r.schema_snapshot,r.submitted_at
     FROM registrations r JOIN registration_events e ON e.id=r.event_id
     WHERE ($1='' OR r.event_id::text=$1)
       AND ($2='' OR r.email ILIKE '%' || $2 || '%' OR COALESCE(r.npm,'') ILIKE '%' || $2 || '%' OR e.title ILIKE '%' || $2 || '%')
     ORDER BY r.submitted_at DESC`,
    [eventId, search],
  )
  const labels = new Map<string, string>()
  for (const row of result.rows) for (const field of row.schema_snapshot as FormField[]) labels.set(field.id, field.label)
  const dynamicIds = [...labels.keys()]
  const rows = [["ID Pendaftaran", "Kegiatan", "Email", "NPM", "Waktu", ...dynamicIds.map(id => labels.get(id) || id)]]
  for (const row of result.rows) rows.push([row.id, row.event_title, row.email, row.npm || "", new Date(row.submitted_at).toISOString(), ...dynamicIds.map(id => (row.answers as Record<string, unknown>)[id] ?? "")])
  const csv = "\uFEFF" + rows.map(row => row.map(csvCell).join(",")).join("\r\n")
  res.setHeader("Content-Type", "text/csv; charset=utf-8")
  res.setHeader("Content-Disposition", "attachment; filename=rekap-pendaftar.csv")
  res.setHeader("Cache-Control", "no-store")
  res.send(csv)
})

app.get(`${adminBase}/registrations.pdf`, attachAdmin, requireRole("registration"), async (_req, res) => {
  const eventId = typeof _req.query.eventId === "string" ? _req.query.eventId : ""
  const search = typeof _req.query.q === "string" ? _req.query.q.trim().slice(0, 160) : ""
  const result = await pool.query(
    `SELECT r.id,e.title AS event_title,r.email,r.npm,r.answers,r.schema_snapshot,r.submitted_at
     FROM registrations r JOIN registration_events e ON e.id=r.event_id
     WHERE ($1='' OR r.event_id::text=$1)
       AND ($2='' OR r.email ILIKE '%' || $2 || '%' OR COALESCE(r.npm,'') ILIKE '%' || $2 || '%' OR e.title ILIKE '%' || $2 || '%')
     ORDER BY e.title,r.submitted_at`,
    [eventId, search],
  )
  const pairs = result.rows.flatMap(row => [
    { label: "Kegiatan · Pendaftar", value: `${row.event_title} · ${row.email}` },
    { label: "ID pendaftaran", value: row.id },
    ...(row.npm ? [{ label: "NPM", value: row.npm }] : []),
    ...((row.schema_snapshot as FormField[]).map(field => ({ label: field.label, value: String((row.answers as Record<string, unknown>)[field.id] ?? "—") }))),
    { label: "Dikirim", value: new Date(row.submitted_at).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }) },
  ])
  const pdf = await createPdf("Rekap Pendaftar HIMTI", `Jumlah pendaftar: ${result.rowCount}. PDF rekap administrasi.`, pairs)
  res.setHeader("Content-Type", "application/pdf")
  res.setHeader("Content-Disposition", "attachment; filename=rekap-pendaftar-himti.pdf")
  res.setHeader("Cache-Control", "no-store")
  res.send(pdf)
})

app.get(`${adminBase}/documentation`, attachAdmin, requireRole("documentation"), async (_req, res) => {
  const result = await pool.query(
    `SELECT d.*, COALESCE(json_agg(json_build_object('id',m.id,'kind',m.kind,'filePath',m.file_path,'mimeType',m.mime_type,'altText',m.alt_text,'sortOrder',m.sort_order)) FILTER (WHERE m.id IS NOT NULL), '[]'::json) AS media
     FROM documentation_events d LEFT JOIN documentation_media m ON m.event_id=d.id
     GROUP BY d.id ORDER BY d.event_date DESC NULLS LAST,d.created_at DESC`,
  )
  res.json(result.rows)
})

app.post(`${adminBase}/documentation`, attachAdmin, requireRole("documentation"), requireCsrf, async (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : ""
  const slug = typeof req.body?.slug === "string" ? req.body.slug.trim().toLowerCase() : ""
  const description = typeof req.body?.description === "string" ? req.body.description.trim() : ""
  const eventDate = typeof req.body?.eventDate === "string" && req.body.eventDate ? req.body.eventDate : null
  if (!title || title.length > 180 || !slugPattern.test(slug) || description.length > 6000) return res.status(400).json({ error: "Lengkapi judul, slug yang valid, dan deskripsi maksimal 6.000 karakter." })
  try {
    const result = await pool.query(
      "INSERT INTO documentation_events(id,slug,title,description,event_date,published) VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
      [randomUUID(), slug, title, description, eventDate, req.body.published === true],
    )
    res.status(201).json(result.rows[0])
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "23505") return res.status(409).json({ error: "Slug dokumentasi sudah digunakan." })
    throw error
  }
})

app.put(`${adminBase}/documentation/:id`, attachAdmin, requireRole("documentation"), requireCsrf, async (req, res) => {
  const title = typeof req.body?.title === "string" ? req.body.title.trim() : ""
  const slug = typeof req.body?.slug === "string" ? req.body.slug.trim().toLowerCase() : ""
  const description = typeof req.body?.description === "string" ? req.body.description.trim() : ""
  const eventDate = typeof req.body?.eventDate === "string" && req.body.eventDate ? req.body.eventDate : null
  if (!title || title.length > 180 || !slugPattern.test(slug) || description.length > 6000) return res.status(400).json({ error: "Lengkapi judul, slug yang valid, dan deskripsi maksimal 6.000 karakter." })
  try {
    const result = await pool.query(
      "UPDATE documentation_events SET slug=$2,title=$3,description=$4,event_date=$5,published=$6,updated_at=now() WHERE id=$1 RETURNING *",
      [req.params.id, slug, title, description, eventDate, req.body.published === true],
    )
    if (!result.rowCount) return res.status(404).json({ error: "Dokumentasi tidak ditemukan." })
    res.json(result.rows[0])
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "23505") return res.status(409).json({ error: "Slug dokumentasi sudah digunakan." })
    throw error
  }
})

app.delete(`${adminBase}/documentation/:id`, attachAdmin, requireRole("documentation"), requireCsrf, async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const media = await client.query("SELECT file_path,poster_path FROM documentation_media WHERE event_id=$1 FOR UPDATE", [req.params.id])
    const result = await client.query("DELETE FROM documentation_events WHERE id=$1 RETURNING id", [req.params.id])
    if (!result.rowCount) {
      await client.query("ROLLBACK")
      return res.status(404).json({ error: "Dokumentasi tidak ditemukan." })
    }
    await client.query("COMMIT")
    await removeUnreferencedMedia(media.rows.flatMap(row => [row.file_path, row.poster_path]))
    res.status(204).end()
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
})

app.post(`${adminBase}/documentation/:id/media`, attachAdmin, requireRole("documentation"), requireCsrf, (req, res, next) => {
  upload.single("file")(req, res, error => {
    if (error) return res.status(400).json({ error: error.message || "Berkas gagal diunggah." })
    next()
  })
}, async (req: Request, res: Response) => {
  const file = req.file
  const kind = req.body?.kind
  const altText = typeof req.body?.altText === "string" ? req.body.altText.trim().slice(0, 240) : ""
  if (!file) return res.status(400).json({ error: "Pilih berkas terlebih dahulu." })
  if (!["thumbnail", "image", "video"].includes(kind) || (kind === "thumbnail" && !file.mimetype.startsWith("image/"))) return res.status(400).json({ error: "Jenis media tidak cocok dengan berkas." })
  if (!validMediaSignature(file.buffer, file.mimetype)) return res.status(400).json({ error: "Isi berkas tidak cocok dengan format yang dipilih." })
  const event = await pool.query("SELECT id FROM documentation_events WHERE id=$1", [req.params.id])
  if (!event.rowCount) return res.status(404).json({ error: "Dokumentasi tidak ditemukan." })
  const ext = extname(cleanName(file.originalname)).toLowerCase()
  const filename = `${randomUUID()}${ext}`
  await import("node:fs/promises").then(fs => fs.writeFile(resolve(mediaDir, filename), file.buffer, { flag: "wx" }))
  try {
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      if (kind === "thumbnail") {
        const previous = await client.query("SELECT file_path,poster_path FROM documentation_media WHERE event_id=$1 AND kind='thumbnail' FOR UPDATE", [req.params.id])
        await client.query("DELETE FROM documentation_media WHERE event_id=$1 AND kind='thumbnail'", [req.params.id])
        await client.query("UPDATE documentation_events SET thumbnail_path=$2,updated_at=now() WHERE id=$1", [req.params.id, filename])
        await client.query("INSERT INTO documentation_media(id,event_id,kind,file_path,mime_type,original_name,alt_text) VALUES($1,$2,$3,$4,$5,$6,$7)", [randomUUID(), req.params.id, kind, filename, file.mimetype, cleanName(file.originalname), altText])
        await client.query("COMMIT")
        await removeUnreferencedMedia(previous.rows.flatMap(row => [row.file_path, row.poster_path]))
      } else {
        await client.query("INSERT INTO documentation_media(id,event_id,kind,file_path,mime_type,original_name,alt_text,sort_order) VALUES($1,$2,$3,$4,$5,$6,$7,COALESCE((SELECT max(sort_order)+1 FROM documentation_media WHERE event_id=$2),0))", [randomUUID(), req.params.id, kind, filename, file.mimetype, cleanName(file.originalname), altText])
        await client.query("COMMIT")
      }
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
    res.status(201).json({ kind, url: `/media/${encodeURIComponent(filename)}` })
  } catch (error) {
    await unlink(resolve(mediaDir, filename)).catch(() => undefined)
    throw error
  }
})

app.delete(`${adminBase}/documentation/:id/media/:mediaId`, attachAdmin, requireRole("documentation"), requireCsrf, async (req, res) => {
  const result = await pool.query("DELETE FROM documentation_media WHERE id=$1 AND event_id=$2 RETURNING file_path,poster_path,kind", [req.params.mediaId, req.params.id])
  if (!result.rowCount) return res.status(404).json({ error: "Media tidak ditemukan." })
  if (result.rows[0].kind === "thumbnail") await pool.query("UPDATE documentation_events SET thumbnail_path=NULL,updated_at=now() WHERE id=$1", [req.params.id])
  await removeUnreferencedMedia([result.rows[0].file_path, result.rows[0].poster_path])
  res.status(204).end()
})

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (res.headersSent) return
  if (error instanceof Error && "code" in error && error.code === "ENOENT") return res.status(404).json({ error: "Berkas tidak ditemukan." })
  console.error("Permintaan gagal diproses.")
  res.status(500).json({ error: "Terjadi kesalahan. Silakan coba kembali." })
})

app.listen(port, "127.0.0.1", () => console.log(`Backend HIMTI lokal berjalan pada http://127.0.0.1:${port}`))
