import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'
import '@/styles/pages/trends.css'
import '@/styles/pages/_theme-atmosphere.css'
import { ArrowLeft, TrendingUp, RefreshCw, ExternalLink, Flame, Rss, Hash } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

interface TrendItem {
  id: string
  title: string
  source: string
  category: string
  url: string
  hot: boolean
}

const mockTrends: TrendItem[] = [
  {
    id: '1',
    title: 'React 19 正式发布,带来全新编译器',
    source: 'GitHub',
    category: 'dev',
    url: 'https://github.com/facebook/react',
    hot: true,
  },
  {
    id: '2',
    title: 'OpenAI 发布 GPT-5 预览版',
    source: 'OpenAI',
    category: 'ai',
    url: '#',
    hot: true,
  },
  {
    id: '3',
    title: 'TypeScript 6.0 新特性详解',
    source: 'TypeScript Blog',
    category: 'dev',
    url: '#',
    hot: false,
  },
  {
    id: '4',
    title: '2024 前端性能优化最佳实践',
    source: '掘金',
    category: 'dev',
    url: '#',
    hot: false,
  },
  {
    id: '5',
    title: 'Apple Vision Pro 销量突破百万',
    source: 'TechCrunch',
    category: 'tech',
    url: '#',
    hot: true,
  },
  {
    id: '6',
    title: 'Figma 推出 AI 设计助手',
    source: 'Figma',
    category: 'design',
    url: '#',
    hot: false,
  },
  {
    id: '7',
    title: 'Rust 成为 Linux 内核第二官方语言',
    source: 'LWN',
    category: 'dev',
    url: '#',
    hot: true,
  },
  {
    id: '8',
    title: 'Claude 3.5 Sonnet 上下文窗口扩展至 200K',
    source: 'Anthropic',
    category: 'ai',
    url: '#',
    hot: false,
  },
]

const trendCategories = [
  { id: 'all', name: '全部', color: 'var(--games-accent)' },
  { id: 'dev', name: '开发', color: 'var(--trends-accent)' },
  { id: 'ai', name: 'AI', color: 'var(--tools-accent)' },
  { id: 'tech', name: '科技', color: 'var(--notes-accent)' },
  { id: 'design', name: '设计', color: 'var(--games-accent-light)' },
]

const trendCategoryMap: Record<string, string> = {
  all: '全部',
  dev: 'dev',
  ai: 'ai',
  tech: 'tech',
  design: 'design',
}

const trendCategoryLabelMap: Record<string, string> = {
  dev: '开发',
  ai: 'AI',
  tech: '科技',
  design: '设计',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: [0.175, 0.885, 0.32, 1.275],
    },
  },
}

