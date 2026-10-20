import { useEffect, useRef, useState } from "react"
import { ChevronDown, Moon, Sun } from "lucide-react"
import { bidangList } from "../data/bidang"
import { LOGO_UNA } from "../lib/assets"

const MENU = [
  ["Beranda", "/"], ["Tentang", "/tentang"], ["Sejarah", "/sejarah"],
  ["Visi Misi", "/visi-misi"], ["Pengurus", "/pengurus"],
  ["Kegiatan", "/kegiatan"], ["Kontak", "/kontak"],
] as const

const isActiveRoute = (path: string, href: string) => path === href || (href === "/pengurus" && /^\/(?:divisi|bidang)\//.test(path))

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
  const [navHidden, setNavHidden] = useState(false)
  const [darkMode, setDarkMode] = useState(() => document.documentElement.dataset.theme === "dark")
  const headerRef = useRef<HTMLElement>(null)
  const mobileThemeRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const desktopPengurusRef = useRef<HTMLLIElement>(null)
  const suppressDropdownFocusRef = useRef(false)
  const pointerInNavigationRef = useRef(false)

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
    let frame = 0
    let previousY = Math.max(0, window.scrollY)
    let previousDirection = 0
    let accumulatedDistance = 0
    const threshold = 12
    const topSafeZone = 80

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const currentY = Math.max(0, window.scrollY)
        const delta = currentY - previousY
        previousY = currentY

        if (currentY <= topSafeZone) {
          accumulatedDistance = 0
          previousDirection = 0
          setNavHidden(false)
          return
        }
        if (!delta) return

        const direction = delta > 0 ? 1 : -1
        accumulatedDistance = direction === previousDirection ? accumulatedDistance + Math.abs(delta) : Math.abs(delta)
        previousDirection = direction
        if (accumulatedDistance < threshold) return
        accumulatedDistance = 0

        const focused = headerRef.current?.contains(document.activeElement)
          || mobileThemeRef.current?.contains(document.activeElement)
        if (open || pointerInNavigationRef.current || focused) {
          setNavHidden(false)
          return
        }
        setNavHidden(direction > 0)
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [open])

  const revealNavigation = () => setNavHidden(false)
  const enterNavigation = (pointerType: string) => {
    if (pointerType === "touch") return
    pointerInNavigationRef.current = true
    revealNavigation()
  }
  const leaveNavigation = (pointerType: string) => {
    if (pointerType === "touch") return
    pointerInNavigationRef.current = false
  }

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
      <div
        className="nav-reveal-zone"
        aria-hidden="true"
        onPointerEnter={event => {
          if (event.pointerType !== "touch") revealNavigation()
        }}
      />
      <header
        ref={headerRef}
        className={`nav nav-brand-visible${navHidden ? " nav-hidden" : ""}`}
        aria-label="Navigasi utama"
        onPointerEnter={event => enterNavigation(event.pointerType)}
        onPointerLeave={event => leaveNavigation(event.pointerType)}
        onFocusCapture={revealNavigation}
      >
        <div className="nav-pill">
          <div className="nav-brand-group" aria-label="Logo HIMTI dan Universitas Asahan">
            <a href="/" className="nav-logo" aria-label="HIMTI UNA, ke Beranda">
              <img src="/himti-una/images/branding/logo-himti.webp" alt="Logo HIMTI UNA" />
            </a>
            <a href="https://una.ac.id/" className="nav-una-logo" aria-label="Kunjungi website resmi Universitas Asahan (una.ac.id)">
              <img src={LOGO_UNA} alt="Logo Universitas Asahan" />
            </a>
            <span className="nav-brand-name"><strong>HIMTI</strong><small>Universitas Asahan</small></span>
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
                <a href={href} className={isActiveRoute(path, href) ? "active" : undefined} aria-current={isActiveRoute(path, href) ? "page" : undefined}>Pengurus</a>
                <button
                  type="button"
                  className="nav-pengurus-toggle"
                  aria-label={desktopPengurusOpen ? "Sembunyikan daftar divisi" : "Tampilkan daftar divisi"}
                  aria-expanded={desktopPengurusOpen}
                  aria-controls="nav-pengurus-dropdown"
                  onClick={() => setDesktopPengurusOpen(true)}
                />
                <ul className="nav-pengurus-dropdown" id="nav-pengurus-dropdown" aria-label="Daftar divisi">
                  {bidangList.map(bidang => (
                    <li key={bidang.slug}>
                      <a href={`/divisi/${bidang.slug}/`}>{bidang.namaPendek}</a>
                    </li>
                  ))}
                </ul>
              </li>
            ) : (
              <li key={href}><a href={href} className={isActiveRoute(path, href) ? "active" : undefined} aria-current={isActiveRoute(path, href) ? "page" : undefined}>{label}</a></li>
            ))}
          </ul>

          <ThemeToggle darkMode={darkMode} onToggle={toggleTheme} />

          {/* Hamburger — morphs to X */}
          <button
            className="nav-hamburger"
            ref={hamburgerRef}
            onClick={() => {
              if (!open) setNavHidden(false)
              setOpen(!open)
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

      <div
        ref={mobileThemeRef}
        className={`mobile-theme-holder${navHidden ? " nav-hidden" : ""}`}
        onPointerEnter={event => enterNavigation(event.pointerType)}
        onPointerLeave={event => leaveNavigation(event.pointerType)}
        onFocusCapture={revealNavigation}
      >
        <ThemeToggle
          darkMode={darkMode}
          onToggle={toggleTheme}
          mobile
        />
      </div>

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
              <a href={href} className={isActiveRoute(path, href) ? "active" : undefined} aria-current={isActiveRoute(path, href) ? "page" : undefined} onClick={() => { setOpen(false); setMobilePengurusOpen(false) }} style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}>
                Pengurus
              </a>
              <button
                type="button"
                className="nav-mobile-pengurus-toggle"
                aria-label={mobilePengurusOpen ? "Sembunyikan daftar divisi" : "Tampilkan daftar divisi"}
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
                <a key={bidang.slug} href={`/divisi/${bidang.slug}/`} onClick={() => { setOpen(false); setMobilePengurusOpen(false) }}>
                  {bidang.namaPendek}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <a
            key={href}
            href={href}
            className={isActiveRoute(path, href) ? "active" : undefined}
            aria-current={isActiveRoute(path, href) ? "page" : undefined}
            onClick={() => setOpen(false)}
            style={{ transitionDelay: open ? `${i * 60}ms` : "0ms" }}
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  )
}
