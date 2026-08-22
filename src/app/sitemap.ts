import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'
import { getAllArticleSlugs } from '@/lib/sanity.queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = env.app.siteUrl || 'https://alexandrelopez.fr'
  const now = new Date()
  const staticRoutes = [
    '',
    '/avis-de-valeur-immobilier',
    '/vendre',
    '/vendre-sans-agence',
    '/guide',
    '/guide-vendeur',
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
    '/marche',
    '/marche/barjols',
    '/marche/cotignac',
    '/marche/lorgues',
    '/marche/brignoles',
    '/marche/ponteves',
    '/avis',
  ]

  const articleSlugs = await getAllArticleSlugs()
  const articleRoutes = articleSlugs.map(function (slug) {
    return {
      url: siteUrl + '/blog/' + slug,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }
  })

  return [
    ...staticRoutes.map(function (route) {
      const isLocalMarketPage = route.startsWith('/marche/')
      return {
        url: siteUrl + route,
        lastModified: now,
        changeFrequency: route === '' ? 'weekly' as const : 'monthly' as const,
        priority: route === '' ? 1 : route === '/avis-de-valeur-immobilier' ? 0.95 : route.startsWith('/outils') ? 0.9 : isLocalMarketPage ? 0.85 : 0.8,
      }
    }),
    ...articleRoutes,
  ]
}
