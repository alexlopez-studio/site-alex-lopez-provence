'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LocaleSwitcher } from './LocaleSwitcher'

export function Header() {
  const t = useTranslations('header')
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const assistantUrl = '/outils'

  // Navigation simplifiée - uniquement l'essentiel
  const NAV_LINKS = [
    { label: t('navSell'), href: '/vendre' },
    { label: t('navBuy'), href: '/acheter' },
    { label: t('navAudit'), href: '/audit' },
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
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-2'
          : 'bg-white/90 backdrop-blur-sm py-3')
      }
    >
      <div className="max-w-[75rem] mx-auto px-6 flex items-center justify-between">

        {/* Logo officiel : signature Alexandre Lopez + iad conseiller immobilier */}
        <Link href="/" className="shrink-0 flex items-center" aria-label="Alexandre Lopez — Conseiller immobilier iad">
          <Image
            src="/Logo-alexandre-lopez.png"
            alt="Alexandre Lopez — Conseiller immobilier iad"
            width={400}
            height={400}
            priority
            className="h-14 md:h-16 w-auto"
          />
        </Link>

        {/* Navigation desktop - 4 liens maximum */}
        <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation">
          {NAV_LINKS.map(function (link) {
            return (
              <Link key={link.href} href={link.href}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors">
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions droite : Langue + CTA */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* Selecteur de langue - drapeaux uniquement */}
          <LocaleSwitcher />
          
          <Button asChild size="sm" variant="primary">
            <Link href={assistantUrl}>
              {t('ctaEstimate')}
            </Link>
          </Button>
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
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg">
          <div className="max-w-[75rem] mx-auto px-6 py-6 space-y-2">
            {/* Selecteur de langue mobile */}
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
            <div className="pt-4 border-t border-border mt-4">
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
