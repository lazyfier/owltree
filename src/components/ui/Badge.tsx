import React from 'react'
import { cn } from '@/lib/cn'

const badgeVariants = {
  default: 'glass-card px-3 py-1 text-xs font-semibold rounded-full',
  pixel: 'pixel-badge',
} as const

const badgeColors = {
  teal: 'text-teal-accent border-teal-accent/50',
  coral: 'text-coral border-coral/50',
  amber: 'text-amber-accent border-amber-accent/50',
} as const

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'pixel'
  color?: 'teal' | 'coral' | 'amber'
  className?: string
}

export function Badge({ children, variant = 'default', color = 'teal', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        badgeVariants[variant],
        badgeColors[color],
        className
      )}
    >
      {children}
    </span>
  )
}
