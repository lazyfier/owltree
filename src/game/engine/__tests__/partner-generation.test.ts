import { ALL_TAGS } from '@/game/data/tags'
import type { Constraint, DiseaseKey, Partner } from '@/game/types'

import { createRng } from '../rng'

interface PartnerEngineModule {
  generatePartner: (rng: () => number) => Partner
}

const INCOMPATIBLE_CONSTRAINT_PAIRS: Array<[Constraint, Constraint]> = [['no_oral', 'oral_only']]
const PARTNER_MODULE_PATH = '../partner'

async function loadPartnerEngine(): Promise<PartnerEngineModule> {
  return import(PARTNER_MODULE_PATH) as Promise<PartnerEngineModule>
}

describe('engine RNG contract', () => {
  it('returns identical sequences for the same seed', () => {
    const rngA = createRng(42)
    const rngB = createRng(42)

    const sequenceA = Array.from({ length: 10 }, () => rngA())
    const sequenceB = Array.from({ length: 10 }, () => rngB())

    expect(sequenceA).toEqual(sequenceB)
  })
})

describe('partner generation characterization (red phase)', () => {
  it('generates 3-4 tags with at least one revealed tag', async () => {
    const { generatePartner } = await loadPartnerEngine()
    const partner = generatePartner(createRng(20260403))

    expect(partner.tags.length).toBeGreaterThanOrEqual(3)
    expect(partner.tags.length).toBeLessThanOrEqual(4)
    expect(partner.tags.some((tag) => tag.revealed)).toBe(true)
  })

  it('never includes incompatible constraint pairs in one partner', async () => {
    const { generatePartner } = await loadPartnerEngine()
    const rng = createRng(2026)

    for (let index = 0; index < 200; index += 1) {
      const partner = generatePartner(rng)
      const constraints = new Set(partner.tags.flatMap((tag) => (tag.constraint ? [tag.constraint] : [])))

      for (const [left, right] of INCOMPATIBLE_CONSTRAINT_PAIRS) {
        expect(constraints.has(left) && constraints.has(right)).toBe(false)
      }
    }
  })

  it('only assigns diseases from known keys and without duplicates', async () => {
    const { generatePartner } = await loadPartnerEngine()
    const rng = createRng(314159)
    const knownDiseases = new Set<DiseaseKey>(['HIV', 'SYPHILIS', 'HERPES', 'HPV', 'GONORRHEA', 'CRABS'])

    for (let index = 0; index < 120; index += 1) {
      const partner = generatePartner(rng)
      const uniqueDiseases = new Set(partner.diseases)

      expect(uniqueDiseases.size).toBe(partner.diseases.length)

      for (const disease of partner.diseases) {
        expect(knownDiseases.has(disease)).toBe(true)
      }
    }
  })

  it('only emits tags from the canonical tag dataset', async () => {
    const { generatePartner } = await loadPartnerEngine()
    const rng = createRng(8888)
    const knownTagTexts = new Set(ALL_TAGS.map((tag) => tag.text))

    for (let index = 0; index < 100; index += 1) {
      const partner = generatePartner(rng)
      partner.tags.forEach((tag) => {
        expect(knownTagTexts.has(tag.text)).toBe(true)
      })
    }
  })
})
