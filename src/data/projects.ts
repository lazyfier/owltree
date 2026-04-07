export interface Project {
  id: string
  name: string
  description: string
  url: string
  tags: string[]
  icon: string
  featured: boolean
}

export const projects: Project[] = [
  { id: 'moon-throw', name: '月抛模拟器', description: '关于选择与后果的实验性互动叙事', url: '/moon-throw', tags: ['游戏', '教育'], icon: '🌙', featured: true },
  { id: 'placeholder-2', name: 'Coming Soon', description: '更多项目正在路上...', url: '#', tags: ['待定'], icon: '⚡', featured: false },
]
