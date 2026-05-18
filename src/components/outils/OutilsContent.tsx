'use client'

import { useEffect, useState } from 'react'
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
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Wifi,
} from 'lucide-react'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const PROFILE_IMAGE = '/alexandre-lopez-no-background.png'
const hoverCard = { y: -3 }
const springFast = { type: 'spring' as const, stiffness: 420, damping: 28 }

type ApiCheckStatus = 'ok' | 'warning' | 'error'
type ApiCheckItem = {
  id: string
  label: string
  status: ApiCheckStatus
  detail: string
}
type ApiCheckResponse = {
  checkedAt: string
  overallStatus: ApiCheckStatus
  checks: ApiCheckItem[]
}

const tools = [
  {
    href: '/outils/vendre',
    icon: Home,
    title: 'Estimer mon bien',
    duration: '3 min',
    desc: 'Obtenez une première fourchette de valeur et les points qui peuvent influencer le prix.',
    bestFor: 'Vous envisagez de vendre ou vous voulez connaître la valeur actuelle de votre bien.',
    deliverables: ['Fourchette de valeur', 'Prix médian estimé', 'Stratégie de prix'],
    cta: 'Lancer l’estimation',
    badge: 'Le plus demandé',
  },
  {
    href: '/outils/acheter',
    icon: Search,
    title: 'Préparer mon achat',
    duration: '2 min',
    desc: 'Cadrez votre recherche avant de visiter : budget, communes, critères et financement.',
    bestFor: 'Vous cherchez un bien et vous voulez éviter les visites inutiles.',
    deliverables: ['Budget cible', 'Critères essentiels', 'Secteurs prioritaires'],
    cta: 'Préparer ma recherche',
    badge: 'Projet achat',
  },
  {
    href: '/outils/audit',
    icon: ClipboardCheck,
    title: 'Analyser un bien',
    duration: '4 min',
    desc: 'Repérez les points de vigilance avant une vente, un achat ou des travaux.',
    bestFor: 'Vous avez un bien précis en tête et vous voulez prendre du recul avant de décider.',
    deliverables: ['Score global', 'Points de vigilance', 'Recommandations travaux'],
    cta: 'Faire un point sur un bien',
    badge: 'Avant décision',
  },
]

const reassurance = [
  { icon: BadgeCheck, label: 'Gratuit' },
  { icon: ShieldCheck, label: 'Sans engagement' },
  { icon: MapPin, label: 'Provence Verte & Verdon' },
]

const steps = [
  {
    title: 'Choisissez le bon outil',
    text: 'Vendre, acheter ou analyser un bien : chaque parcours a ses propres questions.',
  },
  {
    title: 'Répondez simplement',
    text: 'Quelques informations suffisent pour obtenir une première lecture concrète.',
  },
  {
    title: 'Recevez un repère clair',
    text: 'Vous obtenez une synthèse utile, puis je peux la relire avec vous si besoin.',
  },
]

