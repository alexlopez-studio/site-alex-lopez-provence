'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { LOCALE_COOKIE, LOCALE_META, locales, type Locale } from '@/i18n/config'

type Props = {
  className?: string
  onSwitch?: () => void
}

export function LocaleSwitcher({ className = '', onSwitch }: Props) {
  const current = useLocale() as Locale
  const t = useTranslations('header')
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function setLocale(code: Locale) {
    if (code === current) return
    // Cookie 1 an, SameSite=Lax pour être envoyé sur navigation cross-site normale
    document.cookie = LOCALE_COOKIE + '=' + code + '; path=/; max-age=31536000; samesite=lax'
    if (onSwitch) onSwitch()
    startTransition(function () { router.refresh() })
  }

  return (
    <div
      role="group"
      aria-label={t('langSwitchLabel')}
      className={'inline-flex items-center gap-0.5 rounded-full bg-surface border border-border p-0.5 ' + className}
    >
      {locales.map(function (code) {
        const meta = LOCALE_META[code]
        const active = code === current
        return (
          <button
            key={code}
            type="button"
            onClick={function () { setLocale(code) }}
            disabled={pending}
            aria-label={meta.label}
            aria-pressed={active}
            title={meta.label}
            className={
              'flex items-center justify-center w-8 h-7 rounded-full text-base leading-none transition-all ' +
              (active
                ? 'bg-white shadow-sm ring-1 ring-border'
                : 'opacity-55 hover:opacity-100 cursor-pointer')
            }
          >
            <span aria-hidden="true">{meta.flag}</span>
          </button>
        )
      })}
    </div>
  )
}
