'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  ClipboardCheck,
  Home,
  MapPin,
  Search,
  ShieldCheck,
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
    desc: 'Obtenez une première fourchette de valeur pour votre maison, appartement ou terrain.',
    details: ['Valeur estimée', 'Fourchette de prix', 'Atouts du bien'],
    accent: 'bg-brand text-white',
  },
  {
    href: '/outils/acheter',
    icon: Search,
    title: 'Préparer ma recherche',
    duration: '2 min',
    desc: 'Précisez vos critères, votre budget et les communes qui vous intéressent.',
    details: ['Budget', 'Critères', 'Secteurs ciblés'],
    accent: 'bg-emerald-600 text-white',
  },
  {
    href: '/outils/audit',
    icon: ClipboardCheck,
    title: 'Faire un point sur un bien',
    duration: '4 min',
    desc: 'Identifiez les points à vérifier avant une vente, un achat ou des travaux.',
    details: ['État général', 'Énergie', 'Travaux possibles'],
    accent: 'bg-amber-500 text-white',
  },
]

const reassurance = [
  { icon: BadgeCheck, label: 'Gratuit' },
  { icon: ShieldCheck, label: 'Sans engagement' },
  { icon: MapPin, label: 'Provence Verte & Haut-Var' },
]

export default function OutilsContent() {
  return (
    <section className="min-h-screen bg-[#F7F8FA] px-4 py-8 text-foreground sm:px-6 lg:px-8">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[46rem] flex-col items-center justify-center"
      >
        <motion.div variants={fadeInUp} className="mb-7 text-center">
          <Link href="/" className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-black text-lg font-bold text-white shadow-sm">
            AL
          </Link>
          <p className="text-sm font-semibold text-foreground">Alexandre Lopez</p>
          <p className="mt-1 text-sm text-muted">Conseiller immobilier · Provence Verte & Haut-Var</p>
        </motion.div>

        <motion.div variants={fadeInUp} className="mb-8 max-w-2xl text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-[-0.045em] text-black sm:text-4xl">
            Quel est votre projet immobilier ?
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-muted">
            Choisissez un outil pour obtenir un premier repère simple et local avant d’échanger ensemble.
          </p>
        </motion.div>

        <motion.div variants={staggerFast} className="mb-5 flex flex-wrap justify-center gap-2">
          {reassurance.map(function (item) {
            const Icon = item.icon
            return (
              <motion.span
                key={item.label}
                variants={fadeInUp}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-xs font-medium text-foreground shadow-sm"
              >
                <Icon size={13} className="text-brand" />
                {item.label}
              </motion.span>
            )
          })}
        </motion.div>

        <motion.div
          variants={staggerFast}
          initial="initial"
          whileInView="animate"
          viewport={vpOnce}
          className="w-full overflow-hidden rounded-[1.5rem] border border-border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)]"
        >
          {tools.map(function (tool, index) {
            const Icon = tool.icon
            const isLast = index === tools.length - 1
            return (
              <motion.div key={tool.href} variants={scaleIn} whileHover={hoverCard} transition={springFast}>
                <Link
                  href={tool.href}
                  className={
                    'group flex items-start gap-4 bg-white p-5 transition-colors hover:bg-[#F8FAFC] sm:p-6 ' +
                    (isLast ? '' : 'border-b border-border')
                  }
                >
                  <div className="pt-0.5">
                    <div className={'flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm ' + tool.accent}>
                      <Icon size={20} />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-bold tracking-[-0.025em] text-black sm:text-xl">
                        {tool.title}
                      </h2>
                      <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted">
                        <Clock3 size={12} />
                        {tool.duration}
                      </span>
                    </div>
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

                  <div className="flex min-h-11 items-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-muted transition-colors group-hover:bg-brand group-hover:text-white">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p variants={fadeInUp} className="mt-5 max-w-lg text-center text-xs leading-relaxed text-muted">
          Vos réponses m’aident à mieux comprendre votre besoin et à vous orienter plus efficacement.
        </motion.p>
      </motion.div>
    </section>
  )
}
