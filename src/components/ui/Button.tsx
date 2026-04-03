import React, { forwardRef } from 'react'
import { cn } from '@/lib/cn'

const buttonVariants = {
  primary: 'glass-button bg-teal-accent/20 text-white hover:bg-teal-accent/30',
  secondary: 'glass-button bg-ink-blue/50 text-slate-100 hover:bg-ink-blue/70',
  ghost: 'bg-transparent text-slate-100 hover:bg-ink-blue/30 hover:shadow-[0_0_10px_rgba(45,212,191,0.1)]',
  danger: 'glass-button border-2 border-coral text-coral hover:bg-coral/10',
  pixel: 'pixel-card border-2 border-teal-accent text-teal-accent font-pixel hover:shadow-pixel',
} as const

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
} as const

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  icon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, icon, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
