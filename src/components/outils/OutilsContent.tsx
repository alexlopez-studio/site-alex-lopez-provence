'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const hoverCard = { y: -4 }
const springFast = { type: 'spring' as const, stiffness: 420, damping: 28 }

const tools = [
  {
    href: '/outils/vendre',
    icon: Home,
    eyebrow: 'Vendeur',
    title: 'Estimer mon bien',
    duration: '3 min',
    desc: 'Une première lecture du prix de vente possible, basée sur votre adresse, votre bien et le marché local.',
    details: ['Fourchette de valeur', 'Positionnement prix', 'Lecture des atouts'],
    cta: 'Commencer',
    accent: 'bg-brand text-white',
  },
  {
    href: '/outils/acheter',
    icon: Search,
    eyebrow: 'Acheteur',
    title: 'Trouver un bien',
    duration: '2 min',
    desc: 'Clarifiez votre recherche pour identifier les bons critères, les bonnes communes et le budget cohérent.',
    details: ['Budget cible', 'Critères clés', 'Zones de recherche'],
    cta: 'Décrire mon projet',
    accent: 'bg-emerald-600 text-white',
  },
  {
    href: '/outils/audit',
    icon: ClipboardCheck,
    eyebrow: 'Analyse',
    title: 'Audit immobilier',
    duration: '4 min',
    desc: 'Repérez les points de vigilance d’un bien avant une vente, un achat ou des travaux.',
    details: ['État général', 'Énergie / DPE', 'Priorités travaux'],
    cta: 'Auditer un bien',
    accent: 'bg-amber-500 text-white',
  },
]

const reassurance = [
  { icon: BadgeCheck, label: 'Gratuit' },
  { icon: ShieldCheck, label: 'Sans engagement' },
  { icon: MapPin, label: 'Provence Verte & Haut-Var' },
]

const benefits = [
  'Comprendre rapidement où vous en êtes.',
  'Obtenir un premier avis avant un échange humain.',
  'Me transmettre un projet déjà qualifié pour mieux vous conseiller.',
]

export default function OutilsContent() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#F6F8FA] px-4 py-5 text-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute left-1/2 top-[-14rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-brand-light/70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-16rem] right-[-10rem] h-[32rem] w-[32rem] rounded-full bg-accent-light/70 blur-3xl" />

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="relative mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-[72rem] flex-col"
      >
        <motion.header variants={fadeInUp} className="flex items-center justify-between py-3">
          <Link href="/" className="inline-flex items-center gap-3 rounded-full bg-white/75 px-3 py-2 shadow-sm ring-1 ring-black/5 backdrop-blur">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-xs font-bold text-white">AL</span>
            <span className="hidden text-sm font-semibold tracking-[-0.01em] text-foreground sm:inline">Alexandre Lopez</span>
          </Link>
          <div className="hidden items-center gap-2 rounded-full bg-white/75 px-3 py-2 text-xs font-semibold text-muted shadow-sm ring-1 ring-black/5 backdrop-blur sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Mini-app immobilier
          </div>
        </motion.header>

        <div className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-10">
          <motion.div variants={fadeInUp} className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-brand shadow-sm backdrop-blur">
              <Target size={13} />
              Lead magnet immobilier
            </p>
            <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.055em] text-black sm:text-5xl lg:text-6xl">
              Trois outils pour transformer une intention immobilière en projet clair.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
              Une expérience courte et premium pour aider vos prospects à comprendre leur situation, puis vous transmettre un besoin déjà qualifié.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2.5 lg:justify-start">
              {reassurance.map(function (item) {
                const Icon = item.icon
                return (
                  <span key={item.label} className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-2 text-sm font-medium text-foreground shadow-sm ring-1 ring-black/5 backdrop-blur">
                    <Icon size={14} className="text-brand" />
                    {item.label}
                  </span>
                )
              })}
            </div>

            <div className="mt-8 rounded-[1.5rem] border border-black/5 bg-white/70 p-4 text-left shadow-sm backdrop-blur">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted">Pourquoi ces outils ?</p>
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
                    className="group relative flex gap-4 rounded-[1.65rem] border border-black/5 bg-white/85 p-4 shadow-sm backdrop-blur transition-all duration-200 hover:border-brand/35 hover:bg-white hover:shadow-xl sm:p-5"
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

        <motion.footer variants={fadeInUp} className="pb-3 text-center text-xs text-muted">
          Vos réponses servent uniquement à préparer un accompagnement immobilier plus pertinent.
        </motion.footer>
      </motion.div>
    </section>
  )
}
