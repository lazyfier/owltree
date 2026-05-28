import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { TerminalHome } from './TerminalHome'

function TestRouter({ children, initialEntries = ['/'] }: { children: ReactNode; initialEntries?: string[] }) {
  return (
    <MemoryRouter
      initialEntries={initialEntries}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      {children}
    </MemoryRouter>
  )
}

describe('TerminalHome', () => {
  it('renders the terminal shell content', () => {
    render(
      <TestRouter>
        <TerminalHome />
      </TestRouter>,
    )

    expect(screen.getByText('system online')).toBeInTheDocument()
    expect(screen.getByText('Building Owltree Portal')).toBeInTheDocument()
  })

  it('renders projects and modules', () => {
    render(
      <TestRouter>
        <TerminalHome />
      </TestRouter>,
    )

    expect(screen.getByText('./show_projects.sh')).toBeInTheDocument()
    expect(screen.getByText('./list_modules.sh')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'notes' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'projects' })).toBeInTheDocument()
  })

  it('navigates to a module route when a module button is clicked', async () => {
    const user = userEvent.setup()

    render(
      <TestRouter>
        <Routes>
          <Route path="/" element={<TerminalHome />} />
          <Route path="/projects" element={<div data-testid="projects-page">Projects</div>} />
        </Routes>
      </TestRouter>,
    )

    await user.click(screen.getByRole('button', { name: 'projects' }))
    expect(screen.getByTestId('projects-page')).toBeInTheDocument()
  })

  it('shows a project row for clickable projects', () => {
    render(
      <TestRouter>
        <TerminalHome />
      </TestRouter>,
    )

    const projectButtons = screen.getAllByRole('button')
    expect(projectButtons.length).toBeGreaterThan(0)
  })
})
