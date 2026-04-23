interface GameActionPanelProps {
  canUseTestkit: boolean
  onUseTestkit: () => void
  onChat: () => void
  onGoHospital: () => void
  onRefuse: () => void
  isChatDisabled?: boolean
}

export function GameActionPanel({
  canUseTestkit,
  onUseTestkit,
  onChat,
  onGoHospital,
  onRefuse,
  isChatDisabled = false,
}: GameActionPanelProps) {
  return (
    <div className="px-8 py-5 border-b border-[var(--vn-border)] bg-black/10">
      <div className="grid grid-cols-4 gap-4">
        <button
          type="button"
          onClick={onUseTestkit}
          disabled={!canUseTestkit}
          className="py-5 bg-sky-900/30 hover:bg-sky-800/50 disabled:opacity-30 text-sky-200 rounded-xl font-bold border border-sky-500/20 flex flex-col items-center gap-1"
        >
          <span className="text-2xl">🧪</span>
          <span>检测对方</span>
          <span className="text-xs opacity-60">消耗试纸 x1</span>
        </button>
        <button
          type="button"
          onClick={onChat}
          disabled={isChatDisabled}
          className={`py-5 rounded-xl font-bold border flex flex-col items-center gap-1 ${
            isChatDisabled
              ? 'bg-slate-900/50 text-slate-500 border-white/10 opacity-60 cursor-not-allowed'
              : 'bg-indigo-900/30 hover:bg-indigo-800/50 text-indigo-200 border-indigo-500/20'
          }`}
        >
          <span className="text-2xl">💬</span>
          <span>{isChatDisabled ? '已完全了解' : '试探聊天'}</span>
          {!isChatDisabled && <span className="text-xs opacity-60">压抑 +3</span>}
        </button>
        <button
          type="button"
          onClick={onGoHospital}
          className="py-5 bg-violet-900/30 hover:bg-violet-800/50 text-violet-200 rounded-xl font-bold border border-violet-500/20 flex flex-col items-center gap-1"
        >
          <span className="text-2xl">🏥</span>
          <span>去医院检查</span>
          <span className="text-xs opacity-60">压抑 +10 / 清空压力</span>
        </button>
        <button
          type="button"
          onClick={onRefuse}
          className="py-5 bg-slate-900/30 hover:bg-slate-800/50 text-slate-200 rounded-xl font-bold border border-white/10 flex flex-col items-center gap-1"
        >
          <span className="text-2xl">👋</span>
          <span>换一个</span>
          <span className="text-xs opacity-60">压抑 +8</span>
        </button>
      </div>
    </div>
  )
}
