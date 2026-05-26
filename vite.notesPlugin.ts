import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Plugin } from 'vite'

import { validateNoteMarkdownPath } from './src/lib/notePaths'

const notesRoot = fileURLToPath(new URL('./src/content/notes', import.meta.url))
const rawEndpoint = '/__owltree/notes/raw'

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

export function owltreeNotesPlugin(): Plugin {
  return {
    name: 'owltree-notes-dev-api',
    apply: 'serve',
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
