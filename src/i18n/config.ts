export const locales = ['fr', 'en'] as const
export const defaultLocale = 'fr' as const
export type Locale = (typeof locales)[number]

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export const LOCALE_META: Record<Locale, { flag: string; label: string; htmlLang: string }> = {
  fr: { flag: '🇫🇷', label: 'Français', htmlLang: 'fr-FR' },
  en: { flag: '🇬🇧', label: 'English', htmlLang: 'en-GB' },
}

export function isLocale(value: string | undefined | null): value is Locale {
  if (!value) return false
  return (locales as readonly string[]).includes(value)
}
