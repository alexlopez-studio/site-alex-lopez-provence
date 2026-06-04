import type { Metadata } from 'next'
import { AcheteursListClient } from './AcheteursListClient'

export const metadata: Metadata = {
  title: 'Acquéreurs — Mandat OS',
}

export default function AcheteursPage() {
  return <AcheteursListClient />
}