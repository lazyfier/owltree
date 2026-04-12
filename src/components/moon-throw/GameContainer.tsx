import { useState, useMemo } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { VNDialogueBox } from './VNDialogueBox'
import { VNPortrait } from './VNPortrait'
import { VNChoices } from './VNChoices'
import { FeedbackModal } from './FeedbackModal'
import { PARTNER_TEMPLATES } from '@/game/data/partners'
import type { Partner } from '@/game/types'

const ACTION_OPTIONS = [
  { text: '戴套口交', action: 'oral_condom', risk: 'low' },
  { text: '无套口交', action: 'oral_raw', risk: 'medium' },
  { text: '戴套性交', action: 'sex_condom', risk: 'low' },
  { text: '无套性交', action: 'sex_raw', risk: 'high' },
]

function getAsciiPortrait(partner: Partner | null): string[] {
  if (!partner) return []
  const template = PARTNER_TEMPLATES.find(t => t.name === partner.avatar)
  return template?.asciiPortrait || []
}

const contentVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
}

export function GameContainer() {
  const {
    state,
    phase,
    feedback,
    partner,
    isPanic,
    blockedActions,
    hiddenCount,
    startGame,
    takeAction,
    useTestkit: triggerTestkit,
    chatWithPartner,
    goHospital,
    closeFeedback,
    flirtLine,
  } = useGameState()

  const [currentScene, setCurrentScene] = useState<'dialogue' | 'action' | 'result'>('dialogue')

  const asciiPortrait = useMemo(() => getAsciiPortrait(partner), [partner])

  const handleStart = () => {
    startGame()
    setCurrentScene('dialogue')
  }

  const handleActionSelect = (index: number) => {
    const action = ACTION_OPTIONS[index].action as 'oral_condom' | 'oral_raw' | 'sex_condom' | 'sex_raw'
    if (!blockedActions.includes(action)) {
      takeAction(action)
      setCurrentScene('result')
    }
  }

  const handleCloseResult = () => {
    if (!feedback?.isGameOver) {
      closeFeedback()
      setCurrentScene('dialogue')
    }
  }

  const handleUseTestkit = () => triggerTestkit()
  const handleChat = () => chatWithPartner()
  const handleGoHospital = () => goHospital()

  const visibleTags = partner?.tags.filter(t => t.revealed) || []

  const getResultText = () => {
    if (!feedback) return ''
    return `${feedback.icon} ${feedback.title}\n\n${feedback.message}`
  }

  return (
    <div className="h-screen w-screen bg-[var(--vn-bg)] text-[var(--vn-text)] overflow-hidden grid grid-rows-[auto_1fr]">
      <Link to="/" className="vn-back-btn z-50">
        <ArrowLeft className="w-5 h-5" />
        <span>返回首页</span>
      </Link>

      <AnimatePresence mode="wait">
        {phase === 'intro' ? (
          <motion.div
            key="intro"
            variants={contentVariants}
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
              <p className="text-lg text-slate-400 mb-12">
                一个关于选择与后果的实验性互动叙事游戏
              </p>
              <button type="button" onClick={handleStart} className="vn-choice text-xl px-12 py-4">
                开始游戏
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="playing"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid grid-cols-2"
          >
            {partner && (
              <>
                {/* Left Panel */}
                <div className="border-r border-[var(--vn-border)] grid grid-rows-[auto_auto_1fr] min-w-0">
                  {/* Header */}
                  <div className="px-8 py-5 border-b border-[var(--vn-border)] bg-black/20">
                    <div className="flex items-center justify-between">
                      <h1 className="text-2xl font-bold text-[var(--vn-name)]">月抛模拟器</h1>
                      <span className="text-lg text-slate-400">回合 {state.turn}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="px-8 py-5 border-b border-[var(--vn-border)]">
                    <div className="grid grid-cols-3 gap-8">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[var(--vn-danger)]">生理压抑</span>
                          <span className="text-[var(--vn-danger)] font-bold">{state.frustration}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all" style={{ width: `${state.frustration}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-[var(--vn-warning)]">心理压力</span>
                          <span className="text-[var(--vn-warning)] font-bold">{state.anxiety}%</span>
                        </div>
                        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full transition-all" style={{ width: `${state.anxiety}%` }} />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-[var(--vn-accent)] mb-1">检测试纸</div>
                        <div className="text-4xl font-bold">{state.items.testkit}</div>
                      </div>
                    </div>
                  </div>

                  {/* Portrait */}
                  <div className="px-8 py-8 grid place-items-center overflow-hidden">
                    <div className="text-center">
                      <VNPortrait asciiArt={asciiPortrait} name={partner.avatar} size="large" />
                      
                      {isPanic && (
                        <motion.div 
                          initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                          className="mt-4 inline-block px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 font-bold animate-pulse"
                        >
                          ⚠️ 恐慌模式激活
                        </motion.div>
                      )}

                      <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-lg">
                        {visibleTags.map((tag, i) => (
                          <span key={`${tag.text}-${i}`} className="px-3 py-1.5 rounded-full text-sm bg-[var(--vn-choice-bg)] border border-[var(--vn-border)]">
                            {tag.text}
                          </span>
                        ))}
                        {hiddenCount > 0 && (
                          <span className="px-3 py-1.5 rounded-full text-sm bg-slate-800 text-slate-500">+{hiddenCount} 未知标签</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Panel */}
                <div className="grid grid-rows-[auto_1fr] min-w-0">
                  {/* Actions */}
                  <div className="px-8 py-5 border-b border-[var(--vn-border)] bg-black/10">
                    <div className="grid grid-cols-3 gap-4">
                      <button type="button" onClick={handleUseTestkit} disabled={state.items.testkit <= 0}
                        className="py-5 bg-sky-900/30 hover:bg-sky-800/50 disabled:opacity-30 text-sky-200 rounded-xl font-bold border border-sky-500/20 flex flex-col items-center gap-1">
                        <span className="text-2xl">🧪</span>
                        <span>检测对方</span>
                        <span className="text-xs opacity-60">消耗试纸 x1</span>
                      </button>
                      <button type="button" onClick={handleChat}
                        className="py-5 bg-indigo-900/30 hover:bg-indigo-800/50 text-indigo-200 rounded-xl font-bold border border-indigo-500/20 flex flex-col items-center gap-1">
                        <span className="text-2xl">💬</span>
                        <span>试探聊天</span>
                        <span className="text-xs opacity-60">压抑 +3</span>
                      </button>
                      <button type="button" onClick={handleGoHospital}
                        className="py-5 bg-violet-900/30 hover:bg-violet-800/50 text-violet-200 rounded-xl font-bold border border-violet-500/20 flex flex-col items-center gap-1">
                        <span className="text-2xl">🏥</span>
                        <span>去医院检查</span>
                        <span className="text-xs opacity-60">压抑 +20</span>
                      </button>
                    </div>
                  </div>

                  {/* Dialogue */}
                  <div className="px-8 py-6 overflow-hidden">
                    <AnimatePresence mode="wait">
                      {currentScene === 'dialogue' && (
                        <motion.div key="dialogue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex items-end">
                          <VNDialogueBox speaker={partner.avatar} text={flirtLine || '...'} onComplete={() => setCurrentScene('action')} />
                        </motion.div>
                      )}

                      {currentScene === 'action' && (
                        <motion.div key="action" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex flex-col">
                          <div className="vn-dialogue flex-1 flex flex-col">
                            <div className="vn-dialogue-name text-lg mb-4">选择行动</div>
                            <div className="flex-1 flex flex-col justify-center">
                              <VNChoices choices={ACTION_OPTIONS.map(opt => ({ text: opt.text, disabled: blockedActions.includes(opt.action as 'oral_condom' | 'oral_raw' | 'sex_condom' | 'sex_raw') }))} onSelect={handleActionSelect} />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {currentScene === 'result' && feedback && (
                        <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="h-full flex items-end">
                          <VNDialogueBox speaker=" " text={getResultText()} onComplete={handleCloseResult} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal show={phase === 'gameover'} title={feedback?.title ?? ''} message={feedback?.message ?? ''} icon={feedback?.icon ?? ''} onClose={handleCloseResult} isGameOver={true} history={feedback?.history} />
    </div>
  )
}
