import { noteUpdatedAt } from '@/data/contentMetadata.generated'
import { getFilePreviewKind, markdownPathToSlug, normalizeNotePath, type FilePreviewKind } from '@/lib/notePaths'

export interface NoteDocument {
  slug: string
  relativePath: string
  directory: string
  title: string
  summary: string
  date: string
  updatedAt: string | null
  readTime: string
  tags: string[]
  type: 'article' | 'log' | 'thought' | 'dailywork'
  content: string
}

export interface NoteDirectory {
  path: string
  name: string
  parentPath: string | null
}

export interface NoteAsset {
  slug: string
  relativePath: string
  directory: string
  name: string
  previewKind: FilePreviewKind
  url: string
}

export interface NoteLink {
  href: string
  label: string
  targetSlug: string
}

const noteFiles = import.meta.glob('../content/notes/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
}) as Record<string, string>

const noteAssets = import.meta.glob('../content/notes/**/*', {
  eager: true,
  import: 'default',
  query: '?url',
}) as Record<string, string>

function relativePathFromImport(path: string): string {
  return path.replace('../content/notes/', '').replace(/\.md$/, '')
}

function assetPathFromImport(path: string): string {
  return path.replace('../content/notes/', '')
}

function directoryName(relativePath: string): string {
  const segments = relativePath.split('/')
  if (segments.length <= 1) {
    return ''
  }

  return segments.slice(0, -1).join('/')
}

function basename(relativePath: string): string {
  return relativePath.split('/').pop() ?? relativePath
}

function parseFrontmatter(source: string): { metadata: Record<string, string>; body: string } {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) {
    return { metadata: {}, body: source.trim() }
  }

  const lines = match[1].split('\n')
  const metadata: Record<string, string> = {}
  let currentListKey: string | null = null
  const currentListValues: string[] = []

  const flushCurrentList = () => {
    if (!currentListKey) {
      return
    }

    metadata[currentListKey] = currentListValues.join(', ')
    currentListKey = null
    currentListValues.length = 0
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd()
    if (!line.trim()) {
      continue
    }

    const listItem = line.match(/^\s*-\s+(.*)$/)
    if (listItem && currentListKey) {
      currentListValues.push(listItem[1].trim())
      continue
    }

    flushCurrentList()

    const separatorIndex = line.indexOf(':')
    if (separatorIndex === -1) {
      continue
    }

    const key = line.slice(0, separatorIndex).trim()
    const value = line.slice(separatorIndex + 1).trim()
    if (value) {
      metadata[key] = value.replace(/^"(.*)"$/, '$1')
      continue
    }

    currentListKey = key
  }

  flushCurrentList()

  return {
    metadata,
    body: match[2].trim(),
  }
}

