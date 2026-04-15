import { useReducer, useCallback, useEffect, useMemo } from 'react'

import { saveAchievementProgress } from '@/game/engine/achievements'
import type { GameOverResult } from '@/game/engine/game-over'
import { checkGameOver } from '@/game/engine/game-over'
import type { GameAction } from '@/game/engine/actions'

import { gameReducer, createInitialStore } from './useGameState/reducer'
import {
  selectBlockedActions,
  selectHiddenCount,
  selectIsPanic,
} from './useGameState/selectors'

export function useGameState() {
  const [store, dispatch] = useReducer(gameReducer, undefined, createInitialStore)

  useEffect(() => {
    saveAchievementProgress(store.state.achievements)
  }, [store.state.achievements])

  const partner = store.state.currentPartner
  const isPanic = useMemo(() => selectIsPanic(store.state.anxiety), [store.state.anxiety])
  const blockedActions = useMemo(() => selectBlockedActions(partner), [partner])
  const hiddenCount = useMemo(() => selectHiddenCount(partner), [partner])
  const gameOverResult: GameOverResult | null = useMemo(() => checkGameOver(store.state), [store.state])

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const takeAction = useCallback((action: GameAction) => dispatch({ type: 'TAKE_ACTION', action }), [])
  const goHospital = useCallback(() => dispatch({ type: 'GO_TO_HOSPITAL' }), [])
  const useTestkitAction = useCallback(() => dispatch({ type: 'USE_TESTKIT' }), [])
  const chatWithPartner = useCallback(() => dispatch({ type: 'CHAT' }), [])
  const nextPartner = useCallback(() => dispatch({ type: 'NEXT_PARTNER' }), [])
  const showHelp = useCallback(() => dispatch({ type: 'SHOW_HELP' }), [])
  const closeHelp = useCallback(() => dispatch({ type: 'CLOSE_HELP' }), [])
  const closeFeedback = useCallback(() => dispatch({ type: 'CLOSE_FEEDBACK' }), [])

  return {
    state: store.state,
    phase: store.phase,
    feedback: store.feedback,
    flirtLine: store.flirtLine,
    partner,
    isPanic,
    blockedActions,
    hiddenCount,
    gameOverResult,
    startGame,
    takeAction,
    goHospital,
    useTestkit: useTestkitAction,
    chatWithPartner,
    nextPartner,
    showHelp,
    closeHelp,
    closeFeedback,
  }
}
