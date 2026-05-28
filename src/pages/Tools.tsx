import { ArrowLeft, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { tools } from '@/content/tools'
import '@/styles/pages/notes.css'
import '@/styles/pages/tools.css'
import '@/styles/pages/_theme-atmosphere.css'

function formatTags(tags: readonly string[]): string {
  return tags.map((tag) => `[${tag}]`).join(' ')
}

export function Tools() {
  const navigate = useNavigate()

  return (
    <div data-page="tools" className="page-root min-h-screen relative">
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
            <div className="tools-terminal-header">
              <span className="notes-terminal-prompt inline-flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                $ ls -la ~/tools/
              </span>
              <span className="notes-terminal-count">{tools.length} entries</span>
            </div>
            <div className="term-output-line tools-terminal-row tools-terminal-row-head font-semibold">
              <span className="tools-cell tools-cell-name">NAME</span>
              <span className="tools-cell tools-cell-command">COMMAND</span>
              <span className="tools-cell tools-cell-status">STATUS</span>
              <span className="tools-cell tools-cell-desc">DESC</span>
              <span className="tools-cell tools-cell-tags">TAGS</span>
            </div>
            {tools.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className="term-output-line tools-terminal-row rounded px-1 -mx-1 text-left transition-colors cursor-pointer hover:bg-[var(--glass-highlight)]"
                onClick={() => navigate(tool.route)}
              >
                <span className="tools-cell tools-cell-name" title={tool.title}>{tool.name}</span>
                <span className="tools-cell tools-cell-command">{tool.command}</span>
                <span className="tools-cell tools-cell-status">{tool.status}</span>
                <span className="tools-cell tools-cell-desc" title={tool.description}>{tool.description}</span>
                <span className="tools-cell tools-cell-tags" title={formatTags(tool.tags)}>{formatTags(tool.tags)}</span>
              </button>
            ))}
            <div className="term-cursor-line">$ _</div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
