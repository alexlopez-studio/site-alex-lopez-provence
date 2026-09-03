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

  // Refonte 2026-09 : le site public tient en 6 pages, toutes listees ici.
  //
  // Pages exclues volontairement :
  // - /vendre, /acheter, /audit, /a-propos, /contact, /avis,
  //   /avis-de-valeur-immobilier, /immobilier (hub) : supprimees, redirigees en 301
  // - /guide, /guide-organique, /vendre-organique, /vendre-sans-agence : redirigees (301) vers /guide-vendeur
  // - /guide-vendeur/consulter : consultation du guide, atteinte apres telechargement, en noindex
  // - /outils, /outils/acheter, /outils/audit, /resultats/[token] : en ligne mais
  //   invisibles — jamais liees, desindexees, hors sitemap
  // - /outils/vendre : redirigee vers le site iad
  // - /vendez-pro : en noindex tant qu'elle n'a pas remplace l'accueil
  const staticRoutes = [
    '',
    '/guide-vendeur',
    '/bio',
    '/blog',
    '/mentions-legales',
    '/politique-confidentialite',
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
    if (route === '/guide-vendeur') return 0.95
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
