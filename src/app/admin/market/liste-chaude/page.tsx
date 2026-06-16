import type { Metadata } from 'next'
import { WarmListClient } from './WarmListClient'

export const metadata: Metadata = {
  title: 'Liste Chaude — Mandat OS',
}

export default function ListeChaudePage() {
  return <WarmListClient />
}
