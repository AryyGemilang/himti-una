import { useReveal } from "../hooks/useReveal"
import { pengurus } from "../data/pengurus"
import KartuPengurus from "./KartuPengurus"

const PENGURUS_INTI = [
  { role: "ketua", label: "Ketua", orang: pengurus.ketua },
  { role: "sekretaris", label: "Sekretaris", orang: pengurus.sekretaris },
  { role: "bendahara", label: "Bendahara", orang: pengurus.bendahara },
]

export default function HomeLeadership() {
  const ref = useReveal()

  return (
    <section ref={ref} className="home-leadership" aria-labelledby="home-leadership-title">
      <div className="wrap">
        <div className="home-leadership-heading">
          <h2 className="reveal" id="home-leadership-title">
            About Us
          </h2>
          <p className="reveal" style={{ ["--d" as string]: "70ms" }}>
            HIMTI adalah wadah penampung aspirasi, prestasi, dan skill mahasiswa Teknik Informatika Universitas Asahan untuk terus berkembang dan maju.
          </p>
        </div>

        <div className="home-leadership-grid" aria-label="Kartu pengurus inti HIMTI UNA">
          {PENGURUS_INTI.map(({ orang, role, label }, index) => (
            <KartuPengurus
              key={orang.jabatan}
              orang={orang}
              delay={index * 100}
              className={`home-leadership-card home-leadership-card--${role}`}
              tilt
              fullName
              roleLabel={label}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
