import { DISEASES } from '@/game/data/diseases'
import type { ActionType, GameEnding, GameState } from '@/game/types'

import type { FeedbackData } from './types'

const ACTION_LABELS: Record<ActionType, string> = {
  oral_condom: '戴套口交',
  oral_raw: '无套口交',
  sex_condom: '戴套性交',
  sex_raw: '无套性交',
}

function getActionLabel(action: ActionType): string {
  return ACTION_LABELS[action]
}

export function buildActionFeedback(
  action: ActionType,
  reduction: number,
  anxietyGain: number,
  wasInfectedBefore: boolean,
  isInfectedNow: boolean,
  isDiseased: boolean,
): Pick<FeedbackData, 'title' | 'message' | 'icon'> {
  const actionLabel = getActionLabel(action)

  let icon = '🍬'
  let message = `你选择了${actionLabel}。\n生理压抑 -${reduction}`

  if (anxietyGain > 5) {
    message += `\n心理压力 +${anxietyGain}`
    icon = '😰'
  }

  if (isInfectedNow && !wasInfectedBefore) {
    message += '\n\n你感觉到了一丝异样，但也许只是错觉...？'
  } else if (isDiseased && !isInfectedNow) {
    message += '\n\n虽然过程很惊险，但你似乎运气不错...暂时。'
  }

  return {
    title: '宣泄与不安',
    message,
    icon,
  }
}

export function buildEndingFeedback(ending: GameEnding, state: GameState): FeedbackData {
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
