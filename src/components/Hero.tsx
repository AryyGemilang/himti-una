import { useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting)
          el.querySelectorAll(".reveal, .reveal-x, .shutter").forEach(el => el.classList.add("visible"))
      },
      { threshold: 0.05 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="beranda"
      ref={ref}
      style={{
        minHeight: "100dvh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Hero logo — replaces decorative circle */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: "min(90vh, 90vw)",
          height: "min(90vh, 90vw)",
          right: "calc(min(90vh, 90vw) * -0.22)",
          top: "50%",
          transform: "translateY(-50%)",
          borderRadius: "50%",
          overflow: "hidden",
          opacity: 0.92,
          zIndex: 0,
        }}
      >
        <img
          src="/himti-una/logo-himti.jpg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            mixBlendMode: "luminosity",
            filter: "brightness(0.9) contrast(1.1)",
          }}
        />
      </div>

      {/* Ambient glow behind logo */}
      <div aria-hidden style={{
        position: "absolute",
        width: "50vh", height: "50vh",
        right: "-8vh", top: "35%",
        borderRadius: "50%",
        background: "var(--accent-dim)",
        pointerEvents: "none",
        filter: "blur(80px)",
      }} />

      {/* Photo — shutter entrance, blended */}
      <img
        src="/images/hero.png"
        alt="Kegiatan mahasiswa HIMTI UNA"
        className="shutter"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mixBlendMode: "luminosity",
          opacity: 0.12,
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div className="wrap" style={{ position: "relative", zIndex: 1, width: "100%", paddingTop: "8rem", paddingBottom: "5rem" }}>
        <div style={{ maxWidth: "min(55%, 680px)" }}>

          {/* Logos */}
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
            <div className="bezel" style={{ display: "inline-flex" }}>
              <div className="bezel-inner" style={{ padding: "6px" }}>
                <img
                  src="/images/logo-himti.jpg"
                  alt="Logo HIMTI UNA"
                  style={{ height: 52, width: 52, objectFit: "contain", borderRadius: "6px", display: "block" }}
                />
              </div>
            </div>
            <img
              src="/images/logo-una.jpg"
              alt="Logo Universitas Asahan"
              style={{ height: 44, objectFit: "contain", opacity: 0.7, borderRadius: "4px" }}
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
            <a href="#tentang" className="btn">
              Kenali HIMTI
              <span className="icon-bubble" aria-hidden><ArrowDown size={13} /></span>
            </a>
            <a href="#kegiatan" className="btn btn-ghost">Lihat Kegiatan</a>
          </div>

        </div>
      </div>

      {/* Scroll label */}
      <span
        className="reveal hide-mobile"
        style={{
          position: "absolute",
          bottom: "2rem",
          left: "var(--margin)",
          fontSize: "var(--step-xs)",
          color: "var(--muted)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          zIndex: 1,
          ["--d" as string]: "500ms",
        }}
        aria-hidden
      >
        Scroll
      </span>
    </section>
  )
}
