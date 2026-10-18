import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { useReveal } from "../hooks/useReveal"
import { dewanPengawas, pengurus, PERIODE, type Orang } from "../data/pengurus"
import { bidangList } from "../data/bidang"
import Foto from "./Foto"

const CLOSE_DURATION = 180

function Kartu({ orang, delay = 0, size = "md", onSelect }: {
  orang: Orang
  delay?: number
  size?: "lg" | "md" | "sm"
  onSelect: (orang: Orang) => void
}) {
  const nameSz = size === "lg" ? "var(--step-lg)" : size === "md" ? "var(--step-md)" : "var(--step-sm)"

  return (
    <div className="reveal bezel" style={{ ["--d" as string]: `${delay}ms` }}>
      <div className="bezel-inner pengurus-card-inner">
        <button
          type="button"
          className="pengurus-card-button"
          aria-haspopup="dialog"
          aria-label={`Lihat detail ${orang.nama}, ${orang.jabatan}`}
          onClick={() => onSelect(orang)}
        >
          <span className="pengurus-photo-frame" aria-hidden="true">
            <Foto
              src={orang.foto}
              alt=""
              className="pengurus-photo"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 58%", display: "block" }}
            />
          </span>
          <span className="pengurus-card-overlay">
            <span className="pengurus-card-name" style={{ fontSize: nameSz }}>{orang.nama}</span>
            <span className="pengurus-card-role">{orang.jabatan}</span>
          </span>
        </button>
      </div>
    </div>
  )
}

