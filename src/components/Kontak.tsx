import { useState } from "react"
import { useReveal } from "../hooks/useReveal"

export default function Kontak() {
  const ref = useReveal()
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const nama  = encodeURIComponent((data.get("nama")  as string) || "")
    const pesan = encodeURIComponent((data.get("pesan") as string) || "")
    // taste-skill-ignore — mailto opens email client, no dead link
    window.location.href = `mailto:email-resmi@una.ac.id?subject=Pesan dari ${nama}&body=${pesan}`
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section id="kontak" ref={ref} className="section" style={{ position: "relative" }}>
      <div className="motif" aria-hidden style={{ width: "40vh", height: "40vh", right: "-10vh", bottom: "-10vh", opacity: 0.05 }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "clamp(2rem, 6vw, 6rem)", alignItems: "center" }}>

          {/* Left */}
          <div>
            <p className="label reveal">Kontak</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Hubungi<br />Kami</h2>
            <img src="/himti-una/Logo-Himti.svg" alt="" aria-hidden style={{ width: 36, height: 36, objectFit: "contain", margin: "1.75rem 0", display: "block", opacity: 0.85 }} />
            <p className="reveal muted" style={{ ["--d" as string]: "120ms" }}>
              Punya pertanyaan atau ingin bergabung bersama HIMTI UNA? Kirim pesan dan kami akan
              segera menghubungi kamu.
            </p>
            <div className="reveal" style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.875rem", ["--d" as string]: "180ms" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "var(--step-sm)", marginBottom: "0.2rem" }}>Lokasi</p>
                <p style={{ color: "var(--muted)", fontSize: "var(--step-sm)", margin: 0 }}>
                  Fakultas Teknik, Universitas Asahan<br />Kisaran, Sumatera Utara
                </p>
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "var(--step-sm)", marginBottom: "0.2rem" }}>Naungan</p>
                <p style={{ color: "var(--muted)", fontSize: "var(--step-sm)", margin: 0 }}>PERMIKOMNAS, anggota sejak 2021</p>
              </div>
            </div>
            <div className="reveal" style={{ marginTop: "2rem", ["--d" as string]: "240ms" }}>
              <img src="/images/logo-una.jpg" alt="Logo Universitas Asahan" style={{ height: 40, objectFit: "contain", opacity: 0.6 }} />
            </div>
          </div>

          {/* Right — coupon form */}
          <div className="reveal coupon" style={{ ["--d" as string]: "160ms", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr" }}>

              {/* Left of perf */}
              <div style={{
                padding: "2.5rem 2rem",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                position: "relative",
              }}>
                {/* Perforated line — subtle dotted */}
                <div aria-hidden style={{ position: "absolute", right: 0, top: "10%", bottom: "10%", width: 0, borderRight: "2px dashed rgba(10,10,10,0.2)" }} />
                <div>
                  <h3 style={{ fontWeight: 900, fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.0, textTransform: "uppercase", letterSpacing: "-0.035em", margin: 0 }}>
                    Kirim<br />Pesan
                  </h3>
                  <p style={{ fontSize: "var(--step-xs)", marginTop: "1rem", opacity: 0.6 }}>
                    Isi formulir untuk mengirim pesan langsung.
                  </p>
                </div>
                <p style={{ fontSize: "var(--step-xs)", opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                  HIMTI UNA
                </p>
              </div>

              {/* Right — inputs */}
              <form onSubmit={handleSubmit} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                <label htmlFor="nama" className="sr-only">Nama lengkap</label>
                <input id="nama" name="nama" type="text" placeholder="Nama lengkap" required autoComplete="name" />

                <label htmlFor="email-k" className="sr-only">Email</label>
                <input id="email-k" name="email" type="email" placeholder="Email kamu" autoComplete="email" />

                <label htmlFor="pesan" className="sr-only">Pesan</label>
                <textarea id="pesan" name="pesan" placeholder="Pesan kamu..." rows={3} required />

                <button type="submit" className="coupon-submit" disabled={sent}>
                  {sent ? "Membuka email..." : "Kirim Pesan"}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
      <style>{`
        @media(max-width:48em){
          #kontak .wrap>div{grid-template-columns:1fr!important}
          #kontak .coupon>div{grid-template-columns:1fr!important}
        }
      `}</style>
    </section>
  )
}
