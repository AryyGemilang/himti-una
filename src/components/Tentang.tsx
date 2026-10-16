import { useReveal } from "../hooks/useReveal"

export default function Tentang() {
  const ref = useReveal()

  return (
    <section id="tentang" ref={ref} className="section">
      <div className="wrap">
        <div className="panel tentang-panel">

          {/* Motif dekoratif — hidden mobile */}
          <div
            className="motif tentang-motif"
            aria-hidden
            style={{ width: 180, height: 180, right: "2rem", bottom: "2rem", opacity: 0.06 }}
          />

          {/* Grid konten */}
          <div className="tentang-grid">

            {/* Kolom kiri */}
            <div>
              <h2 className="head reveal">Apa itu<br />HIMTI?</h2>
              <img
                src="/himti-una/Logo-Himti.svg"
                alt="" aria-hidden
                style={{ width: 36, height: 36, objectFit: "contain", margin: "1.75rem 0 1.25rem", display: "block", opacity: 0.85 }}
              />
              <p className="reveal muted tentang-p" style={{ ["--d" as string]: "100ms" }}>
                HIMTI adalah wadah penampung aspirasi, prestasi, dan skill mahasiswa Teknik Informatika
                Universitas Asahan untuk terus berkembang dan maju.
              </p>
              <p className="reveal muted tentang-p" style={{ ["--d" as string]: "180ms", marginTop: "1rem" }}>
                HIMTI berada di bawah naungan Fakultas Teknik dan{" "}
                <strong style={{ color: "var(--ink)", fontWeight: 700 }}>PERMIKOMNAS</strong>{" "}
                (Perhimpunan Mahasiswa Informatika dan Komputer Nasional).
              </p>
            </div>

            {/* Kolom kanan */}
            <div className="tentang-cards">
              {[
                { label: "Akademik", body: "Mendukung mahasiswa dalam menyelesaikan studi dan mengembangkan kemampuan teknis di bidang informatika dan komputer." },
                { label: "Non-Akademik", body: "Mempererat silaturahmi, mengembangkan minat dan bakat, serta membangun kepemimpinan melalui kegiatan organisasi yang bermakna." },
              ].map(({ label, body }, i) => (
                <div key={label} className="reveal" style={{ ["--d" as string]: `${(i + 1) * 120}ms` }}>
                  <h3 className="tentang-card-head">{label}</h3>
                  <p style={{ color: "var(--muted)", fontSize: "var(--step-sm)", margin: 0 }}>{body}</p>
                </div>
              ))}
              <a href="#kegiatan" className="btn reveal" style={{ alignSelf: "flex-start", ["--d" as string]: "360ms" }}>
                Lihat Kegiatan
              </a>
            </div>

          </div>

          {/* Photo strip */}
          <div className="reveal tentang-photo" style={{ ["--d" as string]: "200ms" }}>
            <img
              src="https://picsum.photos/id/338/1600/500?grayscale"
              alt="Suasana kegiatan mahasiswa"
              width={1600} height={500} loading="lazy"
              style={{ width: "100%", height: "clamp(120px, 18vw, 280px)", objectFit: "cover", borderRadius: 8, filter: "brightness(0.55)" }}
            />
            <p style={{ fontSize: "var(--step-xs)", color: "var(--muted)", marginTop: "0.5rem" }}>
              Photo: Patryk Sobczak, Unsplash licence
            </p>
          </div>

        </div>
      </div>

      <style>{`
        .tentang-panel {
          padding: clamp(1.5rem, 5vw, 5rem);
          position: relative;
          overflow: hidden;
        }
        .tentang-motif {
          position: absolute;
        }
        .tentang-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(2rem, 6vw, 5rem);
          position: relative;
          z-index: 1;
        }
        .tentang-cards {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .tentang-card-head {
          font-weight: 800;
          font-size: var(--step-lg);
          text-transform: uppercase;
          letter-spacing: -0.025em;
          margin-bottom: 0.6rem;
        }
        .tentang-p {
          max-width: 100%;
        }
        .tentang-photo {
          margin-top: 2.5rem;
          position: relative;
          z-index: 1;
        }

        /* Tablet */
        @media (max-width: 56em) {
          .tentang-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }

        /* Mobile */
        @media (max-width: 48em) {
          .tentang-panel {
            padding: 1.5rem;
          }
          .tentang-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .tentang-motif {
            display: none;
          }
          .tentang-cards {
            gap: 1.5rem;
          }
          .tentang-card-head {
            font-size: var(--step-md);
          }
        }

        /* Smartphone kecil */
        @media (max-width: 23.5em) {
          .tentang-panel {
            padding: 1.25rem;
          }
        }
      `}</style>
    </section>
  )
}
