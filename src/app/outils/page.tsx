import type { Metadata } from 'next'
import { OutilsContent } from '@/components/outils/OutilsContent'

export const metadata: Metadata = {
  title: 'Outils immobiliers gratuits',
  description:
    'Estimer votre bien, définir votre projet d\'achat ou auditer un bien — 3 outils gratuits et personnalisés pour la Provence Verte et le Haut-Var.',
  alternates: { canonical: '/outils' },
  openGraph: {
    title: 'Outils immobiliers gratuits — Alexandre Lopez',
    description:
      'Vos outils gratuits & personnalisés pour la Provence Verte et le Haut-Var.',
    url: '/outils',
    type: 'website',
  },
}

export default function OutilsPage() {
  return <OutilsContent />
}
