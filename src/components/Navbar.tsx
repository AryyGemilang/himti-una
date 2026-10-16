import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

const MENU = [
  ["Beranda", "/#beranda"], ["Tentang", "/#tentang"], ["Sejarah", "/#sejarah"],
  ["Visi Misi", "/#visimisi"], ["Pengurus", "/#pengurus"],
  ["Kegiatan", "/#kegiatan"], ["Kontak", "/#kontak"],
] as const

function ThemeToggle({ darkMode, onToggle, mobile = false }: { darkMode: boolean; onToggle: () => void; mobile?: boolean }) {
  return (
    <button
      className={`theme-toggle ${mobile ? "theme-toggle-mobile" : "theme-toggle-desktop"} ${darkMode ? "is-dark" : ""}`}
      type="button"
      role="switch"
      aria-checked={darkMode}
      aria-label={`Mode gelap ${darkMode ? "aktif" : "nonaktif"}. Aktifkan ${darkMode ? "mode terang" : "mode gelap"}`}
      onClick={onToggle}
    >
      <span className="theme-toggle-thumb" aria-hidden="true">
        {darkMode ? <Moon size={15} strokeWidth={2.2} /> : <Sun size={15} strokeWidth={2.2} />}
      </span>
    </button>
  )
}

export default function Navbar({ path }: { path: string }) {
  const [open, setOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => document.documentElement.dataset.theme === "dark")
  const [navLogosVisible, setNavLogosVisible] = useState(false)

  const toggleTheme = () => {
    const nextDarkMode = !darkMode
    setDarkMode(nextDarkMode)
    document.documentElement.dataset.theme = nextDarkMode ? "dark" : "light"
    try {
      window.localStorage.setItem("himti-una-theme", nextDarkMode ? "dark" : "light")
    } catch {
      // Theme still works for this session when browser storage is unavailable.
    }
  }

  useEffect(() => {
    const source = document.querySelector(".hero-logos, .bidang-hero-top")
    if (!source) {
      setNavLogosVisible(true)
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      setNavLogosVisible(entry.intersectionRatio < 0.8)
    }, { threshold: [0, 0.8], rootMargin: "-72px 0px 0px 0px" })
    observer.observe(source)
    return () => observer.disconnect()
  }, [path])

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
      <header className={`nav ${navLogosVisible ? "nav-brand-visible" : ""}`} aria-label="Navigasi utama">
        <div className="nav-pill">
          <div className="nav-brand-group" aria-label="Logo HIMTI dan Universitas Asahan" aria-hidden={!navLogosVisible} inert={!navLogosVisible}>
            <a href="/#beranda" className="nav-logo" aria-label="HIMTI UNA, ke atas halaman">
              <img src="/himti-una/Logo-Himti.svg" alt="Logo HIMTI UNA" />
            </a>
            <a href="https://una.ac.id/" className="nav-una-logo" aria-label="Kunjungi website resmi Universitas Asahan (una.ac.id)">
              <img src="/himti-una/Logo-Una.svg" alt="Logo Universitas Asahan" />
            </a>
          </div>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            {MENU.map(([label, href]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a href="/#kontak" className="btn nav-action hide-mobile">Hubungi</a>

          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />

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

      <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} mobile />

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
          href="/#kontak"
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
