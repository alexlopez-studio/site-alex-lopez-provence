'use client'

import { useId, useState } from 'react'
import type { ComponentType, KeyboardEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  ArrowRight, BookOpen, Calculator, Check, ClipboardCheck, Home, Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl, env, ESTIMATION_URL } from '@/lib/env'
import { fadeInUp, VP as vpOnce } from '@/lib/animations'

type TabKey = 'sell' | 'buy' | 'estimation' | 'blog'

type IconType = ComponentType<{ size?: number; className?: string }>

type CtaDef = { label: string; href: string; external: boolean }

type SimplePanelProps = {
  eyebrow: string
  title: string
  desc: string
  bullets: ReadonlyArray<string>
  primaryCta: CtaDef
  secondaryCta: CtaDef
}

type EstimationCard = {
  icon: IconType
  title: string
  desc: string
  cta: string
  href: string
  external: boolean
}

const panelInitial = { opacity: 0, y: 12 }
const panelAnimate = { opacity: 1, y: 0 }
const panelExit = { opacity: 0, y: -8 }
const panelTransition = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const }

function isExternalUrl(href: string) {
  return href.startsWith('http://') || href.startsWith('https://')
}

function resolveAppHref(path: string): { href: string; external: boolean } {
  const candidate = appUrl(path)
  if (candidate) return { href: candidate, external: isExternalUrl(candidate) }
  return { href: path, external: false }
}

