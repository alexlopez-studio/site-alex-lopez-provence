import type { Metadata } from 'next'
import { env } from '@/lib/env'
import { getFeaturedArticles } from '@/lib/sanity.queries'
import HomepageContent from '@/components/home/HomepageContent'

export const metadata: Metadata = {
  title: 'Conseiller immobilier iad France — Provence Verte & Verdon',
  description:
    'Alexandre Lopez, conseiller immobilier iad France en Provence Verte & Verdon. Estimation gratuite, vente, achat et accompagnement local.',
  openGraph: {
    title: 'Alexandre Lopez — Conseiller immobilier iad France en Provence Verte & Verdon',
    description:
      'Estimez votre bien gratuitement et avancez avec un conseiller immobilier local en Provence Verte & Verdon.',
    url: env.app.siteUrl,
  },
}

const FAQ_ITEMS = [
  { question: 'Combien coûte une estimation immobilière en Provence Verte & Verdon ?', answer: "L’estimation est gratuite et sans engagement. Elle sert à obtenir un premier repère avant une analyse plus complète du bien et de son secteur." },
  { question: 'Quelles communes couvrez-vous ?', answer: "J’interviens sur l’ensemble de la Provence Verte & Verdon : Brignoles, Saint-Maximin, Barjols, Cotignac, Aups, Salernes, Montmeyan, Rians, Tavernes, Vinon-sur-Verdon et les communes limitrophes." },
  { question: 'Puis-je préparer un achat avec vous ?', answer: "Oui. Vous pouvez clarifier votre budget, vos critères et vos secteurs prioritaires grâce à l’outil achat, puis échanger avec moi pour affiner votre recherche." },
  { question: 'Pourquoi passer par un conseiller local ?', answer: "Un prix immobilier dépend fortement du village, de l’accès, du terrain, de l’état du bien, du DPE, de la demande locale et du potentiel. Une lecture locale permet de mieux décider." },
]

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
        description: 'Conseiller immobilier iad France en Provence Verte & Verdon. Estimation gratuite, vente et achat immobilier.',
        url: siteUrl,
        telephone: PHONE_RAW,
        areaServed: ['Provence Verte & Verdon', 'Provence Verte', 'Verdon', 'Brignoles', 'Saint-Maximin-la-Sainte-Baume', 'Barjols', 'Cotignac', 'Aups', 'Salernes', 'Montmeyan', 'Rians', 'Tavernes', 'Vinon-sur-Verdon'],
        address: { '@type': 'PostalAddress', addressRegion: 'Var', addressCountry: 'FR' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQ_ITEMS.map(function (item) {
          return { '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }
        }),
      },
    ],
  }
}

export default async function HomePage() {
  const jsonLd = buildJsonLd(env.app.siteUrl)
  const posts = await getFeaturedArticles(3)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(jsonLd)} />
      <HomepageContent posts={posts} />
    </>
  )
}
