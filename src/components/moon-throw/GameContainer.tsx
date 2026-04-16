import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PARTNER_TEMPLATES } from '@/game/data/partners'
import type { ActionType, Partner } from '@/game/types'
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

function getPartnerEmoji(partner: Partner | null): string {
  if (!partner) return '🧑'

  const template = PARTNER_TEMPLATES.find((entry) => entry.name === partner.avatar)
  return template?.emoji || '🧑'
}

const contentVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
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

  const [currentScene, setCurrentScene] = useState<GameScene>('dialogue')

  const partnerEmoji = useMemo(() => getPartnerEmoji(partner), [partner])
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
    setCurrentScene('result')
  }

  const handleCloseResult = () => {
    if (feedback?.isGameOver) return

    closeFeedback()
    setCurrentScene('dialogue')
  }

  return (
    <div className="h-screen w-screen bg-[var(--vn-bg)] text-[var(--vn-text)] overflow-hidden grid grid-rows-[auto_1fr]">
      <Link to="/" className="vn-back-btn z-50">
        <ArrowLeft className="w-5 h-5" />
        <span>返回首页</span>
      </Link>

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
            className="grid grid-cols-2"
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
                    partnerName={partner.avatar}
                    isPanic={isPanic}
                    visibleTags={visibleTags}
                    hiddenCount={hiddenCount}
                  />
                </div>

                <div className="grid grid-rows-[auto_1fr] min-w-0">
                  <GameActionPanel
                    canUseTestkit={state.items.testkit > 0}
                    onUseTestkit={triggerTestkit}
                    onChat={chatWithPartner}
                    onGoHospital={goHospital}
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

      <FeedbackModal
        show={phase === 'gameover'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        icon={feedback?.icon ?? ''}
        onClose={handleCloseResult}
        isGameOver={true}
        history={feedback?.history}
      />
    </div>
  )
}
