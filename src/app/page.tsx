import type { Metadata } from 'next'
import { env } from '@/lib/env'
import { getFeaturedArticles } from '@/lib/sanity.queries'
import HomepageContent from '@/components/home/HomepageContent'

export const metadata: Metadata = {
  title: 'Mandataire Immobilier Provence Verte & Verdon — Alex Lopez IAD',
  description:
    'Alex Lopez, mandataire IAD en Provence Verte et Verdon. Estimation gratuite, vente et achat immobilier. Prix du marché local + accompagnement personnalisé.',
  openGraph: {
    title: 'Alex Lopez — Mandataire IAD Provence Verte & Verdon',
    description:
      'Estimation gratuite, prix du marché local, accompagnement de A à Z. Réseau IAD — Barjols, Montmeyan, Quinson, Aups, Salernes, Rians.',
    url: env.app.siteUrl,
  },
}

const FAQ_ITEMS = [
  { question: 'Quelle est la différence entre un mandataire et une agence immobilière ?', answer: "Un mandataire immobilier est un professionnel indépendant rattaché à un réseau (ici IAD France). Il propose les mêmes services qu'une agence — estimation, vente, achat — avec des frais de structure réduits." },
  { question: 'Combien coûte une estimation immobilière en Provence Verte et Verdon ?', answer: "L'estimation est gratuite et sans engagement. Elle s'appuie sur les prix réels des ventes récentes dans votre secteur et sur une lecture locale du marché." },
  { question: 'Quelles communes couvrez-vous en Provence Verte et Verdon ?', answer: "J'interviens sur l'ensemble de la Provence Verte et du Verdon : Barjols, Montmeyan, Quinson, Fox-Amphoux, Tavernes, Rians, Aups, Salernes, Ginasservis, Varages et les communes limitrophes." },
  { question: 'Comment démarrer un projet immobilier ?', answer: "Vous pouvez utiliser les outils en ligne pour obtenir un premier repère, puis me contacter pour affiner votre projet avec une analyse personnalisée." },
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
        name: 'Alex Lopez — Mandataire Immobilier IAD',
        description: 'Mandataire immobilier IAD en Provence Verte et Verdon. Estimation gratuite, vente et achat immobilier.',
        url: siteUrl,
        telephone: PHONE_RAW,
        areaServed: ['Provence Verte', 'Verdon', 'Provence Verdon', 'Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux', 'Tavernes', 'Rians', 'Aups', 'Salernes', 'Ginasservis', 'Varages'],
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
