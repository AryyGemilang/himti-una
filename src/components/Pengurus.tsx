import { useReveal } from "../hooks/useReveal"
import { pengurus, PERIODE, type Orang } from "../data/pengurus"
import { bidangList } from "../data/bidang"
import Foto from "./Foto"

function Kartu({ orang, delay = 0, size = "md" }: { orang: Orang; delay?: number; size?: "lg" | "md" | "sm" }) {
  const dim = { lg: 160, md: 100, sm: 72 }[size]
  const nameSz = size === "lg" ? "var(--step-lg)" : size === "md" ? "var(--step-md)" : "var(--step-sm)"
  return (
    <div className="reveal bezel" style={{ ["--d" as string]: `${delay}ms` }}>
      <div className="bezel-inner" style={{ padding: size === "lg" ? "2rem" : "1.25rem", textAlign: "center" }}>
        <div style={{ position: "relative", display: "inline-block", marginBottom: "0.875rem" }}>
          <Foto
            src={orang.foto}
            alt={`${orang.jabatan}, ${orang.nama}`}
            style={{ width: dim, height: dim, borderRadius: "50%", objectFit: "cover", display: "block" }}
          />
          {size === "lg" && (
            <div aria-hidden style={{ position: "absolute", bottom: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "var(--accent)" }} />
          )}
        </div>
        <p style={{ fontWeight: 800, fontSize: nameSz, margin: 0, lineHeight: 1.1 }}>{orang.nama}</p>
        <p style={{ fontSize: "var(--step-xs)", color: "var(--muted)", marginTop: "0.3rem" }}>{orang.jabatan}</p>
      </div>
    </div>
  )
}

export default function Pengurus() {
  const ref = useReveal()
  const { ketua, sekretaris, wakilSekretaris, bendahara, wakilBendahara } = pengurus

  return (
    <section id="pengurus" ref={ref} className="section" style={{ background: "var(--surface)" }}>
      <div className="wrap">

        {/* Header */}
        <div className="pengurus-header">
          <div>
            <p className="label reveal">{PERIODE}</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Struktur<br />Pengurus</h2>
          </div>
          <div className="pengurus-header-desc">
            <p className="reveal muted" style={{ ["--d" as string]: "120ms" }}>
              Kepengurusan HIMTI UNA terdiri dari Ketua Umum, jajaran inti, dan lima bidang kerja
              yang memastikan program organisasi berjalan optimal.
            </p>
          </div>
        </div>

        {/* Ketua */}
        <div style={{ maxWidth: 280, margin: "0 auto 3rem" }}>
          <Kartu orang={ketua} size="lg" />
        </div>

        {/* Inti 2x2 */}
        <div className="pengurus-inti-grid">
          <Kartu orang={sekretaris}      delay={80} />
          <Kartu orang={wakilSekretaris} delay={140} />
          <Kartu orang={bendahara}       delay={200} />
          <Kartu orang={wakilBendahara}  delay={260} />
        </div>

        {/* Bidang */}
        <h3 className="reveal" style={{ fontWeight: 800, fontSize: "var(--step-lg)", textTransform: "uppercase", letterSpacing: "-0.025em", marginBottom: "1.5rem", marginTop: "1rem" }}>
          Kepala Bidang
        </h3>
        <div className="pengurus-bidang-grid" id="bidang">
          {bidangList.map((b, i) => (
            <div key={b.slug}>
              <Kartu orang={b.head} delay={i * 80} size="md" />
              <a href={`/bidang/${b.slug}/`} className="bidang-btn">
                {b.namaPendek}
                <span aria-hidden style={{ flexShrink: 0 }}>→</span>
              </a>
            </div>
          ))}
        </div>

      </div>

      <style>{`
        .pengurus-header {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 4rem;
          margin-bottom: 4rem;
          align-items: start;
        }
        .pengurus-header-desc {
          padding-left: 4rem;
          display: flex;
          align-items: center;
        }
        .pengurus-inti-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--gap);
          margin-bottom: 3rem;
        }
        .pengurus-bidang-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: var(--gap);
          scroll-margin-top: 6rem;
        }
        .bidang-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.75rem 0.5rem;
          min-height: 44px;
          background: transparent;
          border-radius: 6px;
          font-size: var(--step-xs);
          color: var(--muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          border: 1.5px solid var(--control-border);
          transition: border-color 160ms ease, color 160ms ease;
          font-family: var(--font);
          text-align: center;
          word-break: break-word;
        }
        .bidang-btn:hover { border-color: var(--accent-strong); color: var(--accent-strong); }
        .anggota-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        /* Tablet */
        @media (max-width: 72em) {
          .pengurus-bidang-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }

        /* Mobile */
        @media (max-width: 48em) {
          .pengurus-header {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            margin-bottom: 2.5rem !important;
          }
          .pengurus-header-desc { padding-left: 0 !important; }
          .pengurus-inti-grid { grid-template-columns: 1fr 1fr !important; }
          .pengurus-bidang-grid { grid-template-columns: 1fr 1fr !important; }
          .anggota-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
