import { describe, expect, it } from 'vitest'

import { getFilePreviewKind, validateNoteMarkdownPath } from './notePaths'

describe('note path helpers', () => {
  it('accepts nested markdown paths with unicode filenames', () => {
    expect(validateNoteMarkdownPath('worklogs/未命名.md')).toEqual({
      ok: true,
      path: 'worklogs/未命名.md',
    })
  })

  it('rejects unsafe or non-markdown paths', () => {
    expect(validateNoteMarkdownPath('../x.md').ok).toBe(false)
    expect(validateNoteMarkdownPath('/tmp/x.md').ok).toBe(false)
    expect(validateNoteMarkdownPath('notes/x.txt').ok).toBe(false)
    expect(validateNoteMarkdownPath('notes//x.md').ok).toBe(false)
  })

  it('classifies lightweight preview kinds', () => {
    expect(getFilePreviewKind('note.md')).toBe('markdown')
    expect(getFilePreviewKind('draft.txt')).toBe('text')
    expect(getFilePreviewKind('image.png')).toBe('image')
    expect(getFilePreviewKind('paper.pdf')).toBe('pdf')
    expect(getFilePreviewKind('deck.pptx')).toBe('download')
  })
})
