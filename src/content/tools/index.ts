import { shortLinkTool } from './short-link'
import type { ToolManifest } from './types'

export type { ToolManifest } from './types'

export const tools: ToolManifest[] = [
  shortLinkTool,
]
