import { ShortLinkTool } from './ShortLinkTool'
import type { ToolManifest } from '@/content/tools/types'

export const shortLinkTool = {
  id: 'short-link',
  name: 'short-link',
  title: 'Short Link',
  command: './short-link',
  description: 'Store text or media behind a local terminal URL.',
  route: '/tools/short-link',
  tags: ['text', 'image', 'audio', 'video'],
  status: 'ready',
  Component: ShortLinkTool,
} as const satisfies ToolManifest
