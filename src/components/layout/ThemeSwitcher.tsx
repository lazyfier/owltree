import { useTheme } from '@/contexts/ThemeContext'
import { useEffect } from 'react'

export function ThemeInitializer() {
  const { theme } = useTheme()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return null
}

export type { Theme } from '@/contexts/ThemeContext'
