export type ScrollUpdate = { y: number; delta: number }
type ScrollSubscriber = (update: ScrollUpdate) => void

const subscribers = new Set<ScrollSubscriber>()
let previousScrollY = 0
let animationFrame = 0

const publishScroll = () => {
  if (animationFrame) return
  animationFrame = window.requestAnimationFrame(() => {
    animationFrame = 0
    const y = Math.max(0, window.scrollY)
    const update = { y, delta: y - previousScrollY }
    previousScrollY = y
    for (const subscriber of [...subscribers]) subscriber(update)
  })
}

export function subscribeToScroll(subscriber: ScrollSubscriber) {
  if (subscribers.size === 0) {
    previousScrollY = Math.max(0, window.scrollY)
    window.addEventListener("scroll", publishScroll, { passive: true })
  }

  subscribers.add(subscriber)
  subscriber({ y: Math.max(0, window.scrollY), delta: 0 })

  return () => {
    subscribers.delete(subscriber)
    if (subscribers.size !== 0) return
    window.removeEventListener("scroll", publishScroll)
    if (animationFrame) window.cancelAnimationFrame(animationFrame)
    animationFrame = 0
  }
}
