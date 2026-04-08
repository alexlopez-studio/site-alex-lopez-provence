import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  MapPin,
  Star,
  Clock,
  BadgeCheck,
  CalendarDays,
  Home,
  Search,
  ClipboardCheck,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl, env } from '@/lib/env'

export const metadata: Metadata = {
  title: 'Vendez & Achetez en Provence — Alex Lopez, Mandataire IAD',
  description:
    'Estimation gratuite, données DVF, analyse des risques. Mandataire IAD Provence — Haut-Var, Verdon, Barjols, Varages, Quinson, Montmeyan.',
  openGraph: {
    title: 'Alex Lopez — Mandataire IAD Provence',
    description: 'Estimation gratuite, données DVF, analyse des risques.',
    url: env.siteUrl,
  },
}

// Badges flottants autour de la photo (style MGR)
const FLOATING_BADGES = [
  { label: 'Vendre', icon: Home, position: 'top-[12%] -left-[18%]', color: 'bg-brand text-white' },
  { label: 'Acheter', icon: Search, position: 'top-[8%] -right-[18%]', color: 'bg-success text-white' },
  { label: 'Audit express', icon: ClipboardCheck, position: 'bottom-[22%] -left-[20%]', color: 'bg-white text-foreground border border-border shadow-sm' },
  { label: 'IAD France', icon: Sparkles, position: 'bottom-[18%] -right-[18%]', color: 'bg-white text-foreground border border-border shadow-sm' },
]

// Ticker items (s'affichent deux fois pour la boucle seamless)
const TICKER_ITEMS = [
  'Vendre', 'Acheter', 'Estimer', 'Provence', 'IAD', 'Haut-Var',
  'Verdon', 'DVF', 'Gratuit', 'Transparent', 'Disponible 7j/7', 'Confiance',
]

const TRUST_BADGES = [
  { icon: BadgeCheck, label: 'Réseau IAD France' },
  { icon: Star, label: 'Estimation gratuite' },
  { icon: Clock, label: 'Disponible 7j/7' },
]

const SERVICES = [
  {
    emoji: '🏠',
    title: 'Vendre',
    description:
      'Estimation ancrée dans les données DVF réelles, analyse des risques, stratégie de vente sur mesure.',
    cta: 'Estimer mon bien',
    href: appUrl('/vendre'),
  },
  {
    emoji: '🔍',
    title: 'Acheter',
    description:
      "Décrivez votre projet en quelques secondes. L'assistant identifie les biens et anticipe les négociations.",
    cta: 'Décrire mon projet',
    href: appUrl('/acheter'),
  },
  {
    emoji: '📋',
    title: 'Audit immobilier express',
    description:
      "Identifiez tous les risques avant de vendre ou d'acheter — juridiques, techniques, environnementaux.",
    cta: "Lancer l'audit",
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
    lieu: 'Varages',
    note: 5,
    text: '«Alex a su estimer notre maison au juste prix. Vendu en 3 semaines, sans stress.»',
  },
  {
    name: 'Pierre & Marion L.',
    lieu: 'Barjols',
    note: 5,
    text: "«Grâce à l'assistant, on a préparé la visite avec toutes les données du marché. Un vrai avantage.»",
  },
  {
    name: 'Isabelle R.',
    lieu: 'Montmeyan',
    note: 5,
    text: "«Présent, réactif, transparent. Exactement ce qu'on cherchait dans un mandataire.»",
  },
]

