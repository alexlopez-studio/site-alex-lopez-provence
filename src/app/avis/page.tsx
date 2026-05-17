import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Avis clients — Alexandre Lopez',
  description: 'Avis clients et retours d’expérience sur l’accompagnement immobilier d’Alexandre Lopez en Provence Verte et Haut-Var.',
  alternates: { canonical: (env.app.siteUrl || 'https://alexlopez-provence.fr') + '/avis' },
}

export default function AvisPage() {
  return (
    <main className="bg-white px-6 py-20">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-4 flex items-center justify-center gap-1 text-accent">
          {Array.from({ length: 5 }).map(function (_, index) { return <Star key={index} size={16} className="fill-accent" /> })}
        </div>
        <h1 className="mb-5 text-3xl font-extrabold tracking-[-0.03em] text-foreground md:text-5xl">Avis clients</h1>
        <p className="mx-auto mb-8 max-w-2xl text-muted leading-relaxed">Cette page regroupera les avis vérifiés et retours d’expérience. En attendant, je privilégie un échange direct pour comprendre votre projet et vous expliquer ma façon de travailler.</p>
        <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-hover transition-colors">
          Me contacter <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}
