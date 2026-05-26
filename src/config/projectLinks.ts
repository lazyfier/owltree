const env = import.meta.env as Record<string, string | undefined>

function projectLink(envKey: string, fallback = '#'): string {
  const value = env[envKey]?.trim()
  return value || fallback
}

function projectVisible(envKey: string, fallback = true): boolean {
  const value = env[envKey]?.trim().toLowerCase()
  if (!value) {
    return fallback
  }

  if (value === 'false' || value === '0' || value === 'no' || value === 'hidden') {
    return false
  }

  if (value === 'true' || value === '1' || value === 'yes' || value === 'show') {
    return true
  }

  return fallback
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
  'owltree-portal': projectLink('VITE_PROJECT_LINK_OWLTREE_PORTAL'),
  'secret-project': projectLink('VITE_PROJECT_LINK_SECRET_PROJECT'),
  'api-gateway': projectLink('VITE_PROJECT_LINK_API_GATEWAY'),
  'data-pipeline': projectLink('VITE_PROJECT_LINK_DATA_PIPELINE'),
  'design-system': projectLink('VITE_PROJECT_LINK_DESIGN_SYSTEM'),
  'neobrutal-ui': projectLink('VITE_PROJECT_LINK_NEOBRUTAL_UI'),
  'cli-toolkit': projectLink('VITE_PROJECT_LINK_CLI_TOOLKIT'),
  'ai-agent': projectLink('VITE_PROJECT_LINK_AI_AGENT'),
} as const

export const PROJECT_VISIBILITY = {
  'owltree-portal': projectVisible('VITE_PROJECT_VISIBLE_OWLTREE_PORTAL'),
  'secret-project': projectVisible('VITE_PROJECT_VISIBLE_SECRET_PROJECT'),
  'api-gateway': projectVisible('VITE_PROJECT_VISIBLE_API_GATEWAY'),
  'data-pipeline': projectVisible('VITE_PROJECT_VISIBLE_DATA_PIPELINE'),
  'design-system': projectVisible('VITE_PROJECT_VISIBLE_DESIGN_SYSTEM'),
  'neobrutal-ui': projectVisible('VITE_PROJECT_VISIBLE_NEOBRUTAL_UI'),
  'cli-toolkit': projectVisible('VITE_PROJECT_VISIBLE_CLI_TOOLKIT'),
  'ai-agent': projectVisible('VITE_PROJECT_VISIBLE_AI_AGENT'),
} as const

export type ProjectId = keyof typeof PROJECT_LINKS
