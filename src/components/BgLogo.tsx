import { useEffect, useRef } from "react"

/**
 * Logo HIMTI besar sebagai background global.
 * - Awal: di kanan viewport (hero), sebagian terlihat.
 * - Scroll 1 viewport: bergerak ke TITIK PUSAT viewport, lalu terkunci di sana.
 *
 * CSS: left:50% top:50% + translate(-50%,-50%) → pusat elemen = pusat viewport.
 * JS hanya menggeser offset horizontal (px) dari kanan menuju 0. Offset awal
 * memakai lebar viewport dan logo agar logo mulai terlihat dari sisi kanan;
 * elemen tetap fixed dan terpotong pada layer-nya, bukan menambah lebar dokumen.
 */
export default function BgLogo() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let raf = 0

    const update = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight || 1
      const startOffset = (vw + el.offsetWidth) / 2
      // Saat p=1 offset 0, sehingga pusat logo tepat di tengah viewport.
      const p = reduce ? 1 : Math.min(window.scrollY / vh, 1)
      const e = 1 - Math.pow(1 - p, 3) // ease-out cubic
      const ox = startOffset * (1 - e)
      const scale = 1 - e * 0.06
      el.style.transform =
        `translate(calc(-50% + ${ox.toFixed(2)}px), -50%) scale(${scale.toFixed(4)})`
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
