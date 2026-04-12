import React from 'react'
import { cn } from '@/lib/cn'

const cardVariants = {
  glass: 'rounded-xl bg-slate-900/95 border border-white/10',
  interactive: 'rounded-xl bg-slate-900/95 border border-white/10 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]',
  pixel: 'rounded-lg border-2 border-teal-accent bg-slate-900/90',
  featured: 'rounded-xl bg-slate-900/95 border-2 border-teal-accent glow-border',
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
    <button
      type="button"
      className={cn(
        'rounded-lg p-4 text-left w-full',
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
    </button>
  )
}
