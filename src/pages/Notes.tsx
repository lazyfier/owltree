import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'
import { getAssetsInDirectory, getChildDirectories, getNotesInDirectory, type NoteAsset, type NoteDocument } from '@/data/notes'
import { slugToMarkdownPath, validateNoteMarkdownPath } from '@/lib/notePaths'
import '@/styles/pages/notes.css'
import '@/styles/pages/_theme-atmosphere.css'
import { ArrowLeft, BookOpen, Calendar, Clock, ChevronRight, FilePlus2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const typeConfig = {
  article: {
    icon: '::',
    label: 'article',
    color: 'var(--notes-accent)',
  },
  log: {
    icon: '>>',
    label: 'log',
    color: 'var(--yellow)',
  },
  dailywork: {
    icon: '[]',
    label: 'daily',
    color: 'var(--green)',
  },
  thought: {
    icon: '??',
    label: 'thought',
    color: 'var(--mauve)',
  },
} as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.175, 0.885, 0.32, 1.12],
    },
  },
}

function formatTerminalTags(tags: string[]): string {
  return tags.map((tag) => `[${tag}]`).join(' ')
}

function formatUpdatedAt(value: string | null): string {
  if (!value) {
    return '--'
  }

  return value.slice(0, 10)
}

type NoteSortKey = 'updated' | 'title' | 'type'
type NoteSortDirection = 'asc' | 'desc'
const canEditNotes = import.meta.env.DEV

function compareNotes(left: NoteDocument, right: NoteDocument, key: NoteSortKey, direction: NoteSortDirection): number {
  const order = direction === 'asc' ? 1 : -1

  if (key === 'updated') {
    return order * (left.updatedAt ?? '').localeCompare(right.updatedAt ?? '')
  }

  if (key === 'type') {
    return order * left.type.localeCompare(right.type)
  }

  return order * left.title.localeCompare(right.title)
}

function assetKindLabel(asset: NoteAsset): string {
  return asset.previewKind === 'download' ? 'file' : asset.previewKind
}

function buildNewNoteTemplate(title: string): string {
  const today = new Date().toISOString().slice(0, 10)

  return [
    '---',
    `title: ${title}`,
    `date: ${today}`,
    'tags: notes',
    `summary: ${title}`,
    'type: article',
    '---',
    '',
    `# ${title}`,
    '',
  ].join('\n')
}

async function createNote(path: string, title: string): Promise<void> {
  const response = await fetch('/__owltree/notes/raw', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path, content: buildNewNoteTemplate(title) }),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: 'Unable to create note.' })) as { error?: string }
    throw new Error(payload.error ?? 'Unable to create note.')
  }
}

