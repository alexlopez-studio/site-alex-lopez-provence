import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import OutilsContent from '@/components/outils/OutilsContent'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('outils')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
    alternates: { canonical: '/outils' },
  }
}

export default function OutilsPage() {
  return <OutilsContent />
}
