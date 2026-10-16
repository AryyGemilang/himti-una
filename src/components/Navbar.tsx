import { useEffect, useState } from "react"

const MENU = [
  ["Beranda", "#beranda"], ["Tentang", "#tentang"], ["Sejarah", "#sejarah"],
  ["Visi Misi", "#visimisi"], ["Pengurus", "#pengurus"],
  ["Kegiatan", "#kegiatan"], ["Kontak", "#kontak"],
] as const

export default function Navbar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <header className="nav" aria-label="Navigasi utama">
        <div className="nav-pill">
          {/* Logo */}
          <a href="#beranda" className="nav-logo" aria-label="HIMTI UNA, ke atas halaman">
            <img src="/images/logo-himti.jpg" alt="Logo HIMTI UNA" />
            <span className="nav-wordmark">
              HIMTI <span style={{ color: "var(--accent)" }}>UNA</span>
            </span>
          </a>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            {MENU.map(([label, href]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a href="#kontak" className="btn nav-action hide-mobile">Hubungi</a>

          {/* Hamburger — morphs to X */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="nav-mobile-overlay"
            style={{ position: "relative", width: 28, height: 20 }}
          >
            <span style={{
              position: "absolute", left: 0, top: open ? "50%" : 0,
              width: 28, height: 2, background: "var(--ink)", borderRadius: 1,
              transform: open ? "translateY(-50%) rotate(45deg)" : "none",
              transition: "top 200ms ease, transform 200ms ease",
            }} />
            <span style={{
              position: "absolute", left: 0, top: "50%",
              width: 28, height: 2, background: "var(--ink)", borderRadius: 1,
              transform: "translateY(-50%)",
              opacity: open ? 0 : 1,
              transition: "opacity 150ms ease",
            }} />
            <span style={{
              position: "absolute", left: 0, bottom: open ? "50%" : 0,
              width: 28, height: 2, background: "var(--ink)", borderRadius: 1,
              transform: open ? "translateY(50%) rotate(-45deg)" : "none",
              transition: "bottom 200ms ease, transform 200ms ease",
            }} />
          </button>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <nav
        id="nav-mobile-overlay"
        className={`nav-overlay ${open ? "open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        {MENU.map(([label, href], i) => (
          <a
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
          >
            {label}
          </a>
        ))}
        <a
          href="#kontak"
          className="btn"
          onClick={() => setOpen(false)}
          style={{
            marginTop: "2rem",
            transitionDelay: open ? `${MENU.length * 60}ms` : "0ms",
            opacity: open ? 1 : 0,
            transform: open ? "none" : "translateY(16px)",
            transition: `opacity 320ms var(--spring) ${open ? MENU.length * 60 : 0}ms, transform 320ms var(--spring) ${open ? MENU.length * 60 : 0}ms`,
          }}
        >
          Hubungi Kami
        </a>
      </nav>
    </>
  )
}
