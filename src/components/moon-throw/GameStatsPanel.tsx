import type { GameStats } from '@/game/engine/stats'

interface GameStatsPanelProps {
  stats: GameStats
}

export function GameStatsPanel({ stats }: GameStatsPanelProps) {
  const { outcomeCounts, actionCounts, survivedTurns } = stats

  return (
    <div className="mt-4 bg-slate-950/50 rounded-xl p-3 border border-white/5 text-xs">
      <h4 className="text-slate-500 font-bold uppercase tracking-widest mb-2 text-center text-[10px]">生涯结果</h4>
      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
        <div className="flex justify-between items-center border-b border-white/5 pb-1">
          <span className="text-blue-300">✅ 理智享受</span>
          <span className="font-mono font-bold text-white text-sm">{outcomeCounts.enjoy}</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/5 pb-1">
          <span className="text-emerald-300">🛡️ 正确离开</span>
          <span className="font-mono font-bold text-white text-sm">{outcomeCounts.leave}</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/5 pb-1">
          <span className="text-amber-300">😰 死里逃生</span>
          <span className="font-mono font-bold text-white text-sm">{outcomeCounts.escape}</span>
        </div>
        <div className="flex justify-between items-center border-b border-white/5 pb-1">
          <span className="text-slate-400">👋 遗憾错过</span>
          <span className="font-mono font-bold text-white text-sm">{outcomeCounts.miss}</span>
        </div>
        <div className="col-span-2 flex justify-between items-center border-b border-white/5 pb-1 bg-rose-950/20 px-1 -mx-1 rounded">
          <span className="text-rose-400 font-bold">💀 被感染次数</span>
          <span className="font-mono font-black text-rose-400 text-sm">{outcomeCounts.infected}</span>
        </div>
      </div>

      <h4 className="text-slate-500 font-bold uppercase tracking-widest mb-2 text-center text-[10px]">行为统计 (次数)</h4>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <div className="bg-rose-900/20 border border-rose-500/20 rounded p-1 text-center">
          <div className="text-[9px] text-rose-300 opacity-70">无套性交</div>
          <div className="font-mono font-bold text-rose-200">{actionCounts.sex_raw}</div>
        </div>
        <div className="bg-amber-900/20 border border-amber-500/20 rounded p-1 text-center">
          <div className="text-[9px] text-amber-300 opacity-70">无套口交</div>
          <div className="font-mono font-bold text-amber-200">{actionCounts.oral_raw}</div>
        </div>
        <div className="bg-emerald-900/20 border border-emerald-500/20 rounded p-1 text-center">
          <div className="text-[9px] text-emerald-300 opacity-70">戴套性交</div>
          <div className="font-mono font-bold text-emerald-200">{actionCounts.sex_condom}</div>
        </div>
        <div className="bg-slate-800/50 border border-white/10 rounded p-1 text-center">
          <div className="text-[9px] text-slate-400 opacity-70">戴套口交</div>
          <div className="font-mono font-bold text-slate-300">{actionCounts.oral_condom}</div>
        </div>
        <div className="col-span-2 bg-slate-800 border border-white/5 rounded p-1 flex justify-between px-3 items-center">
          <div className="text-[9px] text-slate-400">👋 拒绝/离开</div>
          <div className="font-mono font-bold text-white">{actionCounts.refuse}</div>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center">
        <span className="font-bold text-slate-300">⏱️ 存活回合</span>
        <span className="font-mono font-black text-xl text-white">{survivedTurns}</span>
      </div>
    </div>
  )
}
