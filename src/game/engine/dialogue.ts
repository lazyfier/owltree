import { DIALOGUE_TREES } from '../data/dialogues'
import type { DialogueNode, DialogueState } from '../types'

export function startDialogue(personality: string): DialogueState {
  return {
    currentNodeId: `${personality}-start`,
    history: [],
    effects: { frustration: 0, anxiety: 0 },
  }
}

export function getCurrentNode(state: DialogueState, personality: string): DialogueNode | null {
  const tree = DIALOGUE_TREES[personality as keyof typeof DIALOGUE_TREES]
  if (!tree) return null
  return tree.find(n => n.id === state.currentNodeId) ?? null
}

export function makeChoice(state: DialogueState, choiceIndex: number, personality: string): DialogueState {
  const node = getCurrentNode(state, personality)
  if (!node || node.isEnd) return state
  const choice = node.choices[choiceIndex]
  if (!choice) return state
  return {
    currentNodeId: choice.nextNodeId,
    history: [...state.history, state.currentNodeId],
    effects: {
      frustration: state.effects.frustration + (choice.effects?.frustration ?? 0),
      anxiety: state.effects.anxiety + (choice.effects?.anxiety ?? 0),
    },
  }
}

export function isDialogueComplete(state: DialogueState, personality: string): boolean {
  const node = getCurrentNode(state, personality)
  return node?.isEnd ?? false
}
