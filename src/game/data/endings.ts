import type { GameEnding } from '../types'

export const ENDINGS: GameEnding[] = [
  {
    id: 'survivor',
    name: '幸存者',
    description: '你平稳地活到了最后。',
    icon: '🏁',
    condition: '成功存活并结束游戏',
  },
  {
    id: 'bad-victory',
    name: '糟糕的胜利',
    description: '看似赢了，其实代价沉重。',
    icon: '🏆',
    condition: '以高代价达成胜利',
  },
  {
    id: 'burned-out',
    name: '欲火焚身',
    description: '冲动终于把你推向终点。',
    icon: '🔥',
    condition: '生理压抑失控',
  },
  {
    id: 'mental-breakdown',
    name: '精神崩溃',
    description: '压力彻底压垮了你。',
    icon: '🫥',
    condition: '心理压力达到极限',
  },
  {
    id: 'confirmed-infection',
    name: '确诊感染',
    description: '检测结果给出了残酷答案。',
    icon: '🧫',
    condition: '确认感染后结束',
  },
  {
    id: 'secret-carrier',
    name: '秘密携带者',
    description: '你带着秘密继续前行，却没人知道真相。',
    icon: '🕵️',
    condition: '感染但未被立即揭露',
  },
  {
    id: 'perfectionist',
    name: '完美主义',
    description: '你把每个细节都控制到了极致。',
    icon: '✨',
    condition: '全程采取最稳妥策略',
  },
  {
    id: 'extreme-survival',
    name: '极限求生',
    description: '在极端条件下硬撑到了最后。',
    icon: '🧗',
    condition: '在高压环境下完成通关',
  },
]
