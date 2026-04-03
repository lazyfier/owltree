import type { ActionType, Constraint, Partner } from '@/game/types'

import { createRng } from '../rng'

interface PartnerEngineModule {
  generatePartner: (rng: () => number) => Partner
}

interface ActionsEngineModule {
  getBlockedActions: (constraints: Constraint[]) => ActionType[]
}

const PARTNER_MODULE_PATH = '../partner'
const ACTIONS_MODULE_PATH = '../actions'

async function loadPartnerEngine(): Promise<PartnerEngineModule> {
  return import(PARTNER_MODULE_PATH) as Promise<PartnerEngineModule>
}

async function loadActionsEngine(): Promise<ActionsEngineModule> {
  return import(ACTIONS_MODULE_PATH) as Promise<ActionsEngineModule>
}

describe('constraint system characterization (red phase)', () => {
  it('blocks condom actions when no_condom is present', async () => {
    const { getBlockedActions } = await loadActionsEngine()

    expect(getBlockedActions(['no_condom'])).toEqual(expect.arrayContaining(['oral_condom', 'sex_condom']))
  })

  it('blocks sex actions when oral_only is present', async () => {
    const { getBlockedActions } = await loadActionsEngine()

    expect(getBlockedActions(['oral_only'])).toEqual(expect.arrayContaining(['sex_condom', 'sex_raw']))
  })

  it('never co-generates oral_only and no_oral constraints together', async () => {
    const { generatePartner } = await loadPartnerEngine()
    const rng = createRng(998877)

    for (let index = 0; index < 250; index += 1) {
      const partner = generatePartner(rng)
      const constraints = new Set(partner.tags.flatMap((tag) => (tag.constraint ? [tag.constraint] : [])))

      expect(constraints.has('oral_only') && constraints.has('no_oral')).toBe(false)
    }
  })
})
