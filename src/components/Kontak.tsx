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
    window.location.href = `mailto:email-resmi@una.ac.id?subject=Pesan dari ${nama}&body=${pesan}`
    setSent(true)
    setTimeout(() => setSent(false), 5000)
  }

  return (
    <section id="kontak" ref={ref} className="section" style={{ position: "relative", overflow: "hidden" }}>
      <div className="motif" aria-hidden style={{ width: "40vh", height: "40vh", right: "-10vh", bottom: "-10vh", opacity: 0.05 }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="kontak-grid">

          {/* Left */}
          <div>
            <p className="label reveal">Kontak</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Hubungi<br />Kami</h2>
            <img src="/himti-una/images/logos/logo-himti.svg" alt="" aria-hidden className="section-logo" />
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
              <a href="/pendaftaran/" className="kontak-recruitment-link">
                <span>
                  <span className="kontak-recruitment-label">Calon mahasiswa baru</span>
                  <span className="kontak-recruitment-title">Kenali Teknik Informatika UNA</span>
                </span>
                <span aria-hidden="true" className="kontak-recruitment-arrow">↗</span>
              </a>
            </div>
          </div>

          {/* Right — coupon form */}
          <div className="reveal coupon" style={{ ["--d" as string]: "160ms", overflow: "hidden" }}>
            <div className="coupon-inner">

              {/* Label side */}
              <div className="coupon-label">
                <div aria-hidden style={{ position: "absolute", right: 0, top: "10%", bottom: "10%", width: 0, borderRight: "2px dashed var(--accent-ink-soft)" }} />
                <div>
                  <h3 style={{ fontWeight: 900, fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", lineHeight: 1.0, textTransform: "uppercase", letterSpacing: "-0.035em", margin: 0 }}>
                    Kirim<br />Pesan
                  </h3>
                  <p style={{ fontSize: "var(--step-xs)", marginTop: "1rem", opacity: 0.7 }}>
                    Isi formulir untuk mengirim pesan langsung.
                  </p>
                </div>
                <p style={{ fontSize: "var(--step-xs)", opacity: 0.45, textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                  HIMTI UNA
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="coupon-form">
                <label htmlFor="nama" className="sr-only">Nama lengkap</label>
                <input id="nama" name="nama" type="text" placeholder="Nama lengkap" required autoComplete="name" />

                <label htmlFor="email-k" className="sr-only">Email</label>
                <input id="email-k" name="email" type="email" placeholder="Email kamu" autoComplete="email" />

                <label htmlFor="pesan" className="sr-only">Pesan</label>
                <textarea id="pesan" name="pesan" placeholder="Pesan kamu..." rows={4} required />

                <button type="submit" className="coupon-submit" disabled={sent}>
                  {sent ? "Membuka email..." : "Kirim Pesan"}
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>

      <style>{`
        .kontak-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: clamp(2rem, 6vw, 6rem);
          align-items: center;
        }
        .coupon-inner {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
        }
        .coupon-label {
          padding: 2.5rem 2rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
          min-height: 200px;
        }
        .coupon-form {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .kontak-recruitment-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          width: min(100%, 24rem);
          min-height: 76px;
          padding: 0.875rem 1rem;
          border: 1px solid var(--border);
          border-radius: var(--r-card);
          background: var(--surface);
          text-decoration: none;
          transition: border-color var(--t-fast) ease, transform var(--t-fast) var(--spring);
        }
        .kontak-recruitment-link:hover { border-color: var(--accent-strong); transform: translateY(-2px); }
        .kontak-recruitment-label, .kontak-recruitment-title { display: block; }
        .kontak-recruitment-label { color: var(--muted); font-size: var(--step-xs); }
        .kontak-recruitment-title { margin-top: 0.15rem; color: var(--ink); font-size: var(--step-sm); font-weight: 800; }
        .kontak-recruitment-arrow { color: var(--accent-strong); font-size: 1.5rem; line-height: 1; }

        @media (max-width: 48em) {
          .kontak-grid { grid-template-columns: 1fr !important; }
          .coupon-inner { grid-template-columns: 1fr !important; }
          .coupon-label {
            min-height: unset;
            padding: 1.75rem 1.5rem 1rem;
          }
          .coupon-form {
            padding: 1rem 1.5rem 1.75rem;
          }
          .coupon input,
          .coupon textarea {
            font-size: 1rem; /* prevent zoom on iOS */
          }
        }
      `}</style>
    </section>
  )
}
