import { cp, mkdir, readdir, stat } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const repoRoot = process.cwd()
const notesTarget = path.resolve(repoRoot, 'src/content/notes')

function expandHome(value) {
  if (value === '~') {
    return process.env.HOME ?? value
  }

  if (value.startsWith('~/')) {
    return path.join(process.env.HOME ?? '', value.slice(2))
  }

  return value
}

function sourceDirectory() {
  const rawPath = process.argv[2] ?? process.env.OWLTREE_NOTES_SOURCE_DIR
  if (!rawPath) {
    throw new Error('Set OWLTREE_NOTES_SOURCE_DIR or pass a source directory argument.')
  }

  return path.resolve(expandHome(rawPath))
}

function shouldSkipPath(absolutePath) {
  return absolutePath
    .split(path.sep)
    .some((segment) => segment.startsWith('.') || segment === 'node_modules')
}

async function collectMarkdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(entries.map(async (entry) => {
    const absolutePath = path.join(directory, entry.name)
    if (shouldSkipPath(absolutePath)) {
      return []
    }

    if (entry.isDirectory()) {
      return collectMarkdownFiles(absolutePath)
    }

    return entry.isFile() && entry.name.endsWith('.md') ? [absolutePath] : []
  }))

  return files.flat()
}

const sourceRoot = sourceDirectory()
const sourceStat = await stat(sourceRoot).catch(() => null)

if (!sourceStat?.isDirectory()) {
  throw new Error(`Notes source is not a directory: ${sourceRoot}`)
}

const files = await collectMarkdownFiles(sourceRoot)
await mkdir(notesTarget, { recursive: true })

for (const file of files) {
  const relativePath = path.relative(sourceRoot, file)
  const targetPath = path.join(notesTarget, relativePath)
  await mkdir(path.dirname(targetPath), { recursive: true })
  await cp(file, targetPath)
}

console.log(`Synced ${files.length} markdown file${files.length === 1 ? '' : 's'} into ${path.relative(repoRoot, notesTarget)}`)
