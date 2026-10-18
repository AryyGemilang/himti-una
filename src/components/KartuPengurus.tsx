import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import type { Orang } from "../data/pengurus"
import Foto from "./Foto"

const CLOSE_DURATION = 180

export default function KartuPengurus({ orang, delay = 0, size = "md" }: {
  orang: Orang
  delay?: number
  size?: "lg" | "md" | "sm"
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const cardButtonRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closingRef = useRef(false)
  const nameSize = size === "lg" ? "var(--step-lg)" : size === "md" ? "var(--step-md)" : "var(--step-sm)"

  const closeProfile = useCallback(() => {
    if (!isOpen || closingRef.current) return
    closingRef.current = true
    setIsClosing(true)
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : CLOSE_DURATION
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      closingRef.current = false
      closeTimerRef.current = null
    }, duration)
  }, [isOpen])

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const triggerButton = cardButtonRef.current
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = "hidden"
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`

    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus())
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        closeProfile()
        return
      }
      if (event.key !== "Tab" || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!dialogRef.current.contains(document.activeElement)) {
        event.preventDefault()
        first.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    return () => {
      cancelAnimationFrame(focusFrame)
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
      if (triggerButton?.isConnected) triggerButton.focus()
    }
  }, [closeProfile, isOpen])

  return (
    <>
      <div className="reveal bezel" style={{ ["--d" as string]: `${delay}ms` }}>
        <div className="bezel-inner pengurus-card-inner">
          <button
            ref={cardButtonRef}
            type="button"
            className="pengurus-card-button"
            aria-haspopup="dialog"
            aria-label={`Lihat detail ${orang.nama}, ${orang.jabatan}`}
            onClick={() => {
              if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
              closeTimerRef.current = null
              closingRef.current = false
              setIsClosing(false)
              setIsOpen(true)
            }}
          >
            <span className="pengurus-photo-frame" aria-hidden="true">
              <Foto
                src={orang.foto}
                alt=""
                className="pengurus-photo"
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 58%", display: "block" }}
              />
            </span>
            <span className="pengurus-card-overlay">
              <span className="pengurus-card-name" style={{ fontSize: nameSize }}>{orang.nama}</span>
              <span className="pengurus-card-role">{orang.jabatan}</span>
            </span>
          </button>
        </div>
      </div>

      {isOpen && createPortal(
        <div
          className={`pengurus-modal-backdrop${isClosing ? " is-closing" : ""}`}
          onMouseDown={event => {
            if (event.target === event.currentTarget) closeProfile()
          }}
        >
          <div
            ref={dialogRef}
            className={`pengurus-modal${isClosing ? " is-closing" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pengurus-profile-title"
            aria-describedby="pengurus-profile-role"
            tabIndex={-1}
          >
            <div className="pengurus-modal-photo-wrap">
              <Foto src={orang.foto} alt={`Foto ${orang.nama}`} className="pengurus-modal-photo" />
            </div>
            <div className="pengurus-modal-info">
              <p className="label">Pengurus HIMTI UNA</p>
              <h2 id="pengurus-profile-title">{orang.nama}</h2>
              <p id="pengurus-profile-role">{orang.jabatan}</p>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className="pengurus-modal-close"
              aria-label="Tutup detail pengurus"
              onClick={closeProfile}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
