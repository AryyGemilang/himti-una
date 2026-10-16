import { useEffect, useRef } from "react"

/**
 * Logo HIMTI besar sebagai background global.
 * - Awal: di kanan viewport (hero), sebagian terlihat.
 * - Scroll 1 viewport: bergerak ke TITIK PUSAT viewport, lalu tetap terkunci di sana.
 *
 * Anchor: left:50% / top:50% + translate(-50%,-50%) = pusat elemen di pusat viewport.
 * Offset awal digeser via CSS var --ox (px) yang dihitung dari lebar elemen.
 */
export default function BgLogo() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let raf = 0
    let startOffset = 0
    let size = 0

    // Ukur lebar elemen → offset awal (kanan) dalam px
    const measure = () => {
      size = el.offsetWidth
      // awal: pusat elemen di 100% viewport → offset dari pusat = setengah viewport + setengah elemen
      startOffset = window.innerWidth / 2 + size / 2
    }

    const update = () => {
      const vh = window.innerHeight || 1
      const p = reduce ? 1 : Math.min(window.scrollY / vh, 1)
      // ease-out agar perpindahan terasa halus
      const e = 1 - Math.pow(1 - p, 3)
      const ox = startOffset * (1 - e) // px → 0 saat p=1
      const scale = 1 - e * 0.06
      el.style.transform =
        `translate(calc(-50% + ${ox.toFixed(2)}px), -50%) scale(${scale.toFixed(4)})`
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    const onResize = () => {
      measure()
      onScroll()
    }

    measure()
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="bg-logo-layer" aria-hidden>
      <div ref={ref} className="bg-logo-img">
        <img
          src="/himti-una/Logo-Himti.svg"
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            opacity: 0.14,
            filter: "saturate(0.4) brightness(0.9)",
          }}
        />
      </div>
    </div>
  )
}
