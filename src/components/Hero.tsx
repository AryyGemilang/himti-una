import { useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  // Reveal animasi
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting)
          el.querySelectorAll(".reveal, .reveal-x, .shutter").forEach(n => n.classList.add("visible"))
      },
      { threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="beranda"
      ref={sectionRef}
      style={{
        minHeight: "100dvh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Ambient glow */}
      <div aria-hidden style={{
        position: "absolute",
        width: "50vh", height: "50vh",
        right: "-8vh", top: "35%",
        borderRadius: "50%",
        background: "var(--accent-dim)",
        pointerEvents: "none",
        filter: "blur(80px)",
        zIndex: 0,
      }} />

      {/* Content */}
      <div className="wrap" style={{ position: "relative", zIndex: 1, width: "100%", paddingTop: "8rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "min(55%, 680px)" }}>

          {/* Logos — identitas utama hero */}
          <div className="hero-logos reveal">
            <img
              src="/himti-una/Logo-Himti.svg"
              alt="Logo HIMTI UNA"
              className="hero-logo-himti"
            />
            <img
              src="/himti-una/Logo-Una.svg"
              alt="Logo Universitas Asahan"
              className="hero-logo-una"
            />
          </div>

          {/* Headline */}
          <h1 className="display reveal" style={{ ["--d" as string]: "100ms", color: "var(--ink)" }}>
            Himpunan<br />Mahasiswa<br />Teknik<br />Informatika
          </h1>

          {/* Sub */}
          <p
            className="reveal"
            style={{
              fontSize: "var(--step-lg)",
              color: "var(--muted)",
              marginTop: "1.75rem",
              maxWidth: "36ch",
              lineHeight: 1.35,
              ["--d" as string]: "200ms",
            }}
          >
            Universitas Asahan, wadah aspirasi, prestasi, dan inovasi mahasiswa IT sejak 2013.
          </p>

          {/* CTAs */}
          <div
            className="reveal"
            style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "3rem", ["--d" as string]: "320ms" }}
          >
            <a href="/#tentang" className="btn">
              Kenali HIMTI
              <span className="icon-bubble" aria-hidden><ArrowDown size={13} /></span>
            </a>
            <a href="/#kegiatan" className="btn btn-ghost">Lihat Kegiatan</a>
          </div>

        </div>
      </div>
    </section>
  )
}
