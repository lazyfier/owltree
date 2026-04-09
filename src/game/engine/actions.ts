import { CONFIG } from '../data/config'
import { DISEASES } from '../data/diseases'
import type { ActionType, Constraint, GameState, Partner } from '../types'

export type GameAction = ActionType | 'chat' | 'refuse'

export function getBlockedActions(constraints: Constraint[]): ActionType[] {
  const blocked: ActionType[] = []
  for (const c of constraints) {
    if (c === 'no_condom') {
      blocked.push('oral_condom', 'sex_condom')
    } else if (c === 'condom_only') {
      blocked.push('oral_raw', 'sex_raw')
    } else if (c === 'no_oral') {
      blocked.push('oral_condom', 'oral_raw')
    } else if (c === 'oral_only') {
      blocked.push('sex_condom', 'sex_raw')
    }
  }
  return blocked
}

function advanceTime(state: GameState, fCost: number, aCost: number): GameState {
  let { frustration, anxiety } = state
  const turn = state.turn + 1
  frustration += fCost
  anxiety += aCost
  if (anxiety > 20) anxiety += CONFIG.anxietyGainPassive
  if (frustration > 100) frustration = 100
  if (anxiety > 100) anxiety = 100
  return { ...state, turn, frustration, anxiety }
}

function recordHistory(partner: Partner, action: string, infectedThisTurn: boolean, isDiseased: boolean): GameState['history'][number] {
  let outcomeLabel = ''
  let outcomeClass = ''

  if (action === 'refuse') {
    if (isDiseased) {
      outcomeLabel = '🛡️ 正确离开'
      outcomeClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-900/20'
    } else {
      outcomeLabel = '👋 遗憾错过'
      outcomeClass = 'text-slate-400 border-slate-500/30 bg-slate-800'
    }
  } else {
    if (infectedThisTurn) {
      outcomeLabel = '💀 被ta感染'
      outcomeClass = 'text-rose-500 border-rose-500/30 bg-rose-900/30'
    } else if (isDiseased) {
      outcomeLabel = '😰 死里逃生'
      outcomeClass = 'text-amber-400 border-amber-500/30 bg-amber-900/20'
    } else {
      outcomeLabel = '✅ 理智享受'
      outcomeClass = 'text-blue-400 border-blue-500/30 bg-blue-900/20'
    }
  }

  return {
    avatar: partner.avatar,
    tags: partner.tags,
    diseases: partner.diseases,
    action,
    outcomeLabel,
    outcomeClass,
  }
}

export function executeAction(state: GameState, actionType: GameAction, rng: () => number): GameState {
  const partner = state.currentPartner
  if (!partner) return state

  // Chat action
  if (actionType === 'chat') {
    const hiddenIndices = partner.tags.map((t, i) => (!t.revealed ? i : -1)).filter((i) => i !== -1)
    let updatedPartner = partner
    if (hiddenIndices.length > 0) {
      const idx = hiddenIndices[Math.floor(rng() * hiddenIndices.length)]
      updatedPartner = {
        ...partner,
        tags: partner.tags.map((t, i) => (i === idx ? { ...t, revealed: true } : t)),
      }
    }
    const newState = advanceTime(state, CONFIG.chatCost, 0)
    return { ...newState, currentPartner: updatedPartner }
  }

  // Refuse action
  if (actionType === 'refuse') {
    const isDiseased = partner.diseases.length > 0
    const historyEntry = recordHistory(partner, 'refuse', false, isDiseased)
    const newState = advanceTime(state, CONFIG.passiveGain + CONFIG.refuseCost, 0)
    return { ...newState, history: [...newState.history, historyEntry] }
  }

  // Action types: oral_condom, oral_raw, sex_condom, sex_raw
  let isInfected = state.isInfected
  let infectionData = state.infectionData
  let infectedThisTurn = false

  if (!isInfected && partner.diseases.length > 0) {
    for (const dKey of partner.diseases) {
      const disease = DISEASES[dKey]
      let chance = 0
      if (actionType === 'sex_raw') chance = 0.95
      else if (actionType === 'oral_raw') chance = (disease.riskType.includes('skin') || disease.riskType.includes('mucous')) ? 0.5 : 0.1
      else if (actionType === 'sex_condom') {
        if (disease.riskType === 'skin_hair') chance = 1.0
        else if (disease.riskType === 'contact') chance = 0.3
        else chance = 0.02
      }
      else if (actionType === 'oral_condom') chance = 0.01

      if (rng() < chance) {
        isInfected = true
        infectionData = { disease: dKey, transmission: disease.transmission }
        infectedThisTurn = true
        break
      }
    }
  }

  const isDiseased = partner.diseases.length > 0
  const historyEntry = recordHistory(partner, actionType, infectedThisTurn, isDiseased)

  const reduction = CONFIG.rewards[actionType]
  const frustrationDelta = CONFIG.passiveGain - reduction
  const anxietyGain = CONFIG.stress[actionType]

  let newState = advanceTime(state, frustrationDelta, anxietyGain)

  // Clamp frustration to 0 minimum
  if (newState.frustration < 0) newState = { ...newState, frustration: 0 }

  return {
    ...newState,
    isInfected,
    infectionData,
    history: [...newState.history, historyEntry],
  }
}
