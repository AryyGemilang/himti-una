import { useReveal } from "../hooks/useReveal"
import { dewanPengawas, pengurus, PERIODE } from "../data/pengurus"
import { bidangList } from "../data/bidang"
import KartuPengurus from "./KartuPengurus"

export default function Pengurus() {
  const ref = useReveal()

  const { ketua, sekretaris, wakilSekretaris, bendahara, wakilBendahara } = pengurus

  return (
    <section id="pengurus" ref={ref} className="section pengurus-section" style={{ background: "var(--surface)" }}>
      <div className="wrap">
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

        <div className="pengurus-lead-card">
          <KartuPengurus orang={ketua} size="lg" />
        </div>

        <div className="pengurus-inti-grid">
          <KartuPengurus orang={sekretaris} delay={80} />
          <KartuPengurus orang={wakilSekretaris} delay={140} />
          <KartuPengurus orang={bendahara} delay={200} />
          <KartuPengurus orang={wakilBendahara} delay={260} />
        </div>

        <h3 className="pengurus-subhead reveal">Kepala Bidang</h3>
        <div className="pengurus-bidang-grid" id="bidang">
          {bidangList.map((b, i) => (
            <div key={b.slug}>
              <KartuPengurus orang={b.head} delay={i * 80} />
              <a href={`/bidang/${b.slug}/`} className="bidang-btn">
                {b.namaPendek}
                <span aria-hidden style={{ flexShrink: 0 }}>→</span>
              </a>
            </div>
          ))}
        </div>

        <section className="pengurus-dpo" aria-labelledby="pengurus-dpo-title">
          <h3 className="pengurus-subhead reveal" id="pengurus-dpo-title">Dewan Pengawas Organisasi</h3>
          <div className="pengurus-dpo-grid">
            {dewanPengawas.map((orang, i) => (
              <KartuPengurus key={orang.nama} orang={orang} delay={i * 80} />
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .pengurus-header { display:grid; grid-template-columns:auto 1fr; gap:4rem; margin-bottom:4rem; align-items:start; }
        .pengurus-header-desc { padding-left:4rem; display:flex; align-items:center; }
        .pengurus-lead-card { width:min(100%, 19rem); margin:0 auto 3rem; }
        .pengurus-inti-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:var(--gap); margin-bottom:3rem; }
        .pengurus-bidang-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:var(--gap); scroll-margin-top:6rem; }
        .pengurus-dpo { margin-top:4rem; }
        .pengurus-dpo-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:var(--gap); max-width:38rem; }
        .pengurus-subhead { margin:1rem 0 1.5rem; font-weight:800; font-size:var(--step-lg); text-transform:uppercase; letter-spacing:-0.025em; }
        .bidang-btn {
          width:100%; margin-top:0.5rem; padding:0.75rem 0.5rem; min-height:44px; background:transparent;
          border-radius:6px; font-size:var(--step-xs); color:var(--muted); cursor:pointer; display:flex;
          align-items:center; justify-content:center; gap:0.4rem; border:1.5px solid var(--control-border);
          transition:border-color 160ms ease,color 160ms ease; font-family:var(--font); text-align:center; word-break:break-word;
        }
        .bidang-btn:hover { border-color:var(--accent-strong); color:var(--accent-strong); }
        @media (max-width:72em) { .pengurus-bidang-grid { grid-template-columns:repeat(3,minmax(0,1fr)); } }
        @media (max-width:48em) {
          .pengurus-header { grid-template-columns:1fr; gap:1.5rem; margin-bottom:2.5rem; }
          .pengurus-header-desc { padding-left:0; }
          .pengurus-lead-card { width:min(100%,19rem); margin-bottom:2rem; }
          .pengurus-dpo { margin-top:3rem; }
          .pengurus-dpo-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
          .pengurus-inti-grid,.pengurus-bidang-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
        }
      `}</style>
    </section>
  )
}
