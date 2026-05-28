interface ShortcutHelpProps {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const shortcuts = [
  { keys: ['?'], description: 'Open keyboard shortcuts' },
  { keys: ['h'], description: 'Go to home' },
  { keys: ['n'], description: 'Go to notes' },
  { keys: ['p'], description: 'Go to projects' },
  { keys: ['t'], description: 'Go to tools' },
  { keys: ['Esc'], description: 'Go to parent level or close shortcut help' },
]

function ShortcutKey({ value }: { value: string }) {
  return <kbd className="shortcut-key">{value}</kbd>
}

export function ShortcutHelp({ isOpen, onOpen, onClose }: ShortcutHelpProps) {
  return (
    <>
      <button
        type="button"
        className="shortcut-hint"
        aria-label="Keyboard shortcuts"
        onClick={() => (isOpen ? onClose() : onOpen())}
      >
        <span className="shortcut-hint-key">?</span>
        <span className="shortcut-hint-text">Shortcuts</span>
      </button>

      {isOpen ? (
        <div className="shortcut-overlay" role="presentation" onClick={onClose}>
          <section
            className="shortcut-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="shortcut-panel-header">
              <span>Keyboard shortcuts</span>
              <button type="button" className="shortcut-close" aria-label="Close keyboard shortcuts" onClick={onClose}>
                Esc
              </button>
            </div>
            <div className="shortcut-list">
              {shortcuts.map((shortcut) => (
                <div key={shortcut.description} className="shortcut-row">
                  <div className="shortcut-keys">
                    {shortcut.keys.map((key) => (
                      <ShortcutKey key={key} value={key} />
                    ))}
                  </div>
                  <span className="shortcut-description">{shortcut.description}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
