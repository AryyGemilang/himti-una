import { useCallback, useEffect, useState } from "react"
import { ArrowLeft, Download, LockKeyhole, LogOut, Plus, Save, Trash2, Upload } from "lucide-react"
import { adminRequest, apiJson, apiUrl, mediaUrl } from "../lib/api"

type AdminRole = "documentation" | "registration"
type AdminSession = { admin: { id: string; username: string; role: AdminRole }; csrfToken: string }
type Field = { id: string; label: string; type: "text" | "textarea" | "select" | "checkbox"; required: boolean; options?: string[] }
type RegistrationEvent = { id: string; slug: string; title: string; description: string; event_type: string; form_schema: Field[]; includes_npm: boolean; opens_at: string; closes_at: string; manual_closed: boolean; published: boolean; registrationOpen: boolean; status: "draft" | "scheduled" | "open" | "closed" }
type RegistrationRow = { id: string; event_id: string; event_title: string; email: string; npm: string | null; answers: Record<string, unknown>; schema_snapshot: Field[]; submitted_at: string }
type RegistrationPage = { items: RegistrationRow[]; total: number; page: number; pageSize: number }
type MediaItem = { id: string; kind: "thumbnail" | "image" | "video"; filePath: string; mimeType: string; altText: string; sortOrder: number }
type DocumentationEvent = { id: string; slug: string; title: string; description: string; event_date: string | null; thumbnail_path: string | null; published: boolean; media: MediaItem[] }

