import { describe, expect, it } from 'vitest'

import { ACHIEVEMENTS } from '@/game/data/achievements'
import { ENDINGS } from '@/game/data/endings'
import { checkAchievements, checkEnding, unlockAchievement, recordEndingSeen } from '@/game/engine/achievements'
import type { GameState } from '@/game/types'

function createGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    frustration: 50,
    anxiety: 10,
    turn: 3,
    difficulty: 1.2,
    items: { testkit: 1 },
    achievements: {
      unlocked: [],
      endingsSeen: [],
      stats: {
        safeActionStreak: 0,
        revealedTagCount: 0,
        maxAnxiety: 0,
        testkitUses: 0,
        hospitalVisits: 0,
        chatCount: 0,
        lateActionCount: 0,
        infectionTurn: 0,
        infectionRevealed: 0,
      },
    },
    currentPartner: null,
    isInfected: false,
    infectionData: null,
    isGameOver: false,
    history: [],
    ...overrides,
  }
}

describe('achievements system', () => {
  it('unlocks achievement correctly', () => {
    const state = createGameState()
    const nextState = unlockAchievement(state, 'first_survivor')
    
    expect(nextState.achievements.unlocked).toContain('first_survivor')
    expect(nextState).not.toBe(state)
  })

  it('records ending seen', () => {
    const state = createGameState()
    const nextState = recordEndingSeen(state, 'survivor')
    
    expect(nextState.achievements.endingsSeen).toContain('survivor')
  })

  it('checks for survivor ending when frustration is zero', () => {
    const state = createGameState({ frustration: 0 })
    const ending = checkEnding(state)
    
    expect(ending).toBeDefined()
    expect(ending?.id).toBe('survivor')
  })

  it('checks achievements based on stats', () => {
    const state = createGameState({
      achievements: {
        ...createGameState().achievements,
        unlocked: [],
        stats: {
          safeActionStreak: 10,
          revealedTagCount: 0,
          maxAnxiety: 0,
          testkitUses: 0,
          hospitalVisits: 0,
          chatCount: 0,
          lateActionCount: 0,
          infectionTurn: 0,
          infectionRevealed: 0,
        },
      },
    })
    
    const unlocked = checkAchievements(state)
    expect(unlocked).toContain('careful-player')
  })

  it('returns all achievement definitions', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(8)
    expect(ACHIEVEMENTS[0]).toHaveProperty('id')
    expect(ACHIEVEMENTS[0]).toHaveProperty('name')
    expect(ACHIEVEMENTS[0]).toHaveProperty('description')
  })

  it('returns all ending definitions', () => {
    expect(ENDINGS.length).toBeGreaterThanOrEqual(5)
    expect(ENDINGS[0]).toHaveProperty('id')
    expect(ENDINGS[0]).toHaveProperty('name')
    expect(ENDINGS[0]).toHaveProperty('description')
  })
})