function parseTags(value: string | undefined): string[] {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function estimateReadTime(content: string): string {
  const characters = content.replace(/\s/g, '').length
  const minutes = Math.max(1, Math.round(characters / 350))
  return `${minutes}分钟`
}

function normalizeType(value: string | undefined): NoteDocument['type'] {
  if (value === 'log' || value === 'thought' || value === 'dailywork') {
    return value
  }

  return 'article'
}

function buildNoteDocument(path: string, source: string): NoteDocument {
  const relativePath = relativePathFromImport(path)
  const directory = directoryName(relativePath)
  const { metadata, body } = parseFrontmatter(source)

  return {
    slug: relativePath,
    relativePath,
    directory,
    title: metadata.title || basename(relativePath).replace(/[-_]/g, ' '),
    summary: metadata.summary || body.split('\n').find(Boolean) || 'No summary available.',
    date: metadata.date || '1970-01-01',
    updatedAt: noteUpdatedAt[relativePath] ?? null,
    readTime: metadata.readTime || estimateReadTime(body),
    tags: parseTags(metadata.tags),
    type: normalizeType(metadata.type),
    content: body,
  }
}

export const notes = Object.entries(noteFiles)
  .map(([path, source]) => buildNoteDocument(path, source))
  .sort((left, right) => right.date.localeCompare(left.date))

const noteSlugs = new Set(notes.map((note) => note.slug))

export const noteFileAssets: NoteAsset[] = Object.entries(noteAssets)
  .map(([path, url]) => {
    const relativePath = assetPathFromImport(path)
    const slug = markdownPathToSlug(relativePath)

    return {
      slug,
      relativePath,
      directory: directoryName(relativePath),
      name: basename(relativePath),
      previewKind: getFilePreviewKind(relativePath),
      url,
    }
  })
  .filter((asset) => asset.previewKind !== 'markdown')
  .sort((left, right) => left.relativePath.localeCompare(right.relativePath))

const directorySet = new Set<string>()
for (const note of notes) {
  const segments = note.directory ? note.directory.split('/') : []
  for (let index = 0; index < segments.length; index += 1) {
    directorySet.add(segments.slice(0, index + 1).join('/'))
  }
}

for (const asset of noteFileAssets) {
  const segments = asset.directory ? asset.directory.split('/') : []
  for (let index = 0; index < segments.length; index += 1) {
    directorySet.add(segments.slice(0, index + 1).join('/'))
  }
}

export const noteDirectories: NoteDirectory[] = Array.from(directorySet)
  .sort((left, right) => left.localeCompare(right))
  .map((path) => {
    const segments = path.split('/')
    return {
      path,
      name: segments[segments.length - 1] || path,
      parentPath: segments.length > 1 ? segments.slice(0, -1).join('/') : '',
    }
  })

export function getNoteBySlug(slug: string): NoteDocument | undefined {
  return notes.find((note) => note.slug === slug)
}

export function getNoteAssetBySlug(slug: string): NoteAsset | undefined {
  return noteFileAssets.find((asset) => asset.slug === slug)
}

export function getNotesInDirectory(path: string): NoteDocument[] {
  return notes.filter((note) => note.directory === path)
}

export function getAssetsInDirectory(path: string): NoteAsset[] {
  return noteFileAssets.filter((asset) => asset.directory === path)
}

export function getChildDirectories(path: string): NoteDirectory[] {
  const normalizedParent = path
  return noteDirectories.filter((directory) => directory.parentPath === normalizedParent)
}

export function resolveNoteMarkdownLink(fromSlug: string, href: string): string | null {
  const trimmedHref = href.trim()

  if (
    !trimmedHref ||
    trimmedHref.startsWith('#') ||
    /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(trimmedHref) ||
    trimmedHref.startsWith('//')
  ) {
    return null
  }

  const withoutHash = trimmedHref.split('#')[0]
  const withoutQuery = withoutHash.split('?')[0]
  if (!withoutQuery.endsWith('.md')) {
    return null
  }

  const fromDirectory = directoryName(fromSlug)
  const rawTarget = withoutQuery.startsWith('/notes/')
    ? withoutQuery.replace(/^\/notes\//, '')
    : withoutQuery.startsWith('/')
      ? withoutQuery.replace(/^\/+/, '')
      : `${fromDirectory ? `${fromDirectory}/` : ''}${withoutQuery}`

  const segments: string[] = []
  for (const segment of normalizeNotePath(rawTarget).split('/')) {
    if (!segment || segment === '.') {
      continue
    }

    if (segment === '..') {
      segments.pop()
      continue
    }

    segments.push(segment)
  }

  const targetSlug = markdownPathToSlug(segments.join('/'))
  return noteSlugs.has(targetSlug) ? targetSlug : null
}

export function getNoteOutboundLinks(note: NoteDocument): NoteLink[] {
  const links: NoteLink[] = []
  const markdownLinkPattern = /!?\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g

  for (const match of note.content.matchAll(markdownLinkPattern)) {
    if (match[0].startsWith('!')) {
      continue
    }

    const targetSlug = resolveNoteMarkdownLink(note.slug, match[2])
    if (!targetSlug) {
      continue
    }

    links.push({
      href: match[2],
      label: match[1] || targetSlug,
      targetSlug,
    })
  }

  return links
}

export function getNoteBacklinks(slug: string): NoteDocument[] {
  return notes.filter((note) => {
    if (note.slug === slug) {
      return false
    }

    return getNoteOutboundLinks(note).some((link) => link.targetSlug === slug)
  })
}
