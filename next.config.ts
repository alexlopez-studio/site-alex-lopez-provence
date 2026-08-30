import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // output: 'export' intentionnellement absent — on a besoin des API routes et du ISR
  async redirects() {
    return [
      // --- Consolidation SEO : une seule landing pour le guide vendeur ---
      { source: '/guide', destination: '/vendre-sans-agence', permanent: true },
      { source: '/guide-organique', destination: '/vendre-sans-agence', permanent: true },
      { source: '/vendre-organique', destination: '/vendre-sans-agence', permanent: true },
      // --- Migration des pages communes : /marche -> /immobilier ---
      { source: '/marche', destination: '/immobilier', permanent: true },
      { source: '/marche/:commune', destination: '/immobilier/:commune', permanent: true },
      {
        source: '/outils/vendre',
        destination: 'https://www.iadfrance.fr/conseiller-immobilier/alexandre.lopez/estimation',
        permanent: false,
      },
      {
        source: '/admin/market',
        destination: '/app/dashboard',
        permanent: false,
      },
      {
        source: '/admin/market/:path*',
        destination: '/app/:path*',
        permanent: false,
      },
      {
        source: '/app/dashboard/radar',
        destination: '/app/radar',
        permanent: false,
      },
      {
        source: '/app/zones',
        destination: '/app/settings?section=communes',
        permanent: false,
      },
      {
        source: '/app/dashboard/:path+',
        destination: '/app/:path*',
        permanent: false,
      },
      {
        source: '/dashboard',
        destination: '/app/dashboard',
        permanent: false,
      },
      {
        source: '/dashboard/radar',
        destination: '/app/radar',
        permanent: false,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/app/dashboard',
        destination: '/admin/market',
      },
      {
        source: '/app/:path*',
        destination: '/admin/market/:path*',
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default withNextIntl(nextConfig)
