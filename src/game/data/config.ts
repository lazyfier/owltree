import type { GameConfig } from '../types'

export const CONFIG: GameConfig = {
  startFrustration: 50,
  passiveGain: 8,
  anxietyGainPassive: 2,
  refuseCost: 0,
  chatCost: 3,
  hospitalCost: 10,
  rewards: {
    oral_condom: 6,
    oral_raw: 12,
    sex_condom: 10,
    sex_raw: 22,
  },
  stress: {
    oral_condom: 2,
    oral_raw: 15,
    sex_condom: 5,
    sex_raw: 30,
  },
}
