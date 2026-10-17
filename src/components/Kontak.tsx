import { useReveal } from "../hooks/useReveal"

export default function Kontak() {
  const ref = useReveal()

  return (
    <section id="kontak" ref={ref} className="section" style={{ position: "relative", overflow: "hidden" }}>
      <div className="motif" aria-hidden style={{ width: "40vh", height: "40vh", right: "-10vh", bottom: "-10vh", opacity: 0.05 }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="kontak-grid">

          {/* Left */}
          <div className="kontak-content">
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
                  Fakultas Teknik<br />Universitas Asahan<br />Kisaran, Sumatera Utara
                </p>
                <a className="contact-link" href="https://share.google/kIGBHkUtAg1HOTBd7" target="_blank" rel="noopener noreferrer">
                  Lihat lokasi di peta
                </a>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "var(--step-sm)", marginBottom: "0.2rem" }}>Email HIMTI UNA</p>
                <a className="contact-link" href="mailto:himti.universitasasahan@gmail.com">himti.universitasasahan@gmail.com</a>
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
          width:100%;
        }
        .kontak-content { max-width:62rem; }
        .contact-link {
          display: inline-block;
          min-height: 2.75rem;
          padding-block: 0.5rem;
          color: var(--accent-strong);
          font-size: var(--step-sm);
          overflow-wrap: anywhere;
          text-underline-offset: 0.2em;
        }
        .contact-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        @media (max-width: 48em) {
          .kontak-content { width:100%; }
        }
      `}</style>
    </section>
  )
}
