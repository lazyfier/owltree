import { useState } from 'react'
import { motion } from 'framer-motion'

interface StatsPanelProps {
  frustration: number
  anxiety: number
  isPanic: boolean
  testkitCount: number
  onUseTestkit?: () => void
}

export function StatsPanel({ frustration, anxiety, isPanic, testkitCount, onUseTestkit }: StatsPanelProps) {
  const [hoveringTestkit, setHoveringTestkit] = useState(false)

  return (
    <div className="glass-card p-4 mb-4 space-y-3">
      {/* Frustration bar */}
      <div>
        <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
          <span className="text-rose-400 flex items-center gap-1">🔥 生理压抑 (Urge)</span>
          <span className="text-white">{frustration}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 p-0.5 shadow-inner">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-rose-600"
            animate={{ width: `${frustration}%` }}
            transition={{ duration: 700, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Anxiety bar */}
      <div>
        <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
          <span className="text-violet-400 flex items-center gap-1">🧠 心理压力 (Anxiety)</span>
          <span className="text-white">{anxiety}%</span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 p-0.5 shadow-inner">
          <motion.div
            className={`h-full rounded-full ${isPanic ? 'bg-violet-500' : 'bg-gradient-to-r from-indigo-500 to-violet-600'}`}
            animate={{ width: `${anxiety}%` }}
            transition={{ duration: 700, ease: 'easeOut' }}
          />
        </div>
        {isPanic && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[10px] text-violet-300 mt-1 text-center animate-pulse"
          >
            ⚠️ 恐慌状态：视线模糊，无法看清细节
          </motion.p>
        )}
      </div>

      {/* Testkit + Hospital buttons */}
      <div className="flex gap-2 pt-1">
        <div
          className="flex-1 bg-slate-800/50 rounded-lg p-2 border border-white/5 flex items-center justify-between group relative cursor-pointer"
          onMouseEnter={() => setHoveringTestkit(true)}
          onMouseLeave={() => setHoveringTestkit(false)}
          onClick={testkitCount > 0 && onUseTestkit ? onUseTestkit : undefined}
        >
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold">对方试纸</span>
            <span className={`text-xs font-bold ${testkitCount > 0 ? 'text-sky-400' : 'text-slate-600'}`}>
              x{testkitCount}
            </span>
          </div>
          {testkitCount > 0 && hoveringTestkit && (
            <div className="absolute inset-0 w-full h-full bg-sky-600/90 text-white text-xs font-bold rounded-lg flex items-center justify-center z-10 transition-opacity">
              检测对方
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
