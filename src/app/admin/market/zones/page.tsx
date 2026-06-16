'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, MapPin, RefreshCw, Trash2, Power, PowerOff, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

interface Zone {
  id: string
  name: string
  zipcode: string
  city: string | null
  radius_km: number | null
  active: boolean
  sync_frequency: string
  last_synced_at: string | null
}

interface ZoneWithStats extends Zone {
  property_count: number
  last_sync_status: string | null
}

function freshnessStatus(last_synced_at: string | null, last_sync_status: string | null) {
  if (last_sync_status === 'error') return 'error'
  if (!last_synced_at) return 'never'
  const ageH = (Date.now() - new Date(last_synced_at).getTime()) / 3600000
  if (ageH < 24) return 'ok'
  return 'stale'
}

function FreshnessBadge({ last_synced_at, last_sync_status }: { last_synced_at: string | null; last_sync_status: string | null }) {
  const status = freshnessStatus(last_synced_at, last_sync_status)
  if (status === 'ok') return (
    <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
      <CheckCircle2 className="h-3 w-3" /> À jour
    </span>
  )
  if (status === 'stale') return (
    <span className="flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
      <AlertTriangle className="h-3 w-3" /> Ancien
    </span>
  )
  if (status === 'error') return (
    <span className="flex items-center gap-1 text-[10px] text-red-700 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
      <XCircle className="h-3 w-3" /> Erreur
    </span>
  )
  return (
    <span className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted border border-border rounded-full px-2 py-0.5">
      <Clock className="h-3 w-3" /> Jamais synced
    </span>
  )
}

function formatLastSync(iso: string | null): string {
  if (!iso) return 'Jamais'
  const diff = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diff / 3600000)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24) return `Il y a ${hours}h`
  return `Il y a ${Math.floor(hours / 24)}j`
}

export default function ZonesPage() {
  const [zones, setZones] = useState<ZoneWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<Record<string, boolean>>({})
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newZip, setNewZip] = useState('')
  const [newCity, setNewCity] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [zonesRes, statsRes] = await Promise.all([
        fetch('/api/market/zones?limit=100'),
        fetch('/api/market/sync-stats'),
      ])
      const { zones: rawZones } = await zonesRes.json()
      const stats = await statsRes.json()

      const statsMap: Record<string, { property_count: number; last_sync_status: string | null }> = {}
      for (const z of stats.zones ?? []) {
        statsMap[z.zone_id] = { property_count: z.property_count, last_sync_status: z.last_sync_status }
      }

      setZones((rawZones ?? []).map((z: Zone) => ({
        ...z,
        property_count: statsMap[z.id]?.property_count ?? 0,
        last_sync_status: statsMap[z.id]?.last_sync_status ?? null,
      })))
    } catch (err) {
      console.error('Erreur chargement zones', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  async function addZone() {
    if (!newName.trim() || !newZip.trim()) return
    const res = await fetch('/api/market/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim(), zipcode: newZip.trim(), city: newCity.trim() || null, sync_frequency: 'daily' }),
    })
    if (res.ok) {
      setNewName('')
      setNewZip('')
      setNewCity('')
      setShowNew(false)
      await load()
    }
  }

  async function toggleZone(zone: ZoneWithStats) {
    await fetch(`/api/market/zones/${zone.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !zone.active }),
    })
    await load()
  }

  async function deleteZone(id: string) {
    if (!confirm('Supprimer cette zone ? Les biens associés ne seront pas supprimés.')) return
    await fetch(`/api/market/zones/${id}`, { method: 'DELETE' })
    await load()
  }

  async function syncZone(zone: ZoneWithStats) {
    setSyncing((prev) => ({ ...prev, [zone.id]: true }))
    try {
      await fetch('/api/market/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipcode: zone.zipcode }),
      })
      await load()
    } finally {
      setSyncing((prev) => ({ ...prev, [zone.id]: false }))
    }
  }

  const activeCount = zones.filter((z) => z.active).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Zones surveillées</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {loading ? '…' : `${activeCount} active${activeCount > 1 ? 's' : ''} sur ${zones.length}`}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowNew(!showNew)}>
          <Plus className="mr-1 h-4 w-4" /> Ajouter une zone
        </Button>
      </div>

      {showNew && (
        <Card>
          <CardContent className="flex flex-col gap-3 p-4">
            <div className="grid grid-cols-3 gap-3">
              <Input placeholder="Nom (ex: Barjols)" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Input placeholder="Code postal" value={newZip} onChange={(e) => setNewZip(e.target.value)} maxLength={5} />
              <Input placeholder="Commune (optionnel)" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowNew(false)}>Annuler</Button>
              <Button size="sm" onClick={addZone} disabled={!newName.trim() || !newZip.trim()}>
                <Plus className="mr-1 h-4 w-4" /> Ajouter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[72px] rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : zones.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <MapPin className="h-8 w-8 opacity-30" />
            <p className="text-sm">Aucune zone configurée</p>
            <p className="text-xs">Ajoutez un code postal pour commencer à surveiller le marché</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {zones.map((zone) => (
            <Card key={zone.id} className={zone.active ? '' : 'opacity-60'}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{zone.name}</p>
                      <Badge
                        variant="outline"
                        className={zone.active
                          ? 'text-[10px] bg-green-50 text-green-700 border-green-200'
                          : 'text-[10px] bg-gray-50 text-gray-500 border-gray-200'}
                      >
                        {zone.active ? 'Actif' : 'Inactif'}
                      </Badge>
                      <FreshnessBadge last_synced_at={zone.last_synced_at} last_sync_status={zone.last_sync_status} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {zone.zipcode}{zone.city ? ` · ${zone.city}` : ''} · {zone.property_count} bien{zone.property_count !== 1 ? 's' : ''} en base
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Dernière sync : {formatLastSync(zone.last_synced_at)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => syncZone(zone)}
                    disabled={syncing[zone.id]}
                    className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors disabled:opacity-50"
                    title="Synchroniser maintenant"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${syncing[zone.id] ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => toggleZone(zone)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    title={zone.active ? 'Désactiver' : 'Activer'}
                  >
                    {zone.active ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => deleteZone(zone.id)}
                    className="rounded p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
