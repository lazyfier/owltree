import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'

export function ThemeInitializer() {
  const { theme, setTheme } = useTheme()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!initialized) {
      if (theme !== 'terminal') {
        setTheme('terminal')
      }
      setInitialized(true)
    }
  }, [theme, setTheme, initialized])

  return null
}

export type { Theme } from '@/contexts/ThemeContext'
