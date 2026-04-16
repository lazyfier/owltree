import { motion } from 'framer-motion'

import type { PartnerTag } from '@/game/types'

import { VNPortrait } from './VNPortrait'

interface GamePortraitPanelProps {
  emoji: string
  partnerName: string
  isPanic: boolean
  visibleTags: PartnerTag[]
  hiddenCount: number
}

export function GamePortraitPanel({
  emoji,
  partnerName,
  isPanic,
  visibleTags,
  hiddenCount,
}: GamePortraitPanelProps) {
  return (
    <div className="px-8 py-8 grid place-items-center overflow-hidden">
      <div className="text-center">
        <VNPortrait emoji={emoji} name={partnerName} size="large" isPanic={isPanic} />

        {isPanic && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="mt-4 inline-block px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-bold animate-pulse"
          >
            ⚠️ 恐慌模式激活
          </motion.div>
        )}

        <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-lg">
          {visibleTags.map((tag) => (
            <span
              key={`${tag.text}-${tag.clue}`}
              className="px-3 py-1.5 rounded-full text-sm bg-[var(--vn-choice-bg)] border border-[var(--vn-border)]"
            >
              {tag.text}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="px-3 py-1.5 rounded-full text-sm bg-slate-800 text-slate-500">
              +{hiddenCount} 未知标签
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
