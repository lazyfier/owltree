import { getProjectLink, getProjectVisibility } from '@/config/projectLinks'
import { projectUpdatedAt } from '@/data/contentMetadata.generated'

export interface Project {
  id: string
  name: string
  description: string
  url: string
  visible: boolean
  isFrontendProject: boolean
  tags: string[]
  icon: string
  featured: boolean
  progress: number
  status: 'active' | 'wip' | 'planning'
  color: string
  gradient: string
  stack: string
  lastUpdate: string
  updatedAt: string | null
  extra: string
  extraLabel: string
}

export const projects: Project[] = [
  {
    id: 'owltree-portal',
    name: 'owltree portal',
    description: '个人终端门户，集中浏览 notes 和 projects，并支持 Markdown 笔记发布。',
    url: getProjectLink('owltree-portal'),
    visible: getProjectVisibility('owltree-portal'),
    isFrontendProject: true,
    tags: ['React', 'Vite', 'Markdown'],
    icon: 'owltree',
    featured: true,
    progress: 78,
    status: 'active',
    color: 'var(--yellow)',
    gradient: '',
    stack: 'React + Vite',
    lastUpdate: 'local mtime',
    updatedAt: projectUpdatedAt['owltree-portal'],
    extra: 'notes/projects',
    extraLabel: 'SCOPE',
  },
]

export const visibleProjects = projects.filter((project) => project.visible)

export const frontendProjects = visibleProjects.filter((project) => project.isFrontendProject)