export function Trends() {
  const { theme } = useTheme()
  const [trends, setTrends] = useState(mockTrends)
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredTrends = useMemo(
    () =>
      activeCategory === 'all'
        ? trends
        : trends.filter((trend) => trendCategoryMap[activeCategory] === trend.category),
    [activeCategory, trends],
  )

  const hotTrendCount = useMemo(
    () => filteredTrends.filter((trend) => trend.hot).length,
    [filteredTrends],
  )

  return (
    <div data-page="trends" className="min-h-screen relative overflow-hidden page-root">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="trends-page-header"
          >
            <a
              href="#/"
              className="page-back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="trends-page-title">
              <div className="trends-page-title-row">
                <div className="page-header-icon">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--page-text)]">趋势</h1>
                  <p className="text-sm text-[var(--page-text-muted)]">像情报页和系统频道一样浏览当天最值得留意的话题</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={theme === 'terminal' ? 'mb-6' : 'page-card trends-main-card relative mb-6'}
          >
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
              <div className="trends-header-row mb-4">
                <div>
                  <div className="trends-live-indicator">
                    <div className="text-xs text-[var(--page-text-muted)]">
                      <span className="trends-live-dot animate-pulse" />
                    </div>
                    <span className="page-label">live feed</span>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--page-text)]">今日热榜</h2>
                  <p className="text-xs text-[var(--page-text-muted)]">聚合多平台热门话题</p>
                </div>
                <button
                  type="button"
                  className="page-action-btn"
                  onClick={() => setTrends([...mockTrends].sort(() => Math.random() - 0.5))}
                >
                  <RefreshCw className="w-4 h-4" />
                  刷新
                </button>
              </div>

              <div className="trends-filter-row mb-4">
                {trendCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="page-filter-btn"
                    style={{
                      color: activeCategory === cat.id ? cat.color : undefined,
                      borderColor: activeCategory === cat.id ? `${cat.color}30` : undefined,
                    }}
                    onClick={() => setActiveCategory(cat.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = cat.color
                      e.currentTarget.style.borderColor = `${cat.color}30`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = activeCategory === cat.id ? cat.color : ''
                      e.currentTarget.style.borderColor = activeCategory === cat.id ? `${cat.color}30` : 'transparent'
                    }}
                    aria-pressed={activeCategory === cat.id}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="term-output-line">$ top -n 8 -o cpu</div>
                <div className="term-sys-bar text-[var(--page-text-secondary)]">
                  Tasks: {filteredTrends.length} total, {hotTrendCount} running    Load average: 0.42 0.38 0.35
                </div>
                <div className="term-output-line grid grid-cols-[4rem_4rem_minmax(0,1.8fr)_8rem_8rem_6rem] gap-3 font-semibold">
                  <span className="whitespace-nowrap">PID</span>
                  <span className="whitespace-nowrap">%CPU</span>
                  <span className="whitespace-nowrap">TOPIC</span>
                  <span className="whitespace-nowrap">SOURCE</span>
                  <span className="whitespace-nowrap">CATEGORY</span>
                  <span className="whitespace-nowrap">STATUS</span>
                </div>

                {filteredTrends.map((trend, index) => (
                  <a
                    key={trend.id}
                    href={trend.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="term-output-line grid grid-cols-[4rem_4rem_minmax(0,1.8fr)_8rem_8rem_6rem] gap-3 transition-colors hover:text-[var(--trends-accent)]"
                  >
                    <span className="whitespace-nowrap text-right">{String(index + 1).padStart(3, '0')}</span>
                    <span className="whitespace-nowrap">
                      [<span className={trend.hot ? 'text-[var(--games-accent)]' : 'text-[var(--page-text-muted)]'}>{trend.hot ? '●' : '·'}</span>]
                    </span>
                    <span className="truncate">{trend.title}</span>
                    <span className="truncate text-[var(--page-text-muted)]">{trend.source}</span>
                    <span className="truncate text-[var(--page-text-secondary)]">[{trend.category}]</span>
                    <span className={trend.hot ? 'whitespace-nowrap text-[var(--games-accent)]' : 'whitespace-nowrap text-[var(--page-text-muted)]'}>
                      {trend.hot ? '[HOT]' : '[---]'}
                    </span>
                  </a>
                ))}

                <div className="term-line term-cursor-line">$ _</div>
              </motion.div>
            ) : (
              <>
                <div className="page-accent-bar" />

                <div className="trends-main-inner">
                  <div className="trends-header-row">
                    <div>
                      <div className="trends-live-indicator">
                        <div className="text-xs text-[var(--page-text-muted)]">
                          <span className="trends-live-dot animate-pulse" />
                        </div>
                        <span className="page-label">live feed</span>
                      </div>
                      <h2 className="text-xl font-bold text-[var(--page-text)]">今日热榜</h2>
                      <p className="text-xs text-[var(--page-text-muted)]">聚合多平台热门话题</p>
                    </div>
                    <button
                      type="button"
                      className="page-action-btn"
                      onClick={() => setTrends([...mockTrends].sort(() => Math.random() - 0.5))}
                    >
                      <RefreshCw className="w-4 h-4" />
                      刷新
                    </button>
                  </div>

                  <div className="trends-filter-row">
                    {trendCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        className="page-filter-btn"
                        style={{
                          color: activeCategory === cat.id ? cat.color : undefined,
                          borderColor: activeCategory === cat.id ? `${cat.color}30` : undefined,
                        }}
                        onClick={() => setActiveCategory(cat.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = cat.color
                          e.currentTarget.style.borderColor = `${cat.color}30`
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = activeCategory === cat.id ? cat.color : ''
                          e.currentTarget.style.borderColor = activeCategory === cat.id ? `${cat.color}30` : 'transparent'
                        }}
                        aria-pressed={activeCategory === cat.id}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>

                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="trends-list"
                  >
                    {filteredTrends.map((trend, index) => (
                      <motion.a
                        key={trend.id}
                        href={trend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variants={itemVariants}
                        className="trend-item group transition-all"
                      >
                        <span
                          className="trend-rank page-badge"
                          style={{
                            background: index === 0
                              ? 'linear-gradient(to bottom right, var(--games-accent), var(--games-accent-light))'
                              : index === 1
                              ? 'linear-gradient(to bottom right, var(--trends-accent), var(--trends-accent-light))'
                              : index === 2
                              ? 'linear-gradient(to bottom right, var(--tools-accent), var(--tools-accent-light))'
                              : undefined,
                            color: index < 3 ? 'white' : undefined,
                            boxShadow: index === 0
                              ? '0 10px 15px -3px color-mix(in srgb, var(--games-accent) 30%, transparent)'
                              : index === 1
                              ? '0 10px 15px -3px color-mix(in srgb, var(--trends-accent) 30%, transparent)'
                              : index === 2
                              ? '0 10px 15px -3px color-mix(in srgb, var(--tools-accent) 30%, transparent)'
                              : undefined,
                          }}
                        >
                          {index + 1}
                        </span>

                        <div className="trend-info">
                          <div className="trend-info-header">
                            <span className="text-xs font-medium text-[var(--page-text-muted)] uppercase tracking-wider">
                              channel / {trend.category}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-[var(--page-text)] group-hover:text-[var(--trends-accent)] transition-colors truncate">
                            {trend.title}
                          </p>
                          <div className="trend-source-row">
                            <span className="text-xs text-[var(--page-text-muted)]">{trend.source}</span>
                              <span className="text-xs text-[var(--page-text-muted)]">•</span>
                              <span className="text-xs text-[var(--page-text-muted)]">
                              {trendCategoryLabelMap[trend.category]}
                              </span>
                            </div>
                          </div>

                        {trend.hot && (
                          <span className="page-badge" style={{ background: 'color-mix(in srgb, var(--games-accent) 10%, transparent)', color: 'var(--games-accent)' }}>
                            <Flame className="w-3 h-3" />
                            热
                          </span>
                        )}

                        <ExternalLink className="w-4 h-4 text-[var(--page-text-muted)] group-hover:text-[var(--trends-accent)] transition-colors flex-shrink-0" />
                      </motion.a>
                    ))}
                  </motion.div>
                </div>
              </>
            )}
          </motion.div>

          {theme !== 'terminal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="trends-sub-grid"
            >
              <div className="page-card trends-sub-card relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--tools-accent)] to-[var(--tools-accent-light)]" />
                <div className="trends-sub-inner">
                  <div className="trends-sub-header">
                    <div className="page-header-icon" style={{ width: '2rem', height: '2rem' }}>
                      <Rss className="w-4 h-4 text-white" />
                    </div>
                    <span className="page-label">sub menu</span>
                  </div>
                  <h3 className="font-bold text-[var(--page-text)] group-hover:text-[var(--tools-accent)] transition-colors">RSS 订阅</h3>
                  <p className="text-sm text-[var(--page-text-secondary)]">
                    通过 RSS 聚合器订阅最新技术资讯。
                  </p>
                  <button
                    type="button"
                    className="page-action-btn"
                    style={{ '--btn-accent': 'var(--tools-accent)' } as React.CSSProperties}
                  >
                    配置订阅源
                  </button>
                </div>
              </div>

              <div className="page-card trends-sub-card relative group">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-[var(--games-accent)] to-[var(--games-accent-light)]" />
                <div className="trends-sub-inner">
                  <div className="trends-sub-header">
                    <div className="page-header-icon" style={{ width: '2rem', height: '2rem' }}>
                      <Hash className="w-4 h-4 text-white" />
                    </div>
                    <span className="page-label">sub menu</span>
                  </div>
                  <h3 className="font-bold text-[var(--page-text)] group-hover:text-[var(--games-accent)] transition-colors">关键词追踪</h3>
                  <p className="text-sm text-[var(--page-text-secondary)]">
                    设置关注的关键词,获取相关趋势推送。
                  </p>
                  <button
                    type="button"
                    className="page-action-btn"
                    style={{ '--btn-accent': 'var(--games-accent)' } as React.CSSProperties}
                  >
                    添加关键词
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
