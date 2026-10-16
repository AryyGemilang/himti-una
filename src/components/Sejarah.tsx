import { useReveal } from "../hooks/useReveal"

const KETUA = [
  { periode: "1 Okt 2013", label: "Berdiri",      nama: "Rahmat Irawan S.T.",    ket: "Ketua pertama HIMTI UNA" },
  { periode: "2020–2021",  label: "Periode III",   nama: "Reza Fahlevi S.Kom",    ket: "PJ Kahim" },
  { periode: "2021–2022",  label: "Periode IV",    nama: "Ibnu Haykal Lubis",     ket: "Bergabung PERMIKOMNAS, 16 Des 2021" },
  { periode: "2022–2023",  label: "Periode V",     nama: "Mhd Zikri Ansyari",    ket: "" },
  { periode: "2023–2024",  label: "Periode VI",    nama: "Mhd Fikri Gunawan",    ket: "PJ Kahim, Mhd Risky Al Faridz" },
  { periode: "2024–2025",  label: "Periode VII",   nama: "Bintang Fajar R Putra", ket: "Ketua aktif" },
]

export default function Sejarah() {
  const ref = useReveal()

  return (
    <section id="sejarah" ref={ref} className="section" style={{ background: "var(--surface)" }}>
      <div className="wrap">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "clamp(2rem, 7vw, 7rem)", alignItems: "start" }}>

          <div>
            <h2 className="head reveal">Sejarah<br />HIMTI</h2>
            <div aria-hidden style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", margin: "1.75rem 0" }} />
            <p className="reveal muted" style={{ ["--d" as string]: "100ms" }}>
              Berdiri <strong style={{ color: "var(--ink)" }}>1 Oktober 2013</strong>. Bergabung PERMIKOMNAS
              pada <strong style={{ color: "var(--ink)" }}>16 Desember 2021</strong> dalam Musyawarah
              Wilayah 1 Aceh-Sumut di Universitas Malikussaleh, Lhokseumawe.
            </p>
          </div>

          {/* Timeline */}
          <ol style={{ listStyle: "none", padding: 0, margin: 0, position: "relative" }}>
            <div className="timeline-line" aria-hidden />
            {KETUA.map((k, i) => (
              <li key={k.periode} className="reveal" style={{
                display: "flex", gap: "2rem", alignItems: "flex-start",
                paddingBottom: i < KETUA.length - 1 ? "2.5rem" : 0,
                position: "relative",
                ["--d" as string]: `${i * 80}ms`,
              }}>
                <div style={{ minWidth: 88, textAlign: "right", paddingRight: "2rem", position: "relative" }}>
                  <span style={{ fontSize: "var(--step-xs)", color: "var(--muted)", fontWeight: 600 }}>{k.periode}</span>
                  <div style={{
                    position: "absolute", right: -5, top: 4,
                    width: 10, height: 10, borderRadius: "50%",
                    background: i === KETUA.length - 1 ? "var(--accent)" : "var(--muted-2)",
                  }} />
                </div>
                <div style={{ paddingTop: 2 }}>
                  <p style={{ fontSize: "var(--step-xs)", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem", fontWeight: 700 }}>{k.label}</p>
                  <p style={{ fontWeight: 800, fontSize: "var(--step-lg)", lineHeight: 1.05, letterSpacing: "-0.02em" }}>{k.nama}</p>
                  {k.ket && <p style={{ fontSize: "var(--step-xs)", color: "var(--muted)", marginTop: "0.25rem" }}>{k.ket}</p>}
                </div>
              </li>
            ))}
          </ol>

        </div>
      </div>
      <style>{`@media(max-width:48em){#sejarah .wrap>div{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
