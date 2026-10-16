import { useReveal } from "../hooks/useReveal"

const MISI = [
  "Mengembangkan minat dan bakat Mahasiswa Teknik Informatika Universitas Asahan.",
  "Membantu Mahasiswa Teknik Informatika dalam menyelesaikan tugas studinya.",
  "Mempererat silaturahmi Mahasiswa Teknik Informatika bersama senior dan alumni.",
]

export default function VisiMisi() {
  const ref = useReveal()

  return (
    <section id="visimisi" ref={ref} className="section" style={{ position: "relative", overflow: "hidden" }}>
      <div className="motif" aria-hidden style={{ width: "55vh", height: "55vh", left: "-18vh", top: "50%", transform: "translateY(-50%)", opacity: 0.05 }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem, 7vw, 7rem)" }}>

          {/* Visi */}
          <div>
            <p className="label reveal">Visi</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Membantu<br />Mahasiswa IT</h2>
            <img src="/himti-una/Logo-Himti.svg" alt="" aria-hidden className="section-logo" />
            <p className="reveal muted" style={{ ["--d" as string]: "160ms" }}>
              HIMTI UNA mempunyai visi untuk membantu Mahasiswa Teknik Informatika baik dalam hal akademik
              maupun lainnya yang menyangkut ilmu Teknologi, dan juga sebagai wadah untuk menampung
              aspirasi mahasiswa Teknik Informatika.
            </p>
          </div>

          {/* Misi */}
          <div>
            <p className="label reveal">Misi</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Tiga Pilar<br />Utama</h2>
            <img src="/himti-una/Logo-Himti.svg" alt="" aria-hidden className="section-logo" />
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {MISI.map((m, i) => (
                <li key={i} className="reveal" style={{ display: "flex", gap: "0.875rem", alignItems: "flex-start", ["--d" as string]: `${(i + 1) * 100}ms` }}>
                  <div aria-hidden style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", flexShrink: 0, marginTop: "0.55rem" }} />
                  <p style={{ color: "var(--muted)", margin: 0, fontSize: "var(--step-sm)" }}>{m}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* PERMIKOMNAS block */}
        <div className="reveal bezel" style={{ marginTop: "5rem", ["--d" as string]: "300ms" }}>
          <div className="bezel-inner" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "center", padding: "2rem 2.5rem" }}>
            <div style={{ width: 64, height: 64, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/himti-una/PERMIKOMNAS.png" alt="Logo PERMIKOMNAS" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div>
              <h3 style={{ fontWeight: 800, fontSize: "var(--step-lg)", textTransform: "uppercase", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>PERMIKOMNAS</h3>
              <p style={{ color: "var(--muted)", fontSize: "var(--step-sm)", margin: 0, maxWidth: "65ch" }}>
                Perhimpunan Mahasiswa Informatika dan Komputer Nasional, didirikan tahun 2002, mempersatukan
                mahasiswa informatika seluruh Indonesia. HIMTI bergabung sejak 16 Desember 2021.
              </p>
            </div>
          </div>
        </div>

      </div>
      <style>{`@media(max-width:48em){#visimisi .wrap>div:first-of-type{grid-template-columns:1fr!important}#visimisi .bezel-inner{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
