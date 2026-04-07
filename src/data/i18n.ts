interface TranslationSet {
  projects: string
  comingSoon: string
  copyright: string
  enter: string
  yourName: string
  signatures: string[]
  subtitle: string
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
  },
  en: {
    projects: 'PROJECTS',
    comingSoon: 'More projects coming soon...',
    copyright: '© 2026 Owltree. Built with caffeine and code.',
    enter: 'Enter →',
    yourName: 'Your Name',
    signatures: ['Wandering between code and inspiration', 'Digital Alchemist', 'Building things that matter'],
    subtitle: 'Digital Shrine // Code & Create',
  },
}

export type Locale = 'zh' | 'en'
export type TranslationKey = keyof TranslationSet

export function t(locale: Locale, key: TranslationKey): string | string[] {
  return translations[locale][key]
}

export const defaultTranslations = translations
