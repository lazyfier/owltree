import { AnimatePresence, motion } from 'framer-motion'

interface HelpModalProps {
  show: boolean
  onClose: () => void
}

export function HelpModal({ show, onClose }: HelpModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="glass-card max-w-md w-full p-6 max-h-[80vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="font-pixel text-teal-accent text-sm mb-4">游戏规则</h2>
            <div className="text-sm text-slate-300 space-y-3">
              <p>你是一个压抑已久的年轻人。每回合你会遇到一个新的对象。</p>
              <p><strong className="text-slate-100">目标：</strong>在保持心理健康的同时清零生理压抑值。</p>
              <p><strong className="text-slate-100">标签系统：</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><span className="text-coral">红色标签</span> — 高风险信号，意味着对方可能携带病原体</li>
                <li><span className="text-amber-accent">琥珀色标签</span> — 中等风险信号</li>
                <li><span className="text-slate-400">灰色标签</span> — 低风险或中性信息</li>
                <li><span className="text-slate-500">❓ 隐藏信息</span> — 需要通过聊天来揭示</li>
              </ul>
              <p><strong className="text-slate-100">行为约束：</strong>对方可能有特殊偏好（如拒绝使用安全措施），被限制的选项会显示为不可用。</p>
              <p><strong className="text-slate-100">延迟诊断：</strong>即使你在高风险行为后感觉到了异样，感染状态只有在去医院时才会确认。</p>
              <p><strong className="text-slate-100">恐慌模式：</strong>当心理压力≥80时，你的判断力会下降，部分标签会被隐藏。</p>
            </div>
            <button
              onClick={onClose}
              className="glass-button px-6 py-2 text-sm mt-4 w-full"
            >
              知道了
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
