import type { Metadata } from 'next'
import { GuideLandingPage } from '@/components/guide/GuideLandingPage'

export const metadata: Metadata = {
  title: 'Guide du Vendeur Particulier — Alexandre Lopez iad Provence Verte & Verdon',
  description:
    'Téléchargez le guide complet en 41 pages pour réussir votre vente immobilière de particulier à particulier en Provence : estimation, valorisation, checklists A4 et négociation.',
  alternates: { canonical: '/guide' },
  openGraph: {
    title: 'Guide du Vendeur Particulier — 41 Pages de Méthodes & Checklists A4',
    description:
      'Le manuel pratique officiel rédigé par Alexandre Lopez pour vendre au juste prix sans stress en Provence Verte & Verdon.',
  },
}

export default function GuidePage() {
  return <GuideLandingPage />
}
