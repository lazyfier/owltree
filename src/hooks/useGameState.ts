import { useReducer, useCallback, useEffect, useMemo } from 'react'

import { CONFIG } from '@/game/data/config'
import { DISEASES } from '@/game/data/diseases'
import { FLIRT_LINES } from '@/game/data/flirtLines'
import {
  checkAchievements,
  checkEnding,
  loadAchievementProgress,
  recordEndingSeen,
  resetRunProgress,
  saveAchievementProgress,
  unlockAchievement,
} from '@/game/engine/achievements'
import { executeAction, getBlockedActions } from '@/game/engine/actions'
import type { GameAction } from '@/game/engine/actions'
import { chat } from '@/game/engine/chat'
import { checkGameOver, isPanicMode } from '@/game/engine/game-over'
import type { GameOverResult } from '@/game/engine/game-over'
import { goToHospital } from '@/game/engine/hospital'
import { useTestkit as testkit } from '@/game/engine/items'
import { generatePartner } from '@/game/engine/partner'
import { createRngFromMath } from '@/game/engine/rng'
import { createInitialState } from '@/game/engine/state'
import type { ActionType, Constraint, GameEnding, GameState } from '@/game/types'

type GamePhase = 'intro' | 'playing' | 'feedback' | 'gameover' | 'help'
type ProgressTrigger = 'TAKE_ACTION' | 'END_DIALOGUE' | 'CHOOSE_EVENT_OPTION' | 'GAME_OVER'

interface FeedbackData {
  title: string
  message: string
  icon: string
  isGameOver: boolean
  reason?: string
  history?: GameState['history']
}

interface GameStore {
  state: GameState
  phase: GamePhase
  feedback: FeedbackData | null
  flirtLine: string
}

type GameActionType =
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

function pickFlirtLine(): string {
  return FLIRT_LINES[Math.floor(Math.random() * FLIRT_LINES.length)]?.text ?? ''
}

function getActionLabel(action: string): string {
  const labels: Record<string, string> = {
    oral_condom: '戴套口交',
    oral_raw: '无套口交',
    sex_condom: '戴套性交',
    sex_raw: '无套性交',
  }
  return labels[action] ?? action
}

function buildActionFeedback(
  action: ActionType,
  reduction: number,
  anxietyGain: number,
  wasInfectedBefore: boolean,
  isInfectedNow: boolean,
  isDiseased: boolean,
): { title: string; message: string; icon: string } {
  const actionLabel = getActionLabel(action)

  let title = '宣泄与不安'
  let icon = '🍬'
  let msg = `你选择了${actionLabel}。\n生理压抑 -${reduction}`

  if (anxietyGain > 5) {
    msg += `\n心理压力 +${anxietyGain}`
    icon = '😰'
  }

  if (isInfectedNow && !wasInfectedBefore) {
    msg += '\n\n你感觉到了一丝异样，但也许只是错觉...？'
  } else if (isDiseased && !isInfectedNow) {
    msg += '\n\n虽然过程很惊险，但你似乎运气不错...暂时。'
  }

  return { title, message: msg, icon }
}

