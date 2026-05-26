import { ArrowLeft, Calendar, Clock, Download, Edit3, FileText, Save, X } from 'lucide-react'
import { Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Footer } from '@/components/layout/Footer'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { MarkdownDocument } from '@/components/notes/MarkdownDocument'
import {
  getNoteAssetBySlug,
  getNoteBacklinks,
  getNoteBySlug,
  resolveNoteMarkdownLink,
  type NoteAsset,
  type NoteDocument,
} from '@/data/notes'
import { slugToMarkdownPath } from '@/lib/notePaths'
import '@/styles/pages/notes.css'
import '@/styles/pages/_theme-atmosphere.css'

function formatUpdatedAt(value: string | null): string {
  if (!value) {
    return '--'
  }

  return value.slice(0, 10)
}

const canEditNotes = import.meta.env.DEV

function resolveInternalNoteHref(fromSlug: string, href: string): string | null {
  const targetSlug = resolveNoteMarkdownLink(fromSlug, href)
  return targetSlug ? `#/notes/${targetSlug}` : null
}

async function fetchRawNote(slug: string): Promise<string> {
  const response = await fetch(`/__owltree/notes/raw?path=${encodeURIComponent(slugToMarkdownPath(slug))}`)

  if (!response.ok) {
    throw new Error('Unable to load note source.')
  }

  const payload = await response.json() as { content: string }
  return payload.content
}

async function saveRawNote(slug: string, content: string): Promise<void> {
  const response = await fetch('/__owltree/notes/raw', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ path: slugToMarkdownPath(slug), content }),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: 'Unable to save note.' })) as { error?: string }
    throw new Error(payload.error ?? 'Unable to save note.')
  }
}

function NoteEditor({ note, onCancel }: { note: NoteDocument; onCancel: () => void }) {
  const [source, setSource] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'saved' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isActive = true
    setStatus('loading')
    fetchRawNote(note.slug)
      .then((content) => {
        if (!isActive) {
          return
        }

        setSource(content)
        setStatus('idle')
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return
        }

        setMessage(error instanceof Error ? error.message : 'Unable to load note source.')
        setStatus('error')
      })

    return () => {
      isActive = false
    }
  }, [note.slug])

  const saveNote = async () => {
    setStatus('saving')
    setMessage('')

    try {
      await saveRawNote(note.slug, source)
      setStatus('saved')
      setMessage('Saved. Vite will reload the note index.')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to save note.')
    }
  }

  return (
    <div className="note-editor">
      <div className="note-editor-toolbar">
        <span>$ vim ~/notes/{note.slug}.md</span>
        <div className="note-editor-actions">
          <button type="button" className="notes-action-btn" onClick={saveNote} disabled={status === 'loading' || status === 'saving'}>
            <Save className="h-3.5 w-3.5" />
            save
          </button>
          <button type="button" className="notes-action-btn" onClick={onCancel}>
            <X className="h-3.5 w-3.5" />
            cancel
          </button>
        </div>
      </div>
      <textarea
        className="note-editor-textarea"
        value={source}
        onChange={(event) => setSource(event.target.value)}
        spellCheck={false}
        disabled={status === 'loading'}
      />
      {message ? <p className={`note-editor-status is-${status}`}>{message}</p> : null}
    </div>
  )
}

function FilePreview({ asset }: { asset: NoteAsset }) {
  if (asset.previewKind === 'image') {
    return <img className="note-file-image" src={asset.url} alt={asset.name} />
  }

  if (asset.previewKind === 'pdf') {
    return <iframe className="note-file-frame" title={asset.name} src={asset.url} />
  }

  if (asset.previewKind === 'audio') {
    return <audio className="note-file-media" controls src={asset.url} />
  }

  if (asset.previewKind === 'video') {
    return <video className="note-file-media" controls src={asset.url} />
  }

  if (asset.previewKind === 'text') {
    return <TextFilePreview asset={asset} />
  }

  return (
    <a className="note-download-link" href={asset.url} target="_blank" rel="noreferrer">
      <Download className="h-4 w-4" />
      open or download {asset.name}
    </a>
  )
}

