import { Mail, MapPin } from "lucide-react"

const CURRENT_YEAR = new Date().getFullYear()
const LETTERS = "HIMTI".split("")
const HEIGHTS = [85, 100, 92, 76, 95]
const UNA_L   = "UNA".split("")
const UNA_H   = [80, 100, 70]

const NAV = [
  ["Beranda","/#beranda"],["Tentang","/#tentang"],["Sejarah","/#sejarah"],
  ["Visi Misi","/#visimisi"],["Pengurus","/#pengurus"],["Kegiatan","/#kegiatan"],["Kontak","/#kontak"],
  ["Calon Mahasiswa Baru","/#calon-mahasiswa"],
]

const SOCIAL_LINKS = [
  {
    label: "Instagram HIMTI UNA",
    href: "https://www.instagram.com/himtiuna_?utm_source=ig_web_button_share_sheet&dlrf=ZDNlZDc0MzIxNw==",
    icon: (
      <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.8" r=".8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "TikTok HIMTI UNA",
    href: "https://www.tiktok.com/@himtiuna_?is_from_webapp=1&sender_device=pc",
    icon: (
      <svg aria-hidden width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.6 7.1a6.7 6.7 0 0 1-4.1-1.4v8.1a6.2 6.2 0 1 1-5.4-6.1v3.4a2.9 2.9 0 1 0 2.1 2.8V2.8h3.3c.2 2 1.8 3.6 4.1 3.9v.4Z" />
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)" }}>

      {/* Mark band */}
      <div className="wrap" style={{ paddingTop: "5rem", paddingBottom: "2rem" }}>
        <div className="mark-band reveal" style={{ height: "clamp(56px, 12vw, 140px)" }} aria-hidden>
          {LETTERS.map((l, i) => (
            <div key={i} className="mark-letter" style={{
              height: `${HEIGHTS[i]}%`,
              width: "clamp(36px, 7vw, 88px)",
              fontSize: "clamp(1rem, 3.5vw, 3.5rem)",
            }}>{l}</div>
          ))}
          <div style={{ width: "clamp(8px, 1.5vw, 20px)" }} />
          {UNA_L.map((l, i) => (
            <div key={`u${i}`} className="mark-letter" style={{
              height: `${UNA_H[i]}%`,
              width: "clamp(36px, 7vw, 88px)",
              fontSize: "clamp(1rem, 3.5vw, 3.5rem)",
              background: "var(--accent-dim)",
              color: "var(--accent-strong)",
            }}>{l}</div>
          ))}
        </div>
        <p className="sr-only">HIMTI UNA — Himpunan Mahasiswa Teknik Informatika Universitas Asahan</p>
      </div>

      {/* Links row */}
      <div className="wrap" style={{ paddingBottom: "4rem" }}>
        <div className="footer-grid">

          <div>
            <div className="footer-brand-logos">
              <img src="/himti-una/images/logos/logo-himti.svg" alt="Logo HIMTI" className="footer-brand-logo" />
              <a href="https://una.ac.id/" aria-label="Kunjungi website resmi Universitas Asahan (una.ac.id)" className="una-logo-link">
                <img src="/himti-una/images/logos/logo-una.svg" alt="Logo Universitas Asahan" className="footer-brand-logo" />
              </a>
            </div>
            <p style={{ fontSize: "var(--step-sm)", color: "var(--muted)", maxWidth: "36ch", margin: 0 }}>
              Himpunan Mahasiswa Teknik Informatika Universitas Asahan, wadah aspirasi,
              prestasi, dan inovasi mahasiswa IT sejak 1 Oktober 2013.
            </p>
          </div>

          <div>
            <p className="label" style={{ marginBottom: "1.25rem" }}>Navigasi</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {NAV.map(([l, h]) => (
                <li key={h}>
                  <a href={h} style={{ fontSize: "var(--step-sm)", color: "var(--muted)", textDecoration: "none", transition: "color 160ms ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--muted)" }}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label" style={{ marginBottom: "1.25rem" }}>Lokasi</p>
            <address className="footer-address">
              Fakultas Teknik<br />Universitas Asahan<br />Kisaran, Sumatera Utara<br />
              Jl. Jend. A. Yani, Kisaran Naga, Kec. Kota Kisaran Timur, Kisaran, Sumatera Utara 21216
            </address>
            <a className="footer-info-link" href="https://www.google.com/maps/place/Universitas+Asahan+(UNA)/@2.9662091,99.6219396,17z/data=!3m1!4b1!4m6!3m5!1s0x3032495abfd9eb8d:0x9473c0d893d71d28!8m2!3d2.9662091!4d99.6219396!16s%2Fg%2F1hm5b9k0x?authuser=0&entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
              <MapPin aria-hidden size={16} /> Lihat lokasi
            </a>
          </div>

          <div>
            <p className="label" style={{ marginBottom: "1.25rem" }}>Hubungi</p>
            <a className="footer-info-link" href="mailto:himti.universitasasahan@gmail.com">
              <Mail aria-hidden size={16} /> Email HIMTI UNA
            </a>
            <div className="footer-socials" aria-label="Media sosial HIMTI UNA">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
                  {icon}
                </a>
              ))}
            </div>
            <p className="footer-developer-label">Contact Developer</p>
            <a className="footer-developer-link" href="mailto:aryagemilangsinuhaji@gmail.com">
              aryagemilangsinuhaji@gmail.com
            </a>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p style={{ fontSize: "var(--step-xs)", color: "var(--muted-2)", margin: 0 }}>
            © {CURRENT_YEAR} HIMTI Universitas Asahan
          </p>
          <a href="/#beranda" className="btn" style={{ fontSize: "var(--step-xs)", minHeight: "2.25rem", padding: "0 1.1rem" }}>
            Kembali ke atas
          </a>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: minmax(0, 2fr) repeat(3, minmax(0, 1fr));
          gap: 3rem;
          padding-top: 2.5rem;
        }
        .footer-address {
          margin: 0 0 0.75rem;
          color: var(--muted);
          font-size: var(--step-sm);
          font-style: normal;
          line-height: 1.7;
          overflow-wrap: anywhere;
        }
        .footer-info-link {
          display: inline-flex;
          min-height: 2.75rem;
          align-items: center;
          gap: 0.55rem;
          color: var(--muted);
          font-size: var(--step-sm);
          text-decoration: none;
          overflow-wrap: anywhere;
          transition: color 160ms ease;
        }
        .footer-info-link:hover, .footer-info-link:focus-visible,
        .footer-developer-link:hover, .footer-developer-link:focus-visible { color: var(--ink); }
        .footer-info-link:focus-visible, .footer-socials a:focus-visible,
        .footer-developer-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        .footer-socials { display: flex; gap: 0.5rem; margin: 0.25rem 0 1.25rem; }
        .footer-socials a {
          display: inline-flex;
          width: 2.75rem;
          height: 2.75rem;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          border-radius: 50%;
          transition: color 160ms ease, background 160ms ease;
        }
        .footer-socials a:hover, .footer-socials a:focus-visible {
          color: var(--accent-strong);
          background: var(--accent-dim);
        }
        .footer-developer-label { margin: 0 0 0.35rem; color: var(--muted-2); font-size: var(--step-xs); }
        .footer-developer-link { color: var(--muted); font-size: var(--step-xs); overflow-wrap: anywhere; text-underline-offset: 0.2em; }
        .footer-brand-logos {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 1.25rem;
        }
        .footer-brand-logo {
          width: auto;
          height: clamp(3.75rem, 6vw, 5rem);
          max-width: 7rem;
          object-fit: contain;
        }
        .footer-bottom {
          margin-top: 3rem;
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        @media (max-width: 48em) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .footer-brand-logos { gap: 1rem; }
          .footer-brand-logo { height: clamp(3.5rem, 16vw, 4.25rem); max-width: 6rem; }
        }
        @media (min-width: 48.01em) and (max-width: 64em) {
          .footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2rem; }
        }
      `}</style>
    </footer>
  )
}
