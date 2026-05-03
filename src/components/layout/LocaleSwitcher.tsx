'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LOCALE_COOKIE, LOCALE_META, locales, type Locale } from '@/i18n/config'

type Props = {
  className?: string
  onSwitch?: () => void
}

// === ANIMATIONS ===
// Externalisees pour eviter le stripping des ... en JSX inline.
const EASE_OUT_PREMIUM = [0.22, 1, 0.36, 1] as const

const overlayInitial = { opacity: 0 }
const overlayAnimate = { opacity: 1 }
const overlayExit = { opacity: 0 }
const overlayTransition = { duration: 0.35, ease: EASE_OUT_PREMIUM }

const pillSpring = { type: 'spring' as const, stiffness: 380, damping: 32 }

const flagTransition = { duration: 0.25, ease: EASE_OUT_PREMIUM }
const flagActiveAnim = { scale: 1.15, opacity: 1 }
const flagInactiveAnim = { scale: 1, opacity: 0.55 }
const flagInactiveHover = { opacity: 1, scale: 1.05 }
const flagActiveHover = {}

/**
 * Switch de langue avec animation premium :
 * - Pill blanche qui glisse entre FR et EN (layoutId framer-motion, spring lisse).
 * - Drapeau actif scaled (1.15) + opacity 1, drapeau inactif opacity 0.55.
 * - Overlay backdrop-blur tres leger sur tout l'ecran pendant la transition (~700 ms),
 *   pour signaler le basculement sans etre intrusif.
 */
export function LocaleSwitcher({ className = '', onSwitch }: Props) {
  const current = useLocale() as Locale
  const t = useTranslations('header')
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [switching, setSwitching] = useState(false)

  function setLocale(code: Locale) {
    if (code === current) return
    setSwitching(true)
    document.cookie = LOCALE_COOKIE + '=' + code + '; path=/; max-age=31536000; samesite=lax'
    if (onSwitch) onSwitch()
    startTransition(function () {
      router.refresh()
      window.setTimeout(function () { setSwitching(false) }, 700)
    })
  }

  return (
    <>
      {/* Overlay flash subtil pendant le switch (sur tout l'ecran). */}
      <AnimatePresence>
        {switching && (
          <motion.div
            key="locale-flash"
            initial={overlayInitial}
            animate={overlayAnimate}
            exit={overlayExit}
            transition={overlayTransition}
            className="fixed inset-0 z-[100] pointer-events-none bg-white/30 backdrop-blur-[3px]"
          />
        )}
      </AnimatePresence>

      <div
        role="group"
        aria-label={t('langSwitchLabel')}
        className={'relative inline-flex items-center gap-0.5 rounded-full bg-surface border border-border p-0.5 ' + className}
      >
        {locales.map(function (code) {
          const meta = LOCALE_META[code]
          const active = code === current
          const flagAnim = active ? flagActiveAnim : flagInactiveAnim
          const flagHover = active ? flagActiveHover : flagInactiveHover
          return (
            <button
              key={code}
              type="button"
              onClick={function () { setLocale(code) }}
              disabled={pending}
              aria-label={meta.label}
              aria-pressed={active}
              title={meta.label}
              className="relative flex items-center justify-center w-8 h-7 rounded-full text-base leading-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            >
              {/* Pill blanche animee : un seul element qui glisse grace a layoutId */}
              {active && (
                <motion.span
                  layoutId="locale-active-pill"
                  className="absolute inset-0 bg-white shadow-sm ring-1 ring-border rounded-full"
                  transition={pillSpring}
                  aria-hidden="true"
                />
              )}
              {/* Drapeau anime : scale + opacity selon etat actif */}
              <motion.span
                aria-hidden="true"
                animate={flagAnim}
                whileHover={flagHover}
                transition={flagTransition}
                className="relative z-10"
              >
                {meta.flag}
              </motion.span>
            </button>
          )
        })}
      </div>
    </>
  )
}
