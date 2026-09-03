import type { Metadata } from 'next'
import GuideViewer from '@/components/guide/GuideViewer'

export const metadata: Metadata = {
  title: 'Consulter le Guide du Vendeur Particulier — Alexandre Lopez',
  description:
    'Espace de consultation et lecture du guide complet pour valoriser, sécuriser et réussir la vente de votre bien immobilier en Provence & Côte d’Azur.',
  alternates: { canonical: '/guide-vendeur/consulter' },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Consulter le Guide du Vendeur Particulier — Alexandre Lopez',
    description:
      'Méthode complète, checklists opérationnelles et repères juridiques pour réussir votre vente immobilière en Provence & Côte d’Azur.',
    type: 'article',
  },
}

export default function GuideConsulterPage() {
  return <GuideViewer />
}
