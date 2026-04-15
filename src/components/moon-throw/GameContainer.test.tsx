import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'

import { GameContainer } from './GameContainer'
import { GameIntro } from './GameIntro'
import { GameScenePanel } from './GameScenePanel'

describe('GameIntro', () => {
  it('renders the intro copy and start button', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()

    render(<GameIntro onStart={onStart} variants={{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }} />)

    expect(screen.getByRole('heading', { name: '月抛模拟器' })).toBeInTheDocument()
    expect(screen.getByText('Panic Edition')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '开始游戏' }))

    expect(onStart).toHaveBeenCalledTimes(1)
  })
})

describe('GameScenePanel', () => {
  it('renders action choices and disables blocked actions', () => {
    render(
      <GameScenePanel
        currentScene="action"
        partnerName="测试对象"
        flirtLine="你好"
        feedbackText="反馈"
        actionChoices={[
          { text: '戴套口交', disabled: false },
          { text: '无套口交', disabled: true },
        ]}
        onDialogueComplete={vi.fn()}
        onActionSelect={vi.fn()}
        onResultComplete={vi.fn()}
      />,
    )

    expect(screen.getByText('选择行动')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /戴套口交/ })).toBeEnabled()
    expect(screen.getByRole('button', { name: /无套口交/ })).toBeDisabled()
  })
})

describe('GameContainer', () => {
  it('starts from the intro screen and enters the play layout after starting', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <GameContainer />
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: '开始游戏' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '开始游戏' }))

    expect(await screen.findByText(/回合\s+1/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /试探聊天/ })).toBeInTheDocument()
  })

  it('selects an action and transitions into the result scene', async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <GameContainer />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: '开始游戏' }))
    expect(await screen.findByText(/回合\s+1/)).toBeInTheDocument()

    expect(await screen.findByText('选择行动')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /戴套口交/ }))

    await screen.findByRole('button', { name: '' })
    expect(screen.queryByText('选择行动')).not.toBeInTheDocument()
  })
})
