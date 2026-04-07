import { useReducer, useCallback, useMemo } from 'react'
import type { GameState } from '@/game/types'
import type { GameAction } from '@/game/engine/actions'
import type { GameOverResult } from '@/game/engine/game-over'
import { createInitialState } from '@/game/engine/state'
import { generatePartner } from '@/game/engine/partner'
import { executeAction, getBlockedActions } from '@/game/engine/actions'
import { goToHospital } from '@/game/engine/hospital'
import { useTestkit } from '@/game/engine/items'
import { chat } from '@/game/engine/chat'
import { checkGameOver, isPanicMode } from '@/game/engine/game-over'
import { createRngFromMath } from '@/game/engine/rng'
import { FLIRT_LINES } from '@/game/data/flirtLines'
import type { Constraint } from '@/game/types'

type GamePhase = 'intro' | 'playing' | 'feedback' | 'gameover' | 'help'

interface FeedbackData {
  title: string
  message: string
  icon: string
  isGameOver: boolean
  reason?: string
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

      const nextState = executeAction(prev, action.action, rng)
      const overResult = checkGameOver(nextState)

      if (overResult) {
        const reasonText = overResult.reason === 'frustration'
          ? '欲火焚身'
          : '精神崩溃'
        return {
          state: { ...nextState, isGameOver: true },
          phase: 'gameover',
          feedback: {
            title: reasonText,
            message: overResult.reason === 'frustration'
              ? '长期的压抑让你彻底失去了理智。'
              : '巨大的心理压力压垮了你。',
            icon: overResult.reason === 'frustration' ? '🤯' : '😵‍💫',
            isGameOver: true,
            reason: overResult.reason,
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
              message: '你的压抑值清零了...但身体开始出现异常反应。',
              icon: '🥀',
              isGameOver: true,
              reason: 'infected_win',
            },
          }
        }
        return {
          ...store,
          state: nextState,
          phase: 'gameover',
          feedback: {
            title: '恭喜通关！',
            message: '你在保持理智的同时成功清零了压抑值。完美结局！',
            icon: '🎉',
            isGameOver: true,
            reason: 'win',
          },
        }
      }

      return {
        ...store,
        state: nextState,
        feedback: {
          title: '宣泄与不安',
          message: '欲望得到了释放。',
          icon: '🍬',
          isGameOver: false,
        },
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
          return {
            ...store,
            state: nextState,
            phase: 'gameover',
            feedback: {
              title: '确诊感染',
              message: '医院的检查结果显示你已感染。之前的侥幸心理终究没能救你。',
              icon: '🏥',
              isGameOver: true,
              reason: 'hospital_infected',
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
            },
          }
        }
      }

      return {
        ...store,
        state: nextState,
        feedback: {
          title: '虚惊一场',
          message: '检测结果阴性。你身体是健康的。心理压力已清空。',
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
          message: result.isPositive
            ? `⚠️ 阳性反应！\n病原体：已检测到。\n请立即离开。`
            : '✅ 阴性。\n未检测到常见病原体。',
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
