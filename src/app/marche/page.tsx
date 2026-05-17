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
    <main className="bg-white px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-4 flex items-center justify-center gap-2 text-brand">
          <MapPin size={18} />
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">Zone d’intervention</p>
        </div>
        <h1 className="mb-5 text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl">Provence Verte & Verdon</h1>
        <p className="mx-auto mb-10 max-w-2xl text-muted leading-relaxed">J’interviens sur l’ensemble de la Provence Verte et du Verdon pour accompagner vos projets de vente, d’achat ou d’estimation immobilière.</p>
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {COMMUNES.map(function (commune) {
            return <span key={commune} className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-foreground">{commune}</span>
          })}
        </div>
        <Link href="/outils" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover transition-colors">
          Préparer mon projet <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}
