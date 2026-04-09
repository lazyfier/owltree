import type { GameState, DiseaseKey } from '../types'
import { DISEASES } from '../data/diseases'

export interface GameStats {
  outcomeCounts: {
    enjoy: number
    escape: number
    leave: number
    miss: number
    infected: number
  }
  actionCounts: {
    sex_raw: number
    sex_condom: number
    oral_raw: number
    oral_condom: number
    refuse: number
  }
  survivedTurns: number
}

export function computeStats(state: GameState): GameStats {
  const outcomeCounts = { enjoy: 0, escape: 0, leave: 0, miss: 0, infected: 0 }
  const actionCounts = { sex_raw: 0, sex_condom: 0, oral_raw: 0, oral_condom: 0, refuse: 0 }

  for (const h of state.history) {
    if (h.outcomeLabel.includes('理智享受')) outcomeCounts.enjoy++
    if (h.outcomeLabel.includes('死里逃生')) outcomeCounts.escape++
    if (h.outcomeLabel.includes('正确离开')) outcomeCounts.leave++
    if (h.outcomeLabel.includes('遗憾错过')) outcomeCounts.miss++
    if (h.outcomeLabel.includes('被ta感染')) outcomeCounts.infected++

    const actionKey = h.action as keyof typeof actionCounts
    if (actionKey in actionCounts) {
      actionCounts[actionKey]++
    }
  }

  return {
    outcomeCounts,
    actionCounts,
    survivedTurns: state.turn - 1,
  }
}

export function getDiseaseInfo(diseaseKey: DiseaseKey): { name: string; transmission: string } {
  const d = DISEASES[diseaseKey]
  return { name: d.name, transmission: d.transmission }
}
