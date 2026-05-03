import type { Metadata } from 'next'
import { env } from '@/lib/env'
import AcheterPageContent from '@/components/acheter/AcheterPageContent'

export const metadata: Metadata = {
  title: 'Acheter en Provence et sur la Côte d’Azur — Alexandre Lopez, Conseiller iAD',
  description: 'Trouvez votre bien immobilier en Provence et sur la Côte d’Azur avec Alexandre Lopez, conseiller iAD France. Recherche ciblée, visites accompagnées, négociation experte.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/acheter' },
}

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: "Quels sont les meilleurs secteurs pour acheter en Provence et sur la Côte d'Azur ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: "La Provence Verte (Cotignac, Carcès, Saint-Maximin, Brignoles) offre un cadre authentique avec un excellent rapport qualité/prix. Le Haut-Var (Verdon, Aups) est privilégié pour le calme et la nature. La Côte d'Azur (Saint-Raphaël, Fréjus, arrière-pays niccarrois) cible plutôt la résidence secondaire et la proximité mer.",
      },
    },
    {
      '@type': 'Question',
      name: "Comment bien négocier le prix d'achat d'un bien ?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La négociation repose sur une analyse précise du marché local, comparaison des prix récents, évaluation des défauts ou travaux, étude du temps sur le marché, profil du vendeur et stratégie d’offre progressive.',
      },
    },
    {
      '@type': 'Question',
      name: 'Faut-il visiter plusieurs biens avant de se décider ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Oui, mais en restant ciblé. Une dizaine de visites bien choisies vaut mieux que cinquante visites au hasard. Une qualification précise des critères en amont fait gagner du temps.",
      },
    },
    {
      '@type': 'Question',
      name: 'Comment se déroule la signature chez le notaire pour un acheteur ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Après la signature du compromis, vous disposez de 10 jours de délai légal de réflexion. Le notaire dispose ensuite de 2 à 3 mois pour vérifier les pièces et préparer l’acte authentique.',
      },
    },
    {
      '@type': 'Question',
      name: 'Quels sont les frais réels à prévoir lors d’un achat ?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Frais de notaire (7 à 8 % dans l’ancien, 2 à 3 % dans le neuf), frais de garantie bancaire, éventuels travaux, taxe foncière et charges. Une estimation chiffrée est fournie dès la première visite.',
      },
    },
  ],
}

const jsonLdHtml = { __html: JSON.stringify(FAQ_JSON_LD) }

export default function AcheterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml} />
      <AcheterPageContent />
    </>
  )
}
