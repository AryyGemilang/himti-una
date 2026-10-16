import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useReveal } from "../hooks/useReveal"
import { pengurus, PERIODE, type Orang } from "../data/pengurus"
import Foto from "./Foto"

function Kartu({ orang, delay = 0, size = "md" }: { orang: Orang; delay?: number; size?: "lg" | "md" | "sm" }) {
  const dim = { lg: 120, md: 80, sm: 60 }[size]
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
            <div aria-hidden style={{ position: "absolute", bottom: 0, right: 0, width: 18, height: 18, borderRadius: "50%", background: "var(--accent)" }} />
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
  const [buka, setBuka] = useState<number | null>(null)
  const { ketua, sekretaris, wakilSekretaris, bendahara, wakilBendahara, bidang } = pengurus

  return (
    <section id="pengurus" ref={ref} className="section" style={{ background: "var(--surface)" }}>
      <div className="wrap">

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4rem", marginBottom: "4rem", alignItems: "start" }}>
          <div>
            <p className="label reveal">{PERIODE}</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Struktur<br />Pengurus</h2>
          </div>
          <div style={{ paddingLeft: "4rem", display: "flex", alignItems: "center" }}>
            <p className="reveal muted" style={{ ["--d" as string]: "120ms" }}>
              Kepengurusan HIMTI UNA terdiri dari Ketua Umum, jajaran inti, dan empat bidang kerja
              yang memastikan program organisasi berjalan optimal.
            </p>
          </div>
        </div>

        {/* Ketua */}
        <div style={{ maxWidth: 300, margin: "0 auto 3rem" }}>
          <Kartu orang={ketua} size="lg" />
        </div>

        {/* Sekretaris & Bendahara 2x2 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "var(--gap)", marginBottom: "3rem" }}>
          <Kartu orang={sekretaris}      delay={80} />
          <Kartu orang={wakilSekretaris} delay={140} />
          <Kartu orang={bendahara}       delay={200} />
          <Kartu orang={wakilBendahara}  delay={260} />
        </div>

        {/* Bidang */}
        <h3 className="reveal" style={{ fontWeight: 800, fontSize: "var(--step-lg)", textTransform: "uppercase", letterSpacing: "-0.025em", marginBottom: "1.5rem" }}>
          Kepala Bidang
        </h3>
        <div id="bidang" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--gap)", scrollMarginTop: "6rem" }}>
          {bidang.map((b, i) => (
            <div key={b.nama}>
              <Kartu orang={b.kabid} delay={i * 80} size="md" />
              <button
                onClick={() => setBuka(buka === i ? null : i)}
                aria-expanded={buka === i}
                style={{
                  width: "100%", marginTop: "0.5rem", padding: "0.6rem",
                  background: "transparent", borderRadius: 6,
                  fontSize: "var(--step-xs)", color: "var(--muted)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem",
                  border: "1.5px solid var(--muted-2)", transition: "border-color 160ms ease, color 160ms ease",
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "var(--accent)"; el.style.color = "var(--accent)" }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "var(--muted-2)"; el.style.color = "var(--muted)" }}
              >
                {b.nama.replace("Bidang ", "")}
                <ChevronDown size={13} style={{ transform: buka === i ? "rotate(180deg)" : "none", transition: "transform 200ms ease" }} aria-hidden />
              </button>
            </div>
          ))}
        </div>

        {/* Anggota panel */}
        {buka !== null && (
          <div style={{ marginTop: "1.5rem", background: "var(--surface-2)", borderRadius: 8, padding: "1.75rem" }}>
            <p className="label" style={{ marginBottom: "1rem" }}>Anggota {bidang[buka].nama}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.75rem" }}>
              {bidang[buka].anggota.map((a, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.75rem", background: "var(--surface)", borderRadius: 6 }}>
                  <Foto src={a.foto} alt={`${a.jabatan}, ${a.nama}`} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontWeight: 700, fontSize: "var(--step-sm)", margin: 0 }}>{a.nama}</p>
                    <p style={{ fontSize: "var(--step-xs)", color: "var(--muted)", margin: 0 }}>{a.jabatan}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
      <style>{`
        @media(max-width:48em){
          #pengurus .wrap>div:first-child{grid-template-columns:1fr!important;gap:2rem!important}
          #pengurus [style*="1fr 1fr 1fr 1fr"]{grid-template-columns:1fr 1fr!important}
          #pengurus [style*="repeat(4"]{grid-template-columns:1fr 1fr!important}
          #pengurus [style*="repeat(3"]{grid-template-columns:1fr 1fr!important}
        }
      `}</style>
    </section>
  )
}
