import { useEffect } from "react"
import Navbar from "./components/Navbar"
import SlideIndicator from "./components/SlideIndicator"
import BgLogo from "./components/BgLogo"
import Hero from "./components/Hero"
import Tentang from "./components/Tentang"
import Sejarah from "./components/Sejarah"
import VisiMisi from "./components/VisiMisi"
import Pengurus from "./components/Pengurus"
import Kegiatan from "./components/Kegiatan"
import Kontak from "./components/Kontak"
import CalonMahasiswa from "./components/CalonMahasiswa"
import Footer from "./components/Footer"
import BidangPage from "./components/BidangPage"
import { useActiveSection } from "./hooks/useReveal"
import { useRoute, navigate, currentPath } from "./lib/router"
import { getBidang } from "./data/bidang"

const SECTIONS = ["beranda","tentang","sejarah","visimisi","pengurus","kegiatan","kontak","calon-mahasiswa"]

/** Intersep klik anchor internal agar pakai client-side routing */
function useLinkInterceptor() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement).closest("a")
      if (!a) return
      const href = a.getAttribute("href")
      if (!href || !href.startsWith("/") || href.startsWith("//")) return

      e.preventDefault()

      // Anchor ke section di halaman utama (mis. "/#pengurus")
      const [path, hash] = href.split("#")

      if (path === "/" || path === "") {
        const base = import.meta.env.BASE_URL
        const isHome = currentPath() === "/"
        if (isHome) {
          if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
          else window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
          navigate(base, { replace: false })
          // Tunggu home render lalu scroll ke section
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "instant" as ScrollBehavior })
            })
          )
        }
        return
      }

      // Halaman detail bidang, mis. "/bidang/humas/"
      navigate(path + (hash ? `#${hash}` : ""))
      window.scrollTo({ top: 0 })
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])
}

function HomePage() {
  useActiveSection(SECTIONS)

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "instant" as ScrollBehavior })
    })
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      if (["INPUT","TEXTAREA","SELECT"].includes(tag)) return
      if (!["ArrowDown","ArrowUp","PageDown","PageUp"].includes(e.key)) return
      e.preventDefault()
      const cur = SECTIONS.findIndex(id => {
        const el = document.getElementById(id)
        if (!el) return false
        const r = el.getBoundingClientRect()
        return r.top >= -80 && r.top < window.innerHeight * 0.5
      })
      const next = e.key === "ArrowDown" || e.key === "PageDown"
        ? SECTIONS[Math.min(cur + 1, SECTIONS.length - 1)]
        : SECTIONS[Math.max(cur - 1, 0)]
      document.getElementById(next)?.scrollIntoView({ behavior: "smooth" })
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <main>
      <Hero />
      <Tentang />
      <Sejarah />
      <VisiMisi />
      <Pengurus />
      <Kegiatan />
      <Kontak />
      <CalonMahasiswa />
    </main>
  )
}

export default function App() {
  const path = useRoute()
  useLinkInterceptor()

  // Route: /bidang/:slug/
  const match = path.match(/^\/bidang\/([^/]+)\/?$/)
  const bidang = match ? getBidang(match[1]) : undefined

  // 404 → beranda
  useEffect(() => {
    if (path.startsWith("/bidang/") && !bidang) navigate("/", { replace: true })
  }, [path, bidang])

  return (
    <>
      <div className="grain" aria-hidden />
      <BgLogo />

      <Navbar path={path} />
      {!match && <SlideIndicator />}

      {bidang ? <BidangPage bidang={bidang} /> : <HomePage />}

      <Footer />
    </>
  )
}
