import type { GameAction } from '@/game/engine/actions'
import type { GameState } from '@/game/types'

export type GamePhase = 'intro' | 'playing' | 'feedback' | 'gameover' | 'help'

export interface FeedbackData {
  title: string
  message: string
  icon: string
  isGameOver: boolean
  keepPartner?: boolean
  reason?: string
  history?: GameState['history']
}

export interface GameStore {
  state: GameState
  phase: GamePhase
  feedback: FeedbackData | null
  flirtLine: string
}

export interface ProgressOptions {
  trigger?: 'TAKE_ACTION' | 'END_DIALOGUE' | 'CHOOSE_EVENT_OPTION' | 'GAME_OVER'
  action?: GameAction
  usedTestkit?: boolean
  wentToHospital?: boolean
  endedDialogue?: boolean
  revealedInfection?: boolean
}

export type GameStoreAction =
  | { type: 'START_GAME' }
  | { type: 'TAKE_ACTION'; action: GameAction }
  | { type: 'NEXT_PARTNER' }
  | { type: 'GO_TO_HOSPITAL' }
  | { type: 'USE_TESTKIT' }
  | { type: 'CHAT' }
  | { type: 'SHOW_FEEDBACK'; data: FeedbackData }
  | { type: 'CLOSE_FEEDBACK' }
  | { type: 'SHOW_HELP' }
  | { type: 'CLOSE_HELP' }
