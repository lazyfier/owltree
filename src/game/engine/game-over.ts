import { checkEnding } from './achievements'
import type { DiseaseKey, GameState } from '../types'
import type { GameEnding } from '../types'

export interface GameOverResult {
  isOver: true
  reason: 'frustration' | 'anxiety'
  revealedInfection?: DiseaseKey | null
  ending?: GameEnding | null
}

export function checkGameOver(state: GameState): GameOverResult | null {
  if (state.frustration >= 100) {
    return {
      isOver: true,
      reason: 'frustration',
      ending: checkEnding(state),
      ...(state.isInfected && state.infectionData ? { revealedInfection: state.infectionData.disease } : {}),
    }
  }
  if (state.anxiety >= 100) {
    return {
      isOver: true,
      reason: 'anxiety',
      ending: checkEnding(state),
      ...(state.isInfected && state.infectionData ? { revealedInfection: state.infectionData.disease } : {}),
    }
  }
  return null
}

export function isPanicMode(anxiety: number): boolean {
  return anxiety >= 80
}
