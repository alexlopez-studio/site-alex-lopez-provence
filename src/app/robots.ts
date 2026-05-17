import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.app.siteUrl || 'https://alexlopez-provence.fr'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin'],
    },
    sitemap: siteUrl + '/sitemap.xml',
  }
}
