import { render, screen } from '@testing-library/react'

import App from '@/App'

describe('App routing shell', () => {
  it('renders the home placeholder on the root hash route', () => {
    window.location.hash = '#/'

    render(<App />)

    expect(screen.getByRole('heading', { name: /owltree portal placeholder/i })).toBeInTheDocument()
    expect(screen.getByText(/future portal route/i)).toBeInTheDocument()
  })

  it('renders the moon throw placeholder on the moon throw hash route', () => {
    window.location.hash = '#/moon-throw'

    render(<App />)

    expect(screen.getByRole('heading', { name: /moon throw placeholder/i })).toBeInTheDocument()
    expect(screen.getByText(/future moon-throw route/i)).toBeInTheDocument()
  })
})
