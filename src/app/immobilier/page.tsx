import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { env } from '@/lib/env'
import { TERRITORY_COMMUNES } from '@/data/local-pages'

export const metadata: Metadata = {
  title: 'Zone d’intervention — Provence Verte & Verdon',
  description: 'Alexandre Lopez accompagne vos projets immobiliers en Provence Verte & Verdon, de Brignoles aux portes du Verdon.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexandrelopez.fr') + '/immobilier' },
}


export default function MarchePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#f4f7f8] px-6 pb-16 pt-28 lg:pb-24 lg:pt-36">
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-brand"><MapPin size={18} /><p className="text-sm font-bold uppercase tracking-[0.22em]">Zone d’intervention</p></div>
          <h1 className="text-4xl font-bold leading-tight tracking-[-0.05em] text-foreground md:text-6xl lg:text-7xl">Provence Verte & Verdon</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">Un territoire volontairement ciblé pour accompagner vos projets de vente, d’achat ou d’estimation avec une vraie lecture locale.</p>
        </div>
      </section>
      <section className="relative min-h-[30rem] overflow-hidden px-6 py-20 text-white md:min-h-[38rem]"><Image src="/village-cotignac.jpg" alt="Village de Cotignac en Provence Verte & Verdon" fill sizes="100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-r from-[#101828]/82 via-[#101828]/42 to-transparent" /><div className="relative mx-auto flex min-h-[22rem] max-w-7xl items-end md:min-h-[28rem]"><div className="max-w-3xl"><p className="mb-4 inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-light backdrop-blur">Villages du secteur</p><h2 className="text-4xl font-bold leading-tight tracking-[-0.045em] md:text-6xl">Des communes proches, mais des marchés différents.</h2><p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/82">Chaque village de Provence Verte & Verdon possède ses propres usages, accès, typologies de biens et niveaux de demande.</p></div></div></section>
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">Communes</p><h2 className="text-3xl font-bold tracking-[-0.04em] text-foreground md:text-5xl">Les secteurs suivis.</h2></div>
            <p className="max-w-md text-sm leading-relaxed text-muted">Ces pages locales seront enrichies progressivement avec des repères de marché et des conseils adaptés à chaque commune.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {TERRITORY_COMMUNES.map(function (commune) {
              return <Link key={commune.slug} href={'/immobilier/' + commune.slug} className="rounded-2xl bg-[#f4f7f8] p-5 text-sm font-semibold text-foreground transition-all hover:-translate-y-1 hover:text-brand hover:shadow-md">{commune.name}</Link>
            })}
          </div>
          <div className="mt-12 text-center"><Link href="/outils" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">Préparer mon projet <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </main>
  )
}
