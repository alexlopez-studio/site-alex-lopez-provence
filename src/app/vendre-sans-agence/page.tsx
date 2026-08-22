import type { Metadata } from 'next'
import { GuideLeadLandingPage } from '@/components/guide/GuideLeadLandingPage'

export const metadata: Metadata = {
  title: 'Guide du Vendeur Particulier — Réussir sa vente sans agence en Provence',
  description:
    'Le guide pratique complet en 41 pages pour valoriser, sécuriser et réussir votre vente immobilière de particulier à particulier en Provence : estimation DVF, checklists A4, script de filtrage des acheteurs et conformité notariée.',
  alternates: { canonical: '/vendre-sans-agence' },
  openGraph: {
    title: 'Guide Stratégique du Vendeur Particulier — 41 Pages de Méthodes & Checklists A4',
    description:
      'Le manuel pratique rédigé par Alexandre Lopez pour vendre au juste prix sans stress en Provence Verte & Verdon : données DVF, qualification bancaire et sécurité juridique.',
    type: 'article',
  },
}

export default function VendreSansAgencePage() {
  return <GuideLeadLandingPage />
}
