import { describe, expect, it } from 'vitest'

import { getSocialLinks, normalizeEmailHref } from './socialLinks'

describe('social link config', () => {
  it('normalizes raw email addresses into mailto links', () => {
    expect(normalizeEmailHref('hello@example.com')).toBe('mailto:hello@example.com')
    expect(normalizeEmailHref('mailto:hello@example.com')).toBe('mailto:hello@example.com')
    expect(normalizeEmailHref('')).toBe('')
  })

  it('keeps a non-placeholder GitHub link by default', () => {
    expect(getSocialLinks()).toEqual([
      {
        id: 'github',
        label: 'GitHub',
        href: 'https://github.com/lazyfier',
      },
    ])
  })
})
