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
            <VNDialogueBox speaker={partnerName} text={flirtLine} onComplete={onDialogueComplete} />
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
            <VNDialogueBox speaker=" " text={feedbackText} onComplete={onResultComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
