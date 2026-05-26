import { type ProjectId } from '@/config/projectLinks'

export interface Project {
  id: ProjectId
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
  // {
  //   id: 'owltree-portal',
  //   name: 'Owltree Portal',
  //   description: '个人门户主页，支持终端主题、游戏入口、模块系统。',
  //   url: PROJECT_LINKS['owltree-portal'],
  //   visible: PROJECT_VISIBILITY['owltree-portal'],
  //   isFrontendProject: true,
  //   tags: ['React', 'Tailwind', 'Design'],
  //   icon: '🦉',
  //   featured: false,
  //   progress: 62,
  //   status: 'active',
  //   color: 'var(--yellow)',
  //   gradient: '',
  //   stack: 'React + Vite',
  //   lastUpdate: 'today',
  //   updatedAt: projectUpdatedAt['owltree-portal'],
  //   extra: '★ 28',
  //   extraLabel: 'STARS',
  // },
  // {
  //   id: 'secret-project',
  //   name: 'Secret Project',
  //   description: '神秘项目，详情暂不公开。属于个人实验性探索方向。',
  //   url: PROJECT_LINKS['secret-project'],
  //   visible: PROJECT_VISIBILITY['secret-project'],
  //   isFrontendProject: false,
  //   tags: ['Private', 'Experiment'],
  //   icon: '🔐',
  //   featured: false,
  //   progress: 23,
  //   status: 'wip',
  //   color: 'var(--red)',
  //   gradient: 'linear-gradient(90deg, var(--red), var(--peach))',
  //   stack: 'TBD',
  //   lastUpdate: '1 week ago',
  //   updatedAt: projectUpdatedAt['secret-project'],
  //   extra: 'Private',
  //   extraLabel: 'VIS',
  // },
  // {
  //   id: 'api-gateway',
  //   name: 'API Gateway',
  //   description: '统一API网关，处理鉴权、限流、路由与日志聚合。',
  //   url: PROJECT_LINKS['api-gateway'],
  //   visible: PROJECT_VISIBILITY['api-gateway'],
  //   isFrontendProject: false,
  //   tags: ['Go', 'gRPC', 'Redis'],
  //   icon: '🚪',
  //   featured: false,
  //   progress: 45,
  //   status: 'active',
  //   color: 'var(--yellow)',
  //   gradient: '',
  //   stack: 'Go + gRPC',
  //   lastUpdate: '2 days ago',
  //   updatedAt: projectUpdatedAt['api-gateway'],
  //   extra: '4 services',
  //   extraLabel: 'DEPS',
  // },
  // {
  //   id: 'data-pipeline',
  //   name: 'Data Pipeline',
  //   description: '数据采集与ETL管道，支持多源接入和实时流处理。',
  //   url: PROJECT_LINKS['data-pipeline'],
  //   visible: PROJECT_VISIBILITY['data-pipeline'],
  //   isFrontendProject: false,
  //   tags: ['Python', 'Airflow', 'Kafka'],
  //   icon: '📊',
  //   featured: false,
  //   progress: 71,
  //   status: 'active',
  //   color: 'var(--yellow)',
  //   gradient: '',
  //   stack: 'Python',
  //   lastUpdate: 'yesterday',
  //   updatedAt: projectUpdatedAt['data-pipeline'],
  //   extra: '3 active',
  //   extraLabel: 'SOURCES',
  // },
  // {
  //   id: 'design-system',
  //   name: 'Design System',
  //   description: '统一设计语言，包含Token、组件库和文档站点。',
  //   url: PROJECT_LINKS['design-system'],
  //   visible: PROJECT_VISIBILITY['design-system'],
  //   isFrontendProject: true,
  //   tags: ['Figma', 'Storybook'],
  //   icon: '🎨',
  //   featured: false,
  //   progress: 34,
  //   status: 'wip',
  //   color: 'var(--yellow)',
  //   gradient: '',
  //   stack: 'Figma',
  //   lastUpdate: '5 days ago',
  //   updatedAt: projectUpdatedAt['design-system'],
  //   extra: '24 defined',
  //   extraLabel: 'TOKENS',
  // },
  // {
  //   id: 'neobrutal-ui',
  //   name: 'NeoBrutal UI',
  //   description: '新野兽主义UI组件库，粗边框 + 高对比 + 强排版。',
  //   url: PROJECT_LINKS['neobrutal-ui'],
  //   visible: PROJECT_VISIBILITY['neobrutal-ui'],
  //   isFrontendProject: true,
  //   tags: ['React', 'CSS', 'A11y'],
  //   icon: '💥',
  //   featured: false,
  //   progress: 56,
  //   status: 'active',
  //   color: 'var(--pink)',
  //   gradient: 'linear-gradient(90deg, var(--pink), var(--mauve))',
  //   stack: 'React + CSS',
  //   lastUpdate: 'today',
  //   updatedAt: projectUpdatedAt['neobrutal-ui'],
  //   extra: '18 shipped',
  //   extraLabel: 'COMPS',
  // },
  // {
  //   id: 'cli-toolkit',
  //   name: 'CLI Toolkit',
  //   description: '开发者命令行工具集，代码生成、部署自动化等。',
  //   url: PROJECT_LINKS['cli-toolkit'],
  //   visible: PROJECT_VISIBILITY['cli-toolkit'],
  //   isFrontendProject: false,
  //   tags: ['Rust', 'CLI'],
  //   icon: '⌨️',
  //   featured: false,
  //   progress: 12,
  //   status: 'planning',
  //   color: 'var(--yellow)',
  //   gradient: '',
  //   stack: 'Rust',
  //   lastUpdate: '2 weeks ago',
  //   updatedAt: projectUpdatedAt['cli-toolkit'],
  //   extra: '3 planned',
  //   extraLabel: 'CMDS',
  // },
  // {
  //   id: 'ai-agent',
  //   name: 'AI Agent',
  //   description: '自主AI代理框架，支持工具调用与多Agent协作。',
  //   url: PROJECT_LINKS['ai-agent'],
  //   visible: PROJECT_VISIBILITY['ai-agent'],
  //   isFrontendProject: false,
  //   tags: ['Python', 'LLM', 'MCP'],
  //   icon: '🤖',
  //   featured: false,
  //   progress: 8,
  //   status: 'planning',
  //   color: 'var(--cyan)',
  //   gradient: 'linear-gradient(90deg, var(--cyan), var(--blue))',
  //   stack: 'Python',
  //   lastUpdate: '3 days ago',
  //   updatedAt: projectUpdatedAt['ai-agent'],
  //   extra: 'Research',
  //   extraLabel: 'PHASE',
  // },
]

export const visibleProjects = projects.filter((project) => project.visible)

export const frontendProjects = visibleProjects.filter((project) => project.isFrontendProject)
