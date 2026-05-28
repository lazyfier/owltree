import type { ComponentType } from 'react'

export interface ToolManifest {
  id: string
  name: string
  title: string
  command: string
  description: string
  route: string
  tags: readonly string[]
  status: 'ready' | 'wip'
  Component: ComponentType
}
