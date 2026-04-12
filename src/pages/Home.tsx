import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Hero } from '@/components/portal/Hero'
import { CategoryGrid } from '@/components/portal/CategoryGrid'
import { Footer } from '@/components/layout/Footer'
import { TerminalHome } from '@/components/portal/TerminalHome'
import { useTheme } from '@/contexts/ThemeContext'

function DefaultHome() {
  return (
    <div className="relative min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <ParticleBackground />
      
      <main className="relative z-10">
        <Hero />

        <div className="mx-auto max-w-6xl px-6 pb-32">
          <CategoryGrid />
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export function Home() {
  const { theme } = useTheme()

  if (theme === 'terminal') {
    return <TerminalHome />
  }

  return <DefaultHome />
}
