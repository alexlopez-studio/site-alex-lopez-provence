'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, CheckCircle2, MapPin, Phone, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'
import { alignTerritory } from '@/lib/territory'

const PHONE_RAW = '+33613180168'

export type EditorialNamespace = 'vendre' | 'acheter' | 'audit'

const visualByNamespace: Record<EditorialNamespace, { image: string; label: string; note: string }> = {
  vendre: {
    image: '/village-cotignac.jpg',
    label: 'Vente immobilière',
    note: 'Positionner, valoriser, négocier avec méthode.',
  },
  acheter: {
    image: '/maison-bleue-cotignac.jpg',
    label: 'Projet d’achat',
    note: 'Cadrer la recherche et sécuriser chaque étape.',
  },
  audit: {
    image: '/hans-olive-tree-1595493_1920.jpg',
    label: 'Point sur le bien',
    note: 'Identifier les points utiles avant de décider.',
  },
}

export default function EditorialPage({ namespace, simulatorHref }: { namespace: EditorialNamespace; simulatorHref: string }) {
  const t = useTranslations(namespace)
  const tCommon = useTranslations('common')
  const tHeader = useTranslations('header')
  const phoneDisplay = tCommon('phoneDisplay')
  const visual = visualByNamespace[namespace]
  const copy = (key: string) => alignTerritory(t(key))

  const steps = ([1, 2, 3, 4] as const).map(function (n) {
    return { n, title: copy('step' + n + 'Title'), desc: copy('step' + n + 'Desc') }
  })
  const stats = ([1, 2, 3] as const).map(function (n) {
    return { value: copy('stat' + n + 'Value'), label: copy('stat' + n + 'Label') }
  })
  const faqs = ([1, 2, 3, 4] as const).map(function (n) {
    return { q: copy('q' + n + 'q'), a: copy('q' + n + 'a') }
  })

  return (
    <>
      <section className="relative overflow-hidden bg-paper px-6 pb-20 pt-20 lg:pb-24 lg:pt-24">
        <div className="absolute left-0 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-light/70 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-72 w-72 translate-x-1/3 rounded-full bg-accent-light/70 blur-3xl" />
        <motion.div variants={stagger} initial="initial" animate="animate" className="relative mx-auto grid max-w-[75rem] items-center gap-12 lg:grid-cols-[0.98fr_1.02fr]">
          <div>
            <motion.p variants={fadeInUp} className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              <Sparkles size={14} /> {copy('heroEyebrow')}
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-serif text-4xl font-medium leading-[1.03] tracking-[-0.045em] text-foreground sm:text-5xl lg:text-6xl">
              {copy('heroTitleLine1')}<br />
              <span className="text-brand">{copy('heroTitleAccent')}</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">
              {copy('heroSubtitle')}
            </motion.p>
            <motion.div variants={fadeInUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" variant="primary">
                <Link href={simulatorHref}>{copy('heroCtaSimulator')} <ArrowRight size={16} /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={'tel:' + PHONE_RAW} aria-label={tHeader('callAria', { phone: phoneDisplay })}>
                  <Phone size={16} /> {copy('heroCtaPhone')}
                </a>
              </Button>
            </motion.div>
          </div>

          <motion.div variants={scaleIn} className="relative min-h-[27rem] lg:min-h-[34rem]">
            <div className="absolute inset-0 overflow-hidden rounded-[2.2rem] border border-white/70 bg-foreground shadow-2xl">
              <img src={visual.image} alt={visual.label} className="h-full w-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent" />
              <div className="absolute bottom-7 left-7 right-7 text-white">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">{visual.label}</p>
                <p className="max-w-sm font-serif text-3xl font-medium leading-tight tracking-[-0.035em]">{visual.note}</p>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-2 rounded-[1.5rem] border border-border bg-white/95 p-5 shadow-xl backdrop-blur sm:left-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">Provence Verte & Verdon</p>
              <p className="mt-2 max-w-[14rem] text-sm font-semibold leading-snug text-foreground">Un accompagnement local, clair et sans promesse artificielle.</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-[75rem]">
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">{copy('processEyebrow')}</p>
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground md:text-5xl">{copy('processTitle')}</h2>
          </motion.div>
          <motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map(function (step) {
              return (
                <motion.div key={step.n} variants={scaleIn} className="group rounded-[1.7rem] border border-border bg-paper p-7 transition-all hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl">
                  <span className="mb-7 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-brand shadow-sm">{step.n}</span>
                  <h3 className="mb-3 text-xl font-bold leading-tight tracking-[-0.025em] text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{step.desc}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-brand-dark px-6 py-24 text-white">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto grid max-w-[75rem] items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <motion.p variants={fadeInUp} className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-light">{copy('expertiseEyebrow')}</motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl font-medium leading-tight tracking-[-0.04em] md:text-6xl">{copy('expertiseTitle')}</motion.h2>
            <motion.p variants={fadeInUp} className="mt-7 max-w-2xl leading-relaxed text-white/75">{copy('expertisePara1')}</motion.p>
            <motion.p variants={fadeInUp} className="mt-4 max-w-2xl leading-relaxed text-white/75">{copy('expertisePara2')}</motion.p>
          </div>
          <motion.div variants={staggerFast} className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {stats.map(function (stat) {
              return (
                <motion.div key={stat.label} variants={scaleIn} className="rounded-[1.5rem] border border-white/15 bg-white/10 p-6 backdrop-blur">
                  <p className="font-serif text-4xl font-medium tracking-[-0.04em] text-brand-light">{stat.value}</p>
                  <p className="mt-2 text-sm text-white/70">{stat.label}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-paper px-6 py-20">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-3xl">
          <motion.div variants={fadeInUp} className="mb-12 text-center">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">{copy('faqEyebrow')}</p>
            <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground md:text-5xl">{copy('faqTitle')}</h2>
          </motion.div>
          <motion.div variants={staggerFast} className="space-y-4">
            {faqs.map(function (item) {
              return (
                <motion.div key={item.q} variants={fadeInUp} className="rounded-[1.4rem] border border-border bg-white p-6 shadow-sm">
                  <h3 className="mb-3 flex items-start gap-3 text-lg font-bold tracking-[-0.02em] text-foreground"><CheckCircle2 size={18} className="mt-1 shrink-0 text-brand" /> {item.q}</h3>
                  <p className="pl-8 text-sm leading-relaxed text-muted">{item.a}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white px-6 py-20">
        <motion.div variants={scaleIn} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-4xl overflow-hidden rounded-[2.2rem] border border-border bg-foreground p-10 text-center text-white shadow-2xl md:p-14">
          <p className="mb-3 inline-flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-light"><MapPin size={14} /> {copy('ctaEyebrow')}</p>
          <h2 className="font-serif text-3xl font-medium leading-tight tracking-[-0.04em] md:text-5xl">{copy('ctaTitle')}</h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/70">{copy('ctaDescription')}</p>
          <div className="mt-8">
            <Button asChild size="lg" variant="primary">
              <Link href={simulatorHref}>{copy('ctaSimulator')} <ArrowRight size={16} /></Link>
            </Button>
          </div>
        </motion.div>
      </section>
    </>
  )
}
