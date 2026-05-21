import { ArrowLeft, ExternalLink, FolderKanban } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { isExternalProjectUrl } from '@/config/projectLinks'
import { frontendProjects } from '@/data/projects'
import '@/styles/pages/_theme-atmosphere.css'

function formatTags(tags: string[]): string {
  return tags.map((tag) => `[${tag}]`).join(' ')
}

export function Projects() {
  const navigate = useNavigate()

  const handleProjectNavigate = (url: string) => {
    if (isExternalProjectUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }

    navigate(url)
  }

  return (
    <div data-page="projects" className="page-root min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="term-command-output font-mono text-sm leading-7 text-[var(--page-text)]"
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
            <div className="term-output-line grid grid-cols-[9rem_9rem_8rem_12rem_minmax(0,1fr)_8rem] gap-3 font-semibold">
              <span>TYPE</span>
              <span>UPDATED</span>
              <span>STATUS</span>
              <span>STACK</span>
              <span>NAME</span>
              <span>LINK</span>
            </div>
            {frontendProjects.map((project) => {
              const hasExternalLink = isExternalProjectUrl(project.url)
              const isClickable = project.url !== '#'

              return (
                <button
                  key={project.id}
                  type="button"
                  className={`term-output-line grid grid-cols-[9rem_9rem_8rem_12rem_minmax(0,1fr)_8rem] gap-3 rounded px-1 -mx-1 text-left transition-colors ${
                    isClickable ? 'cursor-pointer hover:bg-[var(--glass-highlight)]' : 'cursor-default opacity-60'
                  }`}
                  disabled={!isClickable}
                  onClick={() => isClickable && handleProjectNavigate(project.url)}
                >
                  <span className="whitespace-nowrap">frontend-app</span>
                  <span className="whitespace-nowrap">{project.lastUpdate}</span>
                  <span className="whitespace-nowrap">{project.status.toUpperCase()}</span>
                  <span className="truncate">{project.stack}</span>
                  <span className="truncate">{project.name}</span>
                  <span className="flex items-center gap-1 whitespace-nowrap">
                    {hasExternalLink ? (
                      <>
                        <ExternalLink className="h-3.5 w-3.5" />
                        external
                      </>
                    ) : isClickable ? 'internal' : '--'}
                  </span>
                </button>
              )
            })}
            <div className="term-output-line mt-4"># tags</div>
            {frontendProjects.map((project) => (
              <div key={`${project.id}-tags`} className="term-output-line text-[var(--page-text-muted)]">
                <span className="inline-block min-w-[18ch]">{project.name}</span>
                <span>{formatTags(project.tags)}</span>
              </div>
            ))}
            <div className="term-cursor-line">$ _</div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
