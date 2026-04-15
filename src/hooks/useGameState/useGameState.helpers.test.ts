import { describe, expect, it } from 'vitest'

import { CONFIG } from '@/game/data/config'
import { ENDINGS } from '@/game/data/endings'
import type { GameState, Partner } from '@/game/types'

import { gameReducer } from './reducer'
import { buildActionFeedback, buildEndingFeedback } from './feedback'
import { applyProgressChecks, getStat } from './progress'
import { selectBlockedActions, selectHiddenCount, selectIsPanic } from './selectors'
import type { GameStore } from './types'

function createPartner(overrides: Partial<Partner> = {}): Partner {
  return {
    avatar: 'owl',
    diseases: [],
    tags: [
      {
        text: 'tag-1',
        colorClass: 'text-red-500',
        risk: {},
        clue: 'clue-1',
        hiddenChance: 0,
        revealed: true,
      },
      {
        text: 'tag-2',
        colorClass: 'text-blue-500',
        risk: {},
        clue: 'clue-2',
        hiddenChance: 1,
        revealed: false,
        constraint: 'condom_only',
      },
    ],
    ...overrides,
  }
}

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    frustration: 50,
    anxiety: 0,
    turn: 1,
    difficulty: 1,
    items: { testkit: 1 },
    achievements: {
      unlocked: [],
      endingsSeen: [],
      stats: {},
    },
    currentPartner: null,
    isInfected: false,
    infectionData: null,
    isGameOver: false,
    history: [],
    ...overrides,
  }
}

function createStore(overrides: Partial<GameStore> = {}): GameStore {
  return {
    state: createState({
      currentPartner: createPartner(),
    }),
    phase: 'playing',
    feedback: null,
    flirtLine: 'old line',
    ...overrides,
  }
}

