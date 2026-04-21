import type { Metadata } from 'next'
import { env } from '@/lib/env'
import HomepageContent from '@/components/home/HomepageContent'

export const metadata: Metadata = {
  title: 'Mandataire Immobilier Provence Verte & Haut-Var — Alex Lopez IAD',
  description:
    'Alex Lopez, mandataire IAD en Provence Verte et Haut-Var. Estimation gratuite, vente et achat immobilier. Prix du marché local + accompagnement personnalisé.',
  openGraph: {
    title: 'Alex Lopez — Mandataire IAD Provence Verte & Haut-Var',
    description:
      'Estimation gratuite, prix du marché local, accompagnement de A à Z. Réseau IAD — Barjols, Montmeyan, Quinson, Aups, Salernes, Rians.',
    url: env.app.siteUrl,
  },
}

const FAQ_ITEMS = [
  { question: 'Quelle est la différence entre un mandataire et une agence immobilière ?', answer: "Un mandataire immobilier est un professionnel indépendant rattaché à un réseau (ici IAD France). Il propose les mêmes services qu'une agence (estimation, vente, achat) mais avec des honoraires souvent inférieurs, car il n'a pas de local commercial à entretenir." },
  { question: 'Combien coûte une estimation immobilière en Provence Verte et Haut-Var ?', answer: "L'estimation est entièrement gratuite et sans engagement. Elle s'appuie sur les prix réels des ventes récentes dans votre secteur." },
  { question: 'Quelles communes couvrez-vous en Provence Verte et Haut-Var ?', answer: "J'interviens sur l'ensemble de la Provence Verte et du Haut-Var : Barjols, Montmeyan, Quinson, Fox-Amphoux, Tavernes, Rians, Aups, Salernes, Ginasservis, Varages et toutes les communes limitrophes." },
  { question: 'Combien de temps faut-il pour vendre un bien en Provence Verte ?', answer: 'Le délai moyen de vente dépend du bien et de son positionnement prix. Avec une estimation juste, la majorité des biens trouvent preneur en 4 à 12 semaines.' },
  { question: "Qu'est-ce que l'audit immobilier express ?", answer: "C'est un bilan gratuit de votre bien réalisé en quelques minutes. Il identifie les points de vigilance — légaux, techniques, environnementaux." },
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
        description: 'Mandataire immobilier IAD en Provence Verte et Haut-Var. Estimation gratuite, vente et achat immobilier.',
        url: siteUrl,
        telephone: PHONE_RAW,
        areaServed: ['Provence Verte', 'Haut-Var', 'Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux', 'Tavernes', 'Rians', 'Aups', 'Salernes', 'Ginasservis', 'Varages'],
        address: { '@type': 'PostalAddress', addressRegion: 'Var', addressCountry: 'FR' },
        aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: '3', bestRating: '5' },
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

export default function HomePage() {
  const jsonLd = buildJsonLd(env.app.siteUrl)
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(jsonLd)} />
      <HomepageContent />
    </>
  )
}
