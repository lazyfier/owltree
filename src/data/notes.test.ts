import { describe, expect, it } from 'vitest'

import { getNoteBacklinks, getNoteBySlug, getNoteOutboundLinks, resolveNoteMarkdownLink } from './notes'

describe('note markdown link graph', () => {
  it('resolves markdown note links from relative and root paths', () => {
    expect(resolveNoteMarkdownLink('terminal-notes', './worklogs/weekly-sync.md')).toBe('worklogs/weekly-sync')
    expect(resolveNoteMarkdownLink('worklogs/weekly-sync', '../terminal-notes.md')).toBe('terminal-notes')
    expect(resolveNoteMarkdownLink('worklogs/weekly-sync', '/notes/terminal-notes.md#intro')).toBe('terminal-notes')
  })

  it('ignores external links, anchors, and unknown notes', () => {
    expect(resolveNoteMarkdownLink('terminal-notes', 'https://example.com/note.md')).toBeNull()
    expect(resolveNoteMarkdownLink('terminal-notes', '#local')).toBeNull()
    expect(resolveNoteMarkdownLink('terminal-notes', './missing.md')).toBeNull()
  })

  it('reports outbound links and backlinks', () => {
    const weeklySync = getNoteBySlug('worklogs/weekly-sync')

    expect(weeklySync).toBeDefined()
    expect(getNoteOutboundLinks(weeklySync!).map((link) => link.targetSlug)).toContain('terminal-notes')
    expect(getNoteBacklinks('terminal-notes').map((note) => note.slug)).toContain('worklogs/weekly-sync')
  })
})
