import { cn } from '@/lib/cn'

describe('cn utility', () => {
  it('merges non-conflicting class names', () => {
    const result = cn('base-class', 'variant-class', 'another-class')
    expect(result).toBe('base-class variant-class another-class')
  })

  it('resolves conflicting Tailwind classes by keeping the last one', () => {
    const result = cn('px-2', 'px-4')
    expect(result).toBe('px-4')
  })

  it('handles conditional classes', () => {
    const result = cn('base', false && 'hidden', 'visible')
    expect(result).toBe('base visible')
  })

  it('merges object and string classes', () => {
    const result = cn('base', { active: true, disabled: false }, 'extra')
    expect(result).toContain('base')
    expect(result).toContain('active')
    expect(result).toContain('extra')
    expect(result).not.toContain('disabled')
  })
})
