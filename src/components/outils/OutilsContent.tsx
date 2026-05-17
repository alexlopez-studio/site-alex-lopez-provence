'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clock3,
  ClipboardCheck,
  Home,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const hoverCard = { y: -2 }
const springFast = { type: 'spring' as const, stiffness: 420, damping: 28 }

const tools = [
  {
    href: '/outils/vendre',
    icon: Home,
    title: 'Estimer mon bien',
    duration: '3 min',
    desc: 'Obtenez une première fourchette de valeur, puis les éléments à vérifier avant de fixer un prix.',
    bestFor: 'Vous envisagez de vendre ou vous voulez connaître la valeur actuelle de votre bien.',
    deliverables: ['Fourchette de valeur', 'Prix médian estimé', 'Facteurs qui influencent le prix'],
    cta: 'Lancer l’estimation',
    accent: 'bg-brand text-white',
  },
  {
    href: '/outils/acheter',
    icon: Search,
    title: 'Préparer mon achat',
    duration: '2 min',
    desc: 'Structurez votre recherche avant de visiter : budget, communes, critères et faisabilité.',
    bestFor: 'Vous cherchez un bien et vous voulez clarifier votre projet avant de perdre du temps.',
    deliverables: ['Budget cible', 'Critères essentiels', 'Secteurs prioritaires'],
    cta: 'Préparer ma recherche',
    accent: 'bg-brand text-white',
  },
  {
    href: '/outils/audit',
    icon: ClipboardCheck,
    title: 'Analyser un bien',
    duration: '4 min',
    desc: 'Repérez les points de vigilance avant une vente, un achat ou des travaux.',
    bestFor: 'Vous avez un bien précis en tête et vous voulez prendre du recul avant de décider.',
    deliverables: ['Points de vigilance', 'État général', 'Travaux et énergie'],
    cta: 'Faire un point sur un bien',
    accent: 'bg-brand text-white',
  },
]

const reassurance = [
  { icon: BadgeCheck, label: 'Gratuit' },
  { icon: ShieldCheck, label: 'Sans engagement' },
  { icon: MapPin, label: 'Provence Verte & Verdon' },
]

const steps = [
  'Choisissez le parcours adapté à votre situation.',
  'Répondez à quelques questions ciblées.',
  'Obtenez un premier repère concret pour avancer.',
]

export default function OutilsContent() {
  return (
    <section className="min-h-screen bg-paper px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[54rem] flex-col items-center justify-center"
      >
        <motion.div variants={fadeInUp} className="mb-7 text-center">
          <Link href="/" className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-lg font-bold text-white shadow-sm">
            AL
          </Link>
          <p className="text-sm font-semibold text-foreground">Alexandre Lopez</p>
          <p className="mt-1 text-sm text-muted">Conseiller immobilier · Provence Verte & Verdon</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-8 max-w-3xl text-center">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
            Outils immobiliers
          </p>
          <h1 className="font-serif text-4xl font-medium leading-tight tracking-[-0.05em] text-foreground sm:text-5xl">
            Commencez par clarifier votre projet.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Ces outils ne remplacent pas un accompagnement humain. Ils servent à poser les bonnes bases : valeur, faisabilité, critères, points de vigilance.
          </p>
        </motion.div>

        <motion.div variants={staggerFast} className="mb-6 flex flex-wrap justify-center gap-2">
          {reassurance.map(function (item) {
            const Icon = item.icon
            return (
              <motion.span key={item.label} variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-xs font-medium text-foreground shadow-sm">
                <Icon size={13} className="text-brand" />
                {item.label}
              </motion.span>
            )
          })}
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-6 grid w-full grid-cols-1 gap-2 rounded-[1.5rem] border border-border bg-white p-3 shadow-sm sm:grid-cols-3">
          {steps.map(function (step, index) {
            return (
              <div key={step} className="flex items-start gap-3 rounded-2xl bg-surface px-4 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand">{index + 1}</span>
                <p className="text-xs font-medium leading-relaxed text-foreground">{step}</p>
              </div>
            )
          })}
        </motion.div>

        <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce} className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
          {tools.map(function (tool) {
            const Icon = tool.icon
            return (
              <motion.div key={tool.href} variants={scaleIn} whileHover={hoverCard} transition={springFast}>
                <Link href={tool.href} className="group flex h-full flex-col rounded-[1.7rem] border border-border bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all hover:border-brand/40 sm:p-6">
                  <div className="mb-5 flex items-start justify-between gap-4">
                    <div className={'flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ' + tool.accent}>
                      <Icon size={21} />
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted">
                      <Clock3 size={12} /> {tool.duration}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold tracking-[-0.035em] text-foreground">{tool.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{tool.desc}</p>

                  <div className="mt-5 rounded-2xl bg-brand-light/70 p-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand">
                      <Sparkles size={13} /> Utile si
                    </p>
                    <p className="text-sm leading-relaxed text-brand-dark/80">{tool.bestFor}</p>
                  </div>

                  <div className="mt-5 flex-1">
                    <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-foreground">
                      <BarChart3 size={13} className="text-brand" /> Ce que vous obtenez
                    </p>
                    <div className="space-y-2">
                      {tool.deliverables.map(function (detail) {
                        return (
                          <span key={detail} className="flex items-center gap-2 text-sm text-foreground">
                            <CheckCircle2 size={14} className="shrink-0 text-brand" />
                            {detail}
                          </span>
                        )
                      })}
                    </div>
                  </div>

                  <span className="mt-6 inline-flex items-center justify-between rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-brand-hover">
                    {tool.cta}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p variants={fadeInUp} className="mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted">
          Vos réponses m’aident à mieux comprendre votre situation. Si vous souhaitez aller plus loin, je peux ensuite relire le résultat avec vous et l’adapter au contexte local.
        </motion.p>
      </motion.div>
    </section>
  )
}
