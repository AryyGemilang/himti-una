import { useEffect, useRef } from "react"

export function useReveal(rootMargin = "0px 0px -80px 0px") {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target) }
        })
      },
      { rootMargin }
    )
    el.querySelectorAll(".reveal, .reveal-left, .shutter").forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [rootMargin])

  return ref
}

export function useActiveSection(ids: string[]) {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            document.querySelectorAll(".nav-links a, .nav-mobile-menu a").forEach(a => {
              const href = (a as HTMLAnchorElement).getAttribute("href")
              a.classList.toggle("active", href === `#${e.target.id}`)
            })
            document.querySelectorAll(".slide-dot").forEach((d, i) => {
              d.classList.toggle("active", ids[i] === e.target.id)
            })
            const idx = ids.indexOf(e.target.id)
            const counter = document.querySelector(".slide-counter")
            if (counter && idx >= 0)
              counter.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(ids.length).padStart(2, "0")}`
          }
        })
      },
      { threshold: 0.4 }
    )
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [ids])
}
