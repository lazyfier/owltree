import { cleanup, render, screen } from '@testing-library/react'

import { ParticleBackground } from '@/components/ui/ParticleBackground'

const originalMatchMedia = window.matchMedia
const originalRequestAnimationFrame = window.requestAnimationFrame
const originalCancelAnimationFrame = window.cancelAnimationFrame
const originalDevicePixelRatio = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')
const originalGetContext = HTMLCanvasElement.prototype.getContext

function mockMatchMedia(matches: boolean) {
  return vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

function createCanvasContextStub() {
  return {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillRect: vi.fn(),
    scale: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    fillStyle: '',
    globalAlpha: 1,
  } as unknown as CanvasRenderingContext2D
}

describe('ParticleBackground', () => {
  beforeEach(() => {
    window.matchMedia = mockMatchMedia(false)
    window.requestAnimationFrame = vi.fn(() => 42)
    window.cancelAnimationFrame = vi.fn()
    Object.defineProperty(window, 'devicePixelRatio', {
      configurable: true,
      value: 1,
    })
    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: vi.fn(() => createCanvasContextStub()),
    })
  })

  afterEach(() => {
    cleanup()
    window.matchMedia = originalMatchMedia
    window.requestAnimationFrame = originalRequestAnimationFrame
    window.cancelAnimationFrame = originalCancelAnimationFrame

    if (originalDevicePixelRatio) {
      Object.defineProperty(window, 'devicePixelRatio', originalDevicePixelRatio)
    }

    Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
      configurable: true,
      value: originalGetContext,
    })
  })

  it('returns null when reduced motion is preferred', () => {
    window.matchMedia = mockMatchMedia(true)

    const { container } = render(<ParticleBackground />)

    expect(container.firstChild).toBeNull()
  })

  it('renders a background canvas with non-interactive positioning classes', () => {
    render(<ParticleBackground />)

    const canvas = screen.getByTestId('particle-background')

    expect(canvas.tagName).toBe('CANVAS')
    expect(canvas).toHaveClass('pointer-events-none')
    expect(canvas).toHaveClass('absolute')
    expect(canvas).toHaveClass('inset-0')
  })

  it('cancels the scheduled animation frame on unmount', () => {
    const { unmount } = render(<ParticleBackground />)

    unmount()

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(42)
  })
})
