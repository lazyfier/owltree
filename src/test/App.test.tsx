import { render, screen } from '@testing-library/react'

import App from '@/App'

describe('App routing shell', () => {
  it('renders the home page with portal content', () => {
    render(<App />)

    // OWLTREE is split into individual letter spans by Framer Motion
    expect(screen.getByText((_content, element) => element?.textContent === 'OWLTREE')).toBeInTheDocument()
    expect(screen.getByText('PROJECTS')).toBeInTheDocument()
  })

  it('renders the moon throw intro on the game route', () => {
    render(<App />)

    expect(screen.getByText('月抛模拟器')).toBeInTheDocument()
  })
})
