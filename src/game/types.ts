export type DiseaseKey = 'HIV' | 'SYPHILIS' | 'HERPES' | 'HPV' | 'GONORRHEA' | 'CRABS' | 'CHLAMYDIA' | 'HEPATITIS_B' | 'TRICHOMONIASIS'

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

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: string
  unlocked: boolean
}

export interface GameEnding {
  id: string
  name: string
  description: string
  icon: string
  condition: string
}

export interface GameAchievements {
  unlocked: string[]
  endingsSeen: string[]
  stats: Record<string, number>
}

export interface InventoryItems {
  testkit: number
}

export interface TestkitRewardRule {
  amount: number
  minTurn?: number
  chance?: number
}

export interface GameState {
  frustration: number
  anxiety: number
  turn: number
  difficulty: number
  items: InventoryItems
  achievements: GameAchievements
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
  chatCost: (turn: number) => number
  hospitalCost: number
  difficultyScale: number
  testkitRewardConditions: {
    refuse: TestkitRewardRule
    hospitalNegative: TestkitRewardRule
  }
  rewards: Record<ActionType, number>
  stress: Record<ActionType, number>
}

export interface FlirtLine {
  text: string
  category: 'direct' | 'teasing' | 'romantic' | 'aggressive' | 'subtle' | 'desperate'
}

export interface PartnerTemplate {
  templateId: string
  name: string
  backstory: string
  defaultTags: string[]
  personality: 'shy' | 'dominant' | 'playful' | 'cold' | 'anxious' | 'experienced' | 'romantic' | 'mysterious'
  dialogStyle: string
  emoji: string
}

export interface EventChoice {
  text: string
  effects: {
    frustration?: number
    anxiety?: number
    items?: Partial<InventoryItems>
  }
  nextEventId?: string
}

export interface EventTemplate {
  eventId: string
  title: string
  description: string
  choices: EventChoice[]
  triggerCondition?: {
    minTurn?: number
    maxTurn?: number
    minFrustration?: number
    minAnxiety?: number
    requiredItems?: Partial<InventoryItems>
  }
  priority: number
}

export interface DialogueChoice {
  text: string
  nextNodeId: string
  effects?: { frustration?: number; anxiety?: number }
}

export interface DialogueNode {
  id: string
  speaker: string
  text: string
  choices: DialogueChoice[]
  isEnd?: boolean
}

export interface DialogueState {
  currentNodeId: string
  history: string[]
  effects: { frustration: number; anxiety: number }
}