describe('useGameState extracted helpers', () => {
  it('builds escalated action feedback for risky infected encounters', () => {
    const feedback = buildActionFeedback('sex_raw', 35, 12, false, true, true)

    expect(feedback.title).toBe('宣泄与不安')
    expect(feedback.icon).toBe('😰')
    expect(feedback.message).toContain('你选择了无套性交')
    expect(feedback.message).toContain('心理压力 +12')
    expect(feedback.message).toContain('你感觉到了一丝异样')
  })

  it('records progress stats and ending metadata during a successful run', () => {
    const prevState = createState({
      frustration: 20,
      anxiety: 10,
      turn: 4,
      achievements: {
        unlocked: [],
        endingsSeen: [],
        stats: {
          safeActionStreak: 4,
          maxAnxiety: 10,
          fastestEndingTurn: 0,
          revealedTagCount: 1,
        },
      },
      currentPartner: createPartner(),
    })

    const nextState = createState({
      ...prevState,
      frustration: 0,
      anxiety: 18,
      turn: 5,
      history: [
        {
          avatar: 'owl',
          tags: createPartner().tags,
          diseases: [],
          action: 'oral_condom',
          outcomeLabel: '✅ 理智享受',
          outcomeClass: 'text-blue-400',
        },
      ],
    })

    const progressed = applyProgressChecks(prevState, nextState, {
      trigger: 'TAKE_ACTION',
      action: 'oral_condom',
    })

    expect(getStat(progressed, 'safeActionStreak')).toBe(5)
    expect(getStat(progressed, 'maxAnxiety')).toBe(18)
    expect(getStat(progressed, 'fastestEndingTurn')).toBe(5)
    expect(progressed.achievements.endingsSeen).toContain('perfectionist')
    expect(progressed.achievements.unlocked).toContain('careful-player')
  })

  it('builds confirmed infection ending feedback with disease details', () => {
    const ending = ENDINGS.find((entry) => entry.id === 'confirmed-infection')
    expect(ending).toBeDefined()

    const feedback = buildEndingFeedback(
      ending!,
      createState({
        infectionData: {
          disease: 'HIV',
          transmission: '体液',
        },
        history: [],
      }),
    )

    expect(feedback.title).toBe(ending!.name)
    expect(feedback.icon).toBe(ending!.icon)
    expect(feedback.message).toContain('确诊：艾滋病 (HIV)')
    expect(feedback.message).toContain('途径：体液')
    expect(feedback.isGameOver).toBe(true)
    expect(feedback.reason).toBe('confirmed-infection')
  })

  it('derives panic, blocked actions, and hidden tag counts from partner state', () => {
    const partner = createPartner()

    expect(selectIsPanic(80)).toBe(true)
    expect(selectBlockedActions(partner)).toEqual(['oral_raw', 'sex_raw'])
    expect(selectHiddenCount(partner)).toBe(1)
  })

  it('keeps the current partner and shows chat feedback after chatting', () => {
    const store = createStore({
      state: createState({
        turn: 3,
        currentPartner: createPartner({
          tags: [
            {
              text: '已知标签',
              colorClass: 'text-red-500',
              risk: {},
              clue: 'known',
              hiddenChance: 0,
              revealed: true,
            },
            {
              text: '隐藏标签',
              colorClass: 'text-blue-500',
              risk: {},
              clue: 'hidden',
              hiddenChance: 1,
              revealed: false,
            },
          ],
        }),
      }),
    })

    const result = gameReducer(store, { type: 'CHAT' })

    expect(result.phase).toBe('feedback')
    expect(result.feedback).toMatchObject({
      title: '试探聊天',
      icon: '💬',
      isGameOver: false,
      keepPartner: true,
    })
    expect(result.feedback?.message).toContain('压抑值 +3')
    expect(result.feedback?.message).toContain('你试探性地聊了聊，对方似乎透露了隐藏信息：隐藏标签')
    expect(result.state.currentPartner).not.toBeNull()
    expect(result.state.currentPartner?.tags[1]?.revealed).toBe(true)
    expect(result.flirtLine).not.toBe('old line')
  })

  it('counts chat progress when END_DIALOGUE trigger is passed', () => {
    const prevState = createState({
      turn: 3,
      currentPartner: createPartner({
        tags: [
          {
            text: 'visible',
            colorClass: 'text-red-500',
            risk: {},
            clue: 'visible',
            hiddenChance: 0,
            revealed: true,
          },
          {
            text: 'hidden',
            colorClass: 'text-blue-500',
            risk: {},
            clue: 'hidden',
            hiddenChance: 1,
            revealed: false,
          },
        ],
      }),
      achievements: {
        unlocked: [],
        endingsSeen: [],
        stats: {
          chatCount: 0,
          revealedTagCount: 0,
        },
      },
    })

    const nextState = createState({
      ...prevState,
      turn: 4,
      frustration: prevState.frustration + CONFIG.chatCost(prevState.turn),
      currentPartner: createPartner({
        tags: [
          {
            text: 'visible',
            colorClass: 'text-red-500',
            risk: {},
            clue: 'visible',
            hiddenChance: 0,
            revealed: true,
          },
          {
            text: 'hidden',
            colorClass: 'text-blue-500',
            risk: {},
            clue: 'hidden',
            hiddenChance: 1,
            revealed: true,
          },
        ],
      }),
    })

    const progressed = applyProgressChecks(prevState, nextState, {
      trigger: 'END_DIALOGUE',
      action: 'chat',
      endedDialogue: true,
    })

    expect(getStat(progressed, 'chatCount')).toBe(1)
    expect(getStat(progressed, 'revealedTagCount')).toBe(1)
  })

  it('transitions to gameover when an action pushes anxiety to 100', () => {
    const store = createStore({
      state: createState({
        anxiety: 80,
        frustration: 50,
        currentPartner: createPartner({ diseases: [] }),
      }),
    })

    const result = gameReducer(store, { type: 'TAKE_ACTION', action: 'sex_raw' })

    expect(result.phase).toBe('gameover')
    expect(result.state.anxiety).toBe(100)
    expect(result.feedback).toMatchObject({
      isGameOver: true,
      title: '精神崩溃',
    })
  })

  it('retains the current partner when closing feedback with keepPartner=true', () => {
    const partner = createPartner({ avatar: 'keeper' })
    const store = createStore({
      state: createState({ currentPartner: partner }),
      phase: 'feedback',
      feedback: {
        title: '聊天',
        message: 'msg',
        icon: '💬',
        isGameOver: false,
        keepPartner: true,
      },
    })

    const result = gameReducer(store, { type: 'CLOSE_FEEDBACK' })

    expect(result.phase).toBe('playing')
    expect(result.state.currentPartner?.avatar).toBe('keeper')
    expect(result.feedback).toBeNull()
  })

  it('replaces the current partner when closing feedback without keepPartner', () => {
    const partner = createPartner({ avatar: 'old-partner' })
    const store = createStore({
      state: createState({ currentPartner: partner }),
      phase: 'feedback',
      feedback: {
        title: '行动结果',
        message: 'msg',
        icon: '✅',
        isGameOver: false,
      },
    })

    const result = gameReducer(store, { type: 'CLOSE_FEEDBACK' })

    expect(result.phase).toBe('playing')
    expect(result.state.currentPartner).not.toBeNull()
    expect(result.state.currentPartner?.avatar).not.toBe('old-partner')
    expect(result.feedback).toBeNull()
  })

  it('transitions to feedback phase via SHOW_FEEDBACK', () => {
    const store = createStore({ phase: 'playing' })

    const result = gameReducer(store, {
      type: 'SHOW_FEEDBACK',
      data: {
        title: 'Event',
        message: 'Something happened',
        icon: '⚠️',
        isGameOver: false,
      },
    })

    expect(result.phase).toBe('feedback')
    expect(result.feedback?.title).toBe('Event')
  })
})
