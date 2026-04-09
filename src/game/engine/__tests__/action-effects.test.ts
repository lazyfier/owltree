import { CONFIG } from '@/game/data/config'
import type { ActionType, GameState, Partner } from '@/game/types'

import { createRng } from '../rng'

interface ActionsEngineModule {
  executeAction: (state: GameState, actionType: ActionType, rng: () => number) => GameState
}

const ACTIONS_MODULE_PATH = '../actions'

const ACTION_TYPES: ActionType[] = ['oral_condom', 'oral_raw', 'sex_condom', 'sex_raw']

function createPartner(): Partner {
  return {
    tags: [],
    diseases: [],
    avatar: '🧪',
  }
}

function createState(): GameState {
  return {
    frustration: 50,
    anxiety: 0,
    turn: 1,
    items: { testkit: 1 },
    currentPartner: createPartner(),
    isInfected: false,
    infectionData: null,
    isGameOver: false,
    history: [],
  }
}

async function loadActionsEngine(): Promise<ActionsEngineModule> {
  return import(ACTIONS_MODULE_PATH) as Promise<ActionsEngineModule>
}

describe('action effects characterization (red phase)', () => {
  it.each(ACTION_TYPES)('maps %s to exact CONFIG frustration/anxiety effects', async (actionType) => {
    const { executeAction } = await loadActionsEngine()
    const startState = createState()

    const nextState = executeAction(startState, actionType, createRng(1234))

    const expectedFrustration = Math.max(0, startState.frustration + CONFIG.passiveGain - CONFIG.rewards[actionType])
    expect(nextState.frustration).toBe(expectedFrustration)

    // anxietyGainPassive (+2) kicks in when anxiety exceeds 20 after adding action stress
    const baseAnxiety = startState.anxiety + CONFIG.stress[actionType]
    const expectedAnxiety = baseAnxiety > 20 ? baseAnxiety + CONFIG.anxietyGainPassive : baseAnxiety
    expect(nextState.anxiety).toBe(expectedAnxiety)
  })
})
