interface TranslationSet {
  copyright: string
}

const translations: Record<string, TranslationSet> = {
  zh: {
    copyright: '© 2026 Owltree。咖啡与代码构建。',
  },
  en: {
    copyright: '© 2026 Owltree. Built with caffeine and code.',
  },
}

export type Locale = 'zh' | 'en'
export type TranslationKey = keyof TranslationSet

export function t(locale: Locale, key: TranslationKey): string | string[] {
  return translations[locale][key]
}
