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
    <footer className="w-full px-4 py-5 md:py-7">
      <div className="vn-window mx-auto max-w-5xl px-5 py-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="vn-titlebar">system / footer</div>
        </div>
        <PixelDivider className="mb-4" />
        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <div className="flex gap-4">
            <a href="https://github.com" className="text-[rgb(128,99,128)] transition-colors hover:text-coral" aria-label="GitHub">
            <Github size={18} />
          </a>
            <a href="https://x.com" className="text-[rgb(128,99,128)] transition-colors hover:text-coral" aria-label="Twitter">
            <Twitter size={18} />
          </a>
            <a href="mailto:hello@example.com" className="text-[rgb(128,99,128)] transition-colors hover:text-coral" aria-label="Email">
            <Mail size={18} />
          </a>
          </div>
          <p className="text-center text-xs leading-6 text-[rgb(128,99,128)] md:text-right">
            {t(locale, 'copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
