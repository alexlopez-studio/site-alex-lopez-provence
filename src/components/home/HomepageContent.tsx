'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
  ArrowRight, Home, Search, ClipboardCheck, MapPin, Star,
  ShieldCheck, Clock, Lock, Users, ChevronDown,
  Send, Phone, TrendingUp, Gift, BarChart2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl, biensUrl, env } from '@/lib/env'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

// ─── Animations ───────────────────────────────────────────────
const springFast = { type: 'spring' as const, stiffness: 400, damping: 25 }
const hoverCard = { y: -6 }
const hoverChip = { scale: 1.04 as number }
const tapCard = { scale: 0.97 as number }
const hoverComm = { scale: 1.04 as number, y: -2 as number }
const heroRightInitial = { opacity: 0, scale: 0.96 as number }
const heroRightAnimate = { opacity: 1, scale: 1 as number }
const heroRightTransition = { delay: 0.3, duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }
const floatingCardInitial = { opacity: 0, x: -20, y: 20 }
const floatingCardAnimate = { opacity: 1, x: 0, y: 0 }
const floatingCardTransition = { delay: 0.65, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }
const badgeInitial = { opacity: 0, scale: 0.8 as number }
const badgeAnimate = { opacity: 1, scale: 1 as number }
const badgeTransition = { delay: 0.85, duration: 0.4 }
const progressBarInitial = { width: 0 }
const progressBarAnimate = { width: '75%' }
const progressBarTransition = { delay: 1.1, duration: 0.9, ease: 'easeOut' as const }

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    let frame = 0
    const total = 60
    const timer = setInterval(() => {
      frame++
      if (frame >= total) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.round((frame / total) * target))
      }
    }, 20)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

function HeartDivider({ className = '' }: { className?: string }) {
  return (
    <div className={'flex items-center gap-3 text-brand ' + className} aria-hidden="true">
      <span className="h-px w-10 bg-brand/40" />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span className="h-px w-10 bg-brand/40" />
    </div>
  )
}

// ─── Data non-traduisibles (toponymes, prix, URLs images) ───────────────────────
const PHONE_RAW = '+33613180168'
const COMMUNES_TEASER = ['Barjols', 'Montmeyan', 'Quinson', 'Fox-Amphoux', 'Tavernes', 'Rians', 'Aups', 'Salernes', 'Ginasservis', 'Varages', 'Esparron-de-Verdon', 'Artignosc-sur-Verdon']
const ZONE_BACKDROP = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=2000&q=80&auto=format&fit=crop'

const PAYSAGE_SRC = {
  valensole: 'https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=1600&q=80&auto=format&fit=crop',
  villages:  'https://images.unsplash.com/photo-1533757704860-4e25feb0cf52?w=1200&q=80&auto=format&fit=crop',
  olives:    'https://images.unsplash.com/photo-1568214379698-8aeb8c6c6ac8?w=1200&q=80&auto=format&fit=crop',
  verdon:    'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=1600&q=80&auto=format&fit=crop',
}