function getStat(state: GameState, key: string): number {
  const value = state.achievements.stats[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
}

function countRevealedTags(state: GameState): number {
  return state.currentPartner?.tags.filter((tag) => tag.revealed).length ?? 0
}

function updateAchievementStats(state: GameState, updates: Record<string, number>): GameState {
  return {
    ...state,
    achievements: {
      ...state.achievements,
      stats: {
        ...state.achievements.stats,
        ...updates,
      },
    },
  }
}

function applyProgressChecks(
  prevState: GameState,
  nextState: GameState,
  options: {
    trigger: ProgressTrigger
    action?: GameAction
    usedTestkit?: boolean
    wentToHospital?: boolean
    endedDialogue?: boolean
    revealedInfection?: boolean
  },
): GameState {
  const safeAction = options.action === 'refuse' || options.action === 'oral_condom' || options.action === 'sex_condom'
  const revealedTagsDelta = Math.max(0, countRevealedTags(nextState) - countRevealedTags(prevState))
  const currentFastestEndingTurn = getStat(nextState, 'fastestEndingTurn')

  let progressedState = updateAchievementStats(nextState, {
    maxAnxiety: Math.max(getStat(nextState, 'maxAnxiety'), nextState.anxiety),
    revealedTagCount: getStat(nextState, 'revealedTagCount') + revealedTagsDelta,
    testkitUses: getStat(nextState, 'testkitUses') + (options.usedTestkit ? 1 : 0),
    hospitalVisits: getStat(nextState, 'hospitalVisits') + (options.wentToHospital ? 1 : 0),
    chatCount: getStat(nextState, 'chatCount') + (options.endedDialogue ? 1 : 0),
    lateActionCount: getStat(nextState, 'lateActionCount') + (options.action && prevState.turn >= 5 ? 1 : 0),
    infectionTurn: !prevState.isInfected && nextState.isInfected ? nextState.turn : getStat(nextState, 'infectionTurn'),
    infectionRevealed: getStat(nextState, 'infectionRevealed') + (options.revealedInfection ? 1 : 0),
    safeActionStreak:
      options.action === undefined
        ? getStat(nextState, 'safeActionStreak')
        : safeAction && !(!prevState.isInfected && nextState.isInfected)
          ? getStat(nextState, 'safeActionStreak') + 1
          : 0,
  })

  const ending = checkEnding(progressedState)
  if (ending) {
    progressedState = updateAchievementStats(recordEndingSeen(progressedState, ending.id), {
      fastestEndingTurn:
        currentFastestEndingTurn > 0
          ? Math.min(currentFastestEndingTurn, progressedState.turn)
          : progressedState.turn,
    })
  }

  return checkAchievements(progressedState).reduce(
    (state, achievementId) => unlockAchievement(state, achievementId),
    progressedState,
  )
}

function buildEndingFeedback(ending: GameEnding, state: GameState): FeedbackData {
  const diseaseName = state.infectionData ? DISEASES[state.infectionData.disease].name : ''
  const transmission = state.infectionData?.transmission ?? ''

  switch (ending.id) {
    case 'burned-out':
      return {
        title: '欲火焚身',
        message: '长期的压抑让你彻底失去了理智。你无法再思考后果，在绝望中发生了一次随机的高危行为。',
        icon: '🤯',
        isGameOver: true,
        reason: ending.id,
        history: state.history,
      }
    case 'mental-breakdown':
      return {
        title: '精神崩溃',
        message: '巨大的心理压力压垮了你。你开始出现幻觉，被送往了精神病院，游戏结束。',
        icon: '😵‍💫',
        isGameOver: true,
        reason: ending.id,
        history: state.history,
      }
    case 'confirmed-infection':
      return {
        title: ending.name,
        message: `很遗憾，检查结果最终证实你已感染。\n\n确诊：${diseaseName}\n途径：${transmission}`,
        icon: ending.icon,
        isGameOver: true,
        reason: ending.id,
        history: state.history,
      }
    case 'secret-carrier':
      return {
        title: ending.name,
        message: '你的压抑值清零了，表面上看一切如常。\n但那个危险的夜晚仍留在体内，真相暂时还没有被任何人发现。',
        icon: ending.icon,
        isGameOver: true,
        reason: ending.id,
        history: state.history,
      }
    case 'perfectionist':
      return {
        title: ending.name,
        message: '你几乎把每一步都控制到了极致。谨慎、克制、观察——你像在解一道没有容错率的题。',
        icon: ending.icon,
        isGameOver: true,
        reason: ending.id,
        history: state.history,
      }
    case 'extreme-survival':
      return {
        title: ending.name,
        message: '即使一路承受巨大的压力，你依然撑到了最后。这不是轻松的胜利，而是一场硬扛下来的生还。',
        icon: ending.icon,
        isGameOver: true,
        reason: ending.id,
        history: state.history,
      }
    case 'bad-victory':
      return {
        title: ending.name,
        message: '你看似完成了这轮游戏，但代价远比表面更沉重。那份侥幸，终究会反噬回来。',
        icon: ending.icon,
        isGameOver: true,
        reason: ending.id,
        history: state.history,
      }
    case 'survivor':
    default:
      return {
        title: ending.name,
        message: '你成功清零了压抑值，且身体健康。\n\n在这场充满迷雾和风险的游戏中，你靠着谨慎、策略和一点运气活了下来。',
        icon: ending.icon,
        isGameOver: true,
        reason: ending.id,
        history: state.history,
      }
  }
}

function createInitialStore(): GameStore {
  return {
    state: {
      ...createInitialState(),
      achievements: loadAchievementProgress(),
    },
    phase: 'intro',
    feedback: null,
    flirtLine: '',
  }
}

function gameReducer(store: GameStore, action: GameActionType): GameStore {
  const rng = createRngFromMath()

  switch (action.type) {
    case 'START_GAME': {
      const partner = generatePartner(rng, 1)
      return {
        state: {
          ...createInitialState(),
          achievements: resetRunProgress(store.state.achievements),
          currentPartner: partner,
        },
        phase: 'playing',
        feedback: null,
        flirtLine: pickFlirtLine(),
      }
    }

    case 'TAKE_ACTION': {
      const { state: prev } = store
      if (!prev.currentPartner) return store

      const wasInfectedBefore = prev.isInfected
      const nextState = applyProgressChecks(
        prev,
        executeAction(prev, action.action, rng),
        { trigger: 'TAKE_ACTION', action: action.action },
      )
      const overResult = checkGameOver(nextState)

      if (overResult) {
        const ending = overResult.ending ?? checkEnding({ ...nextState, isGameOver: true })
        const feedback = ending
          ? buildEndingFeedback(ending, { ...nextState, isGameOver: true })
          : {
            title: overResult.reason === 'frustration' ? '欲火焚身' : '精神崩溃',
            message: overResult.reason === 'frustration'
              ? '长期的压抑让你彻底失去了理智。你无法再思考后果，在绝望中发生了一次随机的高危行为。'
              : '巨大的心理压力压垮了你。你开始出现幻觉，被送往了精神病院，游戏结束。',
            icon: overResult.reason === 'frustration' ? '🤯' : '😵‍💫',
            isGameOver: true,
            reason: overResult.reason,
            history: nextState.history,
          }

        return {
          state: { ...nextState, isGameOver: true },
          phase: 'gameover',
          feedback,
          flirtLine: store.flirtLine,
        }
      }

      if (nextState.frustration <= 0) {
        const ending = checkEnding(nextState)
        if (ending) {
          return {
            ...store,
            state: { ...nextState, isGameOver: true },
            phase: 'gameover',
            feedback: buildEndingFeedback(ending, { ...nextState, isGameOver: true }),
          }
        }
      }

      if (action.action === 'refuse') {
        return {
          ...store,
          state: nextState,
          feedback: {
            title: '继续寻找',
            message: '你选择了离开。压抑值上升，但至少你暂时是安全的。',
            icon: '🏃',
            isGameOver: false,
          },
          phase: 'feedback',
        }
      }

      const isDiseased = prev.currentPartner.diseases.length > 0
      const isInfectedNow = nextState.isInfected
      const reduction = CONFIG.rewards[action.action as ActionType]
      const anxietyGain = CONFIG.stress[action.action as ActionType]
      const { title, message, icon } = buildActionFeedback(
        action.action as ActionType,
        reduction,
        anxietyGain,
        wasInfectedBefore,
        isInfectedNow,
        isDiseased,
      )

      return {
        ...store,
        state: nextState,
        feedback: { title, message, icon, isGameOver: false },
        phase: 'feedback',
      }
    }

    case 'CHAT': {
      const { state: prev } = store
      if (!prev.currentPartner) return store

      const updatedPartner = chat(prev.currentPartner, rng)
      const nextState = applyProgressChecks(
        prev,
        executeAction(
          { ...prev, currentPartner: updatedPartner },
          'chat',
          rng,
        ),
        { trigger: 'END_DIALOGUE', action: 'chat', endedDialogue: true },
      )

      return {
        ...store,
        state: nextState,
        flirtLine: pickFlirtLine(),
      }
    }

    case 'GO_TO_HOSPITAL': {
      const nextState = applyProgressChecks(
        store.state,
        goToHospital(store.state),
        {
          trigger: 'CHOOSE_EVENT_OPTION',
          wentToHospital: true,
          revealedInfection: store.state.isInfected,
        },
      )

      if (nextState.isGameOver) {
        const ending = checkEnding(nextState)
        if (ending) {
          return {
            ...store,
            state: nextState,
            phase: 'gameover',
            feedback: buildEndingFeedback(ending, nextState),
          }
        }
      }

      return {
        ...store,
        state: nextState,
        feedback: {
          title: '虚惊一场',
          message: '检测结果阴性。\n你身体是健康的。心理压力已清空，但你也为此浪费了宝贵的时间（压抑值大幅上升）。',
          icon: '🏥',
          isGameOver: false,
        },
        phase: 'feedback',
      }
    }

    case 'USE_TESTKIT': {
      const partner = store.state.currentPartner
      if (!partner || store.state.items.testkit <= 0) return store

      const result = testkit(store.state, partner)
      const nextState = applyProgressChecks(
        store.state,
        result.state,
        { trigger: 'CHOOSE_EVENT_OPTION', usedTestkit: true },
      )

      return {
        ...store,
        state: nextState,
        feedback: {
          title: '检测结果',
          message: result.message,
          icon: result.icon,
          isGameOver: false,
        },
        phase: 'feedback',
      }
    }

    case 'NEXT_PARTNER': {
      const partner = generatePartner(rng, store.state.turn)
      return {
        ...store,
        state: { ...store.state, currentPartner: partner },
        phase: 'playing',
        feedback: null,
        flirtLine: pickFlirtLine(),
      }
    }

    case 'SHOW_FEEDBACK':
      return { ...store, feedback: action.data, phase: 'feedback' }

    case 'CLOSE_FEEDBACK': {
      if (store.state.isGameOver) {
        return store
      }
      const partner = generatePartner(rng, store.state.turn)
      return {
        ...store,
        state: { ...store.state, currentPartner: partner },
        phase: 'playing',
        feedback: null,
        flirtLine: pickFlirtLine(),
      }
    }

    case 'SHOW_HELP':
      return { ...store, phase: 'help' }

    case 'CLOSE_HELP':
      return { ...store, phase: store.feedback ? 'feedback' : 'playing' }

    default:
      return store
  }
}

export function useGameState() {
  const [store, dispatch] = useReducer(gameReducer, undefined, createInitialStore)

  useEffect(() => {
    saveAchievementProgress(store.state.achievements)
  }, [store.state.achievements])

  const partner = store.state.currentPartner
  const isPanic = isPanicMode(store.state.anxiety)

  const constraints = useMemo((): Constraint[] => {
    if (!partner) return []
    return partner.tags
      .map((tag) => tag.constraint)
      .filter((constraint): constraint is Constraint => constraint !== undefined)
  }, [partner])

  const blockedActions = useMemo(() => getBlockedActions(constraints), [constraints])

  const hiddenCount = useMemo(() => {
    if (!partner) return 0
    return partner.tags.filter((tag) => !tag.revealed).length
  }, [partner])

  const gameOverResult: GameOverResult | null = useMemo(
    () => checkGameOver(store.state),
    [store.state],
  )

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const takeAction = useCallback(
    (action: GameAction) => dispatch({ type: 'TAKE_ACTION', action }),
    [],
  )
  const goHospital = useCallback(() => dispatch({ type: 'GO_TO_HOSPITAL' }), [])
  const useTestkitAction = useCallback(() => dispatch({ type: 'USE_TESTKIT' }), [])
  const chatWithPartner = useCallback(() => dispatch({ type: 'CHAT' }), [])
  const nextPartner = useCallback(() => dispatch({ type: 'NEXT_PARTNER' }), [])
  const showHelp = useCallback(() => dispatch({ type: 'SHOW_HELP' }), [])
  const closeHelp = useCallback(() => dispatch({ type: 'CLOSE_HELP' }), [])
  const closeFeedback = useCallback(() => dispatch({ type: 'CLOSE_FEEDBACK' }), [])

  return {
    state: store.state,
    phase: store.phase,
    feedback: store.feedback,
    flirtLine: store.flirtLine,
    partner,
    isPanic,
    blockedActions,
    hiddenCount,
    gameOverResult,
    startGame,
    takeAction,
    goHospital,
    useTestkit: useTestkitAction,
    chatWithPartner,
    nextPartner,
    showHelp,
    closeHelp,
    closeFeedback,
  }
}
