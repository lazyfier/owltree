import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { TerminalHome } from './TerminalHome'

describe('TerminalHome', () => {
  it('renders the terminal shell content', () => {
    render(
      <MemoryRouter>
        <TerminalHome />
      </MemoryRouter>,
    )

    expect(screen.getByText('SYSTEM ONLINE')).toBeInTheDocument()
    expect(screen.getByText('Building Owltree Portal')).toBeInTheDocument()
  })

  it('renders projects and modules', () => {
    render(
      <MemoryRouter>
        <TerminalHome />
      </MemoryRouter>,
    )

    expect(screen.getByText('./show_projects.sh')).toBeInTheDocument()
    expect(screen.getByText('./list_modules.sh')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'GAMES' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'NOTES' })).toBeInTheDocument()
  })

  it('navigates to a module route when a module button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={['/#/']}>
        <Routes>
          <Route path="/" element={<TerminalHome />} />
          <Route path="/games" element={<div data-testid="games-page">Games</div>} />
        </Routes>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'GAMES' }))
    expect(screen.getByTestId('games-page')).toBeInTheDocument()
  })

  it('shows a project row for clickable projects', () => {
    render(
      <MemoryRouter>
        <TerminalHome />
      </MemoryRouter>,
    )

    const projectButtons = screen.getAllByRole('button')
    expect(projectButtons.length).toBeGreaterThan(0)
  })
})
