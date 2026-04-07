import { Button } from '@/components/ui/Button'
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

const MAIN_ACTIONS: { key: ActionType; label: string }[] = [
  { key: 'oral_condom', label: '戴套口交' },
  { key: 'sex_condom', label: '戴套性交' },
  { key: 'oral_raw', label: '无套口交' },
  { key: 'sex_raw', label: '无套性交' },
]

export function ActionButtons({
  onAction,
  onChat,
  onHospital,
  onRefuse,
  blockedActions,
  hiddenCount,
  isPanic,
}: ActionButtonsProps) {
  return (
    <div className="space-y-3">
      {/* Chat button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onChat}
        disabled={hiddenCount === 0 && !isPanic}
        className="w-full"
      >
        💬 试探/聊天
        <span className="opacity-50 text-[10px] font-normal ml-1">
          (压抑值+{CONFIG.chatCost})
        </span>
      </Button>

      {/* Main action buttons 2x2 grid */}
      <div className="grid grid-cols-2 gap-2">
        {MAIN_ACTIONS.map(({ key, label }) => {
          const isBlocked = blockedActions.includes(key)
          const cost = CONFIG.stress[key]

          return (
            <div key={key} className="relative">
              <Button
                variant={isBlocked ? 'ghost' : 'primary'}
                size="sm"
                onClick={() => onAction(key)}
                disabled={isBlocked}
                className="w-full text-xs"
              >
                {label}
                <span className="opacity-50 text-[10px]">
                  (压力+{cost})
                </span>
              </Button>
              {isBlocked && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg border border-coral/30 backdrop-blur-[1px]">
                  <span className="text-coral font-bold text-[10px] uppercase rotate-[-3deg]">
                    对方拒绝
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Hospital and Refuse */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onHospital}
          className="flex-1 text-xs"
        >
          🏥 去医院
          <span className="opacity-50 text-[10px]">(压抑值+{CONFIG.hospitalCost})</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefuse}
          className="flex-1 text-xs"
        >
          🏃 离开
        </Button>
      </div>
    </div>
  )
}
