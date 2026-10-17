import { useReveal } from "../hooks/useReveal"

export default function Kontak() {
  const ref = useReveal()

  return (
    <section id="kontak" ref={ref} className="section" style={{ position: "relative", overflow: "hidden" }}>
      <div className="motif" aria-hidden style={{ width: "40vh", height: "40vh", right: "-10vh", bottom: "-10vh", opacity: 0.05 }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="kontak-grid">

          {/* Left */}
          <div>
            <p className="label reveal">Kontak</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Hubungi<br />Kami</h2>
            <img src="/himti-una/images/logos/logo-himti.svg" alt="" aria-hidden className="section-logo" />
            <p className="reveal muted" style={{ ["--d" as string]: "120ms" }}>
              Punya pertanyaan atau ingin bergabung bersama HIMTI UNA? Kirim pesan dan kami akan
              segera menghubungi kamu.
            </p>
            <div className="reveal" style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.875rem", ["--d" as string]: "180ms" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "var(--step-sm)", marginBottom: "0.2rem" }}>Lokasi</p>
                <p style={{ color: "var(--muted)", fontSize: "var(--step-sm)", margin: 0 }}>
                  Fakultas Teknik, Universitas Asahan<br />Kisaran, Sumatera Utara
                </p>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "var(--step-sm)", marginBottom: "0.2rem" }}>Naungan</p>
                <p style={{ color: "var(--muted)", fontSize: "var(--step-sm)", margin: 0 }}>PERMIKOMNAS, anggota sejak 2021</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .kontak-grid {
          max-width:52rem;
          margin-inline:auto;
        }
        @media (max-width: 48em) {
          .kontak-grid { width:100%; }
        }
      `}</style>
    </section>
  )
}
