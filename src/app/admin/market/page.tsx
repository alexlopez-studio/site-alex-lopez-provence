import Link from 'next/link'
import { MapPinIcon, Building2Icon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageHeader, PageShell, PageSection } from '@/components/pro'
import { VendeursAContacter } from './VendeursAContacter'
import { MandatKpiCards } from './MandatKpiCards'
import { SyncDailyStats } from './SyncDailyStats'

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
              <Button variant="outline" size="sm" asChild>
                <Link href="/app/properties">
                  <Building2Icon />
                  Voir le marché
                </Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/app/zones">
                  <MapPinIcon />
                  Gérer les zones
                </Link>
              </Button>
            </>
          }
        />
        <PageSection>
          <MandatKpiCards />
          <VendeursAContacter />
          <SyncDailyStats />
        </PageSection>
      </PageShell>
    </div>
  )
}
