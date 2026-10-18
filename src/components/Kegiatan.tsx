import { useCallback, useEffect, useRef, useState } from "react"
import { useReveal } from "../hooks/useReveal"

const MEDIA_PATH = "/himti-una/images/dokumentasi/Screening%20Text-Himtiuna"

const PHOTOS = [
  "WhatsApp Image 2026-10-17 at 15.13.24.jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.25.jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.25(1).jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.25(2).jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.26.jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.26(1).jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.27.jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.53.jpeg",
]

const VIDEOS = [
  "WhatsApp Video 2026-10-17 at 15.13.27.mp4",
  "WhatsApp Video 2026-10-17 at 15.13.29.mp4",
]

const assetUrl = (filename: string) => `${MEDIA_PATH}/${encodeURIComponent(filename)}`

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={direction === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="m18 6-12 12M6 6l12 12" />
    </svg>
  )
}

export default function Kegiatan() {
  const ref = useReveal()
  const [active, setActive] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const pointerStart = useRef<number | null>(null)
  const swiped = useRef(false)

  const move = useCallback((direction: number) => {
    setImageFailed(false)
    setActive(index => (index + direction + PHOTOS.length) % PHOTOS.length)
  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (reducedMotion || hovered || focused || lightboxOpen || PHOTOS.length < 2) return
    const timer = window.setInterval(() => move(1), 5000)
    return () => window.clearInterval(timer)
  }, [active, focused, hovered, lightboxOpen, move, reducedMotion])

  useEffect(() => {
    if (!lightboxOpen) return
    const previousOverflow = document.body.style.overflow
    const returnFocusTarget = triggerRef.current
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        setLightboxOpen(false)
      } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        move(-1)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        move(1)
      } else if (event.key === "Tab" && dialogRef.current) {
        const buttons = Array.from(dialogRef.current.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"))
        if (!buttons.length) return
        const first = buttons[0]
        const last = buttons[buttons.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      returnFocusTarget?.focus()
    }
  }, [lightboxOpen, move])

  const openLightbox = () => {
    setLightboxOpen(true)
  }

  return (
    <section id="kegiatan" ref={ref} className="section">
      <div className="wrap">
        <div className="kegiatan-layout">
          <div className="kegiatan-intro">
            <p className="label reveal">Kegiatan HIMTI</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>
              Screening Test<br />Rekrutmen Anggota HIMTI
            </h2>
            <img src="/himti-una/images/logos/logo-himti.svg" alt="" aria-hidden className="section-logo" />
            <p className="reveal muted kegiatan-description" style={{ ["--d" as string]: "120ms" }}>
              Dokumentasi proses screening test sebagai bagian dari rekrutmen anggota HIMTI UNA.
            </p>
          </div>

          <div
            className="kegiatan-content"
            role="group"
            aria-label="Dokumentasi Screening Test Rekrutmen Anggota HIMTI"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocusCapture={() => setFocused(true)}
            onBlurCapture={event => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
            }}
            onKeyDown={event => {
              if ((event.target as HTMLElement).closest("video")) return
              if (event.key === "ArrowLeft") move(-1)
              if (event.key === "ArrowRight") move(1)
            }}
            aria-roledescription="carousel"
          >
            <div
              className="kegiatan-stage"
              onPointerDown={event => {
                pointerStart.current = event.clientX
                swiped.current = false
                event.currentTarget.setPointerCapture(event.pointerId)
              }}
              onPointerUp={event => {
                if (pointerStart.current === null) return
                const distance = event.clientX - pointerStart.current
                pointerStart.current = null
                if (Math.abs(distance) > 48) {
                  swiped.current = true
                  move(distance > 0 ? -1 : 1)
                }
              }}
              onPointerCancel={() => { pointerStart.current = null; swiped.current = false }}
            >
              <button
                ref={triggerRef}
                className="kegiatan-photo-trigger"
                type="button"
                disabled={imageFailed}
                aria-label={`Perbesar foto ${active + 1} dari ${PHOTOS.length}`}
                onClick={() => {
                  if (swiped.current) { swiped.current = false; return }
                  openLightbox()
                }}
              >
                {imageFailed ? (
                  <span className="kegiatan-image-fallback">Foto dokumentasi tidak dapat dimuat.</span>
                ) : (
                  <img
                    key={PHOTOS[active]}
                    src={assetUrl(PHOTOS[active])}
                    alt={`Dokumentasi screening test HIMTI UNA, foto ${active + 1} dari ${PHOTOS.length}`}
                    width={1280}
                    height={720}
                    fetchPriority="high"
                    onError={() => setImageFailed(true)}
                  />
                )}
              </button>
              <button className="kegiatan-arrow kegiatan-arrow-prev" type="button" aria-label="Foto sebelumnya" onClick={() => move(-1)}><ArrowIcon direction="left" /></button>
              <button className="kegiatan-arrow kegiatan-arrow-next" type="button" aria-label="Foto berikutnya" onClick={() => move(1)}><ArrowIcon direction="right" /></button>
            </div>

            <div className="kegiatan-slider-meta">
              <p aria-live="polite" aria-atomic="true">Dokumentasi screening test · {active + 1} / {PHOTOS.length}</p>
              <div className="kegiatan-dots" role="group" aria-label="Pilih foto dokumentasi">
                {PHOTOS.map((photo, index) => (
                  <button
                    key={photo}
                    type="button"
                    aria-label={`Tampilkan foto ${index + 1}`}
                    aria-pressed={active === index}
                    className={active === index ? "is-active" : ""}
                    onClick={() => { setImageFailed(false); setActive(index) }}
                  />
                ))}
              </div>
            </div>

            <div className="kegiatan-videos" aria-label="Video dokumentasi screening test">
              {VIDEOS.map((video, index) => (
                <figure className="kegiatan-video" key={video}>
                  <video controls preload="metadata" playsInline aria-label={`Video dokumentasi screening test HIMTI UNA ${index + 1}`}>
                    <source src={assetUrl(video)} type="video/mp4" />
                    Browser Anda tidak mendukung pemutaran video.
                  </video>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="kegiatan-lightbox"
          onClick={event => {
            if (event.target === event.currentTarget) setLightboxOpen(false)
          }}
        >
          <div className="kegiatan-lightbox-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-label="Galeri foto kegiatan HIMTI">
            <button ref={closeRef} type="button" className="kegiatan-lightbox-close" aria-label="Tutup galeri" onClick={() => setLightboxOpen(false)}><CloseIcon /></button>
            <button type="button" className="kegiatan-lightbox-arrow kegiatan-lightbox-prev" aria-label="Foto sebelumnya" onClick={() => move(-1)}><ArrowIcon direction="left" /></button>
            <img src={assetUrl(PHOTOS[active])} alt={`Dokumentasi screening test HIMTI UNA, foto ${active + 1} dari ${PHOTOS.length}`} />
            <button type="button" className="kegiatan-lightbox-arrow kegiatan-lightbox-next" aria-label="Foto berikutnya" onClick={() => move(1)}><ArrowIcon direction="right" /></button>
            <p aria-live="polite" aria-atomic="true">Foto {active + 1} dari {PHOTOS.length}</p>
          </div>
        </div>
      )}

      <style>{`
        .kegiatan-layout {
          display: grid;
          grid-template-columns: minmax(16rem, 0.8fr) minmax(0, 1.2fr);
          align-items: start;
          gap: clamp(2rem, 6vw, 6rem);
        }
        .kegiatan-intro, .kegiatan-content { min-width: 0; }
        .kegiatan-description { max-width: 38rem; margin-bottom: 0; }
        .kegiatan-stage {
          position: relative;
          overflow: hidden;
          aspect-ratio: 16 / 9;
          border-radius: var(--r-card);
          background: var(--surface-2);
          touch-action: pan-y;
        }
        .kegiatan-photo-trigger {
          display: grid;
          width: 100%;
          height: 100%;
          place-items: center;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: zoom-in;
        }
        .kegiatan-photo-trigger:disabled { cursor: default; }
        .kegiatan-photo-trigger img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: kegiatan-fade 320ms ease both;
        }
        .kegiatan-image-fallback { padding: 1rem; color: var(--muted); }
        .kegiatan-arrow, .kegiatan-lightbox-arrow, .kegiatan-lightbox-close {
          position: absolute;
          z-index: 1;
          display: grid;
          width: 2.75rem;
          height: 2.75rem;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: var(--surface);
          color: var(--ink);
          font: inherit;
          line-height: 1;
          cursor: pointer;
          transition: transform 160ms ease, background 160ms ease;
        }
        .kegiatan-arrow:hover, .kegiatan-lightbox-arrow:hover, .kegiatan-lightbox-close:hover { transform: scale(1.06); background: var(--accent-dim); }
        .kegiatan-arrow:focus-visible, .kegiatan-dots button:focus-visible,
        .kegiatan-photo-trigger:focus-visible, .kegiatan-lightbox button:focus-visible {
          outline: 3px solid var(--accent);
          outline-offset: 3px;
        }
        .kegiatan-arrow-prev { top: 50%; left: 1rem; transform: translateY(-50%); }
        .kegiatan-arrow-next { top: 50%; right: 1rem; transform: translateY(-50%); }
        .kegiatan-arrow-prev:hover { transform: translateY(-50%) scale(1.06); }
        .kegiatan-arrow-next:hover { transform: translateY(-50%) scale(1.06); }
        .kegiatan-slider-meta { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 0.8rem; }
        .kegiatan-slider-meta p { margin: 0; color: var(--muted); font-size: var(--step-xs); }
        .kegiatan-dots { display: flex; flex-wrap: wrap; gap: 0.1rem; }
        .kegiatan-dots button { position: relative; display: grid; width: 2.75rem; height: 2.75rem; place-items: center; padding: 0; border: 0; border-radius: 50%; background: transparent; cursor: pointer; }
        .kegiatan-dots button::before { content: ""; width: 0.65rem; height: 0.65rem; border-radius: 50%; background: var(--muted-2); transition: transform 160ms ease, background 160ms ease; }
        .kegiatan-dots button.is-active::before { background: var(--accent); transform: scale(1.25); }
        .kegiatan-videos { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.75rem; margin-top: 1.25rem; }
        .kegiatan-video { min-width: 0; overflow: hidden; margin: 0; aspect-ratio: 16 / 9; border-radius: var(--r-card); background: #071321; }
        .kegiatan-video video { display: block; width: 100%; height: 100%; object-fit: contain; }
        .kegiatan-lightbox { position: fixed; z-index: 500; inset: 0; display: grid; place-items: center; padding: clamp(0.75rem, 3vw, 2rem); background: rgba(4, 11, 20, 0.92); }
        .kegiatan-lightbox-dialog { position: relative; display: grid; width: min(100%, 76rem); height: min(100%, 52rem); grid-template-columns: 3.5rem minmax(0, 1fr) 3.5rem; grid-template-rows: minmax(0, 1fr) auto; align-items: center; justify-items: center; gap: 0.75rem; }
        .kegiatan-lightbox-dialog img { grid-column: 2; grid-row: 1; display: block; max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; }
        .kegiatan-lightbox-dialog > p { grid-column: 2; grid-row: 2; margin: 0; color: #fff; font-size: var(--step-sm); }
        .kegiatan-lightbox-close { top: 0; right: 0; font-size: 1.5rem; }
        .kegiatan-lightbox-arrow { position: static; }
        .kegiatan-lightbox-prev { grid-column: 1; grid-row: 1; }
        .kegiatan-lightbox-next { grid-column: 3; grid-row: 1; }
        @keyframes kegiatan-fade { from { opacity: 0.55; } to { opacity: 1; } }
        @media (max-width: 48em) {
          .kegiatan-layout { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
          .kegiatan-videos { gap: 0.5rem; }
          .kegiatan-lightbox-dialog { grid-template-columns: 2.75rem minmax(0, 1fr) 2.75rem; gap: 0.25rem; }
          .kegiatan-lightbox-arrow, .kegiatan-lightbox-close { width: 2.75rem; height: 2.75rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kegiatan-photo-trigger img { animation: none; }
          .kegiatan-arrow, .kegiatan-lightbox-arrow, .kegiatan-lightbox-close { transition: none; }
        }
      `}</style>
    </section>
  )
}
