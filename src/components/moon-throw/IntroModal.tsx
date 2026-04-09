import { motion } from 'framer-motion'

interface IntroModalProps {
  onStart: () => void
  onHelp: () => void
}

export function IntroModal({ onStart, onHelp }: IntroModalProps) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="glass-card max-w-sm w-full p-8 text-center"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <span className="text-5xl block mb-4">💘</span>
        <h1 className="font-pixel text-teal-accent text-lg mb-2 tracking-wider">月抛模拟器</h1>
        <p className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-6">Panic Edition</p>

        <div className="text-left text-xs text-slate-300 space-y-3 mb-6 bg-slate-800/50 p-5 rounded-xl border border-white/5">
          <p>1. <b>延迟判决</b>：高危行为后，你<b>不会</b>立即知道是否感染。</p>
          <p>2. <b>心理压力</b>：无套或高危行为会累积心理压力。压力过高会导致<b>视线模糊</b>。</p>
          <p>3. <b>去医院</b>：确认自己是否安全的唯一方法，但代价高昂。</p>
          <p>4. <b>目标</b>：将压抑值降至 0，且身体健康。</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onStart}
            className="glass-button px-6 py-3 text-sm font-bold"
          >
            开始月抛
          </button>
          <button
            onClick={onHelp}
            className="glass-button px-6 py-2 text-xs text-slate-400"
          >
            📖 游戏帮助
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
