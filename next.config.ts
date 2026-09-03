import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // output: 'export' intentionnellement absent — on a besoin des API routes et du ISR
  async redirects() {
    return [
      // --- Consolidation SEO : une seule landing pour le guide vendeur ---
      { source: '/vendre-sans-agence', destination: '/guide-vendeur', permanent: true },
      { source: '/guide', destination: '/guide-vendeur', permanent: true },
      { source: '/guide-organique', destination: '/guide-vendeur', permanent: true },
      { source: '/vendre-organique', destination: '/guide-vendeur', permanent: true },
      // --- Migration des pages communes : /marche -> /immobilier ---
      // /marche pointait vers le hub /immobilier, supprime avec la refonte : on
      // renvoie desormais vers l'accueil. Les pages communes, elles, restent.
      { source: '/marche', destination: '/', permanent: true },
      { source: '/marche/:commune', destination: '/immobilier/:commune', permanent: true },
      // --- Refonte 2026-09 : le site public passe a 6 pages ---
      // Regle sans exception : jamais de suppression sans sa 301.
      // Vers la landing du guide, sortie de conversion unique du site.
      { source: '/vendre', destination: '/guide-vendeur', permanent: true },
      { source: '/avis-de-valeur-immobilier', destination: '/guide-vendeur', permanent: true },
      { source: '/audit', destination: '/guide-vendeur', permanent: true },
      // Vers l'accueil.
      { source: '/acheter', destination: '/', permanent: true },
      { source: '/a-propos', destination: '/', permanent: true },
      { source: '/avis', destination: '/', permanent: true },
      { source: '/contact', destination: '/', permanent: true },
      { source: '/immobilier', destination: '/', permanent: true },
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
