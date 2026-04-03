import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/cn'

type ParticleShape = 'circle' | 'square'

interface Particle {
  alpha: number
  frameOffset: number
  shape: ParticleShape
  size: number
  stepInterval: number
  vx: number
  vy: number
  x: number
  y: number
}

interface PointerState {
  active: boolean
  x: number
  y: number
}

interface CanvasSize {
  dpr: number
  height: number
  left: number
  top: number
  width: number
}

export interface ParticleBackgroundProps {
  className?: string
}

const POINTER_RADIUS = 100
const POINTER_RADIUS_SQUARED = POINTER_RADIUS * POINTER_RADIUS
const MIN_PARTICLES = 20
const MAX_PARTICLES = 80
const PARTICLE_AREA_DIVISOR = 15_000
const CIRCLE_RATIO = 0.8
const MAX_DPR = 2

function getParticleCount() {
  if (typeof window === 'undefined') {
    return MIN_PARTICLES
  }

  const count = Math.floor((window.innerWidth * window.innerHeight) / PARTICLE_AREA_DIVISOR)

  return Math.min(MAX_PARTICLES, Math.max(MIN_PARTICLES, count))
}

function getReducedMotionPreference() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function wrapPosition(value: number, max: number, padding: number) {
  if (value < -padding) {
    return max + padding
  }

  if (value > max + padding) {
    return -padding
  }

  return value
}

function createParticles(width: number, height: number) {
  const count = getParticleCount()
  const circleCount = Math.round(count * CIRCLE_RATIO)

  return Array.from({ length: count }, (_, index): Particle => {
    const shape: ParticleShape = index < circleCount ? 'circle' : 'square'
    const baseSpeed = shape === 'circle' ? 0.34 : 0.26

    return {
      alpha: shape === 'circle' ? randomInRange(0.14, 0.34) : randomInRange(0.22, 0.44),
      frameOffset: Math.floor(Math.random() * 3),
      shape,
      size: shape === 'circle' ? randomInRange(1.2, 3.2) : randomInRange(2, 4.2),
      stepInterval: shape === 'circle' ? 1 : Math.floor(randomInRange(2, 5)),
      vx: randomInRange(-baseSpeed, baseSpeed),
      vy: randomInRange(-baseSpeed, baseSpeed),
      x: Math.random() * width,
      y: Math.random() * height,
    }
  }).sort(() => Math.random() - 0.5)
}

function applyPointerRepulsion(particle: Particle, pointer: PointerState, canvasSize: CanvasSize) {
  if (!pointer.active) {
    return
  }

  const localPointerX = pointer.x - canvasSize.left
  const localPointerY = pointer.y - canvasSize.top
  const dx = particle.x - localPointerX
  const dy = particle.y - localPointerY
  const distanceSquared = dx * dx + dy * dy

  if (distanceSquared <= 1 || distanceSquared > POINTER_RADIUS_SQUARED) {
    return
  }

  const distance = Math.sqrt(distanceSquared)
  const pushStrength = ((POINTER_RADIUS - distance) / POINTER_RADIUS) * (particle.shape === 'circle' ? 1.8 : 2.6)

  particle.x += (dx / distance) * pushStrength
  particle.y += (dy / distance) * pushStrength
}

function updateParticle(particle: Particle, pointer: PointerState, frameCount: number, canvasSize: CanvasSize) {
  const shouldStep = particle.shape === 'circle' || (frameCount + particle.frameOffset) % particle.stepInterval === 0

  if (!shouldStep) {
    return
  }

  particle.x += particle.vx
  particle.y += particle.vy

  applyPointerRepulsion(particle, pointer, canvasSize)

  particle.x = wrapPosition(particle.x, canvasSize.width, particle.size * 2)
  particle.y = wrapPosition(particle.y, canvasSize.height, particle.size * 2)
}

function drawParticle(context: CanvasRenderingContext2D, particle: Particle) {
  context.fillStyle = `rgba(45, 212, 191, ${particle.alpha})`

  if (particle.shape === 'circle') {
    context.beginPath()
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
    context.fill()
    return
  }

  context.fillRect(particle.x, particle.y, particle.size, particle.size)
}

export function ParticleBackground({ className }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameIdRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const pointerRef = useRef<PointerState>({ active: false, x: -9999, y: -9999 })
  const sizeRef = useRef<CanvasSize>({ dpr: 1, height: 0, left: 0, top: 0, width: 0 })
  const reducedMotionRef = useRef(getReducedMotionPreference())
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(reducedMotionRef.current)

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      reducedMotionRef.current = event.matches
      setPrefersReducedMotion(event.matches)
    }

    handleChange(mediaQuery)

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)

      return () => {
        mediaQuery.removeEventListener('change', handleChange)
      }
    }

    mediaQuery.addListener(handleChange)

    return () => {
      mediaQuery.removeListener(handleChange)
    }
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) {
      return
    }

    const canvas = canvasRef.current

    if (!canvas) {
      return
    }

    const context = canvas.getContext('2d')

    if (!context) {
      return
    }

    let frameCount = 0

    const resetPointer = () => {
      pointerRef.current = { active: false, x: -9999, y: -9999 }
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = { active: true, x: event.clientX, y: event.clientY }
    }

    const resizeCanvas = () => {
      const bounds = canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(bounds.width || window.innerWidth))
      const height = Math.max(1, Math.round(bounds.height || window.innerHeight))
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)

      sizeRef.current = { dpr, height, left: bounds.left, top: bounds.top, width }
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      particlesRef.current = createParticles(width, height)
    }

    const renderFrame = () => {
      if (reducedMotionRef.current) {
        return
      }

      frameCount += 1

      const canvasSize = sizeRef.current

      context.clearRect(0, 0, canvasSize.width, canvasSize.height)

      for (const particle of particlesRef.current) {
        updateParticle(particle, pointerRef.current, frameCount, canvasSize)
        drawParticle(context, particle)
      }

      animationFrameIdRef.current = window.requestAnimationFrame(renderFrame)
    }

    resizeCanvas()
    resetPointer()
    animationFrameIdRef.current = window.requestAnimationFrame(renderFrame)

    window.addEventListener('resize', resizeCanvas)
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('pointerdown', handlePointerMove, { passive: true })
    window.addEventListener('pointerup', resetPointer)
    window.addEventListener('pointercancel', resetPointer)
    window.addEventListener('blur', resetPointer)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerdown', handlePointerMove)
      window.removeEventListener('pointerup', resetPointer)
      window.removeEventListener('pointercancel', resetPointer)
      window.removeEventListener('blur', resetPointer)

      if (animationFrameIdRef.current !== null) {
        window.cancelAnimationFrame(animationFrameIdRef.current)
        animationFrameIdRef.current = null
      }
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) {
    return null
  }

  return (
    <canvas
      ref={canvasRef}
      data-testid="particle-background"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  )
}
