import type { Metadata } from 'next'
import { ConceptVendeurPage } from '@/components/concept/ConceptVendeurPage'

export const metadata: Metadata = {
  title: 'Vendez Comme Un Pro — Le Guide Gratuit | Alexandre Lopez',
  description:
    'Vendez sans agence et sans commission grâce au guide complet de 40 pages : estimation, mise en valeur, qualification des acheteurs et négociation.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function VendezProPage() {
  return <ConceptVendeurPage />
}
