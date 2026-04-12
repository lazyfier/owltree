import type { DialogueNode } from '../types'

export const DIALOGUE_TREES: Record<string, DialogueNode[]> = {
  shy: [
    {
      id: 'shy-start',
      speaker: '她',
      text: '我、我是不是来得太突然了……',
      choices: [
        { text: '温和回应', nextNodeId: 'shy-soft', effects: { anxiety: -1 } },
        { text: '直接一点', nextNodeId: 'shy-direct', effects: { frustration: 1, anxiety: 1 } },
      ],
    },
    { id: 'shy-soft', speaker: '她', text: '这样我就安心些了。', choices: [], isEnd: true },
    { id: 'shy-direct', speaker: '她', text: '你说得太快了，我有点慌。', choices: [], isEnd: true },
  ],
  dominant: [
    {
      id: 'dominant-start',
      speaker: '她',
      text: '按我的节奏来，别拖。',
      choices: [
        { text: '顺从', nextNodeId: 'dominant-obey', effects: { frustration: -1 } },
        { text: '反抗', nextNodeId: 'dominant-resist', effects: { frustration: 2 } },
      ],
    },
    { id: 'dominant-obey', speaker: '她', text: '很好，这样就对了。', choices: [], isEnd: true },
    { id: 'dominant-resist', speaker: '她', text: '有胆量，但你得承担后果。', choices: [], isEnd: true },
  ],
  playful: [
    {
      id: 'playful-start',
      speaker: '她',
      text: '要不要来点有趣的？',
      choices: [
        { text: '配合', nextNodeId: 'playful-play', effects: { anxiety: -1 } },
        { text: '认真', nextNodeId: 'playful-serious', effects: { frustration: 1 } },
      ],
    },
    { id: 'playful-play', speaker: '她', text: '哈，终于接住我的梗了。', choices: [], isEnd: true },
    { id: 'playful-serious', speaker: '她', text: '行吧，那就正经聊。', choices: [], isEnd: true },
  ],
  cold: [
    {
      id: 'cold-start',
      speaker: '她',
      text: '嗯，随便吧。',
      choices: [
        { text: '追问', nextNodeId: 'cold-ask', effects: { frustration: 1, anxiety: 1 } },
        { text: '放弃', nextNodeId: 'cold-leave', effects: { anxiety: -1 } },
      ],
    },
    { id: 'cold-ask', speaker: '她', text: '你倒是挺执着。', choices: [], isEnd: true },
    { id: 'cold-leave', speaker: '她', text: '也好，省得麻烦。', choices: [], isEnd: true },
  ],
  anxious: [
    {
      id: 'anxious-start',
      speaker: '她',
      text: '等等，我是不是哪里做错了？',
      choices: [
        { text: '安慰', nextNodeId: 'anxious-comfort', effects: { anxiety: -2 } },
        { text: '急躁', nextNodeId: 'anxious-rush', effects: { frustration: 1, anxiety: 2 } },
      ],
    },
    { id: 'anxious-comfort', speaker: '她', text: '嗯……这样我能放松一点。', choices: [], isEnd: true },
    { id: 'anxious-rush', speaker: '她', text: '我更紧张了。', choices: [], isEnd: true },
  ],
  experienced: [
    {
      id: 'experienced-start',
      speaker: '她',
      text: '这种场面，我见得多了。',
      choices: [
        { text: '请教', nextNodeId: 'experienced-ask', effects: { anxiety: -1 } },
        { text: '质疑', nextNodeId: 'experienced-challenge', effects: { frustration: 1 } },
      ],
    },
    { id: 'experienced-ask', speaker: '她', text: '问得不错，我喜欢有脑子的人。', choices: [], isEnd: true },
    { id: 'experienced-challenge', speaker: '她', text: '你要确认，就自己看清楚。', choices: [], isEnd: true },
  ],
  romantic: [
    {
      id: 'romantic-start',
      speaker: '她',
      text: '今晚的空气，像有点发光。',
      choices: [
        { text: '回应', nextNodeId: 'romantic-answer', effects: { anxiety: -1 } },
        { text: '打岔', nextNodeId: 'romantic-distract', effects: { frustration: 1 } },
      ],
    },
    { id: 'romantic-answer', speaker: '她', text: '嗯，这就是我想听的。', choices: [], isEnd: true },
    { id: 'romantic-distract', speaker: '她', text: '好吧，浪漫被你岔开了。', choices: [], isEnd: true },
  ],
  mysterious: [
    {
      id: 'mysterious-start',
      speaker: '她',
      text: '答案就在雾里，别急。',
      choices: [
        { text: '好奇', nextNodeId: 'mysterious-curious', effects: { anxiety: -1 } },
        { text: '警惕', nextNodeId: 'mysterious-wary', effects: { frustration: 1 } },
      ],
    },
    { id: 'mysterious-curious', speaker: '她', text: '你愿意往前一步。', choices: [], isEnd: true },
    { id: 'mysterious-wary', speaker: '她', text: '保持距离，也是一种答案。', choices: [], isEnd: true },
  ],
}