export default function HomePage() {
  const assistantUrl = appUrl('') || '/assistant'

  // Dupliquer les items du ticker pour la boucle seamless
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      {/* ===== HERO — Style MGR ===== */}
      <section className="bg-white min-h-screen px-6 md:px-12 pt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-5rem)] py-12">

          {/* Colonne gauche — texte */}
          <div className="flex flex-col justify-center">

            {/* Zone */}
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={14} className="text-brand" />
              <span className="text-sm font-semibold text-brand">
                Haut-Var &amp; Verdon · 83670
              </span>
            </div>

            {/* H1 */}
            <h1 className="hero-mgr-h1 font-black text-foreground tracking-tight mb-5">
              Votre mandataire
              <br />
              immobilier
              <br />
              <span className="text-brand">de confiance</span>
            </h1>

            {/* Description */}
            <p className="text-base text-muted leading-relaxed mb-8 max-w-md">
              Estimation gratuite basée sur les données DVF réelles, analyse des risques,
              accompagnement transparent de A à Z. Sans frais cachés.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button asChild size="lg" variant="secondary">
                <Link
                  href={assistantUrl}
                  target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                  rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <CalendarDays size={18} /> Lancer l&apos;assistant
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={env.calcomUrl} target="_blank" rel="noopener noreferrer">
                  Prendre RDV
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {['👤', '👤', '👤', '👤'].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-surface border-2 border-white flex items-center justify-center text-xs">
                    {['SM', 'PL', 'IR', 'JT'][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted">
                <span className="font-bold text-foreground">47+</span> clients accompagnés
              </p>
            </div>

          </div>

          {/* Colonne droite — photo + forme + floating badges */}
          <div className="hidden lg:block">
            <div className="relative mx-auto w-[380px] h-[480px]">

              {/* Forme colorée derrière la photo */}
              <div className="hero-mgr-shape" />

              {/*
                Photo de la personne
                • Placez /public/alex-lopez.png (fond blanc)
                • mix-blend-mode:multiply fusionne le fond blanc
                  de la photo avec la forme bleue
              */}
              <img
                src="/alex-lopez.png"
                alt="Alex Lopez — Mandataire IAD Provence"
                className="hero-mgr-photo"
              />

              {/* Floating badges */}
              {FLOATING_BADGES.map(({ label, icon: Icon, position, color }) => (
                <div
                  key={label}
                  className={`absolute ${position} flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold ${color} shadow-md z-20 whitespace-nowrap`}
                >
                  <Icon size={13} />
                  {label}
                </div>
              ))}

            </div>
          </div>

        </div>
      </section>

      {/* ===== TICKER ===== */}
      <div className="ticker-wrapper">
        <div className="ticker-track">
          {tickerItems.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-4 px-6 text-white text-sm font-semibold uppercase tracking-widest">
              <span className="text-brand">✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ===== SERVICES ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">
              Ce que je fais pour vous
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              Estimer. Vendre. <span className="text-brand">Acheter.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map(({ emoji, title, description, cta, href }) => (
              <Link
                key={title}
                href={href || '/assistant'}
                target={(href || '').startsWith('http') ? '_blank' : undefined}
                rel={(href || '').startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group p-8 rounded-2xl border border-border bg-surface hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="text-3xl mb-5">{emoji}</div>
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
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin size={18} className="text-brand" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Zone couverte</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-foreground mb-4">
            Haut-Var &amp; Verdon, <span className="text-brand">ma Provence</span>
          </h2>
          <p className="text-muted leading-relaxed mb-8 max-w-2xl mx-auto">
            Basé à Varages (83670), j&apos;interviens sur l&apos;ensemble du Haut-Var et des
            communes limitrophes des Alpes-de-Haute-Provence, jusqu&apos;aux Gorges du Verdon.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {COMMUNES_TEASER.map((c) => (
              <span key={c} className="px-3 py-1.5 bg-white rounded-full border border-border text-sm text-foreground">
                {c}
              </span>
            ))}
            <span className="px-3 py-1.5 text-sm text-muted">&amp; bien d&apos;autres…</span>
          </div>
          <Link href="/marche" className="inline-flex items-center gap-2 text-brand font-semibold hover:underline">
            Voir toutes les communes <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===== AVIS TEASER ===== */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand mb-3">Témoignages</p>
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              Ils m&apos;ont <span className="text-brand">fait confiance</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {AVIS_TEASER.map((avis) => (
              <div key={avis.name} className="p-6 rounded-2xl border border-border bg-surface">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: avis.note }).map((_, i) => (
                    <Star key={i} size={14} className="text-brand fill-brand" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-4">{avis.text}</p>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold text-muted">{avis.name[0]}</div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{avis.name}</p>
                    <p className="text-xs text-muted">{avis.lieu}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/avis" className="inline-flex items-center gap-2 text-brand font-semibold hover:underline">
              Voir tous les avis <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 px-6 bg-foreground">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Votre projet commence ici.</h2>
          <p className="text-white/60 mb-8 leading-relaxed">Estimation gratuite, sans engagement, en 2–3 minutes.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="primary">
              <Link
                href={assistantUrl}
                target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
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
