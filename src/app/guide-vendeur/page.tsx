import type { Metadata } from 'next'
import GuideViewer from '@/components/guide/GuideViewer'

export const metadata: Metadata = {
  title: 'Guide Stratégique du Vendeur Particulier — Alexandre Lopez',
  description:
    'Le guide complet en 41 pages pour valoriser, sécuriser et réussir la vente de votre bien immobilier entre particuliers en Provence. Format imprimable A4 et conseils d’expert.',
  alternates: { canonical: '/guide-vendeur' },
  openGraph: {
    title: 'Guide du Vendeur Particulier — Alexandre Lopez',
    description:
      'Méthode complète, checklists opérationnelles et analyse juridique pour réussir votre vente immobilière en Provence.',
    type: 'article',
  },
}

export default function GuideVendeurPage() {
  return <GuideViewer />
}
