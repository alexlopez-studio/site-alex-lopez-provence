import type { Metadata } from 'next'
import { KanbanBoard } from './KanbanBoard'
import { BuyerKanbanBoard } from './BuyerKanbanBoard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

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

      <Tabs defaultValue="vendeurs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendeurs">Vendeurs</TabsTrigger>
          <TabsTrigger value="acquereurs">Acquéreurs</TabsTrigger>
        </TabsList>
        <TabsContent value="vendeurs">
          <KanbanBoard />
        </TabsContent>
        <TabsContent value="acquereurs">
          <BuyerKanbanBoard />
        </TabsContent>
      </Tabs>
    </div>
  )
}
