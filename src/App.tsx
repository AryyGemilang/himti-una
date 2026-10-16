import { useEffect } from "react"
import Navbar from "./components/Navbar"
import SlideIndicator from "./components/SlideIndicator"
import Hero from "./components/Hero"
import Tentang from "./components/Tentang"
import Sejarah from "./components/Sejarah"
import VisiMisi from "./components/VisiMisi"
import Pengurus from "./components/Pengurus"
import Kegiatan from "./components/Kegiatan"
import Kontak from "./components/Kontak"
import Footer from "./components/Footer"
import { useActiveSection } from "./hooks/useReveal"

const SECTIONS = ["beranda","tentang","sejarah","visimisi","pengurus","kegiatan","kontak"]

export default function App() {
  useActiveSection(SECTIONS)

  // Keyboard section navigation
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
    <>
      {/* Fixed grain overlay — pointer-events-none, not on scroll container */}
      <div className="grain" aria-hidden />

      <Navbar />
      <SlideIndicator />

      <main>
        <Hero />
        <Tentang />
        <Sejarah />
        <VisiMisi />
        <Pengurus />
        <Kegiatan />
        <Kontak />
      </main>
      <Footer />
    </>
  )
}
