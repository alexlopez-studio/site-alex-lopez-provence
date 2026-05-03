'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from './LocaleSwitcher'

// Tant que les outils « Estimation gratuite » et « Bilan gratuit » (Audit) ne sont pas
// finalisés, on masque le lien Audit dans la nav et le bouton CTA dans le header.
const SHOW_TOOLS_CTAS = false

export function Header() {
  const t = useTranslations('header')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const assistantUrl = '/outils'

  // Navigation simplifiée — « Blog » hardcodé (même label FR/EN).
  const NAV_LINKS = [
    { label: t('navSell'), href: '/vendre' },
    { label: t('navBuy'), href: '/acheter' },
    ...(SHOW_TOOLS_CTAS ? [{ label: t('navAudit'), href: '/audit' }] : []),
    { label: 'Blog', href: '/blog' },
    { label: t('navApproach'), href: '/a-propos' },
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

  // === CLASSES DYNAMIQUES SCROLL ===
  // - État non scrollé : header pleine largeur, conventionnel.
  // - État scrollé : header se rétracte en "pill" centrée (max-w-5xl, rounded-full, shadow-2xl).
  // Transitions all 500ms ease-out pour un effet premium.
  const headerWrapperClasses = scrolled
    ? 'fixed z-50 transition-all duration-500 ease-out top-3 left-1/2 -translate-x-1/2 w-[min(95vw,64rem)] rounded-full shadow-2xl bg-white/95 backdrop-blur-md border border-border'
    : 'fixed z-50 transition-all duration-500 ease-out top-0 left-0 right-0 w-full bg-white/95 backdrop-blur-sm shadow-sm border-b border-border'

  const headerInnerClasses = scrolled
    ? 'mx-auto flex items-center justify-between gap-6 transition-all duration-500 ease-out px-5 py-2'
    : 'mx-auto flex items-center justify-between gap-6 transition-all duration-500 ease-out max-w-[75rem] px-6 py-3'

  const logoClasses = scrolled
    ? 'w-auto transition-all duration-500 ease-out h-10 md:h-12'
    : 'w-auto transition-all duration-500 ease-out h-16 md:h-20'

  return (
    <>
      {/* Spacer : réserve la hauteur du header pour ne pas masquer le contenu en haut de page.
          Hauteur fixe correspondant à l'état non scrollé (pour que la page ne saute pas au scroll). */}
      <div aria-hidden="true" className="h-[5.5rem] md:h-[6rem]" />

      <header className={headerWrapperClasses}>
        <div className={headerInnerClasses}>

          {/* Logo officiel HD */}
          <Link href="/" className="shrink-0 flex items-center" aria-label="Alexandre Lopez — Conseiller immobilier iad">
            <Image
              src="/logo-alexandre-lopez-high-resolution.png"
              alt="Alexandre Lopez — Conseiller immobilier iad"
              width={800}
              height={800}
              priority
              className={logoClasses}
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
