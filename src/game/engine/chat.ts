import type { Partner } from '../types'

export function chat(partner: Partner, rng: () => number): Partner {
  const hiddenIndices = partner.tags.map((t, i) => (!t.revealed ? i : -1)).filter((i) => i !== -1)
  if (hiddenIndices.length === 0) return partner

  const idx = hiddenIndices[Math.floor(rng() * hiddenIndices.length)]
  return {
    ...partner,
    tags: partner.tags.map((t, i) => (i === idx ? { ...t, revealed: true } : t)),
  }
}
