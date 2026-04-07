import type { GameState } from '../types'

export function createInitialState(): GameState {
  return {
    frustration: 50,
    anxiety: 0,
    turn: 1,
    items: { testkit: 1 },
    currentPartner: null,
    isInfected: false,
    infectionData: null,
    isGameOver: false,
    history: [],
  }
}
