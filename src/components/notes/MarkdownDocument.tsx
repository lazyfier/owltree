import { Children, isValidElement } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownDocumentProps {
  content: string
  currentSlug?: string
  resolveInternalHref?: (fromSlug: string, href: string) => string | null
}

export function MarkdownDocument({ content, currentSlug, resolveInternalHref }: MarkdownDocumentProps) {
  return (
    <div className="note-md-document">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="note-md-heading note-md-heading-1">{children}</h1>,
          h2: ({ children }) => <h2 className="note-md-heading note-md-heading-2">{children}</h2>,
          h3: ({ children }) => <h3 className="note-md-heading note-md-heading-3">{children}</h3>,
          p: ({ children }) => {
            const hasBlockChild = Children.toArray(children).some((child) => {
              return isValidElement(child) && (
                child.type === 'pre' ||
                child.type === 'div' ||
                child.type === 'table' ||
                child.type === 'blockquote' ||
                child.type === 'ul' ||
                child.type === 'ol'
              )
            })

            if (hasBlockChild) {
              return <div className="note-md-paragraph-block">{children}</div>
            }

            return <p className="note-md-paragraph">{children}</p>
          },
          ul: ({ children }) => <ul className="note-md-list">{children}</ul>,
          ol: ({ children }) => <ol className="note-md-list">{children}</ol>,
          hr: () => <hr className="note-md-rule" />,
          blockquote: ({ children }) => <blockquote className="note-md-quote">{children}</blockquote>,
          pre: ({ children }) => <pre className="note-md-code">{children}</pre>,
          code(props) {
            const { inline, className, children, ...rest } = props as {
              inline?: boolean
              className?: string
              children?: React.ReactNode
            }

            if (inline) {
              return (
                <code className="note-md-inline-code" {...rest}>
                  {children}
                </code>
              )
            }

            return (
              <code className={className} {...rest}>
                {children}
              </code>
            )
          },
          table: ({ children }) => (
            <div className="note-md-table-wrap">
              <table className="note-md-table">{children}</table>
            </div>
          ),
          li: ({ children }) => <li className="note-md-list-item">{children}</li>,
          input: ({ checked, disabled, type }) => {
            if (type !== 'checkbox') {
              return null
            }

            return (
              <span
                aria-hidden="true"
                className={`note-md-task-checkbox ${checked ? 'is-checked' : ''} ${disabled ? 'is-disabled' : ''}`}
              >
                {checked ? 'x' : ' '}
              </span>
            )
          },
          a: ({ href, children }) => {
            if (!href) {
              return <span>{children}</span>
            }

            const internalHref = currentSlug && resolveInternalHref
              ? resolveInternalHref(currentSlug, href)
              : null

            if (internalHref) {
              return (
                <a className="note-md-link" href={internalHref}>
                  {children}
                </a>
              )
            }

            return (
              <a className="note-md-link" href={href} target="_blank" rel="noreferrer">
                {children}
              </a>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