export function Notes() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { theme } = useTheme()
  const currentDirectory = searchParams.get('dir') ?? ''
  const sortKey = (searchParams.get('sort') as NoteSortKey | null) ?? 'updated'
  const sortDirection = (searchParams.get('order') as NoteSortDirection | null) ?? 'desc'
  const childDirectories = getChildDirectories(currentDirectory)
  const directoryNotes = getNotesInDirectory(currentDirectory)
  const directoryAssets = getAssetsInDirectory(currentDirectory)
  const displayPath = currentDirectory ? `~/notes/${currentDirectory}` : '~/notes'
  const [newNoteName, setNewNoteName] = useState('new.md')
  const [newNoteStatus, setNewNoteStatus] = useState('')

  const sortedDirectoryNotes = useMemo(() => {
    return [...directoryNotes].sort((left, right) => compareNotes(left, right, sortKey, sortDirection))
  }, [directoryNotes, sortDirection, sortKey])

  const openDirectory = (path: string) => {
    const nextParams = new URLSearchParams(searchParams)
    if (path) {
      nextParams.set('dir', path)
    } else {
      nextParams.delete('dir')
    }
    const query = nextParams.toString()
    navigate(`/notes${query ? `?${query}` : ''}`)
  }

  const applySort = (nextKey: NoteSortKey) => {
    const nextDirection: NoteSortDirection =
      nextKey === sortKey
        ? (sortDirection === 'desc' ? 'asc' : 'desc')
        : 'desc'

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('sort', nextKey)
    nextParams.set('order', nextDirection)
    setSearchParams(nextParams)
  }

  const createNewNote = async () => {
    const notePath = currentDirectory ? `${currentDirectory}/${newNoteName}` : newNoteName
    const validation = validateNoteMarkdownPath(notePath)

    if (!validation.ok) {
      setNewNoteStatus(validation.error ?? 'Invalid note path.')
      return
    }

    setNewNoteStatus('creating...')
    try {
      await createNote(validation.path, newNoteName.replace(/\.md$/, '').replace(/[-_]/g, ' '))
      setNewNoteStatus('created; Vite will reload the note index.')
      navigate(`/notes/${slugToMarkdownPath(validation.path).replace(/\.md$/, '')}`)
    } catch (error) {
      setNewNoteStatus(error instanceof Error ? error.message : 'Unable to create note.')
    }
  }

  return (
    <div data-page="notes" className="page-root min-h-screen relative">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl">
          {theme === 'terminal' ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="term-command-output font-mono text-sm leading-7 text-[var(--page-text)] note-shell"
            >
              <div className="term-output-line flex items-center gap-2 mb-2">
                <a
                  href={currentDirectory ? `#/notes` : '#/'}
                  className="page-back-btn inline-flex items-center gap-1 px-2 py-1 text-xs transition-all"
                >
                  <ArrowLeft className="w-3 h-3" />
                  cd ..
                </a>
              </div>
              <div className="notes-terminal-header">
                <span className="notes-terminal-prompt">$ ls -la {displayPath}/</span>
                <span className="notes-terminal-count">{childDirectories.length + directoryNotes.length + directoryAssets.length} entries</span>
              </div>
              <div className="notes-terminal-sortbar">
                <button type="button" className="notes-sort-chip" onClick={() => applySort('updated')}>
                  updated {sortKey === 'updated' ? `[${sortDirection}]` : ''}
                </button>
                <button type="button" className="notes-sort-chip" onClick={() => applySort('title')}>
                  title {sortKey === 'title' ? `[${sortDirection}]` : ''}
                </button>
                <button type="button" className="notes-sort-chip" onClick={() => applySort('type')}>
                  type {sortKey === 'type' ? `[${sortDirection}]` : ''}
                </button>
              </div>
              {canEditNotes ? (
                <div className="notes-new-row">
                  <span>$ touch</span>
                  <input
                    className="notes-new-input"
                    value={newNoteName}
                    onChange={(event) => setNewNoteName(event.target.value)}
                    aria-label="New note filename"
                  />
                  <button type="button" className="notes-action-btn" onClick={createNewNote}>
                    <FilePlus2 className="h-3.5 w-3.5" />
                    new.md
                  </button>
                  {newNoteStatus ? <span className="notes-new-status">{newNoteStatus}</span> : null}
                </div>
              ) : null}
              <div className="notes-terminal-table">
                {childDirectories.map((directory) => (
                  <button
                    key={directory.path}
                    type="button"
                    className="notes-terminal-row"
                    onClick={() => openDirectory(directory.path)}
                  >
                    <span className="notes-cell notes-cell-perms">drwxr-xr-x</span>
                    <span className="notes-cell notes-cell-title" title={directory.name}>{directory.name}</span>
                    <span className="notes-cell notes-cell-type notes-cell-type-folder" style={{ color: 'var(--yellow)' }}>
                      {'<>'}
                    </span>
                    <span className="notes-cell notes-cell-kind">dir</span>
                    <span className="notes-cell notes-cell-date">folder</span>
                    <span className="notes-cell notes-cell-tags">[open]</span>
                  </button>
                ))}
                {sortedDirectoryNotes.map((note) => {
                  const config = typeConfig[note.type]

                  return (
                    <button
                      key={note.slug}
                      type="button"
                      className="notes-terminal-row"
                      onClick={() => navigate(`/notes/${note.slug}`)}
                    >
                      <span className="notes-cell notes-cell-perms">-rw-r--r--</span>
                      <span className="notes-cell notes-cell-title" title={note.title}>{note.title}</span>
                      <span className="notes-cell notes-cell-type" style={{ color: config.color }}>
                        {config.icon}
                      </span>
                      <span className="notes-cell notes-cell-kind">{config.label}</span>
                      <span className="notes-cell notes-cell-date">{formatUpdatedAt(note.updatedAt)}</span>
                      <span className="notes-cell notes-cell-tags" title={formatTerminalTags(note.tags)}>{formatTerminalTags(note.tags)}</span>
                    </button>
                  )
                })}
                {directoryAssets.map((asset) => (
                  <button
                    key={asset.slug}
                    type="button"
                    className="notes-terminal-row"
                    onClick={() => navigate(`/notes/${asset.slug}`)}
                  >
                    <span className="notes-cell notes-cell-perms">-rw-r--r--</span>
                    <span className="notes-cell notes-cell-title" title={asset.name}>{asset.name}</span>
                    <span className="notes-cell notes-cell-type" style={{ color: 'var(--cyan)' }}>
                      {'--'}
                    </span>
                    <span className="notes-cell notes-cell-kind">{assetKindLabel(asset)}</span>
                    <span className="notes-cell notes-cell-date">preview</span>
                    <span className="notes-cell notes-cell-tags">[open]</span>
                  </button>
                ))}
              </div>
              <div className="term-cursor-line">$ _</div>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-8"
              >
                <a
                  href={currentDirectory ? '#/notes' : '#/'}
                  className="page-back-btn flex items-center justify-center w-11 h-11 rounded-2xl transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </a>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="page-header-icon flex h-10 w-10 items-center justify-center rounded-xl bg-transparent">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-[var(--page-text)]">笔记</h1>
                      <p className="text-sm text-[var(--page-text-muted)]">从 markdown 目录递归读取，并按文件夹与文件浏览</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="notes-directory-bar"
              >
                <button type="button" className="notes-directory-chip" onClick={() => openDirectory('')}>
                  root
                </button>
                {currentDirectory ? (
                  <span className="notes-directory-current">
                    <ChevronRight className="h-3.5 w-3.5" />
                    {currentDirectory}
                  </span>
                ) : null}
                {canEditNotes ? (
                  <div className="notes-new-row">
                    <input
                      className="notes-new-input"
                      value={newNoteName}
                      onChange={(event) => setNewNoteName(event.target.value)}
                      aria-label="New note filename"
                    />
                    <button type="button" className="notes-action-btn" onClick={createNewNote}>
                      <FilePlus2 className="h-3.5 w-3.5" />
                      new.md
                    </button>
                  </div>
                ) : null}
              </motion.div>
              {newNoteStatus ? <p className="notes-new-status">{newNoteStatus}</p> : null}

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="notes-grid"
              >
                {childDirectories.map((directory) => (
                  <motion.button
                    key={directory.path}
                    variants={itemVariants}
                    type="button"
                    className="page-card note-card group relative overflow-hidden cursor-pointer transition-all text-left"
                    onClick={() => openDirectory(directory.path)}
                  >
                    <div className="note-card-inner">
                      <div className="note-layout">
                        <div className="note-type-col">
                            <span className="note-type-icon">{'<>'}</span>
                          <span className="page-label text-[10px] font-semibold uppercase tracking-wider">
                            dir
                          </span>
                        </div>

                        <div className="note-body">
                          <span className="note-title text-lg font-bold text-[var(--page-text)] transition-colors">
                            {directory.name}
                          </span>
                          <span className="note-excerpt text-sm text-[var(--page-text-secondary)] leading-relaxed line-clamp-2">
                            打开文件夹并浏览其中的 markdown 文档
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
                {sortedDirectoryNotes.map((note) => {
                  const config = typeConfig[note.type]
                  return (
                    <motion.button
                      key={note.slug}
                      variants={itemVariants}
                      type="button"
                      className="page-card note-card group relative overflow-hidden cursor-pointer transition-all text-left"
                      onClick={() => navigate(`/notes/${note.slug}`)}
                    >
                      <div className="note-card-inner">
                        <div className="note-layout">
                          <div className="note-type-col">
                            <span className="note-type-icon">{config.icon}</span>
                            <span className="page-label text-[10px] font-semibold uppercase tracking-wider">
                              {config.label}
                            </span>
                          </div>

                          <div className="note-body">
                            <span className="note-title text-lg font-bold text-[var(--page-text)] transition-colors">
                              {note.title}
                            </span>
                            <span className="note-excerpt text-sm text-[var(--page-text-secondary)] leading-relaxed line-clamp-2">
                              {note.summary}
                            </span>
                            <div className="note-meta text-xs text-[var(--page-text-muted)]">
                              <span className="note-meta-items">
                                <Calendar className="w-3.5 h-3.5" />
                                {note.date}
                              </span>
                              <span className="note-meta-items">
                                <Clock className="w-3.5 h-3.5" />
                                {formatUpdatedAt(note.updatedAt)}
                              </span>
                              <span className="note-meta-items">
                                {note.readTime}
                              </span>
                              <div className="note-tags">
                                {note.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="page-tag transition-colors"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
                {directoryAssets.map((asset) => (
                  <motion.button
                    key={asset.slug}
                    variants={itemVariants}
                    type="button"
                    className="page-card note-card group relative overflow-hidden cursor-pointer transition-all text-left"
                    onClick={() => navigate(`/notes/${asset.slug}`)}
                  >
                    <div className="note-card-inner">
                      <div className="note-layout">
                        <div className="note-type-col">
                          <span className="note-type-icon">--</span>
                          <span className="page-label text-[10px] font-semibold uppercase tracking-wider">
                            {assetKindLabel(asset)}
                          </span>
                        </div>
                        <div className="note-body">
                          <span className="note-title text-lg font-bold text-[var(--page-text)] transition-colors">
                            {asset.name}
                          </span>
                          <span className="note-excerpt text-sm text-[var(--page-text-secondary)] leading-relaxed line-clamp-2">
                            Open with a lightweight browser-native preview
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
