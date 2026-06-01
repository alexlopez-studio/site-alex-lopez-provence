import type { Metadata } from 'next'
import { PropertiesTable } from './PropertiesTable'

export const metadata: Metadata = {
  title: 'Marché — Mandat OS',
}

export default function PropertiesPage() {
  return <PropertiesTable />
}