import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Gamepad2 } from 'lucide-react'
import { motion } from 'framer-motion'

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
    id: 'moon-throw',
    name: '月抛模拟器',
    description: '关于选择与后果的实验性互动叙事游戏。管理生理与心理压力，在随机生成的伙伴中做出选择。',
    url: '/moon-throw',
    icon: '🌙',
    featured: true,
    tags: ['互动叙事', '教育', '实验性'],
  },
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

export function Games() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <a
              href="#/"
              className="vn-button p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="vn-window px-5 py-4">
              <p className="vn-meta mb-1">chapter select</p>
              <h1 className="text-3xl font-bold text-[rgb(71,48,88)] flex items-center gap-3">
                <Gamepad2 className="w-8 h-8 text-coral" />
                游戏
              </h1>
              <p className="text-[rgb(128,99,128)] text-sm mt-1">像主菜单里的章节路线一样浏览每一个作品入口</p>
            </div>
          </div>

          <div className="space-y-4">
            {gamesData.map((game) => (
              <motion.article
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="vn-window group p-6 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(196,154,182,0.2)]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="vn-titlebar">route / {game.id}</div>
                  {game.featured && <span className="vn-chip">main heroine</span>}
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1rem] border border-white/80 bg-[rgba(255,244,249,0.88)] text-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">{game.icon}</div>
                  <div className="vn-rail flex-1 min-w-0 pl-5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[rgb(71,48,88)] group-hover:text-coral transition-colors">
                        {game.name}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[rgb(109,84,115)] line-clamp-2">
                      {game.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {game.tags.map((tag) => (
                        <span
                          key={tag}
                          className="vn-chip"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
