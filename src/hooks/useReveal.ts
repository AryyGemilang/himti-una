import { useEffect, useRef } from "react"

export function useReveal(rootMargin = "0px 0px -80px 0px") {
  const ref = useRef<HTMLElement>(null)

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
    el.querySelectorAll(".reveal, .reveal-left, .reveal-x, .shutter").forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [rootMargin])

  return ref
}
