import { CONFIG } from '@/game/data/config'
import { FLIRT_LINES } from '@/game/data/flirtLines'
import {
  checkEnding,
  loadAchievementProgress,
  resetRunProgress,
} from '@/game/engine/achievements'
import { executeAction } from '@/game/engine/actions'
import { chat } from '@/game/engine/chat'
import { checkGameOver } from '@/game/engine/game-over'
import { goToHospital } from '@/game/engine/hospital'
import { useTestkit as testkit } from '@/game/engine/items'
import { generatePartner } from '@/game/engine/partner'
import { createRngFromMath } from '@/game/engine/rng'
import { createInitialState } from '@/game/engine/state'
import type { GameAction } from '@/game/engine/actions'
import type { ActionType } from '@/game/types'

import { buildActionFeedback, buildEndingFeedback } from './feedback'
import { applyProgressChecks } from './progress'
import type { FeedbackData, GameStore, GameStoreAction } from './types'

function pickFlirtLine(): string {
  return FLIRT_LINES[Math.floor(Math.random() * FLIRT_LINES.length)]?.text ?? ''
}

function createGenericGameOverFeedback(reason: 'frustration' | 'anxiety', history: GameStore['state']['history']): FeedbackData {
  return {
    title: reason === 'frustration' ? '欲火焚身' : '精神崩溃',
    message:
      reason === 'frustration'
        ? '长期的压抑让你彻底失去了理智。你无法再思考后果，在绝望中发生了一次随机的高危行为。'
        : '巨大的心理压力压垮了你。你开始出现幻觉，被送往了精神病院，游戏结束。',
    icon: reason === 'frustration' ? '🤯' : '😵‍💫',
    isGameOver: true,
    reason,
    history,
  }
}

function resolveActionFeedback(store: GameStore, action: GameAction, wasInfectedBefore: boolean): GameStore {
  const prevState = store.state
  const nextState = applyProgressChecks(prevState, executeAction(prevState, action, createRngFromMath()), {
    trigger: 'TAKE_ACTION',
    action,
  })
  const overResult = checkGameOver(nextState)

  if (overResult) {
    const gameOverState = { ...nextState, isGameOver: true }
    const ending = overResult.ending ?? checkEnding(gameOverState)

    return {
      state: gameOverState,
      phase: 'gameover',
      feedback: ending
        ? buildEndingFeedback(ending, gameOverState)
        : createGenericGameOverFeedback(overResult.reason, nextState.history),
      flirtLine: store.flirtLine,
    }
  }

  if (nextState.frustration <= 0) {
    const ending = checkEnding(nextState)
    if (ending) {
      const gameOverState = { ...nextState, isGameOver: true }
      return {
        ...store,
        state: gameOverState,
        phase: 'gameover',
        feedback: buildEndingFeedback(ending, gameOverState),
      }
    }
  }

  if (action === 'refuse') {
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

  const resolvedAction = action as ActionType

  const feedback = buildActionFeedback(
    resolvedAction,
    CONFIG.rewards[resolvedAction],
    CONFIG.stress[resolvedAction],
    wasInfectedBefore,
    nextState.isInfected,
    prevState.currentPartner?.diseases.length ? prevState.currentPartner.diseases.length > 0 : false,
  )

  return {
    ...store,
    state: nextState,
    feedback: { ...feedback, isGameOver: false },
    phase: 'feedback',
  }
}

function handleStartGame(store: GameStore): GameStore {
  const partner = generatePartner(createRngFromMath(), 1)

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

function handleTakeAction(store: GameStore, action: GameStoreAction & { type: 'TAKE_ACTION' }): GameStore {
  if (!store.state.currentPartner) return store
  return resolveActionFeedback(store, action.action, store.state.isInfected)
}

function handleChat(store: GameStore): GameStore {
  const currentPartner = store.state.currentPartner
  if (!currentPartner) return store

  const rng = createRngFromMath()
  const updatedPartner = chat(currentPartner, rng)
  const revealedTag = updatedPartner.tags.find((tag, index) => {
    const previousTag = currentPartner.tags[index]
    return tag.revealed && previousTag && !previousTag.revealed
  })
  const nextState = applyProgressChecks(
    store.state,
    executeAction(
      { ...store.state, currentPartner: updatedPartner },
      'chat',
      rng,
    ),
    { trigger: 'END_DIALOGUE', action: 'chat', endedDialogue: true },
  )

  const revealedTagMsg = revealedTag
    ? `你试探性地聊了聊，对方似乎透露了隐藏信息：${revealedTag.text}\n`
    : '你试探性地聊了聊，但没有获得更多信息。\n'

  return {
    ...store,
    state: nextState,
    flirtLine: pickFlirtLine(),
    feedback: {
      title: '试探聊天',
      message: `${revealedTagMsg}压抑值 +${CONFIG.chatCost(store.state.turn)}`,
      icon: '💬',
      isGameOver: false,
      keepPartner: true,
    },
    phase: 'feedback',
  }
}

function handleHospital(store: GameStore): GameStore {
  const nextState = applyProgressChecks(store.state, goToHospital(store.state), {
    trigger: 'GAME_OVER',
    wentToHospital: true,
    revealedInfection: store.state.isInfected,
  })

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

function handleUseTestkit(store: GameStore): GameStore {
  const partner = store.state.currentPartner
  if (!partner || store.state.items.testkit <= 0) return store

  const result = testkit(store.state, partner)
  const nextState = applyProgressChecks(store.state, result.state, {
    trigger: 'CHOOSE_EVENT_OPTION',
    usedTestkit: true,
  })

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

function handleNextPartner(store: GameStore): GameStore {
  return {
    ...store,
    state: {
      ...store.state,
      currentPartner: generatePartner(createRngFromMath(), store.state.turn),
    },
    phase: 'playing',
    feedback: null,
    flirtLine: pickFlirtLine(),
  }
}

function handleCloseFeedback(store: GameStore): GameStore {
  if (store.state.isGameOver) {
    return store
  }

  const keepPartner = store.feedback?.keepPartner ?? false

  return {
    ...store,
    state: {
      ...store.state,
      currentPartner: keepPartner
        ? store.state.currentPartner
        : generatePartner(createRngFromMath(), store.state.turn),
    },
    phase: 'playing',
    feedback: null,
    flirtLine: pickFlirtLine(),
  }
}

export function createInitialStore(): GameStore {
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

export function gameReducer(store: GameStore, action: GameStoreAction): GameStore {
  switch (action.type) {
    case 'START_GAME':
      return handleStartGame(store)
    case 'TAKE_ACTION':
      return handleTakeAction(store, action)
    case 'CHAT':
      return handleChat(store)
    case 'GO_TO_HOSPITAL':
      return handleHospital(store)
    case 'USE_TESTKIT':
      return handleUseTestkit(store)
    case 'NEXT_PARTNER':
      return handleNextPartner(store)
    case 'SHOW_FEEDBACK':
      return { ...store, feedback: action.data, phase: 'feedback' }
    case 'CLOSE_FEEDBACK':
      return handleCloseFeedback(store)
    case 'SHOW_HELP':
      return { ...store, phase: 'help' }
    case 'CLOSE_HELP':
      return { ...store, phase: store.feedback ? 'feedback' : 'playing' }
    case 'RESET_TO_INTRO':
      return {
        ...store,
        phase: 'intro',
        feedback: null,
      }
    default:
      return store
  }
}
