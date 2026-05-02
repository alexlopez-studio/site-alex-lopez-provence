import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import EditorialPage from '@/components/editorial/EditorialPage'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('acheter')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function AcheterPage() {
  const t = await getTranslations('acheter')
  const faq = [1, 2, 3, 4].map(function (n) {
    return { q: t('q' + n + 'q'), a: t('q' + n + 'a') }
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
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML= __html: JSON.stringify(jsonLd)  />
      <EditorialPage namespace="acheter" simulatorHref="/outils/acheter" />
    </>
  )
}
