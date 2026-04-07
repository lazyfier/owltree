export function getLocale(): 'zh' | 'en' {
  const lang = navigator.language.toLowerCase()
  return lang.startsWith('zh') ? 'zh' : 'en'
}
