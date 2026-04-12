import { ACHIEVEMENTS } from '../data/achievements'
import { ENDINGS } from '../data/endings'
import type { Achievement, GameAchievements, GameEnding, GameState } from '../types'

export const ACHIEVEMENTS_STORAGE_KEY = 'moon-throw-achievements'

const SUCCESS_ENDING_IDS = new Set(['survivor', 'bad-victory', 'secret-carrier', 'perfectionist', 'extreme-survival'])

function getStat(stats: GameAchievements['stats'], key: string): number {
  const value = stats[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function sanitizeIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function sanitizeStats(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {}

  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => typeof entry === 'number' && Number.isFinite(entry)),
  )
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids)]
}

function getHistoryAvatars(state: GameState): Set<string> {
  return new Set(state.history.map((record) => record.avatar))
}

function getRiskyEscapeCount(state: GameState): number {
  return state.history.filter((record) => record.outcomeLabel.includes('死里逃生')).length
}

function getEndingById(endingId: string): GameEnding | null {
  return ENDINGS.find((ending) => ending.id === endingId) ?? null
}

function recordSeenEndingIds(progress: GameAchievements, endingId: string): GameAchievements {
  return {
    ...progress,
    endingsSeen: uniqueIds([...progress.endingsSeen, endingId]),
  }
}

export function createAchievementProgress(value?: Partial<GameAchievements>): GameAchievements {
  return {
    unlocked: uniqueIds(sanitizeIds(value?.unlocked)),
    endingsSeen: uniqueIds(sanitizeIds(value?.endingsSeen)),
    stats: sanitizeStats(value?.stats),
  }
}

export function loadAchievementProgress(): GameAchievements {
  if (typeof globalThis.localStorage === 'undefined') {
    return createAchievementProgress()
  }

  try {
    const raw = globalThis.localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY)
    if (!raw) return createAchievementProgress()
    return createAchievementProgress(JSON.parse(raw) as Partial<GameAchievements>)
  } catch {
    return createAchievementProgress()
  }
}

export function saveAchievementProgress(progress: GameAchievements): void {
  if (typeof globalThis.localStorage === 'undefined') {
    return
  }

  try {
    globalThis.localStorage.setItem(
      ACHIEVEMENTS_STORAGE_KEY,
      JSON.stringify(createAchievementProgress(progress)),
    )
  } catch {
    // Ignore storage failures and keep runtime state available.
  }
}

export function resetRunProgress(progress: GameAchievements): GameAchievements {
  return {
    ...progress,
    stats: {
      ...progress.stats,
      safeActionStreak: 0,
      revealedTagCount: 0,
      testkitUses: 0,
      hospitalVisits: 0,
      chatCount: 0,
      lateActionCount: 0,
      infectionTurn: 0,
      infectionRevealed: 0,
      maxAnxiety: 0,
      fastestEndingTurn: getStat(progress.stats, 'fastestEndingTurn'),
    },
  }
}

export function unlockAchievement(state: GameState, achievementId: string): GameState {
  if (state.achievements.unlocked.includes(achievementId)) {
    return state
  }

  return {
    ...state,
    achievements: {
      ...state.achievements,
      unlocked: [...state.achievements.unlocked, achievementId],
    },
  }
}

export function recordEndingSeen(state: GameState, endingId: string): GameState {
  if (state.achievements.endingsSeen.includes(endingId)) {
    return state
  }

  return {
    ...state,
    achievements: recordSeenEndingIds(state.achievements, endingId),
  }
}

export function checkAchievements(state: GameState): string[] {
  const { achievements } = state
  const unlocked = new Set(achievements.unlocked)
  const stats = achievements.stats
  const safeActionStreak = getStat(stats, 'safeActionStreak')
  const revealedTagCount = getStat(stats, 'revealedTagCount')
  const checkupCount = getStat(stats, 'testkitUses') + getStat(stats, 'hospitalVisits')
  const chatCount = getStat(stats, 'chatCount')
  const lateActionCount = getStat(stats, 'lateActionCount')
  const infectionTurn = getStat(stats, 'infectionTurn')
  const infectionRevealed = getStat(stats, 'infectionRevealed')
  const maxAnxiety = getStat(stats, 'maxAnxiety')
  const fastestEndingTurn = getStat(stats, 'fastestEndingTurn')
  const socialCount = getHistoryAvatars(state).size
  const riskyEscapeCount = getRiskyEscapeCount(state)
  const successfulRunSeen = achievements.endingsSeen.some((endingId) => SUCCESS_ENDING_IDS.has(endingId))
  const delayedDiagnosis = infectionRevealed > 0 && infectionTurn > 0 && state.turn - infectionTurn >= 2

  const newlyUnlocked = ACHIEVEMENTS.filter((achievement) => {
    if (unlocked.has(achievement.id)) return false

    switch (achievement.id) {
      case 'careful-player':
        return safeActionStreak >= 3
      case 'social-expert':
        return socialCount >= 3
      case 'lucky-one':
        return riskyEscapeCount >= 2
      case 'info-collector':
        return revealedTagCount >= 6
      case 'frequent-checkup':
        return checkupCount >= 2
      case 'lone-wolf':
        return state.turn >= 6 && chatCount === 0
      case 'first-survivor':
        return successfulRunSeen
      case 'bad-awakening':
        return delayedDiagnosis || achievements.endingsSeen.includes('confirmed-infection')
      case 'speed-runner':
        return fastestEndingTurn > 0 && fastestEndingTurn <= 5
      case 'procrastinator':
        return lateActionCount >= 4 && checkupCount === 0
      default:
        return false
    }
  }).map((achievement) => achievement.id)

  if (newlyUnlocked.length > 0 || maxAnxiety > 0) {
    return uniqueIds(newlyUnlocked)
  }

  return newlyUnlocked
}

export function checkEnding(state: GameState): GameEnding | null {
  const infectionRevealed = getStat(state.achievements.stats, 'infectionRevealed')
  const maxAnxiety = getStat(state.achievements.stats, 'maxAnxiety')
  const safeActionStreak = getStat(state.achievements.stats, 'safeActionStreak')

  if (state.frustration >= 100) {
    return getEndingById('burned-out')
  }

  if (state.anxiety >= 100) {
    return getEndingById('mental-breakdown')
  }

  if (state.isGameOver && state.isInfected && infectionRevealed > 0) {
    return getEndingById('confirmed-infection')
  }

  if (state.frustration > 0) {
    return null
  }

  if (state.isInfected && infectionRevealed === 0) {
    return getEndingById('secret-carrier')
  }

  if (maxAnxiety >= 70) {
    return getEndingById('extreme-survival')
  }

  if (safeActionStreak >= 5 && maxAnxiety <= 20) {
    return getEndingById('perfectionist')
  }

  if (state.isInfected) {
    return getEndingById('bad-victory')
  }

  return getEndingById('survivor')
}

export function getUnlockedAchievements(state: GameState): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => state.achievements.unlocked.includes(achievement.id))
}

export function getSeenEndings(state: GameState): GameEnding[] {
  return ENDINGS.filter((ending) => state.achievements.endingsSeen.includes(ending.id))
}
