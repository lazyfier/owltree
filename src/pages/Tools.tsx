import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'
import { ArrowLeft, Wrench, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

interface Tool {
  id: string
  name: string
  description: string
  icon: string
  url: string
  category: string
}

const toolsData: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON 格式化',
    description: '格式化、验证和美化 JSON 数据。支持压缩和转义处理。',
    icon: '{ }',
    url: '#json-formatter',
    category: '开发工具',
  },
  {
    id: 'base64',
    name: 'Base64 编解码',
    description: '快速进行 Base64 编码和解码操作。支持文本和文件。',
    icon: '64',
    url: '#base64',
    category: '开发工具',
  },
  {
    id: 'password-generator',
    name: '密码生成器',
    description: '生成安全的高强度随机密码。可自定义长度和字符集。',
    icon: '🔐',
    url: '#password-generator',
    category: '安全工具',
  },
  {
    id: 'color-picker',
    name: '颜色选择器',
    description: '取色、转换格式（HEX/RGB/HSL），生成配色方案。',
    icon: '🎨',
    url: '#color-picker',
    category: '设计工具',
  },
  {
    id: 'unit-converter',
    name: '单位换算',
    description: '长度、重量、温度、存储单位等多种常用换算。',
    icon: '⚖️',
    url: '#unit-converter',
    category: '实用工具',
  },
  {
    id: 'timestamp',
    name: '时间戳转换',
    description: 'Unix 时间戳与日期时间相互转换。',
    icon: '⏰',
    url: '#timestamp',
    category: '开发工具',
  },
]

const categories = [
  { id: 'all', name: '全部' },
  { id: 'dev', name: '开发工具' },
  { id: 'security', name: '安全工具' },
  { id: 'design', name: '设计工具' },
  { id: 'utility', name: '实用工具' },
]

export function Tools() {
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
              <p className="vn-meta mb-1">utility menu</p>
              <h1 className="text-3xl font-bold text-[rgb(71,48,88)] flex items-center gap-3">
                <Wrench className="w-8 h-8 text-[rgb(135,92,47)]" />
                工具
              </h1>
              <p className="text-[rgb(128,99,128)] text-sm mt-1">像系统菜单一样整理好每一项高频功能</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="vn-chip"
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolsData.map((tool) => (
              <motion.a
                key={tool.id}
                href={tool.url}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                className="vn-window group flex items-start gap-4 p-5 transition-all cursor-pointer hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(196,154,182,0.2)]"
              >
                <div className="absolute right-4 top-4">
                  <span className="vn-chip">system</span>
                </div>
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-[1rem] border border-white/80 bg-[rgba(255,246,250,0.88)] text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">{tool.icon}</div>
                <div className="vn-rail flex-1 min-w-0 pl-5 pr-16">
                  <p className="vn-meta mb-1">system / {tool.category}</p>
                  <h3 className="text-base font-bold text-[rgb(71,48,88)] group-hover:text-[rgb(135,92,47)] transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-1 text-xs leading-6 text-[rgb(109,84,115)] line-clamp-2">
                    {tool.description}
                  </p>
                  <span className="inline-block mt-3 vn-chip">
                    {tool.category}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-[rgb(159,123,152)] group-hover:text-[rgb(71,48,88)] transition-colors flex-shrink-0" />
              </motion.a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
