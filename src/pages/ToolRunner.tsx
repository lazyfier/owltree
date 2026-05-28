import { Navigate, useParams } from 'react-router-dom'
import { Footer } from '@/components/layout/Footer'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { tools } from '@/content/tools'
import '@/styles/pages/notes.css'
import '@/styles/pages/tools.css'
import '@/styles/pages/_theme-atmosphere.css'

export function ToolRunner() {
  const { toolId } = useParams()
  const tool = tools.find((candidate) => candidate.id === toolId)

  if (!tool) {
    return <Navigate replace to="/tools" />
  }

  const ToolComponent = tool.Component

  return (
    <div data-page="tools" className="page-root min-h-screen relative">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-5xl">
          <section className="term-command-output font-mono text-sm leading-7 text-[var(--page-text)] note-shell">
            <ToolComponent />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
