'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const PHONE_RAW = '+33613180168'

export type EditorialNamespace = 'vendre' | 'acheter' | 'audit'

export default function EditorialPage({ namespace, simulatorHref }: { namespace: EditorialNamespace; simulatorHref: string }) {
  const t = useTranslations(namespace)
  const tCommon = useTranslations('common')
  const tHeader = useTranslations('header')
  const phoneDisplay = tCommon('phoneDisplay')

  const steps = ([1, 2, 3, 4] as const).map(function (n) {
    return { n, title: t('step' + n + 'Title'), desc: t('step' + n + 'Desc') }
  })
  const stats = ([1, 2, 3] as const).map(function (n) {
    return { value: t('stat' + n + 'Value'), label: t('stat' + n + 'Label') }
  })
  const faqs = ([1, 2, 3, 4] as const).map(function (n) {
    return { q: t('q' + n + 'q'), a: t('q' + n + 'a') }
  })

  return (
    <>
      {/* Hero */}
      <section className="bg-white pt-12 pb-20 lg:pt-16 lg:pb-24">
        <motion.div variants={stagger} initial="initial" animate="animate"
          className="max-w-[75rem] mx-auto px-6 text-center">
          <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-5">
            {t('heroEyebrow')}
          </motion.p>
          <motion.h1 variants={fadeInUp}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
            {t('heroTitleLine1')}<br />
            <span className="italic text-brand">{t('heroTitleAccent')}</span>
          </motion.h1>
          <motion.p variants={fadeInUp}
            className="text-muted leading-relaxed text-lg max-w-2xl mx-auto mb-10">
            {t('heroSubtitle')}
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" variant="primary">
              <Link href={simulatorHref}>
                {t('heroCtaSimulator')}
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={'tel:' + PHONE_RAW} aria-label={tHeader('callAria', { phone: phoneDisplay })}>
                <Phone size={16} />
                {t('heroCtaPhone')}
              </a>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Process */}
      <section className="bg-surface py-20 px-6">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
          className="max-w-[75rem] mx-auto">
          <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-3 text-center">
            {t('processEyebrow')}
          </motion.p>
          <motion.h2 variants={fadeInUp}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] text-center mb-14">
            {t('processTitle')}
          </motion.h2>
          <motion.div variants={staggerFast} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(function (step) {
              return (
                <motion.div key={step.n} variants={scaleIn}
                  className="bg-white rounded-2xl border border-border p-7">
                  <span className="inline-flex w-9 h-9 items-center justify-center rounded-full bg-brand-light text-brand text-sm font-bold mb-5">
                    {step.n}
                  </span>
                  <h3 className="font-serif text-xl font-medium text-foreground tracking-[-0.01em] mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* Expertise */}
      <section className="bg-white py-20 px-6">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
          className="max-w-[75rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-3">
              {t('expertiseEyebrow')}
            </motion.p>
            <motion.h2 variants={fadeInUp}
              className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] mb-6">
              {t('expertiseTitle')}
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted leading-relaxed text-base mb-4">
              {t('expertisePara1')}
            </motion.p>
            <motion.p variants={fadeInUp} className="text-muted leading-relaxed text-base">
              {t('expertisePara2')}
            </motion.p>
          </div>
          <motion.div variants={staggerFast} className="grid grid-cols-3 gap-4">
            {stats.map(function (stat, i) {
              return (
                <motion.div key={i} variants={scaleIn}
                  className="bg-surface rounded-2xl border border-border p-6 text-center">
                  <p className="font-serif text-3xl font-medium text-brand mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs font-medium text-muted leading-tight">
                    {stat.label}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-20 px-6">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={vpOnce}
          className="max-w-3xl mx-auto">
          <motion.p variants={fadeInUp} className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-3 text-center">
            {t('faqEyebrow')}
          </motion.p>
          <motion.h2 variants={fadeInUp}
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-foreground leading-[1.05] tracking-[-0.02em] text-center mb-12">
            {t('faqTitle')}
          </motion.h2>
          <motion.div variants={staggerFast} className="space-y-5">
            {faqs.map(function (item, i) {
              return (
                <motion.div key={i} variants={fadeInUp}
                  className="bg-white rounded-2xl border border-border p-6">
                  <h3 className="font-medium text-foreground text-lg mb-3 tracking-[-0.01em]">
                    {item.q}
                  </h3>
                  <p className="text-muted leading-relaxed text-sm">
                    {item.a}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA finale */}
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
              <Link href={simulatorHref}>
                {t('ctaSimulator')}
                <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}
