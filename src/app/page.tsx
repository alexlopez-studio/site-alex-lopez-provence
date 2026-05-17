import type { Metadata } from 'next'
import { env } from '@/lib/env'
import { getFeaturedArticles } from '@/lib/sanity.queries'
import HomepageContent from '@/components/home/HomepageContent'

export const metadata: Metadata = {
  title: 'Aide à la décision immobilière — Alex Lopez IAD Provence Verte & Verdon',
  description:
    'Des outils immobiliers gratuits et une analyse humaine pour estimer, vendre, acheter ou analyser un bien en Provence Verte et Verdon.',
  openGraph: {
    title: 'Alex Lopez — Outils & accompagnement immobilier en Provence Verte & Verdon',
    description:
      'Commencez par un premier repère, puis affinez votre projet avec une lecture locale du marché immobilier en Provence Verte & Verdon.',
    url: env.app.siteUrl,
  },
}

const FAQ_ITEMS = [
  { question: 'À quoi servent les outils immobiliers ?', answer: "Les outils permettent d’obtenir un premier repère : estimation d’un bien, préparation d’un achat ou analyse des points de vigilance. Ils ne remplacent pas l’analyse humaine, mais aident à cadrer le projet." },
  { question: 'Combien coûte une estimation immobilière en Provence Verte et Verdon ?', answer: "L’estimation est gratuite et sans engagement. Elle s’appuie sur les informations du bien, le marché local et une relecture humaine si vous souhaitez aller plus loin." },
  { question: 'Pourquoi une analyse humaine reste importante ?', answer: "Un outil ne voit pas tout : état réel, exposition, environnement, potentiel, qualité de la demande, marge de négociation. L’accompagnement sert à donner du sens au premier résultat." },
  { question: 'Quelles communes couvrez-vous en Provence Verte et Verdon ?', answer: "J’interviens sur l’ensemble de la Provence Verte et du Verdon : Barjols, Montmeyan, Quinson, Fox-Amphoux, Tavernes, Rians, Aups, Salernes, Ginasservis, Varages et les communes limitrophes." },
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
        description: 'Mandataire immobilier IAD en Provence Verte et Verdon. Outils immobiliers, estimation gratuite, vente et achat immobilier.',
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
