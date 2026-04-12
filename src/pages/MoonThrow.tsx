import { GameContainer } from '@/components/moon-throw/GameContainer'
import '@/styles/game.css'
import { ArrowLeft } from 'lucide-react'

export function MoonThrow() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--vn-bg)' }}>
      <a href="#/" className="vn-back-btn">
        <ArrowLeft className="w-3 h-3" />
        cd ..
      </a>
      <GameContainer />
    </div>
  )
}
