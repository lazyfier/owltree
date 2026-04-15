import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { useHoverCard } from './useHoverCard'

function TestComponent() {
  const { anchorRef, show, hide, renderPortal } = useHoverCard()
  return (
    <div>
      <button
        ref={anchorRef as React.Ref<HTMLButtonElement>}
        type="button"
        onMouseEnter={show}
        onMouseLeave={hide}
        data-testid="anchor"
      >
        Hover me
      </button>
      {renderPortal(<div data-testid="portal-content">Portal content</div>)}
    </div>
  )
}

describe('useHoverCard', () => {
  it('does not render portal initially', () => {
    render(<TestComponent />)
    expect(screen.queryByTestId('portal-content')).not.toBeInTheDocument()
  })

  it('renders portal on mouse enter and removes on mouse leave', async () => {
    const user = userEvent.setup()
    render(<TestComponent />)

    await user.hover(screen.getByTestId('anchor'))
    expect(screen.getByTestId('portal-content')).toBeInTheDocument()

    await user.unhover(screen.getByTestId('anchor'))
    expect(screen.queryByTestId('portal-content')).not.toBeInTheDocument()
  })
})
