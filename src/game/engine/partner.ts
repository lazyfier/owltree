import { ALL_TAGS } from '../data/tags'
import { DISEASES } from '../data/diseases'
import { AVATARS } from '../data/avatars'
import type { DiseaseKey, Partner, PartnerTag } from '../types'

export function generatePartner(rng: () => number): Partner {
  const numTags = Math.floor(rng() * 2) + 3
  const partnerTags: PartnerTag[] = []
  const selectedIndices = new Set<number>()
  const isCarrier = rng() < 0.4
  const hasConstraint = rng() < 0.4

  let loopLimit = 0
  while (partnerTags.length < numTags && loopLimit < 100) {
    loopLimit++
    const idx = Math.floor(rng() * ALL_TAGS.length)
    if (selectedIndices.has(idx)) continue
    const tagTemplate = ALL_TAGS[idx]

    // Carrier check: if carrier and first tag, skip non-red/amber colors
    if (isCarrier && partnerTags.length === 0 && !tagTemplate.colorClass.includes('red') && !tagTemplate.colorClass.includes('purple')) continue

    // Constraint enforcement: if hasConstraint and no constraint tag yet, skip non-constraint tags (first 50 iterations)
    if (hasConstraint && !partnerTags.some((t) => t.constraint) && !tagTemplate.constraint && loopLimit < 50) continue

    // Constraint incompatibility check
    const currentConstraints = partnerTags.map((t) => t.constraint).filter(Boolean) as string[]
    if (tagTemplate.constraint) {
      if (tagTemplate.constraint === 'no_oral' && currentConstraints.includes('oral_only')) continue
      if (tagTemplate.constraint === 'oral_only' && currentConstraints.includes('no_oral')) continue
    }

    selectedIndices.add(idx)

    // Hidden tag logic
    const currentHiddenCount = partnerTags.filter((t) => !t.revealed).length
    let isHidden = false
    if (currentHiddenCount === 0 && tagTemplate.hiddenChance > 0) {
      isHidden = rng() < tagTemplate.hiddenChance
    }

    partnerTags.push({ ...tagTemplate, revealed: !isHidden })
  }

  // Guarantee at least one revealed tag
  if (partnerTags.every((t) => !t.revealed) && partnerTags.length > 0) {
    partnerTags[0] = { ...partnerTags[0], revealed: true }
  }

  // Disease assignment
  const activeDiseases: DiseaseKey[] = []
  if (rng() < 0.05) {
    const keys = Object.keys(DISEASES) as DiseaseKey[]
    activeDiseases.push(keys[Math.floor(rng() * keys.length)])
  }

  for (const tag of partnerTags) {
    if (tag.risk) {
      for (const [dKey, prob] of Object.entries(tag.risk)) {
        if (rng() < prob && !activeDiseases.includes(dKey as DiseaseKey)) {
          activeDiseases.push(dKey as DiseaseKey)
        }
      }
    }
    if (tag.safeChance && rng() < tag.safeChance) {
      activeDiseases.length = 0
    }
  }

  return {
    tags: partnerTags,
    diseases: [...activeDiseases],
    avatar: AVATARS[Math.floor(rng() * AVATARS.length)],
  }
}
