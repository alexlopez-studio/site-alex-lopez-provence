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
// Repassez SHOW_TOOLS_CTAS à true pour les réactiver d'un coup.
const SHOW_TOOLS_CTAS = false

export function Header() {
  const t = useTranslations('header')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const assistantUrl = '/outils'

  // Navigation simplifiée — le lien Audit est masqué tant que les outils ne sont pas prêts.
  // Le label « Blog » est identique en FR et EN, donc on le hardcode (pas de clé i18n nécessaire).
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

  return (
    <header
      className={
        'fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ' +
        (scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-1'
          : 'bg-white/95 backdrop-blur-sm py-2')
      }
    >
      <div className="max-w-[75rem] mx-auto px-6 flex items-center justify-between gap-6">

        {/* Logo officiel : version haute résolution pour rendu net sur grands écrans / retina. */}
        <Link href="/" className="shrink-0 flex items-center" aria-label="Alexandre Lopez — Conseiller immobilier iad">
          <Image
            src="/logo-alexandre-lopez-high-resolution.png"
            alt="Alexandre Lopez — Conseiller immobilier iad"
            width={800}
            height={800}
            priority
            className="h-32 sm:h-40 md:h-52 lg:h-60 w-auto"
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

        {/* Actions droite : Langue + (CTA si outils dispo) */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <LocaleSwitcher />

          {SHOW_TOOLS_CTAS && (
            <Button asChild size="sm" variant="primary">
              <Link href={assistantUrl}>
                {t('ctaEstimate')}
              </Link>
            </Button>
          )}
        </div>

        {/* Menu burger mobile */}
        <button
          className="lg:hidden p-2 -mr-2 rounded-lg text-foreground hover:bg-surface transition-colors"
          onClick={function () { setMenuOpen(function (v) { return !v }) }}
          aria-label={menuOpen ? t('menuClose') : t('menuOpen')}
          aria-expanded={menuOpen}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Menu mobile overlay */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg">
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
  )
}
