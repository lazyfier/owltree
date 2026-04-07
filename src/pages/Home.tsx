import { Hero } from '@/components/portal/Hero'
import { ProfileCard } from '@/components/portal/ProfileCard'
import { ProjectGrid } from '@/components/portal/ProjectGrid'
import { PixelDivider } from '@/components/ui/PixelDivider'
import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'

export function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-12">
        <Hero />
        <div className="w-full max-w-2xl">
          <PixelDivider />
          <ProfileCard />
          <PixelDivider />
          <ProjectGrid />
        </div>
      </main>
      <Footer />
    </div>
  )
}
