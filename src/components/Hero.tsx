import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react"
import { ArrowRight } from "lucide-react"

const HERO_IMAGE = "/himti-una/images/home/hero/musyawarah-besar-himti-una.jpg"
const TYPING_TITLE = "Teknik Informatika"
const BUBBLE_INTERACTION_RADIUS = 190
const BUBBLE_MAX_SHIFT = 34

function useTypingTitle() {
  const [text, setText] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ? TYPING_TITLE : "",
  )

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let timeout = 0
    let position = motionPreference.matches ? TYPING_TITLE.length : 0
    let deleting = false

    const tick = () => {
      if (deleting) {
        position = Math.max(0, position - 1)
        setText(TYPING_TITLE.slice(0, position))
        if (position === 0) {
          deleting = false
          timeout = window.setTimeout(tick, 550)
        } else {
          timeout = window.setTimeout(tick, 55)
        }
        return
      }

      position = Math.min(TYPING_TITLE.length, position + 1)
      setText(TYPING_TITLE.slice(0, position))
      if (position === TYPING_TITLE.length) {
        deleting = true
        timeout = window.setTimeout(tick, 1400)
      } else {
        timeout = window.setTimeout(tick, 95)
      }
    }

    const handleMotionChange = (event: MediaQueryListEvent) => {
      window.clearTimeout(timeout)
      if (event.matches) {
        position = TYPING_TITLE.length
        deleting = false
        setText(TYPING_TITLE)
      } else {
        position = 0
        deleting = false
        setText("")
        timeout = window.setTimeout(tick, 400)
      }
    }

    if (!motionPreference.matches) timeout = window.setTimeout(tick, 400)
    motionPreference.addEventListener("change", handleMotionChange)

    return () => {
      window.clearTimeout(timeout)
      motionPreference.removeEventListener("change", handleMotionChange)
    }
  }, [])

  return text
}

function moveBubblesFromPointer(event: ReactPointerEvent<HTMLElement>) {
  if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

  const figure = event.currentTarget
  const bounds = figure.getBoundingClientRect()
  const pointerX = event.clientX - bounds.left
  const pointerY = event.clientY - bounds.top

  figure.querySelectorAll<HTMLElement>(".hero-interactive-bubble").forEach((bubble, index) => {
    const centerX = bubble.offsetLeft + bubble.offsetWidth / 2
    const centerY = bubble.offsetTop + bubble.offsetHeight / 2
    const dx = centerX - pointerX
    const dy = centerY - pointerY
    const distance = Math.hypot(dx, dy)
    const proximity = Math.max(0, 1 - distance / BUBBLE_INTERACTION_RADIUS)
    const shift = proximity * proximity * BUBBLE_MAX_SHIFT
    const angle = distance > 0 ? Math.atan2(dy, dx) : index * (Math.PI / 2)

    bubble.style.setProperty("--cursor-x", `${Math.cos(angle) * shift}px`)
    bubble.style.setProperty("--cursor-y", `${Math.sin(angle) * shift}px`)
  })
}

function resetBubblePositions(event: ReactPointerEvent<HTMLElement>) {
  event.currentTarget.querySelectorAll<HTMLElement>(".hero-interactive-bubble").forEach((bubble) => {
    bubble.style.setProperty("--cursor-x", "0px")
    bubble.style.setProperty("--cursor-y", "0px")
  })
}

export default function Hero() {
  const typedTitle = useTypingTitle()

  return (
    <section id="beranda" className="section hero-section">
      <div className="wrap hero-wrap">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-institution">
              Program Studi Teknik Informatika | Universitas Asahan
            </p>
            <h1 className="display" aria-label="Himpunan Mahasiswa Teknik Informatika">
              <span className="hero-title-static" aria-hidden="true">Himpunan Mahasiswa</span>
              <span className="hero-title-typing" aria-hidden="true">
                {typedTitle}<span className="hero-typing-caret" />
              </span>
            </h1>
            <div className="hero-actions">
              <a href="/tentang" className="btn">
                Kenali HIMTI <span className="icon-bubble" aria-hidden><ArrowRight size={14} /></span>
              </a>
              <a href="/kegiatan" className="hero-secondary-link">
                Lihat kegiatan <ArrowRight size={17} aria-hidden />
              </a>
            </div>
          </div>

          <figure
            className="hero-visual"
            onPointerMove={moveBubblesFromPointer}
            onPointerLeave={resetBubblePositions}
          >
            <div className="hero-photo-frame">
              <img
                src={HERO_IMAGE}
                alt="Anggota HIMTI UNA pada kegiatan Musyawarah Besar"
                width={4536}
                height={3402}
                fetchPriority="high"
              />
            </div>
            <span className="hero-bubble hero-bubble-one hero-interactive-bubble" aria-hidden="true" />
            <span className="hero-bubble hero-bubble-two hero-interactive-bubble" aria-hidden="true" />
            <span className="hero-bubble hero-bubble-three hero-interactive-bubble" aria-hidden="true" />
            <span className="hero-logo-float hero-interactive-bubble" aria-hidden="true">
              <img src="/himti-una/images/branding/logo-himti.webp" alt="" />
            </span>
          </figure>
        </div>
      </div>
    </section>
  )
}
