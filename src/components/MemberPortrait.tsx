import Foto from "./Foto"

export default function MemberPortrait({
  src,
  alt,
  size = "regular",
  badge = false,
  shape = "rounded",
}: {
  src: string
  alt: string
  size?: "large" | "regular"
  badge?: boolean
  shape?: "rounded" | "circle-overlap"
}) {
  return (
    <div className={`member-portrait member-portrait-${size}${shape === "circle-overlap" ? " member-portrait-circle-overlap" : ""}`}>
      {shape === "circle-overlap" ? (
        <>
          <div className="member-portrait-circle-window">
            <Foto src={src} alt={alt} className="member-portrait-circle-image" />
          </div>
          <Foto src={src} alt="" className="member-portrait-circle-upper" />
        </>
      ) : (
        <Foto src={src} alt={alt} className="member-portrait-image" />
      )}
      {badge && <span className="member-portrait-badge" aria-hidden="true" />}
    </div>
  )
}
