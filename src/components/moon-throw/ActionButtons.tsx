import type { ActionType } from '@/game/types'
import type { GameAction } from '@/game/engine/actions'
import { CONFIG } from '@/game/data/config'

interface ActionButtonsProps {
  onAction: (action: GameAction) => void
  onChat: () => void
  onHospital: () => void
  onRefuse: () => void
  blockedActions: ActionType[]
  hiddenCount: number
  isPanic: boolean
}

const MAIN_ACTIONS: { key: ActionType; emoji: string; label: string; desc: string; variant: 'low' | 'safe' | 'medium' | 'high' }[] = [
  { key: 'oral_condom', emoji: '🍬', label: '戴套口交', desc: '收益极低 | 压力+2', variant: 'low' },
  { key: 'sex_condom', emoji: '🛡️', label: '戴套性交', desc: '收益一般 | 压力+5', variant: 'safe' },
  { key: 'oral_raw', emoji: '🍭', label: '无套口交', desc: '收益中等 | 压力+15', variant: 'medium' },
  { key: 'sex_raw', emoji: '🔥', label: '无套性交', desc: '收益较高 | 压力+30', variant: 'high' },
]

const VARIANT_CLASSES: Record<string, string> = {
  low: 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/5',
  safe: 'bg-emerald-900/50 hover:bg-emerald-800/60 text-emerald-100 border-emerald-500/20 shadow-lg',
  medium: 'bg-amber-900/40 hover:bg-amber-800/50 text-amber-100 border-amber-500/10',
  high: 'bg-rose-900/60 hover:bg-rose-800 text-rose-100 border-rose-500/30 shadow-lg',
}

export function ActionButtons({
  onAction,
  onChat,
  onHospital,
  onRefuse,
  blockedActions,
  hiddenCount,
  isPanic,
}: ActionButtonsProps) {
  const chatDisabled = hiddenCount === 0 && !isPanic

  return (
    <div className="space-y-2">
      {/* Chat button */}
      <button
        onClick={onChat}
        disabled={chatDisabled}
        className={`w-full py-3 bg-indigo-900/40 hover:bg-indigo-800/60 text-indigo-200 rounded-xl font-bold border border-indigo-500/20 transition-all flex items-center justify-center gap-2 text-sm ${chatDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span>💬</span> 试探 / 聊天{' '}
        <span className="opacity-50 text-[10px] font-normal ml-1">(压抑值+{CONFIG.chatCost})</span>
      </button>

      <div className="h-px bg-white/5 my-2" />

      {/* Main action buttons 2x2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {MAIN_ACTIONS.map(({ key, emoji, label, desc, variant }) => {
          const isBlocked = blockedActions.includes(key)
          const cost = CONFIG.stress[key]

          return (
            <div key={key} className="relative">
              <button
                onClick={() => onAction(key)}
                disabled={isBlocked}
                className={`py-3 rounded-xl font-semibold text-xs border transition-all w-full ${isBlocked ? 'opacity-50 cursor-not-allowed grayscale' : VARIANT_CLASSES[variant]}`}
              >
                {emoji} {label}
                <span className="block text-[9px] opacity-60 mt-0.5">{desc}</span>
              </button>
              {isBlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-rose-500 font-bold rotate-[-3deg] text-[10px] uppercase border border-rose-500/30 rounded-xl backdrop-blur-[1px]">
                  对方拒绝
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Refuse button */}
      <button
        onClick={onRefuse}
        className="w-full py-3 mt-2 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white rounded-xl font-bold border border-white/10 transition-all text-xs flex items-center justify-center gap-1"
      >
        <span>👋</span> 换一个 (压抑值+8)
      </button>
    </div>
  )
}
