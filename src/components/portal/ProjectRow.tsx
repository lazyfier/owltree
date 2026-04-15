import { type Project } from '@/data/projects'
import { useHoverCard } from '@/hooks/useHoverCard'

interface ProjectRowProps {
  project: Project
  onNavigate: (url: string) => void
}

function projectColorStyle(color: string, shadow = false) {
  if (color === 'var(--yellow)') return undefined
  return shadow
    ? { color, textShadow: `0 0 8px ${color.replace(')', ', 0.4)')}` }
    : { color }
}

export function ProjectRow({ project: p, onNavigate }: ProjectRowProps) {
  const { anchorRef, show, hide, renderPortal } = useHoverCard()
  const isClickable = p.url !== '#'
  const Tag = isClickable ? 'button' : 'div'

  return (
    <>
      <Tag
        ref={anchorRef as React.Ref<HTMLButtonElement & HTMLDivElement>}
        type={isClickable ? 'button' : undefined}
        className={[
          't-project-entry',
          isClickable
            ? 'bg-transparent border-0 p-0 m-0 cursor-pointer text-left w-full font-[inherit] text-[inherit]'
            : 'opacity-60 cursor-default',
        ].join(' ')}
        onMouseEnter={show}
        onMouseLeave={hide}
        {...(isClickable ? { onClick: () => onNavigate(p.url) } : {})}
      >
        <span
          className="t-project-name"
          style={projectColorStyle(p.color, true)}
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
          style={projectColorStyle(p.color)}
        >
          {p.progress}%
        </span>
      </Tag>

      {renderPortal(
        <>
          <div className="t-hc-header">
            <span className="t-hc-title" style={projectColorStyle(p.color)}>
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
        </>,
      )}
    </>
  )
}
