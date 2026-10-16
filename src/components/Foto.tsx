import { useState } from "react"
import { PLACEHOLDER_FOTO } from "../data/pengurus"

export default function Foto({
  src, alt, className = "", style,
}: {
  src: string; alt: string; className?: string; style?: React.CSSProperties
}) {
  const [err, setErr] = useState(false)
  return (
    <img
      src={err ? PLACEHOLDER_FOTO : src}
      alt={alt}
      loading="lazy"
      onError={() => setErr(true)}
      className={className}
      style={style}
    />
  )
}
