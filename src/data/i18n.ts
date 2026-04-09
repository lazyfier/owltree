interface TranslationSet {
  projects: string
  comingSoon: string
  copyright: string
  enter: string
  yourName: string
  signatures: string[]
  subtitle: string
  pressKey: string
  games: string
  notes: string
  tools: string
  trends: string
  bookmarks: string
  new: string
  startGame: string
  continue: string
  explorer: string
  creativity: string
  focus: string
  progress: string
  completed: string
  inProgress: string
  bookmarked: string
}

const translations: Record<string, TranslationSet> = {
  zh: {
    projects: '项目',
    comingSoon: '更多项目正在路上...',
    copyright: '© 2026 Owltree。咖啡与代码构建。',
    enter: '进入 →',
    yourName: 'Your Name',
    signatures: ['在代码与灵感之间游走', 'Digital Alchemist', 'Building things that matter'],
    subtitle: '数字神殿 // 代码与创造',
    pressKey: '按任意键继续',
    games: '游戏',
    notes: '笔记',
    tools: '工具',
    trends: '趋势',
    bookmarks: '收藏',
    new: '新建',
    startGame: '开始游戏',
    continue: '继续',
    explorer: '探索者',
    creativity: '创造力',
    focus: '专注力',
    progress: '项目进度',
    completed: '已完成',
    inProgress: '进行中',
    bookmarked: '已收藏',
  },
  en: {
    projects: 'PROJECTS',
    comingSoon: 'More projects coming soon...',
    copyright: '© 2026 Owltree. Built with caffeine and code.',
    enter: 'Enter →',
    yourName: 'Your Name',
    signatures: ['Wandering between code and inspiration', 'Digital Alchemist', 'Building things that matter'],
    subtitle: 'Digital Shrine // Code & Create',
    pressKey: 'Press any key to continue',
    games: 'Games',
    notes: 'Notes',
    tools: 'Tools',
    trends: 'Trends',
    bookmarks: 'Bookmarks',
    new: 'New',
    startGame: 'Start Game',
    continue: 'Continue',
    explorer: 'Explorer',
    creativity: 'Creativity',
    focus: 'Focus',
    progress: 'Progress',
    completed: 'Completed',
    inProgress: 'In Progress',
    bookmarked: 'Bookmarked',
  },
}

export type Locale = 'zh' | 'en'
export type TranslationKey = keyof TranslationSet

export function t(locale: Locale, key: TranslationKey): string | string[] {
  return translations[locale][key]
}

export const defaultTranslations = translations
