import type { ActionType, DiseaseKey, GameState, Partner } from '@/game/types'

interface ActionsEngineModule {
  executeAction: (state: GameState, actionType: ActionType, rng: () => number) => GameState
}

interface HospitalEngineModule {
  goToHospital: (state: GameState) => GameState
}

interface GameOverEngineModule {
  checkGameOver: (state: GameState) => { isOver: true; reason: string; revealedInfection: DiseaseKey | null } | null
}

const ACTIONS_MODULE_PATH = '../actions'
const HOSPITAL_MODULE_PATH = '../hospital'
const GAME_OVER_MODULE_PATH = '../game-over'

function alwaysInfectRng(): number {
  return 0
}

function createRiskyPartner(): Partner {
  return {
    tags: [],
    diseases: ['HIV'],
    avatar: '🦠',
  }
}

function createState(): GameState {
  return {
    frustration: 50,
    anxiety: 0,
    turn: 1,
    items: { testkit: 1 },
    currentPartner: createRiskyPartner(),
    isInfected: false,
    infectionData: null,
    isGameOver: false,
    history: [],
  }
}

async function loadActionsEngine(): Promise<ActionsEngineModule> {
  return import(ACTIONS_MODULE_PATH) as Promise<ActionsEngineModule>
}

async function loadHospitalEngine(): Promise<HospitalEngineModule> {
  return import(HOSPITAL_MODULE_PATH) as Promise<HospitalEngineModule>
}

async function loadGameOverEngine(): Promise<GameOverEngineModule> {
  return import(GAME_OVER_MODULE_PATH) as Promise<GameOverEngineModule>
}

describe('delayed diagnosis characterization (red phase)', () => {
  it('keeps infection hidden immediately after a risky action', async () => {
    const { executeAction } = await loadActionsEngine()

    const nextState = executeAction(createState(), 'sex_raw', alwaysInfectRng)

    expect(nextState.isInfected).toBe(true)
    expect(nextState.isGameOver).toBe(false)
  })

  it('reveals infection at hospital and ends the run', async () => {
    const { executeAction } = await loadActionsEngine()
    const { goToHospital } = await loadHospitalEngine()

    const infectedState = executeAction(createState(), 'sex_raw', alwaysInfectRng)
    const hospitalState = goToHospital(infectedState)

    expect(hospitalState.isInfected).toBe(true)
    expect(hospitalState.isGameOver).toBe(true)
    expect(hospitalState.infectionData).not.toBeNull()
  })

  it('reveals infection in game-over payloads', async () => {
    const { executeAction } = await loadActionsEngine()
    const { checkGameOver } = await loadGameOverEngine()

    const infectedState = executeAction(createState(), 'sex_raw', alwaysInfectRng)
    const terminalState: GameState = {
      ...infectedState,
      frustration: 100,
    }
    const result = checkGameOver(terminalState)

    expect(result).not.toBeNull()
    expect(result?.revealedInfection).toBe('HIV')
  })
})
