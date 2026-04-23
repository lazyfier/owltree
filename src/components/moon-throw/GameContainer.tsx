import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import type { ActionType } from '@/game/types'
import { useGameState } from '@/hooks/useGameState'

import { FeedbackModal } from './FeedbackModal'
import { GameActionPanel } from './GameActionPanel'
import { GameHeader } from './GameHeader'
import { GameIntro } from './GameIntro'
import { GamePortraitPanel } from './GamePortraitPanel'
import { GameScenePanel, type GameScene } from './GameScenePanel'
import { GameStatsPanel } from './GameStatsPanel'

const ACTION_OPTIONS = [
  { text: '戴套口交', action: 'oral_condom', risk: 'low' },
  { text: '无套口交', action: 'oral_raw', risk: 'medium' },
  { text: '戴套性交', action: 'sex_condom', risk: 'low' },
  { text: '无套性交', action: 'sex_raw', risk: 'high' },
] as const

const contentVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export function GameContainer() {
  const navigate = useNavigate()
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
    resetToIntro,
    flirtLine,
  } = useGameState()

  const [currentScene, setCurrentScene] = useState<GameScene>('dialogue')

  useEffect(() => {
    if (feedback && phase !== 'gameover' && currentScene !== 'result') {
      setCurrentScene('result')
    }
  }, [feedback, phase, currentScene])

  const partnerEmoji = partner?.avatar ?? '🧑'
  const visibleTags = partner?.tags.filter((tag) => tag.revealed) || []
  const actionChoices = ACTION_OPTIONS.map((option) => ({
    text: option.text,
    disabled: blockedActions.includes(option.action as ActionType),
  }))
  const resultText = feedback ? `${feedback.icon} ${feedback.title}\n\n${feedback.message}` : ''

  const handleStart = () => {
    startGame()
    setCurrentScene('dialogue')
  }

  const handleActionSelect = (index: number) => {
    const action = ACTION_OPTIONS[index]?.action as ActionType | undefined
    if (!action || blockedActions.includes(action)) return

    takeAction(action)
  }

  const handleRefuse = () => {
    takeAction('refuse')
  }

  const handleRestart = () => {
    startGame()
    setCurrentScene('dialogue')
  }

  const handleBackToGameHome = () => {
    resetToIntro()
  }

  const handleCloseResult = () => {
    if (feedback?.isGameOver) {
      handleBackToGameHome()
      return
    }

    closeFeedback()
    setCurrentScene('dialogue')
  }

  const isChatDisabled = hiddenCount === 0 && !isPanic

  return (
    <div className="h-screen w-screen bg-[var(--vn-bg)] text-[var(--vn-text)] overflow-hidden flex flex-col">
      {phase === 'intro' && (
        <button type="button" onClick={() => navigate('/')} className="vn-back-btn z-50">
          <ArrowLeft className="w-5 h-5" />
          <span>返回首页</span>
        </button>
      )}

      <div className="flex-1">
        <AnimatePresence mode="wait">
          {phase === 'intro' ? (
          <GameIntro onStart={handleStart} variants={contentVariants} />
        ) : (
          <motion.div
            key="playing"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="grid grid-cols-2 h-full"
          >
            {partner && (
              <>
                <div className="border-r border-[var(--vn-border)] grid grid-rows-[auto_auto_1fr] min-w-0">
                  <GameHeader turn={state.turn} />
                  <GameStatsPanel
                    frustration={state.frustration}
                    anxiety={state.anxiety}
                    testkitCount={state.items.testkit}
                  />
                  <GamePortraitPanel
                    emoji={partnerEmoji}
                    isPanic={isPanic}
                    visibleTags={visibleTags}
                    hiddenCount={hiddenCount}
                  />
                </div>

                <div className="grid grid-rows-[auto_auto_1fr] min-w-0">
                  <div className="px-4 py-2 border-b border-[var(--vn-border)] flex items-center justify-end bg-black/10">
                    <button type="button" onClick={() => navigate('/')} className="vn-back-btn-toolbar">
                      <ArrowLeft className="w-4 h-4" />
                      返回首页
                    </button>
                  </div>
                  <GameActionPanel
                    canUseTestkit={state.items.testkit > 0}
                    onUseTestkit={triggerTestkit}
                    onChat={chatWithPartner}
                    onGoHospital={goHospital}
                    onRefuse={handleRefuse}
                    isChatDisabled={isChatDisabled}
                  />
                  <GameScenePanel
                    currentScene={currentScene}
                    partnerName={partner.avatar}
                    flirtLine={flirtLine || '...'}
                    feedbackText={resultText}
                    actionChoices={actionChoices}
                    onDialogueComplete={() => setCurrentScene('action')}
                    onActionSelect={handleActionSelect}
                    onResultComplete={handleCloseResult}
                  />
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      <FeedbackModal
        show={phase === 'gameover'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        icon={feedback?.icon ?? ''}
        onClose={handleCloseResult}
        onRestart={handleRestart}
        isGameOver={true}
        history={feedback?.history}
      />
    </div>
  )
}
