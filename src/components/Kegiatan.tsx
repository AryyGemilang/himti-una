import { useCallback, useEffect, useRef, useState } from "react"
import { useReveal } from "../hooks/useReveal"

const MEDIA_PATH = "/himti-una/images/kegiatan/screening-test"
const assetUrl = (filename: string) => `${MEDIA_PATH}/${encodeURIComponent(filename)}`

type ActivityMedia =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string }

const MEDIA: ActivityMedia[] = [
  { type: "image", src: assetUrl("foto-sesi-01.jpeg"), alt: "Sesi screening test calon anggota HIMTI UNA" },
  { type: "image", src: assetUrl("foto-sesi-02.jpeg"), alt: "Wawancara screening test HIMTI UNA" },
  { type: "image", src: assetUrl("foto-sesi-03.jpeg"), alt: "Dokumentasi wawancara calon anggota HIMTI UNA" },
  { type: "image", src: assetUrl("foto-sesi-04.jpeg"), alt: "Proses tanya jawab screening test HIMTI UNA" },
  { type: "image", src: assetUrl("foto-sesi-05.jpeg"), alt: "Sesi screening test di ruang kegiatan HIMTI UNA" },
  { type: "image", src: assetUrl("foto-sesi-06.jpeg"), alt: "Dokumentasi rekrutmen anggota HIMTI UNA" },
  { type: "image", src: assetUrl("foto-sesi-07.jpeg"), alt: "Kegiatan screening test calon anggota HIMTI UNA" },
  { type: "image", src: assetUrl("foto-sesi-08.jpeg"), alt: "Suasana screening test HIMTI UNA" },
  {
    type: "video",
    src: assetUrl("video-sesi-01.mp4"),
    poster: assetUrl("video-sesi-01-poster.jpg"),
    alt: "Video dokumentasi screening test HIMTI UNA",
  },
  {
    type: "video",
    src: assetUrl("video-sesi-02.mp4"),
    poster: assetUrl("video-sesi-02-poster.jpg"),
    alt: "Video sesi rekrutmen anggota HIMTI UNA",
  },
]

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

