import type { Metadata } from 'next'
import { PropertiesTable } from './PropertiesTable'
import { PropertiesMapWrapper } from './PropertiesMapWrapper'

export const metadata: Metadata = {
  title: 'Marché — Mandat OS',
}

export default function PropertiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <PropertiesMapWrapper />
      <PropertiesTable />
    </div>
  )
}
