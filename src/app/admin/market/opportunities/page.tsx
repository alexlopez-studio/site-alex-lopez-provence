import type { Metadata } from 'next'
import { KanbanBoard } from './KanbanBoard'

export const metadata: Metadata = {
  title: 'Opportunités — Mandat OS',
}

export default function OpportunitiesPage() {
  return <KanbanBoard />
}