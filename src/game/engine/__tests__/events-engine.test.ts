import type { EventChoice, EventTemplate, GameState } from '@/game/types'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

interface EventsEngineModule {
  shouldTriggerEvent: (state: GameState, rng: () => number) => boolean
  selectRandomEvent: (state: GameState, rng: () => number) => EventTemplate | null
  applyEventChoice: (state: GameState, event: EventTemplate, choiceIndex: number) => GameState
  getActiveEvent: (eventId?: string | null) => EventTemplate | null
  getAvailableChoices: (event: EventTemplate, state: GameState) => EventChoice[]
}

type ChoiceCondition = {
  minTurn?: number
  maxTurn?: number
  minFrustration?: number
  minAnxiety?: number
  requiredItems?: Partial<GameState['items']>
}

type ConditionalChoice = EventChoice & {
  condition?: ChoiceCondition
}

type ConditionalEvent = Omit<EventTemplate, 'choices'> & {
  choices: ConditionalChoice[]
}

const EVENTS_ENGINE_MODULE_PATH = '../events'
const EVENTS_DATA_MODULE_PATH = '../../data/events'

function createState(overrides: Partial<GameState> = {}): GameState {
  return {
    frustration: 50,
    anxiety: 10,
    turn: 3,
    difficulty: 1.2,
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

async function loadEventsEngine(): Promise<EventsEngineModule> {
  return import(EVENTS_ENGINE_MODULE_PATH) as Promise<EventsEngineModule>
}

async function loadEventsEngineWithTemplates(templates: EventTemplate[]): Promise<EventsEngineModule> {
  vi.resetModules()
  vi.doMock(EVENTS_DATA_MODULE_PATH, () => ({
    EVENT_TEMPLATES: templates,
  }))

  return import(EVENTS_ENGINE_MODULE_PATH) as Promise<EventsEngineModule>
}

beforeEach(() => {
  vi.resetModules()
})

afterEach(() => {
  vi.doUnmock(EVENTS_DATA_MODULE_PATH)
  vi.resetModules()
})

describe('events engine', () => {
  it('triggers an event when rng falls under the scaled turn chance', async () => {
    const { shouldTriggerEvent } = await loadEventsEngine()

    expect(shouldTriggerEvent(createState({ turn: 5, difficulty: 1.4 }), () => 0.25)).toBe(true)
    expect(shouldTriggerEvent(createState({ turn: 5, difficulty: 1.4 }), () => 0.35)).toBe(false)
  })

  it('does not trigger when no events match the current state', async () => {
    const { shouldTriggerEvent } = await loadEventsEngineWithTemplates([
      {
        eventId: 'late_only',
        title: 'Late only',
        description: 'Unavailable early game',
        choices: [{ text: 'ok', effects: {} }],
        triggerCondition: { minTurn: 8 },
        priority: 1,
      },
    ])

    expect(shouldTriggerEvent(createState({ turn: 2, difficulty: 1.1 }), () => 0)).toBe(false)
  })

  it('selects only valid events and respects priority weighting', async () => {
    const { selectRandomEvent } = await loadEventsEngineWithTemplates([
      {
        eventId: 'invalid',
        title: 'Invalid',
        description: 'Needs more turns',
        choices: [{ text: 'skip', effects: {} }],
        triggerCondition: { minTurn: 10 },
        priority: 99,
      },
      {
        eventId: 'low_priority',
        title: 'Low',
        description: 'Low weight',
        choices: [{ text: 'skip', effects: {} }],
        priority: 1,
      },
      {
        eventId: 'high_priority',
        title: 'High',
        description: 'High weight',
        choices: [{ text: 'pick', effects: {} }],
        priority: 9,
      },
    ])

    const selected = selectRandomEvent(createState({ turn: 3 }), () => 0.95)

    expect(selected?.eventId).toBe('high_priority')
  })

  it('returns null when no selectable events remain after filtering', async () => {
    const { selectRandomEvent } = await loadEventsEngineWithTemplates([
      {
        eventId: 'requires_testkit',
        title: 'Need kit',
        description: 'Requires an item',
        choices: [{ text: 'skip', effects: {} }],
        triggerCondition: { requiredItems: { testkit: 2 } },
        priority: 1,
      },
    ])

    expect(selectRandomEvent(createState({ items: { testkit: 1 } }), () => 0)).toBeNull()
  })

  it('applies event choice effects immutably and clamps tracked meters', async () => {
    const { applyEventChoice } = await loadEventsEngine()
    const state = createState({ frustration: 95, anxiety: 3, items: { testkit: 1 } })
    const event: EventTemplate = {
      eventId: 'supply_drop',
      title: 'Supply Drop',
      description: 'Get supplies',
      choices: [
        {
          text: 'take it',
          effects: {
            frustration: 12,
            anxiety: -10,
            items: { testkit: 2 },
          },
        },
      ],
      priority: 1,
    }

    const nextState = applyEventChoice(state, event, 0)

    expect(nextState).not.toBe(state)
    expect(nextState.frustration).toBe(100)
    expect(nextState.anxiety).toBe(0)
    expect(nextState.items).toEqual({ testkit: 3 })
    expect(state.items).toEqual({ testkit: 1 })
  })

  it('returns the original state when the choice index is invalid', async () => {
    const { applyEventChoice } = await loadEventsEngine()
    const state = createState()
    const event: EventTemplate = {
      eventId: 'single_choice',
      title: 'Single Choice',
      description: 'Only one option',
      choices: [{ text: 'ok', effects: { frustration: -5 } }],
      priority: 1,
    }

    expect(applyEventChoice(state, event, 9)).toBe(state)
  })

  it('filters conditional choices against the current state', async () => {
    const { getAvailableChoices } = await loadEventsEngine()
    const event: ConditionalEvent = {
      eventId: 'conditional',
      title: 'Conditional',
      description: 'Choice gating',
      priority: 1,
      choices: [
        { text: 'always', effects: {} },
        { text: 'late game', effects: {}, condition: { minTurn: 5 } },
        { text: 'needs kit', effects: {}, condition: { requiredItems: { testkit: 2 } } },
      ],
    }

    expect(getAvailableChoices(event, createState({ turn: 3, items: { testkit: 1 } })).map((choice) => choice.text)).toEqual(['always'])
    expect(getAvailableChoices(event, createState({ turn: 6, items: { testkit: 3 } })).map((choice) => choice.text)).toEqual(['always', 'late game', 'needs kit'])
  })

  it('resolves chained events by id from the event catalogue', async () => {
    const { getActiveEvent } = await loadEventsEngine()

    expect(getActiveEvent('test_result')?.title).toBe('检测结果')
    expect(getActiveEvent('missing_event')).toBeNull()
  })
})
