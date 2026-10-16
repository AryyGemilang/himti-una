import { useEffect, useRef } from "react"
import { ArrowDown } from "lucide-react"

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgLogoRef = useRef<HTMLDivElement>(null)

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

  // Animasi scroll: logo bergerak dari kanan ke tengah
  useEffect(() => {
    const logo = bgLogoRef.current
    if (!logo) return
    // Hormati reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const vh = window.innerHeight
        const progress = Math.min(scrollY / vh, 1)
        const tx = progress * -40
        const scale = 1 - progress * 0.08
        logo.style.transform = `translateY(-50%) translateX(${tx}%) scale(${scale})`
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
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
      {/* Background logo HIMTI — animasi scroll kanan → tengah */}
      <div
        ref={bgLogoRef}
        aria-hidden
        style={{
          position: "absolute",
          width: "min(85vh, 85vw)",
          height: "min(85vh, 85vw)",
          right: "calc(min(85vh, 85vw) * -0.18)",
          top: "50%",
          transform: "translateY(-50%) translateX(0%) scale(1)",
          zIndex: 0,
          pointerEvents: "none",
          willChange: "transform",
          transition: "transform 0.05s linear",
        }}
      >
        <img
          src="/himti-una/Logo-Himti.svg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: 0.22,
            filter: "saturate(0.45) brightness(0.9)",
          }}
        />
      </div>

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

          {/* Logos */}
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginBottom: "3rem" }}>
            <img
              src="/himti-una/Logo-Himti.svg"
              alt="Logo HIMTI UNA"
              style={{ height: 56, width: "auto", objectFit: "contain", display: "block" }}
            />
            <img
              src="/himti-una/Logo-Una.svg"
              alt="Logo Universitas Asahan"
              style={{ height: 48, width: "auto", objectFit: "contain", opacity: 0.85, display: "block" }}
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
    </section>
  )
}
