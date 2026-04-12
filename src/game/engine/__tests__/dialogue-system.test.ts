import { describe, expect, it } from 'vitest'

import { getCurrentNode, isDialogueComplete, makeChoice, startDialogue } from '../dialogue'

describe('dialogue system', () => {
  it('can start a dialogue and get the current node', () => {
    const state = startDialogue('shy')

    expect(state.currentNodeId).toBe('shy-start')
    expect(getCurrentNode(state, 'shy')?.id).toBe('shy-start')
  })

  it('can make a choice and move to the next node', () => {
    const state = startDialogue('playful')
    const nextState = makeChoice(state, 0, 'playful')

    expect(nextState.currentNodeId).toBe('playful-play')
    expect(nextState.history).toEqual(['playful-start'])
  })

  it('returns true when the dialogue reaches an end node', () => {
    const state = makeChoice(startDialogue('romantic'), 0, 'romantic')

    expect(isDialogueComplete(state, 'romantic')).toBe(true)
  })
})
