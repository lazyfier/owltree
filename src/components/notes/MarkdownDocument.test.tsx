import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MarkdownDocument } from './MarkdownDocument'

describe('MarkdownDocument', () => {
  it('renders fenced code blocks outside paragraph tags', () => {
    const markdown = [
      '## Example',
      '',
      '```ts',
      'const answer = 42',
      '```',
    ].join('\n')

    const { container } = render(<MarkdownDocument content={markdown} />)

    expect(screen.getByText('Example')).toBeInTheDocument()
    expect(screen.getByText('const answer = 42')).toBeInTheDocument()
    expect(container.querySelector('p pre')).toBeNull()
  })

  it('rewrites internal note links and keeps external links external', () => {
    render(
      <MarkdownDocument
        content="[Internal](./other.md) and [External](https://example.com)"
        currentSlug="current"
        resolveInternalHref={(_, href) => href === './other.md' ? '#/notes/other' : null}
      />,
    )

    expect(screen.getByRole('link', { name: 'Internal' })).toHaveAttribute('href', '#/notes/other')
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute('href', 'https://example.com')
    expect(screen.getByRole('link', { name: 'External' })).toHaveAttribute('target', '_blank')
  })
})
