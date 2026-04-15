interface GameHeaderProps {
  turn: number
}

export function GameHeader({ turn }: GameHeaderProps) {
  return (
    <div className="px-8 py-5 border-b border-[var(--vn-border)] bg-black/20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--vn-name)]">月抛模拟器</h1>
        <span className="text-lg text-slate-400">回合 {turn}</span>
      </div>
    </div>
  )
}
