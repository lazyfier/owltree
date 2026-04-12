import { useEffect, useRef, useCallback } from 'react'
import { projects } from '@/data/projects'
import { useNavigate } from 'react-router-dom'

const modules = [
  { label: 'GAMES', color: 't-m-mauve', inlineColor: 'var(--mauve)', href: '/games' },
  { label: 'NOTES', color: 't-m-cyan', inlineColor: 'var(--cyan)', href: '/notes' },
  { label: 'TOOLS', color: 't-m-yellow', inlineColor: 'var(--yellow)', href: '/tools' },
  { label: 'TRENDS', color: 't-m-teal', inlineColor: 'var(--teal)', href: '/trends' },
]

const stackList = [
  { name: 'React', color: 'var(--cyan)' },
  { name: 'TypeScript', color: 'var(--blue)' },
  { name: 'Go', color: 'var(--teal)' },
  { name: 'Python', color: 'var(--yellow)' },
  { name: 'Node.js', color: 'var(--mauve)' },
  { name: 'Rust', color: 'var(--peach)' },
  { name: 'Figma', color: 'var(--pink)' },
]

export function TerminalHome() {
  const navigate = useNavigate()
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const handleMouseEnter = useCallback((id: string) => {
    const card = cardRefs.current.get(id)
    if (!card) return
    const entry = card.closest('[data-entry-id]') as HTMLElement | null
    if (!entry) return
    const rect = entry.getBoundingClientRect()
    const vw = window.innerWidth
    const cardW = 240
    let left = rect.right + 12
    if (left + cardW > vw - 16) {
      left = rect.left - cardW - 12
    }
    card.style.left = left + 'px'
    card.style.top = (rect.top - 10) + 'px'
    card.classList.add('t-visible')
  }, [])

  const handleMouseLeave = useCallback((id: string) => {
    const card = cardRefs.current.get(id)
    if (!card) return
    card.classList.remove('t-visible')
  }, [])

  useEffect(() => {
    cardRefs.current.forEach((card) => {
      document.body.appendChild(card)
    })
    return () => {
      cardRefs.current.forEach((card) => {
        card.remove()
      })
    }
  }, [])

  return (
    <>
      <div className="t-bg-glow">
        <div className="t-orb t-orb-1" />
        <div className="t-orb t-orb-2" />
        <div className="t-orb t-orb-3" />
        <div className="t-orb t-orb-4" />
      </div>
      <div className="t-crt-lines" />

      <section className="t-screen">
        <h1 className="t-mega-title">
          <span className="t-line-1">[owltree]</span>
          <span className="t-line-2">SYSTEM ONLINE</span>
          <span className="t-line-3">{'// TERMINAL INTERFACE'}</span>
        </h1>

        <div className="t-identity">
          <div className="t-terminal-window t-glass">
            <div className="t-id-manifesto">
              Building systems at the edge of narrative and code.
            </div>
            <hr className="t-id-divider" />
            <div className="t-id-line">
              <span className="t-id-key">STACK:</span>
            </div>
            <div className="t-id-line" style={{ paddingLeft: 24 }}>
              {stackList.slice(0, 4).map((s, i) => (
                <span key={s.name}>
                  <span className="t-id-value" style={{ color: s.color }}>{s.name}</span>
                  {i < 3 && <span className="t-id-value" style={{ color: 'var(--t-subtle)' }}> · </span>}
                </span>
              ))}
            </div>
            <div className="t-id-line" style={{ paddingLeft: 24 }}>
              {stackList.slice(4).map((s, i) => (
                <span key={s.name}>
                  <span className="t-id-value" style={{ color: s.color }}>{s.name}</span>
                  {i < 2 && <span className="t-id-value" style={{ color: 'var(--t-subtle)' }}> · </span>}
                </span>
              ))}
            </div>
            <hr className="t-id-divider" />
            <div className="t-id-line">
              <span className="t-id-key">FOCUS:</span>
              <span className="t-id-value">Portal UX + Game</span>
            </div>
            <div className="t-id-line">
              <span className="t-id-key">NOW:</span>
              <span className="t-id-value t-highlight">Building Owltree Portal</span>
            </div>
            <hr className="t-id-divider" />
            <div className="t-id-line">
              <span className="t-id-key">GITHUB:</span>
              <span className="t-id-value" style={{ color: 'var(--t-dim)' }}>github.com/lazyfier</span>
            </div>
          </div>
        </div>

        <div className="t-right-area t-glass">
          <div className="t-terminal-header">➜  ~/projects git:(main) ls -la</div>
          <div className="t-terminal-content">
            <div className="t-cmd-line" style={{ marginBottom: 16 }}>
              <span className="t-cmd-prompt" style={{ color: 'var(--green)', textShadow: '0 0 8px rgba(74, 222, 128, 0.5)' }}>➜  </span>
              <span className="t-cmd-input" style={{ color: 'var(--t-text)' }}>./show_projects.sh</span>
              <span className="t-cursor" />
            </div>

            <div style={{ marginTop: 4, paddingLeft: 16 }}>
              <div className="t-projects-output">
                {projects.map((p) => {
                  const isClickable = p.url !== '#'
                  const Tag = isClickable ? 'button' : 'div'
                  return (
                    <Tag
                      key={p.id}
                      data-entry-id={p.id}
                      type={isClickable ? 'button' : undefined}
                      className={['t-project-entry', isClickable ? 'bg-transparent border-0 p-0 m-0 cursor-pointer text-left w-full font-[inherit] text-[inherit]' : 'opacity-60 cursor-default'].join(' ')}
                      onMouseEnter={() => handleMouseEnter(p.id)}
                      onMouseLeave={() => handleMouseLeave(p.id)}
                      {...(isClickable ? { onClick: () => navigate(p.url) } : {})}
                    >
                    <span
                      className="t-project-name"
                      style={p.color !== 'var(--yellow)' ? { color: p.color, textShadow: `0 0 8px ${p.color.replace(')', ', 0.4)')}` } : undefined}
                    >
                      {p.name}
                    </span>
                    <div className="t-project-bar">
                      <div
                        className="t-project-bar-fill"
                        style={{
                          width: p.progress + '%',
                          ...(p.gradient ? { background: p.gradient } : {}),
                        }}
                      />
                    </div>
                    <span
                      className="t-project-percent"
                      style={p.color !== 'var(--yellow)' ? { color: p.color } : undefined}
                    >
                      {p.progress}%
                    </span>

                    <div
                      className="t-hover-card"
                      ref={(el) => {
                        if (el) cardRefs.current.set(p.id, el)
                      }}
                    >
                      <div className="t-hc-header">
                        <span className="t-hc-title" style={p.color !== 'var(--yellow)' ? { color: p.color } : undefined}>
                          {p.name}
                        </span>
                        <span className={`t-hc-status t-${p.status}`}>
                          {p.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="t-hc-desc">{p.description}</div>
                      <div className="t-hc-meta">
                        <div className="t-hc-row">
                          <span className="t-hc-label">STACK</span>
                          <span className="t-hc-val">{p.stack}</span>
                        </div>
                        <div className="t-hc-row">
                          <span className="t-hc-label">LAST</span>
                          <span className="t-hc-val">{p.lastUpdate}</span>
                        </div>
                        <div className="t-hc-row">
                          <span className="t-hc-label">{p.extraLabel}</span>
                          <span className="t-hc-val">{p.extra}</span>
                        </div>
                      </div>
                      <div className="t-hc-tags">
                        {p.tags.map((tag) => (
                          <span key={tag} className="t-hc-tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                    </Tag>
                  )
                })}
              </div>
            </div>

            <div className="t-cmd-line" style={{ marginTop: 24, marginBottom: 16 }}>
              <span className="t-cmd-prompt" style={{ color: 'var(--green)', textShadow: '0 0 8px rgba(74, 222, 128, 0.5)' }}>➜  </span>
              <span className="t-cmd-input" style={{ color: 'var(--t-text)' }}>./list_modules.sh</span>
            </div>

            <div style={{ marginTop: 4, paddingLeft: 16 }}>
              <div className="t-module-list">
                {modules.map((m) => (
                  <button
                    key={m.label}
                    type="button"
                    className={`t-module-item bg-transparent border border-current p-0 m-0 cursor-pointer font-[inherit] text-[inherit] ${m.color}`}
                    style={m.inlineColor !== 'var(--cyan)' ? { color: m.inlineColor, borderColor: m.inlineColor.replace(')', ', 0.3)') } : undefined}
                    onClick={() => navigate(m.href)}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="t-cmd-line" style={{ marginTop: 24 }}>
              <span className="t-cmd-prompt" style={{ color: 'var(--green)', textShadow: '0 0 8px rgba(74, 222, 128, 0.5)' }}>➜  </span>
              <span className="t-cursor" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
