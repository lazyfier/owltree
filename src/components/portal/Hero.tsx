import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { PixelDivider } from '@/components/ui/PixelDivider'
import { getLocale } from '@/lib/i18n'
import { t } from '@/data/i18n'
import type { Locale } from '@/data/i18n'

const letters = 'OWLTREE'.split('')

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export function Hero() {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    setLocale(getLocale())
  }, [])

  return (
    <section className="flex flex-col items-center pt-8 md:pt-16 pb-8">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-2xl md:text-3xl animate-float">🦉</span>
        <motion.h1
          className="font-pixel text-3xl md:text-5xl text-teal-accent tracking-wider"
          style={{ textShadow: '0 0 10px rgba(45,212,191,0.5), 0 0 40px rgba(45,212,191,0.2)' }}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {letters.map((letter, i) => (
            <motion.span key={`${letter}-${i}`} variants={letterVariants} className="inline-block">
              {letter}
            </motion.span>
          ))}
        </motion.h1>
      </div>

      <motion.p
        className="font-display text-base md:text-xl text-slate-400 tracking-wide"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        {t(locale, 'subtitle')}
      </motion.p>

      <motion.div
        className="w-full max-w-xs mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.4 }}
      >
        <PixelDivider />
      </motion.div>
    </section>
  )
}
