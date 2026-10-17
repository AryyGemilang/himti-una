import { useReveal } from "../hooks/useReveal"

const MEDIA_PATH = "/himti-una/images/dokumentasi/Screening%20Text-Himtiuna"

const PHOTOS = [
  "WhatsApp Image 2026-10-17 at 15.13.24.jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.25.jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.25(1).jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.25(2).jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.26.jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.26(1).jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.27.jpeg",
  "WhatsApp Image 2026-10-17 at 15.13.53.jpeg",
]

const VIDEOS = [
  "WhatsApp Video 2026-10-17 at 15.13.27.mp4",
  "WhatsApp Video 2026-10-17 at 15.13.29.mp4",
]

const assetUrl = (filename: string) => `${MEDIA_PATH}/${encodeURIComponent(filename)}`

export default function Kegiatan() {
  const ref = useReveal()

  return (
    <section id="kegiatan" ref={ref} className="section">
      <div className="wrap">
        <div className="kegiatan-layout">
          <div className="kegiatan-intro">
            <p className="label reveal">Kegiatan HIMTI</p>
            <h2 className="head reveal" style={{ marginTop: "1rem", ["--d" as string]: "80ms" }}>
              Screening Test<br />Rekrutmen Anggota HIMTI
            </h2>
            <img src="/himti-una/images/logos/logo-himti.svg" alt="" aria-hidden className="section-logo" />
            <p className="reveal muted kegiatan-description" style={{ ["--d" as string]: "120ms" }}>
              Dokumentasi proses screening test sebagai bagian dari rekrutmen anggota HIMTI UNA.
            </p>
          </div>

          <div className="kegiatan-gallery" role="group" aria-label="Dokumentasi Screening Test Rekrutmen Anggota HIMTI">
            {PHOTOS.map((photo, index) => (
              <figure className="kegiatan-media reveal" key={photo} style={{ ["--d" as string]: `${index * 55}ms` }}>
                <img
                  src={assetUrl(photo)}
                  alt={`Dokumentasi screening test HIMTI UNA, foto ${index + 1}`}
                  loading="lazy"
                  decoding="async"
                  width={1280}
                  height={720}
                />
              </figure>
            ))}
            {VIDEOS.map((video, index) => (
              <figure className="kegiatan-media kegiatan-video reveal" key={video} style={{ ["--d" as string]: `${(PHOTOS.length + index) * 55}ms` }}>
                <video controls preload="metadata" playsInline aria-label={`Video dokumentasi screening test HIMTI UNA ${index + 1}`}>
                  <source src={assetUrl(video)} type="video/mp4" />
                  Browser Anda tidak mendukung pemutaran video.
                </video>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .kegiatan-layout {
          display: grid;
          grid-template-columns: minmax(16rem, 0.8fr) minmax(0, 1.2fr);
          align-items: start;
          gap: clamp(2rem, 6vw, 6rem);
        }
        .kegiatan-intro { min-width: 0; }
        .kegiatan-description { max-width: 38rem; margin-bottom: 0; }
        .kegiatan-gallery {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: clamp(0.625rem, 1.4vw, 1.25rem);
        }
        .kegiatan-media {
          min-width: 0;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          margin: 0;
          border-radius: var(--r-card);
          background: var(--surface);
        }
        .kegiatan-media img, .kegiatan-media video {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .kegiatan-media video { background: #071321; }
        @media (max-width: 48em) {
          .kegiatan-layout { grid-template-columns: minmax(0, 1fr); gap: 2rem; }
          .kegiatan-gallery { gap: 0.625rem; }
          .kegiatan-media { border-radius: max(0.5rem, var(--r-card)); }
        }
      `}</style>
    </section>
  )
}
