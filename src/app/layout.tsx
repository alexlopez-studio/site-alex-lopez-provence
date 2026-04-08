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
    template: '%s | Alex Lopez — Mandataire IAD Provence',
    default: 'Alex Lopez — Mandataire IAD Provence | Vente & Achat Immobilier',
  },
  description:
    'Vendez ou achetez votre bien immobilier en Provence avec Alex Lopez, mandataire IAD. Estimation gratuite, accompagnement personnalisé, données DVF.',
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
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
