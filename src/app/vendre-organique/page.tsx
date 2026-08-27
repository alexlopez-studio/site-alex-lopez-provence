import type { Metadata } from 'next'
import { BotanicalGuideLandingPage } from '@/components/guide/BotanicalGuideLandingPage'

export const metadata: Metadata = {
  title: 'Guide Vendeur Particulier — Édition Botanique Provence',
  description:
    'Le guide pratique complet en 41 planches A4 pour valoriser, sécuriser et réussir votre vente immobilière de particulier à particulier en Provence : estimation DVF, checklists A4, filtrage bancaire et conformité notariée.',
  alternates: { canonical: '/vendre-organique' },
}

export default function VendreOrganiquePage() {
  return <BotanicalGuideLandingPage />
}
