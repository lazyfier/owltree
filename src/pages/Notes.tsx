import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, BookOpen, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

interface Note {
  id: string
  title: string
  excerpt: string
  date: string
  readTime: string
  tags: string[]
  type: 'article' | 'podcast' | 'thought'
}

const notesData: Note[] = [
  {
    id: '1',
    title: '构建个人知识管理系统',
    excerpt: '如何搭建一个高效的第二大脑,让知识真正为你所用。从收集、整理到输出的完整流程。',
    date: '2026-04-01',
    readTime: '8分钟',
    tags: ['效率', '知识管理'],
    type: 'article',
  },
  {
    id: '2',
    title: '独立开发者的生存指南',
    excerpt: '从0到1打造产品,技术、设计、营销三位一体。聊聊我在独立开发路上踩过的坑。',
    date: '2026-03-28',
    readTime: '15分钟',
    tags: ['独立开发', '创业'],
    type: 'podcast',
  },
  {
    id: '3',
    title: '随机思考:关于创意的产生',
    excerpt: '创意不是凭空出现的,它是对已有元素的重新组合。如何培养创造性思维?',
    date: '2026-03-25',
    readTime: '3分钟',
    tags: ['思考', '创意'],
    type: 'thought',
  },
  {
    id: '4',
    title: '前端工程化最佳实践',
    excerpt: '现代化前端项目架构设计,从工具链选择到CI/CD流程的完整方案。',
    date: '2026-03-20',
    readTime: '12分钟',
    tags: ['前端', '工程化'],
    type: 'article',
  },
]

const typeIcons = {
  article: '📝',
  podcast: '🎙️',
  thought: '💭',
}

const typeLabels = {
  article: '文章',
  podcast: '播客',
  thought: '随想',
}

export function Notes() {
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
              <p className="vn-meta mb-1">scenario log</p>
              <h1 className="text-3xl font-bold text-[rgb(71,48,88)] flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-[rgb(131,59,105)]" />
                笔记
              </h1>
              <p className="text-[rgb(128,99,128)] text-sm mt-1">像角色日志和剧情片段一样收纳你的文字与记录</p>
            </div>
          </div>

          <div className="space-y-4">
            {notesData.map((note) => (
              <motion.article
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="vn-window group p-6 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(196,154,182,0.2)]"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="vn-titlebar">log / {note.type}</div>
                  <span className="vn-chip">entry</span>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex min-w-[3.5rem] flex-col items-center gap-1 rounded-[1rem] border border-white/75 bg-[rgba(255,246,250,0.88)] px-2 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                    <span className="text-2xl">{typeIcons[note.type]}</span>
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[rgb(150,116,141)]">{typeLabels[note.type]}</span>
                  </div>
                  <div className="vn-rail flex-1 min-w-0 pl-5">
                    <p className="vn-meta mb-1">entry / {note.date}</p>
                    <h3 className="text-lg font-bold text-[rgb(71,48,88)] group-hover:text-[rgb(131,59,105)] transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-sm text-[rgb(109,84,115)] mt-2 leading-6 line-clamp-2">
                      {note.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[rgb(128,99,128)]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {note.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {note.readTime}
                      </span>
                      <div className="flex gap-2">
                        {note.tags.map((tag) => (
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
