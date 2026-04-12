import { ACHIEVEMENTS } from '@/game/data/achievements'
import { ENDINGS } from '@/game/data/endings'
import type { GameState } from '@/game/types'

interface VNAchievementsProps {
  achievements: GameState['achievements']
  onClose?: () => void
}

export function VNAchievements({ achievements, onClose }: VNAchievementsProps) {
  const unlockedSet = new Set(achievements.unlocked)
  const endingsSeenSet = new Set(achievements.endingsSeen)

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="vn-dialogue max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-[var(--vn-name)]">成就与结局</h2>
          {onClose && (
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
              ✕
            </button>
          )}
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-[var(--vn-accent)]">成就</h3>
          <div className="grid grid-cols-2 gap-3">
            {ACHIEVEMENTS.map(achievement => {
              const isUnlocked = unlockedSet.has(achievement.id)
              return (
                <div
                  key={achievement.id}
                  className={`p-3 rounded-lg border ${
                    isUnlocked
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{isUnlocked ? achievement.icon : '🔒'}</span>
                    <div>
                      <div className={`font-medium ${isUnlocked ? 'text-yellow-400' : 'text-slate-500'}`}>
                        {isUnlocked ? achievement.name : '???'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {isUnlocked ? achievement.description : '未解锁'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Endings */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-[var(--vn-accent)]">结局</h3>
          <div className="grid grid-cols-2 gap-3">
            {ENDINGS.map(ending => {
              const isSeen = endingsSeenSet.has(ending.id)
              return (
                <div
                  key={ending.id}
                  className={`p-3 rounded-lg border ${
                    isSeen
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-slate-800/50 border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{isSeen ? ending.icon : '❓'}</span>
                    <div>
                      <div className={`font-medium ${isSeen ? 'text-purple-400' : 'text-slate-500'}`}>
                        {isSeen ? ending.name : '???'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {isSeen ? ending.description : '未发现'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
