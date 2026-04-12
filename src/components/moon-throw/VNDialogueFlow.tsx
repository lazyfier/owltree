import { useState, useCallback } from 'react'
import { VNDialogueBox } from './VNDialogueBox'
import { VNChoices } from './VNChoices'
import { DIALOGUE_TREES } from '@/game/data/dialogues'

interface VNDialogueFlowProps {
  personality: string
  partnerName: string
  onComplete: (effects: { frustration: number; anxiety: number }) => void
}

export function VNDialogueFlow({ personality, partnerName, onComplete }: VNDialogueFlowProps) {
  const [currentNodeId, setCurrentNodeId] = useState(`${personality}-start`)
  const [effects, setEffects] = useState({ frustration: 0, anxiety: 0 })
  const [isTyping, setIsTyping] = useState(true)

  const tree = DIALOGUE_TREES[personality as keyof typeof DIALOGUE_TREES] || DIALOGUE_TREES['mysterious']
  const currentNode = tree.find(n => n.id === currentNodeId)

  const handleChoice = useCallback((choiceIndex: number) => {
    if (!currentNode) return
    const choice = currentNode.choices[choiceIndex]
    if (!choice) return

    const newEffects = {
      frustration: effects.frustration + (choice.effects?.frustration || 0),
      anxiety: effects.anxiety + (choice.effects?.anxiety || 0),
    }

    if (currentNode.isEnd || choice.nextNodeId.endsWith('-end')) {
      onComplete(newEffects)
      return
    }

    setEffects(newEffects)
    setCurrentNodeId(choice.nextNodeId)
    setIsTyping(true)
  }, [currentNode, effects, onComplete])

  if (!currentNode) return null

  const speaker = currentNode.speaker === 'partner' ? partnerName : '你'

  return (
    <div className="space-y-4">
      <VNDialogueBox
        speaker={speaker}
        text={currentNode.text}
        onComplete={() => setIsTyping(false)}
        isTyping={isTyping}
      />
      
      {!isTyping && currentNode.choices.length > 0 && (
        <VNChoices
          choices={currentNode.choices}
          onSelect={handleChoice}
        />
      )}

      {!isTyping && currentNode.isEnd && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onComplete(effects)}
            className="vn-choice"
          >
            继续
          </button>
        </div>
      )}
    </div>
  )
}
