import { useReducer, useCallback, useMemo } from 'react'
import type { GameState } from '@/game/types'
import type { GameAction, ActionType } from '@/game/engine/actions'
import type { GameOverResult } from '@/game/engine/game-over'
import { createInitialState } from '@/game/engine/state'
import { generatePartner } from '@/game/engine/partner'
import { executeAction, getBlockedActions } from '@/game/engine/actions'
import { goToHospital } from '@/game/engine/hospital'
import { useTestkit } from '@/game/engine/items'
import { chat } from '@/game/engine/chat'
import { checkGameOver, isPanicMode } from '@/game/engine/game-over'
import { createRngFromMath } from '@/game/engine/rng'
import { CONFIG } from '@/game/data/config'
import { DISEASES } from '@/game/data/diseases'
import { FLIRT_LINES } from '@/game/data/flirtLines'
import type { Constraint, DiseaseKey } from '@/game/types'

type GamePhase = 'intro' | 'playing' | 'feedback' | 'gameover' | 'help'

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
  return FLIRT_LINES[Math.floor(Math.random() * FLIRT_LINES.length)]
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

function gameReducer(store: GameStore, action: GameActionType): GameStore {
  const rng = createRngFromMath()

  switch (action.type) {
    case 'START_GAME': {
      const partner = generatePartner(rng)
      return {
        state: { ...createInitialState(), currentPartner: partner },
        phase: 'playing',
        feedback: null,
        flirtLine: pickFlirtLine(),
      }
    }

    case 'TAKE_ACTION': {
      const { state: prev } = store
      if (!prev.currentPartner) return store

      const wasInfectedBefore = prev.isInfected
      const nextState = executeAction(prev, action.action, rng)
      const overResult = checkGameOver(nextState)

      if (overResult) {
        const reasonText = overResult.reason === 'frustration'
          ? '欲火焚身'
          : '精神崩溃'
        const gameOverMsg = overResult.reason === 'frustration'
          ? '长期的压抑让你彻底失去了理智。你无法再思考后果，在绝望中发生了一次随机的高危行为。'
          : '巨大的心理压力压垮了你。你开始出现幻觉，被送往了精神病院，游戏结束。'

        return {
          state: { ...nextState, isGameOver: true },
          phase: 'gameover',
          feedback: {
            title: reasonText,
            message: gameOverMsg,
            icon: overResult.reason === 'frustration' ? '🤯' : '😵‍💫',
            isGameOver: true,
            reason: overResult.reason,
            history: nextState.history,
          },
          flirtLine: store.flirtLine,
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

      // Check if frustration reached 0 (win)
      if (nextState.frustration <= 0) {
        if (nextState.isInfected) {
          return {
            ...store,
            state: nextState,
            phase: 'gameover',
            feedback: {
              title: '糟糕的胜利',
              message: '你的压抑值清零了，你感到无比轻松...\n但在几天后，你的身体开始出现异常反应。\n你虽然释放了欲望，却输掉了健康。',
              icon: '🥀',
              isGameOver: true,
              reason: 'infected_win',
              history: nextState.history,
            },
          }
        }
        return {
          ...store,
          state: nextState,
          phase: 'gameover',
          feedback: {
            title: '幸存者',
            message: '你成功清零了压抑值，且身体健康。\n\n在这场充满迷雾和风险的游戏中，你靠着谨慎、策略和一点运气活了下来。',
            icon: '✨',
            isGameOver: true,
            reason: 'win',
            history: nextState.history,
          },
        }
      }

      // Normal action feedback with detailed values
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
      const nextState = executeAction(
        { ...prev, currentPartner: updatedPartner },
        'chat' as GameAction,
        rng,
      )

      return {
        ...store,
        state: nextState,
        flirtLine: pickFlirtLine(),
      }
    }

    case 'GO_TO_HOSPITAL': {
      const nextState = goToHospital(store.state)

      if (nextState.isGameOver) {
        if (nextState.isInfected) {
          const diseaseName = nextState.infectionData
            ? DISEASES[nextState.infectionData.disease].name
            : ''
          const transmission = nextState.infectionData?.transmission ?? ''
          return {
            ...store,
            state: nextState,
            phase: 'gameover',
            feedback: {
              title: '确诊感染',
              message: `很遗憾，医院的检查结果显示你已感染。\n之前的侥幸心理终究没能救你。\n\n确诊：${diseaseName}\n途径：${transmission}`,
              icon: '🏥',
              isGameOver: true,
              reason: 'hospital_infected',
              history: nextState.history,
            },
          }
        } else {
          return {
            ...store,
            state: nextState,
            phase: 'gameover',
            feedback: {
              title: '欲火焚身',
              message: '去医院的路途让你更加焦虑，压抑值达到了极限。',
              icon: '🤯',
              isGameOver: true,
              reason: 'frustration',
              history: nextState.history,
            },
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

      const result = useTestkit(store.state, partner)
      return {
        ...store,
        state: result.state,
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
      const partner = generatePartner(rng)
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
      const partner = generatePartner(rng)
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

const initialStore: GameStore = {
  state: createInitialState(),
  phase: 'intro',
  feedback: null,
  flirtLine: '',
}

export function useGameState() {
  const [store, dispatch] = useReducer(gameReducer, initialStore)

  const partner = store.state.currentPartner
  const isPanic = isPanicMode(store.state.anxiety)

  const constraints = useMemo((): Constraint[] => {
    if (!partner) return []
    return partner.tags
      .map((t) => t.constraint)
      .filter((c): c is Constraint => c !== undefined)
  }, [partner])

  const blockedActions = useMemo(() => getBlockedActions(constraints), [constraints])

  const hiddenCount = useMemo(() => {
    if (!partner) return 0
    return partner.tags.filter((t) => !t.revealed).length
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
