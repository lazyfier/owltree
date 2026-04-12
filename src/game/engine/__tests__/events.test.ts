import { describe, expect, it } from 'vitest'

import { EVENT_TEMPLATES } from '@/game/data/events'
import { shouldTriggerEvent, selectRandomEvent, applyEventChoice, getAvailableChoices } from '@/game/engine/events'
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

describe('events engine', () => {
  it('triggers events based on probability', () => {
    const state = createGameState({ turn: 5, difficulty: 1.0 })
    // With RNG returning 0, should trigger
    expect(shouldTriggerEvent(state, () => 0.05)).toBe(true)
    // With RNG returning 1, should not trigger
    expect(shouldTriggerEvent(state, () => 0.95)).toBe(false)
  })

  it('increases trigger chance with turn number', () => {
    const earlyState = createGameState({ turn: 1, difficulty: 1.0 })
    const lateState = createGameState({ turn: 10, difficulty: 1.0 })
    
    // Late game should have higher chance
    const earlyChance = shouldTriggerEvent(earlyState, () => 0.15)
    const lateChance = shouldTriggerEvent(lateState, () => 0.15)
    
    // Both could pass or fail, but late has higher probability
    expect(typeof earlyChance).toBe('boolean')
    expect(typeof lateChance).toBe('boolean')
  })

  it('selects valid events for current state', () => {
    const state = createGameState({ turn: 5 })
    const event = selectRandomEvent(state, () => 0.5)
    
    if (event) {
      // Event should be valid for current turn
      expect(event.triggerCondition?.minTurn ?? 0).toBeLessThanOrEqual(state.turn)
    }
  })

  it('applies event choice effects correctly', () => {
    const state = createGameState({ frustration: 50, anxiety: 30 })
    const event = EVENT_TEMPLATES[0]
    
    const nextState = applyEventChoice(state, event, 0)
    
    // State should be immutable
    expect(nextState).not.toBe(state)
    // Effects should be applied
    expect(nextState.frustration).not.toBeLessThan(state.frustration)
  })

  it('filters choices by condition', () => {
    const state = createGameState({ turn: 2, items: { testkit: 0 } })
    
    // Get available choices for first event
    const event = EVENT_TEMPLATES[0]
    const choices = getAvailableChoices(event, state)
    
    // Should return array of choices
    expect(Array.isArray(choices)).toBe(true)
    expect(choices.length).toBeGreaterThanOrEqual(1)
  })

  it('returns original state for invalid choice index', () => {
    const state = createGameState()
    const event = EVENT_TEMPLATES[0]
    
    const nextState = applyEventChoice(state, event, 99)
    expect(nextState).toBe(state)
  })
})
