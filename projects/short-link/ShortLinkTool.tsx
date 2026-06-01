import { ArrowLeft, Copy, FileAudio, FileText, FileVideo, Image, Link2, Trash2, Upload } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import './short-link.css'

type ShortLinkKind = 'text' | 'image' | 'audio' | 'video' | 'file'

interface ShortLinkRecord {
  id: string
  kind: ShortLinkKind
  name: string
  mimeType: string
  size: number
  createdAt: string
  payload: string
}

const STORAGE_PREFIX = 'owltree:tools:short-link:'
const STORAGE_INDEX_KEY = `${STORAGE_PREFIX}index`
const MAX_STORED_CHARACTERS = 4_200_000

function isStorageAvailable(): boolean {
  try {
    const key = `${STORAGE_PREFIX}probe`
    window.localStorage.setItem(key, '1')
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

function createId(): string {
  const randomValues = new Uint8Array(4)
  window.crypto.getRandomValues(randomValues)
  const randomPart = Array.from(randomValues, (value) => value.toString(36).padStart(2, '0')).join('')
  return `${Date.now().toString(36)}${randomPart}`.slice(0, 14)
}

function getRecordKey(id: string): string {
  return `${STORAGE_PREFIX}${id}`
}

function readIndex(): string[] {
  const rawIndex = window.localStorage.getItem(STORAGE_INDEX_KEY)
  if (!rawIndex) {
    return []
  }

  try {
    const parsed = JSON.parse(rawIndex) as unknown
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string') : []
  } catch {
    return []
  }
}

function writeIndex(ids: string[]): void {
  window.localStorage.setItem(STORAGE_INDEX_KEY, JSON.stringify(ids.slice(0, 24)))
}

function saveRecord(record: ShortLinkRecord): void {
  const serialized = JSON.stringify(record)
  if (serialized.length > MAX_STORED_CHARACTERS) {
    throw new Error('Payload is too large for browser storage.')
  }

  window.localStorage.setItem(getRecordKey(record.id), serialized)
  writeIndex([record.id, ...readIndex().filter((id) => id !== record.id)])
}

function readRecord(id: string): ShortLinkRecord | null {
  const rawRecord = window.localStorage.getItem(getRecordKey(id))
  if (!rawRecord) {
    return null
  }

  try {
    return JSON.parse(rawRecord) as ShortLinkRecord
  } catch {
    return null
  }
}

function deleteRecord(id: string): void {
  window.localStorage.removeItem(getRecordKey(id))
  writeIndex(readIndex().filter((storedId) => storedId !== id))
}

function readRecentRecords(): ShortLinkRecord[] {
  return readIndex()
    .map((id) => readRecord(id))
    .filter((record): record is ShortLinkRecord => record !== null)
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Unable to read selected file.'))
    reader.readAsDataURL(file)
  })
}

function getFileKind(file: File): ShortLinkKind {
  if (file.type.startsWith('image/')) {
    return 'image'
  }

  if (file.type.startsWith('audio/')) {
    return 'audio'
  }

  if (file.type.startsWith('video/')) {
    return 'video'
  }

  return 'file'
}

function formatBytes(size: number): string {
  if (size <= 0) {
    return '0 B'
  }

  const units = ['B', 'KB', 'MB', 'GB']
  const unitIndex = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1)
  const value = size / (1024 ** unitIndex)
  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`
}

function buildShortUrl(id: string): string {
  return `${window.location.origin}${window.location.pathname}#/tools/short-link/${id}`
}

async function writeClipboard(value: string): Promise<void> {
  if (!window.navigator.clipboard?.writeText) {
    throw new Error('clipboard unavailable')
  }

  await window.navigator.clipboard.writeText(value)
}

