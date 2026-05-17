import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { env } from '@/lib/env'

type PageProps = { params: Promise<{ commune: string }> }

function formatCommune(slug: string) {
  return slug.split('-').filter(Boolean).map(function (part) { return part.charAt(0).toUpperCase() + part.slice(1) }).join('-')
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { commune } = await params
  const label = formatCommune(commune)
  return {
    title: 'Immobilier à ' + label + ' — Alexandre Lopez',
    description: 'Préparez votre projet immobilier à ' + label + ' avec Alexandre Lopez, conseiller immobilier iad en Provence Verte & Verdon.',
    alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/marche/' + commune },
  }
}

export default async function CommunePage({ params }: PageProps) {
  const { commune } = await params
  const label = formatCommune(commune)

  return (
    <main>
      <section className="relative overflow-hidden bg-[#f4f7f8] px-6 pb-16 pt-28 lg:pb-24 lg:pt-36">
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-brand"><MapPin size={18} /><p className="text-sm font-bold uppercase tracking-[0.22em]">Marché local · Provence Verte & Verdon</p></div>
          <h1 className="text-4xl font-bold leading-tight tracking-[-0.05em] text-foreground md:text-6xl lg:text-7xl">Immobilier à {label}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">Cette page locale sera enrichie progressivement. En attendant, vous pouvez préparer votre projet ou demander un premier avis sur le marché de {label}.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/outils" className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">Utiliser les outils <ArrowRight size={16} /></Link>
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full border-2 border-brand px-6 py-3 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white">Me contacter</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
