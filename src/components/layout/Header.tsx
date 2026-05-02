'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Phone, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from './LocaleSwitcher'

const PHONE_RAW = '+33613180168'

export function Header() {
  const t = useTranslations('header')
  const tCommon = useTranslations('common')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const assistantUrl = '/outils'
  const phoneDisplay = tCommon('phoneDisplay')

  const NAV_LINKS = [
    { label: t('navTools'), href: '/outils', highlight: true },
    { label: t('navSell'), href: '/vendre' },
    { label: t('navBuy'), href: '/acheter' },
    { label: t('navAudit'), href: '/audit' },
    { label: t('navApproach'), href: '/a-propos' },
    { label: t('navBlog'), href: '/blog' },
    { label: t('navContact'), href: '/contact' },
  ]

  useEffect(function () {
    function onScroll() { setScrolled(window.scrollY > 48) }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return function () { window.removeEventListener('scroll', onScroll) }
  }, [])

  useEffect(function () {
    function onResize() { if (window.innerWidth >= 1024) setMenuOpen(false) }
    window.addEventListener('resize', onResize)
    return function () { window.removeEventListener('resize', onResize) }
  }, [])

  return (
    <header
      className={
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ' +
        (scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border py-3'
          : 'bg-white border-b border-transparent py-5')
      }
    >
      <div className="max-w-[75rem] mx-auto px-6 flex items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="flex flex-col leading-none">
            <span className="font-serif italic font-black text-brand text-[26px] tracking-[-0.04em]">iad</span>
            <span className="text-[9px] font-bold text-brand uppercase tracking-[0.18em] -mt-0.5">IMMOBILIER</span>
          </div>
          <div className="hidden sm:block border-l border-border pl-3 leading-tight">
            <span className="block font-script text-[22px] text-foreground leading-none -mb-0.5">Alexandre Lopez</span>
            <span className="block text-[9px] font-semibold text-muted uppercase tracking-[0.16em] mt-1">{t('brandLine2')}</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Navigation">
          {NAV_LINKS.map(function (link) {
            if (link.highlight) {
              return (
                <Link key={link.href} href={link.href}
                  className="text-sm font-semibold text-brand border border-brand rounded-full px-3 py-1 hover:bg-brand hover:text-white transition-colors">
                  {link.label}
                </Link>
              )
            }
            return (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <a href={'tel:' + PHONE_RAW}
            className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-brand transition-colors"
            aria-label={t('callAria', { phone: phoneDisplay })}>
            <Phone size={14} className="text-brand" />
            {phoneDisplay}
          </a>
          <LocaleSwitcher />
          <Button asChild size="sm" variant="primary">
            <Link href={assistantUrl}>
              {t('ctaEstimate')}
            </Link>
          </Button>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <LocaleSwitcher />
          <button
            className="p-2 -mr-2 rounded-lg text-foreground hover:bg-surface transition-colors"
            onClick={function () { setMenuOpen(function (v) { return !v }) }}
            aria-label={menuOpen ? t('menuClose') : t('menuOpen')}
            aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-border">
          <div className="max-w-[75rem] mx-auto px-6 py-6 space-y-1">
            {NAV_LINKS.map(function (link) {
              return (
                <Link key={link.href} href={link.href}
                  className={'flex items-center h-11 text-base transition-colors ' +
                    (link.highlight
                      ? 'font-semibold text-brand'
                      : 'font-medium text-foreground hover:text-brand')}
                  onClick={function () { setMenuOpen(false) }}>
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-5 border-t border-border mt-2 space-y-3">
              <a href={'tel:' + PHONE_RAW}
                className="flex items-center gap-2 text-sm font-semibold text-brand">
                <Phone size={14} />
                {phoneDisplay}
              </a>
              <Button asChild size="default" variant="primary" className="w-full">
                <Link
                  href={assistantUrl}
                  onClick={function () { setMenuOpen(false) }}>
                  {t('ctaEstimate')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
