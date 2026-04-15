import { useRef, useCallback, useState } from 'react'
import { createPortal } from 'react-dom'

interface HoverCardPosition {
  left: number
  top: number
  visible: boolean
}

interface UseHoverCardOptions {
  cardWidth?: number
  gap?: number
  viewportPadding?: number
}

const DEFAULTS = { cardWidth: 240, gap: 12, viewportPadding: 16 }

export function useHoverCard(options: UseHoverCardOptions = {}) {
  const cardWidth = options.cardWidth ?? DEFAULTS.cardWidth
  const gap = options.gap ?? DEFAULTS.gap
  const viewportPadding = options.viewportPadding ?? DEFAULTS.viewportPadding

  const anchorRef = useRef<HTMLElement>(null)
  const [position, setPosition] = useState<HoverCardPosition>({
    left: 0,
    top: 0,
    visible: false,
  })

  const show = useCallback(() => {
    const anchor = anchorRef.current
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    const vw = window.innerWidth
    let left = rect.right + gap
    if (left + cardWidth > vw - viewportPadding) {
      left = rect.left - cardWidth - gap
    }
    setPosition({ left, top: rect.top - 10, visible: true })
  }, [cardWidth, gap, viewportPadding])

  const hide = useCallback(() => {
    setPosition((prev) => ({ ...prev, visible: false }))
  }, [])

  const renderPortal = (children: React.ReactNode) => {
    if (!position.visible) return null
    return createPortal(
      <div
        className="t-hover-card t-visible"
        style={{ left: position.left, top: position.top }}
      >
        {children}
      </div>,
      document.body,
    )
  }

  return { anchorRef, show, hide, renderPortal, position } as const
}
