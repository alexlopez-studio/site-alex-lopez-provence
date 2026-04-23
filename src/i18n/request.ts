import { cookies, headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from './config'

function detectFromAcceptLanguage(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale
  // Ex : "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7"
  const preferred = acceptLanguage
    .split(',')
    .map(function (p) { return p.trim().split(';')[0]?.split('-')[0]?.toLowerCase() })
    .find(function (code) { return isLocale(code) })
  return isLocale(preferred) ? preferred : defaultLocale
}

export default getRequestConfig(async function () {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value

  let locale: Locale
  if (isLocale(cookieLocale)) {
    locale = cookieLocale
  } else {
    const headersList = await headers()
    locale = detectFromAcceptLanguage(headersList.get('accept-language'))
  }

  const messages = (await import('../../messages/' + locale + '.json')).default

  return { locale, messages }
})
