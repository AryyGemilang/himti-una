import { useEffect, useState } from "react"

// Base path dari Vite (GitHub Pages subpath)
const BASE = import.meta.env.BASE_URL // "/himti-una/"

/** Ambil path relatif terhadap base. Contoh: "/himti-una/bidang/humas/" → "/bidang/humas/" */
export function currentPath(): string {
  const p = window.location.pathname
  return p.startsWith(BASE) ? "/" + p.slice(BASE.length) : p
}

/** Navigasi client-side tanpa reload */
export function navigate(to: string, opts?: { replace?: boolean }) {
  const url = BASE.replace(/\/$/, "") + to
  if (opts?.replace) window.history.replaceState({}, "", url)
  else window.history.pushState({}, "", url)
  window.dispatchEvent(new PopStateEvent("popstate"))
}

export function useRoute() {
  const [path, setPath] = useState(currentPath)

  useEffect(() => {
    const onNav = () => setPath(currentPath())
    window.addEventListener("popstate", onNav)
    return () => window.removeEventListener("popstate", onNav)
  }, [])

  return path
}
