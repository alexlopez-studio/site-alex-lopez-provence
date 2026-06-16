'use client'

import { useEffect, useState, useCallback } from 'react'
import { RefreshCw, Activity, Database, Clock, CheckCircle2, XCircle, Loader2, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// ── Types ──────────────────────────────────────────────────────────────────

interface SparkPoint { date: string; syncs: number; fetched: number }

interface ZoneStat {
  zone_id: string
  name: string
  zipcode: string
  city: string | null
  last_synced_at: string | null
  active: boolean
  last_sync_status: string | null
  property_count: number
}

interface SyncStats {
  total_syncs: number
  syncs_today: number
  syncs_this_month: number
  properties_fetched_total: number
  properties_fetched_today: number
  properties_fetched_month: number
  last_sync_at: string | null
  sparkline: SparkPoint[]
  zones: ZoneStat[]
}

interface SyncRun {
  id: string
  zone_id: string
  provider: string
  status: string
  started_at: string | null
  finished_at: string | null
  fetched_count: number | null
  created_count: number | null
  updated_count: number | null
  error_message: string | null
  monitored_zones: { name: string; zipcode: string; city: string | null } | null
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n)
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'À l\'instant'
  if (m < 60) return `Il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `Il y a ${h}h`
  return `Il y a ${Math.floor(h / 24)}j`
}

function duration(started: string | null, finished: string | null): string {
  if (!started || !finished) return '—'
  const ms = new Date(finished).getTime() - new Date(started).getTime()
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`
}

// ── Sparkline SVG ──────────────────────────────────────────────────────────

function Sparkline({ data }: { data: SparkPoint[] }) {
  if (!data.length) return null
  const values = data.map((d) => d.syncs)
  const max = Math.max(...values, 1)
  const w = 200
  const h = 32
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - (v / max) * h
    return `${x},${y}`
  })
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-brand"
      />
    </svg>
  )
}

