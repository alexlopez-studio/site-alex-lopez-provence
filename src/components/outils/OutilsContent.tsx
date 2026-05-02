'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  ArrowRight, Home, Search, ClipboardCheck, Phone,
  Gift, Lock, MapPin, ShieldCheck,
} from 'lucide-react'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const PHONE_RAW = '+33613180168'
const springFast = { type: 'spring' as const, stiffness: 400, damping: 25 }
const hoverCard = { y: -6 }
const tapCard = { scale: 0.97 as number }

export function OutilsContent() {
  const t = useTranslations('outils')
  const tCommon = useTranslations('common')
  const phoneDisplay = tCommon('phoneDisplay')

  const tools = [
    {
      href: '/vendre',
      icon: Home,
      eyebrow: t('sellEyebrow'),
      title: t('sellTitle'),
      description: t('sellDesc'),
      cta: t('sellCta'),
      badge: t('sellBadge'),
    },
    {
      href: '/acheter',
      icon: Search,
      eyebrow: t('buyEyebrow'),
      title: t('buyTitle'),
      description: t('buyDesc'),
      cta: t('buyCta'),
      badge: t('buyBadge'),
    },
    {
      href: '/audit',
      icon: ClipboardCheck,
      eyebrow: t('auditEyebrow'),
      title: t('auditTitle'),
      description: t('auditDesc'),
      cta: t('auditCta'),
      badge: t('auditBadge'),
    },
  ]

  const chips = [
    { icon: Gift, label: t('chipFree') },
    { icon: ShieldCheck, label: t('chipNoCommitment') },
    { icon: Lock, label: t('chipNoAccount') },
    { icon: MapPin, label: t('chipRegion') },
  ]

  return (
    <>
      {/* HERO */}
      <section className="bg-surface px-6 pt-16 pb-10 md:pt-20 md:pb-12">
        <motion.div variants={stagger} initial="initial" animate="animate"
          className="max-w-4xl mx-auto text-center">
          <motion.p variants={fadeInUp}
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-5">
            {t('eyebrow')}
          </motion.p>
          <motion.h1 variants={fadeInUp}
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-5">
            {t('titlePart1')} <span className="italic text-brand">{t('titleAccent')}</span>
          </motion.h1>
          <motion.p variants={fadeInUp}
            className="text-muted text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            {t('description')}
          </motion.p>
          <motion.div variants={staggerFast} initial="initial" animate="animate"
            className="flex flex-wrap justify-center gap-3">
            {chips.map(chip => {
              const Icon = chip.icon
              return (
                <motion.div key={chip.label} variants={fadeInUp}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-border text-sm font-medium text-foreground">
                  <Icon size={15} className="text-brand" />
                  {chip.label}
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* 3 CARDS */}
      <section className="px-6 py-16 md:py-20 bg-white">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
          className="max-w-[75rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map(tool => {
            const Icon = tool.icon
            return (
              <motion.div key={tool.href} variants={fadeInUp} whileHover={hoverCard} whileTap={tapCard}
                transition={springFast}>
                <Link href={tool.href}
                  className="group flex flex-col h-full bg-surface rounded-2xl border border-border p-8 hover:shadow-md hover:border-brand/40 transition-all duration-200">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-border flex items-center justify-center mb-6">
                    <Icon size={26} className="text-brand" />
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand mb-2">
                    {tool.eyebrow}
                  </p>
                  <h2 className="font-serif text-2xl md:text-[1.75rem] font-medium text-foreground mb-3 leading-tight">
                    {tool.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-6 flex-1">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-2.5 transition-all mb-4">
                    {tool.cta} <ArrowRight size={15} />
                  </span>
                  <span className="inline-flex items-center text-[10px] font-semibold uppercase tracking-wide text-muted bg-white border border-border rounded-full px-3 py-1 self-start">
                    {tool.badge}
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section variants={scaleIn} initial="initial" whileInView="animate" viewport={vpOnce}
        className="px-6 py-20 bg-brand-light">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-4">
            {t('ctaEyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4 leading-[1.1] tracking-[-0.02em]">
            {t('ctaTitle')}
          </h2>
          <p className="text-muted leading-relaxed mb-8">
            {t('ctaDescription')}
          </p>
          <a href={'tel:' + PHONE_RAW}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-brand bg-white text-sm font-semibold text-brand hover:bg-brand hover:text-white transition-colors">
            <Phone size={15} /> {phoneDisplay}
          </a>
        </div>
      </motion.section>
    </>
  )
}
