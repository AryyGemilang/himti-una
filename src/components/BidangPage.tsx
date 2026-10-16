import { useReveal } from "../hooks/useReveal"
import Foto from "./Foto"
import type { BidangDetail } from "../data/bidang"
import { bidangList } from "../data/bidang"

export default function BidangPage({ bidang }: { bidang: BidangDetail }) {
  const ref = useReveal()
  const idx = bidangList.findIndex(b => b.slug === bidang.slug)
  const prev = idx > 0 ? bidangList[idx - 1] : null
  const next = idx < bidangList.length - 1 ? bidangList[idx + 1] : null

  return (
    <main ref={ref} className="bidang-page">

      {/* ── Section A+B: Hero bidang ── */}
      <section className="bidang-hero">
        <div className="wrap">

          <a href="/#pengurus" className="bidang-back">
            <span aria-hidden>←</span> Kembali ke Pengurus
          </a>

          <div className="bidang-hero-top reveal">
            <img src="/himti-una/Logo-Himti.svg" alt="Logo HIMTI UNA" className="bidang-hero-logo" />
            <img src="/himti-una/Logo-Una.svg" alt="Logo Universitas Asahan" className="bidang-hero-logo-2" />
          </div>

          <p className="label reveal">Bidang Organisasi</p>
          <h1 className="head reveal bidang-hero-title" style={{ ["--d" as string]: "80ms" }}>
            {bidang.nama}
          </h1>
          <img
            src="/himti-una/Logo-Himti.svg"
            alt="" aria-hidden
            className="section-logo reveal"
            style={{ ["--d" as string]: "120ms" }}
          />
          <p className="reveal muted bidang-hero-desc" style={{ ["--d" as string]: "160ms" }}>
            {bidang.deskripsi}
          </p>

        </div>
      </section>

      {/* ── Section C: Struktur organisasi ── */}
      <section className="section bidang-section">
        <div className="wrap">
          <h2 className="head reveal">Struktur<br />Bidang</h2>
          <img src="/himti-una/Logo-Himti.svg" alt="" aria-hidden className="section-logo" />

          {/* Kepala bidang */}
          <div className="bidang-head-card reveal bezel">
            <div className="bezel-inner bidang-head-inner">
              <Foto
                src={bidang.head.foto}
                alt={`${bidang.head.jabatan}, ${bidang.head.nama}`}
                style={{ width: 160, height: 160, borderRadius: "50%", objectFit: "cover", display: "block", flexShrink: 0 }}
              />
              <div>
                <p className="label">Kepala Bidang</p>
                <p className="bidang-head-nama">{bidang.head.nama}</p>
                <p className="bidang-head-jabatan">{bidang.head.jabatan}</p>
              </div>
            </div>
          </div>

          {/* Anggota */}
          <h3 className="reveal bidang-subhead">Anggota Bidang</h3>
          {bidang.anggota.length > 0 ? (
            <div className="bidang-anggota-grid">
              {bidang.anggota.map((a, i) => (
                <div key={i} className="reveal bezel" style={{ ["--d" as string]: `${i * 60}ms` }}>
                  <div className="bezel-inner bidang-anggota-inner">
                    <Foto
                      src={a.foto}
                      alt={`${a.jabatan}, ${a.nama}`}
                      style={{ width: 96, height: 96, borderRadius: "50%", objectFit: "cover", display: "block" }}
                    />
                    <p className="bidang-anggota-nama">{a.nama}</p>
                    <p className="bidang-anggota-jabatan">{a.jabatan}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bidang-empty reveal">
              <p>Data anggota bidang ini belum tersedia.</p>
              <p className="muted">Informasi akan dilengkapi setelah data kepengurusan resmi diperbarui.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Section D: Tugas & Fungsi ── */}
      <section className="section bidang-section bidang-section-alt">
        <div className="wrap">
          <h2 className="head reveal">Tugas &<br />Fungsi</h2>
          <img src="/himti-una/Logo-Himti.svg" alt="" aria-hidden className="section-logo" />

          <ul className="bidang-tugas">
            {bidang.tugas.map((t, i) => (
              <li key={i} className="reveal bezel" style={{ ["--d" as string]: `${i * 100}ms` }}>
                <div className="bezel-inner bidang-tugas-inner">
                  <span className="bidang-tugas-num" aria-hidden>{i + 1}</span>
                  <p>{t}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="bidang-disclaimer reveal">
            Uraian di atas merupakan deskripsi fungsi umum bidang, bukan ketetapan resmi organisasi.
          </p>
        </div>
      </section>

      {/* ── Section E: Dokumentasi ── */}
      <section className="section bidang-section">
        <div className="wrap">
          <h2 className="head reveal">Dokumentasi<br />Kegiatan</h2>
          <img src="/himti-una/Logo-Himti.svg" alt="" aria-hidden className="section-logo" />

          {bidang.galeri.length > 0 ? (
            <div className="bidang-galeri">
              {bidang.galeri.map((g, i) => (
                <figure key={i} className="reveal" style={{ ["--d" as string]: `${i * 60}ms` }}>
                  <img src={g.foto} alt={g.caption || `Dokumentasi ${bidang.nama}`} loading="lazy" />
                  {g.caption && (
                    <figcaption>
                      <span className="bidang-caption-judul">{g.caption}</span>
                      {g.tanggal && <span className="bidang-caption-tanggal">{g.tanggal}</span>}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <div className="bidang-empty reveal">
              <p>Belum ada foto dokumentasi untuk bidang ini.</p>
              <p className="muted">Galeri siap diisi setelah foto kegiatan tersedia.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Section F: Navigasi lanjutan ── */}
      <section className="bidang-nav-section">
        <div className="wrap bidang-nav">
          {prev ? (
            <a href={`/bidang/${prev.slug}/`} className="bidang-nav-link">
              <span className="bidang-nav-label">← Sebelumnya</span>
              <span className="bidang-nav-nama">{prev.namaPendek}</span>
            </a>
          ) : <span />}
          {next ? (
            <a href={`/bidang/${next.slug}/`} className="bidang-nav-link bidang-nav-link-right">
              <span className="bidang-nav-label">Berikutnya →</span>
              <span className="bidang-nav-nama">{next.namaPendek}</span>
            </a>
          ) : <span />}
        </div>
      </section>

      <style>{`
        .bidang-page { position: relative; z-index: 1; }

        .bidang-hero {
          padding-block: clamp(7rem, 14vw, 11rem) clamp(3rem, 8vw, 6rem);
          position: relative;
        }
        .bidang-back {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: var(--step-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          text-decoration: none;
          padding: 0.6rem 0;
          min-height: 44px;
          margin-bottom: 2rem;
          transition: color 160ms ease;
        }
        .bidang-back:hover { color: var(--accent); }
        .bidang-hero-top {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .bidang-hero-logo { height: 72px; width: auto; object-fit: contain; }
        .bidang-hero-logo-2 { height: 60px; width: auto; object-fit: contain; opacity: 0.85; }
        .bidang-hero-title { margin-top: 1rem; }
        .bidang-hero-desc { max-width: 55ch; font-size: var(--step-lg); line-height: 1.5; margin-top: 0.5rem; }

        .bidang-section-alt { background: var(--surface); }

        .bidang-head-card { max-width: 640px; margin-bottom: 3rem; }
        .bidang-head-inner {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 2rem;
        }
        .bidang-head-nama {
          font-weight: 800;
          font-size: var(--step-xl);
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-top: 0.4rem;
        }
        .bidang-head-jabatan {
          font-size: var(--step-sm);
          color: var(--muted);
          margin-top: 0.3rem;
        }
        .bidang-subhead {
          font-weight: 800;
          font-size: var(--step-lg);
          text-transform: uppercase;
          letter-spacing: -0.025em;
          margin-bottom: 1.5rem;
        }
        .bidang-anggota-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: var(--gap);
        }
        .bidang-anggota-inner {
          padding: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }
        .bidang-anggota-nama { font-weight: 800; font-size: var(--step-md); line-height: 1.1; }
        .bidang-anggota-jabatan { font-size: var(--step-xs); color: var(--muted); }

        .bidang-tugas {
          list-style: none;
          padding: 0;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--gap);
        }
        .bidang-tugas-inner {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
        }
        .bidang-tugas-num {
          flex-shrink: 0;
          width: 34px; height: 34px;
          border-radius: 50%;
          background: var(--accent);
          color: var(--accent-ink);
          font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          font-size: var(--step-sm);
        }
        .bidang-tugas p { color: var(--muted); font-size: var(--step-sm); margin: 0; }
        .bidang-disclaimer {
          margin-top: 1.5rem;
          font-size: var(--step-xs);
          color: var(--muted);
          font-style: italic;
        }

        .bidang-galeri {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: var(--gap);
        }
        .bidang-galeri figure { margin: 0; }
        .bidang-galeri img {
          width: 100%;
          aspect-ratio: 4 / 3;
          object-fit: cover;
          border-radius: var(--r-card);
          display: block;
        }
        .bidang-galeri figcaption {
          display: flex;
          justify-content: space-between;
          gap: 0.5rem;
          margin-top: 0.5rem;
          font-size: var(--step-xs);
        }
        .bidang-caption-judul { color: var(--ink); font-weight: 600; }
        .bidang-caption-tanggal { color: var(--muted); }

        .bidang-empty {
          padding: 2.5rem;
          background: var(--surface-2);
          border-radius: var(--r-card);
          text-align: center;
        }
        .bidang-empty p { margin: 0 auto; font-size: var(--step-sm); }
        .bidang-empty p + p { margin-top: 0.4rem; }

        .bidang-nav-section {
          border-top: 1px solid rgba(255,255,255,0.06); /* taste-skill-ignore — section divider */
          padding-block: 3rem;
        }
        .bidang-nav {
          display: flex;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .bidang-nav-link {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          text-decoration: none;
          padding: 0.75rem 0;
          transition: color 160ms ease;
        }
        .bidang-nav-link-right { text-align: right; }
        .bidang-nav-label {
          font-size: var(--step-xs);
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }
        .bidang-nav-nama {
          font-weight: 800;
          font-size: var(--step-lg);
          text-transform: uppercase;
          letter-spacing: -0.02em;
          color: var(--ink);
        }
        .bidang-nav-link:hover .bidang-nav-nama { color: var(--accent); }

        @media (max-width: 48em) {
          .bidang-hero-logo { height: 52px; }
          .bidang-hero-logo-2 { height: 44px; }
          .bidang-head-inner {
            flex-direction: column;
            text-align: center;
            gap: 1.25rem;
            padding: 1.75rem;
          }
          .bidang-head-nama { font-size: var(--step-lg); }
          .bidang-head-card { margin-bottom: 2rem; }
          .bidang-tugas { grid-template-columns: 1fr; }
          .bidang-galeri { grid-template-columns: 1fr; }
          .bidang-nav { flex-direction: column; gap: 0.5rem; }
          .bidang-nav-link-right { text-align: left; }
        }
      `}</style>
    </main>
  )
}
