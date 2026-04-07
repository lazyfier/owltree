import { useState, useEffect } from 'react'
import { Github, Twitter, Mail } from 'lucide-react'
import { PixelDivider } from '@/components/ui/PixelDivider'
import { getLocale } from '@/lib/i18n'
import { t } from '@/data/i18n'
import type { Locale } from '@/data/i18n'

export function Footer() {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    setLocale(getLocale())
  }, [])

  return (
    <footer className="w-full py-4 md:py-6 px-4">
      <PixelDivider className="mb-4" />
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="flex gap-4">
          <a href="#" className="text-slate-500 hover:text-teal-accent transition-colors" aria-label="GitHub">
            <Github size={18} />
          </a>
          <a href="#" className="text-slate-500 hover:text-teal-accent transition-colors" aria-label="Twitter">
            <Twitter size={18} />
          </a>
          <a href="#" className="text-slate-500 hover:text-teal-accent transition-colors" aria-label="Email">
            <Mail size={18} />
          </a>
        </div>
        <p className="text-xs text-slate-500">
          {t(locale, 'copyright')}
        </p>
      </div>
    </footer>
  )
}
