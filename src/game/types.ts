export type DiseaseKey = 'HIV' | 'SYPHILIS' | 'HERPES' | 'HPV' | 'GONORRHEA' | 'CRABS'

export type ActionType = 'oral_condom' | 'oral_raw' | 'sex_condom' | 'sex_raw'

export type Constraint = 'no_oral' | 'oral_only' | 'no_condom' | 'condom_only'

export type RiskMap = Partial<Record<DiseaseKey, number>>

export interface Disease {
  name: string
  riskType: string
  desc: string
  transmission: string
}

export interface Tag {
  text: string
  colorClass: string
  risk: RiskMap
  constraint?: Constraint
  clue: string
  hiddenChance: number
  safeChance?: number
  safetyBonus?: boolean
}

export interface PartnerTag extends Tag {
  revealed: boolean
}

export interface Partner {
  tags: PartnerTag[]
  diseases: DiseaseKey[]
  avatar: string
}

export interface InfectionData {
  disease: DiseaseKey
  transmission: string
}

export interface TurnRecord {
  avatar: string
  tags: PartnerTag[]
  diseases: DiseaseKey[]
  action: string
  outcomeLabel: string
  outcomeClass: string
}

export interface InventoryItems {
  testkit: number
}

export interface GameState {
  frustration: number
  anxiety: number
  turn: number
  items: InventoryItems
  currentPartner: Partner | null
  isInfected: boolean
  infectionData: InfectionData | null
  isGameOver: boolean
  history: TurnRecord[]
}

export interface GameConfig {
  startFrustration: number
  passiveGain: number
  anxietyGainPassive: number
  refuseCost: number
  chatCost: number
  hospitalCost: number
  rewards: Record<ActionType, number>
  stress: Record<ActionType, number>
}
