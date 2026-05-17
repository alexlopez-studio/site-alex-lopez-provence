import type { Metadata } from 'next'
import OutilsContent from '@/components/outils/OutilsContent'

export const metadata: Metadata = {
  title: 'Outils immobiliers gratuits — Alex Lopez Provence Verte & Verdon',
  description: "Estimation, projet d'achat, audit immobilier — 3 outils gratuits pour préparer votre projet en Provence Verte et Verdon.",
  alternates: { canonical: '/outils' },
}

export default function OutilsPage() {
  return <OutilsContent />
}
