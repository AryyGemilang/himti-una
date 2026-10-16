import { useEffect, useRef, useState } from "react"
import { useReveal } from "../hooks/useReveal"

const FRAMES = [
  { src: "https://picsum.photos/id/177/1200/1200?grayscale", alt: "Kegiatan mahasiswa", caption: "Seminar & Workshop Teknologi", credit: "Danka & Peter, Unsplash" },
  { src: "https://picsum.photos/id/685/1200/1200?grayscale", alt: "Refleksi kegiatan", caption: "Leadership Training", credit: "Joshua Earle, Unsplash" },
  { src: "https://picsum.photos/id/91/1200/1200",            alt: "Dokumentasi kegiatan", caption: "Dokumentasi Kegiatan HIMTI", credit: "Jennifer Trovato, Unsplash" },
  { src: "https://picsum.photos/id/497/1200/1200",           alt: "Suasana kebersamaan", caption: "Kebersamaan & Silaturahmi", credit: "Volkan Olmez, Unsplash" },
  { src: "https://picsum.photos/id/473/1200/1200?grayscale", alt: "Musyawarah organisasi", caption: "Musyawarah & Rapat Kerja", credit: "Todd Quackenbush, Unsplash" },
]

const KEGIATAN = [
  "Seminar & Workshop Teknologi",
  "Pelatihan Kepemimpinan (LKMM)",
  "Musyawarah Besar (Mubes)",
  "Musyawarah Wilayah PERMIKOMNAS",
  "Kegiatan Sosial Kemasyarakatan",
  "Olimpiade & Kompetisi IT",
]

export default function Kegiatan() {
  const ref = useReveal()
  const [active, setActive] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined)

  const restart = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => setActive(a => (a + 1) % FRAMES.length), 3200)
  }

  useEffect(() => {
    restart()
    return () => { if (timer.current) clearInterval(timer.current) }
  }, [])

  return (
    <section id="kegiatan" ref={ref} className="section">
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(3rem, 8vw, 8rem)", alignItems: "start" }}>

          {/* Left */}
          <div>
            <p className="label reveal">Kegiatan</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Kegiatan<br />HIMTI</h2>
            <img src="/himti-una/Logo-Himti.svg" alt="" aria-hidden className="section-logo" />
            <p className="reveal muted" style={{ marginBottom: "2.5rem", ["--d" as string]: "120ms" }}>
              Kegiatan besar yang pernah HIMTI UNA laksanakan mencakup pengembangan akademik,
              kepemimpinan, dan kebersamaan civitas mahasiswa.
            </p>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {KEGIATAN.map((k, i) => (
                <li key={k} className="reveal" style={{
                  display: "flex", alignItems: "center", gap: "1rem",
                  padding: "0.875rem 0",
                  ["--d" as string]: `${i * 70}ms`,
                }}>
                  <div aria-hidden style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: "var(--step-md)" }}>{k}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — circle-masked crossfade gallery (the motif as frame) */}
          <div>
            <div
              className="reveal"
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                overflow: "hidden",
                ["--d" as string]: "200ms",
              }}
            >
              <div className="gallery-frame" style={{ position: "absolute", inset: 0 }}>
                {FRAMES.map((f, i) => (
                  <img
                    key={f.src}
                    src={f.src}
                    alt={f.alt}
                    width={1200} height={1200}
                    loading={i === 0 ? "eager" : "lazy"}
                    style={{ opacity: active === i ? 1 : 0 }}
                  />
                ))}
              </div>
              {/* Accent ring — motif border */}
              <div aria-hidden style={{ position: "absolute", inset: 0, borderRadius: "50%", boxShadow: "inset 0 0 0 3px var(--accent)", zIndex: 1, pointerEvents: "none" }} />
            </div>

            {/* Caption */}
            <div className="reveal" style={{ marginTop: "1.25rem", ["--d" as string]: "280ms" }}>
              <p style={{ fontWeight: 700, fontSize: "var(--step-sm)", marginBottom: "0.2rem" }}>{FRAMES[active].caption}</p>
              <p style={{ fontSize: "var(--step-xs)", color: "var(--muted)" }}>{FRAMES[active].credit}</p>
            </div>

            {/* Dots */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }} role="group" aria-label="Navigasi foto kegiatan">
              {FRAMES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setActive(i); restart() }}
                  aria-label={`Foto ${i + 1} dari ${FRAMES.length}`}
                  aria-pressed={active === i}
                  style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: active === i ? "var(--accent)" : "var(--muted-2)",
                    border: "none", padding: 0, cursor: "pointer",
                    transition: "background 200ms ease, transform 160ms ease",
                    transform: active === i ? "scale(1.4)" : "scale(1)",
                  }}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
      <style>{`@media(max-width:48em){#kegiatan .wrap>div{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
