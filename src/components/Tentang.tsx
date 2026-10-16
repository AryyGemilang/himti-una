import { useReveal } from "../hooks/useReveal"

export default function Tentang() {
  const ref = useReveal()

  return (
    <section id="tentang" ref={ref} className="section">
      <div className="wrap">
        <div className="panel" style={{ padding: "clamp(2.5rem, 6vw, 5rem)", position: "relative" }}>

          {/* Motif small */}
          <div className="motif" aria-hidden style={{ width: 200, height: 200, right: "3rem", bottom: "3rem", opacity: 0.06 }} />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem, 6vw, 5rem)", position: "relative", zIndex: 1 }}>

            <div>
              <h2 className="head reveal">Apa itu<br />HIMTI?</h2>
              <div aria-hidden style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", margin: "1.75rem 0 1.25rem" }} />
              <p className="reveal muted" style={{ ["--d" as string]: "100ms" }}>
                HIMTI adalah wadah penampung aspirasi, prestasi, dan skill mahasiswa Teknik Informatika
                Universitas Asahan untuk terus berkembang dan maju.
              </p>
              <p className="reveal muted" style={{ ["--d" as string]: "180ms", marginTop: "1rem" }}>
                Organisasi ini berada di bawah naungan Fakultas Teknik dan{" "}
                <strong style={{ color: "var(--ink)", fontWeight: 700 }}>PERMIKOMNAS</strong>{" "}
                (Perhimpunan Mahasiswa Informatika dan Komputer Nasional).
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {[
                { label: "Akademik", body: "Mendukung mahasiswa dalam menyelesaikan studi dan mengembangkan kemampuan teknis di bidang informatika dan komputer." },
                { label: "Non-Akademik", body: "Mempererat silaturahmi, mengembangkan minat dan bakat, serta membangun kepemimpinan melalui kegiatan organisasi yang bermakna." },
              ].map(({ label, body }, i) => (
                <div key={label} className="reveal" style={{ ["--d" as string]: `${(i + 1) * 120}ms` }}>
                  <h3 style={{ fontWeight: 800, fontSize: "var(--step-lg)", textTransform: "uppercase", letterSpacing: "-0.025em", marginBottom: "0.6rem" }}>{label}</h3>
                  <p style={{ color: "var(--muted)", fontSize: "var(--step-sm)", margin: 0 }}>{body}</p>
                </div>
              ))}
              <a href="#kegiatan" className="btn reveal" style={{ alignSelf: "flex-start", ["--d" as string]: "360ms" }}>
                Lihat Kegiatan
              </a>
            </div>

          </div>

          {/* Photo strip */}
          <div className="reveal" style={{ marginTop: "3rem", position: "relative", zIndex: 1, ["--d" as string]: "200ms" }}>
            <img
              src="https://picsum.photos/id/338/1600/500?grayscale"
              alt="Suasana kegiatan mahasiswa"
              width={1600} height={500} loading="lazy"
              style={{ width: "100%", height: "clamp(140px, 20vw, 280px)", objectFit: "cover", borderRadius: 8, filter: "brightness(0.55)" }}
            />
            <p style={{ fontSize: "var(--step-xs)", color: "var(--muted)", marginTop: "0.5rem" }}>
              Photo: Patryk Sobczak, Unsplash licence
            </p>
          </div>

        </div>
      </div>
      <style>{`@media(max-width:48em){#tentang .panel>div:first-of-type{grid-template-columns:1fr!important}}`}</style>
    </section>
  )
}
