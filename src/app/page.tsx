import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Home,
  Search,
  ClipboardCheck,
  MapPin,
  Star,
  ShieldCheck,
  Clock,
  BarChart2,
  Gift,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl, biensUrl, env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Vendez & Achetez en Provence — Alex Lopez, Mandataire IAD',
  description:
    'Estimation gratuite, données DVF, analyse des risques. Mandataire IAD Provence — Haut-Var, Verdon, Barjols, Varages, Quinson, Montmeyan.',
  openGraph: {
    title: 'Alex Lopez — Mandataire IAD Provence',
    description:
      'Estimation gratuite, données DVF, analyse des risques. Réseau IAD Provence.',
    url: env.siteUrl,
  },
}

const USP_CHIPS = [
  { icon: Gift, label: 'Estimation offerte' },
  { icon: BarChart2, label: 'Données DVF officielles' },
  { icon: ShieldCheck, label: 'Analyse des risques' },
  { icon: Clock, label: '2–3 min chrono' },
  { icon: CheckCircle2, label: 'Gratuit' },
  { icon: Lock, label: 'Sécurisé' },
]

const SERVICES = [
  {
    icon: Home,
    title: 'Vendre',
    description:
      'Obtenez le juste prix pour votre bien grâce à une estimation ancrée dans les données DVF réelles et une analyse des spécificités locales.',
    cta: 'Estimer mon bien',
    href: appUrl('/vendre'),
  },
  {
    icon: Search,
    title: 'Acheter',
    description:
      'Décrivez votre projet en quelques secondes. L’assistant identifie les biens correspondants et anticipe les points de négociation.',
    cta: 'Décrire mon projet',
    href: appUrl('/acheter'),
  },
  {
    icon: ClipboardCheck,
    title: 'Audit immobilier express',
    description:
      'Avant de vendre ou d’achèter, identifiez tous les risques — juridiques, techniques, environnementaux — pour négocier en confiance.',
    cta: 'Lancer l’audit',
    href: appUrl('/audit'),
  },
]

const COMMUNES_TEASER = [
  'Varages', 'Barjols', 'Montmeyan', 'Quinson',
  'Fox-Amphoux', 'Tavernes', 'Rians', 'Aups', 'Salernes',
]

const AVIS_TEASER = [
  {
    name: 'Sophie M.',
    note: 5,
    text: '\u00abAlex a su estimer notre maison au juste prix. Vendu en 3 semaines, sans stress.\u00bb',
  },
  {
    name: 'Pierre & Marion L.',
    note: 5,
    text: '\u00abL’assistant nous a permis de préparer la visite parfaitement. Un vrai avantage.\u00bb',
  },
  {
    name: 'Isabelle R.',
    note: 5,
    text: '\u00abPrésent, réactif, transparent. Exactement ce qu’on cherchait dans un mandataire.\u00bb',
  },
]

export default function HomePage() {
  const assistantUrl = appUrl('') || '/assistant'
  const biens = biensUrl()

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-24 pb-16 bg-white">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-6">
          Mandataire IAD — Provence, Haut-Var, Verdon
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[1.1] tracking-tight max-w-3xl mb-6">
          Vendez. Achetez.
          <br />
          <span className="text-brand">En toute confiance.</span>
        </h1>
        <p className="text-lg text-muted max-w-xl leading-relaxed mb-10">
          Estimation gratuite ancrée dans les données réelles, analyse des risques,
          accompagnement personnalisé. Lancé en 2–3 minutes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" variant="primary">
            <Link
              href={assistantUrl}
              target={assistantUrl.startsWith('http') ? '_blank' : undefined}
              rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              Lancer l’assistant <ArrowRight size={18} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href={env.calcomUrl} target="_blank" rel="noopener noreferrer">
              Prendre RDV
            </Link>
          </Button>
        </div>
      </section>

      {/* ===== USP CHIPS ===== */}
      <section className="bg-surface py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {USP_CHIPS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-border text-sm font-medium text-foreground shadow-sm"
            >
              <Icon size={15} className="text-brand" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Ce que je fais pour vous
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              Trois services,{' '}
              <span className="text-brand">un seul objectif</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map(({ icon: Icon, title, description, cta, href }) => (
              <Link
                key={title}
                href={href || '/assistant'}
                target={(href || '').startsWith('http') ? '_blank' : undefined}
                rel={(href || '').startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group p-8 rounded-2xl border border-border bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center mb-5">
                  <Icon size={22} className="text-brand" />
                </div>
                <h3 className="text-xl font-black text-foreground mb-3">{title}</h3>
                <p className="text-sm text-muted leading-relaxed mb-5">{description}</p>
                <span className="text-sm font-semibold text-brand flex items-center gap-1 group-hover:gap-2 transition-all">
                  {cta} <ArrowRight size={15} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ZONE COUVERTE ===== */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin size={18} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">
              Zone couverte
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Haut-Var &amp; Verdon,{' '}
            <span className="text-brand">ma Provence</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            Basé à Varages (83670), j’interviens sur l’ensemble du Haut-Var et des communes
            limitrophes des Alpes-de-Haute-Provence, jusqu’aux Gorges du Verdon.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {COMMUNES_TEASER.map((c) => (
              <span
                key={c}
                className="px-3 py-1.5 bg-white rounded-full border border-border text-sm text-foreground"
              >
                {c}
              </span>
            ))}
            <span className="px-3 py-1.5 text-sm text-muted">&amp; bien d’autres…</span>
          </div>
          <Link
            href="/marche"
            className="inline-flex items-center gap-2 text-brand font-semibold hover:underline"
          >
            Voir toutes les communes <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===== AVIS TEASER ===== */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Témoignages
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              Ils m’ont{' '}
              <span className="text-brand">fait confiance</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {AVIS_TEASER.map((avis) => (
              <div
                key={avis.name}
                className="p-6 rounded-2xl border border-border bg-surface"
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: avis.note }).map((_, i) => (
                    <Star key={i} size={14} className="text-brand fill-brand" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">{avis.text}</p>
                <p className="text-xs font-semibold text-muted">{avis.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/avis"
              className="inline-flex items-center gap-2 text-brand font-semibold hover:underline"
            >
              Voir tous les avis <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 px-4 bg-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Votre projet commence ici.
          </h2>
          <p className="text-white/60 mb-8 leading-relaxed">
            Estimation gratuite, sans engagement, en 2–3 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="primary">
              <Link
                href={assistantUrl}
                target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                Lancer l’assistant <ArrowRight size={18} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href={env.calcomUrl} target="_blank" rel="noopener noreferrer">
                Prendre RDV
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
