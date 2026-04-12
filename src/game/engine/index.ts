export { createInitialState } from './state'
export { generatePartner } from './partner'
export { executeAction, getBlockedActions } from './actions'
export type { GameAction } from './actions'
export { goToHospital } from './hospital'
export { useTestkit } from './items'
export type { TestkitResult } from './items'
export { chat } from './chat'
export { checkGameOver, isPanicMode } from './game-over'
export type { GameOverResult } from './game-over'
export {
  applyEventChoice,
  getActiveEvent,
  getAvailableChoices,
  selectRandomEvent,
  shouldTriggerEvent,
} from './events'
export {
  ACHIEVEMENTS_STORAGE_KEY,
  checkAchievements,
  checkEnding,
  createAchievementProgress,
  getSeenEndings,
  getUnlockedAchievements,
  loadAchievementProgress,
  recordEndingSeen,
  resetRunProgress,
  saveAchievementProgress,
  unlockAchievement,
} from './achievements'
export { startDialogue, getCurrentNode, makeChoice, isDialogueComplete } from './dialogue'
