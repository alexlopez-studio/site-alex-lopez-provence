export const env = {
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  resend: { apiKey: process.env.RESEND_API_KEY },
  attio: { apiKey: process.env.ATTIO_API_KEY },
  admin: { password: process.env.ADMIN_PASSWORD ?? '' },
  app: {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr',
    calcomUrl: process.env.NEXT_PUBLIC_CALCOM_URL ?? 'https://cal.com/alex-lopez/consultation-gratuite',
    iadListingsUrl: process.env.NEXT_PUBLIC_IAD_LISTINGS_URL ?? '',
  },
} as const

/**
 * Construit une URL vers l'app SaaS (app.alexlopez-provence.fr).
 * - Retourne '' si NEXT_PUBLIC_APP_URL n'est pas configuré : l'appelant decide du fallback.
 * - path '' retourne la racine de l'app (sans slash final).
 */
export function appUrl(path: string = ''): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? ''
  if (!base) return ''
  const trimmed = base.replace(/\/$/, '')
  if (!path) return trimmed
  return trimmed + (path.startsWith('/') ? path : '/' + path)
}

/**
 * URL publique des biens Alex Lopez sur IAD (ou '' si non configurée).
 */
export function biensUrl(): string {
  return env.app.iadListingsUrl || ''
}
