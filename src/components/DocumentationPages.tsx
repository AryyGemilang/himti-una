import { useEffect, useState } from "react"
import { ArrowLeft, ArrowUpRight, Images } from "lucide-react"
import { apiUrl, mediaUrl } from "../lib/api"

type DocumentationSummary = { id: string; slug: string; title: string; description: string; event_date: string | null; thumbnailUrl: string | null }
type Media = { id: string; kind: "image" | "video"; alt_text: string; url: string; posterUrl: string | null }
type DocumentationDetail = { title: string; description: string; event_date: string | null; media: Media[] }

function EventDate({ value }: { value: string | null }) {
  if (!value) return null
  return <time dateTime={value}>{new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date(`${value.slice(0, 10)}T12:00:00+07:00`))}</time>
}

export function DocumentationList() {
  const [events, setEvents] = useState<DocumentationSummary[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    fetch(apiUrl("/documentation")).then(async response => {
      if (!response.ok) throw new Error("Dokumentasi belum dapat dimuat.")
      return response.json() as Promise<DocumentationSummary[]>
    }).then(setEvents).catch(reason => setError(reason instanceof Error ? reason.message : "Koneksi gagal.")).finally(() => setLoading(false))
  }, [])
  return (
    <main className="route-page documentation-page">
      <section className="section">
        <div className="wrap">
          <p className="label">Arsip HIMTI UNA</p>
          <h1 className="head">Dokumentasi kegiatan</h1>
          <p className="muted registration-lead">Pilih kegiatan untuk melihat foto dan video dokumentasinya.</p>
          {loading && <p role="status">Memuat dokumentasi…</p>}
          {error && <p className="form-alert form-alert-error" role="alert">{error}</p>}
          {!loading && !error && events.length === 0 && <p className="registration-empty">Belum ada dokumentasi yang dipublikasikan.</p>}
          <div className="documentation-grid">
            {events.map(event => <a className="documentation-tile" href={`/dokumentasi/${encodeURIComponent(event.slug)}`} key={event.id}>
              {event.thumbnailUrl ? <img src={mediaUrl(event.thumbnailUrl)} alt="" loading="lazy" decoding="async" /> : <span className="documentation-placeholder"><Images size={32} /></span>}
              <span className="documentation-tile-copy"><span>{event.title}</span><small><EventDate value={event.event_date} /> <ArrowUpRight size={15} /></small></span>
            </a>)}
          </div>
        </div>
      </section>
    </main>
  )
}

export function DocumentationDetail({ slug }: { slug: string }) {
  const [event, setEvent] = useState<DocumentationDetail | null>(null)
  const [missing, setMissing] = useState(false)
  const [error, setError] = useState("")
  useEffect(() => {
    let active = true
    fetch(apiUrl(`/documentation/${encodeURIComponent(slug)}`)).then(async response => {
      if (response.status === 404) { if (active) setMissing(true); return null }
      if (!response.ok) throw new Error("Dokumentasi belum dapat dimuat.")
      return response.json() as Promise<DocumentationDetail>
    }).then(value => { if (active && value) setEvent(value) }).catch(reason => { if (active) setError(reason instanceof Error ? reason.message : "Koneksi gagal.") })
    return () => { active = false }
  }, [slug])
  if (missing) return <main className="route-page"><section className="section wrap"><h1 className="head">Dokumentasi tidak ditemukan</h1><a className="text-link" href="/dokumentasi"><ArrowLeft size={16} /> Kembali ke dokumentasi</a></section></main>
  if (error) return <main className="route-page"><section className="section wrap"><p className="form-alert form-alert-error" role="alert">{error}</p></section></main>
  if (!event) return <main className="route-page"><section className="section wrap" role="status">Memuat dokumentasi…</section></main>
  return (
    <main className="route-page documentation-page">
      <section className="section">
        <div className="wrap">
          <a className="text-link" href="/dokumentasi"><ArrowLeft size={16} /> Semua dokumentasi</a>
          <p className="label">Dokumentasi kegiatan</p>
          <h1 className="head">{event.title}</h1>
          {event.event_date && <p className="muted"><EventDate value={event.event_date} /></p>}
          {event.description && <p className="documentation-description">{event.description}</p>}
          <div className="documentation-media-grid">
            {event.media.map(item => item.kind === "video" ? (
              <video key={item.id} controls preload="none" poster={item.posterUrl ? mediaUrl(item.posterUrl) : undefined} aria-label={item.alt_text || `Video dokumentasi ${event.title}`}>
                <source src={mediaUrl(item.url)} />Video tidak dapat diputar di peramban ini.
              </video>
            ) : <img key={item.id} src={mediaUrl(item.url)} alt={item.alt_text || `Dokumentasi ${event.title}`} loading="lazy" decoding="async" />)}
          </div>
          {!event.media.length && <p className="registration-empty">Belum ada foto atau video pada dokumentasi ini.</p>}
        </div>
      </section>
    </main>
  )
}