function IconForKind({ kind }: { kind: ShortLinkKind }) {
  if (kind === 'image') {
    return <Image className="h-4 w-4" />
  }

  if (kind === 'audio') {
    return <FileAudio className="h-4 w-4" />
  }

  if (kind === 'video') {
    return <FileVideo className="h-4 w-4" />
  }

  return <FileText className="h-4 w-4" />
}

function Preview({ record }: { record: ShortLinkRecord }) {
  if (record.kind === 'image') {
    return <img className="short-link-preview-image" src={record.payload} alt={record.name} />
  }

  if (record.kind === 'audio') {
    return <audio className="short-link-preview-media" controls src={record.payload} />
  }

  if (record.kind === 'video') {
    return <video className="short-link-preview-media" controls src={record.payload} />
  }

  if (record.kind === 'file') {
    return (
      <a className="short-link-download" href={record.payload} download={record.name}>
        download {record.name}
      </a>
    )
  }

  return <pre className="short-link-preview-text">{record.payload}</pre>
}

export function ShortLinkTool() {
  const navigate = useNavigate()
  const { linkId } = useParams()
  const [textValue, setTextValue] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [latestRecord, setLatestRecord] = useState<ShortLinkRecord | null>(null)
  const [viewRecord, setViewRecord] = useState<ShortLinkRecord | null>(null)
  const [recentRecords, setRecentRecords] = useState<ShortLinkRecord[]>([])
  const [status, setStatus] = useState('')
  const [isWorking, setIsWorking] = useState(false)
  const storageReady = useMemo(() => isStorageAvailable(), [])

  useEffect(() => {
    if (!storageReady) {
      setStatus('localStorage unavailable')
      return
    }

    setRecentRecords(readRecentRecords())
    setViewRecord(linkId ? readRecord(linkId) : null)
  }, [linkId, storageReady])

  const generatedUrl = latestRecord ? buildShortUrl(latestRecord.id) : ''

  const createTextLink = () => {
    const value = textValue.trim()
    if (!value) {
      setStatus('empty text')
      return
    }

    try {
      const record: ShortLinkRecord = {
        id: createId(),
        kind: 'text',
        name: 'text-snippet.txt',
        mimeType: 'text/plain',
        size: new Blob([value]).size,
        createdAt: new Date().toISOString(),
        payload: value,
      }
      saveRecord(record)
      setLatestRecord(record)
      setRecentRecords(readRecentRecords())
      setStatus('created')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'unable to create link')
    }
  }

  const createFileLink = async () => {
    if (!selectedFile) {
      setStatus('no file selected')
      return
    }

    setIsWorking(true)
    setStatus('reading file...')
    try {
      const payload = await fileToDataUrl(selectedFile)
      const record: ShortLinkRecord = {
        id: createId(),
        kind: getFileKind(selectedFile),
        name: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream',
        size: selectedFile.size,
        createdAt: new Date().toISOString(),
        payload,
      }
      saveRecord(record)
      setLatestRecord(record)
      setRecentRecords(readRecentRecords())
      setStatus('created')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'unable to create link')
    } finally {
      setIsWorking(false)
    }
  }

  const copyGeneratedUrl = async () => {
    if (!generatedUrl) {
      return
    }

    try {
      await writeClipboard(generatedUrl)
      setStatus('copied')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'copy failed')
    }
  }

  const copyRecordUrl = async (recordId: string) => {
    try {
      await writeClipboard(buildShortUrl(recordId))
      setStatus('copied')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'copy failed')
    }
  }

  const removeRecord = (id: string) => {
    deleteRecord(id)
    setRecentRecords(readRecentRecords())
    if (latestRecord?.id === id) {
      setLatestRecord(null)
    }
    if (linkId === id) {
      navigate('/tools/short-link')
    }
  }

  return (
    <div className="short-link-shell">
      <div className="short-link-toolbar">
        <button type="button" className="page-back-btn inline-flex items-center gap-1 px-2 py-1 text-xs transition-all" onClick={() => navigate('/tools')}>
          <ArrowLeft className="h-3 w-3" />
          cd ..
        </button>
        <span className="short-link-command">$ {linkId ? `cat ~/tools/short-link/${linkId}` : './short-link'}</span>
        <span className="short-link-status" role="status">$ status: {status || (linkId ? 'view' : 'idle')}</span>
      </div>

      {linkId ? (
        <section className="short-link-panel">
          {viewRecord ? (
            <>
              <div className="short-link-record-head">
                <span className="short-link-kind"><IconForKind kind={viewRecord.kind} /> {viewRecord.kind}</span>
                <span>{formatBytes(viewRecord.size)}</span>
                <span>{viewRecord.createdAt.slice(0, 10)}</span>
              </div>
              <Preview record={viewRecord} />
              <div className="short-link-actions">
                <button type="button" className="notes-action-btn" onClick={() => void copyRecordUrl(viewRecord.id)}>
                  <Copy className="h-3.5 w-3.5" />
                  copy url
                </button>
                <button type="button" className="notes-action-btn is-danger" onClick={() => removeRecord(viewRecord.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  rm
                </button>
              </div>
            </>
          ) : (
            <div className="terminal-empty-state" role="status">
              <span className="terminal-empty-command">$ echo "link not found"</span>
              <span>missing local record: {linkId}</span>
              <button type="button" className="notes-action-btn" onClick={() => navigate('/tools/short-link')}>
                create new link
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="short-link-grid">
            <div className="short-link-panel">
              <div className="short-link-panel-title">
                <Link2 className="h-4 w-4" />
                stdin:text
              </div>
              <textarea
                className="short-link-textarea"
                value={textValue}
                onChange={(event) => setTextValue(event.target.value)}
                rows={8}
                aria-label="Text to shorten"
                placeholder="paste text..."
              />
              <button type="button" className="notes-action-btn" disabled={!storageReady} onClick={createTextLink}>
                <Link2 className="h-3.5 w-3.5" />
                link text
              </button>
            </div>

            <div className="short-link-panel">
              <div className="short-link-panel-title">
                <Upload className="h-4 w-4" />
                stdin:media
              </div>
              <label className="short-link-file-drop">
                <input
                  className="short-link-file-input"
                  type="file"
                  accept="image/*,audio/*,video/*"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                  aria-label="Media file to shorten"
                />
                <span>{selectedFile ? selectedFile.name : 'select image / audio / video'}</span>
                <small>{selectedFile ? `${selectedFile.type || 'file'} · ${formatBytes(selectedFile.size)}` : 'local browser storage'}</small>
              </label>
              <button type="button" className="notes-action-btn" disabled={!storageReady || isWorking} onClick={() => void createFileLink()}>
                <Link2 className="h-3.5 w-3.5" />
                link media
              </button>
            </div>
          </section>

          {generatedUrl ? (
            <section className="short-link-result" aria-live="polite">
              <div className="short-link-generated">
                <code title={generatedUrl}>{generatedUrl}</code>
                <button type="button" className="notes-action-btn" onClick={() => void copyGeneratedUrl()}>
                  <Copy className="h-3.5 w-3.5" />
                  copy
                </button>
              </div>
            </section>
          ) : null}

          <section className="short-link-panel">
            <div className="short-link-panel-title">recent</div>
            {recentRecords.length === 0 ? (
              <div className="terminal-empty-state" role="status">
                <span className="terminal-empty-command">$ echo "no links"</span>
              </div>
            ) : (
              <div className="short-link-history">
                {recentRecords.map((record) => (
                  <button key={record.id} type="button" className="short-link-history-row" onClick={() => navigate(`/tools/short-link/${record.id}`)}>
                    <span className="short-link-kind"><IconForKind kind={record.kind} /> {record.kind}</span>
                    <span title={record.name}>{record.name}</span>
                    <span>{formatBytes(record.size)}</span>
                    <span>{record.createdAt.slice(0, 10)}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
