import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Fraunces, Caveat } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/layout/PageTransition'
import { LOCALE_META, type Locale } from '@/i18n/config'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Alex Lopez — Mandataire IAD',
    default: 'Alex Lopez — Mandataire IAD Provence Verte & Haut-Var',
  },
  description:
    'Mandataire immobilier IAD en Provence Verte et Haut-Var. Estimation gratuite, vente et achat immobilier dans le Var. Appelez le 06 13 18 01 68.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr'
  ),
  openGraph: {
    type: 'website',
    siteName: 'Alex Lopez — Mandataire IAD Provence Verte & Haut-Var',
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
    <html lang={htmlLang} className={plusJakartaSans.variable + ' ' + fraunces.variable + ' ' + caveat.variable}>
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <PageTransition>
            <main className="pt-20">{children}</main>
          </PageTransition>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
