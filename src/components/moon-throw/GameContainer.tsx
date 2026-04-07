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

  const handleRestart = () => {
    startGame()
  }

  const handleCloseFeedback = () => {
    if (feedback?.isGameOver) {
      handleRestart()
    } else {
      closeFeedback()
    }
  }

  return (
    <div className={`w-full max-w-md mx-auto ${isPanic ? 'animate-pulse' : ''}`}>
      <GameHeader turn={state.turn} />

      {phase === 'playing' && partner && (
        <>
          <StatsPanel
            frustration={state.frustration}
            anxiety={state.anxiety}
            isPanic={isPanic}
            testkitCount={state.items.testkit}
          />
          <PartnerCard partner={partner} isPanic={isPanic} flirtLine={flirtLine} />
          <ActionButtons
            onAction={takeAction}
            onChat={chatWithPartner}
            onHospital={goHospital}
            onRefuse={() => takeAction('refuse' as any)}
            blockedActions={blockedActions}
            hiddenCount={hiddenCount}
            isPanic={isPanic}
          />
          {state.items.testkit > 0 && (
            <button
              onClick={useTestkit}
              className="glass-button w-full mt-2 text-xs"
            >
              🧪 使用检测试剂 (剩余 x{state.items.testkit})
            </button>
          )}
        </>
      )}

      {/* Modals */}
      {phase === 'intro' && <IntroModal onStart={startGame} onHelp={showHelp} />}

      <FeedbackModal
        show={phase === 'feedback' || phase === 'gameover'}
        title={feedback?.title ?? ''}
        message={feedback?.message ?? ''}
        icon={feedback?.icon ?? ''}
        onClose={handleCloseFeedback}
        isGameOver={feedback?.isGameOver}
      />

      <HelpModal show={phase === 'help'} onClose={closeHelp} />
    </div>
  )
}
