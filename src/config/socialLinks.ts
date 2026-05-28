const env = import.meta.env as Record<string, string | undefined>

export type SocialLinkId = 'github' | 'x' | 'email'

export interface SocialLink {
  id: SocialLinkId
  label: string
  href: string
}

function envValue(key: string): string {
  return env[key]?.trim() ?? ''
}

export function normalizeEmailHref(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  return trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`
}

export function getSocialLinks(): SocialLink[] {
  const links: SocialLink[] = [
    {
      id: 'github',
      label: 'GitHub',
      href: envValue('VITE_SOCIAL_GITHUB_URL') || 'https://github.com/lazyfier',
    },
    {
      id: 'x',
      label: 'X',
      href: envValue('VITE_SOCIAL_X_URL'),
    },
    {
      id: 'email',
      label: 'Email',
      href: normalizeEmailHref(envValue('VITE_SOCIAL_EMAIL')),
    },
  ]

  return links.filter((link) => link.href)
}
