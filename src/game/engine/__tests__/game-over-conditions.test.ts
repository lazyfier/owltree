import type { GameState } from '@/game/types'

interface GameOverEngineModule {
  checkGameOver: (state: GameState) => { isOver: true; reason: 'frustration' | 'anxiety' } | null
}

const GAME_OVER_MODULE_PATH = '../game-over'

function createState(overrides: Partial<GameState> = {}): GameState {
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
    ...overrides,
  }
}

async function loadGameOverEngine(): Promise<GameOverEngineModule> {
  return import(GAME_OVER_MODULE_PATH) as Promise<GameOverEngineModule>
}

describe('game over threshold characterization (red phase)', () => {
  it('does not end the game below both thresholds', async () => {
    const { checkGameOver } = await loadGameOverEngine()

    expect(checkGameOver(createState({ frustration: 99, anxiety: 99 }))).toBeNull()
  })

  it('ends the game when frustration reaches 100', async () => {
    const { checkGameOver } = await loadGameOverEngine()

    expect(checkGameOver(createState({ frustration: 100, anxiety: 20 }))).toEqual({
      isOver: true,
      reason: 'frustration',
    })
  })

  it('ends the game when anxiety reaches 100', async () => {
    const { checkGameOver } = await loadGameOverEngine()

    expect(checkGameOver(createState({ frustration: 20, anxiety: 100 }))).toEqual({
      isOver: true,
      reason: 'anxiety',
    })
  })
})
