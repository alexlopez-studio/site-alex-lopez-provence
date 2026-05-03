'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from './LocaleSwitcher'

// Outils « Estimation gratuite » / « Bilan gratuit » : drapeau temporaire pour cacher la nav
// Audit + le bouton CTA dédié tant que les outils ne sont pas finalisés.
const SHOW_TOOLS_CTAS = false

// Ease premium type Apple : ease-out cubique avec un léger overshoot perçu.
const APPLE_EASE = 'cubic-bezier(0.22,1,0.36,1)'
const HEADER_DURATION_MS = 700

export function Header() {
  const t = useTranslations('header')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const assistantUrl = '/outils'

  // Navigation : labels neutres, même mot FR/EN pour Blog et Contact (donc hardcodés).
  const NAV_LINKS = [
    { label: t('navSell'), href: '/vendre' },
    { label: t('navBuy'), href: '/acheter' },
    ...(SHOW_TOOLS_CTAS ? [{ label: t('navAudit'), href: '/audit' }] : []),
    { label: 'Blog', href: '/blog' },
    { label: t('navApproach'), href: '/a-propos' },
    { label: 'Contact', href: '/contact' },
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

  // Style transition partagé (long, courbé ease-out premium, transform-gpu).
  const sharedTransition = {
    transitionProperty: 'top, left, right, width, max-width, padding, background-color, box-shadow, border-radius, border-color, transform',
    transitionDuration: HEADER_DURATION_MS + 'ms',
    transitionTimingFunction: APPLE_EASE,
  } as const

  // États wrapper du header.
  const headerWrapperClasses = scrolled
    ? 'fixed z-50 transform-gpu top-5 md:top-6 left-1/2 -translate-x-1/2 w-[min(95vw,64rem)] rounded-full shadow-2xl bg-white/95 backdrop-blur-md border border-border'
    : 'fixed z-50 transform-gpu top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-border rounded-none'

  const headerInnerClasses = scrolled
    ? 'mx-auto flex items-center justify-between gap-6 px-5 py-2'
    : 'mx-auto flex items-center justify-between gap-6 max-w-[75rem] px-6 py-3'

  // Logo : taille animée via styles inline (transition synchronisée avec header).
  const logoStyle = {
    transitionProperty: 'height, transform',
    transitionDuration: HEADER_DURATION_MS + 'ms',
    transitionTimingFunction: APPLE_EASE,
  } as const

  const logoClasses = scrolled
    ? 'w-auto h-10 md:h-12'
    : 'w-auto h-16 md:h-20'

  return (
    <>
      {/* Spacer : réserve la hauteur du header pour ne pas masquer le contenu en haut de page.
          Hauteur fixe correspondant à l'état non scrollé. */}
      <div aria-hidden="true" className="h-[5.5rem] md:h-[6rem]" />

      <header className={headerWrapperClasses} style={sharedTransition}>
        <div className={headerInnerClasses} style={sharedTransition}>

          {/* Logo officiel HD */}
          <Link href="/" className="shrink-0 flex items-center" aria-label="Alexandre Lopez — Conseiller immobilier iad">
            <Image
              src="/logo-alexandre-lopez-high-resolution.png"
              alt="Alexandre Lopez — Conseiller immobilier iad"
              width={800}
              height={800}
              priority
              className={logoClasses}
              style={logoStyle}
            />
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Navigation">
            {NAV_LINKS.map(function (link) {
              return (
                <Link key={link.href} href={link.href}
                  className="text-sm font-medium text-muted hover:text-foreground transition-colors whitespace-nowrap">
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Actions droite */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <LocaleSwitcher />

            {SHOW_TOOLS_CTAS && (
              <Button asChild size="sm" variant="primary">
                <Link href={assistantUrl}>{t('ctaEstimate')}</Link>
              </Button>
            )}
          </div>

          {/* Menu burger mobile */}
          <button
            className="lg:hidden p-2 -mr-2 rounded-lg text-foreground hover:bg-surface transition-colors"
            onClick={function () { setMenuOpen(function (v) { return !v }) }}
            aria-label={menuOpen ? t('menuClose') : t('menuOpen')}
            aria-expanded={menuOpen}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

        {/* Menu mobile overlay */}
        {menuOpen && (
          <div className={
            'lg:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg ' +
            (scrolled ? 'rounded-b-3xl mt-2' : '')
          }>
            <div className="max-w-[75rem] mx-auto px-6 py-6 space-y-2">
              <div className="flex items-center gap-2 pb-4 border-b border-border mb-2">
                <LocaleSwitcher />
              </div>

              {NAV_LINKS.map(function (link) {
                return (
                  <Link key={link.href} href={link.href}
                    className="block py-3 text-base font-medium text-foreground hover:text-brand transition-colors"
                    onClick={function () { setMenuOpen(false) }}>
                    {link.label}
                  </Link>
                )
              })}

              {SHOW_TOOLS_CTAS && (
                <div className="pt-4 border-t border-border mt-4">
                  <Button asChild size="default" variant="primary" className="w-full">
                    <Link href={assistantUrl} onClick={function () { setMenuOpen(false) }}>
                      {t('ctaEstimate')}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
