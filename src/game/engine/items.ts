import { DISEASES } from '../data/diseases'
import type { GameState, Partner } from '../types'

export interface TestkitResult {
  state: GameState
  message: string
  icon: string
  isPositive: boolean
}

export function useTestkit(state: GameState, partner: Partner): TestkitResult {
  const newItems = { ...state.items, testkit: state.items.testkit - 1 }
  const revealedPartner: Partner = {
    ...partner,
    tags: partner.tags.map((t) => ({ ...t, revealed: true })),
  }

  if (partner.diseases.length > 0) {
    const names = partner.diseases.map((d) => DISEASES[d].name).join(', ')
    return {
      state: { ...state, items: newItems, currentPartner: revealedPartner },
      message: `⚠️ 阳性反应！\n病原体：${names}。\n请立即离开。`,
      icon: '🦠',
      isPositive: true,
    }
  }

  return {
    state: { ...state, items: newItems, currentPartner: revealedPartner },
    message: '✅ 阴性。\n未检测到常见病原体。\n(注：无法检测窗口期极短的病毒)',
    icon: '🛡️',
    isPositive: false,
  }
}
