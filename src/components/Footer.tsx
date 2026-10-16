const LETTERS = "HIMTI".split("")
const HEIGHTS = [85, 100, 92, 76, 95]
const UNA_L   = "UNA".split("")
const UNA_H   = [80, 100, 70]

const NAV = [
  ["Beranda","#beranda"],["Tentang","#tentang"],["Sejarah","#sejarah"],
  ["Visi Misi","#visimisi"],["Pengurus","#pengurus"],["Kegiatan","#kegiatan"],["Kontak","#kontak"],
]

export default function Footer() {
  return (
    <footer style={{ background: "var(--surface)" }}>

      {/* Mark band */}
      <div className="wrap" style={{ paddingTop: "5rem", paddingBottom: "2rem" }}>
        <div className="mark-band reveal" style={{ height: "clamp(56px, 12vw, 140px)" }} aria-hidden>
          {LETTERS.map((l, i) => (
            <div key={i} className="mark-letter" style={{
              height: `${HEIGHTS[i]}%`,
              width: "clamp(36px, 7vw, 88px)",
              fontSize: "clamp(1rem, 3.5vw, 3.5rem)",
            }}>{l}</div>
          ))}
          <div style={{ width: "clamp(8px, 1.5vw, 20px)" }} />
          {UNA_L.map((l, i) => (
            <div key={`u${i}`} className="mark-letter" style={{
              height: `${UNA_H[i]}%`,
              width: "clamp(36px, 7vw, 88px)",
              fontSize: "clamp(1rem, 3.5vw, 3.5rem)",
              background: "rgba(59,130,246,.15)",
              color: "var(--accent)",
            }}>{l}</div>
          ))}
        </div>
        <p className="sr-only">HIMTI UNA — Himpunan Mahasiswa Teknik Informatika Universitas Asahan</p>
      </div>

      {/* Links row */}
      <div className="wrap" style={{ paddingBottom: "4rem" }}>
        <div className="footer-grid">

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <img src="/himti-una/Logo-Himti.svg" alt="Logo HIMTI"
                style={{ height: 32, width: "auto", objectFit: "contain" }} />
              <img src="/himti-una/Logo-Una.svg" alt="Logo UNA"
                style={{ height: 28, width: "auto", objectFit: "contain", opacity: 0.7 }} />
            </div>
            <p style={{ fontSize: "var(--step-sm)", color: "var(--muted)", maxWidth: "36ch", margin: 0 }}>
              Himpunan Mahasiswa Teknik Informatika Universitas Asahan, wadah aspirasi,
              prestasi, dan inovasi mahasiswa IT sejak 1 Oktober 2013.
            </p>
          </div>

          <div>
            <p className="label" style={{ marginBottom: "1.25rem" }}>Navigasi</p>
            <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "0.625rem" }}>
              {NAV.map(([l, h]) => (
                <li key={h}>
                  <a href={h} style={{ fontSize: "var(--step-sm)", color: "var(--muted)", textDecoration: "none", transition: "color 160ms ease" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--ink)" }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--muted)" }}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label" style={{ marginBottom: "1.25rem" }}>Lokasi</p>
            <p style={{ fontSize: "var(--step-sm)", color: "var(--muted)" }}>
              Fakultas Teknik<br />Universitas Asahan<br />Kisaran, Sumatera Utara
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p style={{ fontSize: "var(--step-xs)", color: "var(--muted-2)", margin: 0 }}>
            © {new Date().getFullYear()} HIMTI Universitas Asahan
          </p>
          <a href="/#beranda" className="btn" style={{ fontSize: "var(--step-xs)", minHeight: "2.25rem", padding: "0 1.1rem" }}>
            Kembali ke atas
          </a>
        </div>
      </div>

      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 3rem;
          padding-top: 2.5rem;
        }
        .footer-bottom {
          margin-top: 3rem;
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }
        @media (max-width: 48em) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </footer>
  )
}
