import type { Metadata } from 'next'
import VendrePageContent from '@/components/vendre/VendrePageContent'

export const metadata: Metadata = {
  title: 'Estimer et vendre votre bien en Provence et sur la C\u00f4te d\u2019Azur | Alexandre Lopez',
  description:
    "Estimation gratuite et vente de votre bien immobilier en Provence et sur la C\u00f4te d'Azur. Analyse du march\u00e9 local, strat\u00e9gie de positionnement, accompagnement jusqu'\u00e0 la signature. R\u00e9ponse sous 48\u202fh.",
}

// FAQ structurée pour le SEO (JSON-LD FAQPage). Doit rester synchronisée
// avec le tableau FAQ déclaré dans VendrePageContent.tsx.
const FAQ_JSONLD = [
  {
    q: "Comment obtenir une estimation immobili\u00e8re gratuite et fiable en Provence ?",
    a: "Mon estimation gratuite repose sur une analyse approfondie du march\u00e9 local en Provence et sur la C\u00f4te d'Azur : ventes r\u00e9centes comparables, \u00e9tat du bien et du quartier, tendances de march\u00e9 et outils d'analyse performants. Je me d\u00e9place \u00e0 votre domicile sous 48\u202fh et vous restitue un avis de valeur \u00e9crit dans les 48\u202fh suivantes. Sans engagement, sans frais cach\u00e9s.",
  },
  {
    q: "Combien de temps faut-il pour vendre un bien en Provence ou sur la C\u00f4te d'Azur ?",
    a: "Le d\u00e9lai d\u00e9pend du prix de mise sur le march\u00e9, de l'\u00e9tat du bien, du secteur et de la strat\u00e9gie marketing. En moyenne, un bien correctement positionn\u00e9 se vend entre 2 et 5 mois.",
  },
  {
    q: "Quels sont les frais \u00e0 pr\u00e9voir lors de la vente d'un bien ?",
    a: "C\u00f4t\u00e9 vendeur, les principaux frais \u00e0 anticiper sont : les diagnostics techniques obligatoires (DPE, \u00e9lectricit\u00e9, gaz, plomb, amiante, termites selon zone), l'\u00e9ventuelle plus-value immobili\u00e8re, et les honoraires du conseiller.",
  },
  {
    q: "Quels avantages d'un mandataire iAD plut\u00f4t qu'une agence traditionnelle ?",
    a: "Le r\u00e9seau iAD compte plus de 18\u202f000 conseillers en France et \u00e0 l'international, avec des outils digitaux performants et une couverture nationale. Disponibilit\u00e9 7\u202fj/7, accompagnement personnalis\u00e9, honoraires optimis\u00e9s et expertise locale.",
  },
  {
    q: 'Comment se déroule la signature chez le notaire ?',
    a: "Une fois le compromis sign\u00e9, le notaire dispose d'environ 2 \u00e0 3 mois pour v\u00e9rifier les pi\u00e8ces et pr\u00e9parer l'acte authentique. Je coordonne les \u00e9changes pour que tout soit pr\u00eat \u00e0 temps.",
  },
  {
    q: 'Faut-il faire un home staging avant la vente ?',
    a: "Pas syst\u00e9matiquement, mais quelques gestes simples augmentent fortement l'attractivit\u00e9 : d\u00e9sencombrer, d\u00e9personnaliser, soigner la lumi\u00e8re, rafra\u00eechir les peintures, mettre en valeur les ext\u00e9rieurs.",
  },
]

export default function VendrePage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_JSONLD.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
  const jsonLdHtml = { __html: JSON.stringify(jsonLd) }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml}
      />
      <VendrePageContent />
    </>
  )
}
