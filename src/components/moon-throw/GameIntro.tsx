import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'

interface GameIntroProps {
  onStart: () => void
  variants: Variants
}

export function GameIntro({ onStart, variants }: GameIntroProps) {
  return (
    <motion.div
      key="intro"
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="grid place-items-center p-8"
    >
      <div className="text-center">
        <div className="vn-portrait mb-8 inline-block p-12">
          <pre className="vn-portrait-ascii text-6xl">
            {'    ╭────────╮\n'}
            {'    │  ◉  ◉  │\n'}
            {'    │   ◡    │\n'}
            {'    ╰────────╯'}
          </pre>
        </div>
        <h1 className="text-5xl font-bold mb-4 text-[var(--vn-name)]">月抛模拟器</h1>
        <p className="text-xl text-slate-500 mb-2">Panic Edition</p>
        <p className="text-lg text-slate-400 mb-12">一个关于选择与后果的实验性互动叙事游戏</p>
        <button type="button" onClick={onStart} className="vn-choice text-xl px-12 py-4">
          开始游戏
        </button>
      </div>
    </motion.div>
  )
}
