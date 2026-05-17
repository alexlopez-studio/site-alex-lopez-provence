import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { env } from '@/lib/env'

type PageProps = { params: Promise<{ commune: string }> }

function formatCommune(slug: string) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1) })
    .join('-')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { commune } = await params
  const label = formatCommune(commune)
  return {
    title: 'Immobilier à ' + label + ' — Alexandre Lopez',
    description: 'Préparez votre projet immobilier à ' + label + ' avec Alexandre Lopez, conseiller immobilier iad en Provence Verte et Haut-Var.',
    alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/marche/' + commune },
  }
}

export default async function CommunePage({ params }: PageProps) {
  const { commune } = await params
  const label = formatCommune(commune)

  return (
    <main className="bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-brand">
          <MapPin size={18} />
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Marché local</p>
        </div>
        <h1 className="mb-5 text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl">Immobilier à {label}</h1>
        <p className="mx-auto mb-8 max-w-2xl text-muted leading-relaxed">Cette page locale sera enrichie progressivement. En attendant, vous pouvez préparer votre projet, demander un avis de valeur ou me contacter directement pour obtenir un premier retour sur le marché de {label}.</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/outils" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover transition-colors">
            Utiliser les outils <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors">
            Me contacter
          </Link>
        </div>
      </div>
    </main>
  )
}
