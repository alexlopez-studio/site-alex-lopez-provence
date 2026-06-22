'use client'

import { useEffect, useState } from 'react'
import { BellRingIcon, FlameIcon, HomeIcon, KanbanIcon } from 'lucide-react'
import { MetricCard } from '@/components/pro'

interface DashboardStats {
  biens_surveilles: number
  opportunites_chaudes: number
  alertes_mandat: number
  pipeline_actif: number
  zones_actives: number
}

const PLACEHOLDER = '—'

export function MandatKpiCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    let active = true
    fetch('/api/market/dashboard-stats')
      .then((r) => r.json())
      .then((d) => { if (active) setStats(d) })
      .catch(() => { if (active) setStats(null) })
    return () => { active = false }
  }, [])

  const v = (n?: number) => (stats && typeof n === 'number' ? n.toLocaleString('fr-FR') : PLACEHOLDER)

  const metrics = [
    {
      label: 'Biens surveillés',
      value: v(stats?.biens_surveilles),
      detail: stats ? `${v(stats.zones_actives)} zone(s) active(s)` : 'Chargement…',
      icon: HomeIcon,
      tone: 'brand' as const,
    },
    {
      label: 'Vendeurs à contacter',
      value: v(stats?.opportunites_chaudes),
      detail: 'Phases chaud / fenêtre d’or',
      icon: FlameIcon,
      tone: 'warning' as const,
    },
    {
      label: 'Alertes mandat',
      value: v(stats?.alertes_mandat),
      detail: 'Non lues (passage hot/golden)',
      icon: BellRingIcon,
      tone: 'success' as const,
    },
    {
      label: 'Pipeline actif',
      value: v(stats?.pipeline_actif),
      detail: 'Opportunités hors converti / écarté',
      icon: KanbanIcon,
      tone: 'neutral' as const,
    },
  ]

  return (
    <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-3 md:gap-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} />
      ))}
    </div>
  )
}
