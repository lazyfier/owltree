import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, TrendingUp, RefreshCw, ExternalLink } from 'lucide-react'

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
  { id: 'all', name: '全部' },
  { id: 'dev', name: '开发' },
  { id: 'ai', name: 'AI' },
  { id: 'tech', name: '科技' },
  { id: 'design', name: '设计' },
]

export function Trends() {
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
              <p className="vn-meta mb-1">info terminal</p>
              <h1 className="text-3xl font-bold text-[rgb(71,48,88)] flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-[rgb(84,121,153)]" />
                趋势
              </h1>
              <p className="text-[rgb(128,99,128)] text-sm mt-1">像情报页和系统频道一样浏览当天最值得留意的话题</p>
            </div>
          </div>

          <div className="vn-window mb-6 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="vn-meta mb-1">live feed</p>
                <h2 className="font-bold text-[rgb(71,48,88)]">今日热榜</h2>
                <p className="text-xs text-[rgb(128,99,128)] mt-0.5">
                  聚合多平台热门话题
                </p>
              </div>
              <button
                type="button"
                className="vn-button px-3 py-1.5 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                刷新
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {trendCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className="vn-chip"
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {mockTrends.map((trend, index) => (
                <a
                  key={trend.id}
                  href={trend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vn-slot group flex items-center gap-4 p-4 transition-colors hover:-translate-y-0.5"
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center text-sm font-bold rounded-lg ${
                      index < 3
                        ? 'bg-gradient-to-br from-[rgba(220,107,141,0.95)] to-[rgba(187,123,197,0.95)] text-white'
                        : 'bg-[rgba(240,227,239,0.96)] text-[rgb(128,99,128)]'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="vn-rail flex-1 min-w-0 pl-4">
                    <p className="vn-meta mb-1">channel / {trend.category}</p>
                    <p className="text-sm text-[rgb(71,48,88)] group-hover:text-[rgb(53,34,68)] transition-colors truncate">
                      {trend.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[rgb(128,99,128)]">{trend.source}</span>
                      <span className="text-xs text-[rgb(205,178,197)]">•</span>
                      <span className="text-xs text-[rgb(128,99,128)]">
                        {trendCategories.find((c) => c.id === trend.category)?.name}
                      </span>
                    </div>
                  </div>
                  {trend.hot && (
                    <span className="vn-chip text-[rgb(131,59,105)]">
                      热
                    </span>
                  )}
                  <ExternalLink className="w-4 h-4 text-[rgb(159,123,152)] group-hover:text-[rgb(71,48,88)] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="vn-window p-5">
              <p className="vn-meta mb-1">sub menu</p>
              <h3 className="font-bold text-[rgb(71,48,88)] mb-3">RSS 订阅</h3>
              <p className="text-sm text-[rgb(109,84,115)]">
                通过 RSS 聚合器订阅最新技术资讯。
              </p>
              <button
                type="button"
                className="vn-button mt-4 px-4 py-2 text-sm"
              >
                配置订阅源
              </button>
            </div>
            <div className="vn-window p-5">
              <p className="vn-meta mb-1">sub menu</p>
              <h3 className="font-bold text-[rgb(71,48,88)] mb-3">关键词追踪</h3>
              <p className="text-sm text-[rgb(109,84,115)]">
                设置关注的关键词,获取相关趋势推送。
              </p>
              <button
                type="button"
                className="vn-button mt-4 px-4 py-2 text-sm"
              >
                添加关键词
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
