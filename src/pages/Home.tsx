import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Hero } from '@/components/portal/Hero'
import { CategoryGrid } from '@/components/portal/CategoryGrid'
import { DailyTrendsPreview } from '@/components/portal/DailyTrendsPreview'
import { Footer } from '@/components/layout/Footer'

export function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_35%),radial-gradient(circle_at_top_right,rgba(220,107,141,0.14),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(187,123,197,0.12),transparent_24%)]" />
      <main className="relative z-10 flex flex-col items-center px-4 py-10 sm:py-14">
        <Hero />

        <div className="w-full max-w-5xl space-y-6">
          <CategoryGrid />
          <DailyTrendsPreview />
        </div>
      </main>
      <Footer />
    </div>
  )
}
