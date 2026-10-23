import { useEffect, useState } from "react"
import { ArrowUp, Mail, MapPin } from "lucide-react"
import { bidangList } from "../data/bidang"
import { subscribeToScroll } from "../lib/scroll"

const CURRENT_YEAR = new Date().getFullYear()
const BACK_TO_TOP_THRESHOLD = 320
const MAP_URL = "https://www.google.com/maps/place/Universitas+Asahan+(UNA)/@2.9662091,99.6219396,17z/data=!3m1!4b1!4m6!3m5!1s0x3032495abfd9eb8d:0x9473c0d893d71d28!8m2!3d2.9662091!4d99.6219396!16s%2Fg%2F1hm5b9k0x?authuser=0&entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D"

const NAV = [
  ["Beranda", "/"],
  ["Tentang Kami", "/tentang"],
  ["Sejarah", "/sejarah"],
  ["Visi Misi", "/visi-misi"],
  ["Kepengurusan", "/pengurus"],
  ["Kegiatan", "/kegiatan"],
  ["Kontak", "/kontak"],
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
  const [showBackToTop, setShowBackToTop] = useState(() => window.scrollY > BACK_TO_TOP_THRESHOLD)

  useEffect(() => {
    return subscribeToScroll(({ y }) => {
      const shouldShow = y > BACK_TO_TOP_THRESHOLD
      setShowBackToTop(current => current === shouldShow ? current : shouldShow)
    })
  }, [])

  return (
    <footer className="site-footer">
      <div className="wrap site-footer-wrap">
        <div className="footer-grid">
          <section className="footer-brand" aria-labelledby="footer-brand-title">
            <div className="footer-brand-heading">
              <img src="/himti-una/images/branding/logo-himti.webp" alt="Logo HIMTI UNA" className="footer-brand-logo" />
              <div>
                <h2 id="footer-brand-title">HIMTI UNA</h2>
                <p>Himpunan Mahasiswa Teknik Informatika</p>
              </div>
            </div>
            <p className="footer-description">
              Himpunan Mahasiswa Teknik Informatika Universitas Asahan, wadah aspirasi,
              prestasi, dan inovasi mahasiswa sejak 1 Oktober 2013.
            </p>
            <div className="footer-socials" aria-label="Media sosial HIMTI UNA">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label}>
                  {icon}
                </a>
              ))}
            </div>
          </section>

          <nav className="footer-column" aria-label="Navigasi utama">
            <h2 className="footer-column-title">Navigasi Utama</h2>
            <ul>
              {NAV.map(([label, href]) => (
                <li key={href}><a href={href}>{label}</a></li>
              ))}
            </ul>
          </nav>

          <nav className="footer-column" aria-label="Divisi HIMTI UNA">
            <h2 className="footer-column-title">Divisi</h2>
            <ul>
              {bidangList.map(({ slug, namaPendek }) => (
                <li key={slug}><a href={`/divisi/${slug}/`}>{namaPendek}</a></li>
              ))}
            </ul>
          </nav>

          <section className="footer-contact" aria-labelledby="footer-contact-title">
            <h2 className="footer-column-title" id="footer-contact-title">Hubungi Kami</h2>
            <a className="footer-contact-card" href={MAP_URL} target="_blank" rel="noopener noreferrer">
              <span className="footer-contact-icon"><MapPin aria-hidden size={22} /></span>
              <span className="footer-contact-copy">
                <small>Sekretariat</small>
                <strong>Fakultas Teknik, Universitas Asahan<br />Kisaran, Sumatera Utara 21216</strong>
                <span>Lihat lokasi di peta ↗</span>
              </span>
            </a>
            <a className="footer-contact-card" href="mailto:himti.universitasasahan@gmail.com">
              <span className="footer-contact-icon"><Mail aria-hidden size={22} /></span>
              <span className="footer-contact-copy">
                <small>Email Resmi</small>
                <strong>himti.universitasasahan@gmail.com</strong>
              </span>
            </a>
            <p className="footer-developer">
              Contact Developer: <a href="mailto:aryagemilangsinuhaji@gmail.com">aryagemilangsinuhaji@gmail.com</a>
            </p>
          </section>
        </div>

        <div className="footer-bottom">
          <p>© {CURRENT_YEAR} HIMTI Universitas Asahan. All rights reserved.</p>
          <p>Himpunan Mahasiswa Teknik Informatika Universitas Asahan</p>
        </div>
      </div>

      <button
        type="button"
        className={`footer-back-to-top${showBackToTop ? " is-visible" : ""}`}
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
        aria-hidden={!showBackToTop}
        tabIndex={showBackToTop ? 0 : -1}
        onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
      >
        <ArrowUp aria-hidden size={28} />
      </button>

      <style>{`
        .site-footer {
          position: relative;
          color: #f5f7ff;
          background:
            radial-gradient(70% 100% at 100% 100%, rgb(44 69 141 / 24%), transparent 64%),
            linear-gradient(115deg, #071747, #06123f 72%);
        }
        .site-footer .site-footer-wrap {
          width: min(calc(100% - var(--margin) - var(--margin)), 88rem);
          margin-inline: auto;
          padding-block: clamp(3.5rem, 6vw, 5.5rem) 1.5rem;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: minmax(17rem, 1.35fr) minmax(9rem, 0.78fr) minmax(9rem, 0.78fr) minmax(18rem, 1.25fr);
          gap: clamp(1.5rem, 3vw, 3.25rem);
          align-items: start;
        }
        .footer-brand-heading { display: flex; align-items: center; gap: 1rem; }
        .footer-brand-logo {
          flex: 0 0 auto;
          width: clamp(4.25rem, 5.5vw, 5.25rem);
          height: clamp(4.25rem, 5.5vw, 5.25rem);
          padding: 0.45rem;
          border-radius: 1rem;
          background: #fff;
          object-fit: contain;
        }
        .footer-brand-heading h2 { margin: 0; color: #fff; font-size: clamp(1.35rem, 1.8vw, 1.8rem); font-weight: 850; letter-spacing: -0.035em; }
        .footer-brand-heading p { margin: 0.2rem 0 0; color: #c4cee7; font-size: var(--step-xs); line-height: 1.35; }
        .footer-description { max-width: 40ch; margin: 1.5rem 0 1.25rem; color: #bdc9e4; font-size: var(--step-sm); line-height: 1.7; }
        .footer-socials { display: flex; flex-wrap: wrap; gap: 0.55rem; }
        .footer-socials a {
          display: grid;
          place-items: center;
          width: 3rem;
          height: 3rem;
          border-radius: 0.8rem;
          color: #fff;
          background: rgb(255 255 255 / 9%);
          transition: color 180ms ease, background-color 180ms ease, transform 180ms ease;
        }
        .footer-socials a:hover { color: #ffd44f; background: rgb(255 255 255 / 15%); transform: translateY(-2px); }
        .footer-socials a:focus-visible,
        .footer-column a:focus-visible,
        .footer-contact-card:focus-visible,
        .footer-developer a:focus-visible,
        .footer-back-to-top:focus-visible { outline: 2px solid #ffd44f; outline-offset: 4px; }
        .footer-column-title {
          margin: 0 0 1.25rem;
          padding-left: 0.85rem;
          border-left: 4px solid #ffc928;
          color: #fff;
          font-size: clamp(1rem, 1.25vw, 1.2rem);
          font-weight: 800;
          line-height: 1.4;
        }
        .footer-column ul { display: grid; gap: 0.7rem; margin: 0; padding: 0; list-style: none; }
        .footer-column a {
          display: inline-flex;
          align-items: flex-start;
          gap: 0.45rem;
          min-height: 2rem;
          color: #c4cee7;
          font-size: var(--step-sm);
          line-height: 1.4;
          text-decoration: none;
          transition: color 160ms ease, transform 160ms ease;
        }
        .footer-column a::before { content: "›"; color: #91a4ce; font-weight: 700; }
        .footer-column a:hover { color: #ffd44f; transform: translateX(2px); }
        .footer-contact { display: grid; gap: 1rem; }
        .footer-contact .footer-column-title { margin-bottom: 0.25rem; }
        .footer-contact-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          min-width: 0;
          min-height: 5.5rem;
          padding: 1rem;
          border: 1px solid rgb(197 210 243 / 17%);
          border-radius: 1.1rem;
          color: inherit;
          background: rgb(255 255 255 / 7%);
          text-decoration: none;
          transition: border-color 180ms ease, background-color 180ms ease, transform 180ms ease;
        }
        .footer-contact-card:hover { border-color: rgb(255 201 40 / 54%); background: rgb(255 255 255 / 10%); transform: translateY(-2px); }
        .footer-contact-icon {
          display: grid;
          flex: 0 0 3.25rem;
          place-items: center;
          width: 3.25rem;
          height: 3.25rem;
          border: 1px solid rgb(255 201 40 / 38%);
          border-radius: 0.9rem;
          color: #ffd44f;
          background: rgb(255 201 40 / 11%);
        }
        .footer-contact-copy { display: grid; min-width: 0; gap: 0.3rem; }
        .footer-contact-copy small { color: #ffd44f; font-size: var(--step-xs); font-weight: 800; letter-spacing: 0.045em; text-transform: uppercase; }
        .footer-contact-copy strong { color: #f4f6fc; font-size: var(--step-sm); font-weight: 550; line-height: 1.4; overflow-wrap: anywhere; }
        .footer-contact-copy > span { color: #c4cee7; font-size: var(--step-xs); }
        .footer-developer { margin: 0; color: #aebbd9; font-size: var(--step-xs); line-height: 1.6; overflow-wrap: anywhere; }
        .footer-developer a { color: #d5def2; text-underline-offset: 0.2em; }
        .footer-developer a:hover { color: #ffd44f; }
        .site-footer .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.75rem 2rem;
          margin-top: clamp(2.5rem, 5vw, 4rem);
          padding-top: 1.5rem;
          border-top: 1px solid rgb(197 210 243 / 14%);
        }
        .footer-bottom p { margin: 0; color: #b8c5e2; font-size: var(--step-xs); line-height: 1.5; }
        .footer-back-to-top {
          position: fixed;
          z-index: 30;
          right: max(1.5rem, env(safe-area-inset-right));
          bottom: max(1.5rem, env(safe-area-inset-bottom));
          display: grid;
          place-items: center;
          width: 4.1rem;
          height: 4.1rem;
          border: 3px solid #ffc928;
          border-radius: 50%;
          color: #fff;
          background: #08236d;
          cursor: pointer;
          box-shadow: 0 8px 24px rgb(2 8 35 / 30%);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transform: translateY(0.65rem);
          transition: opacity 180ms ease, transform 180ms ease, visibility 0s linear 180ms, background-color 180ms ease;
        }
        .footer-back-to-top.is-visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
          transform: none;
          transition-delay: 0s;
        }
        .footer-back-to-top.is-visible:hover { transform: translateY(-3px); background: #10368f; }
        @media (max-width: 70em) {
          .footer-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.5rem 2rem; }
          .footer-brand { grid-column: 1; }
          .footer-contact { grid-column: 2; grid-row: 1 / span 2; }
        }
        @media (max-width: 44em) {
          .site-footer .site-footer-wrap { width: min(calc(100% - 2rem), 34rem); padding-top: 3.25rem; }
          .footer-grid { grid-template-columns: minmax(0, 1fr); gap: 2.25rem; }
          .footer-brand, .footer-contact { grid-column: auto; grid-row: auto; }
          .footer-brand-heading { align-items: center; }
          .footer-brand-logo { width: 4rem; height: 4rem; }
          .footer-contact-card { padding: 0.85rem; }
          .site-footer .footer-bottom { align-items: flex-start; flex-direction: column; margin-top: 2.5rem; }
          .footer-back-to-top { right: max(1rem, env(safe-area-inset-right)); bottom: max(1rem, env(safe-area-inset-bottom)); width: 3.5rem; height: 3.5rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .footer-socials a, .footer-column a, .footer-contact-card, .footer-back-to-top { transition: none; }
          .footer-socials a:hover, .footer-column a:hover, .footer-contact-card:hover, .footer-back-to-top:hover { transform: none; }
        }
      `}</style>
    </footer>
  )
}
