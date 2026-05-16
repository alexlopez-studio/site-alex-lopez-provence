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
} from 'lucide-react'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const hoverCard = { y: -4 }
const springFast = { type: 'spring' as const, stiffness: 420, damping: 28 }

const tools = [
  {
    href: '/outils/vendre',
    icon: Home,
    emoji: '🏡',
    title: 'Estimer mon bien',
    duration: '3 min',
    desc: 'Obtenir une fourchette de prix réaliste à partir de votre adresse, du bien et des ventes récentes.',
    details: ['Prix estimé', 'Fourchette basse / haute', 'Lecture marché local'],
    cta: 'Lancer l’estimation',
    accent: 'bg-brand-light text-brand',
  },
  {
    href: '/outils/acheter',
    icon: Search,
    emoji: '🔎',
    title: 'Trouver un bien',
    duration: '2 min',
    desc: 'Décrire votre recherche pour clarifier votre budget, vos communes et vos critères prioritaires.',
    details: ['Budget cible', 'Communes recherchées', 'Critères essentiels'],
    cta: 'Décrire ma recherche',
    accent: 'bg-emerald-50 text-emerald-700',
  },
  {
    href: '/outils/audit',
    icon: ClipboardCheck,
    emoji: '✅',
    title: 'Audit immobilier',
    duration: '4 min',
    desc: 'Identifier les points de vigilance d’un bien : état général, énergie, travaux et potentiel.',
    details: ['Score du bien', 'Points de vigilance', 'Priorités travaux'],
    cta: 'Démarrer l’audit',
    accent: 'bg-amber-50 text-amber-700',
  },
]

const reassurance = [
  { icon: BadgeCheck, label: 'Gratuit' },
  { icon: ShieldCheck, label: 'Sans engagement' },
  { icon: MapPin, label: 'Provence Verte & Haut-Var' },
]

export default function OutilsContent() {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-[#F8FAFC] px-4 py-10 sm:px-6 lg:py-14">
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="mx-auto flex w-full max-w-[70rem] flex-col items-center"
      >
        <motion.div variants={fadeInUp} className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand text-lg font-bold text-white shadow-sm">
            AL
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-muted shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Outils disponibles maintenant
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="max-w-3xl text-center">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
            Moteur d’estimation
          </p>
          <h1 className="font-serif text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
            Choisissez l’outil adapté à votre projet immobilier.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Une page hub simple, comme une prise de rendez-vous : sélectionnez un outil, puis avancez étape par étape dans le parcours correspondant.
          </p>
        </motion.div>

        <motion.div variants={staggerFast} className="mt-7 flex flex-wrap justify-center gap-2.5">
          {reassurance.map(function (item) {
            const Icon = item.icon
            return (
              <motion.span
                key={item.label}
                variants={fadeInUp}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                <Icon size={14} className="text-brand" />
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
          className="mt-12 grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
        >
          {tools.map(function (tool) {
            const Icon = tool.icon
            return (
              <motion.div key={tool.href} variants={scaleIn} whileHover={hoverCard} transition={springFast}>
                <Link
                  href={tool.href}
                  className="group flex h-full flex-col rounded-[1.75rem] border border-border bg-white p-5 shadow-sm transition-all duration-200 hover:border-brand/40 hover:shadow-lg sm:p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={'flex h-12 w-12 items-center justify-center rounded-2xl ' + tool.accent}>
                      <Icon size={22} />
                    </div>
                    <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted">
                      {tool.duration}
                    </span>
                  </div>

                  <div className="mt-6 flex-1">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="text-xl" aria-hidden="true">{tool.emoji}</span>
                      <h2 className="text-xl font-extrabold tracking-[-0.02em] text-foreground">
                        {tool.title}
                      </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">
                      {tool.desc}
                    </p>

                    <ul className="mt-5 space-y-2">
                      {tool.details.map(function (detail) {
                        return (
                          <li key={detail} className="flex items-center gap-2 text-sm font-medium text-foreground">
                            <Sparkles size={13} className="text-brand" />
                            {detail}
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  <div className="mt-7 flex items-center justify-between border-t border-border pt-5">
                    <span className="text-sm font-bold text-brand">{tool.cta}</span>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div variants={fadeInUp} className="mt-10 w-full max-w-2xl rounded-2xl border border-border bg-white px-5 py-4 text-center text-sm leading-relaxed text-muted shadow-sm">
          Les parcours s’ouvrent séparément : vous cliquez sur l’outil voulu, puis vous entrez dans le formulaire conversationnel correspondant.
        </motion.div>
      </motion.div>
    </section>
  )
}
