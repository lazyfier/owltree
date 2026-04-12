import { describe, expect, it } from 'vitest'

import { DIALOGUE_TREES } from '@/game/data/dialogues'
import { startDialogue, makeChoice, isDialogueComplete } from '@/game/engine/dialogue'

describe('dialogue system', () => {
  it('starts a dialogue with initial state', () => {
    const state = startDialogue('shy')
    expect(state.currentNodeId).toBe('shy-start')
    expect(state.effects.frustration).toBe(0)
    expect(state.effects.anxiety).toBe(0)
  })

  it('makes a choice and advances to next node', () => {
    let state = startDialogue('shy')
    state = makeChoice(state, 0, 'shy')
    expect(state.currentNodeId).toBe('shy-soft')
    expect(state.effects.anxiety).toBe(-1)
  })

  it('applies frustration effects correctly', () => {
    let state = startDialogue('dominant')
    state = makeChoice(state, 1, 'dominant') // resist option
    expect(state.effects.frustration).toBe(2)
  })

  it('detects dialogue completion at end nodes', () => {
    let state = startDialogue('shy')
    expect(isDialogueComplete(state, 'shy')).toBe(false)
    state = makeChoice(state, 0, 'shy')
    expect(isDialogueComplete(state, 'shy')).toBe(true)
  })

  it('returns same state for invalid choice index', () => {
    const state = startDialogue('shy')
    const nextState = makeChoice(state, 99, 'shy')
    expect(nextState).toBe(state)
  })

  it('accumulates effects across multiple choices', () => {
    // Playful -> serious -> end
    let state = startDialogue('playful')
    state = makeChoice(state, 1, 'playful')
    expect(state.effects.frustration).toBe(1)
    expect(isDialogueComplete(state, 'playful')).toBe(true)
  })

  it('works with all personality types', () => {
    const personalities = Object.keys(DIALOGUE_TREES)
    expect(personalities.length).toBeGreaterThanOrEqual(8)
    
    for (const personality of personalities) {
      const state = startDialogue(personality)
      expect(state.currentNodeId).toBe(`${personality}-start`)
    }
  })
})
