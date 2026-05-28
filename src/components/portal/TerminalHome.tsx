import { useNavigate } from 'react-router-dom'
import { isExternalProjectUrl } from '@/config/projectLinks'
import { visibleProjects } from '@/data/projects'
import { OwltreeMark } from '@/components/portal/OwltreeMark'
import { ProjectRow } from '@/components/portal/ProjectRow'

const modules = [
  { label: 'notes', color: 't-m-cyan', inlineColor: 'var(--cyan)', href: '/notes' },
  { label: 'projects', color: 't-m-yellow', inlineColor: 'var(--yellow)', href: '/projects' },
  { label: 'tools', color: 't-m-mauve', inlineColor: 'var(--mauve)', href: '/tools' },
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
  const hasProjects = visibleProjects.length > 0

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
      </div>
      <div className="t-crt-lines" />

      <section className="t-screen">
        <div className="t-grid-furniture" aria-hidden="true">
          <span className="t-corner t-corner-tl" />
          <span className="t-corner t-corner-br" />
          <span className="t-axis t-axis-x" />
          <span className="t-axis t-axis-y" />
        </div>

        <div className="t-brand-lockup">
          <h1 className="t-mega-title">
            <span className="t-brand-token">
              <span className="t-brand-bracket">[</span>
              <span className="t-line-1">owltree</span>
              <span className="t-brand-bracket">]</span>
            </span>
            <span className="t-brand-pulse" aria-hidden="true" />
            <span className="t-line-2">system online</span>
          </h1>
        </div>

        <div className="t-identity">
          <div className="t-terminal-window t-glass">
            <div className="t-id-head">
              <div>
                <div className="t-id-command">➜  ~ whoami</div>
                <div className="t-id-manifesto">
                  Building systems at the edge of narrative and code.
                </div>
              </div>
              <OwltreeMark />
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
              <span className="t-id-value">Notes + Projects + Tools</span>
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
              <span className="t-cmd-prompt">➜  </span>
              <span className="t-cmd-input" style={{ color: 'var(--t-text)' }}>./list_modules.sh</span>
            </div>

            <div className="t-module-list">
              {modules.map((m) => (
                <ModuleItem key={m.label} m={m} onNavigate={navigate} />
              ))}
            </div>

            <div className="t-cmd-line" style={{ marginBottom: 16 }}>
              <span className="t-cmd-prompt">➜  </span>
              <span className="t-cmd-input" style={{ color: 'var(--t-text)' }}>./show_projects.sh</span>
              <span className="t-cursor" />
            </div>

            <div style={{ marginTop: 4, paddingLeft: 16 }}>
              <div className="t-projects-output">
                {hasProjects ? (
                  visibleProjects.map((p) => (
                    <ProjectRow key={p.id} project={p} onNavigate={handleProjectNavigate} />
                  ))
                ) : (
                  <div className="t-empty-output">$ echo "no visible projects"</div>
                )}
              </div>
            </div>

            <div className="t-cmd-line" style={{ marginTop: 24 }}>
              <span className="t-cmd-prompt">➜  </span>
              <span className="t-cursor" />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
