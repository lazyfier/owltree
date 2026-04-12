import { render, screen } from '@testing-library/react'

import App from '@/App'

describe('App routing shell', () => {
  beforeEach(() => {
    window.location.hash = '#/'
    window.localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('uses terminal as the default theme when no preference is stored', () => {
    render(<App />)

    expect(document.documentElement).toHaveAttribute('data-theme', 'terminal')
    expect(window.localStorage.getItem('owltree-theme-v2')).toBe('terminal')
  })

  it('ignores the legacy stored theme so terminal becomes the new default baseline', () => {
    window.localStorage.setItem('owltree-theme', 'galgame')

    render(<App />)

    expect(document.documentElement).toHaveAttribute('data-theme', 'terminal')
    expect(window.localStorage.getItem('owltree-theme-v2')).toBe('terminal')
  })

  it('still respects the current stored preference after the new baseline is established', () => {
    window.localStorage.setItem('owltree-theme-v2', 'cyber')

    render(<App />)

    expect(document.documentElement).toHaveAttribute('data-theme', 'cyber')
  })

  it('renders the home page with terminal content', () => {
    render(<App />)

    expect(screen.getByText('SYSTEM ONLINE')).toBeInTheDocument()
  })

  it('renders the moon throw intro on the game route', () => {
    window.location.hash = '#/moon-throw'
    render(<App />)

    expect(screen.getByText('Panic Edition')).toBeInTheDocument()
  })
})
