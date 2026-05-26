export interface NotePathValidationResult {
  ok: boolean
  path: string
  error?: string
}

export type FilePreviewKind = 'markdown' | 'text' | 'image' | 'pdf' | 'audio' | 'video' | 'download'

const textExtensions = new Set([
  'css',
  'csv',
  'html',
  'js',
  'json',
  'jsx',
  'log',
  'mdx',
  'mjs',
  'scss',
  'sh',
  'toml',
  'ts',
  'tsx',
  'txt',
  'xml',
  'yaml',
  'yml',
])

const imageExtensions = new Set(['avif', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'webp'])
const audioExtensions = new Set(['aac', 'flac', 'm4a', 'mp3', 'ogg', 'wav'])
const videoExtensions = new Set(['m4v', 'mov', 'mp4', 'ogg', 'webm'])

export function normalizeNotePath(input: string): string {
  return input
    .trim()
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .replace(/\/+/g, '/')
}

export function validateNoteMarkdownPath(input: string): NotePathValidationResult {
  const rawPath = input.trim().replace(/\\/g, '/')
  const normalized = normalizeNotePath(input)

  if (!normalized) {
    return { ok: false, path: normalized, error: 'Path is required.' }
  }

  if (rawPath.startsWith('/') || /^[a-zA-Z]:\//.test(rawPath)) {
    return { ok: false, path: normalized, error: 'Absolute paths are not allowed.' }
  }

  if (rawPath.split('/').some((segment) => segment === '' || segment === '.' || segment === '..')) {
    return { ok: false, path: normalized, error: 'Path segments cannot be empty, "." or "..".' }
  }

  if (!normalized.endsWith('.md')) {
    return { ok: false, path: normalized, error: 'Only .md files can be edited.' }
  }

  if (normalized.split('/').some((segment) => !segment || segment === '.' || segment === '..')) {
    return { ok: false, path: normalized, error: 'Path segments cannot be empty, "." or "..".' }
  }

  return { ok: true, path: normalized }
}

export function slugToMarkdownPath(slug: string): string {
  return `${normalizeNotePath(slug).replace(/\.md$/, '')}.md`
}

export function markdownPathToSlug(path: string): string {
  return normalizeNotePath(path).replace(/\.md$/i, '')
}

export function getFilePreviewKind(path: string): FilePreviewKind {
  const extension = normalizeNotePath(path).split('.').pop()?.toLowerCase() ?? ''

  if (extension === 'md') {
    return 'markdown'
  }

  if (extension === 'pdf') {
    return 'pdf'
  }

  if (textExtensions.has(extension)) {
    return 'text'
  }

  if (imageExtensions.has(extension)) {
    return 'image'
  }

  if (audioExtensions.has(extension)) {
    return 'audio'
  }

  if (videoExtensions.has(extension)) {
    return 'video'
  }

  return 'download'
}
