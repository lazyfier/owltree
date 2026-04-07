import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { Project } from '@/data/projects'
import { projects } from '@/data/projects'
import { Link } from 'react-router-dom'
import { getLocale } from '@/lib/i18n'
import { t } from '@/data/i18n'
import type { Locale } from '@/data/i18n'

export function ProjectGrid() {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    setLocale(getLocale())
  }, [])

  return (
    <section className="py-8 md:py-12" aria-label="Projects">
      <h2 className="font-pixel text-teal-accent text-xl md:text-2xl font-semibold uppercase mb-6">
        {t(locale, 'projects')}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {projects.map((p: Project) => {
          const variant = p.featured ? 'featured' : 'interactive' as const
          const to = p.id === 'moon-throw' ? '/moon-throw' : p.url
          return (
            <Card key={p.id} variant={variant}>
              <div className="p-4 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{p.icon}</span>
                  <span className="font-semibold">{p.name}</span>
                </div>
                <p className="text-sm text-slate-400 mb-2 flex-1">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {p.tags.map((t: string, i: number) => (
                    <Badge key={i} variant="pixel" color="teal">
                      {t}
                    </Badge>
                  ))}
                </div>
                <Link to={to} className="text-sm text-teal-accent hover:underline self-start">
                  进入 →
                </Link>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