function SimplePanel(props: SimplePanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-start">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-4">{props.eyebrow}</p>
        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-[1.1] mb-6 tracking-[-0.02em]">{props.title}</h3>
        <p className="text-muted leading-relaxed text-lg mb-8">{props.desc}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" variant="primary">
            <Link
              href={props.primaryCta.href}
              target={props.primaryCta.external ? '_blank' : undefined}
              rel={props.primaryCta.external ? 'noopener noreferrer' : undefined}
            >
              {props.primaryCta.label} <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link
              href={props.secondaryCta.href}
              target={props.secondaryCta.external ? '_blank' : undefined}
              rel={props.secondaryCta.external ? 'noopener noreferrer' : undefined}
            >
              {props.secondaryCta.label}
            </Link>
          </Button>
        </div>
      </div>
      <ul className="space-y-3">
        {props.bullets.map((bullet, i) => (
          <li
            key={i}
            className="flex items-start gap-3 bg-surface rounded-2xl border border-border px-5 py-4"
          >
            <span className="shrink-0 w-7 h-7 rounded-full bg-brand-light flex items-center justify-center mt-0.5">
              <Check size={14} className="text-brand" />
            </span>
            <span className="text-sm text-foreground leading-relaxed">{bullet}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EstimationPanel({
  eyebrow,
  title,
  desc,
  cards,
}: {
  eyebrow: string
  title: string
  desc: string
  cards: ReadonlyArray<EstimationCard>
}) {
  return (
    <div>
      <div className="max-w-2xl mb-12">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-4">{eyebrow}</p>
        <h3 className="font-serif text-3xl md:text-4xl lg:text-5xl font-medium text-foreground leading-[1.1] mb-6 tracking-[-0.02em]">{title}</h3>
        <p className="text-muted leading-relaxed text-lg">{desc}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              target={card.external ? '_blank' : undefined}
              rel={card.external ? 'noopener noreferrer' : undefined}
              className="group flex flex-col bg-surface rounded-2xl border border-border p-7 hover:shadow-md hover:border-brand/40 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-border flex items-center justify-center mb-5">
                <Icon size={22} className="text-brand" />
              </div>
              <h4 className="font-serif text-xl md:text-2xl font-medium text-foreground mb-3 leading-tight">{card.title}</h4>
              <p className="text-sm text-muted leading-relaxed mb-5 flex-1">{card.desc}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand group-hover:gap-2.5 transition-all">
                {card.cta} <ArrowRight size={15} />
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default function ServicesTabs() {
  const t = useTranslations('homepage.servicesTabs')
  const [active, setActive] = useState<TabKey>('sell')
  const baseId = useId()

  const vendre = { href: ESTIMATION_URL, external: true }
  const acheter = resolveAppHref('/acheter')
  const audit = resolveAppHref('/audit')
  const calcomUrl = env.app.calcomUrl
  const blogUrl = '/blog'

  const tabs: ReadonlyArray<{ key: TabKey; icon: IconType; label: string }> = [
    { key: 'sell', icon: Home, label: t('sellTab') },
    { key: 'buy', icon: Search, label: t('buyTab') },
    { key: 'estimation', icon: Calculator, label: t('estimationTab') },
    { key: 'blog', icon: BookOpen, label: t('blogTab') },
  ]

  function focusTab(key: TabKey) {
    if (typeof document === 'undefined') return
    const el = document.getElementById(baseId + '-tab-' + key)
    el?.focus()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = (idx + 1) % tabs.length
      setActive(tabs[next].key)
      focusTab(tabs[next].key)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = (idx - 1 + tabs.length) % tabs.length
      setActive(tabs[prev].key)
      focusTab(tabs[prev].key)
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(tabs[0].key)
      focusTab(tabs[0].key)
    } else if (e.key === 'End') {
      e.preventDefault()
      const last = tabs[tabs.length - 1].key
      setActive(last)
      focusTab(last)
    }
  }

  const sellPanel: SimplePanelProps = {
    eyebrow: t('sellEyebrow'),
    title: t('sellTitle'),
    desc: t('sellDesc'),
    bullets: [t('sellBullet1'), t('sellBullet2'), t('sellBullet3'), t('sellBullet4')],
    primaryCta: { label: t('sellCta1'), href: vendre.href, external: vendre.external },
    secondaryCta: { label: t('sellCta2'), href: calcomUrl, external: true },
  }

  const buyPanel: SimplePanelProps = {
    eyebrow: t('buyEyebrow'),
    title: t('buyTitle'),
    desc: t('buyDesc'),
    bullets: [t('buyBullet1'), t('buyBullet2'), t('buyBullet3'), t('buyBullet4')],
    primaryCta: { label: t('buyCta1'), href: acheter.href, external: acheter.external },
    secondaryCta: { label: t('buyCta2'), href: calcomUrl, external: true },
  }

  const blogPanel: SimplePanelProps = {
    eyebrow: t('blogEyebrow'),
    title: t('blogTitle'),
    desc: t('blogDesc'),
    bullets: [t('blogBullet1'), t('blogBullet2'), t('blogBullet3'), t('blogBullet4')],
    primaryCta: { label: t('blogCta1'), href: blogUrl, external: false },
    secondaryCta: { label: t('blogCta2'), href: blogUrl, external: false },
  }

  const estimationCards: ReadonlyArray<EstimationCard> = [
    {
      icon: Home,
      title: t('estimationCard1Title'),
      desc: t('estimationCard1Desc'),
      cta: t('estimationCard1Cta'),
      href: vendre.href,
      external: vendre.external,
    },
    {
      icon: Search,
      title: t('estimationCard2Title'),
      desc: t('estimationCard2Desc'),
      cta: t('estimationCard2Cta'),
      href: acheter.href,
      external: acheter.external,
    },
    {
      icon: ClipboardCheck,
      title: t('estimationCard3Title'),
      desc: t('estimationCard3Desc'),
      cta: t('estimationCard3Cta'),
      href: audit.href,
      external: audit.external,
    },
  ]

  return (
    <section className="py-28 px-6 bg-white" aria-labelledby={baseId + '-heading'}>
      <div className="max-w-[75rem] mx-auto">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={vpOnce}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand mb-4">{t('eyebrow')}</p>
          <h2
            id={baseId + '-heading'}
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-medium text-foreground leading-[1.05] tracking-[-0.02em]"
          >
            {t('titlePart1')} <span className="italic text-brand">{t('titleAccent')}</span>
          </h2>
        </motion.div>

        <div className="mb-10 md:mb-14 flex justify-center">
          <div
            role="tablist"
            aria-label={t('eyebrow')}
            className="inline-flex flex-wrap md:flex-nowrap justify-center gap-2 p-1.5 rounded-full bg-surface border border-border"
          >
            {tabs.map((tab, idx) => {
              const Icon = tab.icon
              const isActive = active === tab.key
              return (
                <button
                  key={tab.key}
                  id={baseId + '-tab-' + tab.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={baseId + '-panel-' + tab.key}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActive(tab.key)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={
                    'inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ' +
                    (isActive
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-foreground hover:bg-white hover:text-brand')
                  }
                >
                  <Icon size={15} className={isActive ? 'text-white' : 'text-brand'} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              id={baseId + '-panel-' + active}
              role="tabpanel"
              aria-labelledby={baseId + '-tab-' + active}
              initial={panelInitial}
              animate={panelAnimate}
              exit={panelExit}
              transition={panelTransition}
            >
              {active === 'sell' && <SimplePanel {...sellPanel} />}
              {active === 'buy' && <SimplePanel {...buyPanel} />}
              {active === 'estimation' && (
                <EstimationPanel
                  eyebrow={t('estimationEyebrow')}
                  title={t('estimationTitle')}
                  desc={t('estimationDesc')}
                  cards={estimationCards}
                />
              )}
              {active === 'blog' && <SimplePanel {...blogPanel} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
