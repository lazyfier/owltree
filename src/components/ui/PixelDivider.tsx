import { cn } from '@/lib/cn'

interface PixelDividerProps {
  className?: string
}

export function PixelDivider({ className }: PixelDividerProps) {
  return (
    <hr
      className={cn('pixel-divider', className)}
    />
  )
}
