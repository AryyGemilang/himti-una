import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, ChevronDown, LockKeyhole, Moon, Sun } from "lucide-react"
import { bidangList } from "../data/bidang"
import { LOGO_UNA } from "../lib/assets"
import { apiUrl } from "../lib/api"
import { subscribeToScroll } from "../lib/scroll"

const MENU = [
  ["Beranda", "/"], ["Tentang Kami", "/tentang"], ["Sejarah", "/sejarah"],
  ["Visi Misi", "/visi-misi"], ["Pengurus", "/pengurus"],
  ["Kegiatan", "/kegiatan"], ["Dokumentasi", "/dokumentasi"], ["Kontak", "/kontak"],
] as const

type PublicEvent = { type: string; registrationOpen: boolean }

function BrandIdentity({ mobileMenu = false, onNavigate }: { mobileMenu?: boolean; onNavigate?: () => void }) {
  return (
    <div className={`nav-brand-group${mobileMenu ? " nav-mobile-brand" : ""}`} aria-label="Logo HIMTI dan Universitas Asahan">
      <a href="/" className="nav-logo" aria-label="HIMTI UNA, ke Beranda" onClick={onNavigate}>
        <img src="/himti-una/images/branding/logo-himti.webp" alt="Logo HIMTI UNA" />
      </a>
      <a href="https://una.ac.id/" className="nav-una-logo" aria-label="Kunjungi website resmi Universitas Asahan (una.ac.id)" onClick={onNavigate}>
        <img src={LOGO_UNA} alt="Logo Universitas Asahan" />
      </a>
      <span className="nav-brand-name"><strong>HIMTI UNA</strong><small>Himpunan Mahasiswa Teknik Informatika</small></span>
    </div>
  )
}

function RecruitmentAction({
  open,
  mobile = false,
  onNavigate,
}: {
  open: boolean
  mobile?: boolean
  onNavigate?: () => void
}) {
  const className = `nav-recruitment ${mobile ? "nav-recruitment-mobile" : "nav-recruitment-desktop"}${open ? " is-open" : " is-closed"}`
  return open ? (
    <a className={className} href="/pendaftaran" onClick={onNavigate} aria-live="polite" aria-label="Open Recruitment. Lihat pendaftaran yang sedang dibuka">
      <span className="recruitment-open-dot" aria-hidden="true" />
      <span className="recruitment-label">Open Recruitment</span>
      <ArrowUpRight size={16} aria-hidden="true" />
    </a>
  ) : (
    <button className={className} type="button" disabled aria-live="polite" aria-label="Rekrutmen Ditutup">
      <LockKeyhole size={16} aria-hidden="true" />
      <span className="recruitment-label">Rekrutmen Ditutup</span>
    </button>
  )
}

const isActiveRoute = (path: string, href: string) => path === href || (href === "/pengurus" && /^\/(?:divisi|bidang)\//.test(path))

function ThemeToggle({ darkMode, onToggle }: { darkMode: boolean; onToggle: () => void }) {
  return (
    <button
      className={`theme-toggle theme-toggle-desktop mobile-nav-control ${darkMode ? "is-dark" : ""}`}
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
  const [recruitmentOpen, setRecruitmentOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const desktopPengurusRef = useRef<HTMLLIElement>(null)
  const suppressDropdownFocusRef = useRef(false)
  const pointerInNavigationRef = useRef(false)

  useEffect(() => {
    let active = true
    const refreshRecruitmentStatus = async () => {
      try {
        const response = await fetch(apiUrl("/events"), { cache: "no-store" })
        if (!response.ok) throw new Error("Status pendaftaran belum dapat dimuat.")
        const events = await response.json() as PublicEvent[]
        if (active) setRecruitmentOpen(events.some(event => event.type === "recruitment" && event.registrationOpen))
      } catch {
        if (active) setRecruitmentOpen(false)
      }
    }
    void refreshRecruitmentStatus()
    const interval = window.setInterval(() => void refreshRecruitmentStatus(), 60_000)
    return () => {
      active = false
      window.clearInterval(interval)
    }
  }, [])

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
    let previousDirection = 0
    let accumulatedDistance = 0
    const threshold = 12
    const topSafeZone = 80

    return subscribeToScroll(({ y, delta }) => {
      if (y <= topSafeZone) {
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
      if (open || pointerInNavigationRef.current || focused) {
        setNavHidden(false)
        return
      }
      setNavHidden(direction > 0)
    })
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
          <BrandIdentity />

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
          <RecruitmentAction open={recruitmentOpen} />

          {/* Hamburger — morphs to X */}
          <button
            className="nav-hamburger mobile-nav-control"
            ref={hamburgerRef}
            onClick={() => {
              if (!open) setNavHidden(false)
              setOpen(!open)
              setMobilePengurusOpen(false)
            }}
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            aria-controls="nav-mobile-overlay"
            style={{ position: "relative" }}
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

      {/* Full-screen mobile overlay */}
      <nav
        id="nav-mobile-overlay"
        ref={menuRef}
        className={`nav-overlay ${open ? "open" : ""}`}
        aria-hidden={!open}
        inert={!open}
      >
        <BrandIdentity mobileMenu onNavigate={() => setOpen(false)} />
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
        <RecruitmentAction mobile open={recruitmentOpen} onNavigate={() => setOpen(false)} />
      </nav>
    </>
  )
}
