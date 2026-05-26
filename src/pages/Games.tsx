import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'
import '@/styles/pages/games.css'
import '@/styles/pages/_theme-atmosphere.css'
import { ArrowLeft, Gamepad2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface Game {
  id: string
  name: string
  description: string
  url: string
  icon: string
  featured: boolean
  tags: string[]
}

const gamesData: Game[] = [
  {
    id: 'coming-soon-1',
    name: '像素冒险',
    description: '即将推出的复古像素风格冒险游戏。探索、战斗、解谜。',
    url: '#',
    icon: '🎮',
    featured: false,
    tags: ['开发中'],
  },
  {
    id: 'coming-soon-2',
    name: '节奏大师',
    description: '音乐节奏游戏。跟随节拍，挑战极限。',
    url: '#',
    icon: '🎵',
    featured: false,
    tags: ['开发中'],
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.175, 0.885, 0.32, 1.275],
    },
  },
}

function getTerminalStatus(game: Game): 'RUNNING' | 'PLANNED' {
  return game.url === '#' ? 'PLANNED' : 'RUNNING'
}

function getTerminalProgress(game: Game): string {
  if (game.url === '#') {
    return '---'
  }

  return '██████░░░░ 63%'
}

export function Games() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  return (
    <div data-page="games" className="page-root min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl">
          {theme === 'terminal' ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="term-command-output"
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
              <div className="term-output-line">$ ps aux | grep game</div>
              <div className="term-output-line grid grid-cols-[5rem_7rem_minmax(0,1fr)_10rem_16rem] gap-4 font-semibold">
                <span>PID</span>
                <span>STATUS</span>
                <span>NAME</span>
                <span>PROGRESS</span>
                <span>TAGS</span>
              </div>
              {gamesData.map((game, index) => {
                const isAvailable = game.url !== '#'
                const pid = String(index + 1).padStart(3, '0')
                const displayName = game.featured ? `[FEATURED] ${game.name}` : game.name

                return (
                  <button
                    key={game.id}
                    type="button"
                    className={`term-output-line grid grid-cols-[5rem_7rem_minmax(0,1fr)_10rem_16rem] gap-4 text-left ${
                      isAvailable ? 'cursor-pointer hover:bg-[var(--glass-highlight)] rounded px-1 -mx-1 transition-colors' : 'opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => isAvailable && navigate(game.url)}
                    disabled={!isAvailable}
                  >
                    <span>{pid}</span>
                    <span>{getTerminalStatus(game)}</span>
                    <span>{displayName}</span>
                    <span>{getTerminalProgress(game)}</span>
                    <span>[{game.tags.join(' ')}]</span>
                  </button>
                )
              })}
              <div className="term-cursor-line">$ _</div>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-10"
              >
                <a
                  href="#/"
                  className="page-back-btn flex items-center justify-center w-11 h-11 text-[var(--page-text-secondary)] hover:text-[var(--games-accent)] transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </a>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--games-accent)] to-[var(--games-accent-light)] shadow-lg shadow-[var(--games-accent)]/30">
                      <Gamepad2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-[var(--page-text)]">游戏</h1>
                      <p className="text-sm text-[var(--page-text-muted)]">像主菜单里的章节路线一样浏览每一个作品入口</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="games-grid"
              >
                {gamesData.map((game) => {
                  const isAvailable = game.url !== '#'

                  return (
                    <motion.button
                      key={game.id}
                      variants={itemVariants}
                      type="button"
                      className={`page-card game-card group relative text-left ${
                        isAvailable ? 'cursor-pointer' : 'opacity-60 cursor-not-allowed'
                      }`}
                      onClick={() => isAvailable && navigate(game.url)}
                      disabled={!isAvailable}
                    >
                    <div className="page-accent-bar" />

                    {game.featured && (
                      <div className="page-badge absolute right-4 top-4 text-white text-xs font-semibold">
                        <Sparkles className="w-3 h-3" />
                        FEATURED
                      </div>
                    )}

                    <div className="game-card-inner">
                      <div className="game-icon-col page-header-icon">
                        {game.icon}
                      </div>

                      <div className="game-info">
                        <div className="game-info-label">
                          <span className="page-label text-xs font-medium text-[var(--page-text-muted)] uppercase tracking-wider">
                            route / {game.id}
                          </span>
                          {!isAvailable && <span className="page-label text-xs font-medium text-[var(--page-text-muted)]">即将推出</span>}
                        </div>
                        <h3 className="text-lg font-bold text-[var(--page-text)] group-hover:text-[var(--games-accent)] transition-colors">
                          {game.name}
                        </h3>
                        <p className="text-sm text-[var(--page-text-secondary)] leading-relaxed line-clamp-2">
                          {game.description}
                        </p>
                        <div className="game-tags">
                          {game.tags.map((tag) => (
                             <span
                               key={tag}
                               className="page-tag group-hover:bg-[var(--games-accent)]/10 group-hover:text-[var(--games-accent)] transition-colors"
                             >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    </motion.button>
                  )
                })}
              </motion.div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
