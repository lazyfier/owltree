import { CONFIG } from '../data/config'
import type { GameState } from '../types'

export function calculateDifficulty(turn: number): number {
  return Number((1 + Math.max(0, turn - 1) * CONFIG.difficultyScale).toFixed(2))
}

export function createInitialState(): GameState {
  return {
    frustration: 50,
    anxiety: 0,
    turn: 1,
    difficulty: calculateDifficulty(1),
    items: { testkit: 1 },
    achievements: {
      unlocked: [],
      endingsSeen: [],
      stats: {},
    },
    currentPartner: null,
    isInfected: false,
    infectionData: null,
    isGameOver: false,
    history: [],
  }
}
