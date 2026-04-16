interface VNPortraitProps {
  emoji: string
  name?: string
  size?: 'normal' | 'large'
  isPanic?: boolean
}

export function VNPortrait({ emoji, name, size = 'normal', isPanic = false }: VNPortraitProps) {
  const sizeClass = size === 'large' ? 'text-[8rem]' : 'text-6xl'
  const glowColor = isPanic ? 'var(--vn-danger-glow)' : 'var(--vn-cyan-glow)'
  
  return (
    <div className="vn-portrait-fade flex flex-col items-center" data-testid="partner-avatar">
      <span 
        className={`vn-emoji-portrait ${sizeClass} leading-none`}
        style={{ 
          filter: `drop-shadow(0 0 20px ${glowColor}) drop-shadow(0 0 40px ${glowColor})`,
          animation: 'vn-breathe 3s ease-in-out infinite'
        }}
        aria-hidden="true"
      >
        {emoji}
      </span>
      {name && <span className={`text-slate-500 mt-4 tracking-wider ${size === 'large' ? 'text-sm' : 'text-xs'}`}>{name}</span>}
    </div>
  )
}
