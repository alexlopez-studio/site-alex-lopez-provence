import type { Metadata } from 'next'
import { BotanicalGuideLandingPage } from '@/components/guide/BotanicalGuideLandingPage'

export const metadata: Metadata = {
  title: 'Édition Botanique — Guide Stratégique du Vendeur Particulier',
  description:
    'Découvrez le manuel pratique de 41 planches A4 pour valoriser, sécuriser et réussir votre vente entre particuliers en Provence Verte & Verdon : méthode DVF notariée, qualification des acheteurs et sécurité juridique.',
  alternates: { canonical: '/guide-organique' },
}

export default function GuideOrganiquePage() {
  return <BotanicalGuideLandingPage />
}
