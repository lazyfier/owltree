import React, { createContext, useContext, useEffect } from 'react'

export type Theme = 'terminal'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
const FIXED_THEME: Theme = 'terminal'
const noop = () => {}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', FIXED_THEME)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: FIXED_THEME, setTheme: noop, toggleTheme: noop }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
