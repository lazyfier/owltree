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
            className="glass-card max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6 border-b border-white/5 bg-slate-800/50 flex justify-between items-center flex-shrink-0">
              <h2 className="font-pixel text-teal-accent text-sm">游戏指南手册</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl leading-none">&times;</button>
            </div>

            <div className="p-6 overflow-y-auto text-sm text-slate-300 space-y-6 flex-1">
              <section>
                <h3 className="text-emerald-400 font-bold mb-2 uppercase tracking-wide">🏆 胜利条件</h3>
                <ul className="list-disc pl-4 space-y-1 marker:text-emerald-500">
                  <li><b>压抑值归零</b>：通过约会行为释放所有生理压抑。</li>
                  <li><b>且未被感染</b>：在游戏结算时，身体必须是健康的。如果虽然压抑值清零但已处于潜伏期感染状态，仍判定为失败。</li>
                </ul>
              </section>

              <section>
                <h3 className="text-rose-400 font-bold mb-2 uppercase tracking-wide">💀 失败条件</h3>
                <ul className="list-disc pl-4 space-y-1 marker:text-rose-500">
                  <li><b>欲火焚身</b>：压抑值达到 100%。（失去理智随机高危行为）</li>
                  <li><b>精神崩溃</b>：心理压力达到 100%。（送入精神病院）</li>
                  <li><b>确诊感染</b>：在医院检查出阳性，或检测对方时不幸中招。</li>
                  <li><b>糟糕的胜利</b>：压抑值清零，但在最终结算时发现已感染。</li>
                </ul>
              </section>

              <div className="h-px bg-white/10" />

              <section>
                <h3 className="text-violet-400 font-bold mb-2 uppercase tracking-wide">🧠 核心机制：延迟判决</h3>
                <div className="bg-violet-900/20 p-3 rounded-lg border border-violet-500/20 text-xs space-y-1">
                  <p>🚫 <b>不会弹出</b>"你已感染"的提示。</p>
                  <p>✅ 游戏会继续，你必须带着疑虑继续生活。</p>
                  <p>🏥 只有<b>"去医院检查"</b>或<b>"通关结算"</b>时才会揭晓谜底。</p>
                </div>
              </section>

              <section>
                <h3 className="text-slate-100 font-bold mb-2 uppercase tracking-wide">🏷️ 标签系统</h3>
                <ul className="list-disc pl-4 space-y-1 text-xs">
                  <li><span className="text-rose-400">红色标签</span> — 高风险信号，意味着对方可能携带病原体</li>
                  <li><span className="text-purple-400">紫色标签</span> — 疑似风险信号，不确定但值得警惕</li>
                  <li><span className="text-slate-400">灰色标签</span> — 低风险或中性信息</li>
                  <li><span className="text-emerald-400">绿色标签</span> — 安全信号，对方大概率健康</li>
                  <li><span className="text-slate-500">❓ 隐藏信息</span> — 需要通过聊天来揭示</li>
                </ul>
              </section>

              <section>
                <h3 className="text-slate-100 font-bold mb-2 uppercase tracking-wide">🚫 行为约束</h3>
                <p className="text-xs">对方可能有特殊偏好（如拒绝使用安全措施），被限制的选项会显示为不可用。</p>
              </section>

              <section>
                <h3 className="text-slate-100 font-bold mb-2 uppercase tracking-wide">😰 恐慌模式</h3>
                <p className="text-xs">当心理压力 ≥80 时，你的判断力会下降，部分已揭示的标签会重新被模糊遮盖。</p>
              </section>
            </div>

            <div className="p-4 border-t border-white/5 text-center flex-shrink-0">
              <button
                onClick={onClose}
                className="glass-button px-6 py-2 text-sm w-full"
              >
                知道了
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
