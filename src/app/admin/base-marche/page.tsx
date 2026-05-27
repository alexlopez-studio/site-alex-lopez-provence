import type { Metadata } from 'next'
import { MarketMvpClient } from './MarketMvpClient'

export const metadata: Metadata = {
  title: 'Base marché interne — Alexandre Lopez',
  description: 'Outil interne non indexé de veille marché et opportunités.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function BaseMarchePage() {
  return <MarketMvpClient />
}
