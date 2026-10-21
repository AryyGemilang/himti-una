import { Code2, Heart, MessageCircle, Sparkles, UsersRound, type LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useReveal } from "../hooks/useReveal"
import { dewanPengawas, pengurus, PERIODE } from "../data/pengurus"
import { bidangList } from "../data/bidang"
import KartuPengurus from "./KartuPengurus"

const IKON_BIDANG: Record<string, LucideIcon> = {
  kaderisasi: UsersRound,
  kominfo: Code2,
  "minat-bakat": Sparkles,
  humas: MessageCircle,
  "agama-sosial": Heart,
}

export default function Pengurus() {
  const ref = useReveal()
  const [bidangTerpilih, setBidangTerpilih] = useState<string | null>(null)

  const { ketua, sekretaris, wakilSekretaris, bendahara, wakilBendahara } = pengurus
  const bidangAktif = bidangList.find(b => b.slug === bidangTerpilih)

  useEffect(() => {
    if (!bidangTerpilih) return
    const frame = requestAnimationFrame(() => {
      document.querySelectorAll("#bidang-detail .reveal").forEach(element => element.classList.add("visible"))
    })
    return () => cancelAnimationFrame(frame)
  }, [bidangTerpilih])

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
              Kepengurusan HIMTI UNA terdiri dari Ketua Umum, jajaran inti, dan lima divisi
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

        <div className="pengurus-divisi" id="divisi">
          <h3 className="pengurus-subhead reveal">Pilih Bidang</h3>
          <p className="pengurus-divisi-hint reveal">Pilih salah satu bidang untuk melihat kepala dan anggota divisinya.</p>
          <div className="pengurus-bidang-grid" role="group" aria-label="Pilih bidang kepengurusan">
            {bidangList.map((b, i) => {
              const isActive = bidangTerpilih === b.slug
              const IkonBidang = IKON_BIDANG[b.slug] ?? UsersRound
              return (
                <button
                  key={b.slug}
                  type="button"
                  className={`bidang-tile${isActive ? " is-active" : ""}`}
                  aria-expanded={isActive}
                  aria-controls="bidang-detail"
                  onClick={() => setBidangTerpilih(isActive ? null : b.slug)}
                  style={{ ["--d" as string]: `${i * 65}ms` }}
                >
                  <span className="bidang-tile-icon" aria-hidden="true"><IkonBidang size={27} strokeWidth={1.8} /></span>
                  <span className="bidang-tile-name">{b.namaPendek}</span>
                  <span className="bidang-tile-action">{isActive ? "Tutup" : "Lihat pengurus"}</span>
                </button>
              )
            })}
          </div>

          <section className="bidang-detail" id="bidang-detail" aria-labelledby="bidang-detail-title" aria-live="polite" hidden={!bidangAktif}>
            {bidangAktif && <>
              <div className="bidang-detail-heading">
                <div>
                  <p className="label">Struktur Bidang</p>
                  <h4 id="bidang-detail-title">{bidangAktif.namaPendek}</h4>
                </div>
                <a href={`/divisi/${bidangAktif.slug}/`} className="bidang-detail-link">Lihat halaman bidang <span aria-hidden="true">↗</span></a>
              </div>
              <div className="bidang-detail-grid">
                {[bidangAktif.head, ...bidangAktif.anggota].map((orang, i) => (
                  <KartuPengurus key={`${bidangAktif.slug}-${orang.nama}`} orang={orang} delay={i * 55} />
                ))}
              </div>
            </>}
          </section>
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
        .pengurus-divisi { margin-top:1rem; }
        .pengurus-divisi-hint { color:var(--muted); margin:-0.75rem 0 1.5rem; font-size:var(--step-sm); }
        .bidang-tile {
          aspect-ratio:1; min-width:0; padding:clamp(0.85rem,2vw,1.5rem); position:relative; overflow:hidden;
          display:flex; flex-direction:column; justify-content:space-between; text-align:left;
          color:var(--ink); background:var(--surface-2); border:1px solid var(--border); border-radius:var(--r-card);
          transition:transform 220ms var(--spring), border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
          animation:bidang-tile-in 460ms var(--spring) both; animation-delay:var(--d,0ms);
        }
        .bidang-tile:hover { transform:translateY(-3px); border-color:var(--accent-strong); box-shadow:0 12px 28px var(--shadow); }
        .bidang-tile.is-active { color:var(--accent-ink); background:var(--accent); border-color:var(--accent); }
        .bidang-tile-icon { display:grid; place-items:center; width:3.25rem; aspect-ratio:1; color:var(--accent-strong); background:var(--accent-dim); border:1px solid var(--border); border-radius:var(--r-card); }
        .bidang-tile.is-active .bidang-tile-icon { color:var(--accent-ink); background:var(--accent-chip); border-color:transparent; }
        .bidang-tile-name { font-weight:850; font-size:clamp(1rem,1.4vw,var(--step-lg)); line-height:1.08; letter-spacing:-.025em; overflow-wrap:anywhere; }
        .bidang-tile-action { color:var(--muted); font-size:var(--step-xs); font-weight:650; }
        .bidang-tile.is-active .bidang-tile-action { color:var(--accent-ink); }
        .bidang-detail { margin-top:3rem; scroll-margin-top:6rem; }
        .bidang-detail-heading { display:flex; align-items:end; justify-content:space-between; gap:1.5rem; margin-bottom:1.5rem; }
        .bidang-detail-heading h4 { margin-top:.3rem; font-size:var(--step-xl); line-height:1; font-weight:850; letter-spacing:-.035em; }
        .bidang-detail-link { min-height:44px; display:inline-flex; align-items:center; gap:.5rem; color:var(--accent-strong); font-size:var(--step-sm); font-weight:750; text-decoration-thickness:1px; text-underline-offset:4px; }
        .bidang-detail-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:var(--gap); }
        @keyframes bidang-tile-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
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
          .bidang-detail { margin-top:2rem; }
          .bidang-detail-heading { align-items:flex-start; flex-direction:column; gap:.75rem; }
          .bidang-detail-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .bidang-tile { animation:none; transition:none; }
          .bidang-tile:hover { transform:none; }
        }
      `}</style>
    </section>
  )
}
