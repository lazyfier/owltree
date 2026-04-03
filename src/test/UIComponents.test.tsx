import { render, screen } from '@testing-library/react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { PixelDivider } from '@/components/ui/PixelDivider'

import '@testing-library/jest-dom/vitest'

describe('UI Components', () => {
  describe('Card', () => {
    it('renders with glass variant', () => {
    render(<Card variant="glass">Glass Card</Card>)
    expect(screen.getByText('Glass Card')).toBeInTheDocument()
    expect(screen.getByText('Glass Card')).toHaveClass('glass-card')
  })

  it('renders with interactive variant', () => {
    render(<Card variant="interactive">Interactive Card</Card>)
    expect(screen.getByText('Interactive Card')).toBeInTheDocument()
    expect(screen.getByText('Interactive Card')).toHaveClass('hover:-translate-y-2')
  })

  it('renders with pixel variant', () => {
    render(<Card variant="pixel">Pixel Card</Card>)
    expect(screen.getByText('Pixel Card')).toBeInTheDocument()
    expect(screen.getByText('Pixel Card')).toHaveClass('pixel-card')
  })

  it('renders with featured variant', () => {
    render(<Card variant="featured">Featured Card</Card>)
    expect(screen.getByText('Featured Card')).toBeInTheDocument()
    expect(screen.getByText('Featured Card')).toHaveClass('glow-border')
  })
})

describe('Badge', () => {
  it('renders with default variant', () => {
    render(<Badge>Default Badge</Badge>)
    expect(screen.getByText('Default Badge')).toBeInTheDocument()
  })

  it('renders with pixel variant', () => {
    render(<Badge variant="pixel">Pixel Badge</Badge>)
    expect(screen.getByText('Pixel Badge')).toBeInTheDocument()
    expect(screen.getByText('Pixel Badge')).toHaveClass('pixel-badge')
  })

  it('renders with teal color', () => {
    render(<Badge color="teal">Teal Badge</Badge>)
    expect(screen.getByText('Teal Badge')).toBeInTheDocument()
    expect(screen.getByText('Teal Badge')).toHaveClass('text-teal-accent')
  })

  it('renders with coral color', () => {
    render(<Badge color="coral">Coral Badge</Badge>)
    expect(screen.getByText('Coral Badge')).toBeInTheDocument()
    expect(screen.getByText('Coral Badge')).toHaveClass('text-coral')
  })

  it('renders with amber color', () => {
    render(<Badge color="amber">Amber Badge</Badge>)
    expect(screen.getByText('Amber Badge')).toBeInTheDocument()
    expect(screen.getByText('Amber Badge')).toHaveClass('text-amber-accent')
  })
})

describe('PixelDivider', () => {
  it('renders divider element', () => {
    render(<PixelDivider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
    expect(screen.getByRole('separator')).toHaveClass('pixel-divider')
  })

  it('accepts custom className', () => {
    render(<PixelDivider className="custom-divider" />)
    expect(screen.getByRole('separator')).toHaveClass('custom-divider')
  })
})
})
