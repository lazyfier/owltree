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

export function projectEnvKey(id: string, kind: 'link' | 'visible'): string {
  const normalizedId = id
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()

  return `VITE_PROJECT_${kind.toUpperCase()}_${normalizedId}`
}

export function isExternalProjectUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

export function getProjectLink(id: string): string {
  return projectLink(projectEnvKey(id, 'link'))
}

export function getProjectVisibility(id: string): boolean {
  return projectVisible(projectEnvKey(id, 'visible'))
}