function PlayIcon() {
  return (
    <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5.8c0-.8.9-1.3 1.6-.9l10.1 6.2a1 1 0 0 1 0 1.8L9.6 19.1c-.7.4-1.6-.1-1.6-.9V5.8Z" />
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
  const [mediaFailed, setMediaFailed] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const pointerStart = useRef<number | null>(null)
  const swiped = useRef(false)
  const currentMedia = MEDIA[active]

  const stopVideo = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.pause()
    video.removeAttribute("src")
    video.querySelectorAll("source").forEach(source => source.removeAttribute("src"))
    video.load()
    videoRef.current = null
  }, [])

  const move = useCallback((direction: number) => {
    stopVideo()
    setMediaFailed(false)
    setActive(index => (index + direction + MEDIA.length) % MEDIA.length)
  }, [stopVideo])

  const closeLightbox = useCallback(() => {
    stopVideo()
    setLightboxOpen(false)
  }, [stopVideo])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    if (reducedMotion || hovered || focused || lightboxOpen || MEDIA.length < 2) return
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
        closeLightbox()
      } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        move(-1)
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        move(1)
      } else if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not(:disabled), video[controls]"))
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
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
      stopVideo()
      returnFocusTarget?.focus()
    }
  }, [closeLightbox, lightboxOpen, move, stopVideo])

  const openLightbox = () => setLightboxOpen(true)

  return (
    <section id="kegiatan" ref={ref} className="section">
      <div className="wrap">
        <div className="kegiatan-layout">
          <div className="kegiatan-intro">
            <p className="label reveal">Kegiatan HIMTI</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>
              Screening Test<br />Rekrutmen Anggota HIMTI
            </h2>
            <img src="/himti-una/images/branding/logo-himti.webp" alt="" aria-hidden className="section-logo" />
            <p className="reveal muted kegiatan-description" style={{ ["--d" as string]: "120ms" }}>
              Dokumentasi proses screening test sebagai bagian dari rekrutmen anggota HIMTI UNA.
            </p>
          </div>

          <div
            className="kegiatan-content"
            role="group"
            aria-label="Carousel foto dan video Screening Test Rekrutmen Anggota HIMTI"
            aria-roledescription="carousel"
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
          >
            <div className="kegiatan-stage">
              <button
                ref={triggerRef}
                className="kegiatan-media-trigger"
                type="button"
                disabled={mediaFailed && currentMedia.type === "image"}
                aria-label={currentMedia.type === "video" ? `Putar video: ${currentMedia.alt}` : `Perbesar foto ${active + 1} dari ${MEDIA.length}`}
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
                onClick={() => {
                  if (swiped.current) { swiped.current = false; return }
                  openLightbox()
                }}
              >
                {currentMedia.type === "image" ? (
                  mediaFailed ? (
                    <span className="kegiatan-media-fallback">Foto dokumentasi tidak dapat dimuat.</span>
                  ) : (
                    <img
                      key={currentMedia.src}
                      src={currentMedia.src}
                      alt={currentMedia.alt}
                      width={1280}
                      height={720}
                      fetchPriority="high"
                      onError={() => setMediaFailed(true)}
                    />
                  )
                ) : (
                  <>
                    {mediaFailed ? (
                      <span className="kegiatan-media-fallback">Video dokumentasi HIMTI UNA</span>
                    ) : (
                      <img
                        src={currentMedia.poster}
                        alt=""
                        aria-hidden
                        width={1280}
                        height={720}
                        onError={() => setMediaFailed(true)}
                      />
                    )}
                    <span className="kegiatan-play-indicator"><PlayIcon /></span>
                  </>
                )}
              </button>
              <button className="kegiatan-arrow kegiatan-arrow-prev" type="button" aria-label="Media sebelumnya" onClick={() => move(-1)}><ArrowIcon direction="left" /></button>
              <button className="kegiatan-arrow kegiatan-arrow-next" type="button" aria-label="Media berikutnya" onClick={() => move(1)}><ArrowIcon direction="right" /></button>
            </div>

            <div className="kegiatan-slider-meta">
              <p aria-live="polite" aria-atomic="true">
                {currentMedia.type === "video" ? "Video" : "Foto"} dokumentasi · {active + 1} / {MEDIA.length}
              </p>
              <div className="kegiatan-dots" role="group" aria-label="Pilih dokumentasi media">
                {MEDIA.map((item, index) => (
                  <button
                    key={item.src}
                    type="button"
                    aria-label={`Tampilkan ${item.type === "video" ? "video" : "foto"} ${index + 1}`}
                    aria-pressed={active === index}
                    className={active === index ? "is-active" : ""}
                    onClick={() => { stopVideo(); setMediaFailed(false); setActive(index) }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="kegiatan-lightbox"
          onClick={event => {
            if (event.target === event.currentTarget) closeLightbox()
          }}
        >
          <div className="kegiatan-lightbox-dialog" ref={dialogRef} role="dialog" aria-modal="true" aria-label={`${currentMedia.type === "video" ? "Video" : "Foto"} dokumentasi kegiatan HIMTI`}>
            <button ref={closeRef} type="button" className="kegiatan-lightbox-close" aria-label="Tutup galeri" onClick={closeLightbox}><CloseIcon /></button>
            <button type="button" className="kegiatan-lightbox-arrow kegiatan-lightbox-prev" aria-label="Media sebelumnya" onClick={() => move(-1)}><ArrowIcon direction="left" /></button>
            {currentMedia.type === "image" ? (
              <img className="kegiatan-lightbox-media" src={currentMedia.src} alt={currentMedia.alt} />
            ) : (
              <video
                ref={videoRef}
                className="kegiatan-lightbox-media kegiatan-lightbox-video"
                controls
                preload="metadata"
                playsInline
                poster={currentMedia.poster}
                aria-label={currentMedia.alt}
              >
                <source src={currentMedia.src} type="video/mp4" />
                Browser Anda tidak mendukung pemutaran video.
              </video>
            )}
            <button type="button" className="kegiatan-lightbox-arrow kegiatan-lightbox-next" aria-label="Media berikutnya" onClick={() => move(1)}><ArrowIcon direction="right" /></button>
            <p aria-live="polite" aria-atomic="true">{active + 1} / {MEDIA.length} · {currentMedia.type === "video" ? "Video" : "Foto"}</p>
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
        }
        .kegiatan-media-trigger {
          position: relative;
          display: grid;
          width: 100%;
          height: 100%;
          place-items: center;
          padding: 0;
          border: 0;
          background: transparent;
          cursor: zoom-in;
          touch-action: pan-y;
        }
        .kegiatan-media-trigger:disabled { cursor: default; }
        .kegiatan-media-trigger > img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: kegiatan-fade 320ms ease both;
        }
        .kegiatan-media-fallback { padding: 1rem; color: var(--muted); }
        .kegiatan-play-indicator {
          position: absolute;
          display: grid;
          width: 4rem;
          height: 4rem;
          place-items: center;
          padding-left: 0.2rem;
          border-radius: 50%;
          background: rgba(4, 11, 20, 0.72);
          color: white;
        }
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
        .kegiatan-media-trigger:focus-visible, .kegiatan-lightbox button:focus-visible {
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
        .kegiatan-lightbox { position: fixed; z-index: 500; inset: 0; display: grid; place-items: center; padding: clamp(0.75rem, 3vw, 2rem); background: rgba(4, 11, 20, 0.92); }
        .kegiatan-lightbox-dialog { position: relative; display: grid; width: min(100%, 76rem); height: min(100%, 52rem); grid-template-columns: 3.5rem minmax(0, 1fr) 3.5rem; grid-template-rows: minmax(0, 1fr) auto; align-items: center; justify-items: center; gap: 0.75rem; }
        .kegiatan-lightbox-media { grid-column: 2; grid-row: 1; display: block; max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; }
        .kegiatan-lightbox-video { width: 100%; max-height: 100%; aspect-ratio: 16 / 9; background: #071321; }
        .kegiatan-lightbox-dialog > p { grid-column: 2; grid-row: 2; margin: 0; color: #fff; font-size: var(--step-sm); }
        .kegiatan-lightbox-close { top: 0; right: 0; }
        .kegiatan-lightbox-arrow { position: static; }
        .kegiatan-lightbox-prev { grid-column: 1; grid-row: 1; }
        .kegiatan-lightbox-next { grid-column: 3; grid-row: 1; }
        @keyframes kegiatan-fade { from { opacity: 0.55; } to { opacity: 1; } }
        @media (max-width: 48em) {
          .kegiatan-layout { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
          .kegiatan-lightbox-dialog { grid-template-columns: 2.75rem minmax(0, 1fr) 2.75rem; gap: 0.25rem; }
          .kegiatan-lightbox-arrow, .kegiatan-lightbox-close { width: 2.75rem; height: 2.75rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .kegiatan-media-trigger > img { animation: none; }
          .kegiatan-arrow, .kegiatan-lightbox-arrow, .kegiatan-lightbox-close { transition: none; }
        }
      `}</style>
    </section>
  )
}
