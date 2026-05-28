import { mkdir, readFile, readdir, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

import { validateNoteMarkdownPath } from './src/lib/notePaths'

const notesRoot = fileURLToPath(new URL('./src/content/notes', import.meta.url))
const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const generatedMetadataFile = fileURLToPath(new URL('./src/data/contentMetadata.generated.ts', import.meta.url))
const rawEndpoint = '/__owltree/notes/raw'
const projectMetadataSources: Record<string, string[]> = {
  'owltree-portal': ['src', 'public', 'index.html', 'package.json', 'vite.config.ts'],
}

function sendJson(response: import('node:http').ServerResponse, status: number, payload: unknown): void {
  response.statusCode = status
  response.setHeader('content-type', 'application/json; charset=utf-8')
  response.end(JSON.stringify(payload))
}

function resolveNoteFile(rawPath: string): { ok: true; relativePath: string; absolutePath: string } | { ok: false; error: string } {
  const validation = validateNoteMarkdownPath(rawPath)
  if (!validation.ok) {
    return { ok: false, error: validation.error ?? 'Invalid note path.' }
  }

  const absolutePath = path.resolve(notesRoot, validation.path)
  const relativeToRoot = path.relative(notesRoot, absolutePath)

  if (relativeToRoot.startsWith('..') || path.isAbsolute(relativeToRoot)) {
    return { ok: false, error: 'Path must stay inside src/content/notes.' }
  }

  return { ok: true, relativePath: validation.path, absolutePath }
}

async function readRequestBody(request: import('node:http').IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []

  for await (const chunk of request) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }

  return Buffer.concat(chunks).toString('utf8')
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join('/')
}

async function collectFiles(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      return collectFiles(absolutePath)
    }

    return [absolutePath]
  }))

  return files.flat()
}

async function newestMtime(paths: string[]): Promise<string | null> {
  const files = (
    await Promise.all(paths.map(async (relativePath) => {
      const absolutePath = path.resolve(projectRoot, relativePath)
      try {
        const current = await stat(absolutePath)
        if (current.isDirectory()) {
          return collectFiles(absolutePath)
        }

        if (current.isFile()) {
          return [absolutePath]
        }
      } catch {
        return []
      }

      return []
    }))
  ).flat()

  let newest = 0
  for (const file of files) {
    if (file === generatedMetadataFile || file.includes(`${path.sep}.`)) {
      continue
    }

    const current = await stat(file)
    newest = Math.max(newest, current.mtimeMs)
  }

  return newest > 0 ? new Date(newest).toISOString() : null
}

async function buildNoteUpdatedAt(): Promise<Record<string, string | null>> {
  const files = await collectFiles(notesRoot).catch(() => [])
  const entries = await Promise.all(files
    .filter((file) => file.endsWith('.md'))
    .map(async (file) => {
      const current = await stat(file)
      const relativePath = toPosixPath(path.relative(notesRoot, file)).replace(/\.md$/, '')
      return [relativePath, current.mtime.toISOString()] as const
    }))

  return Object.fromEntries(entries.sort(([left], [right]) => left.localeCompare(right)))
}

async function buildProjectUpdatedAt(): Promise<Record<string, string | null>> {
  const entries = await Promise.all(Object.entries(projectMetadataSources).map(async ([id, sourcePaths]) => {
    return [id, await newestMtime(sourcePaths)] as const
  }))

  return Object.fromEntries(entries.sort(([left], [right]) => left.localeCompare(right)))
}

function serializeRecord(name: string, value: Record<string, string | null>): string {
  const lines = Object.entries(value).map(([key, item]) => {
    return `  ${JSON.stringify(key)}: ${item === null ? 'null' : JSON.stringify(item)},`
  })

  return `export const ${name}: Record<string, string | null> = {\n${lines.join('\n')}\n}\n`
}

async function refreshContentMetadata(): Promise<void> {
  const content = [
    serializeRecord('noteUpdatedAt', await buildNoteUpdatedAt()),
    serializeRecord('projectUpdatedAt', await buildProjectUpdatedAt()),
  ].join('\n')

  const previous = await readFile(generatedMetadataFile, 'utf8').catch(() => '')
  if (previous === content) {
    return
  }

  await writeFile(generatedMetadataFile, content, 'utf8')
}

export function owltreeNotesPlugin(): Plugin {
  return {
    name: 'owltree-notes-dev-api',
    async buildStart() {
      await refreshContentMetadata()
    },
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        if (!request.url?.startsWith(rawEndpoint)) {
          next()
          return
        }

        if (request.method === 'GET') {
          const url = new URL(request.url, 'http://localhost')
          const resolved = resolveNoteFile(url.searchParams.get('path') ?? '')

          if (!resolved.ok) {
            sendJson(response, 400, { error: resolved.error })
            return
          }

          try {
            const content = await readFile(resolved.absolutePath, 'utf8')
            sendJson(response, 200, { path: resolved.relativePath, content })
          } catch {
            sendJson(response, 404, { error: 'Note file was not found.' })
          }
          return
        }

        if (request.method === 'PUT') {
          try {
            const payload = JSON.parse(await readRequestBody(request)) as { path?: unknown; content?: unknown }
            const resolved = resolveNoteFile(typeof payload.path === 'string' ? payload.path : '')

            if (!resolved.ok) {
              sendJson(response, 400, { error: resolved.error })
              return
            }

            if (typeof payload.content !== 'string') {
              sendJson(response, 400, { error: 'Content must be a string.' })
              return
            }

            await mkdir(path.dirname(resolved.absolutePath), { recursive: true })
            await writeFile(resolved.absolutePath, payload.content, 'utf8')
            await refreshContentMetadata()
            server.ws.send({ type: 'full-reload' })
            sendJson(response, 200, { path: resolved.relativePath })
          } catch {
            sendJson(response, 400, { error: 'Invalid JSON payload.' })
          }
          return
        }

        response.statusCode = 405
        response.setHeader('allow', 'GET, PUT')
        response.end()
      })
    },
  }
}
