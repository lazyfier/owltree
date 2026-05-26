import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tagName = target.tagName.toLowerCase()
  return target.isContentEditable || tagName === 'input' || tagName === 'textarea' || tagName === 'select'
}

function getParentPath(pathname: string): string {
  if (pathname === '/' || pathname === '') {
    return '/'
  }

  const segments = pathname.split('/').filter(Boolean)
  if (segments.length <= 1) {
    return '/'
  }

  return `/${segments.slice(0, -1).join('/')}`
}

export function useGlobalShortcuts() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isShortcutHelpOpen, setIsShortcutHelpOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) {
        return
      }

      if (event.key === 'Escape') {
        event.preventDefault()
        if (isShortcutHelpOpen) {
          setIsShortcutHelpOpen(false)
          return
        }
        navigate(getParentPath(location.pathname))
        return
      }

      if (event.key === '?') {
        event.preventDefault()
        setIsShortcutHelpOpen((current) => !current)
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      const shortcutMap: Record<string, string> = {
        h: '/',
        n: '/notes',
        p: '/projects',
      }

      const nextRoute = shortcutMap[event.key.toLowerCase()]
      if (!nextRoute) {
        return
      }

      event.preventDefault()
      navigate(nextRoute)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isShortcutHelpOpen, location.pathname, navigate])

  return {
    isShortcutHelpOpen,
    openShortcutHelp: () => {
      setIsShortcutHelpOpen(true)
    },
    closeShortcutHelp: () => {
      setIsShortcutHelpOpen(false)
    },
  }
}
