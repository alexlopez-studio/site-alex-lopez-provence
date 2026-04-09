import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight, CheckCircle2, Phone, TrendingUp,
  Camera, Megaphone, FileSignature, Clock, Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl, env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Vendre son bien en Provence Verte & Haut-Var — Alex Lopez IAD',
  description:
    'Vendez votre maison ou appartement en Provence Verte et Haut-Var au juste prix. Estimation gratuite, stratégie de vente sur-mesure, accompagnement complet jusqu’à la signature. Mandataire IAD.',
  alternates: { canonical: (env.siteUrl || 'https://alexlopez-provence.fr') + '/vendre' },
}

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

const ETAPES = [
  {
    icon: TrendingUp,
    num: '01',
    titre: 'Estimation gratuite',
    desc: 'Je visite votre bien et analyse les ventes récentes comparables dans votre secteur. Vous recevez un prix argumenté, ancré dans la réalité du marché local.',
  },
  {
    icon: Camera,
    num: '02',
    titre: 'Valorisation du bien',
    desc: 'Conseils home staging, photos professionnelles, visite virtuelle si nécessaire. L’objectif : que votre bien se démarque sur les portails dès le premier jour.',
  },
  {
    icon: Megaphone,
    num: '03',
    titre: 'Diffusion ciblée',
    desc: 'Publication sur les principaux portails immobiliers + réseau IAD France. Chaque annonce est optimisée pour attirer les bons acheteurs rapidement.',
  },
  {
    icon: Star,
    num: '04',
    titre: 'Visites & négociation',
    desc: 'Je gère les visites, filtre les acheteurs sérieux et négocie à votre place. Vous recevez un compte-rendu après chaque visite.',
  },
  {
    icon: FileSignature,
    num: '05',
    titre: 'Compromis & signature',
    desc: 'Je vous accompagne jusqu’à la signature chez le notaire — coordination des documents, suivi des délais, présence à vos côtés.',
  },
]

const INCLUS = [
  'Estimation gratuite et sans engagement',
  'Conseils de mise en valeur (home staging)',
  'Photos professionnelles',
  'Publication multi-portails + réseau IAD',
  'Qualification des acheteurs',
  'Compte-rendu après chaque visite',
  'Négociation à votre place',
  'Suivi jusqu’à la signature notaire',
]

const FAQS = [
  {
    q: 'Combien coûte votre accompagnement pour vendre ?',
    r: 'L’estimation est entièrement gratuite. Les honoraires de transaction sont à la charge de l’acheteur (selon la loi Alur). Vous ne payez rien si votre bien ne se vend pas.',
  },
  {
    q: 'Combien de temps faut-il pour vendre en Provence Verte ?',
    r: 'Pour un bien correctement estimé et bien présenté, le délai moyen est de 4 à 12 semaines. Tout dépend du prix de mise en vente et de la demande sur votre secteur.',
  },
  {
    q: 'Quelle est la différence avec une agence classique ?',
    r: 'En tant que mandataire IAD, je n’ai pas de local commercial à financer. Je propose le même service qu’une agence, souvent avec des honoraires plus compétitifs, et une relation directe — vous avez toujours le même interlocuteur.',
  },
  {
    q: 'Faut-il rendre son bien disponible pour les visites ?',
    r: 'Je m’adapte à vos contraintes. Les visites sont planifiées avec votre accord. Si vous êtes absent, je peux gérer les visites de bout en bout avec des acheteurs préalablement qualifiés.',
  },
]

const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Vente immobilière — Provence Verte & Haut-Var',
      description: 'Accompagnement complet pour vendre votre bien immobilier en Provence Verte et Haut-Var : estimation, mise en valeur, diffusion, négociation, signature.',
      provider: { '@type': 'Person', name: 'Alex Lopez', jobTitle: 'Mandataire immobilier IAD', telephone: PHONE_RAW },
      areaServed: 'Provence Verte et Haut-Var',
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.r } })),
    },
  ],
}

function buildInnerHtml(data: object) { return { __html: JSON.stringify(data) } }

export default function VendrePage() {
  const estimerUrl = appUrl('/vendre') || '/assistant'

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={buildInnerHtml(serviceJsonLd)} />

      {/* HERO */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-5">Vendre en Provence Verte</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6">
              Vendez au <span className="text-brand">juste prix.</span>
              <br />Sans stress.
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-8">
              Estimation gratuite ancrée dans les prix réels du marché, mise en valeur
              professionnelle et accompagnement complet jusqu’à la signature —
              en Provence Verte et Haut-Var.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button asChild variant="primary" size="lg">
                <Link href={estimerUrl} target={estimerUrl.startsWith('http') ? '_blank' : undefined}
                  rel={estimerUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  Estimer mon bien <ArrowRight size={18} />
                </Link>
              </Button>
              <a href={'tel:' + PHONE_RAW}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors">
                <Phone size={15} />{PHONE_DISPLAY}
              </a>
            </div>
            <div className="flex flex-wrap gap-4">
              {['Estimation gratuite', 'Honoraires à la charge acheteur', 'Délais moyens 4-12 semaines'].map((item) => (
                <div key={item} className="flex items-center gap-1.5 text-sm text-muted">
                  <CheckCircle2 size={15} className="text-success shrink-0" />{item}
                </div>
              ))}
            </div>
          </div>
          {/* Ce qui est inclus */}
          <div className="bg-surface rounded-2xl border border-border p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand mb-5">Ce qui est inclus</p>
            <ul className="space-y-3">
              {INCLUS.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                  <CheckCircle2 size={15} className="text-brand shrink-0 mt-0.5" />{item}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-border">
              <Button asChild variant="primary" size="default" className="w-full">
                <Link href={estimerUrl} target={estimerUrl.startsWith('http') ? '_blank' : undefined}
                  rel={estimerUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  Lancer mon estimation gratuite <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">De A à Z</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
              Comment se déroule <span className="text-brand">la vente ?</span>
            </h2>
          </div>
          <div className="space-y-6">
            {ETAPES.map((e) => {
              const Icon = e.icon
              return (
                <div key={e.num} className="flex gap-5 items-start bg-white rounded-2xl border border-border p-6">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-brand flex items-center justify-center">
                    <Icon size={18} className="text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-brand/60 uppercase tracking-wider">Étape {e.num}</span>
                    </div>
                    <p className="text-base font-bold text-foreground">{e.titre}</p>
                    <p className="text-sm text-muted mt-1 leading-relaxed">{e.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">Questions fréquentes</p>
            <h2 className="text-3xl font-extrabold text-foreground">Vos <span className="text-brand">questions</span></h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-border bg-surface overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none font-semibold text-foreground hover:text-brand transition-colors">
                  <span>{f.q}</span>
                  <span className="text-muted shrink-0 ml-4 text-xl leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-6 pb-6 text-sm text-muted leading-relaxed">{f.r}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-4">Estimation gratuite</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Prêt à vendre <span className="text-brand">votre bien ?</span>
          </h2>
          <p className="text-muted mb-8 leading-relaxed">
            Obtenez une estimation gratuite de votre bien en Provence Verte et Haut-Var
            — annoncée, argumentée, basée sur les prix réels du marché.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="primary">
              <Link href={estimerUrl} target={estimerUrl.startsWith('http') ? '_blank' : undefined}
                rel={estimerUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                Estimer mon bien <ArrowRight size={18} />
              </Link>
            </Button>
            <a href={'tel:' + PHONE_RAW}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-sm font-semibold text-foreground hover:border-brand hover:text-brand transition-colors">
              <Phone size={15} />{PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
