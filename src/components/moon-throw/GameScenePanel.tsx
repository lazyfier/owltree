import { AnimatePresence, motion } from 'framer-motion'

import { VNChoices } from './VNChoices'
import { VNDialogueBox } from './VNDialogueBox'

export type GameScene = 'dialogue' | 'action' | 'result'

interface ActionChoice {
  text: string
  disabled?: boolean
}

interface GameScenePanelProps {
  currentScene: GameScene
  partnerName: string
  flirtLine: string
  feedbackText: string
  actionChoices: ActionChoice[]
  onDialogueComplete: () => void
  onActionSelect: (index: number) => void
  onResultComplete: () => void
}

export function GameScenePanel({
  currentScene,
  partnerName,
  flirtLine,
  feedbackText,
  actionChoices,
  onDialogueComplete,
  onActionSelect,
  onResultComplete,
}: GameScenePanelProps) {
  const theme = typeof document !== 'undefined'
    ? document.documentElement.getAttribute('data-theme') ?? 'terminal'
    : 'terminal'
  const isTerminal = theme === 'terminal'

  return (
    <div className="px-8 py-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScene === 'dialogue' && (
          <motion.div
            key="dialogue"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full flex items-end"
          >
            <VNDialogueBox key={`${partnerName}-${flirtLine}`} speaker={partnerName} text={flirtLine} onComplete={onDialogueComplete} />
          </motion.div>
        )}

        {currentScene === 'action' && (
          <motion.div
            key="action"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full flex flex-col"
          >
            <div className="vn-dialogue flex-1 flex flex-col">
              <div className="vn-dialogue-name text-lg mb-4">选择行动</div>
              <div className="flex-1 flex flex-col justify-center">
                <VNChoices choices={actionChoices} onSelect={onActionSelect} />
              </div>
            </div>
          </motion.div>
        )}

        {currentScene === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full flex items-end"
          >
            <button
              type="button"
              onClick={onResultComplete}
              className={`page-card w-full max-h-full overflow-y-auto p-6 text-left transition-all ${
                isTerminal ? 'font-mono rounded-xl' : ''
              }`}
            >
              <div aria-hidden="true">
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[var(--page-text-secondary)]">
                    结算
                  </span>
                  <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
                </div>
                <div className="whitespace-pre-wrap break-words text-sm leading-7 text-[var(--page-text)] sm:text-base">
                  {feedbackText}
                </div>
                <div className="mt-6 text-xs text-[var(--page-text-muted)]">
                  点击继续
                </div>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
