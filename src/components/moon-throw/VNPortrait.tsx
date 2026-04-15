interface VNPortraitProps {
  asciiArt: string[]
  name?: string
  size?: 'normal' | 'large'
}

const DEFAULT_PORTRAIT = [
  '    ╭──────╮',
  '    │ ◕ ◕ │',
  '    │  ▽  │',
  '    ╰──────╯',
]

export function VNPortrait({ asciiArt, name, size = 'normal' }: VNPortraitProps) {
  const lines = asciiArt.length > 0 ? asciiArt : DEFAULT_PORTRAIT
  const fontSize = size === 'large' ? '1.5rem' : '0.875rem'
  return (
    <div className="vn-portrait-fade flex flex-col items-center" data-testid="partner-avatar">
      <pre className="vn-portrait-ascii" style={{ color: 'var(--vn-accent)', fontSize, lineHeight: '1.1' }}>
        {lines.join('\n')}
      </pre>
      {name && <span className={`text-slate-500 mt-2 tracking-wider ${size === 'large' ? 'text-sm' : 'text-xs'}`}>{name}</span>}
    </div>
  )
}
