const SECTIONS = ["beranda", "tentang", "sejarah", "visimisi", "pengurus", "kegiatan", "kontak"]
const LABELS   = ["Beranda", "Tentang", "Sejarah", "Visi Misi", "Pengurus", "Kegiatan", "Kontak"]

export default function SlideIndicator() {
  return (
    <nav className="slide-indicator hide-mobile" aria-label="Navigasi section">
      {SECTIONS.map((id, i) => (
        <a
          key={id}
          href={`#${id}`}
          className="slide-dot"
          aria-label={LABELS[i]}
          title={LABELS[i]}
        />
      ))}
      <span className="slide-counter" aria-hidden>01 / 07</span>
    </nav>
  )
}
