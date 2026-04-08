'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { appUrl, biensUrl } from '@/lib/env'

const NAV_ITEMS = [
  { label: 'Vendre', href: appUrl('/vendre'), external: true },
  { label: 'Acheter', href: appUrl('/acheter'), external: true },
  { label: 'Audit immobilier express', href: appUrl('/audit'), external: true },
  { label: 'Mon approche', href: '/a-propos', external: false },
  {
    label: 'Devenir conseiller',
    href: 'https://www.iadfrance.fr/rejoindre-iad',
    external: true,
  },
  { label: 'Contact', href: '/contact', external: false },
] as const

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const listingsUrl = biensUrl()
  const assistantUrl = appUrl('') || '/assistant'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Ferme le menu mobile au resize desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-foreground text-lg tracking-tight"
          >
            <span className="text-brand">■</span> Alex Lopez
            <span className="hidden sm:inline text-muted font-normal text-sm ml-1">
              IAD Provence
            </span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="px-3 py-2 text-sm font-medium text-foreground/80 hover:text-foreground rounded-lg hover:bg-surface transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={listingsUrl}
              target={listingsUrl.startsWith('http') ? '_blank' : undefined}
              rel={listingsUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="px-3 py-2 text-sm font-medium text-brand hover:text-brand-hover rounded-lg hover:bg-surface transition-colors"
            >
              Consulter les biens
            </Link>
          </nav>

          {/* CTA desktop + burger */}
          <div className="flex items-center gap-3">
            <Link
              href={assistantUrl}
              target={assistantUrl.startsWith('http') ? '_blank' : undefined}
              rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success text-white text-sm font-semibold hover:bg-success-hover transition-colors"
            >
              Lancer l’assistant
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-surface transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-border shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className="px-4 py-3 text-sm font-medium text-foreground rounded-lg hover:bg-surface transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={listingsUrl}
              target={listingsUrl.startsWith('http') ? '_blank' : undefined}
              rel={listingsUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="px-4 py-3 text-sm font-medium text-brand rounded-lg hover:bg-surface transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Consulter les biens
            </Link>
            <div className="pt-2 border-t border-border mt-2">
              <Link
                href={assistantUrl}
                target={assistantUrl.startsWith('http') ? '_blank' : undefined}
                rel={assistantUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex items-center justify-center w-full px-4 py-3 rounded-full bg-success text-white text-sm font-semibold hover:bg-success-hover transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Lancer l’assistant
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
