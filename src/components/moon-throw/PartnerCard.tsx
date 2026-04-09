import { AnimatePresence, motion } from 'framer-motion'
import type { Partner } from '@/game/types'

interface PartnerCardProps {
  partner: Partner | null
  isPanic: boolean
  flirtLine?: string
  showDangerBadge?: boolean
}

function getTagIcon(colorClass: string, constraint?: string): string {
  if (constraint) return '🚫'
  if (colorClass.includes('red')) return '⚠️'
  if (colorClass.includes('emerald')) return '🛡️'
  return '⏺'
}

export function PartnerCard({ partner, isPanic, flirtLine, showDangerBadge }: PartnerCardProps) {
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
      <div className="text-center mb-3 relative">
        <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center text-3xl shadow-xl border-2 border-slate-600 animate-float mb-2 relative">
          <span data-testid="partner-avatar">{partner.avatar}</span>
          {showDangerBadge && (
            <div className="absolute -right-1 -bottom-1 w-5 h-5 bg-red-500 rounded-full border-2 border-slate-900 flex items-center justify-center text-[9px]">
              ⚠️
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400 italic">{`"${flirtLine ?? ''}"`}</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap justify-center gap-1.5">
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
                {displayHidden ? (
                  isPanic ? <span className="blur-sm">???</span> : '❓ 隐藏信息'
                ) : (
                  <>
                    <span className="opacity-75">{getTagIcon(tag.colorClass, tag.constraint)}</span>{' '}
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
