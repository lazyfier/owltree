import { render, screen } from '@testing-library/react'

import App from '@/App'

describe('App routing shell', () => {
  beforeEach(() => {
    window.location.hash = '#/'
    document.documentElement.removeAttribute('data-theme')
  })

  it('always forces the terminal theme', () => {
    render(<App />)

    expect(document.documentElement).toHaveAttribute('data-theme', 'terminal')
  })

  it('ignores any pre-existing theme-related localStorage values', () => {
    window.localStorage.setItem('owltree-theme', 'galgame')
    window.localStorage.setItem('owltree-theme-v2', 'cyber')

    render(<App />)

    expect(document.documentElement).toHaveAttribute('data-theme', 'terminal')
  })

  it('renders the home page with terminal content', () => {
    render(<App />)

    expect(screen.getByText('SYSTEM ONLINE')).toBeInTheDocument()
  })

  it('renders the moon throw intro on the game route', async () => {
    window.location.hash = '#/moon-throw'
    render(<App />)

    expect(await screen.findByText('Panic Edition')).toBeInTheDocument()
  })

  it('renders the projects page on the projects route', async () => {
    window.location.hash = '#/projects'
    render(<App />)

    expect(await screen.findByText('$ ls -la ~/projects/frontend/')).toBeInTheDocument()
    expect(screen.getByText('[React] [CSS] [A11y]')).toBeInTheDocument()
  })
})
