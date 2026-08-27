import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import { Inter, Allura, Playfair_Display, Source_Sans_3, Montserrat } from 'next/font/google'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AppChrome } from '@/components/layout/AppChrome'
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts'
import { LinkClickTracker } from '@/components/analytics/LinkClickTracker'
import { TooltipProvider } from '@/components/ui/tooltip'
import { LOCALE_META, type Locale } from '@/i18n/config'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
})

const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
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
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexandrelopez.fr'
  ),
  openGraph: {
    type: 'website',
    siteName: 'Alexandre Lopez — Conseiller en immobilier iad · Provence Verte & Verdon',
  },
  robots: { index: true, follow: true },
}

const GTM_ID = 'GTM-T3P59HCW'
const gtmScript = {
  __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
}
const hiddenFrameStyle: CSSProperties = {
  display: 'none',
  visibility: 'hidden',
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
    <html
      lang={htmlLang}
      className={`${inter.variable} ${montserrat.variable} ${buffalo.variable} ${playfair.variable} ${sourceSans.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={gtmScript} />
      </head>
      <body className="font-sans antialiased">
        <noscript>
          <iframe
            src={'https://www.googletagmanager.com/ns.html?id=' + GTM_ID}
            height="0"
            width="0"
            style={hiddenFrameStyle}
            title="Google Tag Manager"
          />
        </noscript>
        <AnalyticsScripts />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <LinkClickTracker />
          <TooltipProvider>
            <AppChrome header={<Header />} footer={<Footer />}>
              {children}
            </AppChrome>
          </TooltipProvider>
        </NextIntlClientProvider>
        <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
