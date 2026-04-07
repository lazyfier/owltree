import { AnimatePresence, motion } from 'framer-motion'
import type { Partner } from '@/game/types'

interface PartnerCardProps {
  partner: Partner | null
  isPanic: boolean
  flirtLine?: string
}

export function PartnerCard({ partner, isPanic, flirtLine }: PartnerCardProps) {
  if (!partner) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-slate-500 text-sm">寻找中...</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-4 mb-4">
      {/* Avatar and flirt line */}
      <div className="flex items-center gap-3 mb-3">
        <span
          data-testid="partner-avatar"
          className="text-4xl animate-float"
        >
          {partner.avatar}
        </span>
        <p className="text-xs text-slate-400 italic flex-1">
          &ldquo;{flirtLine ?? ''}&rdquo;
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        <AnimatePresence mode="popLayout">
          {partner.tags.map((tag, idx) => {
            const isHidden = !tag.revealed
            const forceHide = isPanic && !isHidden && Math.random() < 0.5
            const displayHidden = isHidden || forceHide

            return (
              <motion.span
                key={`${tag.text}-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: idx * 0.05 }}
                className={
                  displayHidden
                    ? 'px-2.5 py-1 rounded-lg text-xs font-bold text-slate-500 bg-slate-900 border border-slate-700'
                    : `px-2.5 py-1 rounded-lg text-xs font-bold text-white ${tag.colorClass} border border-white/10`
                }
              >
                {displayHidden ? '❓ 隐藏信息' : (
                  <>
                    {tag.constraint ? '🚫 ' : ''}
                    {tag.text}
                  </>
                )}
              </motion.span>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
