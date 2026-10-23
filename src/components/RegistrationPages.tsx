import { useEffect, useState } from "react"
import { LockKeyhole, ArrowUpRight, ArrowLeft } from "lucide-react"
import { apiUrl } from "../lib/api"

type EventSummary = { id: string; slug: string; title: string; description: string; type: string; opensAt: string; closesAt: string; registrationOpen: boolean; formUrl: string | null }
type Field = { id: string; label: string; type: "text" | "textarea" | "select" | "checkbox"; required: boolean; options?: string[] }
type FormInfo = EventSummary & { includesNpm: boolean; fields: Field[] }

function EventDate({ value }: { value: string }) {
  return <time dateTime={value}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(value))} WIB</time>
}

export function RegistrationList() {
  const [events, setEvents] = useState<EventSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    fetch(apiUrl("/events")).then(async response => {
      if (!response.ok) throw new Error("Daftar kegiatan belum dapat dimuat.")
      return response.json() as Promise<EventSummary[]>
    }).then(setEvents).catch(reason => setError(reason instanceof Error ? reason.message : "Koneksi gagal.")).finally(() => setLoading(false))
  }, [])

  return (
    <main className="route-page registration-page">
      <section className="section">
        <div className="wrap">
          <p className="label">HIMTI UNA</p>
          <h1 className="head">Pendaftaran kegiatan</h1>
          <p className="muted registration-lead">Pilih kegiatan yang ingin diikuti. Formulir dan batas waktunya tercantum pada masing-masing kegiatan.</p>
          {loading && <p role="status">Memuat daftar kegiatan…</p>}
          {error && <p className="form-alert form-alert-error" role="alert">{error}</p>}
          {!loading && !error && events.length === 0 && <p className="registration-empty">Belum ada kegiatan yang dibuka untuk pendaftaran.</p>}
          <div className="registration-list">
            {events.map(event => (
              <article className="registration-row" key={event.id}>
                <div>
                  <p className="registration-kind">{event.type === "recruitment" ? "Open recruitment" : event.type === "training" ? "Pelatihan" : event.type === "competition" ? "Perlombaan" : "Kegiatan"}</p>
                  <h2>{event.title}</h2>
                  {event.description && <p>{event.description}</p>}
                  <small>Pendaftaran: <EventDate value={event.opensAt} /> – <EventDate value={event.closesAt} /></small>
                </div>
                {event.registrationOpen && event.formUrl ? (
                  <a className="button button-primary" href={event.formUrl}>Daftar sekarang <ArrowUpRight size={17} /></a>
                ) : (
                  <button className="button button-locked" type="button" disabled aria-label={`Pendaftaran ${event.title} ditutup`}><LockKeyhole size={17} /> Ditutup</button>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export function RegistrationForm({ slug }: { slug: string }) {
  const [form, setForm] = useState<FormInfo | null>(null)
  const [missing, setMissing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [npm, setNpm] = useState("")
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})

  useEffect(() => {
    let active = true
    fetch(apiUrl(`/events/${encodeURIComponent(slug)}/form`)).then(async response => {
      if (response.status === 404) { if (active) setMissing(true); return null }
      if (!response.ok) throw new Error("Formulir belum dapat dimuat.")
      return response.json() as Promise<FormInfo>
    }).then(value => { if (active && value) setForm(value) }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Koneksi gagal.") }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])

  const updateAnswer = (field: Field, value: string, checked?: boolean) => {
    setAnswers(current => {
      if (field.type !== "checkbox") return { ...current, [field.id]: value }
      const selected = Array.isArray(current[field.id]) ? current[field.id] as string[] : []
      return { ...current, [field.id]: checked ? [...selected, value] : selected.filter(entry => entry !== value) }
    })
  }

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setSending(true)
    try {
      const response = await fetch(apiUrl(`/registrations/${encodeURIComponent(slug)}`), {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, npm, answers }),
      })
      if (!response.ok) {
        const payload = await response.json().catch(() => ({})) as { error?: string }
        if (response.status === 404) setMissing(true)
        throw new Error(payload.error || "Pendaftaran tidak berhasil dikirim.")
      }
      const blob = await response.blob()
      const href = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = href
      anchor.download = `bukti-pendaftaran-${slug}.pdf`
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
      URL.revokeObjectURL(href)
      setSuccess(true)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Koneksi gagal. Coba kirim kembali.")
    } finally {
      setSending(false)
    }
  }

  if (loading) return <main className="route-page"><section className="section wrap" role="status">Memuat formulir…</section></main>
  if (missing) return <main className="route-page"><section className="section wrap registration-not-found"><h1 className="head">Halaman tidak ditemukan</h1><p className="muted">Pendaftaran tidak tersedia atau telah ditutup.</p><a className="text-link" href="/pendaftaran"><ArrowLeft size={16} /> Kembali ke daftar kegiatan</a></section></main>
  if (error && !form) return <main className="route-page"><section className="section wrap"><p className="form-alert form-alert-error" role="alert">{error}</p></section></main>
  if (!form) return null

  return (
    <main className="route-page registration-page">
      <section className="section">
        <div className="wrap registration-form-wrap">
          <a className="text-link" href="/pendaftaran"><ArrowLeft size={16} /> Daftar kegiatan</a>
          <p className="label">Formulir pendaftaran</p>
          <h1 className="head">{form.title}</h1>
          {form.description && <p className="muted registration-lead">{form.description}</p>}
          <p className="registration-deadline">Ditutup <EventDate value={form.closesAt} /></p>
          {success ? (
            <div className="form-alert form-alert-success" role="status"><h2>Pendaftaran berhasil dikirim.</h2><p>Bukti pendaftaran PDF sudah diunduh. Simpan berkas tersebut untuk arsip Anda.</p></div>
          ) : (
            <form className="registration-form" onSubmit={submit}>
              <label className="field-label">Email <span aria-hidden="true">*</span><input type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} /></label>
              {form.includesNpm && <label className="field-label">NPM <span aria-hidden="true">*</span><input required maxLength={40} value={npm} onChange={event => setNpm(event.target.value)} /></label>}
              {form.fields.map(field => field.type === "checkbox" ? (
                <fieldset className="field-label field-group" key={field.id}><legend>{field.label}{field.required && <span aria-hidden="true"> *</span>}</legend><span className="choice-list">{field.options?.map(option => <label className="choice-option" key={option}><input type="checkbox" checked={Array.isArray(answers[field.id]) && (answers[field.id] as string[]).includes(option)} onChange={event => updateAnswer(field, option, event.target.checked)} /> {option}</label>)}</span></fieldset>
              ) : <label className="field-label" key={field.id}>{field.label}{field.required && <span aria-hidden="true"> *</span>}
                {field.type === "textarea" ? <textarea required={field.required} maxLength={4000} value={String(answers[field.id] ?? "")} onChange={event => updateAnswer(field, event.target.value)} rows={5} />
                  : field.type === "select" ? <select required={field.required} value={String(answers[field.id] ?? "")} onChange={event => updateAnswer(field, event.target.value)}><option value="">Pilih jawaban</option>{field.options?.map(option => <option key={option}>{option}</option>)}</select>
                    : <input required={field.required} maxLength={4000} value={String(answers[field.id] ?? "")} onChange={event => updateAnswer(field, event.target.value)} />}
              </label>)}
              <p className="form-help">Pendaftar dapat mengirim maksimal tiga kali untuk email yang sama pada kegiatan ini.</p>
              {error && <p className="form-alert form-alert-error" role="alert">{error}</p>}
              <button className="button button-primary" type="submit" disabled={sending}>{sending ? "Mengirim…" : "Kirim dan unduh bukti PDF"}</button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
