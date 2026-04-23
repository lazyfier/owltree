import { useState, useEffect, useCallback, useRef } from 'react'

interface VNDialogueBoxProps {
  speaker: string
  text: string
  onComplete?: () => void
  isTyping?: boolean
  className?: string
}

const CHAR_INTERVAL_MS = 40

export function VNDialogueBox({ speaker, text, onComplete, isTyping = true, className = '' }: VNDialogueBoxProps) {
  const [displayedLength, setDisplayedLength] = useState(0)
  const [skipped, setSkipped] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const shouldType = isTyping && import.meta.env.MODE !== 'test'
  const isComplete = displayedLength >= text.length

  useEffect(() => {
    if (!shouldType) {
      setDisplayedLength(text.length)
      setSkipped(true)
      return
    }
  }, [shouldType, text])

  useEffect(() => {
    if (!shouldType || isComplete || skipped) {
      if ((isComplete || skipped) && displayedLength >= text.length && onComplete) {
        onComplete()
      }
      return
    }
    intervalRef.current = setInterval(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1
        if (next >= text.length && intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
        return next
      })
    }, CHAR_INTERVAL_MS)
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [text, shouldType, isComplete, skipped, displayedLength, onComplete])

  const handleSkip = useCallback(() => {
    if (!isComplete && !skipped) {
      setSkipped(true)
      setDisplayedLength(text.length)
    }
  }, [isComplete, skipped, text.length])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        handleSkip()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSkip])

  const displayedText = skipped ? text : text.slice(0, displayedLength)
  const showCursor = !skipped && displayedLength < text.length

  return (
    <button
      type="button"
      className={`vn-dialogue relative cursor-pointer select-none text-left w-full ${className}`}
      onClick={handleSkip}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-xl" style={{ background: 'linear-gradient(90deg, transparent, var(--vn-accent), var(--vn-name), var(--vn-accent), transparent)' }} />
      {speaker.trim() && <div className="vn-dialogue-name">{speaker}</div>}
      <div className="vn-dialogue-text">
        {displayedText}
        {showCursor && <span className="inline-block w-[2px] h-[1em] ml-[2px] align-middle animate-pulse" style={{ background: 'var(--vn-accent)' }} />}
      </div>
    </button>
  )
}
