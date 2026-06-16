'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { MapPin, RefreshCw, Trash2, Power, PowerOff, CheckCircle2, AlertTriangle, XCircle, Clock, Search, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

// ── Types ──────────────────────────────────────────────────────────────────

interface CommuneResult {
  nom: string
  code: string
  codesPostaux: string[]
  departement: { code: string; nom: string }
  population?: number
}

interface Zone {
  id: string
  name: string
  zipcode: string
  city: string | null
  insee_code: string | null
  active: boolean
  sync_frequency: string
  last_synced_at: string | null
}

interface ZoneWithStats extends Zone {
  property_count: number
  last_sync_status: string | null
}

// ── Helpers ────────────────────────────────────────────────────────────────

function freshnessStatus(last_synced_at: string | null, last_sync_status: string | null) {
  if (last_sync_status === 'error') return 'error'
  if (!last_synced_at) return 'never'
  const ageH = (Date.now() - new Date(last_synced_at).getTime()) / 3600000
  return ageH < 24 ? 'ok' : 'stale'
}

function FreshnessBadge({ last_synced_at, last_sync_status }: { last_synced_at: string | null; last_sync_status: string | null }) {
  const status = freshnessStatus(last_synced_at, last_sync_status)
  const map = {
    ok: { icon: CheckCircle2, label: 'À jour', cls: 'text-green-700 bg-green-50 border-green-200' },
    stale: { icon: AlertTriangle, label: 'Ancien', cls: 'text-amber-700 bg-amber-50 border-amber-200' },
    error: { icon: XCircle, label: 'Erreur', cls: 'text-red-700 bg-red-50 border-red-200' },
    never: { icon: Clock, label: 'Jamais synced', cls: 'text-muted-foreground bg-muted border-border' },
  }
  const { icon: Icon, label, cls } = map[status]
  return (
    <span className={`flex items-center gap-1 text-[10px] border rounded-full px-2 py-0.5 ${cls}`}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  )
}

