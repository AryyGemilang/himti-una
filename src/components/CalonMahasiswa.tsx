const UNA_WEBSITE = "https://una.ac.id/"
const PMB_WEBSITE = "https://pmb.una.ac.id/"

export default function CalonMahasiswa() {
  return (
    <section id="calon-mahasiswa" className="section calon-section">
      <div className="wrap">
        <header className="calon-heading">
          <div className="calon-emblem">
            <img src="/himti-una/images/logos/logo-una.svg" alt="Logo Universitas Asahan" />
          </div>
          <h2>Ayo Daftar Jadi Mahasiswa Universitas Asahan Kenali Teknik Informatika UNA!</h2>
          <p className="calon-lead">
            Tertarik dengan pemrograman, teknologi digital, dan pengembangan perangkat lunak?
            Kenali bagaimana Teknik Informatika membantu mengubah ide menjadi solusi dan inovasi.
          </p>
        </header>

        <div className="calon-details">
          <div>
            <h3>Belajar memahami dan membangun teknologi.</h3>
          </div>
          <div className="calon-copy">
            <p>
              Teknik Informatika berhubungan dengan cara merancang perangkat lunak, memahami
              teknologi digital, dan menggunakan pemrograman untuk menyusun solusi.
            </p>
            <ul className="calon-topics">
              <li>Pemrograman dan logika</li>
              <li>Pengembangan perangkat lunak</li>
              <li>Teknologi dan inovasi digital</li>
            </ul>
          </div>
        </div>

        <div className="calon-actions">
          <a className="btn" href={PMB_WEBSITE} target="_blank" rel="noopener noreferrer">
            Daftar jadi Mahasiswa Una <span aria-hidden="true">↗</span>
          </a>
          <a className="btn btn-ghost" href={UNA_WEBSITE} target="_blank" rel="noopener noreferrer">
            Website Resmi Universitas Asahan
          </a>
        </div>
      </div>

      <style>{`
        .calon-section { background: var(--page-bg); overflow: hidden; }
        .calon-heading { max-width: 58rem; margin-inline: auto; text-align: center; }
        .calon-emblem {
          width: clamp(9rem, 18vw, 13rem); aspect-ratio: 1; margin: 1.5rem auto 2rem;
          display: grid; place-items: center; border: 1px solid var(--border); border-radius: 50%;
          background: var(--surface); box-shadow: 0 18px 55px var(--shadow);
        }
        .calon-emblem img { display: block; width: 64%; height: auto; object-fit: contain; }
        .calon-heading h2 { max-width: 31ch; margin: 0 auto; font-size: clamp(2rem, 4.2vw, 3.6rem); font-weight: 850; line-height: 1.02; letter-spacing: -0.035em; text-wrap: balance; }
        .calon-lead { max-width: 61ch; margin: 1.25rem auto 0; color: var(--muted); font-size: var(--step-md); }
        .calon-details { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(2rem, 8vw, 8rem); margin: clamp(3rem, 7vw, 6rem) auto 0; padding-block: 2rem; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .calon-details h3 { max-width: 16ch; margin-top: 0.75rem; font-size: clamp(1.5rem, 2.7vw, 2.25rem); line-height: 1.05; letter-spacing: -0.035em; }
        .calon-copy { max-width: 60ch; color: var(--muted); }
        .calon-topics { margin-top: 1.5rem; border-top: 1px solid var(--border); }
        .calon-topics li { padding: 0.8rem 0; border-bottom: 1px solid var(--border); color: var(--ink); font-weight: 700; }
        .calon-actions { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.85rem; margin-top: 2rem; }
        .calon-actions .btn { min-height: 3rem; }
        @media (max-width: 48em) {
          .calon-emblem { width: clamp(9rem, 42vw, 11rem); margin-block: 1.25rem 1.5rem; }
          .calon-heading h2 { max-width: 20ch; font-size: clamp(1.9rem, 8.8vw, 2.8rem); }
          .calon-lead { max-width: 42ch; }
          .calon-details { grid-template-columns: 1fr; gap: 1.25rem; margin-top: 2.5rem; padding-block: 1.5rem; }
          .calon-details h3 { max-width: 20ch; }
          .calon-actions { flex-direction: column; align-items: stretch; }
          .calon-actions .btn { width: 100%; min-height: 3rem; justify-content: center; white-space: normal; text-align: center; }
        }
      `}</style>
    </section>
  )
}
