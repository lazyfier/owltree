import { motion } from 'framer-motion'

const entries = [
  {
    id: 'games',
    category: '游戏',
    number: '01',
    title: '月抛模拟器',
    subtitle: '关于选择与后果的叙事游戏',
  },
  {
    id: 'notes',
    category: '笔记',
    number: '02',
    title: '笔记',
    subtitle: '文章、随想与阅读记录',
  },
  {
    id: 'tools',
    category: '工具',
    number: '03',
    title: '工具',
    subtitle: '格式化、转换与设计辅助',
  },
  {
    id: 'trends',
    category: '趋势',
    number: '04',
    title: '趋势',
    subtitle: '每日热点与技术资讯',
  },
]

export function CategoryGrid() {
  return (
    <section className="pt-8">
      <div className="mb-16">
        <span className="label-sans">Index</span>
      </div>

      <div className="space-y-12">
        {entries.map((entry, index) => (
          <motion.a
            key={entry.id}
            href={`#/${entry.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group block"
          >
            <div className="flex items-baseline gap-4 mb-3">
              <span className="label-sans opacity-30">{entry.number}</span>
              <span className="text-xs font-sans tracking-widest uppercase opacity-40" style={{ color: 'var(--text-muted)' }}>
                {entry.category}
              </span>
            </div>

            <div className="flex items-baseline justify-between py-2 border-b border-transparent group-hover:border-[rgba(247,245,240,0.08)] transition-colors duration-500">
              <h3 className="text-3xl md:text-5xl font-serif transition-all duration-500 group-hover:translate-x-6" style={{ color: 'var(--text-primary)' }}>
                {entry.title}
              </h3>

              <span className="text-sm opacity-0 group-hover:opacity-30 transition-opacity duration-300">
                →
              </span>
            </div>

            <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              {entry.subtitle}
            </p>
          </motion.a>
        ))}
      </div>

      <div className="mt-24 pt-8" style={{ borderTop: '1px solid rgba(247, 245, 240, 0.06)' }}>
        <p className="text-sm max-w-xl" style={{ color: 'var(--text-muted)' }}>
          四个入口，四种内容类型。
          <br />
          游戏为实验性叙事，笔记为思考痕迹，工具为实用辅助，趋势为信息聚合。
        </p>
      </div>
    </section>
  )
}
