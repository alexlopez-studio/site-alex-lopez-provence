import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MapPin } from 'lucide-react'
import { env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Zone d’intervention — Provence Verte & Verdon',
  description: 'Alexandre Lopez accompagne vos projets immobiliers en Provence Verte, Provence Verdon et dans les communes voisines.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/marche' },
}

const COMMUNES = ['Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux', 'Tavernes', 'Rians', 'Aups', 'Salernes', 'Ginasservis', 'Varages', 'Esparron-de-Verdon', 'Artignosc-sur-Verdon']

export default function MarchePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-paper px-6 py-20 lg:py-24">
        <div className="absolute right-0 top-0 h-80 w-80 translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-brand"><MapPin size={18} /><p className="text-xs font-semibold uppercase tracking-[0.22em]">Zone d’intervention</p></div>
          <h1 className="font-serif text-4xl font-medium leading-tight tracking-[-0.045em] text-foreground md:text-6xl">Provence Verte & Verdon</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">Un territoire volontairement ciblé pour accompagner vos projets de vente, d’achat ou d’estimation avec une vraie lecture locale.</p>
        </div>
      </section>
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-[75rem]">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">Communes</p><h2 className="font-serif text-3xl font-medium tracking-[-0.04em] text-foreground md:text-5xl">Les secteurs suivis.</h2></div>
            <p className="max-w-md text-sm leading-relaxed text-muted">Ces pages locales seront enrichies progressivement avec des repères de marché et des conseils adaptés à chaque commune.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {COMMUNES.map(function (commune) {
              const slug = commune.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
              return <Link key={commune} href={'/marche/' + slug} className="rounded-[1.3rem] border border-border bg-paper p-5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-brand hover:text-brand hover:shadow-md">{commune}</Link>
            })}
          </div>
          <div className="mt-12 text-center"><Link href="/outils" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-hover">Préparer mon projet <ArrowRight size={16} /></Link></div>
        </div>
      </section>
    </main>
  )
}
