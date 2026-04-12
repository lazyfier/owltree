import { ACHIEVEMENTS } from '@/game/data/achievements'
import { ENDINGS } from '@/game/data/endings'
import type { GameState } from '@/game/types'

interface AchievementsEngineModule {
  checkAchievements: (state: GameState) => string[]
  unlockAchievement: (state: GameState, achievementId: string) => GameState
  getUnlockedAchievements: (state: GameState) => typeof ACHIEVEMENTS
  getSeenEndings: (state: GameState) => typeof ENDINGS
  checkEnding: (state: GameState) => { id: string; name: string; description: string; icon: string; condition: string } | null
}

const ACHIEVEMENTS_MODULE_PATH = '../achievements'

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    frustration: 50,
    anxiety: 0,
    turn: 1,
    difficulty: 1,
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
    ...overrides,
  }
}

async function loadAchievementsEngine(): Promise<AchievementsEngineModule> {
  return import(ACHIEVEMENTS_MODULE_PATH) as Promise<AchievementsEngineModule>
}

describe('achievements engine (red phase)', () => {
  it('unlocks achievements without duplicating existing ids', async () => {
    const { unlockAchievement } = await loadAchievementsEngine()

    const once = unlockAchievement(createState(), 'careful-player')
    const twice = unlockAchievement(once, 'careful-player')

    expect(twice.achievements.unlocked).toEqual(['careful-player'])
  })

  it('detects newly completed achievements from run stats', async () => {
    const { checkAchievements } = await loadAchievementsEngine()

    const unlocked = checkAchievements(createState({
      achievements: {
        unlocked: [],
        endingsSeen: [],
        stats: {
          safeActionStreak: 3,
        },
      },
    }))

    expect(unlocked).toContain('careful-player')
  })

  it('returns fully populated unlocked achievement metadata', async () => {
    const { getUnlockedAchievements } = await loadAchievementsEngine()

    const achievements = getUnlockedAchievements(createState({
      achievements: {
        unlocked: ['careful-player'],
        endingsSeen: [],
        stats: {},
      },
    }))

    expect(achievements).toEqual([ACHIEVEMENTS[0]])
  })

  it('returns seen ending metadata from stored ending ids', async () => {
    const { getSeenEndings } = await loadAchievementsEngine()

    const endings = getSeenEndings(createState({
      achievements: {
        unlocked: [],
        endingsSeen: ['secret-carrier'],
        stats: {},
      },
    }))

    expect(endings).toEqual([ENDINGS[5]])
  })

  it('detects the secret carrier ending for hidden infected survival', async () => {
    const { checkEnding } = await loadAchievementsEngine()

    expect(checkEnding(createState({
      frustration: 0,
      isInfected: true,
      infectionData: {
        disease: 'HIV',
        transmission: '体液',
      },
      achievements: {
        unlocked: [],
        endingsSeen: [],
        stats: {
          infectionRevealed: 0,
        },
      },
    })))
      .toEqual(ENDINGS[5])
  })
})