// ── Status badge ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === 'success') return (
    <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
      <CheckCircle2 className="h-3 w-3" /> Succès
    </span>
  )
  if (status === 'error') return (
    <span className="flex items-center gap-1 text-[10px] text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
      <XCircle className="h-3 w-3" /> Erreur
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
      <Loader2 className="h-3 w-3 animate-spin" /> En cours
    </span>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [stats, setStats] = useState<SyncStats | null>(null)
  const [runs, setRuns] = useState<SyncRun[]>([])
  const [runsTotal, setRunsTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const [statsRes, runsRes] = await Promise.all([
        fetch('/api/market/sync-stats'),
        fetch('/api/market/sync-runs?limit=20'),
      ])
      const statsData = await statsRes.json()
      const runsData = await runsRes.json()
      setStats(statsData)
      setRuns(runsData.runs ?? [])
      setRunsTotal(runsData.total ?? 0)
    } catch (err) {
      console.error('Erreur chargement stats', err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  function refresh() {
    setRefreshing(true)
    load()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Centre de contrôle</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Consommation API · Fraîcheur des données · Historique des syncs
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
          <RefreshCw className={`mr-1 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Section 1 — Consommation API Stream Estate */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-brand" />
          <h2 className="text-sm font-semibold">API Stream Estate</h2>
          <Badge variant="outline" className="text-[10px] text-green-700 border-green-200 bg-green-50">
            ● Connectée
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Syncs aujourd'hui", value: stats?.syncs_today ?? '—' },
            { label: 'Syncs ce mois', value: stats?.syncs_this_month ?? '—' },
            { label: 'Syncs total', value: stats ? fmt(stats.total_syncs) : '—' },
            { label: "Biens récupérés aujourd'hui", value: stats ? fmt(stats.properties_fetched_today) : '—' },
            { label: 'Biens récupérés ce mois', value: stats ? fmt(stats.properties_fetched_month) : '—' },
            { label: 'Biens récupérés total', value: stats ? fmt(stats.properties_fetched_total) : '—' },
          ].map((kpi) => (
            <Card key={kpi.label}>
              <CardContent className="p-3">
                <p className="text-[10px] text-muted-foreground leading-tight">{kpi.label}</p>
                <p className={`text-xl font-bold mt-1 ${loading ? 'text-muted animate-pulse' : ''}`}>
                  {loading ? '…' : kpi.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sparkline */}
        {stats?.sparkline && stats.sparkline.length > 0 && (
          <Card>
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">Appels API — 30 derniers jours</CardDescription>
                <span className="text-[10px] text-muted-foreground">
                  Dernière sync : {relativeTime(stats.last_sync_at)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <Sparkline data={stats.sparkline} />
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-muted-foreground">{stats.sparkline[0]?.date}</span>
                <span className="text-[9px] text-muted-foreground">{stats.sparkline[stats.sparkline.length - 1]?.date}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Section 2 — Fraîcheur par zone */}
      {stats?.zones && stats.zones.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-semibold">Fraîcheur des données par zone</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {stats.zones.map((zone) => {
              const ageH = zone.last_synced_at
                ? (Date.now() - new Date(zone.last_synced_at).getTime()) / 3600000
                : Infinity
              const freshness = zone.last_sync_status === 'error'
                ? 'error'
                : !zone.last_synced_at ? 'never'
                : ageH < 24 ? 'ok' : 'stale'

              return (
                <Card key={zone.zone_id} className={!zone.active ? 'opacity-50' : ''}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{zone.name}</p>
                        <p className="text-[10px] text-muted-foreground">{zone.zipcode}{zone.city ? ` · ${zone.city}` : ''}</p>
                      </div>
                      <span className={`shrink-0 text-[10px] rounded-full px-2 py-0.5 border font-medium ${
                        freshness === 'ok' ? 'text-green-700 bg-green-50 border-green-200'
                        : freshness === 'stale' ? 'text-amber-700 bg-amber-50 border-amber-200'
                        : freshness === 'error' ? 'text-red-700 bg-red-50 border-red-200'
                        : 'text-muted-foreground bg-muted border-border'
                      }`}>
                        {freshness === 'ok' ? '✓ À jour'
                          : freshness === 'stale' ? '⚠ Ancien'
                          : freshness === 'error' ? '✗ Erreur'
                          : '— Jamais'}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span>{zone.property_count} bien{zone.property_count !== 1 ? 's' : ''}</span>
                      <span>{relativeTime(zone.last_synced_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      {/* Section 3 — Historique des syncs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" />
            <h2 className="text-sm font-semibold">Historique des synchronisations</h2>
          </div>
          {runsTotal > 20 && (
            <span className="text-[10px] text-muted-foreground">{runsTotal} au total</span>
          )}
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-muted-foreground">
                  <th className="text-left px-4 py-2 font-medium">Zone</th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                  <th className="text-right px-4 py-2 font-medium">Durée</th>
                  <th className="text-right px-4 py-2 font-medium">Récupérés</th>
                  <th className="text-right px-4 py-2 font-medium">Créés</th>
                  <th className="text-right px-4 py-2 font-medium">MAJ</th>
                  <th className="text-left px-4 py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b">
                      {[...Array(7)].map((__, j) => (
                        <td key={j} className="px-4 py-2">
                          <div className="h-3 rounded bg-muted animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : runs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      <BarChart3 className="mx-auto h-6 w-6 opacity-30 mb-2" />
                      Aucune synchronisation enregistrée
                    </td>
                  </tr>
                ) : (
                  runs.map((run) => (
                    <tr key={run.id} className="border-b hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-2">
                        <span className="font-medium">{run.monitored_zones?.name ?? '—'}</span>
                        <span className="text-muted-foreground ml-1">{run.monitored_zones?.zipcode}</span>
                      </td>
                      <td className="px-4 py-2 text-muted-foreground whitespace-nowrap">
                        {run.started_at
                          ? new Date(run.started_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
                          : '—'}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">
                        {duration(run.started_at, run.finished_at)}
                      </td>
                      <td className="px-4 py-2 text-right tabular-nums">{run.fetched_count ?? '—'}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-green-700">{run.created_count ?? '—'}</td>
                      <td className="px-4 py-2 text-right tabular-nums text-blue-700">{run.updated_count ?? '—'}</td>
                      <td className="px-4 py-2">
                        <StatusBadge status={run.status} />
                        {run.error_message && (
                          <p className="text-[9px] text-red-600 mt-0.5 truncate max-w-[120px]" title={run.error_message}>
                            {run.error_message}
                          </p>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Section 4 — Config */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 text-brand" />
          <h2 className="text-sm font-semibold">Configuration</h2>
        </div>
        <Card>
          <CardContent className="divide-y p-0">
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Synchronisation automatique</p>
                <p className="text-xs text-muted-foreground">Cron Vercel · Chaque nuit à 2h UTC</p>
              </div>
              <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 text-[10px]">Actif</Badge>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Source de données</p>
                <p className="text-xs text-muted-foreground">Stream Estate API</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">stream_estate</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Zones actives</p>
                <p className="text-xs text-muted-foreground">Codes postaux synchronisés</p>
              </div>
              <span className="text-sm font-semibold">{stats?.zones.filter((z) => z.active).length ?? '—'}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">Total biens en base</p>
                <p className="text-xs text-muted-foreground">Toutes zones confondues</p>
              </div>
              <span className="text-sm font-semibold">
                {stats ? fmt(stats.zones.reduce((s, z) => s + z.property_count, 0)) : '—'}
              </span>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