export default function OutilsContent() {
  return (
    <main className="min-h-screen bg-[#f4f7f8] text-foreground">
      <section className="relative overflow-hidden px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-light/80 blur-3xl" />
        <motion.div variants={stagger} initial="initial" animate="animate" className="relative mx-auto max-w-6xl">
          <motion.div variants={fadeInUp} className="mx-auto mb-10 max-w-3xl text-center">
            <Link href="/" className="mx-auto mb-6 block h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-white shadow-sm ring-4 ring-brand-light">
              <img src={PROFILE_IMAGE} alt="Alexandre Lopez" className="h-full w-full object-cover object-[50%_16%]" />
            </Link>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand shadow-sm">
              <Sparkles size={13} /> Outils immobiliers gratuits
            </p>
            <h1 className="font-serif text-4xl font-medium leading-tight tracking-[-0.05em] text-foreground sm:text-5xl lg:text-6xl">
              Clarifiez votre projet avant de décider.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Estimation, achat ou audit : ces outils vous donnent un premier repère concret en Provence Verte & Verdon. Ils ne remplacent pas un accompagnement humain, mais ils aident à poser les bonnes bases.
            </p>
          </motion.div>

          <ApiChecksPanel compact />

          <motion.div variants={staggerFast} className="mb-8 mt-8 flex flex-wrap justify-center gap-2">
            {reassurance.map(function (item) {
              const Icon = item.icon
              return (
                <motion.span key={item.label} variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                  <Icon size={14} className="text-brand" />
                  {item.label}
                </motion.span>
              )
            })}
          </motion.div>

          <motion.div variants={staggerFast} className="grid gap-5 lg:grid-cols-3">
            {tools.map(function (tool) {
              const Icon = tool.icon
              return (
                <motion.article key={tool.href} variants={scaleIn} whileHover={hoverCard} transition={springFast}>
                  <Link href={tool.href} className="group flex h-full flex-col rounded-[2rem] border border-border bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] transition-all hover:border-brand/40 hover:shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-brand text-white shadow-sm">
                        <Icon size={23} />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="rounded-full bg-brand-light px-3 py-1 text-xs font-bold text-brand">{tool.badge}</span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface px-2.5 py-1 text-xs font-semibold text-muted">
                          <Clock3 size={12} /> {tool.duration}
                        </span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold tracking-[-0.04em] text-foreground">{tool.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{tool.desc}</p>

                    <div className="mt-5 rounded-2xl bg-brand-light/70 p-4">
                      <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand">
                        <Target size={13} /> Utile si
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

                    <span className="mt-6 inline-flex items-center justify-between rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors group-hover:bg-brand-hover">
                      {tool.cta}
                      <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.article>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto grid max-w-6xl gap-5 rounded-[2rem] border border-border bg-white p-5 shadow-sm md:grid-cols-3">
          {steps.map(function (step, index) {
            return (
              <motion.div key={step.title} variants={fadeInUp} className="rounded-2xl bg-surface p-5">
                <span className="mb-4 flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand">{index + 1}</span>
                <h3 className="text-base font-bold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.p variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-muted">
          Vos réponses servent uniquement à mieux comprendre votre situation et à générer une première synthèse. Si vous souhaitez aller plus loin, je peux ensuite relire le résultat avec vous.
        </motion.p>
      </section>
    </main>
  )
}

function ApiChecksPanel({ compact = false }: { compact?: boolean }) {
  const [result, setResult] = useState<ApiCheckResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    runChecks()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function runChecks() {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/outils/checks', { cache: 'no-store' })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.error ?? 'Vérification impossible')
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Vérification impossible')
    } finally {
      setLoading(false)
    }
  }

  const overall = result?.overallStatus
  const statusLabel = loading ? 'Test en cours' : overall === 'ok' ? 'APIs opérationnelles' : overall === 'warning' ? 'APIs partiellement vérifiées' : overall === 'error' ? 'Action requise' : 'Vérification à lancer'
  const statusColor = overall === 'ok' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : overall === 'warning' ? 'bg-amber-50 text-amber-700 border-amber-200' : overall === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white text-muted border-border'

  return (
    <section className={compact ? '' : 'px-4 pb-16 sm:px-6 lg:px-8'}>
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-brand/20 bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brand">
              <Wifi size={13} /> Statut des connexions outils
            </p>
            <h2 className="text-xl font-bold tracking-[-0.04em] text-foreground">Vérification automatique des APIs</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              Le test se lance automatiquement à l’ouverture de cette page. Il contrôle l’adresse, le DPE / cadastre, l’estimation et la création de lead en mode test.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span className={'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold ' + statusColor}>
              {loading && <Loader2 size={15} className="animate-spin" />}
              {!loading && <CheckCircle2 size={15} />}
              {statusLabel}
            </span>
            <button onClick={runChecks} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white disabled:opacity-60">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Wifi size={14} />}
              Relancer le test
            </button>
          </div>
        </div>

        {error && <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

        {result && (
          <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {result.checks.map(function (check) {
              const color = check.status === 'ok' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : check.status === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-red-200 bg-red-50 text-red-700'
              const label = check.status === 'ok' ? 'OK' : check.status === 'warning' ? 'À vérifier' : 'Erreur'
              return (
                <div key={check.id} className={'rounded-2xl border px-4 py-3 text-left ' + color}>
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-bold">{check.label}</p>
                    <span className="text-[10px] font-black uppercase tracking-[0.12em]">{label}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed opacity-85">{check.detail}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
