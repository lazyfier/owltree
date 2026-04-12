import { useEffect, useState } from 'react'

interface VNTransitionProps {
  isTransitioning: boolean
  onTransitionEnd?: () => void
  duration?: number
}

export function VNTransition({ isTransitioning, onTransitionEnd, duration = 800 }: VNTransitionProps) {
  const [phase, setPhase] = useState<'idle' | 'in' | 'hold' | 'out'>('idle')

  useEffect(() => {
    if (!isTransitioning) { setPhase('idle'); return }
    setPhase('in')
    const t1 = setTimeout(() => setPhase('hold'), duration / 2)
    const t2 = setTimeout(() => setPhase('out'), duration * 0.65)
    const t3 = setTimeout(() => { setPhase('idle'); onTransitionEnd?.() }, duration)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [isTransitioning, duration, onTransitionEnd])

  if (phase === 'idle') return null
  const opacity = phase === 'out' ? 0 : 1

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 z-50 pointer-events-none"
      style={{
        background: '#000',
        opacity,
        transition: `opacity ${phase === 'out' ? duration * 0.35 : duration * 0.5}ms ease-${phase === 'out' ? 'in' : 'out'}`,
      }}
    />
  )
}
