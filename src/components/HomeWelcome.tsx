import { ArrowRight, Code2, Heart, MessageCircle, Sparkles, UsersRound, type LucideIcon } from "lucide-react"
import { bidangList } from "../data/bidang"
import { useReveal } from "../hooks/useReveal"

const FIELD_ICONS: Record<string, LucideIcon> = {
  kaderisasi: UsersRound,
  kominfo: Code2,
  "minat-bakat": Sparkles,
  humas: MessageCircle,
  "agama-sosial": Heart,
}

export default function HomeWelcome() {
  const ref = useReveal()

  return (
    <section id="organisasi" ref={ref} className="home-welcome">
      <div className="wrap">
        <div className="home-welcome-intro">
          <div className="home-welcome-copy">
            <h2 className="home-welcome-title reveal" style={{ ["--d" as string]: "80ms" }}>
              WELCOME
            </h2>
            <p className="home-welcome-description reveal" style={{ ["--d" as string]: "140ms" }}>
              Selamat datang di Website HIMTI Himpunan Mahasiswa Teknik Informatika. Organisasi mahasiswa yang
              berdedikasi untuk mengembangkan potensi akademik, profesional, dan sosial di bidang Teknologi dan
              Informasi. Dengan berbagai kegiatan seperti seminar, pelatihan, dan perlombaan, kami bertujuan untuk
              menciptakan lingkungan belajar yang inspiratif sekaligus membangun jejaring yang solid di antara
              mahasiswa.
            </p>
          </div>

          <div className="home-welcome-count reveal" aria-label={`${bidangList.length} bidang HIMTI UNA`}>
            <strong>{String(bidangList.length).padStart(2, "0")}</strong>
            <span>bidang<br />kolaborasi</span>
          </div>
        </div>

        <div className="home-fields" aria-label="Bidang di HIMTI UNA">
          {bidangList.map((bidang, index) => {
            const FieldIcon = FIELD_ICONS[bidang.slug] ?? UsersRound
            return (
              <a
                className="home-field reveal"
                href={`/divisi/${bidang.slug}/`}
                key={bidang.slug}
                style={{ ["--d" as string]: `${index * 70}ms` }}
              >
                <span className="home-field-icon"><FieldIcon size={23} strokeWidth={1.8} aria-hidden="true" /></span>
                <span className="home-field-name">{bidang.namaPendek}</span>
                <span className="home-field-description">{bidang.deskripsi}</span>
                <ArrowRight className="home-field-arrow" size={18} aria-hidden />
              </a>
            )
          })}
        </div>
      </div>

      <style>{`
        .home-welcome {
          padding-block: clamp(4.5rem, 9vw, 8rem);
          background: var(--surface);
          position: relative;
          z-index: 1;
        }
        .home-welcome-intro {
          display: grid;
          justify-items: center;
          gap: 2rem;
          text-align: center;
        }
        .home-welcome-copy { max-width: 54rem; }
        .home-welcome-title {
          max-width: 15ch;
          margin-top: 0;
          color: var(--ink);
          font-size: clamp(2.6rem, 6vw, 5rem);
          font-weight: 850;
          line-height: 0.98;
          letter-spacing: -0.055em;
          text-wrap: balance;
        }
        .home-welcome-title,
        .home-welcome-description { margin-inline: auto; }
        .home-welcome-description {
          max-width: 58ch;
          margin-top: 1.25rem;
          color: var(--muted);
          font-size: var(--step-md);
          line-height: 1.55;
        }
        .home-field-arrow { transition: transform 200ms var(--spring); }
        .home-welcome-count {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          min-width: 13rem;
          padding: 0.5rem 1rem;
          border: 1px solid var(--border);
          border-radius: 999px;
          background: var(--surface-2);
        }
        .home-welcome-count strong {
          color: var(--accent-strong);
          font-size: clamp(3.5rem, 7vw, 6rem);
          font-weight: 850;
          line-height: 0.85;
          letter-spacing: -0.07em;
        }
        .home-welcome-count span {
          color: var(--muted);
          font-size: var(--step-sm);
          font-weight: 700;
          line-height: 1.3;
        }
        .home-fields {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 1rem;
          max-width: 70rem;
          margin-inline: auto;
          margin-top: clamp(3rem, 7vw, 6rem);
        }
        .home-field {
          position: relative;
          display: grid;
          grid-template-columns: 3.25rem minmax(0, 1fr) auto;
          gap: 0.45rem 1rem;
          align-content: center;
          min-height: 8.5rem;
          padding: 1.25rem;
          border: 1px solid var(--border);
          border-radius: 1.125rem;
          background: var(--surface-2);
          background: color-mix(in srgb, var(--surface-2) 88%, transparent);
          color: inherit;
          text-decoration: none;
          box-shadow: 0 8px 24px var(--shadow);
          transition: transform 200ms var(--spring), border-color 200ms ease, background-color 200ms ease, box-shadow 200ms ease;
        }
        .home-field-icon {
          grid-column: 1;
          grid-row: 1 / span 2;
          display: grid;
          place-items: center;
          width: 3.25rem;
          height: 3.25rem;
          border: 1px solid color-mix(in srgb, var(--accent-strong) 22%, transparent);
          border-radius: 1rem;
          background: var(--accent-dim);
          color: var(--accent-strong);
        }
        .home-field-name {
          grid-column: 2;
          grid-row: 1;
          font-size: clamp(1.2rem, 2vw, 1.55rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.15;
          transition: color 180ms ease;
        }
        .home-field-description {
          grid-column: 2;
          grid-row: 2;
          max-width: 54ch;
          color: var(--muted);
          font-size: var(--step-sm);
          line-height: 1.45;
        }
        .home-field-arrow {
          grid-column: 3;
          grid-row: 1 / span 2;
          align-self: center;
          color: var(--accent-strong);
        }
        .home-field:hover,
        .home-field:focus-visible {
          transform: translateY(-3px);
          border-color: var(--accent-strong);
          background: color-mix(in srgb, var(--surface-2) 76%, var(--accent-dim));
          box-shadow: 0 14px 30px var(--shadow);
        }
        .home-field:hover .home-field-name,
        .home-field:focus-visible .home-field-name { color: var(--accent-strong); }
        .home-field:hover .home-field-arrow,
        .home-field:focus-visible .home-field-arrow { transform: translateX(4px); }
        .home-field:focus-visible { outline: 2px solid var(--accent-strong); outline-offset: 4px; }
        .home-field:last-child:nth-child(odd) {
          grid-column: 1 / -1;
          width: calc(50% - 0.5rem);
          justify-self: center;
        }
        @media (max-width: 48em) {
          .home-welcome { padding-block: 4rem; }
          .home-welcome-intro { gap: 1.5rem; }
          .home-welcome-title { font-size: clamp(2.4rem, 9vw, 3.7rem); }
          .home-welcome-count { min-width: 0; width: fit-content; }
          .home-fields { grid-template-columns: 1fr; margin-top: 2.5rem; }
          .home-field,
          .home-field:last-child:nth-child(odd) { grid-column: auto; width: 100%; min-height: 7rem; padding: 1rem; }
        }
        @media (max-width: 23.5em) {
          .home-field { grid-template-columns: 2.75rem minmax(0, 1fr) auto; gap: 0.45rem 0.75rem; }
          .home-field-icon { width: 2.75rem; height: 2.75rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          .home-field-arrow,
          .home-field { transition: none; }
          .home-field:hover,
          .home-field:focus-visible { transform: none; }
        }
      `}</style>
    </section>
  )
}
