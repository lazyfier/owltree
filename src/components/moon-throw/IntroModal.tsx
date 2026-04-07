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
        <span className="text-5xl block mb-4">🌙</span>
        <h1 className="font-pixel text-teal-accent text-lg mb-2 tracking-wider">月抛模拟器</h1>
        <p className="text-sm text-slate-400 mb-1">Moon-Throw Simulator</p>
        <div className="pixel-divider my-4" />
        <p className="text-sm text-slate-300 mb-6">
          一个关于选择与后果的实验性互动叙事。
          每一次选择都可能改变你的命运。
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onStart}
            className="glass-button px-6 py-3 text-sm font-bold"
          >
            开始游戏
          </button>
          <button
            onClick={onHelp}
            className="glass-button px-6 py-2 text-xs text-slate-400"
          >
            游戏规则
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
