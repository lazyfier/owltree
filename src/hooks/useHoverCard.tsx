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
    const vh = window.innerHeight
    const actualCardWidth =
      vw <= 1024 ? Math.min(320, vw - viewportPadding * 2) : cardWidth
    const rightSide = rect.right + gap
    const leftSide = rect.left - actualCardWidth - gap
    const maxLeft = Math.max(viewportPadding, vw - actualCardWidth - viewportPadding)
    let left = rect.right + gap

    if (rightSide + actualCardWidth <= vw - viewportPadding) {
      left = rightSide
    } else if (leftSide >= viewportPadding) {
      left = leftSide
    } else {
      left = Math.min(Math.max(rect.left, viewportPadding), maxLeft)
    }

    const preferredTop =
      rightSide + actualCardWidth <= vw - viewportPadding || leftSide >= viewportPadding
        ? rect.top - 10
        : rect.bottom + gap
    const top = Math.min(Math.max(preferredTop, viewportPadding), vh - viewportPadding)

    setPosition({ left, top, visible: true })
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
