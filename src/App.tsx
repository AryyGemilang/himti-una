import { useEffect } from "react"
import Navbar from "./components/Navbar"
import BgLogo from "./components/BgLogo"
import BokehLights from "./components/BokehLights"
import Hero from "./components/Hero"
import HomeWelcome from "./components/HomeWelcome"
import Tentang from "./components/Tentang"
import Sejarah from "./components/Sejarah"
import VisiMisi from "./components/VisiMisi"
import Pengurus from "./components/Pengurus"
import Kegiatan from "./components/Kegiatan"
import Kontak from "./components/Kontak"
import CalonMahasiswa from "./components/CalonMahasiswa"
import Footer from "./components/Footer"
import BidangPage from "./components/BidangPage"
import { useRoute, navigate, currentPath } from "./lib/router"
import { getBidang } from "./data/bidang"

/** Intersep tautan lokal untuk navigasi client-side tanpa reload. */
function useLinkInterceptor() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as HTMLElement).closest("a")
      const href = anchor?.getAttribute("href")
      if (!href || !href.startsWith("/") || href.startsWith("//")) return

      event.preventDefault()
      const [path, hash] = href.split("#")

      // Pertahankan tautan ke bagian yang masih berada di Beranda.
      if (path === "/" || path === "") {
        if (currentPath() === "/") {
          if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" })
          else window.scrollTo({ top: 0, behavior: "smooth" })
        } else {
          navigate("/", { replace: false })
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (hash) document.getElementById(hash)?.scrollIntoView({ behavior: "instant" as ScrollBehavior })
          }))
        }
        return
      }

      navigate(path + (hash ? `#${hash}` : ""))
      window.scrollTo({ top: 0 })
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])
}

function HomePage() {
  return (
    <main>
      <Hero />
      <HomeWelcome />
    </main>
  )
}

function PageContent({ path }: { path: string }) {
  switch (path) {
    case "/tentang": return <main className="route-page"><Tentang /></main>
    case "/sejarah": return <main className="route-page"><Sejarah /></main>
    case "/visi-misi": return <main className="route-page"><VisiMisi /></main>
    case "/pengurus": return <main className="route-page"><Pengurus /></main>
    case "/kegiatan": return <main className="route-page"><Kegiatan /></main>
    case "/kontak": return <main className="route-page"><Kontak /><CalonMahasiswa /></main>
    default: return <HomePage />
  }
}

const PAGE_ROUTES = new Set(["/", "/tentang", "/sejarah", "/visi-misi", "/pengurus", "/kegiatan", "/kontak"])

export default function App() {
  const path = useRoute()
  useLinkInterceptor()

  const match = path.match(/^\/(?:divisi|bidang)\/([^/]+)$/)
  const bidang = match ? getBidang(match[1]) : undefined
  const isUnknownRoute = !PAGE_ROUTES.has(path) && !bidang

  useEffect(() => {
    if (isUnknownRoute) navigate("/", { replace: true })
  }, [isUnknownRoute])

  return (
    <>
      <div className="grain" aria-hidden />
      <BgLogo />
      <BokehLights />
      <Navbar path={path} />
      {bidang ? <BidangPage bidang={bidang} /> : <PageContent path={path} />}
      <Footer />
    </>
  )
}
