import type { Metadata } from 'next'
import { BioLinkPage } from '@/components/bio/BioLinkPage'

export const metadata: Metadata = {
  title: 'Alexandre Lopez — Liens & Contact Direct · Immobilier en Provence & Côte d’Azur',
  description:
    'Retrouvez tous mes liens utiles : Guide Propriétaire Vendeur offert, annonces de biens en vente, carte de visite virtuelle, estimation et contact direct.',
  alternates: { canonical: '/bio' },
  openGraph: {
    title: 'Alexandre Lopez — Conseiller Immobilier · Provence & Côte d’Azur',
    description:
      'Guide vendeur offert, sélection de biens en vente, carte de visite virtuelle et contact direct.',
    type: 'profile',
    images: ['/alexandre-lopez-face.jpg'],
  },
}

export default function BioPage() {
  return <BioLinkPage />
}
