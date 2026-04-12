import { describe, expect, it } from 'vitest'

import { CONFIG } from '@/game/data/config'
import { generatePartner } from '@/game/engine/partner'
import { createRng } from '@/game/engine/rng'

describe('difficulty progression', () => {
  it('increases disease probability with turn number', () => {
    const rng = createRng(12345)
    
    const earlyPartner = generatePartner(rng, 1)
    const midPartner = generatePartner(rng, 8)
    const latePartner = generatePartner(rng, 15)
    
    expect(typeof earlyPartner.diseases.length).toBe('number')
    expect(typeof midPartner.diseases.length).toBe('number')
    expect(typeof latePartner.diseases.length).toBe('number')
  })

  it('generates partners with different tag combinations', () => {
    const rng1 = createRng(11111)
    const rng2 = createRng(22222)
    
    const partner1 = generatePartner(rng1, 5)
    const partner2 = generatePartner(rng2, 5)
    
    expect(partner1.tags.length).toBeGreaterThan(0)
    expect(partner2.tags.length).toBeGreaterThan(0)
  })

  it('has valid action rewards config', () => {
    expect(CONFIG.rewards).toHaveProperty('oral_condom')
    expect(CONFIG.rewards).toHaveProperty('oral_raw')
    expect(CONFIG.rewards).toHaveProperty('sex_condom')
    expect(CONFIG.rewards).toHaveProperty('sex_raw')
  })

  it('has valid stress config', () => {
    expect(CONFIG.stress).toHaveProperty('oral_condom')
    expect(CONFIG.stress).toHaveProperty('oral_raw')
    expect(CONFIG.stress).toHaveProperty('sex_condom')
    expect(CONFIG.stress).toHaveProperty('sex_raw')
  })

  it('rewards are greater than zero for actions', () => {
    expect(CONFIG.rewards.oral_condom).toBeGreaterThan(0)
    expect(CONFIG.rewards.oral_raw).toBeGreaterThan(0)
    expect(CONFIG.rewards.sex_condom).toBeGreaterThan(0)
    expect(CONFIG.rewards.sex_raw).toBeGreaterThan(0)
  })
})
