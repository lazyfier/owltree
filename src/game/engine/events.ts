import { EVENT_TEMPLATES } from '../data/events'
import type { EventChoice, EventTemplate, GameState, InventoryItems } from '../types'

const BASE_TRIGGER_CHANCE = 0.1
const TURN_TRIGGER_STEP = 0.02
const MAX_TRIGGER_CHANCE = 0.75

type TriggerCondition = NonNullable<EventTemplate['triggerCondition']>
type ConditionalChoice = EventChoice & {
  condition?: TriggerCondition
}

function clampMeter(value: number): number {
  return Math.max(0, Math.min(100, value))
}

function hasRequiredItems(items: InventoryItems, requiredItems?: Partial<InventoryItems>): boolean {
  if (!requiredItems) {
    return true
  }

  return Object.entries(requiredItems).every(([key, amount]) => {
    if (typeof amount !== 'number') {
      return true
    }

    const itemKey = key as keyof InventoryItems
    return items[itemKey] >= amount
  })
}

function matchesTriggerCondition(state: GameState, condition?: TriggerCondition): boolean {
  if (!condition) {
    return true
  }

  if (typeof condition.minTurn === 'number' && state.turn < condition.minTurn) {
    return false
  }

  if (typeof condition.maxTurn === 'number' && state.turn > condition.maxTurn) {
    return false
  }

  if (typeof condition.minFrustration === 'number' && state.frustration < condition.minFrustration) {
    return false
  }

  if (typeof condition.minAnxiety === 'number' && state.anxiety < condition.minAnxiety) {
    return false
  }

  return hasRequiredItems(state.items, condition.requiredItems)
}

function getEligibleEvents(state: GameState): EventTemplate[] {
  return EVENT_TEMPLATES.filter((event) => {
    if (!matchesTriggerCondition(state, event.triggerCondition)) {
      return false
    }

    return getAvailableChoices(event, state).length > 0
  })
}

function getChoiceCondition(choice: EventChoice): TriggerCondition | undefined {
  return (choice as ConditionalChoice).condition
}

export function shouldTriggerEvent(state: GameState, rng: () => number): boolean {
  if (getEligibleEvents(state).length === 0) {
    return false
  }

  const scaledChance = (BASE_TRIGGER_CHANCE + state.turn * TURN_TRIGGER_STEP) * Math.max(1, state.difficulty)
  return rng() < Math.min(MAX_TRIGGER_CHANCE, scaledChance)
}

export function selectRandomEvent(state: GameState, rng: () => number): EventTemplate | null {
  const candidates = getEligibleEvents(state)
  if (candidates.length === 0) {
    return null
  }

  const totalPriority = candidates.reduce((sum, event) => sum + Math.max(0, event.priority), 0)
  if (totalPriority <= 0) {
    return null
  }

  let roll = rng() * totalPriority
  for (const event of candidates) {
    roll -= Math.max(0, event.priority)
    if (roll < 0) {
      return event
    }
  }

  return candidates[candidates.length - 1] ?? null
}

export function applyEventChoice(state: GameState, event: EventTemplate, choiceIndex: number): GameState {
  const choice = getAvailableChoices(event, state)[choiceIndex]
  if (!choice) {
    return state
  }

  const itemDelta = choice.effects.items ?? {}
  const nextItems: InventoryItems = {
    ...state.items,
    testkit: Math.max(0, state.items.testkit + (itemDelta.testkit ?? 0)),
  }

  return {
    ...state,
    frustration: clampMeter(state.frustration + (choice.effects.frustration ?? 0)),
    anxiety: clampMeter(state.anxiety + (choice.effects.anxiety ?? 0)),
    items: nextItems,
  }
}

export function getAvailableChoices(event: EventTemplate, state: GameState): EventChoice[] {
  return event.choices.filter((choice) => matchesTriggerCondition(state, getChoiceCondition(choice)))
}

export function getActiveEvent(eventId?: string | null): EventTemplate | null {
  if (!eventId) {
    return null
  }

  return EVENT_TEMPLATES.find((event) => event.eventId === eventId) ?? null
}
