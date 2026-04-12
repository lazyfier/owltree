import type { EventTemplate } from '../types'

export const EVENT_TEMPLATES: EventTemplate[] = [
  {
    eventId: 'unexpected_visitor',
    title: '不速之客',
    description: '正当你和伙伴渐入佳境时，门外突然传来敲门声。是室友回来了？还是...',
    choices: [
      { text: '匆忙收场，迅速撤离', effects: { frustration: 10, anxiety: 5 } },
      { text: '假装不在家，继续', effects: { frustration: -5, anxiety: 15 } },
      { text: '去开门看看情况', effects: { frustration: 20, anxiety: 10 } },
    ],
    priority: 5,
  },
  {
    eventId: 'broken_condom',
    title: '意外破裂',
    description: '过程中安全套突然破裂。空气瞬间凝固，你们面面相觑。',
    choices: [
      { text: '立即停止，商量对策', effects: { frustration: 15, anxiety: 25 } },
      { text: '换个新的继续', effects: { frustration: -10, anxiety: 30 } },
      { text: '就此结束，各回各家', effects: { frustration: 30, anxiety: 10 } },
    ],
    priority: 10,
  },
  {
    eventId: 'phone_call',
    title: '电话惊魂',
    description: '伙伴的手机突然响起。屏幕显示"老婆"。他脸色大变。',
    choices: [
      { text: '让他接电话', effects: { frustration: 20, anxiety: 5 } },
      { text: '示意他挂断', effects: { frustration: -5, anxiety: 15 } },
      { text: '直接帮他按掉', effects: { frustration: 0, anxiety: 25 } },
    ],
    priority: 6,
  },
  {
    eventId: 'found_medicine',
    title: '床头的秘密',
    description: '你在床头柜发现了一瓶药。是抗病毒药物，还是...阻断药？',
    choices: [
      { text: '直接询问这是什么药', effects: { frustration: 5, anxiety: 10 } },
      { text: '假装没看见，暗中观察', effects: { frustration: -5, anxiety: 20 } },
      { text: '借故离开', effects: { frustration: 25, anxiety: 5 } },
    ],
    priority: 8,
  },
  {
    eventId: 'strange_spot',
    title: '可疑的痕迹',
    description: '你在对方身上发现了一个奇怪的斑点/伤口。是皮肤病吗？',
    choices: [
      { text: '直接问那是什么', effects: { frustration: 10, anxiety: 15 } },
      { text: '用检测试纸检查一下', effects: { frustration: 5, anxiety: 10 }, nextEventId: 'test_result' },
      { text: '找个借口结束约会', effects: { frustration: 20, anxiety: 5 } },
    ],
    priority: 9,
  },
  {
    eventId: 'test_result',
    title: '检测结果',
    description: '试纸显示了结果...',
    choices: [
      { text: '接受结果，继续', effects: { frustration: -10, anxiety: 5 } },
      { text: '要求对方再做一次检测', effects: { frustration: 10, anxiety: 15 } },
      { text: '决定离开', effects: { frustration: 25, anxiety: 0 } },
    ],
    priority: 10,
  },
  {
    eventId: 'ex_knock',
    title: '前任突袭',
    description: '门铃响了。透过猫眼看到是对方的前任，看起来情绪激动。',
    choices: [
      { text: '劝伙伴去处理', effects: { frustration: 25, anxiety: 15 } },
      { text: '躲在房间里不出声', effects: { frustration: 10, anxiety: 25 } },
      { text: '开门帮伙伴解释', effects: { frustration: 30, anxiety: 30 } },
    ],
    priority: 7,
  },
  {
    eventId: 'no_condom',
    title: '没带套',
    description: '关键时刻发现没有安全套了。对方说："没事的，我身体很健康。"',
    choices: [
      { text: '坚持去买套，暂停活动', effects: { frustration: 20, anxiety: 5 } },
      { text: '接受无套', effects: { frustration: -20, anxiety: 50 } },
      { text: '改变方式，只做边缘行为', effects: { frustration: 5, anxiety: 10 } },
    ],
    priority: 10,
  },
  {
    eventId: 'intoxicated_partner',
    title: '醉酒状态',
    description: '对方喝得有点多，说话含糊不清。这种情况下还有判断能力吗？',
    choices: [
      { text: '让他醒酒，改日再约', effects: { frustration: 30, anxiety: 0 } },
      { text: '继续，但保持清醒', effects: { frustration: -10, anxiety: 25 } },
      { text: '帮他叫车送他回家', effects: { frustration: 25, anxiety: 5 } },
    ],
    priority: 8,
  },
  {
    eventId: 'unexpected_feeling',
    title: '意外的情感',
    description: '约会结束后，对方说想认真发展关系，不只是约。',
    choices: [
      { text: '表示也有好感', effects: { frustration: -20, anxiety: 10 } },
      { text: '说明白只是约', effects: { frustration: 15, anxiety: 5 } },
      { text: '含糊其辞，先保持联系', effects: { frustration: 0, anxiety: 20 } },
    ],
    priority: 4,
  },
  {
    eventId: 'friend_overlap',
    title: '共同好友',
    description: '聊天中发现你们有共同的朋友。小圈子真小。',
    choices: [
      { text: '表示保密，继续', effects: { frustration: 5, anxiety: 15 } },
      { text: '担心被说闲话，结束', effects: { frustration: 20, anxiety: 10 } },
      { text: '开玩笑说要保密费', effects: { frustration: -5, anxiety: 10 } },
    ],
    priority: 3,
  },
  {
    eventId: 'wrong_identity',
    title: '身份存疑',
    description: '对方的某些话前后矛盾。年龄、职业都对不上。他在隐瞒什么？',
    choices: [
      { text: '当场质问', effects: { frustration: 20, anxiety: 20 } },
      { text: '默默记下，小心为上', effects: { frustration: 10, anxiety: 25 } },
      { text: '借故离开', effects: { frustration: 25, anxiety: 5 } },
    ],
    priority: 7,
  },
  {
    eventId: 'roommate_return',
    title: '室友归来',
    description: '你听到钥匙开门的声音。室友比预期早回来了！',
    choices: [
      { text: '赶紧穿衣服溜', effects: { frustration: 25, anxiety: 15 } },
      { text: '躲进衣柜', effects: { frustration: 15, anxiety: 30 } },
      { text: '假装是来找人的', effects: { frustration: 20, anxiety: 25 } },
    ],
    priority: 6,
  },
  {
    eventId: 'proposition_threesome',
    title: '三人行邀请',
    description: '对方说还有个朋友也想加入。双倍刺激，还是双倍风险？',
    choices: [
      { text: '接受邀请', effects: { frustration: -15, anxiety: 35 } },
      { text: '婉拒，只想一对一', effects: { frustration: 10, anxiety: 5 } },
      { text: '要求对方提供两人的检测报告', effects: { frustration: 5, anxiety: 15 } },
    ],
    priority: 5,
  },
  {
    eventId: 'fire_alarm',
    title: '火警警报',
    description: '楼道突然响起火警警报。所有人都要疏散。',
    choices: [
      { text: '迅速撤离大楼', effects: { frustration: 30, anxiety: 20 } },
      { text: '先穿好衣服再出去', effects: { frustration: 20, anxiety: 25 } },
      { text: '确认是误报再决定', effects: { frustration: 10, anxiety: 30 } },
    ],
    priority: 10,
  },
  {
    eventId: 'photograph_request',
    title: '拍照留念',
    description: '对方想拍照片或视频。说是自己留着看。',
    choices: [
      { text: '坚决拒绝', effects: { frustration: 10, anxiety: 5 } },
      { text: '同意，但要求看删除', effects: { frustration: 0, anxiety: 25 } },
      { text: '只拍不露脸的照片', effects: { frustration: -5, anxiety: 20 } },
    ],
    priority: 4,
  },
  {
    eventId: 'payment_request',
    title: '金钱交易',
    description: '事后对方提出要收费。之前可没说这是交易。',
    choices: [
      { text: '付钱息事宁人', effects: { frustration: 25, anxiety: 15 } },
      { text: '拒绝并报警威胁', effects: { frustration: 30, anxiety: 35 } },
      { text: '协商一个合理价格', effects: { frustration: 20, anxiety: 20 } },
    ],
    priority: 8,
  },
  {
    eventId: 'health_confession',
    title: '健康坦白',
    description: '对方突然坦白自己有某种健康状况，但说"已经控制住了"。',
    choices: [
      { text: '感谢坦诚，但选择离开', effects: { frustration: 25, anxiety: 10 } },
      { text: '详细询问后决定', effects: { frustration: 5, anxiety: 25 } },
      { text: '接受并继续', effects: { frustration: -10, anxiety: 40 } },
    ],
    priority: 10,
  },
  {
    eventId: 'location_change',
    title: '临时换地方',
    description: '对方说这里不方便，要去另一个地方。环境未知，风险未知。',
    choices: [
      { text: '同意去新地方', effects: { frustration: 5, anxiety: 20 } },
      { text: '坚持在当前地点', effects: { frustration: 15, anxiety: 10 } },
      { text: '取消约会', effects: { frustration: 30, anxiety: 5 } },
    ],
    priority: 5,
  },
  {
    eventId: 'lost_wallet',
    title: '钱包丢失',
    description: '事后发现钱包不见了。里面有身份证和各种卡。',
    choices: [
      { text: '质问对方', effects: { frustration: 30, anxiety: 30 } },
      { text: '仔细回忆可能掉在哪', effects: { frustration: 20, anxiety: 25 } },
      { text: '立即挂失所有卡', effects: { frustration: 25, anxiety: 35 } },
    ],
    priority: 7,
  },
]
