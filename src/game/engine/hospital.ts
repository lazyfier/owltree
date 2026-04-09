import { CONFIG } from '../data/config'
import { checkGameOver } from './game-over'
import type { GameState } from '../types'

export function goToHospital(state: GameState): GameState {
  // Use advanceTime-style logic: hospital costs frustration, no direct anxiety cost
  let { frustration, anxiety } = state
  const turn = state.turn + 1
  frustration += CONFIG.hospitalCost

  // anxietyGainPassive applies if anxiety > 20 (same as advanceTime)
  // But hospital clears anxiety, so this only matters if anxiety was > 20 before
  if (anxiety > 20) anxiety += CONFIG.anxietyGainPassive

  if (frustration > 100) frustration = 100
  if (anxiety > 100) anxiety = 100

  let newState: GameState = { ...state, turn, frustration, anxiety }

  // Check if game over from frustration or anxiety
  const overResult = checkGameOver(newState)
  if (overResult) {
    return { ...newState, isGameOver: true }
  }

  // Clear anxiety (the main benefit of going to hospital)
  newState = { ...newState, anxiety: 0 }

  // If infected, game over — reveal infection
  if (newState.isInfected) {
    return { ...newState, isGameOver: true }
  }

  return newState
}
