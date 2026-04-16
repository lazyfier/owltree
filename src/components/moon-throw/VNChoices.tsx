interface VNChoicesProps {
  choices: { text: string; disabled?: boolean }[]
  onSelect: (index: number) => void
  disabled?: boolean
}

export function VNChoices({ choices, onSelect, disabled = false }: VNChoicesProps) {
  return (
    <div className={`flex flex-col items-end space-y-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {choices.map((choice, index) => (
        <button
          key={`${choice.text}-${index}`}
          type="button"
          onClick={() => onSelect(index)}
          disabled={choice.disabled}
          className={`vn-choice choice-reveal ${choice.disabled ? 'vn-choice-disabled' : ''}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <span className="mr-2">{choice.disabled ? '✕' : '▸'}</span>
          <span>{choice.text}</span>
          {choice.disabled && <span className="ml-2 text-xs opacity-60">(不可用)</span>}
        </button>
      ))}
    </div>
  )
}
