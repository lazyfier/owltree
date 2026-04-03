interface PanicEngineModule {
  isPanicMode: (anxiety: number) => boolean
}

const GAME_OVER_MODULE_PATH = '../game-over'

async function loadPanicEngine(): Promise<PanicEngineModule> {
  return import(GAME_OVER_MODULE_PATH) as Promise<PanicEngineModule>
}

describe('panic mode characterization (red phase)', () => {
  it('activates panic mode at anxiety >= 80', async () => {
    const { isPanicMode } = await loadPanicEngine()

    expect(isPanicMode(80)).toBe(true)
    expect(isPanicMode(95)).toBe(true)
  })

  it('clears panic mode when anxiety drops below 80', async () => {
    const { isPanicMode } = await loadPanicEngine()

    expect(isPanicMode(79)).toBe(false)
    expect(isPanicMode(0)).toBe(false)
  })
})
