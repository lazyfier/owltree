const env = import.meta.env as Record<string, string | undefined>

function projectLink(envKey: string, fallback = '#'): string {
  const value = env[envKey]?.trim()
  return value || fallback
}

export function isExternalProjectUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export const PROJECT_LINKS = {
  'moon-throw': '/moon-throw',
  'owltree-portal': projectLink('VITE_PROJECT_LINK_OWLTREE_PORTAL'),
  'secret-project': projectLink('VITE_PROJECT_LINK_SECRET_PROJECT'),
  'api-gateway': projectLink('VITE_PROJECT_LINK_API_GATEWAY'),
  'data-pipeline': projectLink('VITE_PROJECT_LINK_DATA_PIPELINE'),
  'design-system': projectLink('VITE_PROJECT_LINK_DESIGN_SYSTEM'),
  'neobrutal-ui': projectLink('VITE_PROJECT_LINK_NEOBRUTAL_UI'),
  'cli-toolkit': projectLink('VITE_PROJECT_LINK_CLI_TOOLKIT'),
  'ai-agent': projectLink('VITE_PROJECT_LINK_AI_AGENT'),
} as const

export type ProjectId = keyof typeof PROJECT_LINKS
