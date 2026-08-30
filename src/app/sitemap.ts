import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'
import { getAllArticleSlugs } from '@/lib/sanity.queries'
import { LOCAL_PAGE_SLUGS } from '@/data/local-pages'

/**
 * Date de référence du contenu statique.
 *
 * On n'utilise volontairement PAS `new Date()` : dater toutes les pages à
 * l'instant du build revient à déclarer le site entier modifié à chaque
 * déploiement, ce qui rend le signal `lastmod` inutilisable pour Google.
 * Cette constante se met à jour à la main quand le contenu change réellement.
 */
const STATIC_CONTENT_UPDATED_AT = new Date('2026-08-29')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = env.app.siteUrl || 'https://alexandrelopez.fr'

  // Pages exclues volontairement :
  // - /guide, /guide-organique, /vendre-organique : redirigées (301) vers /vendre-sans-agence
  // - /guide-vendeur : lecteur du guide, en noindex
  // - /vendez-pro : en noindex
  // - /outils/vendre : redirigée vers le site iad
  const staticRoutes = [
    '',
    '/avis-de-valeur-immobilier',
    '/vendre',
    '/vendre-sans-agence',
    '/acheter',
    '/audit',
    '/outils',
    '/outils/acheter',
    '/outils/audit',
    '/blog',
    '/a-propos',
    '/contact',
    '/mentions-legales',
    '/politique-confidentialite',
    '/immobilier',
    '/avis',
  ]

  // Les pages communes sont générées depuis la même source que les pages
  // elles-mêmes : ajouter une commune dans src/data/local-pages.ts suffit.
  const communeRoutes = LOCAL_PAGE_SLUGS.map(function (slug) {
    return '/immobilier/' + slug
  })

  const articleSlugs = await getAllArticleSlugs()
  const articleRoutes = articleSlugs.map(function (slug) {
    return {
      url: siteUrl + '/blog/' + slug,
      lastModified: STATIC_CONTENT_UPDATED_AT,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  function priorityFor(route: string) {
    if (route === '') return 1
    if (route === '/avis-de-valeur-immobilier') return 0.95
    if (route.startsWith('/outils')) return 0.9
    if (route.startsWith('/immobilier/')) return 0.85
    return 0.8
  }

  return [
    ...[...staticRoutes, ...communeRoutes].map(function (route) {
      return {
        url: siteUrl + route,
        lastModified: STATIC_CONTENT_UPDATED_AT,
        changeFrequency: route === '' ? ('weekly' as const) : ('monthly' as const),
        priority: priorityFor(route),
      }
    }),
    ...articleRoutes,
  ]
}
