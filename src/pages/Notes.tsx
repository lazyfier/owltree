import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'
import '@/styles/pages/notes.css'
import '@/styles/pages/_theme-atmosphere.css'
import { ArrowLeft, BookOpen, Calendar, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

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

const typeConfig = {
  article: {
    icon: '📝',
    label: '文章',
    color: 'var(--notes-accent)',
    colorFallback: '#6b9bd1',
    bgGradient: 'from-[var(--notes-accent)] to-[var(--notes-accent-light)]',
  },
  podcast: {
    icon: '🎙️',
    label: '播客',
    color: 'var(--games-accent)',
    colorFallback: '#e85d75',
    bgGradient: 'from-[var(--games-accent)] to-[var(--games-accent-light)]',
  },
  thought: {
    icon: '💭',
    label: '随想',
    color: 'var(--tools-accent)',
    colorFallback: '#9bc47f',
    bgGradient: 'from-[var(--tools-accent)] to-[var(--tools-accent-light)]',
  },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

function formatTerminalTags(tags: Note['tags']): string {
  return tags.map((tag) => `[${tag}]`).join(' ')
}

export function Notes() {
  const navigate = useNavigate()
  const { theme } = useTheme()

  return (
    <div data-page="notes" className="page-root min-h-screen relative overflow-hidden">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl">
          {theme === 'terminal' ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              className="term-command-output font-mono text-sm leading-7 text-[var(--page-text)]"
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
              <div className="term-output-line">$ ls -la ~/notes/</div>
              {notesData.map((note) => {
                const config = typeConfig[note.type]

                return (
                  <button
                    key={note.id}
                    type="button"
                    className="term-output-line grid grid-cols-[9rem_6rem_8rem_2.5rem_6rem_minmax(0,1fr)_minmax(8rem,auto)] gap-3 cursor-pointer hover:bg-[var(--glass-highlight)] rounded px-1 -mx-1 transition-colors text-left"
                    onClick={() => navigate(`/notes/${note.id}`)}
                  >
                    <span className="whitespace-nowrap">-rw-r--r--</span>
                    <span className="whitespace-nowrap">lazyfier</span>
                    <span className="whitespace-nowrap">{note.date}</span>
                    <span aria-hidden="true">{config.icon}</span>
                    <span className="whitespace-nowrap uppercase">{note.type}</span>
                    <span className="truncate">{note.title}</span>
                    <span className="justify-self-start whitespace-nowrap sm:justify-self-end">
                      {formatTerminalTags(note.tags)}
                    </span>
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
                  className="page-back-btn flex items-center justify-center w-11 h-11 rounded-2xl transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </a>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="page-header-icon flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--notes-accent)] to-[var(--notes-accent-light)]">
                      <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-[var(--page-text)]">笔记</h1>
                      <p className="text-sm text-[var(--page-text-muted)]">像角色日志和剧情片段一样收纳你的文字与记录</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="notes-grid"
              >
                {notesData.map((note) => {
                  const config = typeConfig[note.type]
                  return (
                    <motion.button
                      key={note.id}
                      variants={itemVariants}
                      type="button"
                      className="page-card note-card group relative overflow-hidden cursor-pointer transition-all text-left"
                      onClick={() => navigate(`/notes/${note.id}`)}
                    >
                      <div
                        className="page-accent-bar absolute left-0 top-0 bottom-0"
                        style={{
                          background: `linear-gradient(to bottom, ${config.color}, color-mix(in srgb, ${config.color} 60%, transparent))`,
                        }}
                      />

                      <div className="note-card-inner">
                        <div className="note-layout">
                          <div className="note-type-col">
                            <span className="note-type-icon text-2xl">{config.icon}</span>
                            <span className="page-label text-[10px] font-semibold uppercase tracking-wider">
                              {config.label}
                            </span>
                          </div>

                          <div className="note-body">
                            <div className="note-type-label">
                              <span className="page-label text-xs font-medium uppercase tracking-wider">
                                log / {note.type}
                              </span>
                            </div>
                            <span className="note-title text-lg font-bold text-[var(--page-text)] group-hover:text-[var(--notes-accent)] transition-colors">
                              {note.title}
                            </span>
                            <span className="note-excerpt text-sm text-[var(--page-text-secondary)] leading-relaxed line-clamp-2">
                              {note.excerpt}
                            </span>
                            <div className="note-meta text-xs text-[var(--page-text-muted)]">
                              <span className="note-meta-items">
                                <Calendar className="w-3.5 h-3.5" />
                                {note.date}
                              </span>
                              <span className="note-meta-items">
                                <Clock className="w-3.5 h-3.5" />
                                {note.readTime}
                              </span>
                              <div className="note-tags">
                                {note.tags.map((tag) => (
                                  <span
                                    key={tag}
                                    className="page-tag group-hover:text-[var(--notes-accent)] transition-colors"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
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
