'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { appUrl } from '@/lib/env'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

const NAV_LINKS = [
  { label: 'Vendre', href: '/vendre' },
  { label: 'Acheter', href: '/acheter' },
  { label: 'Audit gratuit', href: '/audit', highlight: true },
  { label: 'Mon approche', href: '/a-propos' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const assistantUrl = appUrl('') || '/assistant'

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

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none shrink-0">
          <span className="text-[15px] font-black text-foreground tracking-tight">Alex Lopez</span>
          <span className="text-[10px] font-semibold text-brand uppercase tracking-[0.16em]">Mandataire IAD</span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:flex items-center gap-6" aria-label="Navigation principale">
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

        {/* Tél + CTA desktop */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          <a href={'tel:' + PHONE_RAW}
            className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-brand transition-colors"
            aria-label={'Appeler le ' + PHONE_DISPLAY}>
            <Phone size={14} className="text-brand" />
            {PHONE_DISPLAY}
          </a>
          <Button asChild size="sm" variant="primary">
            <Link
              href={assistantUrl}
              target={assistantUrl.startsWith('http') ? '_blank' : undefined}
              rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}>
              Estimer mon bien
            </Link>
          </Button>
        </div>

        {/* Burger mobile */}
        <button
          className="lg:hidden p-2 -mr-2 rounded-lg text-foreground hover:bg-surface transition-colors"
          onClick={function () { setMenuOpen(function (v) { return !v }) }}
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </div>

      {/* Menu mobile */}
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
                  {link.highlight && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-brand-light text-brand px-2 py-0.5 rounded-full">
                      Gratuit
                    </span>
                  )}
                </Link>
              )
            })}
            <div className="pt-5 border-t border-border mt-2 space-y-3">
              <a href={'tel:' + PHONE_RAW}
                className="flex items-center gap-2 text-sm font-semibold text-brand">
                <Phone size={14} />
                {PHONE_DISPLAY}
              </a>
              <Button asChild size="default" variant="primary" className="w-full">
                <Link
                  href={assistantUrl}
                  target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                  rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                  onClick={function () { setMenuOpen(false) }}>
                  Estimer mon bien
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
