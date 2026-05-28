import { fireEvent, render, screen } from '@testing-library/react'
import { vi } from 'vitest'

import App from '@/App'

vi.mock('@/components/ui/ParticleBackground', () => ({
  ParticleBackground: () => null,
}))

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
    window.localStorage.setItem('owltree-theme', 'legacy-theme')
    window.localStorage.setItem('owltree-theme-v2', 'custom-theme')

    render(<App />)

    expect(document.documentElement).toHaveAttribute('data-theme', 'terminal')
  })

  it('renders the home page with terminal content', () => {
    render(<App />)

    expect(screen.getByText('system online')).toBeInTheDocument()
  })

  it('renders the projects page on the projects route', async () => {
    window.location.hash = '#/projects'
    render(<App />)

    expect(await screen.findByText('$ ls -la ~/projects/frontend/')).toBeInTheDocument()
    expect(screen.getByText('owltree portal')).toBeInTheDocument()
  })

  it('redirects unknown routes to home', async () => {
    window.location.hash = '#/unknown-module'
    render(<App />)

    expect(await screen.findByText('system online')).toBeInTheDocument()
  })

  it('navigates to projects with the p shortcut', async () => {
    render(<App />)

    fireEvent.keyDown(window, { key: 'p' })

    expect(await screen.findByText('$ ls -la ~/projects/frontend/')).toBeInTheDocument()
  })

  it('opens shortcut help with question mark', () => {
    render(<App />)

    fireEvent.keyDown(window, { key: '?' })
    expect(screen.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeInTheDocument()
  })

  it('navigates to notes with the n shortcut', async () => {
    render(<App />)

    fireEvent.keyDown(window, { key: 'n' })

    expect(await screen.findByText('$ ls -la ~/notes/')).toBeInTheDocument()
  })

  it('uses escape as parent-level navigation', async () => {
    window.location.hash = '#/projects'
    render(<App />)

    expect(await screen.findByText('$ ls -la ~/projects/frontend/')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })

    expect(await screen.findByText('system online')).toBeInTheDocument()
  })

  it('renders a note detail route from markdown content', async () => {
    window.location.hash = '#/notes/terminal-notes'
    render(<App />)

    expect(await screen.findByText('$ cat ~/notes/terminal-notes.md')).toBeInTheDocument()
    expect(screen.getAllByText('Terminal Notes Workflow').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'Backlinks' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Weekly Sync/i })).toBeInTheDocument()
  })

  it('lists nested note folders and opens recursive note routes', async () => {
    window.location.hash = '#/notes'
    render(<App />)

    expect(await screen.findByText('worklogs')).toBeInTheDocument()

    window.location.hash = '#/notes/worklogs/weekly-sync'
    render(<App />)

    expect(await screen.findByText('$ cat ~/notes/worklogs/weekly-sync.md')).toBeInTheDocument()
    expect(screen.getAllByText('Weekly Sync').length).toBeGreaterThan(0)
  })

  it('renders note sorting controls', async () => {
    window.location.hash = '#/notes'
    render(<App />)

    expect(await screen.findByRole('button', { name: /updated/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /title/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /type/i })).toBeInTheDocument()
  })

  it('renders dev-only note creation controls in development', async () => {
    window.location.hash = '#/notes'
    render(<App />)

    expect(await screen.findByRole('textbox', { name: 'New note filename' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /new\.md/i })).toBeInTheDocument()
  })

  it('renders project sorting controls', async () => {
    window.location.hash = '#/projects'
    render(<App />)

    expect(await screen.findByRole('button', { name: /updated/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /title/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /stack/i })).toBeInTheDocument()
  })
})
