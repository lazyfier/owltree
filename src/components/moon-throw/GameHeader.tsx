export function GameHeader({ turn }: { turn: number }) {
  return (
    <div className="glass-card flex items-center justify-between px-4 py-3 mb-4">
      <h1 className="font-pixel text-teal-accent text-sm tracking-wider">月抛模拟器</h1>
      <span className="font-pixel text-xs text-slate-400">
        ROUND {String(turn).padStart(2, '0')}
      </span>
    </div>
  )
}
