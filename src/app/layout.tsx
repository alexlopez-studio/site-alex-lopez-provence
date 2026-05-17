import type { Metadata } from 'next'
import { Inter, Allura } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AppChrome } from '@/components/layout/AppChrome'
import { LOCALE_META, type Locale } from '@/i18n/config'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

/**
 * Buffalo = police payante (Buffalo Script, Creative Market).
 * Allura est utilisée ici comme placeholder Google Font très proche visuellement.
 * Pour switcher vers Buffalo officielle, uploader buffalo.woff2 dans /public/fonts/
 * puis remplacer cet import par next/font/local.
 */
const buffalo = Allura({
  subsets: ['latin'],
  variable: '--font-buffalo',
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Alexandre Lopez — Conseiller en immobilier iad',
    default: 'Alexandre Lopez — Conseiller en immobilier iad · Provence Verte & Verdon',
  },
  description:
    'Conseiller en immobilier iad en Provence Verte et Verdon. Avis de valeur de votre bien offert, vente et achat dans le Var. Contactez-moi au 06 13 18 01 68.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr'
  ),
  openGraph: {
    type: 'website',
    siteName: 'Alexandre Lopez — Conseiller en immobilier iad · Provence Verte & Verdon',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = (await getLocale()) as Locale
  const messages = await getMessages()
  const htmlLang = LOCALE_META[locale]?.htmlLang || 'fr-FR'

  return (
    <html lang={htmlLang} className={inter.variable + ' ' + buffalo.variable}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AppChrome header={<Header />} footer={<Footer />}>
            {children}
          </AppChrome>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
