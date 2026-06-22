import { PlusIcon, RefreshCwIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { SectionCards } from '@/components/section-cards'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
import { DataTable } from '@/components/data-table'
import { PageHeader, PageShell, PageSection } from '@/components/pro'
import { VendeursAContacter } from './VendeursAContacter'
import data from './data.json'

export default function MarketPage() {
  return (
    <div className="@container/main flex flex-1 flex-col">
      <PageShell>
        <PageHeader
          eyebrow="Mandat OS"
          title="Centre de controle"
          description="Vue d'ensemble des signaux, opportunites et donnees utiles pour piloter la prospection."
          actions={
            <>
              <Button variant="outline" size="sm">
                <RefreshCwIcon />
                Synchroniser
              </Button>
              <Button variant="primary" size="sm">
                <PlusIcon />
                Nouvelle zone
              </Button>
            </>
          }
        />
        <PageSection>
          <VendeursAContacter />
          <SectionCards />
          <ChartAreaInteractive />
          <DataTable data={data} />
        </PageSection>
      </PageShell>
    </div>
  )
}
