import type { Metadata } from 'next'
import { env } from '@/lib/env'
import AProposPageContent from '@/components/about/AProposPageContent'

export const metadata: Metadata = {
  title: 'Mon approche — Alexandre Lopez, Conseiller iAD Provence et Côte d’Azur',
  description: "Alexandre Lopez, conseiller immobilier iAD France en Provence et sur la Côte d'Azur. Mon parcours, mes valeurs et ma m\u00e9thode pour vous accompagner dans votre projet.",
  alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/a-propos' },
}

const PERSON_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Alexandre Lopez',
  jobTitle: 'Conseiller immobilier iAD France',
  description: "Conseiller immobilier iAD France en Provence et sur la C\u00f4te d'Azur, sp\u00e9cialis\u00e9 dans la vente et l'achat de biens immobiliers.",
  telephone: '+33613180168',
  areaServed: ['Provence', "C\u00f4te d'Azur", 'Var', 'Provence Verte', 'Haut-Var'],
  address: {
    '@type': 'PostalAddress',
    addressRegion: 'Var',
    addressCountry: 'FR',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'iAD France',
    url: 'https://www.iadfrance.fr',
  },
}

const jsonLdHtml = { __html: JSON.stringify(PERSON_JSON_LD) }

export default function AProposPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml} />
      <AProposPageContent />
    </>
  )
}
