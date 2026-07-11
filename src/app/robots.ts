import type { MetadataRoute } from 'next'
import { env } from '@/lib/env'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = env.app.siteUrl || 'https://alexandrelopez.fr'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/app', '/dashboard', '/espace-client'],
    },
    sitemap: siteUrl + '/sitemap.xml',
  }
}