function formatLastSync(iso: string | null): string {
  if (!iso) return 'Jamais'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `Il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `Il y a ${h}h`
  return `Il y a ${Math.floor(h / 24)}j`
}

// ── Commune search ──────────────────────────────────────────────────────────

function CommuneSearch({ onSelect }: { onSelect: (c: CommuneResult, zip: string) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CommuneResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCommune, setSelectedCommune] = useState<CommuneResult | null>(null)
  const [selectedZip, setSelectedZip] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function search(q: string) {
    setQuery(q)
    setSelectedCommune(null)
    setSelectedZip('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (q.length < 2) { setResults([]); setShowDropdown(false); return }

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        // Si c'est un code postal (5 chiffres) → chercher par codePostal
        const isZip = /^\d{5}$/.test(q)
        const url = isZip
          ? `/api/market/communes?codePostal=${q}`
          : `/api/market/communes?q=${encodeURIComponent(q)}`
        const res = await fetch(url)
        const { communes } = await res.json()
        setResults(communes ?? [])
        setShowDropdown(true)
      } catch { setResults([]) } finally { setLoading(false) }
    }, 300)
  }

  function pickCommune(commune: CommuneResult) {
    setSelectedCommune(commune)
    setQuery(commune.nom)
    setShowDropdown(false)
    setResults([])
    // Auto-sélectionner le ZIP si commune en a un seul
    if (commune.codesPostaux.length === 1) {
      setSelectedZip(commune.codesPostaux[0])
    } else {
      setSelectedZip('')
    }
  }

  function confirm() {
    if (!selectedCommune || !selectedZip) return
    onSelect(selectedCommune, selectedZip)
    setQuery('')
    setSelectedCommune(null)
    setSelectedZip('')
  }

  return (
    <div className="space-y-3">
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Nom de commune ou code postal (ex : Barjols, 83670…)"
            value={query}
            onChange={(e) => search(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            className="pl-9"
          />
          {loading && (
            <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          )}
        </div>

        {showDropdown && results.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-xl border bg-popover shadow-lg overflow-hidden">
            {results.slice(0, 8).map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => pickCommune(c)}
                className="flex w-full items-start justify-between px-3 py-2 text-left hover:bg-accent transition-colors"
              >
                <div>
                  <span className="text-sm font-medium">{c.nom}</span>
                  <span className="text-xs text-muted-foreground ml-2">{c.departement?.nom}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {c.codesPostaux.join(', ')}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Si commune sélectionnée avec plusieurs codes postaux : choix du CP */}
      {selectedCommune && selectedCommune.codesPostaux.length > 1 && (
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">
            <strong>{selectedCommune.nom}</strong> a plusieurs codes postaux — choisissez celui à surveiller :
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedCommune.codesPostaux.map((zip) => (
              <button
                key={zip}
                type="button"
                onClick={() => setSelectedZip(zip)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  selectedZip === zip
                    ? 'bg-brand text-white border-brand'
                    : 'border-input hover:bg-accent'
                }`}
              >
                {zip}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Récap + bouton ajouter */}
      {selectedCommune && selectedZip && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
          <div className="text-sm">
            <span className="font-semibold">{selectedCommune.nom}</span>
            <span className="text-muted-foreground ml-2">· {selectedZip} · {selectedCommune.departement?.nom}</span>
            <span className="text-muted-foreground ml-2">· INSEE {selectedCommune.code}</span>
          </div>
          <Button size="sm" onClick={confirm}>
            <MapPin className="mr-1 h-3.5 w-3.5" /> Ajouter
          </Button>
        </div>
      )}
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ZonesPage() {
  const [zones, setZones] = useState<ZoneWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState<Record<string, boolean>>({})
  const [showNew, setShowNew] = useState(false)
  const [deleteInfo, setDeleteInfo] = useState<{ zone: ZoneWithStats; deletedProperties?: number } | null>(null)

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

  async function addZone(commune: CommuneResult, zipcode: string) {
    await fetch('/api/market/zones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: commune.nom,
        zipcode,
        city: commune.nom,
        insee_code: commune.code,
        sync_frequency: 'daily',
      }),
    })
    setShowNew(false)
    await load()
  }

  async function toggleZone(zone: ZoneWithStats) {
    await fetch(`/api/market/zones/${zone.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !zone.active }),
    })
    await load()
  }

  async function deleteZone(zone: ZoneWithStats) {
    const res = await fetch(`/api/market/zones/${zone.id}`, { method: 'DELETE' })
    const data = await res.json()
    setDeleteInfo({ zone, deletedProperties: data.deleted_properties ?? 0 })
    setTimeout(() => setDeleteInfo(null), 4000)
    await load()
  }

  async function syncZone(zone: ZoneWithStats) {
    setSyncing((prev) => ({ ...prev, [zone.id]: true }))
    try {
      const res = await fetch('/api/market/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipcode: zone.zipcode }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(`Erreur sync ${zone.name} : ${data.error ?? res.statusText}`)
      } else {
        toast.success(`${zone.name} synchronisée — ${data.created ?? 0} créé(s), ${data.updated ?? 0} mis à jour`)
      }
      await load()
    } catch (err) {
      toast.error(`Erreur réseau : ${err instanceof Error ? err.message : String(err)}`)
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
            {loading ? '…' : `${activeCount} active${activeCount > 1 ? 's' : ''} sur ${zones.length} — commune par commune`}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowNew(!showNew)}>
          <MapPin className="mr-1 h-4 w-4" /> Ajouter une commune
        </Button>
      </div>

      {/* Toast suppression */}
      {deleteInfo && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>{deleteInfo.zone.name}</strong> supprimée
          {deleteInfo.deletedProperties
            ? ` · ${deleteInfo.deletedProperties} bien${deleteInfo.deletedProperties > 1 ? 's' : ''} supprimé${deleteInfo.deletedProperties > 1 ? 's' : ''} de la base`
            : ' · Les biens sont conservés (autre zone active sur ce code postal)'}
        </div>
      )}

      {/* Formulaire ajout commune */}
      {showNew && (
        <Card>
          <CardContent className="p-4 space-y-1">
            <p className="text-xs text-muted-foreground mb-3">
              Recherchez une commune française par nom ou code postal. Les données proviennent de l'API officielle <strong>geo.api.gouv.fr</strong>.
            </p>
            <CommuneSearch onSelect={addZone} />
            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowNew(false)}>Annuler</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des zones */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-[80px] rounded-xl bg-muted animate-pulse" />)}
        </div>
      ) : zones.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <MapPin className="h-8 w-8 opacity-30" />
            <p className="text-sm font-medium">Aucune commune configurée</p>
            <p className="text-xs">Ajoutez des communes pour commencer à surveiller le marché</p>
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
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-xs text-muted-foreground">
                        CP {zone.zipcode}
                        {zone.insee_code && <span className="ml-1 opacity-60">· INSEE {zone.insee_code}</span>}
                        {' · '}{zone.property_count} bien{zone.property_count !== 1 ? 's' : ''} en base
                      </p>
                    </div>
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
                    onClick={() => {
                      if (confirm(`Supprimer ${zone.name} ?\n\nSi aucune autre zone active n'utilise le code postal ${zone.zipcode}, les ${zone.property_count} biens associés seront également supprimés de la base.`)) {
                        deleteZone(zone)
                      }
                    }}
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

      {/* Note info */}
      <p className="text-[10px] text-muted-foreground text-center">
        Source : <a href="https://geo.api.gouv.fr" target="_blank" rel="noreferrer" className="underline hover:text-foreground">geo.api.gouv.fr</a> — API officielle des communes françaises (Etalab / DINUM)
      </p>
    </div>
  )
}
