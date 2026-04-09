import { useState } from 'react'
import { useGameState } from '@/hooks/useGameState'
import { GameHeader } from './GameHeader'
import { StatsPanel } from './StatsPanel'
import { PartnerCard } from './PartnerCard'
import { ActionButtons } from './ActionButtons'
import { FeedbackModal } from './FeedbackModal'
import { HelpModal } from './HelpModal'
import { IntroModal } from './IntroModal'

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
    goHospital,
    useTestkit,
    chatWithPartner,
    showHelp,
    closeHelp,
    closeFeedback,
    flirtLine,
  } = useGameState()

  const [partnerTestedPositive, setPartnerTestedPositive] = useState(false)

  const handleRestart = () => {
    setPartnerTestedPositive(false)
    startGame()
  }

  const handleCloseFeedback = () => {
    if (feedback?.isGameOver) {
      handleRestart()
    } else {
      closeFeedback()
    }
  }

  const handleUseTestkit = () => {
    if (partner && partner.diseases.length > 0) {
      setPartnerTestedPositive(true)
    }
    useTestkit()
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <GameHeader turn={state.turn} />

      {phase === 'playing' && partner && (
        <>
          <StatsPanel
            frustration={state.frustration}
            anxiety={state.anxiety}
            isPanic={isPanic}
            testkitCount={state.items.testkit}
            onUseTestkit={handleUseTestkit}
          />
          <PartnerCard
            partner={partner}
            isPanic={isPanic}
            flirtLine={flirtLine}
            showDangerBadge={partnerTestedPositive}
          />
          <ActionButtons
            onAction={takeAction}
            onChat={chatWithPartner}
            onHospital={goHospital}
            onRefuse={() => takeAction('refuse' as any)}
            blockedActions={blockedActions}
            hiddenCount={hiddenCount}
            isPanic={isPanic}
          />
        </>
      )}

      {/* Modals */}
      {phase === 'intro' && <IntroModal onStart={handleRestart} onHelp={showHelp} />}

      <FeedbackModal
        show={phase === 'feedback' || phase === 'gameover'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        icon={feedback?.icon ?? ''}
        onClose={handleCloseFeedback}
        isGameOver={feedback?.isGameOver}
        history={feedback?.history}
      />

      <HelpModal show={phase === 'help'} onClose={closeHelp} />
    </div>
  )
}
