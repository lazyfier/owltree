import React from 'react'
import { cn } from '@/lib/cn'

const cardVariants = {
  glass: 'glass-card',
  interactive: 'glass-card hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]',
  pixel: 'pixel-card',
  featured: 'glass-card glow-border border-2 border-teal-accent',
} as const

interface CardProps {
  children: React.ReactNode
  variant?: keyof typeof cardVariants
  className?: string
  onClick?: () => void
}

export function Card({
  children,
  variant = 'glass',
  className,
  onClick,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-4',
        cardVariants[variant],
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick()
        }
      } : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  )
}
