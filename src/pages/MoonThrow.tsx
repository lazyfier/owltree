import { GameContainer } from '@/components/moon-throw/GameContainer'
import '@/styles/game.css'

export function MoonThrow() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--vn-bg)' }}>
      <GameContainer />
    </div>
  )
}
