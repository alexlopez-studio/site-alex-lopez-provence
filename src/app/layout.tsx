import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PageTransition } from '@/components/layout/PageTransition'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
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
    locale: 'fr_FR',
    type: 'website',
    siteName: 'Alex Lopez — Mandataire IAD Provence Verte & Haut-Var',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={plusJakartaSans.variable}>
      <body className="font-sans antialiased">
        <Header />
        <PageTransition>
          <main className="pt-20">{children}</main>
        </PageTransition>
        <Footer />
      </body>
    </html>
  )
}
