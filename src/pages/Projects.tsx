import { ArrowLeft, ExternalLink, FolderKanban } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { isExternalProjectUrl } from '@/config/projectLinks'
import { frontendProjects, type Project } from '@/data/projects'
import '@/styles/pages/notes.css'
import '@/styles/pages/_theme-atmosphere.css'

function formatTags(tags: string[]): string {
  return tags.map((tag) => `[${tag}]`).join(' ')
}

function formatUpdatedAt(value: string | null): string {
  if (!value) {
    return '--'
  }

  return value.slice(0, 10)
}

type ProjectSortKey = 'updated' | 'title' | 'stack'
type ProjectSortDirection = 'asc' | 'desc'

function compareProjects(left: Project, right: Project, key: ProjectSortKey, direction: ProjectSortDirection): number {
  const order = direction === 'asc' ? 1 : -1

  if (key === 'updated') {
    return order * (left.updatedAt ?? '').localeCompare(right.updatedAt ?? '')
  }

  if (key === 'stack') {
    return order * left.stack.localeCompare(right.stack)
  }

  return order * left.name.localeCompare(right.name)
}

export function Projects() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const sortKey = (searchParams.get('sort') as ProjectSortKey | null) ?? 'updated'
  const sortDirection = (searchParams.get('order') as ProjectSortDirection | null) ?? 'desc'
  const sortedProjects = useMemo(() => {
    return [...frontendProjects].sort((left, right) => compareProjects(left, right, sortKey, sortDirection))
  }, [sortDirection, sortKey])

  const handleProjectNavigate = (url: string) => {
    if (isExternalProjectUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }

    navigate(url)
  }

  const applySort = (nextKey: ProjectSortKey) => {
    const nextDirection: ProjectSortDirection =
      nextKey === sortKey
        ? (sortDirection === 'desc' ? 'asc' : 'desc')
        : 'desc'

    const nextParams = new URLSearchParams(searchParams)
    nextParams.set('sort', nextKey)
    nextParams.set('order', nextDirection)
    setSearchParams(nextParams)
  }

  return (
    <div data-page="projects" className="page-root min-h-screen relative">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="term-command-output font-mono text-sm leading-7 text-[var(--page-text)] note-shell"
          >
            <div className="term-output-line flex items-center gap-2 mb-2">
              <a
                href="#/"
                className="page-back-btn inline-flex items-center gap-1 px-2 py-1 text-xs transition-all"
              >
                <ArrowLeft className="w-3 h-3" />
                cd ..
              </a>
            </div>
            <div className="term-output-line flex items-center gap-2">
              <FolderKanban className="h-4 w-4" />
              <span>$ ls -la ~/projects/frontend/</span>
            </div>
            <div className="notes-terminal-sortbar">
              <button type="button" className="notes-sort-chip" onClick={() => applySort('updated')}>
                updated {sortKey === 'updated' ? `[${sortDirection}]` : ''}
              </button>
              <button type="button" className="notes-sort-chip" onClick={() => applySort('title')}>
                title {sortKey === 'title' ? `[${sortDirection}]` : ''}
              </button>
              <button type="button" className="notes-sort-chip" onClick={() => applySort('stack')}>
                stack {sortKey === 'stack' ? `[${sortDirection}]` : ''}
              </button>
            </div>
            <div className="term-output-line projects-terminal-row projects-terminal-row-head font-semibold">
              <span className="projects-cell projects-cell-name">NAME</span>
              <span className="projects-cell projects-cell-updated">UPDATED</span>
              <span className="projects-cell projects-cell-status">STATUS</span>
              <span className="projects-cell projects-cell-stack">STACK</span>
              <span className="projects-cell projects-cell-type">TYPE</span>
              <span className="projects-cell projects-cell-link">LINK</span>
              <span className="projects-cell projects-cell-tags">TAGS</span>
            </div>
            {sortedProjects.length === 0 ? (
              <div className="terminal-empty-state" role="status">
                <span className="terminal-empty-command">$ echo "no visible frontend projects"</span>
                <span>Project rows are empty until a visible project is configured.</span>
              </div>
            ) : null}
            {sortedProjects.map((project) => {
              const hasExternalLink = isExternalProjectUrl(project.url)
              const isClickable = project.url !== '#'

              return (
                <button
                  key={project.id}
                  type="button"
                  className={`term-output-line notes-terminal-row projects-terminal-row rounded px-1 -mx-1 text-left transition-colors ${
                    isClickable ? 'cursor-pointer hover:bg-[var(--glass-highlight)]' : 'cursor-default opacity-60'
                  }`}
                  disabled={!isClickable}
                  onClick={() => isClickable && handleProjectNavigate(project.url)}
                >
                  <span className="notes-cell notes-cell-title projects-cell projects-cell-name" title={project.name}>{project.name}</span>
                  <span className="notes-cell notes-cell-date projects-cell projects-cell-updated">{formatUpdatedAt(project.updatedAt)}</span>
                  <span className="notes-cell notes-cell-kind projects-cell projects-cell-status">{project.status.toUpperCase()}</span>
                  <span className="notes-cell notes-cell-kind projects-cell projects-cell-stack" title={project.stack}>{project.stack}</span>
                  <span className="notes-cell notes-cell-perms projects-cell projects-cell-type">frontend-app</span>
                  <span className="notes-cell notes-cell-kind projects-cell projects-cell-link flex items-center gap-1 whitespace-nowrap" title={hasExternalLink ? 'external' : isClickable ? 'internal' : '--'}>
                    {hasExternalLink ? (
                      <>
                        <ExternalLink className="h-3.5 w-3.5" />
                        external
                      </>
                    ) : isClickable ? 'internal' : '--'}
                  </span>
                  <span className="notes-cell projects-cell projects-cell-tags" title={formatTags(project.tags)}>{formatTags(project.tags)}</span>
                </button>
              )
            })}
            <div className="term-cursor-line">$ _</div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
