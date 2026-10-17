const INFO_EMAIL = "mailto:email-resmi@una.ac.id?subject=Informasi%20Pendaftaran%20Teknik%20Informatika"
const UNA_WEBSITE = "https://una.ac.id/"

export default function PendaftaranPage() {
  return (
    <main className="admission-page">
      <section className="admission-hero">
        <div className="wrap admission-hero-content">
          <p className="label">Teknik Informatika · Universitas Asahan</p>
          <div className="admission-emblem">
            <span className="admission-emblem-ring" aria-hidden="true" />
            <img src="/himti-una/images/logos/logo-una.svg" alt="Logo Universitas Asahan" />
          </div>
          <h1 className="admission-title">
            Ayo Daftar Menjadi Mahasiswa Teknik Informatika Universitas Asahan!
          </h1>
          <p className="admission-lead">
            Kenali dunia teknologi, pemrograman, dan inovasi digital bersama komunitas mahasiswa
            Teknik Informatika.
          </p>
          <div className="admission-actions">
            <a className="btn" href={INFO_EMAIL}>Informasi Pendaftaran <span aria-hidden="true">↗</span></a>
            <a className="btn btn-ghost" href={UNA_WEBSITE} target="_blank" rel="noopener noreferrer">
              Kunjungi Website Universitas Asahan
            </a>
          </div>
        </div>
      </section>

      <section className="section admission-about">
        <div className="wrap admission-about-grid">
          <div className="admission-about-heading">
            <p className="label">Mengenal bidangnya</p>
            <h2 className="head">Teknologi untuk memecahkan masalah</h2>
          </div>
          <div className="admission-about-copy">
            <p>
              Teknik Informatika berhubungan dengan cara merancang perangkat lunak, memahami
              teknologi digital, dan menggunakan pemrograman untuk menyusun solusi.
            </p>
            <p>
              Bidang ini cocok untuk kamu yang ingin mengenal proses di balik aplikasi dan layanan
              digital, serta senang belajar melalui logika dan eksplorasi ide.
            </p>
            <ul className="admission-topics">
              <li><span>01</span><span>Pemrograman dan logika</span></li>
              <li><span>02</span><span>Perancangan perangkat lunak</span></li>
              <li><span>03</span><span>Teknologi dan inovasi digital</span></li>
              <li><span>04</span><span>Pemecahan masalah</span></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="admission-next">
        <div className="wrap admission-next-content">
          <p className="label">Langkah berikutnya</p>
          <h2>Mulai dengan mencari informasi resmi.</h2>
          <p>
            Tanyakan jadwal, persyaratan, dan proses pendaftaran langsung kepada Universitas Asahan.
            Untuk mengenal komunitas mahasiswa, lanjutkan menjelajahi website HIMTI UNA.
          </p>
          <div className="admission-actions">
            <a className="btn admission-contact-btn" href={INFO_EMAIL}>Tanyakan Pendaftaran <span aria-hidden="true">↗</span></a>
            <a className="admission-back-link" href="/#pengurus">Kenali komunitas HIMTI UNA <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <style>{`
        .admission-page { position: relative; z-index: 1; }
        .admission-hero {
          padding-block: clamp(8rem, 13vw, 11rem) clamp(5rem, 9vw, 8rem);
          text-align: center;
          background: radial-gradient(ellipse at 50% 35%, var(--surface-2) 0, var(--page-bg) 58%);
        }
        .admission-hero-content { display: flex; flex-direction: column; align-items: center; }
        .admission-emblem {
          width: clamp(12rem, 24vw, 18rem);
          aspect-ratio: 1;
          margin-block: clamp(1.75rem, 4vw, 3rem);
          display: grid;
          place-items: center;
          position: relative;
          isolation: isolate;
          border: 1px solid var(--border);
          border-radius: 50%;
          background: var(--surface);
          box-shadow: 0 20px 70px var(--shadow);
        }
        .admission-emblem-ring {
          position: absolute;
          inset: 0.55rem;
          z-index: -1;
          border: 1px solid var(--border);
          border-radius: 50%;
        }
        .admission-emblem img { width: 62%; height: auto; object-fit: contain; }
        .admission-title {
          max-width: 19ch;
          font-size: clamp(2.4rem, 5.6vw, 5rem);
          font-weight: 850;
          line-height: 0.98;
          letter-spacing: -0.05em;
          text-wrap: balance;
        }
        .admission-lead { max-width: 55ch; margin-top: 1.25rem; color: var(--muted); font-size: var(--step-lg); }
        .admission-actions { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; gap: 0.85rem; margin-top: 2rem; }
        .admission-actions .btn { min-height: 3rem; }
        .admission-about { background: var(--surface); }
        .admission-about-grid { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(2.5rem, 8vw, 9rem); align-items: start; }
        .admission-about-heading .head { max-width: 12ch; margin-top: 1rem; }
        .admission-about-copy { max-width: 60ch; color: var(--muted); }
        .admission-about-copy p + p { margin-top: 1rem; }
        .admission-topics { margin-top: 2rem; border-top: 1px solid var(--border); }
        .admission-topics li { display: grid; grid-template-columns: 3rem 1fr; gap: 1rem; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border); }
        .admission-topics li span:first-child { color: var(--accent-strong); font-size: var(--step-xs); font-weight: 800; letter-spacing: 0.12em; }
        .admission-topics li span:last-child { color: var(--ink); font-weight: 700; }
        .admission-next { padding-block: clamp(4rem, 8vw, 7rem); background: var(--accent); color: var(--accent-ink); }
        .admission-next-content { max-width: 900px; text-align: center; }
        .admission-next .label { color: var(--accent-ink); opacity: 0.72; }
        .admission-next h2 { max-width: 18ch; margin: 0.75rem auto 0; font-size: clamp(2rem, 4.5vw, 4rem); font-weight: 850; line-height: 1; letter-spacing: -0.045em; text-wrap: balance; }
        .admission-next p:not(.label) { max-width: 55ch; margin: 1rem auto 0; color: var(--accent-ink); }
        .admission-contact-btn { background: var(--surface); color: var(--ink); }
        .admission-contact-btn:hover { background: var(--surface-2) !important; }
        .admission-back-link { min-height: 44px; display: inline-flex; align-items: center; gap: 0.45rem; font-size: var(--step-sm); font-weight: 700; text-decoration-thickness: 1px; text-underline-offset: 0.25em; }
        @media (max-width: 48em) {
          .admission-hero { padding-block: 7.25rem 4.5rem; }
          .admission-emblem { width: clamp(11rem, 52vw, 15rem); margin-block: 1.5rem 2rem; }
          .admission-title { max-width: 16ch; font-size: clamp(2.25rem, 10vw, 3.75rem); }
          .admission-lead { max-width: 38ch; font-size: var(--step-md); }
          .admission-actions { width: 100%; flex-direction: column; align-items: stretch; }
          .admission-actions .btn { width: 100%; justify-content: center; white-space: normal; text-align: center; }
          .admission-about-grid { grid-template-columns: 1fr; gap: 2rem; }
          .admission-about-heading .head { max-width: 14ch; }
          .admission-next h2 { max-width: 15ch; }
        }
      `}</style>
    </main>
  )
}
