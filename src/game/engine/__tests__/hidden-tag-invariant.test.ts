import type { Partner } from '@/game/types'

import { createRng } from '../rng'

interface PartnerEngineModule {
  generatePartner: (rng: () => number) => Partner
}

const PARTNER_MODULE_PATH = '../partner'

async function loadPartnerEngine(): Promise<PartnerEngineModule> {
  return import(PARTNER_MODULE_PATH) as Promise<PartnerEngineModule>
}

describe('hidden tag invariant characterization (red phase)', () => {
  it('always leaves at least one revealed tag on every generated partner', async () => {
    const { generatePartner } = await loadPartnerEngine()
    const rng = createRng(515151)

    for (let index = 0; index < 300; index += 1) {
      const partner = generatePartner(rng)
      expect(partner.tags.some((tag) => tag.revealed)).toBe(true)
    }
  })
})
