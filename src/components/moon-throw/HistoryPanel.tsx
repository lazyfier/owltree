import type { TurnRecord } from '@/game/types'
import { DISEASES } from '@/game/data/diseases'

interface HistoryPanelProps {
  history: TurnRecord[]
}

export function HistoryPanel({ history }: HistoryPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 text-xs max-h-[50vh]">
      {history.map((item, idx) => {
        const isDiseased = item.diseases.length > 0
        const statusIcon = isDiseased
          ? <span className="absolute -bottom-1 -right-1 text-[10px]">🦠</span>
          : null

        const tagHTML = item.tags.map((t) => (
          <span key={t.text} className="inline-block px-1.5 py-0.5 rounded bg-slate-700 text-[10px] text-slate-300 mr-1 mb-1">
            {t.text}
          </span>
        ))

        return (
          <div key={idx} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-white/5">
            <div className="relative text-2xl bg-slate-900 rounded-full w-10 h-10 flex items-center justify-center border border-white/10 flex-shrink-0">
              {item.avatar}
              {statusIcon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="mb-1 leading-tight">
                {tagHTML}
                {isDiseased ? (
                  <span className="text-[10px] text-rose-400 font-bold block mt-1">
                    携带: {item.diseases.map((d) => DISEASES[d].name).join(', ')}
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-500/50 block mt-1">健康</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 ml-2">
              <span className={`px-2 py-1 rounded text-[10px] font-bold border ${item.outcomeClass}`}>
                {item.outcomeLabel}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
