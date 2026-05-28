import { describe, expect, it } from 'vitest'

import { isExternalProjectUrl, projectEnvKey } from './projectLinks'

describe('project link config', () => {
  it('derives env keys from project ids', () => {
    expect(projectEnvKey('owltree-portal', 'link')).toBe('VITE_PROJECT_LINK_OWLTREE_PORTAL')
    expect(projectEnvKey('NeoBrutal UI', 'visible')).toBe('VITE_PROJECT_VISIBLE_NEO_BRUTAL_UI')
  })

  it('recognizes http and https project links as external', () => {
    expect(isExternalProjectUrl('https://example.com/portal')).toBe(true)
    expect(isExternalProjectUrl('http://127.0.0.1:3000')).toBe(true)
  })

  it('treats placeholders, app routes, and non-web schemes as internal', () => {
    expect(isExternalProjectUrl('#')).toBe(false)
    expect(isExternalProjectUrl('/projects')).toBe(false)
    expect(isExternalProjectUrl('mailto:hello@example.com')).toBe(false)
  })
})
