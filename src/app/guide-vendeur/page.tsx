import type { Metadata } from 'next'
import { GuideProLandingPage } from '@/components/guide/GuideProLandingPage'

export const metadata: Metadata = {
  title: 'Particulier, comment vendre votre bien ? — Le guide pratique en Provence & Côte d’Azur',
  description:
    'Le guide pratique complet pour valoriser, comprendre les acquéreurs et sécuriser votre vente immobilière en Provence & Côte d’Azur : repères de prix DVF, mise en valeur et conformité notariée avec Alexandre Lopez.',
  alternates: { canonical: '/guide-vendeur' },
  openGraph: {
    title: 'Particulier, comment vendre votre bien ? — Le guide pratique en Provence & Côte d’Azur',
    description:
      'Un ensemble de repères clairs et bienveillants rédigé par Alexandre Lopez pour vendre au juste prix en Provence & Côte d’Azur.',
    type: 'article',
  },
}

export default function GuideVendeurPage() {
  return <GuideProLandingPage />
}
