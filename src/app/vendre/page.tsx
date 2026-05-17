import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import EditorialPage from '@/components/editorial/EditorialPage'
import { alignTerritory } from '@/lib/territory'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('vendre')
  return {
    title: alignTerritory(t('metaTitle')),
    description: alignTerritory(t('metaDescription')),
  }
}

export default async function VendrePage() {
  const t = await getTranslations('vendre')
  const faq = [1, 2, 3, 4].map(function (n) {
    return { q: alignTerritory(t('q' + n + 'q')), a: alignTerritory(t('q' + n + 'a')) }
  })
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(function (item) {
      return {
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      }
    }),
  }
  const jsonLdProps = { __html: JSON.stringify(jsonLd) }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdProps}
      />
      <EditorialPage namespace="vendre" simulatorHref="/outils/vendre" />
    </>
  )
}
