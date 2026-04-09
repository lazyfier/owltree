import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { GameState } from '@/game/types'
import { computeStats } from '@/game/engine/stats'
import { GameStatsPanel } from './GameStatsPanel'
import { HistoryPanel } from './HistoryPanel'

interface FeedbackModalProps {
  show: boolean
  title: string
  message: string
  icon: string
  onClose: () => void
  isGameOver?: boolean
  history?: GameState['history']
}

export function FeedbackModal({
  show,
  title,
  message,
  icon,
  onClose,
  isGameOver = false,
  history,
}: FeedbackModalProps) {
  const [showHistory, setShowHistory] = useState(false)

  const stats = history ? computeStats({ history } as GameState) : null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="p-6 pb-2 text-center flex-shrink-0">
              <div className={`text-6xl mb-2 ${isGameOver ? 'filter drop-shadow-lg' : ''}`}>
                {icon}
              </div>
              <h2 className={`font-black text-white uppercase tracking-tight ${isGameOver ? 'text-3xl animate-pulse' : 'text-2xl'}`}>
                {title}
              </h2>
            </div>

            {/* Summary view */}
            {!showHistory && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-6 py-2 flex-shrink-0 overflow-y-auto max-h-[50vh]">
                  <div className="bg-slate-800/80 rounded-xl p-4 text-sm text-slate-300 leading-relaxed border border-white/5 whitespace-pre-line">
                    {message}
                  </div>
                  {stats && isGameOver && <GameStatsPanel stats={stats} />}
                </div>

                <div className="p-6 pt-4 flex flex-col gap-3 flex-shrink-0 mt-auto">
                  {isGameOver && history && history.length > 0 && (
                    <button
                      onClick={() => setShowHistory(true)}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-colors text-sm"
                    >
                      📋 查看约会记录复盘
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className={`w-full py-3 font-bold rounded-xl transition-colors shadow-lg text-sm ${
                      isGameOver
                        ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-900/50'
                        : 'bg-white text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    {isGameOver ? '返回首页' : '继续'}
                  </button>
                </div>
              </div>
            )}

            {/* History view */}
            {showHistory && history && (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="px-6 py-2 pb-0 flex-shrink-0">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center border-b border-white/5 pb-2">
                    详细约会记录
                  </h3>
                </div>
                <HistoryPanel history={history} />
                <div className="p-6 pt-2 flex-shrink-0 border-t border-white/5">
                  <button
                    onClick={() => setShowHistory(false)}
                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors text-sm"
                  >
                    ⬅️ 返回结算页面
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
