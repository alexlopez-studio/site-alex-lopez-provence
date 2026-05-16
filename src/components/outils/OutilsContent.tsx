'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  ClipboardCheck,
  Home,
  LayoutDashboard,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const hoverCard = { y: -3 }
const springFast = { type: 'spring' as const, stiffness: 420, damping: 28 }

const tools = [
  {
    href: '/outils/vendre',
    icon: Home,
    eyebrow: 'Vendre',
    title: 'Estimer mon bien',
    duration: '3 min',
    desc: 'Obtenez une première fourchette de valeur et les éléments qui peuvent influencer votre prix de vente.',
    details: ['Valeur estimée', 'Fourchette de prix', 'Atouts du bien'],
    cta: 'Commencer',
    accent: 'bg-brand text-white',
  },
  {
    href: '/outils/acheter',
    icon: Search,
    eyebrow: 'Acheter',
    title: 'Préparer ma recherche',
    duration: '2 min',
    desc: 'Précisez votre projet pour mieux cerner votre budget, vos critères et les communes à privilégier.',
    details: ['Budget', 'Critères', 'Secteurs ciblés'],
    cta: 'Décrire mon projet',
    accent: 'bg-emerald-600 text-white',
  },
  {
    href: '/outils/audit',
    icon: ClipboardCheck,
    eyebrow: 'Analyser',
    title: 'Faire un point sur un bien',
    duration: '4 min',
    desc: 'Repérez les points à vérifier avant une vente, un achat ou des travaux.',
    details: ['État général', 'Énergie', 'Travaux possibles'],
    cta: 'Démarrer l’analyse',
    accent: 'bg-amber-500 text-white',
  },
]

const reassurance = [
  { icon: BadgeCheck, label: 'Gratuit' },
  { icon: ShieldCheck, label: 'Sans engagement' },
  { icon: MapPin, label: 'Provence Verte & Haut-Var' },
]

const benefits = [
  'Vous obtenez un premier repère en quelques minutes.',
  'Vous avancez à votre rythme, sans créer de compte.',
  'Je peux ensuite vous répondre avec des informations plus précises.',
]

export default function OutilsContent() {
  return (
    <section className="min-h-screen bg-[#F4F7FA] p-3 text-foreground sm:p-4 lg:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[78rem] overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[17rem_1fr]">
        <aside className="hidden border-r border-border bg-[#FBFCFD] p-5 lg:flex lg:flex-col">
          <Link href="/" className="mb-8 inline-flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-xs font-bold text-white">AL</span>
            <span>
              <span className="block text-sm font-bold tracking-[-0.02em] text-black">Alexandre Lopez</span>
              <span className="block text-xs text-muted">Conseiller immobilier</span>
            </span>
          </Link>

          <nav className="space-y-2">
            <div className="flex items-center gap-3 rounded-2xl bg-brand px-4 py-3 text-sm font-bold text-white shadow-sm">
              <LayoutDashboard size={17} />
              Tableau de bord
            </div>
            <div className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted">
              <BarChart3 size={17} />
              Outils d’analyse
            </div>
          </nav>

          <div className="mt-auto rounded-3xl border border-border bg-white p-4">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">Votre projet</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground">
              Choisissez un parcours pour obtenir un premier avis clair avant d’échanger ensemble.
            </p>
          </div>
        </aside>

        <main className="relative overflow-hidden bg-[#F8FAFC]">
          <div className="pointer-events-none absolute right-[-10rem] top-[-10rem] h-[28rem] w-[28rem] rounded-full bg-brand-light/70 blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-12rem] left-[10%] h-[24rem] w-[24rem] rounded-full bg-accent-light/60 blur-3xl" />

          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="relative flex min-h-full flex-col px-4 py-4 sm:px-6 lg:px-8 lg:py-6"
          >
            <motion.header variants={fadeInUp} className="flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white">AL</span>
                <span className="text-sm font-semibold tracking-[-0.01em] text-foreground">Alexandre Lopez</span>
              </Link>
            </motion.header>

            <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10 lg:py-10">
              <motion.div variants={fadeInUp} className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-brand shadow-sm">
                  <LayoutDashboard size={13} />
                  Votre espace projet immobilier
                </p>
                <h1 className="text-4xl font-semibold leading-[1.03] tracking-[-0.055em] text-black sm:text-5xl lg:text-6xl">
                  Avancez sur votre projet avec le bon outil.
                </h1>
                <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
                  Estimation, recherche ou analyse d’un bien : choisissez votre parcours et obtenez un premier repère simple, utile et local.
                </p>

                <div className="mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start">
                  {reassurance.map(function (item) {
                    const Icon = item.icon
                    return (
                      <span key={item.label} className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm ring-1 ring-black/5">
                        <Icon size={14} className="text-brand" />
                        {item.label}
                      </span>
                    )
                  })}
                </div>

                <div className="mt-8 rounded-[1.5rem] border border-border bg-white p-4 text-left shadow-sm">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-muted">Ce que vous allez obtenir</p>
                  <ul className="space-y-2.5">
                    {benefits.map(function (benefit) {
                      return (
                        <li key={benefit} className="flex gap-2 text-sm leading-relaxed text-foreground">
                          <Sparkles size={14} className="mt-1 shrink-0 text-brand" />
                          <span>{benefit}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </motion.div>

              <motion.div
                variants={staggerFast}
                initial="initial"
                whileInView="animate"
                viewport={vpOnce}
                className="grid gap-3 sm:gap-4"
              >
                {tools.map(function (tool, index) {
                  const Icon = tool.icon
                  return (
                    <motion.div key={tool.href} variants={scaleIn} whileHover={hoverCard} transition={springFast}>
                      <Link
                        href={tool.href}
                        className="group flex gap-4 rounded-[1.65rem] border border-border bg-white p-4 shadow-sm transition-all duration-200 hover:border-brand/40 hover:shadow-xl sm:p-5"
                      >
                        <div className="pt-1">
                          <div className={'flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ' + tool.accent}>
                            <Icon size={21} />
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                              {String(index + 1).padStart(2, '0')} · {tool.eyebrow}
                            </span>
                            <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-bold text-white">
                              {tool.duration}
                            </span>
                          </div>
                          <h2 className="text-xl font-extrabold tracking-[-0.035em] text-black sm:text-2xl">
                            {tool.title}
                          </h2>
                          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                            {tool.desc}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {tool.details.map(function (detail) {
                              return (
                                <span key={detail} className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-foreground">
                                  {detail}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </section>
  )
}
