import { useState, useEffect } from 'react'
import { Github, Twitter, Mail } from 'lucide-react'
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
      <div className="page-footer mx-auto max-w-5xl px-5 py-5 rounded-xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="text-sm font-bold text-[var(--page-accent)] tracking-wide">system / footer</div>
        </div>
        <hr className="border-none my-4" style={{ borderTop: '1px solid var(--page-border)' }} />
        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
          <div className="flex gap-4">
            <a href="https://github.com" className="text-[var(--page-text-muted)] transition-colors hover:text-[var(--page-accent)]" aria-label="GitHub">
            <Github size={18} />
          </a>
            <a href="https://x.com" className="text-[var(--page-text-muted)] transition-colors hover:text-[var(--page-accent)]" aria-label="Twitter">
            <Twitter size={18} />
          </a>
            <a href="mailto:hello@example.com" className="text-[var(--page-text-muted)] transition-colors hover:text-[var(--page-accent)]" aria-label="Email">
            <Mail size={18} />
          </a>
          </div>
          <p className="text-center text-xs leading-6 text-[var(--page-text-muted)] md:text-right">
            {t(locale, 'copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
