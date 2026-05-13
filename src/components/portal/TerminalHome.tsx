import { useNavigate } from 'react-router-dom'
import { isExternalProjectUrl } from '@/config/projectLinks'
import { projects } from '@/data/projects'
import { ProjectRow } from '@/components/portal/ProjectRow'

const modules = [
  { label: 'GAMES', color: 't-m-mauve', inlineColor: 'var(--mauve)', href: '/games' },
  { label: 'NOTES', color: 't-m-cyan', inlineColor: 'var(--cyan)', href: '/notes' },
  { label: 'TOOLS', color: 't-m-yellow', inlineColor: 'var(--yellow)', href: '/tools' },
  { label: 'TRENDS', color: 't-m-teal', inlineColor: 'var(--teal)', href: '/trends' },
]

const stackRows = [
  [
    { name: 'React', color: 'var(--cyan)' },
    { name: 'TypeScript', color: 'var(--blue)' },
    { name: 'Go', color: 'var(--teal)' },
    { name: 'Python', color: 'var(--yellow)' },
  ],
  [
    { name: 'Node.js', color: 'var(--mauve)' },
    { name: 'Rust', color: 'var(--peach)' },
    { name: 'Figma', color: 'var(--pink)' },
  ],
]

function StackLine({ items }: { items: { name: string; color: string }[] }) {
  return (
    <div className="t-id-line" style={{ paddingLeft: 24 }}>
      {items.map((s, i) => (
        <span key={s.name}>
          <span className="t-id-value" style={{ color: s.color }}>{s.name}</span>
          {i < items.length - 1 && (
            <span className="t-id-value" style={{ color: 'var(--t-subtle)' }}> · </span>
          )}
        </span>
      ))}
    </div>
  )
}

function ModuleItem({ m, onNavigate }: { m: typeof modules[number]; onNavigate: (href: string) => void }) {
  const isCyan = m.inlineColor === 'var(--cyan)'
  return (
    <button
      type="button"
      className={`t-module-item bg-transparent border border-current p-0 m-0 cursor-pointer font-[inherit] text-[inherit] ${m.color}`}
      style={isCyan ? undefined : { color: m.inlineColor, borderColor: m.inlineColor.replace(')', ', 0.3)') }}
      onClick={() => onNavigate(m.href)}
    >
      {m.label}
    </button>
  )
}

export function TerminalHome() {
  const navigate = useNavigate()

  const handleProjectNavigate = (url: string) => {
    if (isExternalProjectUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }

    navigate(url)
  }

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
            {stackRows.map((row) => (
              <StackLine key={row[0].name} items={row} />
            ))}
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
                {projects.map((p) => (
                  <ProjectRow key={p.id} project={p} onNavigate={handleProjectNavigate} />
                ))}
              </div>
            </div>

            <div className="t-cmd-line" style={{ marginTop: 24, marginBottom: 16 }}>
              <span className="t-cmd-prompt" style={{ color: 'var(--green)', textShadow: '0 0 8px rgba(74, 222, 128, 0.5)' }}>➜  </span>
              <span className="t-cmd-input" style={{ color: 'var(--t-text)' }}>./list_modules.sh</span>
            </div>

            <div style={{ marginTop: 4, paddingLeft: 16 }}>
              <div className="t-module-list">
                {modules.map((m) => (
                  <ModuleItem key={m.label} m={m} onNavigate={navigate} />
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
