import { CalendarDays } from "lucide-react"
import { useReveal } from "../hooks/useReveal"

export default function Kegiatan() {
  const ref = useReveal()

  return (
    <section id="kegiatan" ref={ref} className="section">
      <div className="wrap">
        <p className="label reveal">HIMTI UNA</p>
        <h1 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>
          Kegiatan
        </h1>
        <p className="muted reveal kegiatan-empty-state" style={{ ["--d" as string]: "120ms" }}>
          <CalendarDays size={20} aria-hidden="true" />
          Belum ada kegiatan yang dipublikasikan.
        </p>
      </div>
    </section>
  )
}
