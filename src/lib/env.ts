/**
 * Variables d'environnement typées.
 * Toujours importer depuis ce fichier, jamais directement process.env.
 */
export const env = {
  /** URL de l'app assistant */
  assistantAppUrl: process.env.NEXT_PUBLIC_ASSISTANT_APP_URL ?? '',

  /** Lien Cal.com pour la prise de RDV */
  calcomUrl:
    process.env.NEXT_PUBLIC_CALCOM_URL ?? 'https://cal.eu/alex-lopez-iad/30min',

  /** URL des annonces IAD (vide = /biens placeholder) */
  iadListingsUrl: process.env.NEXT_PUBLIC_IAD_LISTINGS_URL ?? '',

  /** URL du site (canonicals SEO) */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr',
} as const

/** Retourne l'URL app+chemin, ou le fallback si l'app n'est pas configurée */
export function appUrl(path: string, fallback = '/assistant'): string {
  if (!env.assistantAppUrl) return fallback
  return `${env.assistantAppUrl}${path}`
}

/** URL pour consulter les biens */
export function biensUrl(): string {
  return env.iadListingsUrl || '/biens'
}
