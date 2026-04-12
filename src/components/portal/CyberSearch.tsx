import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Command, FileText, Gamepad2, Wrench, Sparkles } from 'lucide-react'

const quickLinks = [
  { icon: <Gamepad2 className="w-3 h-3" />, label: '月抛模拟器', color: '#c75b39' },
  { icon: <FileText className="w-3 h-3" />, label: '设计笔记', color: '#8b9a8b' },
  { icon: <Wrench className="w-3 h-3" />, label: '配色工具', color: '#d4a574' },
  { icon: <Sparkles className="w-3 h-3" />, label: 'AI助手', color: '#b87333' },
]

export function CyberSearch() {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="relative mt-12"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[var(--color-text-muted)] tracking-widest uppercase">
            System Terminal
          </span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        <span className="text-xs font-mono text-[var(--color-text-muted)]">
          Press <kbd className="px-1.5 py-0.5 bg-[var(--color-bg-secondary)] border border-[var(--color-text-muted)] rounded text-[10px]">/</kbd> to focus
        </span>
      </div>

      <div
        className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
          isFocused ? 'ring-2 ring-[#00ff41]/30' : ''
        }`}
        style={{
          background: 'var(--color-bg-tertiary)',
          border: '2px solid var(--color-copper)',
          boxShadow: isFocused
            ? 'inset 0 0 60px rgba(199, 91, 57, 0.3), 0 0 30px rgba(0, 255, 65, 0.1)'
            : 'inset 0 0 40px rgba(199, 91, 57, 0.2)',
        }}
      >
        <div className="absolute inset-0 pointer-events-none z-10 opacity-30">
          <div
            className="w-full h-full"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 3px,
                rgba(199, 91, 57, 0.05) 3px,
                rgba(199, 91, 57, 0.05) 6px
              )`,
            }}
          />
        </div>

        <div className="relative z-20 p-5">
          <div className="flex items-center gap-2 mb-4 text-xs font-mono opacity-70">
            <span style={{ color: '#00ff41' }}>root@owltree:~$</span>
            <span className="animate-pulse" style={{ color: '#00ff41' }}>_</span>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00ff41]/50" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="搜索内容..."
              className="w-full bg-transparent border-none outline-none pl-12 pr-4 py-3 font-mono text-sm transition-all"
              style={{
                color: '#00ff41',
                textShadow: '0 0 10px rgba(0, 255, 65, 0.3)',
              }}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Command className="w-4 h-4 text-[#00ff41]/30" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono opacity-60" style={{ color: '#00ff41' }}>
              热门搜索:
            </span>
            {quickLinks.map((link, index) => (
              <motion.button
                key={link.label}
                type="button"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono transition-all hover:opacity-100"
                style={{
                  color: '#00ff41',
                  opacity: 0.7,
                  background: 'rgba(0, 255, 65, 0.05)',
                  border: '1px solid rgba(0, 255, 65, 0.2)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 65, 0.1)'
                  e.currentTarget.style.boxShadow = `0 0 10px ${link.color}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 255, 65, 0.05)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={{ color: link.color }}>{link.icon}</span>
                {link.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[var(--color-text-muted)]">
        <span>{'System Status: ONLINE'}</span>
        <span>{'v2.0.1 // ALL SYSTEMS NOMINAL'}</span>
      </div>
    </motion.section>
  )
}
