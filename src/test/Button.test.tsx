import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders with primary variant by default', () => {
    render(<Button variant="primary">Primary Button</Button>)
    expect(screen.getByRole('button', { name: /primary button/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('glass-button')
    expect(screen.getByRole('button')).toHaveClass('bg-teal-accent/20')
  })

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Secondary Button</Button>)
    expect(screen.getByRole('button', { name: /secondary button/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('glass-button')
    expect(screen.getByRole('button')).toHaveClass('bg-ink-blue/50')
  })

  it('renders with ghost variant', () => {
    render(<Button variant="ghost">Ghost Button</Button>)
    expect(screen.getByRole('button', { name: /ghost button/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).not.toHaveClass('glass-button')
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('renders with danger variant', () => {
    render(<Button variant="danger">Danger Button</Button>)
    expect(screen.getByRole('button', { name: /danger button/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('glass-button')
    expect(screen.getByRole('button')).toHaveClass('border-2')
    expect(screen.getByRole('button')).toHaveClass('border-coral')
  })

  it('renders with pixel variant', () => {
    render(<Button variant="pixel">Pixel Button</Button>)
    expect(screen.getByRole('button', { name: /pixel button/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).not.toHaveClass('glass-button')
    expect(screen.getByRole('button')).toHaveClass('pixel-card')
  })

  it('renders with small size', () => {
    render(<Button size="sm">Small Button</Button>)
    expect(screen.getByRole('button', { name: /small button/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('px-3')
    expect(screen.getByRole('button')).toHaveClass('py-1.5')
  })

  it('renders with large size', () => {
    render(<Button size="lg">Large Button</Button>)
    expect(screen.getByRole('button', { name: /large button/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('px-6')
    expect(screen.getByRole('button')).toHaveClass('py-3')
  })

  it('renders with medium size by default', () => {
    render(<Button>Default Button</Button>)
    expect(screen.getByRole('button', { name: /default button/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('px-4')
    expect(screen.getByRole('button')).toHaveClass('py-2')
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom Button</Button>)
    expect(screen.getByRole('button', { name: /custom button/i })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('px-4')
    expect(screen.getByRole('button')).toHaveClass('py-2')
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('applies disabled state correctly', () => {
    render(<Button disabled>Disabled Button</Button>)
    expect(screen.getByRole('button', { name: /disabled button/i })).toBeDisabled()
  })
})
