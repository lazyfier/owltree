import { ParticleBackground } from '@/components/ui/ParticleBackground'
import { Footer } from '@/components/layout/Footer'
import { useTheme } from '@/contexts/ThemeContext'
import '@/styles/pages/tools.css'
import '@/styles/pages/_theme-atmosphere.css'
import { ArrowLeft, Wrench, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

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
  { id: 'all', name: '全部', color: '#e85d75' },
  { id: 'dev', name: '开发工具', color: '#6b9bd1' },
  { id: 'security', name: '安全工具', color: '#9bc47f' },
  { id: 'design', name: '设计工具', color: '#f59e0b' },
  { id: 'utility', name: '实用工具', color: '#8b5cf6' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.175, 0.885, 0.32, 1.275],
    },
  },
}

export function Tools() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { theme } = useTheme()

  const categoryMap: Record<string, string> = {
    all: '全部',
    dev: '开发工具',
    security: '安全工具',
    design: '设计工具',
    utility: '实用工具',
  }

  const filteredTools =
    activeCategory === 'all'
      ? toolsData
      : toolsData.filter((tool) => categoryMap[activeCategory] === tool.category)

  const toolsByCategory = toolsData.reduce<Record<string, Tool[]>>((groups, tool) => {
    const existingTools = groups[tool.category] ?? []

    return {
      ...groups,
      [tool.category]: [...existingTools, tool],
    }
  }, {})

  if (theme === 'terminal') {
    return (
      <div data-page="tools" className="page-root">
        <ParticleBackground />
        <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-4xl">
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
              <div className="term-output-line">$ neofetch</div>
              <pre className="term-ascii-header overflow-x-auto text-[var(--page-text)]">
                {`╔══════════════════════════════════╗
║  lazyfier@owltree  ·  工具箱       ║
╚══════════════════════════════════╝`}
              </pre>

              <div className="term-output-line">OS:        owltree/terminal</div>
              <div className="term-output-line">Shell:     bash 5.2</div>
              <div className="term-output-line">Uptime:    since 2024</div>
              <div className="term-output-line">Tools:     {toolsData.length} installed</div>
              <div className="term-output-line">Packages:  {toolsData.length} available</div>

              {Object.entries(toolsByCategory).map(([category, tools]) => (
                <div key={category} className="space-y-1 pt-2">
                  <div className="term-category-header">[{category}]</div>
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      type="button"
                      className="term-output-line flex max-w-full items-baseline gap-3 whitespace-pre cursor-pointer hover:bg-[var(--glass-highlight)] rounded px-1 -mx-1 transition-colors text-left"
                      onClick={() => window.location.href = tool.url}
                    >
                      <span className="inline-block w-[4ch] shrink-0 text-center">{tool.icon}</span>
                      <span className="inline-block w-[16ch] shrink-0 overflow-hidden text-ellipsis">{tool.name}</span>
                      <span className="min-w-0 truncate text-[var(--page-text-muted)]">{tool.description}</span>
                    </button>
                  ))}
                </div>
              ))}

              <div className="term-cursor-line">$ _</div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div data-page="tools" className="page-root">
      <ParticleBackground />
      <main className="relative z-10 flex flex-col items-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
            <a
              href="#/"
              className="page-back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </a>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                  <div className="page-header-icon">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--page-text)]">工具</h1>
                  <p className="text-sm text-[var(--page-text-muted)]">像系统菜单一样整理好每一项高频功能</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="tools-filter-row mb-8"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className="page-filter-btn"
                style={{
                  ['--hover-color' as string]: cat.color,
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
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="tools-grid"
          >
            {filteredTools.map((tool) => (
              <motion.a
                key={tool.id}
                href={tool.url}
                variants={itemVariants}
                className="group page-card cursor-pointer"
              >
                <div className="page-accent-bar" />

                <div className="tool-card-inner">
                  <div className="tool-icon-col font-bold text-[var(--tools-accent)]">
                    {tool.icon}
                  </div>

                  <div className="tool-info">
                    <span className="page-label">
                      system / {tool.category}
                    </span>
                    <h3 className="text-base font-bold text-[var(--page-text)] group-hover:text-[var(--tools-accent)] transition-colors mt-1 mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-[var(--page-text-secondary)] leading-relaxed line-clamp-2 mb-3">
                      {tool.description}
                    </p>
                    <div className="tool-info-bottom">
                      <span className="page-tag">
                        {tool.category}
                      </span>
                      <ExternalLink className="text-[var(--page-text-muted)] group-hover:text-[var(--tools-accent)] transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
