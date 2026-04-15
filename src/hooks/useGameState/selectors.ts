import { getBlockedActions } from '@/game/engine/actions'
import { isPanicMode } from '@/game/engine/game-over'
import type { Constraint, Partner } from '@/game/types'

export function selectConstraints(partner: Partner | null): Constraint[] {
  if (!partner) return []

  return partner.tags
    .map((tag) => tag.constraint)
    .filter((constraint): constraint is Constraint => constraint !== undefined)
}

export function selectBlockedActions(partner: Partner | null) {
  return getBlockedActions(selectConstraints(partner))
}

export function selectHiddenCount(partner: Partner | null): number {
  if (!partner) return 0
  return partner.tags.filter((tag) => !tag.revealed).length
}

export function selectIsPanic(anxiety: number): boolean {
  return isPanicMode(anxiety)
}