const roleLabel: Record<AdminRole, string> = { documentation: "Admin dokumentasi", registration: "Admin pendaftaran" }
const formatTime = (value: string) => new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value)) + " WIB"
const localInput = (value?: string) => {
  if (!value) return ""
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(value))
  const part = (type: string) => parts.find(item => item.type === type)?.value || "00"
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`
}
const jakartaIso = (value: string) => new Date(`${value}:00+07:00`).toISOString()
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

function Login({ onLogin }: { onLogin: (session: AdminSession) => void }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSending(true)
    setError("")
    try {
      const session = await apiJson<AdminSession>("/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username, password }) })
      onLogin(session)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Login gagal.") }
    finally { setSending(false); setPassword("") }
  }
  return <main className="admin-login-page"><section className="admin-login-panel"><a className="text-link" href="/"><ArrowLeft size={16} /> Kembali ke website</a><p className="label">Panel HIMTI UNA</p><h1 className="head">Masuk admin</h1><p className="muted">Gunakan akun khusus dokumentasi atau pendaftaran.</p><form className="registration-form" onSubmit={submit}><label className="field-label">Nama pengguna<input autoComplete="username" required value={username} onChange={event => setUsername(event.target.value)} /></label><label className="field-label">Kata sandi<input type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} /></label>{error && <p className="form-alert form-alert-error" role="alert">{error}</p>}<button className="button button-primary" disabled={sending}>{sending ? "Memeriksa…" : "Masuk"}</button></form></section></main>
}

function FieldEditor({ fields, onChange }: { fields: Field[]; onChange: (fields: Field[]) => void }) {
  const update = (index: number, patch: Partial<Field>) => onChange(fields.map((field, i) => i === index ? { ...field, ...patch } : field))
  return <div className="admin-question-list">
    {fields.map((field, index) => <div className="admin-question" key={`${field.id}-${index}`}>
      <div className="admin-question-top"><strong>Pertanyaan {index + 1}</strong><button className="icon-button" type="button" aria-label={`Hapus pertanyaan ${index + 1}`} onClick={() => onChange(fields.filter((_, i) => i !== index))}><Trash2 size={17} /></button></div>
      <label className="field-label">Pertanyaan<input value={field.label} maxLength={180} onChange={event => update(index, { label: event.target.value })} /></label>
      <div className="admin-question-settings"><label className="field-label">Jenis jawaban<select value={field.type} onChange={event => update(index, { type: event.target.value as Field["type"], options: ["select", "checkbox"].includes(event.target.value) ? field.options?.length ? field.options : [""] : undefined })}><option value="text">Jawaban singkat</option><option value="textarea">Paragraf</option><option value="select">Pilihan tunggal</option><option value="checkbox">Pilihan jamak</option></select></label><label className="choice-option"><input type="checkbox" checked={field.required} onChange={event => update(index, { required: event.target.checked })} /> Wajib diisi</label></div>
      {(field.type === "select" || field.type === "checkbox") && <label className="field-label">Opsi jawaban <textarea rows={3} value={(field.options || []).join("\n")} onChange={event => update(index, { options: event.target.value.split("\n").map(item => item.trim()).filter(Boolean) })} placeholder="Satu pilihan per baris" /></label>}
    </div>)}
    <button type="button" className="button button-secondary" onClick={() => onChange([...fields, { id: `pertanyaan-${crypto.randomUUID().replaceAll("-", "")}`, label: "", type: "text", required: false }])}><Plus size={16} /> Tambah pertanyaan</button>
  </div>
}

function RegistrationAdmin({ session }: { session: AdminSession }) {
  const [events, setEvents] = useState<RegistrationEvent[]>([])
  const [registrations, setRegistrations] = useState<RegistrationRow[]>([])
  const [selected, setSelected] = useState<RegistrationEvent | null>(null)
  const [search, setSearch] = useState("")
  const [query, setQuery] = useState("")
  const [eventFilter, setEventFilter] = useState("")
  const [registrationPage, setRegistrationPage] = useState(1)
  const [registrationTotal, setRegistrationTotal] = useState(0)
  const [notice, setNotice] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [eventType, setEventType] = useState("training")
  const [includesNpm, setIncludesNpm] = useState(false)
  const [fields, setFields] = useState<Field[]>([])
  const [opensAt, setOpensAt] = useState("")
  const [closesAt, setClosesAt] = useState("")
  const [published, setPublished] = useState(false)

  const load = useCallback(async () => {
    try {
      const [nextEvents, nextRegistrations] = await Promise.all([
        apiJson<RegistrationEvent[]>("/admin/events"),
        apiJson<RegistrationPage>(`/admin/registrations?q=${encodeURIComponent(query)}&eventId=${encodeURIComponent(eventFilter)}&page=${registrationPage}`),
      ])
      setEvents(nextEvents)
      setRegistrations(nextRegistrations.items)
      setRegistrationTotal(nextRegistrations.total)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Data belum dapat dimuat.") }
  }, [query, eventFilter, registrationPage])
  useEffect(() => {
    let active = true
    Promise.all([
      apiJson<RegistrationEvent[]>("/admin/events"),
      apiJson<RegistrationPage>(`/admin/registrations?q=${encodeURIComponent(query)}&eventId=${encodeURIComponent(eventFilter)}&page=${registrationPage}`),
    ]).then(([nextEvents, nextRegistrations]) => {
      if (!active) return
      setEvents(nextEvents)
      setRegistrations(nextRegistrations.items)
      setRegistrationTotal(nextRegistrations.total)
    }).catch(reason => {
      if (active) setError(reason instanceof Error ? reason.message : "Data belum dapat dimuat.")
    })
    return () => { active = false }
  }, [query, eventFilter, registrationPage])

  const resetForm = () => {
    setSelected(null); setTitle(""); setSlug(""); setDescription(""); setEventType("training"); setIncludesNpm(false); setFields([]); setOpensAt(""); setClosesAt(""); setPublished(false); setError(""); setNotice("")
  }
  const editEvent = (event: RegistrationEvent) => {
    setSelected(event); setTitle(event.title); setSlug(event.slug); setDescription(event.description); setEventType(event.event_type); setIncludesNpm(event.includes_npm); setFields(event.form_schema); setOpensAt(localInput(event.opens_at)); setClosesAt(localInput(event.closes_at)); setPublished(event.published); setError(""); setNotice("")
    document.getElementById("admin-event-form")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const saveEvent = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setError(""); setNotice("")
    const body = { title, slug, description, eventType, includesNpm, fields, opensAt: jakartaIso(opensAt), closesAt: jakartaIso(closesAt), manualClosed: false, published }
    try {
      if (fields.some(field => !field.label.trim() || ((field.type === "select" || field.type === "checkbox") && !field.options?.length))) throw new Error("Lengkapi setiap pertanyaan dan opsi jawabannya.")
      await adminRequest(selected ? `/admin/events/${selected.id}` : "/admin/events", session.csrfToken, { method: selected ? "PUT" : "POST", body: JSON.stringify(body) })
      const message = selected ? "Kegiatan dan jadwal berhasil disimpan. Rentang jadwal baru akan membuka kembali pendaftaran." : "Kegiatan berhasil dibuat."
      resetForm(); setNotice(message); await load()
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Kegiatan gagal disimpan.") }
    finally { setBusy(false) }
  }

  const closeEvent = async (id: string) => {
    if (!window.confirm("Tutup pendaftaran sekarang? Kiriman baru akan ditolak langsung.")) return
    try { await adminRequest(`/admin/events/${id}/close`, session.csrfToken, { method: "POST", body: "{}" }); await load(); setNotice("Pendaftaran ditutup.") }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Tidak dapat menutup pendaftaran.") }
  }

  return <div className="admin-content">
    <header className="admin-page-heading"><div><p className="label">Admin pendaftaran</p><h1 className="head">Kegiatan & pendaftar</h1><p className="muted">Atur formulir, jadwal buka tutup, dan data pendaftar.</p></div><button className="button button-secondary" type="button" onClick={() => { void load() }}>Muat ulang</button></header>
    {notice && <p className="form-alert form-alert-success" role="status">{notice}</p>}{error && <p className="form-alert form-alert-error" role="alert">{error}</p>}
    <section className="admin-section"><div className="admin-section-heading"><h2>Kegiatan</h2><button type="button" className="button button-secondary" onClick={resetForm}><Plus size={16} /> Kegiatan baru</button></div>
      <div className="admin-event-list">{events.map(item => <article className="admin-event-row" key={item.id}><div><span className={`admin-status${item.status === "open" ? " is-open" : ""}`}>{item.status === "open" ? "Pendaftaran buka" : item.status === "scheduled" ? "Terjadwal" : item.status === "draft" ? "Draft" : "Ditutup"}</span><h3>{item.title}</h3><p>{formatTime(item.opens_at)} — {formatTime(item.closes_at)}</p></div><div className="admin-row-actions"><button type="button" className="button button-secondary" onClick={() => editEvent(item)}>Edit / jadwal</button>{item.registrationOpen && <button type="button" className="button button-danger" onClick={() => void closeEvent(item.id)}><LockKeyhole size={15} /> Tutup sekarang</button>}</div></article>)}</div>
    </section>
    <section className="admin-section admin-form-section" id="admin-event-form"><div className="admin-section-heading"><h2>{selected ? "Edit kegiatan dan formulir" : "Buat kegiatan dan formulir"}</h2>{selected && <button type="button" className="text-link" onClick={resetForm}>Batal edit</button>}</div>
      <form className="admin-editor-form" onSubmit={saveEvent}>
        <div className="admin-two-col"><label className="field-label">Judul kegiatan<input required maxLength={180} value={title} onChange={event => { setTitle(event.target.value); if (!selected) setSlug(slugify(event.target.value)) }} /></label><label className="field-label">Alamat formulir (slug)<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={event => setSlug(event.target.value)} /></label></div>
        <label className="field-label">Deskripsi<textarea rows={3} maxLength={6000} value={description} onChange={event => setDescription(event.target.value)} /></label>
        <div className="admin-two-col"><label className="field-label">Jenis kegiatan<select value={eventType} onChange={event => setEventType(event.target.value)}><option value="training">Pelatihan</option><option value="competition">Perlombaan</option><option value="recruitment">Open recruitment</option><option value="other">Lainnya</option></select></label><label className="choice-option admin-checkbox"><input type="checkbox" checked={includesNpm} onChange={event => setIncludesNpm(event.target.checked)} /> Minta NPM dan terapkan batas tiga kiriman per NPM</label></div>
        <div className="admin-section-heading"><h3>Pertanyaan formulir</h3><span className="muted">Email selalu diwajibkan · maksimal 40 pertanyaan</span></div><FieldEditor fields={fields} onChange={setFields} />
        <div className="admin-two-col"><label className="field-label">Pendaftaran dibuka<input type="datetime-local" required value={opensAt} onChange={event => setOpensAt(event.target.value)} /></label><label className="field-label">Pendaftaran ditutup<input type="datetime-local" required value={closesAt} onChange={event => setClosesAt(event.target.value)} /></label></div>
        <p className="form-help">Setiap pembukaan harus memiliki waktu penutupan. Menyimpan rentang baru akan membuka kembali kegiatan yang sudah ditutup. Menutup lebih awal dapat dilakukan dari daftar kegiatan.</p>
        <label className="choice-option"><input type="checkbox" checked={published} onChange={event => setPublished(event.target.checked)} /> Tampilkan pada halaman pendaftaran</label>
        <button className="button button-primary" disabled={busy}><Save size={16} />{busy ? "Menyimpan…" : selected ? "Simpan jadwal dan formulir" : "Buat kegiatan"}</button>
      </form>
    </section>
    <section className="admin-section"><div className="admin-section-heading"><h2>Data pendaftar</h2><div className="admin-export-actions"><a className="button button-secondary" href={apiUrl(`/admin/registrations.csv?eventId=${encodeURIComponent(eventFilter)}&q=${encodeURIComponent(query)}`)}><Download size={16} /> Spreadsheet (CSV)</a><a className="button button-secondary" href={apiUrl(`/admin/registrations.pdf?eventId=${encodeURIComponent(eventFilter)}&q=${encodeURIComponent(query)}`)}><Download size={16} /> PDF rekap</a></div></div>
      <form className="admin-search" onSubmit={event => { event.preventDefault(); setQuery(search); setRegistrationPage(1) }}><label className="field-label">Cari email, NPM, atau kegiatan<input value={search} onChange={event => setSearch(event.target.value)} /></label><label className="field-label">Filter kegiatan<select value={eventFilter} onChange={event => { setEventFilter(event.target.value); setRegistrationPage(1) }}><option value="">Semua kegiatan</option>{events.map(item => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label><button className="button button-secondary">Cari</button></form>
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Kegiatan</th><th>Email</th><th>NPM</th><th>Waktu dikirim</th><th>Detail</th></tr></thead><tbody>{registrations.map(row => <tr key={row.id}><td>{row.event_title}</td><td>{row.email}</td><td>{row.npm || "—"}</td><td>{formatTime(row.submitted_at)}</td><td><details><summary>Lihat jawaban</summary><dl>{Object.entries(row.answers).map(([key, value]) => <div key={key}><dt>{row.schema_snapshot.find(field => field.id === key)?.label || key}</dt><dd>{Array.isArray(value) ? value.join(", ") : String(value)}</dd></div>)}</dl></details></td></tr>)}</tbody></table>{registrations.length === 0 && <p className="registration-empty">Belum ada data pendaftar yang cocok.</p>}</div>
      <div className="admin-pagination"><span>{registrationTotal} pendaftar · halaman {registrationPage} dari {Math.max(1, Math.ceil(registrationTotal / 50))}</span><div><button className="button button-secondary" disabled={registrationPage <= 1} onClick={() => setRegistrationPage(page => page - 1)}>Sebelumnya</button><button className="button button-secondary" disabled={registrationPage >= Math.ceil(registrationTotal / 50)} onClick={() => setRegistrationPage(page => page + 1)}>Berikutnya</button></div></div>
    </section>
  </div>
}

function DocumentationAdmin({ session }: { session: AdminSession }) {
  const [events, setEvents] = useState<DocumentationEvent[]>([])
  const [selected, setSelected] = useState<DocumentationEvent | null>(null)
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [published, setPublished] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [kind, setKind] = useState<"thumbnail" | "image" | "video">("thumbnail")
  const [altText, setAltText] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const load = useCallback(async () => {
    try { setEvents(await apiJson<DocumentationEvent[]>("/admin/documentation")) }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Data dokumentasi belum dapat dimuat.") }
  }, [])
  useEffect(() => {
    let active = true
    apiJson<DocumentationEvent[]>("/admin/documentation").then(value => { if (active) setEvents(value) }).catch(reason => {
      if (active) setError(reason instanceof Error ? reason.message : "Data dokumentasi belum dapat dimuat.")
    })
    return () => { active = false }
  }, [])
  const reset = () => { setSelected(null); setTitle(""); setSlug(""); setDescription(""); setEventDate(""); setPublished(false); setError(""); setNotice("") }
  const edit = (item: DocumentationEvent) => { setSelected(item); setTitle(item.title); setSlug(item.slug); setDescription(item.description); setEventDate(item.event_date?.slice(0, 10) || ""); setPublished(item.published); setError(""); setNotice("") }
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setError(""); setNotice("")
    try {
      const body = JSON.stringify({ title, slug, description, eventDate, published })
      await adminRequest(selected ? `/admin/documentation/${selected.id}` : "/admin/documentation", session.csrfToken, { method: selected ? "PUT" : "POST", body })
      reset(); setNotice("Informasi dokumentasi berhasil disimpan."); await load()
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Dokumentasi gagal disimpan.") }
  }
  const upload = async (event: React.FormEvent) => {
    event.preventDefault(); if (!selected || !file) return
    setError(""); setNotice("")
    try {
      const data = new FormData(); data.set("file", file); data.set("kind", kind); data.set("altText", altText)
      await adminRequest(`/admin/documentation/${selected.id}/media`, session.csrfToken, { method: "POST", body: data })
      setFile(null); setAltText(""); setNotice("Media berhasil diunggah."); await load()
      const updated = await apiJson<DocumentationEvent[]>("/admin/documentation")
      setEvents(updated); setSelected(updated.find(item => item.id === selected.id) || null)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Media gagal diunggah.") }
  }
  const remove = async (id: string) => {
    if (!selected || !window.confirm("Hapus berkas ini dari dokumentasi?")) return
    try {
      await adminRequest(`/admin/documentation/${selected.id}/media/${id}`, session.csrfToken, { method: "DELETE" })
      const updated = await apiJson<DocumentationEvent[]>("/admin/documentation"); setEvents(updated); setSelected(updated.find(item => item.id === selected.id) || null)
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Media gagal dihapus.") }
  }
  const removeEvent = async (item: DocumentationEvent) => {
    if (!window.confirm(`Hapus dokumentasi “${item.title}” beserta semua berkasnya?`)) return
    try { await adminRequest(`/admin/documentation/${item.id}`, session.csrfToken, { method: "DELETE" }); reset(); await load(); setNotice("Dokumentasi dan berkasnya dihapus.") }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Dokumentasi gagal dihapus.") }
  }

  return <div className="admin-content">
    <header className="admin-page-heading"><div><p className="label">Admin dokumentasi</p><h1 className="head">Arsip kegiatan</h1><p className="muted">Kelola judul, thumbnail, foto, dan video yang tampil untuk publik.</p></div><button className="button button-secondary" onClick={reset}><Plus size={16} /> Dokumentasi baru</button></header>
    {notice && <p className="form-alert form-alert-success" role="status">{notice}</p>}{error && <p className="form-alert form-alert-error" role="alert">{error}</p>}
    <div className="admin-doc-list">{events.map(item => <article className="admin-doc-row" key={item.id}><div>{item.thumbnail_path ? <img src={mediaUrl(`/media/${item.thumbnail_path}`)} alt="" loading="lazy" /> : <span className="documentation-placeholder"><Upload size={21} /></span>}<div><span className={`admin-status${item.published ? " is-open" : ""}`}>{item.published ? "Publik" : "Draft"}</span><h2>{item.title}</h2><p>{item.media.length} berkas media</p></div></div><div className="admin-row-actions"><button className="button button-secondary" onClick={() => edit(item)}>Edit / media</button><button className="button button-danger" onClick={() => void removeEvent(item)}><Trash2 size={15} /> Hapus</button></div></article>)}</div>
    <section className="admin-section admin-form-section"><div className="admin-section-heading"><h2>{selected ? "Edit dokumentasi" : "Buat dokumentasi"}</h2>{selected && <button className="text-link" onClick={reset}>Batal edit</button>}</div>
      <form className="admin-editor-form" onSubmit={save}>
        <div className="admin-two-col"><label className="field-label">Judul kegiatan<input required maxLength={180} value={title} onChange={event => { setTitle(event.target.value); if (!selected) setSlug(slugify(event.target.value)) }} /></label><label className="field-label">Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={slug} onChange={event => setSlug(event.target.value)} /></label></div>
        <label className="field-label">Deskripsi<textarea rows={3} maxLength={6000} value={description} onChange={event => setDescription(event.target.value)} /></label>
        <label className="field-label">Tanggal kegiatan<input type="date" value={eventDate} onChange={event => setEventDate(event.target.value)} /></label>
        <label className="choice-option"><input type="checkbox" checked={published} onChange={event => setPublished(event.target.checked)} /> Tampilkan kepada publik</label>
        <button className="button button-primary"><Save size={16} /> Simpan informasi</button>
      </form>
      {selected && <div className="admin-upload-area"><h3>Unggah thumbnail atau media</h3><form className="admin-editor-form" onSubmit={upload}><div className="admin-two-col"><label className="field-label">Jenis berkas<select value={kind} onChange={event => setKind(event.target.value as typeof kind)}><option value="thumbnail">Thumbnail kegiatan (gambar)</option><option value="image">Foto dokumentasi</option><option value="video">Video dokumentasi</option></select></label><label className="field-label">Pilih berkas<input type="file" accept={kind === "video" ? "video/mp4,video/webm" : "image/jpeg,image/png,image/webp"} required onChange={event => setFile(event.target.files?.[0] || null)} /></label></div><label className="field-label">Keterangan media<input maxLength={240} value={altText} onChange={event => setAltText(event.target.value)} placeholder="Contoh: Peserta mengikuti pelatihan" /></label><p className="form-help">Maksimal 60 MB per berkas. Video baru diunduh pengunjung saat membuka dokumentasi dan menekan putar.</p><button className="button button-primary" disabled={!file}><Upload size={16} /> Unggah media</button></form>
        <ul className="admin-media-list">{selected.media.map(item => <li key={item.id}><span>{item.kind === "thumbnail" ? "Thumbnail" : item.kind === "video" ? "Video" : "Foto"}: {item.altText || item.filePath}</span><button className="icon-button" aria-label="Hapus media" onClick={() => void remove(item.id)}><Trash2 size={17} /></button></li>)}</ul></div>}
    </section>
  </div>
}

export default function AdminPanel({ path }: { path: string }) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [checked, setChecked] = useState(false)
  const [error, setError] = useState("")
  useEffect(() => {
    apiJson<AdminSession>("/admin/session").then(setSession).catch(reason => {
      if (!(reason instanceof Error) || !reason.message.includes("admin")) setError(reason instanceof Error ? reason.message : "Sesi admin tidak tersedia.")
    }).finally(() => setChecked(true))
  }, [])
  const logout = async () => {
    if (!session) return
    try { await adminRequest("/admin/logout", session.csrfToken, { method: "POST", body: "{}" }) }
    catch { /* sesi lokal tetap dihapus dari tampilan */ }
    setSession(null)
  }
  if (!checked) return <main className="admin-login-page"><p role="status">Memeriksa sesi admin…</p></main>
  if (!session) return <>{error && <p className="form-alert form-alert-error" role="alert">{error}</p>}<Login onLogin={setSession} /></>
  const allowed = session.admin.role === "documentation" ? path === "/admin" || path.startsWith("/admin/dokumentasi") : path === "/admin" || path.startsWith("/admin/pendaftaran")
  return <main className="admin-shell">
    <aside className="admin-sidebar"><a className="admin-brand" href="/">HIMTI <span>UNA</span></a><p className="admin-account">{session.admin.username}<small>{roleLabel[session.admin.role]}</small></p><nav aria-label="Navigasi admin">{session.admin.role === "documentation" ? <a className={path.includes("dokumentasi") || path === "/admin" ? "active" : ""} href="/admin/dokumentasi">Dokumentasi</a> : <a className={path.includes("pendaftaran") || path === "/admin" ? "active" : ""} href="/admin/pendaftaran">Pendaftaran</a>}<a href="/" className="admin-back-link">Kembali ke website</a></nav><button className="button button-secondary admin-logout" onClick={() => void logout()}><LogOut size={16} /> Keluar</button></aside>
    <div className="admin-main">{!allowed ? <section className="admin-content"><h1 className="head">Akses tidak tersedia</h1><p className="muted">Akun ini hanya dapat mengelola {session.admin.role === "documentation" ? "dokumentasi" : "pendaftaran"}.</p></section> : session.admin.role === "documentation" ? <DocumentationAdmin session={session} /> : <RegistrationAdmin session={session} />}</div>
  </main>
}
