import type { DiseaseKey, GameState } from '../types'

export interface GameOverResult {
  isOver: true
  reason: 'frustration' | 'anxiety'
  revealedInfection?: DiseaseKey | null
}

export function checkGameOver(state: GameState): GameOverResult | null {
  if (state.frustration >= 100) {
    return {
      isOver: true,
      reason: 'frustration',
      ...(state.isInfected && state.infectionData ? { revealedInfection: state.infectionData.disease } : {}),
    }
  }
  if (state.anxiety >= 100) {
    return {
      isOver: true,
      reason: 'anxiety',
      ...(state.isInfected && state.infectionData ? { revealedInfection: state.infectionData.disease } : {}),
    }
  }
  return null
}

export function isPanicMode(anxiety: number): boolean {
  return anxiety >= 80
}
