import { motion } from 'framer-motion'

interface StatsPanelProps {
  frustration: number
  anxiety: number
  isPanic: boolean
  testkitCount: number
}

export function StatsPanel({ frustration, anxiety, isPanic, testkitCount }: StatsPanelProps) {
  return (
    <div className="glass-card p-4 mb-4 space-y-3">
      {/* Frustration bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-300">生理压抑</span>
          <span className="text-slate-400">{frustration}%</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-teal-accent to-coral"
            initial={{ width: 0 }}
            animate={{ width: `${frustration}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      {/* Anxiety bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-300">心理压力</span>
          <span className="text-slate-400">{anxiety}%</span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isPanic ? 'bg-coral' : 'bg-gradient-to-r from-slate-500 to-coral'}`}
            initial={{ width: 0 }}
            animate={{ width: `${anxiety}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          />
        </div>
      </div>

      {/* Panic warning */}
      {isPanic && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-coral text-xs font-bold text-center animate-pulse"
        >
          ⚠️ 恐慌模式 — 判断力下降
        </motion.p>
      )}

      {/* Item counter */}
      <div className="flex justify-center">
        <span className={`text-xs font-bold ${testkitCount > 0 ? 'text-teal-accent' : 'text-slate-600'}`}>
          🧪 检测试剂 x{testkitCount}
        </span>
      </div>
    </div>
  )
}
