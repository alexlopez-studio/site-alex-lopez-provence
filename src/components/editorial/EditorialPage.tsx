'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, CheckCircle2, MapPin, Phone, Sparkles } from 'lucide-react'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'
import { alignTerritory } from '@/lib/territory'

const PHONE_RAW = '+33613180168'
export type EditorialNamespace = 'vendre' | 'acheter' | 'audit'
const visualByNamespace: Record<EditorialNamespace, { image: string; label: string; note: string; focus: string }> = {
  vendre: { image: '/village-cotignac.jpg', label: 'Vente immobilière', note: 'Positionner, valoriser, négocier avec méthode.', focus: 'Vendre au bon prix, avec une stratégie claire.' },
  acheter: { image: '/maison-bleue-cotignac.jpg', label: 'Projet d’achat', note: 'Cadrer la recherche et sécuriser chaque étape.', focus: 'Acheter avec des critères solides et un budget cohérent.' },
  audit: { image: '/vignobles-var.jpg', label: 'Point sur le bien', note: 'Identifier les points utiles avant de décider.', focus: 'Repérer les points de vigilance avant de vous engager.' },
}
function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) { return <Link href={href} className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-7 py-4 text-sm font-bold text-white shadow-[0_14px_30px_rgba(0,180,236,0.24)] transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_18px_40px_rgba(0,180,236,0.32)]">{children}</Link> }
function OutlinePhone({ children }: { children: React.ReactNode }) { return <a href={'tel:' + PHONE_RAW} className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand px-7 py-4 text-sm font-bold text-brand transition-all hover:-translate-y-0.5 hover:bg-brand hover:text-white">{children}</a> }

export default function EditorialPage({ namespace, simulatorHref }: { namespace: EditorialNamespace; simulatorHref: string }) {
  const t = useTranslations(namespace)
  const tCommon = useTranslations('common')
  const phoneDisplay = tCommon('phoneDisplay')
  const visual = visualByNamespace[namespace]
  const copy = (key: string) => alignTerritory(t(key))
  const steps = ([1, 2, 3, 4] as const).map((n) => ({ n, title: copy('step' + n + 'Title'), desc: copy('step' + n + 'Desc') }))
  const stats = ([1, 2, 3] as const).map((n) => ({ value: copy('stat' + n + 'Value'), label: copy('stat' + n + 'Label') }))
  const faqs = ([1, 2, 3, 4] as const).map((n) => ({ q: copy('q' + n + 'q'), a: copy('q' + n + 'a') }))
  return (
    <>
      <section className="relative overflow-hidden bg-[#f4f7f8] px-6 pb-16 pt-28 lg:pb-24 lg:pt-36">
        <div className="absolute right-0 top-0 h-[34rem] w-[34rem] translate-x-1/3 rounded-full bg-brand-light/70 blur-3xl" /><div className="absolute bottom-0 left-0 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-white blur-3xl" />
        <motion.div variants={stagger} initial="initial" animate="animate" className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div><motion.div variants={fadeInUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm"><Sparkles size={15} className="text-brand" /> {copy('heroEyebrow')}</motion.div><motion.h1 variants={fadeInUp} className="max-w-3xl text-4xl font-bold leading-[1.04] tracking-[-0.05em] text-foreground md:text-6xl lg:text-7xl">{copy('heroTitleLine1')} <span className="text-brand">{copy('heroTitleAccent')}</span></motion.h1><motion.p variants={fadeInUp} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{copy('heroSubtitle')}</motion.p><motion.div variants={fadeInUp} className="mt-9 flex flex-col gap-4 sm:flex-row"><PrimaryLink href={simulatorHref}>{copy('heroCtaSimulator')} <ArrowRight size={18} /></PrimaryLink><OutlinePhone><Phone size={16} /> {copy('heroCtaPhone')}</OutlinePhone></motion.div><motion.div variants={staggerFast} className="mt-8 flex flex-wrap gap-2">{[visual.focus, 'Provence Verte & Verdon', 'Réponse personnalisée'].map((item) => <motion.span key={item} variants={fadeInUp} className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm"><CheckCircle2 size={14} className="text-brand" /> {item}</motion.span>)}</motion.div></div>
          <motion.div variants={scaleIn} className="relative mx-auto flex min-h-[32rem] w-full max-w-[34rem] items-end justify-center lg:ml-auto"><div className="absolute inset-x-8 bottom-0 h-40 rounded-full bg-brand/20 blur-3xl" /><div className="absolute bottom-0 h-[82%] w-[82%] rounded-t-full bg-gradient-to-br from-brand-light via-white to-[#eaeef1]" /><Image src="/alexandre-lopez-no-background.png" alt="Alexandre Lopez, conseiller immobilier iad France en Provence Verte et Verdon" width={760} height={920} priority className="relative z-10 h-auto max-h-[35rem] w-auto object-contain drop-shadow-2xl" /><div className="absolute bottom-6 left-0 z-20 rounded-2xl bg-white/90 px-5 py-4 shadow-xl backdrop-blur"><p className="text-sm font-bold text-foreground">Alexandre Lopez</p><p className="text-xs text-muted">Conseiller immobilier iad France</p></div></motion.div>
        </motion.div>
      </section>

      <section className="relative min-h-[32rem] overflow-hidden px-6 py-24 text-white md:min-h-[40rem] md:py-32">
        <Image src={visual.image} alt={visual.label} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101828]/82 via-[#101828]/42 to-transparent" />
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="relative mx-auto flex min-h-[24rem] max-w-7xl items-end md:min-h-[28rem]">
          <div className="max-w-3xl"><motion.p variants={fadeInUp} className="mb-4 inline-flex rounded-full bg-white/12 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-brand-light backdrop-blur">{visual.label}</motion.p><motion.h2 variants={fadeInUp} className="text-4xl font-bold leading-tight tracking-[-0.045em] md:text-6xl">{visual.note}</motion.h2><motion.p variants={fadeInUp} className="mt-6 max-w-2xl text-lg leading-relaxed text-white/82">En immobilier, la bonne décision vient rarement d’un seul chiffre. Elle vient d’une lecture précise du bien, de son contexte, de son marché local et de votre objectif réel.</motion.p></div>
        </motion.div>
      </section>

      <section className="bg-[#f4f7f8] px-6 py-20"><motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-7xl"><motion.div variants={fadeInUp} className="mb-12 text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">{copy('processEyebrow')}</p><h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">{copy('processTitle')}</h2></motion.div><motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">{steps.map((step) => <motion.div key={step.n} variants={scaleIn} className="group rounded-2xl bg-white p-7 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl"><span className="mb-7 inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white shadow-sm">{step.n}</span><h3 className="mb-3 text-xl font-bold leading-tight tracking-[-0.025em] text-foreground">{step.title}</h3><p className="text-sm leading-relaxed text-muted">{step.desc}</p></motion.div>)}</motion.div></motion.div></section>
      <section className="bg-white px-6 py-20"><motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.9fr]"><div><motion.p variants={fadeInUp} className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">{copy('expertiseEyebrow')}</motion.p><motion.h2 variants={fadeInUp} className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">{copy('expertiseTitle')}</motion.h2><motion.p variants={fadeInUp} className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">{copy('expertisePara1')}</motion.p><motion.p variants={fadeInUp} className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{copy('expertisePara2')}</motion.p></div><motion.div variants={staggerFast} className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-1">{stats.map((stat) => <motion.div key={stat.label} variants={scaleIn} className="rounded-2xl bg-[#f4f7f8] p-7 shadow-sm"><p className="text-4xl font-bold tracking-[-0.04em] text-brand">{stat.value}</p><p className="mt-2 text-sm font-semibold text-muted">{stat.label}</p></motion.div>)}</motion.div></motion.div></section>
      <section className="bg-[#f4f7f8] px-6 py-20"><motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-3xl"><motion.div variants={fadeInUp} className="mb-12 text-center"><p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-brand">{copy('faqEyebrow')}</p><h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-foreground md:text-5xl">{copy('faqTitle')}</h2></motion.div><motion.div variants={staggerFast} className="space-y-4">{faqs.map((item) => <motion.div key={item.q} variants={fadeInUp} className="rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"><h3 className="mb-3 flex items-start gap-3 text-lg font-bold tracking-[-0.02em] text-foreground"><CheckCircle2 size={18} className="mt-1 shrink-0 text-brand" /> {item.q}</h3><p className="pl-8 text-sm leading-relaxed text-muted">{item.a}</p></motion.div>)}</motion.div></motion.div></section>
      <section className="bg-gradient-to-br from-brand to-brand-hover px-6 py-20"><motion.div variants={scaleIn} initial="initial" whileInView="animate" viewport={vpOnce} className="mx-auto max-w-4xl text-center"><p className="mb-3 inline-flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.22em] text-white/80"><MapPin size={14} /> {copy('ctaEyebrow')}</p><h2 className="text-3xl font-bold leading-tight tracking-[-0.04em] text-white md:text-5xl">{copy('ctaTitle')}</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/90">{copy('ctaDescription')}</p><div className="mt-8"><Link href={simulatorHref} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-bold text-brand transition-colors hover:bg-[#f4f7f8]">{copy('ctaSimulator')} <ArrowRight size={16} /></Link></div></motion.div></section>
    </>
  )
}
