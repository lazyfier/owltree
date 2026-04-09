import type { ReactNode } from 'react'
import { Gamepad2, BookOpen, Wrench, TrendingUp, ArrowRight } from 'lucide-react'

interface Category {
  id: string
  name: string
  nameEn: string
  description: string
  icon: ReactNode
  href: string
  iconClass: string
  accentClass: string
  featured?: boolean
}

const categories: Category[] = [
  {
    id: 'games',
    name: '游戏',
    nameEn: 'Games',
    description: '实验性互动体验',
    icon: <Gamepad2 className="h-8 w-8" />,
    href: '/games',
    iconClass: 'bg-[rgba(220,107,141,0.14)] text-coral border-[rgba(220,107,141,0.16)]',
    accentClass: 'text-coral',
    featured: true,
  },
  {
    id: 'notes',
    name: '笔记',
    nameEn: 'Notes',
    description: '文章与播客',
    icon: <BookOpen className="h-8 w-8" />,
    href: '/notes',
    iconClass: 'bg-[rgba(187,123,197,0.14)] text-[rgb(131,59,105)] border-[rgba(187,123,197,0.16)]',
    accentClass: 'text-[rgb(131,59,105)]',
  },
  {
    id: 'tools',
    name: '工具',
    nameEn: 'Tools',
    description: '实用工具集',
    icon: <Wrench className="h-8 w-8" />,
    href: '/tools',
    iconClass: 'bg-[rgba(213,168,114,0.18)] text-[rgb(135,92,47)] border-[rgba(213,168,114,0.24)]',
    accentClass: 'text-[rgb(135,92,47)]',
  },
  {
    id: 'trends',
    name: '趋势',
    nameEn: 'Trends',
    description: '每日热点追踪',
    icon: <TrendingUp className="h-8 w-8" />,
    href: '/trends',
    iconClass: 'bg-[rgba(109,167,201,0.16)] text-[rgb(84,121,153)] border-[rgba(109,167,201,0.22)]',
    accentClass: 'text-[rgb(84,121,153)]',
  },
]

export function CategoryGrid() {
  return (
    <section className="mb-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="vn-meta">Route Select</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[rgb(71,48,88)]">选择你今天要进入的线路</h2>
        </div>
        <p className="hidden max-w-sm text-right text-sm leading-6 text-[rgb(128,99,128)] md:block">像 galgame 的选线菜单一样，每一个入口都应该有自己的情绪和质感。</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.href}`}
            className="vn-window group p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(196,154,182,0.22)]"
          >
            <div className="absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />

            <div className="relative mb-4 flex items-center justify-between gap-4">
              <div className="vn-titlebar">route / {category.nameEn}</div>
              {category.featured && (
                <span className="vn-chip">heroine route</span>
              )}
            </div>

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-[1rem] border shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] ${category.iconClass}`}>
                  {category.icon}
                </div>
                <div className="vn-rail min-w-0 pl-5">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <h3 className="text-xl font-semibold text-[rgb(71,48,88)]">{category.name}</h3>
                  </div>
                  <p className="mt-2 text-sm leading-6 vn-menu-text">{category.description}</p>
                </div>
              </div>

              <ArrowRight className={`mt-1 h-5 w-5 transition-all group-hover:translate-x-1 ${category.accentClass}`} />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
