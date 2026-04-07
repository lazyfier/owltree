import { CONFIG } from '../data/config'
import { checkGameOver } from './game-over'
import type { GameState } from '../types'

export function goToHospital(state: GameState): GameState {
  // Advance time with hospital cost
  let newState = {
    ...state,
    turn: state.turn + 1,
    frustration: state.frustration + CONFIG.hospitalCost,
  }
  if (newState.frustration > 100) newState.frustration = 100

  // Check if game over from frustration
  const overResult = checkGameOver(newState)
  if (overResult) {
    return { ...newState, isGameOver: true }
  }

  // Clear anxiety
  newState = { ...newState, anxiety: 0 }

  // If infected, game over — reveal infection
  if (newState.isInfected) {
    return { ...newState, isGameOver: true }
  }

  return newState
}
