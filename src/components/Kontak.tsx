import { useState, type FormEvent } from "react"
import { LoaderCircle, Send } from "lucide-react"
import { useReveal } from "../hooks/useReveal"

type SubmissionState = "idle" | "sending" | "success" | "error"

const BASIN_FORM_ENDPOINT = "https://usebasin.com/f/c82cced52daa"

export default function Kontak() {
  const ref = useReveal()
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!BASIN_FORM_ENDPOINT || submissionState === "sending") return

    const form = event.currentTarget
    setSubmissionState("sending")

    try {
      const response = await fetch(BASIN_FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      })

      if (!response.ok) throw new Error("Basin menolak kiriman")

      setSubmissionState("success")
      form.reset()
    } catch {
      setSubmissionState("error")
    }
  }

  return (
    <section id="kontak" ref={ref} className="section" style={{ position: "relative", overflow: "hidden" }}>
      <div className="motif" aria-hidden style={{ width: "40vh", height: "40vh", right: "-10vh", bottom: "-10vh", opacity: 0.05 }} />

      <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
        <div className="kontak-grid">
          <div className="kontak-content">
            <p className="label reveal">Kontak</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>Hubungi<br />Kami</h2>
            <img src="/himti-una/images/logos/logo-himti.svg" alt="" aria-hidden className="section-logo" />
            <p className="reveal muted" style={{ ["--d" as string]: "120ms" }}>
              Punya pertanyaan atau ingin bergabung bersama HIMTI UNA? Kirim pesan dan kami akan
              segera menghubungi kamu.
            </p>
            <div className="reveal contact-details" style={{ ["--d" as string]: "180ms" }}>
              <div>
                <p className="contact-detail-title">Lokasi</p>
                <p className="contact-detail-copy">
                  Fakultas Teknik<br />Universitas Asahan<br />Kisaran, Sumatera Utara
                </p>
                <p className="contact-address">Jl. Jend. A. Yani, Kisaran Naga, Kec. Kota Kisaran Timur, Kisaran, Sumatera Utara 21216</p>
                <a className="contact-link" href="https://www.google.com/maps/place/Universitas+Asahan+(UNA)/@2.9662091,99.6219396,17z/data=!3m1!4b1!4m6!3m5!1s0x3032495abfd9eb8d:0x9473c0d893d71d28!8m2!3d2.9662091!4d99.6219396!16s%2Fg%2F1hm5b9k0x?authuser=0&entry=ttu&g_ep=EgoyMDI2MTAxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">
                  Lihat lokasi di peta
                </a>
              </div>
              <div>
                <p className="contact-detail-title">Email HIMTI UNA</p>
                <a className="contact-link" href="mailto:himti.universitasasahan@gmail.com">himti.universitasasahan@gmail.com</a>
              </div>
              <div>
                <p className="contact-detail-title">Naungan</p>
                <p className="contact-detail-copy">PERMIKOMNAS, anggota sejak 2021</p>
              </div>
            </div>
          </div>

          <div className="kontak-form-wrap reveal" style={{ ["--d" as string]: "160ms" }}>
            <div className="contact-form-heading">
              <p className="label">Kirim Pesan</p>
              <p className="muted">Isi formulir berikut dan tim HIMTI UNA akan meninjau pesanmu.</p>
            </div>

            {!BASIN_FORM_ENDPOINT && (
              <p className="contact-form-notice" role="status">
                Formulir pesan belum aktif. Silakan coba kembali nanti.
              </p>
            )}

            <form className="contact-form" onSubmit={handleSubmit}>
              <label className="contact-field">
                <span>Nama</span>
                <input name="name" type="text" autoComplete="name" maxLength={100} required disabled={!BASIN_FORM_ENDPOINT || submissionState === "sending"} />
              </label>
              <label className="contact-field">
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" maxLength={254} required disabled={!BASIN_FORM_ENDPOINT || submissionState === "sending"} />
              </label>
              <label className="contact-field">
                <span>Isi Pesan</span>
                <textarea name="message" rows={5} maxLength={3000} required disabled={!BASIN_FORM_ENDPOINT || submissionState === "sending"} />
              </label>

              <button className="btn contact-submit" type="submit" disabled={!BASIN_FORM_ENDPOINT || submissionState === "sending"}>
                {submissionState === "sending" ? <><LoaderCircle size={17} className="contact-spinner" aria-hidden /> Mengirim</> : <>{submissionState === "success" ? "Kirim Pesan Lagi" : "Kirim Pesan"}<Send size={16} aria-hidden /></>}
              </button>

              <p className="contact-form-status" role={submissionState === "error" ? "alert" : "status"} aria-live="polite">
                {submissionState === "success" && "Pesan berhasil terkirim! Terima kasih telah menghubungi HIMTI UNA."}
                {submissionState === "error" && "Pesan belum berhasil dikirim. Periksa koneksi internet lalu coba lagi."}
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .kontak-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(19rem, 0.78fr);
          align-items: start;
          gap: clamp(2rem, 7vw, 7rem);
          width: 100%;
        }
        .kontak-content { max-width: 42rem; }
        .contact-details { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.875rem; }
        .contact-detail-title { font-weight: 700; font-size: var(--step-sm); margin-bottom: 0.2rem; }
        .contact-detail-copy, .contact-address {
          color: var(--muted);
          font-size: var(--step-sm);
          line-height: 1.65;
          overflow-wrap: anywhere;
        }
        .contact-address { max-width: 42ch; margin: 0.5rem 0 0; }
        .contact-link {
          display: inline-block;
          min-height: 2.75rem;
          padding-block: 0.5rem;
          color: var(--accent-strong);
          font-size: var(--step-sm);
          overflow-wrap: anywhere;
          text-underline-offset: 0.2em;
        }
        .contact-link:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
        .kontak-form-wrap {
          margin-top: clamp(2rem, 11vw, 8rem);
          padding: clamp(1.25rem, 3vw, 2.25rem);
          border: 1px solid var(--border);
          border-top: 3px solid var(--accent);
          background: color-mix(in srgb, var(--surface) 78%, transparent);
          box-shadow: 0 18px 55px var(--shadow);
          backdrop-filter: blur(12px);
        }
        .contact-form-heading { margin-bottom: 1.5rem; }
        .contact-form-heading > p + p { margin-top: 0.45rem; font-size: var(--step-sm); }
        .contact-form { display: grid; gap: 1.1rem; }
        .contact-field { display: grid; gap: 0.4rem; font-size: var(--step-sm); font-weight: 700; }
        .contact-field input, .contact-field textarea {
          width: 100%;
          min-height: 3rem;
          padding: 0.7rem 0.8rem;
          border: 1px solid var(--control-border);
          border-radius: 4px;
          background: var(--page-bg);
          color: var(--ink);
          font-size: var(--step-sm);
          font-weight: 400;
          transition: border-color var(--t-fast) ease, box-shadow var(--t-fast) ease;
        }
        .contact-field textarea { min-height: 9rem; resize: vertical; }
        .contact-field input:focus, .contact-field textarea:focus {
          outline: none;
          border-color: var(--accent-strong);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }
        .contact-field input:disabled, .contact-field textarea:disabled { opacity: 0.72; cursor: not-allowed; }
        .contact-submit { justify-content: center; width: fit-content; min-width: 12rem; margin-top: 0.25rem; }
        .contact-submit:disabled { background: var(--disabled-bg); color: var(--disabled-ink); cursor: not-allowed; transform: none; }
        .contact-spinner { animation: contact-spin 900ms linear infinite; }
        .contact-form-status { min-height: 1.55em; font-size: var(--step-sm); }
        .contact-form-status:empty { display: none; }
        .contact-form-status[role="status"] { color: var(--success); }
        .contact-form-status[role="alert"] { color: var(--error); }
        .contact-form-notice { margin-bottom: 1rem; padding: 0.75rem 0.9rem; border-left: 3px solid var(--warning); background: var(--surface-2); color: var(--ink); font-size: var(--step-sm); }
        @keyframes contact-spin { to { transform: rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .contact-spinner { animation-duration: 2s; } }
        @media (max-width: 48em) {
          .kontak-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .kontak-content { width: 100%; }
          .kontak-form-wrap { margin-top: 1rem; }
          .contact-submit { width: 100%; }
        }
      `}</style>
    </section>
  )
}