function TextFilePreview({ asset }: { asset: NoteAsset }) {
  const [content, setContent] = useState('Loading...')

  useEffect(() => {
    let isActive = true

    fetch(asset.url)
      .then((response) => response.text())
      .then((text) => {
        if (isActive) {
          setContent(text)
        }
      })
      .catch(() => {
        if (isActive) {
          setContent('Unable to load text preview.')
        }
      })

    return () => {
      isActive = false
    }
  }, [asset.url])

  return <pre className="note-file-text">{content}</pre>
}

export function NoteDetail() {
  const { '*': slug = '' } = useParams()
  const note = getNoteBySlug(slug)
  const asset = getNoteAssetBySlug(slug)
  const [isEditing, setIsEditing] = useState(false)
  const backlinks = useMemo(() => note ? getNoteBacklinks(note.slug) : [], [note])

  if (!note && !asset) {
    return <Navigate replace to="/notes" />
  }

  const title = note?.title ?? asset?.name ?? slug
  const summary = note?.summary ?? `Previewing ${asset?.relativePath ?? slug}`
  const command = note ? `$ cat ~/notes/${note.slug}.md` : `$ open ~/notes/${asset?.relativePath ?? slug}`

  return (
    <div data-page="notes" className="page-root min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="term-command-output note-detail-shell"
          >
            <div className="term-output-line flex items-center gap-2 mb-3">
              <a
                href="#/notes"
                className="page-back-btn inline-flex items-center gap-1 px-2 py-1 text-xs transition-all"
              >
                <ArrowLeft className="w-3 h-3" />
                cd ..
              </a>
            </div>

            <div className="note-detail-header">
              <div>
                <div className="note-detail-command">
                  <FileText className="h-4 w-4" />
                  <span>{command}</span>
                </div>
                <h1 className="note-detail-title">{title}</h1>
                <p className="note-detail-summary">{summary}</p>
              </div>

              <div className="note-detail-meta">
                {note ? (
                  <>
                    <span><Calendar className="h-3.5 w-3.5" /> {note.date}</span>
                    <span><Clock className="h-3.5 w-3.5" /> {formatUpdatedAt(note.updatedAt)}</span>
                    <span><Clock className="h-3.5 w-3.5" /> {note.readTime}</span>
                  </>
                ) : (
                  <span><FileText className="h-3.5 w-3.5" /> {asset?.previewKind}</span>
                )}
                {note && canEditNotes ? (
                  <button type="button" className="notes-action-btn" onClick={() => setIsEditing((value) => !value)}>
                    <Edit3 className="h-3.5 w-3.5" />
                    edit
                  </button>
                ) : null}
              </div>
            </div>

            {note ? (
              <div className="note-detail-tags">
                {note.tags.map((tag) => (
                  <span key={tag} className="note-detail-tag">[{tag}]</span>
                ))}
              </div>
            ) : null}

            <div className="note-detail-content-scroll">
              {note && isEditing ? (
                <NoteEditor note={note} onCancel={() => setIsEditing(false)} />
              ) : note ? (
                <MarkdownDocument
                  content={note.content}
                  currentSlug={note.slug}
                  resolveInternalHref={resolveInternalNoteHref}
                />
              ) : asset ? (
                <FilePreview asset={asset} />
              ) : null}
            </div>

            {note ? (
              <section className="note-backlinks" aria-labelledby="note-backlinks-title">
                <h2 id="note-backlinks-title">Backlinks</h2>
                {backlinks.length ? (
                  <div className="note-backlink-list">
                    {backlinks.map((backlink) => (
                      <a key={backlink.slug} className="note-backlink" href={`#/notes/${backlink.slug}`}>
                        <span>{backlink.title}</span>
                        <small>{backlink.slug}.md</small>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p>No backlinks yet.</p>
                )}
              </section>
            ) : null}

            <div className="term-cursor-line">$ _</div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