const BIENS_VENTE_DATA = [
  { key: 'a', image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&auto=format&fit=crop', tag: 'new',       typeKey: 'typeVillageHouse', commune: 'Barjols (83670)',    prix: '245 000 €', surface: '110 m²', rooms: 4 },
  { key: 'b', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&auto=format&fit=crop', tag: 'new',       typeKey: 'typeBastide',      commune: 'Rians (83560)',      prix: '385 000 €', surface: '180 m²', rooms: 6 },
  { key: 'c', image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80&auto=format&fit=crop', tag: 'priceDown', typeKey: 'typeHouseWithLand', commune: 'Montmeyan (83670)', prix: '198 000 €', surface: '95 m²',  rooms: 3 },
]

const BIENS_VENDUS_DATA = [
  { key: 'a', image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80&auto=format&fit=crop', typeKey: 'typeCharacterHouse', commune: 'Barjols',  prix: '265 000 €' },
  { key: 'b', image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80&auto=format&fit=crop', typeKey: 'typeProvencalMas',  commune: 'Aups',     prix: '420 000 €' },
  { key: 'c', image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80&auto=format&fit=crop', typeKey: 'typeVillaWithPool', commune: 'Rians',    prix: '345 000 €' },
  { key: 'd', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80&auto=format&fit=crop', typeKey: 'typeVillageHouse',  commune: 'Salernes', prix: '185 000 €' },
]

export default function HomepageContent() {
  const tHero = useTranslations('homepage.hero')
  const tUsp = useTranslations('homepage.usp')
  const tLand = useTranslations('homepage.landscape')
  const tStory = useTranslations('homepage.story')
  const tServ = useTranslations('homepage.services')
  const tZone = useTranslations('homepage.zone')
  const tForSale = useTranslations('homepage.forSale')
  const tSold = useTranslations('homepage.sold')
  const tTest = useTranslations('homepage.testimonials')
  const tFaq = useTranslations('homepage.faq')
  const tContact = useTranslations('homepage.contactInline')
  const tCta = useTranslations('homepage.cta')
  const tCommon = useTranslations('common')

  const phoneDisplay = tCommon('phoneDisplay')
  const assistantUrl = appUrl('') || '/assistant'
  const biens = biensUrl()

  const PAYSAGES = [
    { src: PAYSAGE_SRC.valensole, alt: tLand('valensoleAlt'), caption: tLand('valensoleCaption'), className: 'md:col-span-2 md:row-span-2 aspect-[4/3] md:aspect-auto' },
    { src: PAYSAGE_SRC.villages,  alt: tLand('villagesAlt'),  caption: tLand('villagesCaption'),  className: 'aspect-[4/3]' },
    { src: PAYSAGE_SRC.olives,    alt: tLand('olivesAlt'),    caption: tLand('olivesCaption'),    className: 'aspect-[4/3]' },
    { src: PAYSAGE_SRC.verdon,    alt: tLand('verdonAlt'),    caption: tLand('verdonCaption'),    className: 'md:col-span-2 aspect-[16/9]' },
  ]

  const USP_CHIPS = [
    { icon: Gift, label: tUsp('freeEstimation') },
    { icon: BarChart2, label: tUsp('localPrices') },
    { icon: ShieldCheck, label: tUsp('fullAudit') },
    { icon: Clock, label: tUsp('reply24h') },
    { icon: Lock, label: tUsp('noCommitment') },
  ]

  const SERVICES = [
    { icon: Home, title: tServ('sellTitle'),  description: tServ('sellDesc'),  cta: tServ('sellCta'),  href: '/vendre',  external: false },
    { icon: Search, title: tServ('buyTitle'),  description: tServ('buyDesc'),  cta: tServ('buyCta'),  href: '/acheter', external: false },
    { icon: ClipboardCheck, title: tServ('auditTitle'), description: tServ('auditDesc'), cta: tServ('auditCta'), href: '/audit',   external: false },
    { icon: Users, title: tServ('joinTitle'),  description: tServ('joinDesc'), cta: tServ('joinCta'), href: 'https://www.iadfrance.fr/rejoindre-iad', external: true },
  ]

  const FAQ_ITEMS = [
    { q: tFaq('q1q'), a: tFaq('q1a') },
    { q: tFaq('q2q'), a: tFaq('q2a') },
    { q: tFaq('q3q'), a: tFaq('q3a') },
    { q: tFaq('q4q'), a: tFaq('q4a') },
    { q: tFaq('q5q'), a: tFaq('q5a') },
  ]

  const AVIS = [
    { name: tTest('avis1Name'), text: tTest('avis1Text'), transaction: tTest('txnSale') },
    { name: tTest('avis2Name'), text: tTest('avis2Text'), transaction: tTest('txnPurchase') },
    { name: tTest('avis3Name'), text: tTest('avis3Text'), transaction: tTest('txnSale') },
  ]

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="min-h-[92vh] relative overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 hidden lg:grid lg:grid-cols-[55%_45%] pointer-events-none" aria-hidden="true">
          <div className="bg-white" />
          <div className="bg-surface" />
        </div>
        <div className="absolute inset-0 bg-white lg:hidden" aria-hidden="true" />

        <div className="relative max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-[55%_45%] min-h-[92vh]">
          <motion.div variants={stagger} initial="initial" animate="animate"
            className="flex flex-col justify-center px-6 py-20 lg:py-0 order-2 lg:order-1">
            <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-5">
              {tHero('tagline')}
            </motion.p>
            <motion.p variants={fadeInUp} className="font-script text-5xl sm:text-6xl xl:text-7xl text-brand leading-[0.95] mb-4">
              {tHero('signature')}
            </motion.p>
            <motion.h1 variants={stagger} className="font-serif text-2xl sm:text-3xl xl:text-4xl font-medium text-foreground leading-[1.2] mb-6 max-w-md">
              <motion.span variants={fadeInUp} className="block">{tHero('titleLine1')}</motion.span>
              <motion.span variants={fadeInUp} className="block italic text-muted">{tHero('titleLine2')}</motion.span>
            </motion.h1>
            <motion.div variants={fadeInUp} className="mb-5"><HeartDivider /></motion.div>
            <motion.div variants={fadeInUp} className="inline-flex self-start items-center gap-3 px-5 py-2.5 rounded-full bg-brand text-white text-[10px] font-semibold uppercase tracking-[0.22em] mb-8 shadow-sm">
              <span>{tHero('valueListening')}</span>
              <span className="text-white/50">•</span>
              <span>{tHero('valueClarity')}</span>
              <span className="text-white/50">•</span>
              <span>{tHero('valueTransparency')}</span>
            </motion.div>
            <motion.p variants={fadeInUp} className="text-base text-muted leading-relaxed mb-8 max-w-md">
              {tHero('description')}
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button asChild size="lg" variant="primary">
                <Link href={assistantUrl} target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                  rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
                  {tCommon('estimateMyProperty')} <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href={env.app.calcomUrl} target="_blank" rel="noopener noreferrer">{tCommon('bookAppointment')}</Link>
              </Button>
            </motion.div>
            <motion.a variants={fadeInUp} href={'tel:' + PHONE_RAW}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand transition-colors w-fit">
              <Phone size={14} className="text-brand" />{phoneDisplay}
            </motion.a>
          </motion.div>

          <motion.div initial={heroRightInitial} animate={heroRightAnimate} transition={heroRightTransition}
            className="relative flex items-center justify-center overflow-hidden min-h-[50vh] lg:min-h-full order-1 lg:order-2">
            <div className="w-full h-full flex items-end justify-center px-8 pt-12 pb-0">
              <div className="relative w-full max-w-sm aspect-[3/4] rounded-t-[3rem] overflow-hidden shadow-[0_20px_60px_rgba(31,91,107,0.18)]">
                <Image src="/alex-lopez.png" alt={tHero('photoAlt')} fill priority
                  sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-top" />
              </div>
            </div>
            <motion.div initial={floatingCardInitial} animate={floatingCardAnimate} transition={floatingCardTransition}
              className="absolute bottom-8 left-4 bg-white rounded-2xl shadow-xl p-5 w-60 border border-border">
              <p className="text-[10px] font-semibold text-muted uppercase tracking-[0.18em] mb-1">{tHero('estimationCardEyebrow')}</p>
              <p className="font-serif text-2xl font-semibold text-foreground mb-0.5">245 000 €</p>
              <p className="text-xs text-muted mb-3">{tHero('estimationCardHint')}</p>
              <div className="w-full bg-surface rounded-full h-1.5 mb-3">
                <motion.div className="bg-brand h-1.5 rounded-full"
                  initial={progressBarInitial} animate={progressBarAnimate} transition={progressBarTransition} />
              </div>
              <p className="text-xs text-brand font-semibold flex items-center gap-1">
                <TrendingUp size={11} /> {tHero('estimationCardTrend')}
              </p>
            </motion.div>
            <motion.div initial={badgeInitial} animate={badgeAnimate} transition={badgeTransition}
              className="absolute top-6 right-4 bg-white rounded-xl shadow-md px-3 py-2 flex items-center gap-2 border border-border">
              <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={11} className="text-accent fill-accent" />)}</div>
              <span className="text-xs font-semibold text-foreground">5/5</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== USP CHIPS ===== */}
      <motion.section variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
        className="bg-white border-y border-border py-6 px-6">
        <div className="max-w-[75rem] mx-auto flex flex-wrap justify-center gap-3">
          {USP_CHIPS.map(chip => {
            const Icon = chip.icon
            return (
              <motion.div key={chip.label} variants={fadeInUp} whileHover={hoverChip}
                className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border text-sm font-medium text-foreground cursor-default">
                <Icon size={15} className="text-brand" />{chip.label}
              </motion.div>
            )
          })}
        </div>
      </motion.section>

      {/* ===== GALERIE PAYSAGES ===== */}
      <section className="py-24 px-6 bg-white relative overflow-hidden">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-4">{tLand('eyebrow')}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground leading-[1.1] mb-5">
              {tLand('title1')} <span className="italic text-brand">{tLand('title2')}</span>
            </h2>
            <p className="text-muted leading-relaxed">{tLand('description')}</p>
          </motion.div>
          <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-[20rem_20rem] gap-4">
            {PAYSAGES.map((p, i) => (
              <motion.div key={p.src} variants={scaleIn}
                className={'group relative overflow-hidden rounded-2xl bg-surface border border-border ' + p.className}>
                <Image src={p.src} alt={p.alt} fill
                  sizes={i === 0 ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 100vw'}
                  className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
                <p className="absolute bottom-4 left-5 text-white font-serif text-lg italic drop-shadow-md">{p.caption}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== MON HISTOIRE ===== */}
      <section className="py-24 px-6 bg-surface">
        <div className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div variants={scaleIn} initial="initial" whileInView="animate" viewport={vpOnce}
            className="relative rounded-2xl overflow-hidden bg-white border border-border aspect-[4/5] order-2 lg:order-1 shadow-sm">
            <Image src="/alex-lopez.png" alt={tHero('photoAlt')} fill
              sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover object-center" />
          </motion.div>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="order-1 lg:order-2">
            <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-4">{tStory('eyebrow')}</motion.p>
            <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-6 leading-[1.1]">
              {tStory('titlePart1')} <span className="italic text-brand">{tStory('titleAccent')}</span> {tStory('titlePart2')}
            </motion.h2>
            <motion.div variants={stagger} className="space-y-4 text-muted leading-relaxed mb-8">
              <motion.p variants={fadeInUp}>{tStory('para1')}</motion.p>
              <motion.p variants={fadeInUp}>{tStory('para2')}</motion.p>
            </motion.div>
            <motion.div variants={stagger} className="grid grid-cols-3 gap-6 mb-8 text-center">
              <motion.div variants={scaleIn}>
                <p className="font-serif text-3xl font-semibold text-brand"><Counter target={100} suffix="%" /></p>
                <p className="text-xs text-muted mt-1">{tStory('statAccompaniment')}</p>
              </motion.div>
              <motion.div variants={scaleIn}>
                <p className="font-serif text-3xl font-semibold text-brand">0 €</p>
                <p className="text-xs text-muted mt-1">{tStory('statHiddenFees')}</p>
              </motion.div>
              <motion.div variants={scaleIn}>
                <p className="font-serif text-3xl font-semibold text-brand"><Counter target={7} suffix="j/7" /></p>
                <p className="text-xs text-muted mt-1">{tStory('statAvailable')}</p>
              </motion.div>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button asChild variant="secondary" size="lg">
                <Link href="/a-propos">{tStory('cta')} <ArrowRight size={16} /></Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-3">{tServ('eyebrow')}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground leading-[1.1]">
              {tServ('titlePart1')} <span className="italic text-brand">{tServ('titlePart2')}</span>
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map(service => {
              const Icon = service.icon
              const href = service.external ? service.href : appUrl(service.href) || service.href
              return (
                <motion.div key={service.title} variants={fadeInUp} whileHover={hoverCard} whileTap={tapCard} transition={springFast}>
                  <Link href={href} target={service.external ? '_blank' : undefined} rel={service.external ? 'noopener noreferrer' : undefined}
                    className="group flex flex-col bg-surface rounded-2xl border border-border p-8 h-full hover:shadow-md hover:border-brand/40 transition-all duration-200">
                    <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center mb-5">
                      <Icon size={22} className="text-brand" />
                    </div>
                    <h3 className="font-serif text-2xl font-medium text-foreground mb-3 leading-tight">{service.title}</h3>
                    <p className="text-sm text-muted leading-relaxed mb-5 flex-1">{service.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-2.5 transition-all">
                      {service.cta} <ArrowRight size={15} />
                    </span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ===== ZONE ===== */}
      <section className="relative overflow-hidden">
        <div className="relative h-[28rem] md:h-[32rem]">
          <Image src={ZONE_BACKDROP} alt={tZone('backdropAlt')} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/20 to-surface" />
          <div className="absolute inset-0 flex items-center justify-center px-6">
            <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center max-w-3xl">
              <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 mb-4">
                <MapPin size={18} className="text-white" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/90">{tZone('eyebrow')}</p>
              </motion.div>
              <motion.h2 variants={fadeInUp} className="font-serif text-4xl md:text-6xl font-medium text-white mb-4 leading-[1.05] drop-shadow-md">
                {tZone('titlePart1')} <span className="italic">{tZone('titleAccent')}</span>
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
                {tZone('description')}
              </motion.p>
            </motion.div>
          </div>
        </div>
        <div className="bg-surface py-16 px-6">
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
            className="max-w-4xl mx-auto text-center">
            <motion.div variants={staggerFast} className="flex flex-wrap justify-center gap-2 mb-8">
              {COMMUNES_TEASER.map(c => {
                const slug = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
                return (
                  <motion.div key={c} variants={fadeInUp} whileHover={hoverComm}>
                    <Link href={'/marche/' + slug}
                      className="px-4 py-2 bg-white rounded-full border border-border text-sm text-foreground hover:border-brand hover:text-brand transition-colors block">
                      {c}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/marche" className="inline-flex items-center gap-2 text-brand font-semibold hover:underline">
                {tZone('viewAllCommunes')} <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== BIENS EN VENTE ===== */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-[75rem] mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={vpOnce} className="text-center mb-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-3">{tForSale('eyebrow')}</p>
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-foreground leading-[1.1]">
              {tForSale('titlePart1')} <span className="italic text-brand">{tForSale('titleAccent')}</span>
            </h2>
          </motion.div>
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {BIENS_VENTE_DATA.map(bien => {
              const tag = bien.tag === 'new' ? tForSale