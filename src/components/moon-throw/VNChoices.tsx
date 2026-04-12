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
          className={`vn-choice choice-reveal ${choice.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <span className="mr-2">▸</span>
          <span>{choice.text}</span>
        </button>
      ))}
    </div>
  )
}
