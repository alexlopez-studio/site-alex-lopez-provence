import type { Metadata } from 'next'
import { DashboardContent } from './DashboardContent'

export const metadata: Metadata = {
  title: 'Dashboard — Mandat OS',
}

export default function MarketPage() {
  return <DashboardContent />
}