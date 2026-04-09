import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  MapPin,
  Star,
  Home,
  Search,
  ClipboardCheck,
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

const SERVICES = [
  {
    icon: Home,
    title: 'Vendre',
    description:
      'Estimation ancrée dans les données DVF réelles, analyse des risques, stratégie de vente sur mesure.',
    cta: 'Estimer mon bien',
    href: appUrl('/vendre'),
  },
  {
    icon: Search,
    title: 'Acheter',
    description:
      "Décrivez votre projet en quelques secondes. L'assistant identifie les biens et anticipe les négociations.",
    cta: 'Décrire mon projet',
    href: appUrl('/acheter'),
  },
  {
    icon: ClipboardCheck,
    title: 'Audit immobilier express',
    description:
      "Identifiez tous les risques avant de vendre ou d'achèter — juridiques, techniques, environnementaux.",
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

  return (
    <>
      {/* ===== HERO ===== */}
      <div className="bg-white">
        <section className="bg-[#FCF8F1] bg-opacity-30 py-10 sm:py-16 lg:py-24">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">

              {/* Left — Text */}
              <div>
                <p className="text-base font-semibold tracking-wider text-blue-600 uppercase">
                  A social media for learners
                </p>
                <h1 className="mt-4 text-4xl font-bold text-black lg:mt-8 sm:text-6xl xl:text-8xl">
                  Connect &amp; learn from the experts
                </h1>
                <p className="mt-4 text-base text-black lg:mt-8 sm:text-xl">
                  Grow your career fast with right mentor.
                </p>
                <a
                  href="#"
                  title=""
                  className="inline-flex items-center px-6 py-4 mt-8 font-semibold text-black transition-all duration-200 bg-yellow-300 rounded-full lg:mt-16 hover:bg-yellow-400 focus:bg-yellow-400"
                  role="button"
                >
                  Join for free
                  <svg
                    className="w-6 h-6 ml-8 -mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </a>
                <p className="mt-5 text-gray-600">
                  Already joined us?{' '}
                  <a href="#" title="" className="text-black transition-all duration-200 hover:underline">
                    Log in
                  </a>
                </p>
              </div>

              {/* Right — Photo + shape animée */}
              <div className="flex items-center justify-center">
                <div className="hero-photo-wrapper">
                  {/* Shape secondaire (profondeur) */}
                  <div className="hero-photo-shape-2" />
                  {/* Shape principale (blob morphing + glow) */}
                  <div className="hero-photo-shape" />
                  {/*
                    Photo de la personne.
                    Placez votre photo dans /public/alex-lopez.png
                    Fond blanc recommandé pour le mix-blend-mode: multiply
                  */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="hero-photo-img"
                    src="/alex-lopez.png"
                    alt="Alex Lopez — Mandataire IAD Provence"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>
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
            {SERVICES.map(({ icon: Icon, title, description, cta, href }) => (
              <Link
                key={title}
                href={href || '/assistant'}
                target={(href || '').startsWith('http') ? '_blank' : undefined}
                rel={(href || '').startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group p-8 rounded-2xl border border-border bg-surface hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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
                  <div className="w-7 h-7 rounded-full bg-surface border border-border flex items-center justify-center text-xs font-bold">{avis.name[0]}</div>
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
