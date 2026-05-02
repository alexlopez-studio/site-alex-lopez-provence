'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Home, Search, ClipboardCheck, ArrowRight, Phone,
  Gift, ShieldCheck, Lock, MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const PHONE_RAW = '+33613180168'
const hoverCard = { y: -6 }
const springFast = { type: 'spring' as const, stiffness: 400, damping: 25 }

export default function OutilsContent() {
  const t = useTranslations('outils')
  const tCommon = useTranslations('common')
  const tHeader = useTranslations('header')
  const phoneDisplay = tCommon('phoneDisplay')

  const chips = [
    { icon: Gift,        label: t('chipFree') },
    { icon: ShieldCheck, label: t('chipNoCommitment') },
    { icon: Lock,        label: t('chipNoAccount') },
    { icon: MapPin,      label: t('chipRegion') },
  ]

  const tools = [
    {
      href: '/outils/vendre',
      icon: Home,
      eyebrow: t('sellEyebrow'),
      title: t('sellTitle'),
      desc: t('sellDesc'),
      cta: t('sellCta'),
      badge: t('sellBadge'),
    },
    {
      href: '/outils/acheter',
      icon: Search,
      eyebrow: t('buyEyebrow'),
      title: t('buyTitle'),
      desc: t('buyDesc'),
      cta: t('buyCta'),
      badge: t('buyBadge'),
    },
    {
      href: '/outils/audit',
      icon: ClipboardCheck,
      eyebrow: t('auditEyebrow'),
      title: t('auditTitle'),
      desc: t('auditDesc'),
      cta: t('auditCta'),
      badge: t('auditBadge'),
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-12 pb-20 lg:pt-16 lg:pb-24">
        <motion.div variants={stagger} initial="initial" animate="animate"
          className="max-w-[75rem] mx-auto px-6 text-center">
          <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-5">
            {t('eyebrow')}
          </motion.p>
          <motion.h1 variants={fadeInUp}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
            {t('titleLine1')}<br />
            <span className="italic text-brand">{t('titleAccent')}</span>
          </motion.h1>
          <motion.p variants={fadeInUp}
            className="text-muted leading-relaxed text-lg max-w-2xl mx-auto mb-10">
            {t('subtitle')}
          </motion.p>
          <motion.div variants={staggerFast} className="flex flex-wrap justify-center gap-2.5">
            {chips.map(function (chip) {
              const Icon = chip.icon
              return (
                <motion.span key={chip.label} variants={fadeInUp}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border text-sm font-medium text-foreground">
                  <Icon size={14} className="text-brand" />
                  {chip.label}
                </motion.span>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Cards */}
      <section className="bg-surface py-20 px-6">
        <motion.div variants={staggerFast} initial="initial" whileInView="animate" viewport={vpOnce}
          className="max-w-[75rem] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map(function (tool) {
            const Icon = tool.icon
            return (
              <motion.div key={tool.href} variants={scaleIn} whileHover={hoverCard} transition={springFast}>
                <Link href={tool.href}
                  className="group flex flex-col h-full bg-white rounded-2xl border border-border p-8 transition-all duration-200 hover:shadow-md hover:border-brand/40">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted mb-5">
                    {tool.eyebrow}
                  </p>
                  <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center mb-5">
                    <Icon size={22} className="text-brand" />
                  </div>
                  <h2 className="font-serif text-2xl font-medium text-foreground tracking-[-0.01em] mb-3 leading-tight">
                    {tool.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed mb-5 flex-1">
                    {tool.desc}
                  </p>
                  <p className="text-xs font-semibold text-success inline-flex items-center gap-1.5 mb-6">
                    <ShieldCheck size={13} />
                    {tool.badge}
                  </p>
                  <div className="flex items-center justify-between pt-5 border-t border-border">
                    <span className="text-sm font-semibold text-brand">
                      {tool.cta}
                    </span>
                    <span className="w-9 h-9 rounded-full bg-brand-light text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                      <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="bg-brand-light py-20 px-6">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
          className="max-w-3xl mx-auto text-center">
          <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-3">
            {t('ctaEyebrow')}
          </motion.p>
          <motion.h2 variants={fadeInUp}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-4">
            {t('ctaTitle')}
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-muted leading-relaxed text-lg mb-8">
            {t('ctaDescription')}
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button asChild size="lg" variant="primary">
              <a href={'tel:' + PHONE_RAW} aria-label={tHeader('callAria', { phone: phoneDisplay })}>
                <Phone size={16} />
                {phoneDisplay}
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
