interface VNPortraitProps {
  emoji: string
  size?: 'normal' | 'large'
  isPanic?: boolean
}

export function VNPortrait({ emoji, size = 'normal', isPanic = false }: VNPortraitProps) {
  const containerSize = size === 'large' ? 'w-32 h-32' : 'w-20 h-20'
  const emojiSize = size === 'large' ? 'text-6xl' : 'text-4xl'
  const panicClass = isPanic ? 'animate-[panic-shake_0.5s_infinite]' : ''

  return (
    <div className="vn-portrait-fade flex flex-col items-center" data-testid="partner-avatar">
      <div
        className={`${containerSize} mx-auto bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center shadow-xl border-2 border-slate-600 avatar-float relative ${panicClass}`}
      >
        <span className={`${emojiSize} leading-none select-none`} aria-hidden="true">
          {emoji}
        </span>
      </div>
    </div>
  )
}
