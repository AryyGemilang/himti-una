import Foto from "./Foto"

export default function MemberPortrait({
  src,
  alt,
  size = "regular",
  badge = false,
}: {
  src: string
  alt: string
  size?: "large" | "regular"
  badge?: boolean
}) {
  return (
    <div className={`member-portrait member-portrait-${size}`}>
      <Foto src={src} alt={alt} className="member-portrait-image" />
      {badge && <span className="member-portrait-badge" aria-hidden="true" />}
    </div>
  )
}
