import { useReveal } from "../hooks/useReveal"

const KETUA = [
  { periode: "1 Okt 2013", label: "Berdiri",    nama: "Rahmat Irawan S.T.",    ket: "Ketua pertama HIMTI UNA",            foto: "/himti-una/images/people/rahmat-irawan.jpg" },
  { periode: "2019–2020",  label: "Periode II", nama: "Dermawan S.Kom",        ket: "",                                    foto: "" },
  { periode: "2020–2021",  label: "Periode III", nama: "Reza Fahlevi S.Kom",    ket: "PJ Kahim",                           foto: "/himti-una/images/people/reza-fahlevi.jpg" },
  { periode: "2021–2022",  label: "Periode IV",  nama: "Ibnu Haykal Lubis S.Kom",     ket: "Bergabung PERMIKOMNAS, 16 Des 2021", foto: "/himti-una/images/people/ibnu-haykal-lubis.jpg" },
  { periode: "2022–2023",  label: "Periode V",   nama: "Mhd Zikri Ansyari",    ket: "",                                   foto: "/himti-una/images/people/mhd-zikri-ansyari.jpg" },
  { periode: "2023–2024",  label: "Periode VI",  nama: "Muhammad Fikri Gunawan", ket: "",     foto: "" },
  { periode: "2023–2024",  label: "Periode VI",  nama: "Mhd Risky, S.Kom.", ket: "PJ Kahim",     foto: "/himti-una/images/people/mhdrisky.jpg" },
  { periode: "2024–2025",  label: "Periode VII", nama: "Bintang Fajar R Putra", ket: "",                              foto: "/himti-una/images/people/bintang-fajar-r-putra.jpg" },
]

export default function Sejarah() {
  const ref = useReveal()

  return (
    <section id="sejarah" ref={ref} className="section" style={{ background: "var(--surface)" }}>
      <div className="wrap">
        <div className="sejarah-grid">

          {/* Sidebar kiri */}
          <div>
            <h2 className="head reveal">Sejarah<br />HIMTI</h2>
            <img src="/himti-una/images/logos/logo-himti.svg" alt="" aria-hidden className="section-logo" />
            <p className="reveal muted" style={{ ["--d" as string]: "100ms" }}>
              Berdiri <strong style={{ color: "var(--ink)" }}>1 Oktober 2013</strong>. Bergabung PERMIKOMNAS
              pada <strong style={{ color: "var(--ink)" }}>16 Desember 2021</strong> dalam Musyawarah
              Wilayah 1 Aceh-Sumut di Universitas Malikussaleh, Lhokseumawe.
            </p>
          </div>

          {/* Timeline */}
          <ol className="timeline-list">
            <div className="timeline-line" aria-hidden />
            {KETUA.map((k, i) => (
              <li key={`${k.periode}-${k.nama}`} className="reveal timeline-item" style={{ ["--d" as string]: `${i * 80}ms` }}>

                {/* Tanggal + dot */}
                <div className="timeline-date">
                  <span>{k.periode}</span>
                  <div className="timeline-dot" style={{
                    background: i === KETUA.length - 1 ? "var(--accent)" : "var(--muted-2)",
                  }} />
                </div>

                {/* Foto + info */}
                <div className="timeline-body">
                  {k.foto ? (
                    <img
                      src={k.foto}
                      alt={k.nama}
                      loading="lazy"
                      className="timeline-foto"
                    />
                  ) : (
                    <div className="timeline-foto timeline-foto-empty" aria-hidden="true" />
                  )}
                  <div>
                    <p className="timeline-label">{k.label}</p>
                    <p className="timeline-nama">{k.nama}</p>
                    {k.ket && <p className="timeline-ket">{k.ket}</p>}
                  </div>
                </div>

              </li>
            ))}
          </ol>

        </div>
      </div>

      <style>{`
        .sejarah-grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: clamp(2rem, 7vw, 7rem);
          align-items: start;
        }
        .timeline-list {
          list-style: none;
          padding: 0;
          margin: 0;
          position: relative;
        }
        .timeline-item {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          padding-bottom: 2.5rem;
          position: relative;
        }
        .timeline-item:last-child { padding-bottom: 0; }
        .timeline-date {
          min-width: 88px;
          text-align: right;
          padding-right: 2rem;
          position: relative;
          flex-shrink: 0;
        }
        .timeline-date span {
          font-size: var(--step-xs);
          color: var(--muted);
          font-weight: 600;
          display: block;
          padding-top: 4px;
        }
        .timeline-dot {
          position: absolute;
          left: 83px;
          top: 6px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        .timeline-body {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }
        .timeline-foto {
          width: 96px;
          height: 96px;
          border-radius: 10px;
          object-fit: cover;
          flex-shrink: 0;
          background: var(--surface-2);
        }
        .timeline-label {
          font-size: var(--step-xs);
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 0.2rem;
          font-weight: 700;
        }
        .timeline-nama {
          font-weight: 800;
          font-size: var(--step-lg);
          line-height: 1.05;
          letter-spacing: -0.02em;
        }
        .timeline-ket {
          font-size: var(--step-xs);
          color: var(--muted);
          margin-top: 0.25rem;
        }

        /* Mobile */
        @media (max-width: 48em) {
          .sejarah-grid {
            grid-template-columns: 1fr !important;
          }
          .timeline-line {
            left: 0 !important;
          }
          .timeline-item {
            flex-direction: column;
            gap: 0.75rem;
            padding-left: 1rem;
          }
          .timeline-date {
            min-width: unset;
            text-align: left;
            padding-right: 0;
            padding-left: 0.5rem;
          }
          .timeline-dot {
            left: -1.25rem;
            top: 6px;
          }
          .timeline-foto {
            width: 120px;
            height: 120px;
          }
          .timeline-nama {
            font-size: var(--step-md);
          }
        }
      `}</style>
    </section>
  )
}
