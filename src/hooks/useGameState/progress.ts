import {
  checkAchievements,
  checkEnding,
  recordEndingSeen,
  unlockAchievement,
} from '@/game/engine/achievements'
import type { GameState } from '@/game/types'

import type { ProgressOptions } from './types'

export function getStat(state: GameState, key: string): number {
  const value = state.achievements.stats[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

export function countRevealedTags(state: GameState): number {
  return state.currentPartner?.tags.filter((tag) => tag.revealed).length ?? 0
}

export function updateAchievementStats(state: GameState, updates: Record<string, number>): GameState {
  return {
    ...state,
    achievements: {
      ...state.achievements,
      stats: {
        ...state.achievements.stats,
        ...updates,
      },
    },
  }
}

export function applyProgressChecks(
  prevState: GameState,
  nextState: GameState,
  options: ProgressOptions,
): GameState {
  const safeAction =
    options.action === 'refuse'
    || options.action === 'oral_condom'
    || options.action === 'sex_condom'
  const revealedTagsDelta = Math.max(0, countRevealedTags(nextState) - countRevealedTags(prevState))
  const currentFastestEndingTurn = getStat(nextState, 'fastestEndingTurn')

  let progressedState = updateAchievementStats(nextState, {
    maxAnxiety: Math.max(getStat(nextState, 'maxAnxiety'), nextState.anxiety),
    revealedTagCount: getStat(nextState, 'revealedTagCount') + revealedTagsDelta,
    testkitUses: getStat(nextState, 'testkitUses') + (options.usedTestkit ? 1 : 0),
    hospitalVisits: getStat(nextState, 'hospitalVisits') + (options.wentToHospital ? 1 : 0),
    chatCount: getStat(nextState, 'chatCount') + (options.endedDialogue ? 1 : 0),
    lateActionCount: getStat(nextState, 'lateActionCount') + (options.action && prevState.turn >= 5 ? 1 : 0),
    infectionTurn: !prevState.isInfected && nextState.isInfected ? nextState.turn : getStat(nextState, 'infectionTurn'),
    infectionRevealed: getStat(nextState, 'infectionRevealed') + (options.revealedInfection ? 1 : 0),
    safeActionStreak:
      options.action === undefined
        ? getStat(nextState, 'safeActionStreak')
        : safeAction && !(!prevState.isInfected && nextState.isInfected)
          ? getStat(nextState, 'safeActionStreak') + 1
          : 0,
  })

  const ending = checkEnding(progressedState)
  if (ending) {
    progressedState = updateAchievementStats(recordEndingSeen(progressedState, ending.id), {
      fastestEndingTurn:
        currentFastestEndingTurn > 0
          ? Math.min(currentFastestEndingTurn, progressedState.turn)
          : progressedState.turn,
    })
  }

  return checkAchievements(progressedState).reduce(
    (state, achievementId) => unlockAchievement(state, achievementId),
    progressedState,
  )
}
