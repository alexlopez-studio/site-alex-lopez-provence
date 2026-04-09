import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Alex Lopez — Mandataire IAD',
    default: 'Alex Lopez — Mandataire IAD Haut-Var & Verdon',
  },
  description:
    'Mandataire immobilier IAD basé à Varages (83670). Estimation gratuite, vente et achat en Haut-Var et Verdon. Appelez le 06 13 18 01 68.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr'
  ),
  openGraph: {
    locale: 'fr_FR',
    type: 'website',
    siteName: 'Alex Lopez — Mandataire IAD Provence',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased">
        <Header />
        {/* pt-20 compense la navbar fixe (~80px) */}
        <main className="pt-20">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
