import { useEffect, useRef } from "react"

/**
 * Logo HIMTI besar sebagai background global.
 * - Awal: di kanan viewport (hero).
 * - Scroll: bergerak ke tengah, lalu TETAP di tengah (fixed).
 */
export default function BgLogo() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.transform = "translate(-50%, -50%)"
      return
    }

    let raf = 0
    const update = () => {
      const vh = window.innerHeight
      // progress 0 (atas) → 1 (setelah 1 viewport scroll)
      const p = Math.min(window.scrollY / vh, 1)
      // x: 0% (kanan) → -50% (tengah, karena translate -50% adalah anchor tengah)
      const x = p * -50
      const y = -50
      const scale = 1 - p * 0.06
      el.style.transform = `translate(${x}%, ${y}%) scale(${scale})`
    }

    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
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
