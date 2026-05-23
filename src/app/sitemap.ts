import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'
import { getAllArticleSlugs } from '@/lib/sanity.queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = env.app.siteUrl || 'https://alexlopez-provence.fr'
  const now = new Date()
  const staticRoutes = [
    '',
    '/avis-de-valeur-immobilier',
    '/vendre',
    '/acheter',
    '/audit',
    '/outils',
    '/outils/vendre',
    '/outils/acheter',
    '/outils/audit',
    '/blog',
    '/blog/vendre-sa-maison-sans-agence',
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
  const articleRoutes = articleSlugs
    .filter((slug) => slug !== 'vendre-sa-maison-sans-agence')
    .map(function (slug) {
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
      const isBlogArticle = route.startsWith('/blog/')
      return {
        url: siteUrl + route,
        lastModified: now,
        changeFrequency: route === '' ? 'weekly' as const : isBlogArticle ? 'weekly' as const : 'monthly' as const,
        priority: route === '' ? 1 : route === '/avis-de-valeur-immobilier' ? 0.95 : route.startsWith('/outils') ? 0.9 : isLocalMarketPage ? 0.85 : isBlogArticle ? 0.75 : 0.8,
      }
    }),
    ...articleRoutes,
  ]
}
