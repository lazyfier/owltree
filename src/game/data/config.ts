import type { GameConfig } from '../types'

const DIFFICULTY_SCALE = 0.1

export const CONFIG: GameConfig = {
  startFrustration: 50,
  passiveGain: 8,
  anxietyGainPassive: 2,
  refuseCost: 0,
  chatCost: (turn) => 3 + Math.max(0, Math.floor((turn - 1) * DIFFICULTY_SCALE)),
  hospitalCost: 10,
  difficultyScale: DIFFICULTY_SCALE,
  testkitRewardConditions: {
    refuse: {
      amount: 1,
      minTurn: 3,
      chance: 0.3,
    },
    hospitalNegative: {
      amount: 1,
    },
  },
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
