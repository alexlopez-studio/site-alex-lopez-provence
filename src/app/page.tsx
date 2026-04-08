import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
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
      "Décrivez votre projet en quelques secondes. L'assistant identifie les biens correspondants et anticipe les points de négociation.",
    cta: 'Décrire mon projet',
    href: appUrl('/acheter'),
  },
  {
    icon: ClipboardCheck,
    title: 'Audit immobilier express',
    description:
      "Avant de vendre ou d'acheter, identifiez tous les risques — juridiques, techniques, environnementaux — pour négocier en confiance.",
    cta: "Lancer l'audit",
    href: appUrl('/audit'),
  },
]

const COMMUNES_TEASER = [
  'Varages',
  'Barjols',
  'Montmeyan',
  'Quinson',
  'Fox-Amphoux',
  'Tavernes',
  'Rians',
  'Aups',
  'Salernes',
]

const AVIS_TEASER = [
  {
    name: 'Sophie M.',
    note: 5,
    text: '«Alex a su estimer notre maison au juste prix. Vendu en 3 semaines, sans stress.»',
  },
  {
    name: 'Pierre & Marion L.',
    note: 5,
    text: "«L'assistant nous a permis de préparer la visite parfaitement. Un vrai avantage.»",
  },
  {
    name: 'Isabelle R.',
    note: 5,
    text: "«Présent, réactif, transparent. Exactement ce qu'on cherchait dans un mandataire.»",
  },
]

export default function HomePage() {
  const assistantUrl = appUrl('') || '/assistant'
  const biens = biensUrl()

  return (
    <>
      {/* ===== HERO — Full Bleed ===== */}
      <section
        className="relative min-h-screen overflow-hidden bg-white"
        style=
          background:
            'radial-gradient(ellipse 80% 90% at 75% 50%, #EEF5FF 0%, #ffffff 55%)',
        
      >
        {/* Watermark */}
        <div
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 flex items-center justify-end overflow-hidden"
        >
          <span
            className="font-black tracking-tighter text-brand whitespace-nowrap leading-none"
            style=
              fontSize: 'clamp(100px, 18vw, 260px)',
              opacity: 0.04,
              marginRight: '-0.05em',
            
          >
            ALEX LOPEZ
          </span>
        </div>

        {/* Photo — absolute, full height, droite, fond blanc mixé */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-full lg:w-[58%] flex items-end justify-center"
        >
          {/*
           * Placez votre photo dans /public/alex-lopez.png
           * La photo doit avoir un fond blanc pour que mix-blend-mode: multiply
           * fonctionne et fonde naturellement le fond dans la page.
           */}
          <img
            src="/alex-lopez.png"
            alt=""
            className="h-full w-auto object-cover object-top max-h-[100vh]"
            style= mixBlendMode: 'multiply' 
          />
        </div>

        {/* Fondu bord gauche de la photo (readability du texte) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 hidden lg:block"
          style=
            left: '38%',
            width: '120px',
            background: 'linear-gradient(to right, #ffffff, transparent)',
          
        />

        {/* Fondu bord bas (transition douce vers la section suivante) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 inset-x-0 h-32"
          style=
            background: 'linear-gradient(to bottom, transparent, #ffffff)',
          
        />

        {/* Contenu texte */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 min-h-screen flex flex-col justify-center pt-28 pb-20">
          <div className="max-w-lg">
            {/* Label */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand mb-6">
              Mandataire IAD — Provence, Haut-Var, Verdon
            </p>

            {/* H1 */}
            <h1
              className="font-black text-foreground leading-[1.05] tracking-tight mb-6"
              style= fontSize: 'clamp(44px, 7vw, 88px)' 
            >
              Vendez.
              <br />
              Achetez.
              <br />
              <span className="text-brand">En toute
              <br />confiance.</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-lg text-muted leading-relaxed mb-10 max-w-sm">
              Estimation gratuite ancrée dans les données réelles, analyse des risques,
              accompagnement personnalisé. Lancé en 2–3 minutes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button asChild size="lg" variant="primary">
                <Link
                  href={assistantUrl}
                  target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                  rel={
                    assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined
                  }
                >
                  Lancer l&apos;assistant <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={env.calcomUrl} target="_blank" rel="noopener noreferrer">
                  Prendre RDV
                </Link>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-border">
                <Star size={13} className="text-brand fill-brand" />
                <span className="text-xs font-semibold text-foreground">4.9 · 38 avis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-border">
                <CheckCircle2 size={13} className="text-success" />
                <span className="text-xs font-semibold text-foreground">47 transactions</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-border">
                <MapPin size={13} className="text-brand" />
                <span className="text-xs font-semibold text-foreground">IAD · 83670</span>
              </div>
            </div>
          </div>
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
            Basé à Varages (83670), j&apos;interviens sur l&apos;ensemble du Haut-Var et des
            communes limitrophes des Alpes-de-Haute-Provence, jusqu&apos;aux Gorges du Verdon.
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
            <span className="px-3 py-1.5 text-sm text-muted">&amp; bien d&apos;autres…</span>
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
              Ils m&apos;ont{' '}
              <span className="text-brand">fait confiance</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {AVIS_TEASER.map((avis) => (
              <div key={avis.name} className="p-6 rounded-2xl border border-border bg-surface">
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
                rel={
                  assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined
                }
              >
                Lancer l&apos;assistant <ArrowRight size={18} />
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
