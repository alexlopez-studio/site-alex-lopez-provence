import type { Metadata } from 'next'
import { env } from '@/lib/env'
import { ConceptVendeurPage } from '@/components/concept/ConceptVendeurPage'

export const metadata: Metadata = {
  title: 'Alexandre Lopez — Conseiller Immobilier iad France | Provence & Côte d’Azur',
  description:
    'Vendez sans agence et sans commission grâce au guide complet et aux conseils d’Alexandre Lopez, conseiller immobilier en Provence & Côte d’Azur.',
  openGraph: {
    title: 'Alexandre Lopez — Vendez Comme Un Pro | Provence & Côte d’Azur',
    description:
      'Vendez sans agence et sans commission grâce au guide complet et aux conseils d’Alexandre Lopez, conseiller immobilier en Provence & Côte d’Azur.',
    url: env.app.siteUrl,
  },
}

const PHONE_RAW = '+33613180168'

function buildInnerHtml(data: object) {
  return { __html: JSON.stringify(data) }
}

function buildJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['RealEstateAgent', 'LocalBusiness'],
        '@id': siteUrl + '/#business',
        name: 'Alexandre Lopez — Conseiller immobilier iad France',
        description:
          'Conseiller immobilier iad France en Provence & Côte d’Azur. Vendez comme un pro sans agence et sans commission grâce au guide complet.',
        url: siteUrl,
        telephone: PHONE_RAW,
        areaServed: [
          'Provence & Côte d’Azur',
          'Haut-Var',
          'Provence Verte',
          'Pays d’Aix',
          'Var',
          'Brignoles',
          'Saint-Maximin-la-Sainte-Baume',
          'Barjols',
          'Cotignac',
          'Aups',
          'Salernes',
          'Montmeyan',
          'Rians',
          'Tavernes',
          'Vinon-sur-Verdon',
        ],
        address: { '@type': 'PostalAddress', addressRegion: 'Var', addressCountry: 'FR' },
      },
    ],
  }
}

export default function HomePage() {
  const jsonLd = buildJsonLd(env.app.siteUrl)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(jsonLd)} />
      <ConceptVendeurPage />
    </>
  )
}
