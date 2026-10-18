import { useEffect, useRef, useState } from "react"
import { ChevronDown, Moon, Sun } from "lucide-react"
import { bidangList } from "../data/bidang"

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
  const [mobilePengurusOpen, setMobilePengurusOpen] = useState(false)
  const [desktopPengurusOpen, setDesktopPengurusOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => document.documentElement.dataset.theme === "dark")
  const [navLogosVisible, setNavLogosVisible] = useState(false)
  const menuRef = useRef<HTMLElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const desktopPengurusRef = useRef<HTMLLIElement>(null)
  const suppressDropdownFocusRef = useRef(false)

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        setMobilePengurusOpen(false)
        setDesktopPengurusOpen(false)
        if (open) hamburgerRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  useEffect(() => {
    if (!desktopPengurusOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !desktopPengurusRef.current?.contains(event.target)) {
        setDesktopPengurusOpen(false)
      }
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [desktopPengurusOpen])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (menuRef.current?.contains(target) || hamburgerRef.current?.contains(target)) return
      if (target instanceof Element && target.closest(".theme-toggle")) return
      setOpen(false)
      setMobilePengurusOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    return () => document.removeEventListener("pointerdown", onPointerDown)
  }, [open])

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
              <img src="/himti-una/images/logos/logo-himti.svg" alt="Logo HIMTI UNA" />
            </a>
            <a href="https://una.ac.id/" className="nav-una-logo" aria-label="Kunjungi website resmi Universitas Asahan (una.ac.id)">
              <img src="/himti-una/images/logos/logo-una.svg" alt="Logo Universitas Asahan" />
            </a>
          </div>

          {/* Desktop links */}
          <ul className="nav-links" role="list">
            {MENU.map(([label, href]) => label === "Pengurus" ? (
              <li
                key={href}
                ref={desktopPengurusRef}
                className={`nav-pengurus-item${desktopPengurusOpen ? " is-open" : ""}`}
                onMouseEnter={() => setDesktopPengurusOpen(true)}
                onMouseLeave={() => setDesktopPengurusOpen(false)}
                onFocusCapture={() => {
                  if (suppressDropdownFocusRef.current) {
                    suppressDropdownFocusRef.current = false
                    return
                  }
                  setDesktopPengurusOpen(true)
                }}
                onKeyDown={event => {
                  if (event.key !== "Escape") return
                  event.stopPropagation()
                  const toggle = desktopPengurusRef.current?.querySelector<HTMLButtonElement>(".nav-pengurus-toggle")
                  if (document.activeElement !== toggle) {
                    suppressDropdownFocusRef.current = true
                    toggle?.focus()
                  }
                  setDesktopPengurusOpen(false)
                }}
                onBlurCapture={event => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDesktopPengurusOpen(false)
                }}
              >
                <a href={href}>Pengurus</a>
                <button
                  type="button"
                  className="nav-pengurus-toggle"
                  aria-label={desktopPengurusOpen ? "Sembunyikan daftar bidang" : "Tampilkan daftar bidang"}
                  aria-expanded={desktopPengurusOpen}
                  aria-controls="nav-pengurus-dropdown"
                  onClick={() => setDesktopPengurusOpen(true)}
                />
                <ul className="nav-pengurus-dropdown" id="nav-pengurus-dropdown" aria-label="Daftar bidang">
                  {bidangList.map(bidang => (
                    <li key={bidang.slug}>
                      <a href={`/bidang/${bidang.slug}/`}>{bidang.namaPendek}</a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <a href="/#kontak" className="btn nav-action hide-mobile">Hubungi</a>

          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />

          {/* Hamburger — morphs to X */}
          <button
            className="nav-hamburger"
            ref={hamburgerRef}
            onClick={() => {
              setOpen(o => !o)
              setMobilePengurusOpen(false)
            }}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="nav-mobile-overlay"
            style={{ position: "relative", width: 44, height: 44 }}
          >
            <span style={{
              position: "absolute", left: 8, top: open ? "50%" : 11,
              width: 28, height: 2, background: "var(--ink)", borderRadius: 1,
              transform: open ? "translateY(-50%) rotate(45deg)" : "none",
              transition: "top 200ms ease, transform 200ms ease",
            }} />
            <span style={{
              position: "absolute", left: 8, top: "50%",
              width: 28, height: 2, background: "var(--ink)", borderRadius: 1,
              transform: "translateY(-50%)",
              opacity: open ? 0 : 1,
              transition: "opacity 150ms ease",
            }} />
            <span style={{
              position: "absolute", left: 8, bottom: open ? "50%" : 11,
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
        ref={menuRef}
        className={`nav-overlay ${open ? "open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        {MENU.map(([label, href], i) => label === "Pengurus" ? (
          <div className="nav-mobile-pengurus" key={href}>
            <div className="nav-mobile-pengurus-row">
              <a href={href} onClick={() => { setOpen(false); setMobilePengurusOpen(false) }} style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}>
                Pengurus
              </a>
              <button
                type="button"
                className="nav-mobile-pengurus-toggle"
                aria-label={mobilePengurusOpen ? "Sembunyikan daftar bidang" : "Tampilkan daftar bidang"}
                aria-expanded={mobilePengurusOpen}
                aria-controls="nav-mobile-pengurus-dropdown"
                onClick={() => setMobilePengurusOpen(value => !value)}
              >
                <ChevronDown size={19} aria-hidden="true" />
              </button>
            </div>
            <div
              className={`nav-mobile-pengurus-dropdown${mobilePengurusOpen ? " is-open" : ""}`}
              id="nav-mobile-pengurus-dropdown"
              aria-hidden={!mobilePengurusOpen}
              inert={!mobilePengurusOpen}
            >
              <a href={href} onClick={() => { setOpen(false); setMobilePengurusOpen(false) }}>Struktur Pengurus</a>
              {bidangList.map(bidang => (
                <a key={bidang.slug} href={`/bidang/${bidang.slug}/`} onClick={() => { setOpen(false); setMobilePengurusOpen(false) }}>
                  {bidang.namaPendek}
                </a>
              ))}
            </div>
          </div>
        ) : (
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
          className="btn nav-overlay-action"
          onClick={() => { setOpen(false); setMobilePengurusOpen(false) }}
          style={{
            transitionDelay: open ? `${MENU.length * 60}ms` : "0ms",
          }}
        >
          Hubungi Kami
        </a>
      </nav>
    </>
  )
}
