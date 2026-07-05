import type { Metadata } from 'next'
import { OpportunitiesWorkspace } from './OpportunitiesWorkspace'

export const metadata: Metadata = {
  title: 'Opportunités — Mandat OS',
}

export default function OpportunitiesPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Opportunités</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pipelines vendeurs et acquéreurs, chacun avec son parcours jusqu’au mandat.
        </p>
      </div>

      <OpportunitiesWorkspace />
    </div>
  )
}