export default function Pengurus() {
  const [selected, setSelected] = useState<Orang | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closingRef = useRef(false)
  const ref = useReveal()

  const closeProfile = useCallback(() => {
    if (!selected || closingRef.current) return
    closingRef.current = true
    setIsClosing(true)
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : CLOSE_DURATION
    closeTimerRef.current = setTimeout(() => {
      setSelected(null)
      setIsClosing(false)
      closingRef.current = false
      closeTimerRef.current = null
    }, duration)
  }, [selected])

  const openProfile = useCallback((orang: Orang) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    closingRef.current = false
    setIsClosing(false)
    setSelected(orang)
  }, [])

  useEffect(() => {
    if (!selected) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = "hidden"
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus())
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeProfile()
        return
      }
      if (event.key !== "Tab" || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [closeProfile, selected])

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }, [])

  const { ketua, sekretaris, wakilSekretaris, bendahara, wakilBendahara } = pengurus

  return (
    <section id="pengurus" ref={ref} className="section pengurus-section" style={{ background: "var(--surface)" }}>
      <div className="wrap">
        <div className="pengurus-header">
          <div>
            <p className="label reveal">{PERIODE}</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Struktur<br />Pengurus</h2>
          </div>
          <div className="pengurus-header-desc">
            <p className="reveal muted" style={{ ["--d" as string]: "120ms" }}>
              Kepengurusan HIMTI UNA terdiri dari Ketua Umum, jajaran inti, dan lima bidang kerja
              yang memastikan program organisasi berjalan optimal.
            </p>
          </div>
        </div>

        <div className="pengurus-lead-card">
          <Kartu orang={ketua} size="lg" onSelect={openProfile} />
        </div>

        <div className="pengurus-inti-grid">
          <Kartu orang={sekretaris} delay={80} onSelect={openProfile} />
          <Kartu orang={wakilSekretaris} delay={140} onSelect={openProfile} />
          <Kartu orang={bendahara} delay={200} onSelect={openProfile} />
          <Kartu orang={wakilBendahara} delay={260} onSelect={openProfile} />
        </div>

        <h3 className="pengurus-subhead reveal">Kepala Bidang</h3>
        <div className="pengurus-bidang-grid" id="bidang">
          {bidangList.map((b, i) => (
            <div key={b.slug}>
              <Kartu orang={b.head} delay={i * 80} size="md" onSelect={openProfile} />
              <a href={`/bidang/${b.slug}/`} className="bidang-btn">
                {b.namaPendek}
                <span aria-hidden style={{ flexShrink: 0 }}>→</span>
              </a>
            </div>
          ))}
        </div>

        <section className="pengurus-dpo" aria-labelledby="pengurus-dpo-title">
          <h3 className="pengurus-subhead reveal" id="pengurus-dpo-title">Dewan Pengawas Organisasi</h3>
          <div className="pengurus-dpo-grid">
            {dewanPengawas.map((orang, i) => (
              <Kartu key={orang.nama} orang={orang} delay={i * 80} size="md" onSelect={openProfile} />
            ))}
          </div>
        </section>
      </div>

      {selected && createPortal(
        <div
          className={`pengurus-modal-backdrop${isClosing ? " is-closing" : ""}`}
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeProfile()
          }}
        >
          <div
            ref={dialogRef}
            className={`pengurus-modal${isClosing ? " is-closing" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pengurus-profile-title"
            aria-describedby="pengurus-profile-role"
            tabIndex={-1}
          >
            <div className="pengurus-modal-photo-wrap">
              <Foto src={selected.foto} alt={`Foto ${selected.nama}`} className="pengurus-modal-photo" />
            </div>
            <div className="pengurus-modal-info">
              <p className="label">Pengurus HIMTI UNA</p>
              <h2 id="pengurus-profile-title">{selected.nama}</h2>
              <p id="pengurus-profile-role">{selected.jabatan}</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className="pengurus-modal-close"
              aria-label="Tutup detail pengurus"
              onClick={closeProfile}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .pengurus-header { display:grid; grid-template-columns:auto 1fr; gap:4rem; margin-bottom:4rem; align-items:start; }
        .pengurus-header-desc { padding-left:4rem; display:flex; align-items:center; }
        .pengurus-lead-card { width:min(100%, 19rem); margin:0 auto 3rem; }
        .pengurus-inti-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:var(--gap); margin-bottom:3rem; }
        .pengurus-bidang-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:var(--gap); scroll-margin-top:6rem; }
        .pengurus-dpo { margin-top:4rem; }
        .pengurus-dpo-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:var(--gap); max-width:38rem; }
        .pengurus-card-inner { padding:0; overflow:hidden; }
        .pengurus-card-button {
          position:relative; display:block; width:100%; aspect-ratio:4/5; padding:0;
          overflow:hidden; border:0; border-radius:var(--r-card); background:var(--surface-2); color:var(--ink);
          text-align:left; font:inherit; cursor:pointer; isolation:isolate;
        }
        .pengurus-card-button:focus-visible { outline:3px solid var(--accent-strong); outline-offset:3px; }
        .pengurus-photo-frame { position:absolute; inset:0; z-index:0; display:block; }
        .pengurus-photo { width:100%; height:100%; object-fit:cover; transform:scale(1.1) translateY(-1.5%); transform-origin:center 42%; transition:transform 260ms ease; }
        .pengurus-card-button:hover .pengurus-photo { transform:scale(1.14) translateY(-1.5%); }
        .pengurus-card-overlay {
          position:absolute; inset:0; z-index:1; display:flex; flex-direction:column; justify-content:flex-end; gap:0.35rem;
          padding:clamp(1rem,2vw,1.4rem); color:#fff;
          background:linear-gradient(180deg, rgb(5 15 24 / 0) 35%, rgb(5 15 24 / 0.3) 56%, rgb(5 15 24 / 0.94) 100%); /* taste-skill-ignore: text contrast over portraits */
        }
        .pengurus-card-name { display:block; max-width:26ch; font-weight:850; line-height:1.08; letter-spacing:-0.025em; text-wrap:balance; }
        .pengurus-card-role { display:block; max-width:34ch; color:rgb(255 255 255 / 0.88); font-size:var(--step-xs); line-height:1.35; }
        .pengurus-subhead { margin:1rem 0 1.5rem; font-weight:800; font-size:var(--step-lg); text-transform:uppercase; letter-spacing:-0.025em; }
        .bidang-btn {
          width:100%; margin-top:0.5rem; padding:0.75rem 0.5rem; min-height:44px; background:transparent;
          border-radius:6px; font-size:var(--step-xs); color:var(--muted); cursor:pointer; display:flex;
          align-items:center; justify-content:center; gap:0.4rem; border:1.5px solid var(--control-border);
          transition:border-color 160ms ease,color 160ms ease; font-family:var(--font); text-align:center; word-break:break-word;
        }
        .bidang-btn:hover { border-color:var(--accent-strong); color:var(--accent-strong); }
        .anggota-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0.75rem; }
        .pengurus-modal-backdrop {
          position:fixed; inset:0; z-index:500; display:grid; place-items:center; padding:1.25rem;
          background:rgb(3 10 16 / 0.72); backdrop-filter:blur(7px); animation:pengurus-fade-in 180ms ease both;
        }
        .pengurus-modal-backdrop.is-closing { animation:pengurus-fade-out 180ms ease both; }
        .pengurus-modal {
          position:relative; display:grid; grid-template-columns:minmax(0,1.05fr) minmax(16rem,0.95fr);
          width:min(56rem,100%); max-height:min(48rem,calc(100dvh - 2.5rem)); overflow:hidden;
          border:1px solid var(--border); border-radius:var(--r-card); background:var(--surface); color:var(--ink);
          box-shadow:0 24px 72px var(--shadow); /* taste-skill-ignore: modal elevation */
          animation:pengurus-modal-in 200ms cubic-bezier(.2,.75,.25,1) both;
        }
        .pengurus-modal.is-closing { animation:pengurus-modal-out 180ms ease both; }
        .pengurus-modal-photo-wrap { min-height:25rem; max-height:min(42rem,calc(100dvh - 2.5rem)); background:var(--surface-2); }
        .pengurus-modal-photo { display:block; width:100%; height:100%; max-height:min(42rem,calc(100dvh - 2.5rem)); object-fit:contain; }
        .pengurus-modal-info { align-self:center; padding:clamp(2rem,5vw,4rem); }
        .pengurus-modal-info .label { color:var(--accent-strong); }
        .pengurus-modal-info h2 { margin:0.9rem 0 0; font-size:clamp(2rem,4vw,3.5rem); line-height:1.02; letter-spacing:-0.035em; text-wrap:balance; }
        .pengurus-modal-info > p:last-child { margin-top:0.8rem; color:var(--muted); font-size:var(--step-md); line-height:1.45; }
        .pengurus-modal-close {
          position:absolute; top:0.85rem; right:0.85rem; z-index:2; display:grid; place-items:center;
          width:44px; height:44px; padding:0; border:1px solid var(--border); border-radius:8px;
          background:var(--surface); color:var(--ink); cursor:pointer;
        }
        .pengurus-modal-close:hover { background:var(--surface-2); }
        @keyframes pengurus-fade-in { from { opacity:0; } to { opacity:1; } }
        @keyframes pengurus-fade-out { from { opacity:1; } to { opacity:0; } }
        @keyframes pengurus-modal-in { from { opacity:0; transform:translateY(8px) scale(0.985); } to { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes pengurus-modal-out { from { opacity:1; transform:translateY(0) scale(1); } to { opacity:0; transform:translateY(5px) scale(0.99); } }
        @media (max-width:72em) { .pengurus-bidang-grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
        @media (max-width:48em) {
          .pengurus-header { grid-template-columns:1fr; gap:1.5rem; margin-bottom:2.5rem; }
          .pengurus-header-desc { padding-left:0; }
          .pengurus-lead-card { width:min(100%,19rem); margin-bottom:2rem; }
          .pengurus-dpo { margin-top:3rem; }
          .pengurus-dpo-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .pengurus-inti-grid,.pengurus-bidang-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .pengurus-card-button { min-height:11rem; }
          .pengurus-card-overlay { padding:0.85rem; }
          .pengurus-card-name { font-size:var(--step-sm) !important; }
          .pengurus-card-role { font-size:0.72rem; }
          .pengurus-modal-backdrop { padding:0.5rem; }
          .pengurus-modal { grid-template-columns:1fr; grid-template-rows:minmax(12rem,38dvh) auto; width:100%; max-height:calc(100dvh - 1rem); overflow-y:auto; }
          .pengurus-modal-photo-wrap { min-height:0; height:38dvh; max-height:20rem; }
          .pengurus-modal-photo { max-height:100%; }
          .pengurus-modal-info { padding:1.35rem 1.25rem 1.5rem; }
          .pengurus-modal-info h2 { max-width:18ch; margin-top:0.55rem; font-size:clamp(1.75rem,8vw,2.4rem); }
          .pengurus-modal-info > p:last-child { margin-top:0.5rem; }
          .pengurus-modal-close { top:0.6rem; right:0.6rem; }
        }
        @media (prefers-reduced-motion:reduce) {
          .pengurus-photo { transition:none; }
          .pengurus-card-button:hover .pengurus-photo { transform:scale(1.1) translateY(-1.5%); }
          .pengurus-modal-backdrop,.pengurus-modal { animation-duration:1ms; }
        }
      `}</style>
    </section>
  )
}
