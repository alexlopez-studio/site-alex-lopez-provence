'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  HelpCircle,
  Import,
  Loader2,
  MapPin,
  Pencil,
  RefreshCw,
  Save,
  Search,
  Trash2,
  UserRound,
  WalletCards,
} from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

type CommuneResult = {
  nom: string
  code: string
  codesPostaux: string[]
  departement: { code: string; nom: string }
}

type Zone = {
  id: string
  name: string
  zipcode: string
  city: string | null
  insee_code: string | null
  active: boolean
  last_synced_at: string | null
  property_count?: number
  last_sync_status?: string | null
}

type SyncPreview = {
  zipcode: string
  requested_max_items: number
  budget_max_items_per_sync: number
  effective_max_items: number
  max_items: number
  total_available: number
  provider_total_available?: number
  estimated_items: number
  estimated_cost_eur: number
  preview_capped?: boolean
  online_only?: boolean
  sync_enabled: boolean
  can_confirm: boolean
  blocked_reason: string | null
  cost_per_item_eur: number
  min_balance_eur: number
  estimated_balance_eur: number
}

type StreamEstateBudget = {
  sync_enabled: boolean
  manual_balance_eur: number
  cost_per_item_eur?: number
  max_items_per_sync?: number
  unlimited_items?: boolean
  cost_per_request_eur: number
  max_requests_per_sync: number
  min_balance_eur: number
  resync_window_minutes?: number
  estimated_balance_eur: number
  estimated_spent_total_eur: number
  estimated_spent_today_eur: number
  estimated_spent_month_eur: number
  external_items_today?: number
  external_items_month?: number
  external_requests_today: number
  external_requests_month: number
  last_blocked_reason: string | null
}

type SyncStats = {
  last_sync_at: string | null
  zones: Array<{
    zone_id: string
    property_count: number
    last_sync_status: string | null
  }>
  stream_estate_budget?: StreamEstateBudget
}

type SyncRun = {
  id: string
  status: string
  started_at: string | null
  fetched_count: number | null
  created_count: number | null
  updated_count: number | null
  external_item_count: number | null
  external_request_count: number | null
  estimated_cost_eur: number | null
  blocked_reason: string | null
  error_message: string | null
  monitored_zones: { name: string; zipcode: string; city: string | null } | null
}

type SyncTarget = {
  name: string
  zipcode: string
  inseeCode: string | null
}

const PERSONAL_DEFAULTS = {
  fullName: 'Alexandre Lopez',
  email: 'local-preview@iad.fr',
  phone: '06 13 18 01 68',
  title: 'Conseiller immobilier iad',
}

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n)
}

function fmtEur(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function relativeTime(iso: string | null): string {
  if (!iso) return 'Jamais'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "À l'instant"
  if (m < 60) return `Il y a ${m} min`
  const h = Math.floor(m / 60)
  if (h < 24) return `Il y a ${h} h`
  return `Il y a ${Math.floor(h / 24)} j`
}

function StatusBadge({
  tone,
  children,
}: {
  tone: 'success' | 'warning' | 'danger' | 'neutral'
  children: React.ReactNode
}) {
  const classes = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    danger: 'border-red-200 bg-red-50 text-red-700',
    neutral: 'border-border bg-muted text-muted-foreground',
  }

  return (
    <Badge variant="outline" className={`h-auto rounded-md ${classes[tone]}`}>
      {children}
    </Badge>
  )
}

function RunStatus({ status }: { status: string }) {
  if (status === 'success') return <StatusBadge tone="success">Succès</StatusBadge>
  if (status === 'blocked') return <StatusBadge tone="warning">Bloquée</StatusBadge>
  if (status === 'error') return <StatusBadge tone="danger">Erreur</StatusBadge>
  return <StatusBadge tone="neutral">En cours</StatusBadge>
}

function zoneStatusLabel(status: string | null | undefined): string {
  if (status === 'success') return 'À jour'
  if (status === 'blocked') return 'Bloquée'
  if (status === 'error') return 'Erreur'
  if (status === 'running') return 'En cours'
  return 'À vérifier'
}

export default function SettingsPage() {
  const [stats, setStats] = useState<SyncStats | null>(null)
  const [runs, setRuns] = useState<SyncRun[]>([])
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [maxItemsPerSync, setMaxItemsPerSync] = useState('30')
  const [unlimitedItems, setUnlimitedItems] = useState(false)

  const [communeQuery, setCommuneQuery] = useState('')
  const [communes, setCommunes] = useState<CommuneResult[]>([])
  const [communeLoading, setCommuneLoading] = useState(false)
  const [selectedCommune, setSelectedCommune] = useState<CommuneResult | null>(null)
  const [selectedZip, setSelectedZip] = useState('')
  const [syncTarget, setSyncTarget] = useState<SyncTarget | null>(null)
  const [syncPreview, setSyncPreview] = useState<SyncPreview | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [editingZoneId, setEditingZoneId] = useState<string | null>(null)
  const [zoneDraft, setZoneDraft] = useState({ name: '', zipcode: '', insee_code: '' })
  const [zoneSaving, setZoneSaving] = useState<string | null>(null)
  const [zoneDeleting, setZoneDeleting] = useState<string | null>(null)

  const [personalFullName, setPersonalFullName] = useState(PERSONAL_DEFAULTS.fullName)
  const [personalEmail, setPersonalEmail] = useState(PERSONAL_DEFAULTS.email)
  const [personalPhone, setPersonalPhone] = useState(PERSONAL_DEFAULTS.phone)
  const [personalTitle, setPersonalTitle] = useState(PERSONAL_DEFAULTS.title)
  const [personalSaving, setPersonalSaving] = useState(false)

  const budget = stats?.stream_estate_budget
  const budgetBlocked = Boolean(budget && budget.estimated_balance_eur <= budget.min_balance_eur)
  const defaultMaxItems = budget?.max_items_per_sync ?? budget?.max_requests_per_sync ?? 30
  const countLimitReached = Boolean(syncPreview && (syncPreview.provider_total_available ?? syncPreview.total_available) >= 10000)

  const load = useCallback(async () => {
    try {
      const [statsRes, runsRes, zonesRes] = await Promise.all([
        fetch('/api/market/sync-stats'),
        fetch('/api/market/sync-runs?limit=8'),
        fetch('/api/market/zones?limit=100&sort=name.asc'),
      ])

      const statsData = await statsRes.json()
      const runsData = await runsRes.json()
      const zonesData = await zonesRes.json()
      const statsMap = new Map<string, SyncStats['zones'][number]>(
        (statsData.zones ?? []).map((zone: SyncStats['zones'][number]) => [zone.zone_id, zone]),
      )

      setStats(statsData)
      setRuns(runsData.runs ?? [])
      setZones((zonesData.zones ?? []).map((zone: Zone) => ({
        ...zone,
        property_count: statsMap.get(zone.id)?.property_count ?? 0,
        last_sync_status: statsMap.get(zone.id)?.last_sync_status ?? null,
      })))
    } catch (err) {
      console.error('Erreur chargement paramètres', err)
      toast.error('Impossible de charger les paramètres')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    fetch('/api/market/settings')
      .then((res) => res.json())
      .then((data) => {
        const settings = data?.settings ?? {}

        setUnlimitedItems(Boolean(settings.stream_estate_unlimited_items))

        if (settings.stream_estate_max_items_per_sync !== undefined) {
          setMaxItemsPerSync(String(settings.stream_estate_max_items_per_sync))
        } else if (settings.stream_estate_max_requests_per_sync !== undefined) {
          setMaxItemsPerSync(String(settings.stream_estate_max_requests_per_sync))
        }

        setPersonalFullName(String(settings.personal_full_name ?? PERSONAL_DEFAULTS.fullName))
        setPersonalEmail(String(settings.personal_email ?? PERSONAL_DEFAULTS.email))
        setPersonalPhone(String(settings.personal_phone ?? PERSONAL_DEFAULTS.phone))
        setPersonalTitle(String(settings.personal_title ?? PERSONAL_DEFAULTS.title))
      })
      .catch((err) => {
        console.error('Erreur chargement app_settings:', err)
        toast.error('Impossible de charger les réglages')
      })
  }, [])

  function refresh() {
    setRefreshing(true)
    load()
  }

  function searchCommunes(value: string) {
    setCommuneQuery(value)
    setSelectedCommune(null)
    setSelectedZip('')
    setSyncPreview(null)

    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (value.trim().length < 2) {
      setCommunes([])
      return
    }

    searchTimer.current = setTimeout(async () => {
      setCommuneLoading(true)
      try {
        const isZip = /^\d{5}$/.test(value.trim())
        const url = isZip
          ? `/api/market/communes?codePostal=${value.trim()}`
          : `/api/market/communes?q=${encodeURIComponent(value.trim())}`
        const res = await fetch(url)
        const data = await res.json()
        setCommunes(data.communes ?? [])
      } catch (err) {
        console.error('Recherche commune impossible:', err)
        setCommunes([])
      } finally {
        setCommuneLoading(false)
      }
    }, 250)
  }

  function pickCommune(commune: CommuneResult) {
    setSelectedCommune(commune)
    setCommuneQuery(commune.nom)
    setCommunes([])
    setSelectedZip(commune.codesPostaux.length === 1 ? commune.codesPostaux[0] : '')
    setSyncPreview(null)
  }

  function attachCommune() {
    if (!selectedCommune || !selectedZip) {
      toast.error('Choisis une commune et un code postal avant de rattacher')
      return
    }

    setSyncTarget({
      name: selectedCommune.nom,
      zipcode: selectedZip,
      inseeCode: selectedCommune.code,
    })
    setSyncPreview(null)
  }

  function targetFromZone(zone: Zone): SyncTarget {
    return {
      name: zone.city ?? zone.name,
      zipcode: zone.zipcode,
      inseeCode: zone.insee_code,
    }
  }

  async function previewTarget(target = syncTarget) {
    if (!target) {
      toast.error('Rattache une commune avant de prévisualiser')
      return null
    }

    setPreviewLoading(true)
    try {
      const body: Record<string, unknown> = {
        zipcode: target.zipcode,
        insee_code: target.inseeCode,
      }
      if (!unlimitedItems) {
        body.max_items = Math.max(1, Math.floor(Number(maxItemsPerSync) || defaultMaxItems))
      }

      const res = await fetch('/api/market/sync-preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Prévisualisation impossible')

      setSyncTarget(target)
      setSyncPreview(data)
      return data as SyncPreview
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      toast.error(message)
      setSyncPreview(null)
      return null
    } finally {
      setPreviewLoading(false)
    }
  }

  async function confirmImport() {
    if (!syncTarget) {
      toast.error('Rattache une commune avant d’importer')
      return
    }

    const preview = syncPreview ?? await previewTarget(syncTarget)
    if (!preview) return
    if (!preview.can_confirm) {
      toast.error('Import bloqué par le budget ou les garde-fous Stream Estate')
      return
    }

    setImporting(true)
    try {
      const body: Record<string, unknown> = {
        zipcode: syncTarget.zipcode,
        insee_code: syncTarget.inseeCode,
        name: syncTarget.name,
        city: syncTarget.name,
      }
      if (!unlimitedItems) {
        body.max_items = Math.max(1, Math.floor(Number(maxItemsPerSync) || defaultMaxItems))
      }

      const res = await fetch('/api/market/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Import impossible')

      if (data.from_cache) {
        toast(`${syncTarget.name} déjà à jour`, {
          description: 'Aucun appel Stream Estate facturable lancé.',
        })
      } else {
        toast.success(`${syncTarget.name} importée : ${data.fetched ?? 0} bien(s), ${fmtEur(Number(data.estimated_cost_eur ?? 0))}`)
      }
      setSyncPreview(null)
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err))
    } finally {
      setImporting(false)
    }
  }

  function startZoneEdit(zone: Zone) {
    setEditingZoneId(zone.id)
    setZoneDraft({
      name: zone.name,
      zipcode: zone.zipcode,
      insee_code: zone.insee_code ?? '',
    })
  }

  async function saveZone(zoneId: string) {
    setZoneSaving(zoneId)
    try {
      const res = await fetch(`/api/market/zones/${zoneId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: zoneDraft.name.trim(),
          zipcode: zoneDraft.zipcode.trim(),
          city: zoneDraft.name.trim(),
          insee_code: zoneDraft.insee_code.trim() || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Mise à jour impossible')
      toast.success('Commune mise à jour')
      setEditingZoneId(null)
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err))
    } finally {
      setZoneSaving(null)
    }
  }

  async function deleteZone(zone: Zone) {
    if (!confirm(`Supprimer ${zone.name} ?\n\nSi aucune autre zone ne surveille le CP ${zone.zipcode}, les biens associés peuvent être purgés.`)) {
      return
    }

    setZoneDeleting(zone.id)
    try {
      const res = await fetch(`/api/market/zones/${zone.id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Suppression impossible')
      toast.success(`${zone.name} supprimée`)
      await load()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err))
    } finally {
      setZoneDeleting(null)
    }
  }

  async function savePersonalInfo() {
    setPersonalSaving(true)
    try {
      const res = await fetch('/api/market/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personal_full_name: personalFullName.trim(),
          personal_email: personalEmail.trim(),
          personal_phone: personalPhone.trim(),
          personal_title: personalTitle.trim(),
        }),
      })
      if (!res.ok) throw new Error('Enregistrement impossible')
      toast.success('Informations personnelles enregistrées')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err))
    } finally {
      setPersonalSaving(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 border-b pb-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">Paramètres</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">Réglages Mandat OS</h1>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
            Piloter Stream Estate sans surprise de budget, puis centraliser les informations personnelles utilisées par l’application.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={refreshing}>
          <RefreshCw className={refreshing ? 'animate-spin' : ''} />
          Actualiser
        </Button>
      </div>

      <Tabs defaultValue="stream-estate" className="gap-5">
        <TabsList className="w-full justify-start overflow-x-auto" variant="line">
          <TabsTrigger value="stream-estate">
            <WalletCards />
            API Stream Estate
          </TabsTrigger>
          <TabsTrigger value="personal">
            <UserRound />
            <span className="hidden sm:inline">Informations personnelles</span>
            <span className="sm:hidden">Infos perso</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stream-estate" className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Card className="border-emerald-200 bg-emerald-50/70">
              <CardContent className="flex items-center gap-3 p-4">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-700" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Stream Estate activé</p>
                  <p className="text-xs text-muted-foreground">Les imports restent confirmés à la main.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <WalletCards className="size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Solde estimé : {budget ? fmtEur(budget.estimated_balance_eur) : '—'}</p>
                  <p className="text-xs text-muted-foreground">Réserve minimale : {budget ? fmtEur(budget.min_balance_eur) : '—'}.</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <HelpCircle className="size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{budget ? fmtEur(budget.cost_per_item_eur ?? budget.cost_per_request_eur) : '—'} par bien importé</p>
                  <p className="text-xs text-muted-foreground">La prévisualisation ne crée aucune zone.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-brand/20">
            <CardHeader>
              <CardTitle>Prévisualiser puis importer une commune</CardTitle>
              <CardDescription>
                Stream Estate permet un comptage via `itemsPerPage=0`; la page affiche uniquement les annonces encore en ligne.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-lg border bg-background p-4">
                <Label htmlFor="stream-estate-commune" className="text-xs font-medium uppercase text-muted-foreground">
                  Nom de commune
                </Label>
                <div className="mt-2 grid gap-2 md:grid-cols-[minmax(0,1fr)_auto]">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="stream-estate-commune"
                      value={communeQuery}
                      placeholder="Saisir une commune, ex : Barjols"
                      className="pl-9"
                      onChange={(event) => searchCommunes(event.target.value)}
                    />
                    {communeLoading ? (
                      <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden="true" />
                    ) : null}
                    {communes.length > 0 ? (
                      <div className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-lg border bg-background shadow-lg">
                        {communes.map((commune) => (
                          <button
                            key={commune.code}
                            type="button"
                            className="flex w-full items-start justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
                            onClick={() => pickCommune(commune)}
                          >
                            <span>
                              <span className="font-medium text-foreground">{commune.nom}</span>
                              <span className="ml-2 text-xs text-muted-foreground">{commune.departement.nom}</span>
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">{commune.codesPostaux.join(', ')}</span>
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={attachCommune} disabled={!selectedCommune || !selectedZip}>
                    <MapPin />
                    Rattacher
                  </Button>
                </div>

                {selectedCommune && selectedCommune.codesPostaux.length > 1 ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Code postal :</span>
                    {selectedCommune.codesPostaux.map((zipcode) => (
                      <button
                        key={zipcode}
                        type="button"
                        onClick={() => setSelectedZip(zipcode)}
                        className={`rounded-md border px-2 py-1 text-xs font-medium ${selectedZip === zipcode ? 'border-brand bg-brand text-white' : 'border-border bg-background text-foreground hover:bg-muted'}`}
                      >
                        {zipcode}
                      </button>
                    ))}
                  </div>
                ) : null}

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Cette commune devient le contexte de la prévisualisation et de l’import, avec son code postal et son code INSEE.
                </p>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">Commune rattachée aux actions</p>
                {syncTarget ? (
                  <>
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <p className="text-2xl font-semibold leading-tight text-foreground">{syncTarget.name}</p>
                      {syncTarget.inseeCode ? (
                        <Badge variant="outline" className="rounded-md border-emerald-200 bg-emerald-50 text-emerald-700">
                          Commune exacte
                        </Badge>
                      ) : (
                        <StatusBadge tone="warning">CP seul</StatusBadge>
                      )}
                      {syncTarget.inseeCode ? <Badge variant="outline" className="rounded-md">INSEE {syncTarget.inseeCode}</Badge> : null}
                      <Badge variant="outline" className="rounded-md">CP {syncTarget.zipcode}</Badge>
                    </div>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                      Le filtre commune exacte évite de récupérer les communes voisines du même code postal.
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">Aucune commune rattachée pour l’instant.</p>
                )}
              </div>

              <div className={`rounded-lg border p-4 ${syncPreview?.can_confirm || !syncPreview ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`text-lg font-semibold ${syncPreview?.can_confirm || !syncPreview ? 'text-emerald-950' : 'text-amber-950'}`}>
                        {syncPreview
                          ? `${fmt(syncPreview.total_available)} annonce${syncPreview.total_available > 1 ? 's' : ''} en ligne trouvée${syncPreview.total_available > 1 ? 's' : ''}`
                          : 'Prévisualisation en attente'}
                      </p>
                      <Badge
                        variant="outline"
                        className="h-auto max-w-full whitespace-normal rounded-md border-emerald-200 bg-emerald-50 px-2 py-1 text-left text-emerald-700"
                      >
                        Prévisualisation gratuite selon contrat à confirmer
                      </Badge>
                    </div>
                    <p className={`mt-2 text-sm leading-6 ${syncPreview?.can_confirm || !syncPreview ? 'text-emerald-900' : 'text-amber-900'}`}>
                      {syncPreview
                        ? <>Coût si import : <strong>{fmtEur(syncPreview.estimated_cost_eur)}</strong>. Aucun bien hors ligne n’est inclus dans ce volume.</>
                        : 'Rattache une commune puis prévisualise avant tout import.'}
                    </p>
                    {countLimitReached ? (
                      <p className="mt-2 text-xs font-medium text-amber-900">
                        Le compteur Stream Estate est plafonné à 10 000 résultats sur `/documents/properties`.
                      </p>
                    ) : null}
                    {syncPreview?.blocked_reason ? (
                      <p className="mt-2 text-xs font-medium text-amber-900">{syncPreview.blocked_reason}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={() => void previewTarget()} disabled={previewLoading || !syncTarget}>
                      {previewLoading ? <Loader2 className="animate-spin" /> : <Eye />}
                      Prévisualiser
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => void confirmImport()} disabled={importing || previewLoading || !syncPreview?.can_confirm || budgetBlocked}>
                      {importing ? <Loader2 className="animate-spin" /> : <Import />}
                      Importer ces biens
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Communes surveillées</CardTitle>
              <CardDescription>
                Les communes sont modifiables et supprimables. La preview reprend directement la commune choisie.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {loading ? (
                <div className="h-24 animate-pulse rounded-lg bg-muted" />
              ) : zones.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  Aucune commune surveillée pour le moment.
                </div>
              ) : (
                zones.map((zone) => (
                  <div
                    key={zone.id}
                    className="flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center md:justify-between"
                  >
                    {editingZoneId === zone.id ? (
                      <>
                        <div className="grid flex-1 gap-2 md:grid-cols-3">
                          <Input value={zoneDraft.name} onChange={(event) => setZoneDraft((current) => ({ ...current, name: event.target.value }))} aria-label="Nom de commune" />
                          <Input value={zoneDraft.zipcode} onChange={(event) => setZoneDraft((current) => ({ ...current, zipcode: event.target.value }))} aria-label="Code postal" />
                          <Input value={zoneDraft.insee_code} onChange={(event) => setZoneDraft((current) => ({ ...current, insee_code: event.target.value }))} placeholder="INSEE optionnel" aria-label="Code INSEE" />
                        </div>
                        <div className="flex gap-2">
                          <Button size="xs" variant="primary" onClick={() => void saveZone(zone.id)} disabled={zoneSaving === zone.id}>
                            {zoneSaving === zone.id ? <Loader2 className="animate-spin" /> : <Save />}
                            Enregistrer
                          </Button>
                          <Button size="xs" variant="outline" onClick={() => setEditingZoneId(null)}>Annuler</Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex min-w-0 items-start gap-3">
                          <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-brand-light/70 text-brand">
                            <MapPin className="size-4" aria-hidden="true" />
                          </span>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-foreground">{zone.name}</p>
                              <Badge variant="outline" className="rounded-md">CP {zone.zipcode}</Badge>
                              {zone.insee_code ? (
                                <Badge variant="outline" className="rounded-md border-emerald-200 bg-emerald-50 text-emerald-700">
                                  INSEE {zone.insee_code}
                                </Badge>
                              ) : (
                                <StatusBadge tone="warning">CP seul</StatusBadge>
                              )}
                              {!zone.active ? <StatusBadge tone="neutral">Inactive</StatusBadge> : null}
                            </div>
                            <p className="mt-1 text-xs text-muted-foreground">Dernière sync : {relativeTime(zone.last_synced_at)}</p>
                          </div>
                        </div>

                        <div className="grid gap-3 text-xs sm:grid-cols-[70px_120px_1fr] md:min-w-[440px] md:text-right">
                          <div>
                            <p className="text-muted-foreground">Biens</p>
                            <p className="font-semibold tabular-nums text-foreground">{zone.property_count ?? 0}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Statut</p>
                            <StatusBadge tone={zone.last_sync_status === 'error' ? 'danger' : zone.last_sync_status === 'blocked' ? 'warning' : 'success'}>
                              {zoneStatusLabel(zone.last_sync_status)}
                            </StatusBadge>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Actions</p>
                            <div className="mt-1 flex flex-wrap gap-1 md:justify-end">
                              <Button type="button" variant="outline" size="xs" onClick={() => void previewTarget(targetFromZone(zone))}>
                                <Eye />
                                Preview
                              </Button>
                              <Button type="button" variant="outline" size="xs" onClick={() => startZoneEdit(zone)}>
                                <Pencil />
                                Modifier
                              </Button>
                              <Button type="button" variant="destructive" size="xs" onClick={() => void deleteZone(zone)} disabled={zoneDeleting === zone.id}>
                                {zoneDeleting === zone.id ? <Loader2 className="animate-spin" /> : <Trash2 />}
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <details className="rounded-lg border bg-card p-4 text-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-foreground">
              <span className="flex items-center gap-2">
                <Clock3 className="size-4 text-brand" aria-hidden="true" />
                Historique récent
              </span>
              <ChevronDown className="size-4 text-muted-foreground" aria-hidden="true" />
            </summary>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="px-3 py-2 text-left font-medium">Zone</th>
                    <th className="px-3 py-2 text-left font-medium">Date</th>
                    <th className="px-3 py-2 text-right font-medium">Biens</th>
                    <th className="px-3 py-2 text-right font-medium">Items</th>
                    <th className="px-3 py-2 text-right font-medium">Coût</th>
                    <th className="px-3 py-2 text-left font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">Aucun historique.</td>
                    </tr>
                  ) : runs.map((run) => (
                    <tr key={run.id} className="border-b last:border-b-0">
                      <td className="px-3 py-2 font-medium text-foreground">{run.monitored_zones?.name ?? '—'} <span className="text-muted-foreground">{run.monitored_zones?.zipcode}</span></td>
                      <td className="px-3 py-2 text-muted-foreground">{run.started_at ? new Date(run.started_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '—'}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{run.fetched_count ?? 0}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{run.external_item_count ?? run.external_request_count ?? 0}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtEur(Number(run.estimated_cost_eur ?? 0))}</td>
                      <td className="px-3 py-2"><RunStatus status={run.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </TabsContent>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Ces informations serviront aux prochains écrans de profil, signatures et points de contact.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-medium">Nom complet</span>
                  <Input value={personalFullName} onChange={(event) => setPersonalFullName(event.target.value)} />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium">Fonction</span>
                  <Input value={personalTitle} onChange={(event) => setPersonalTitle(event.target.value)} />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium">Email</span>
                  <Input type="email" value={personalEmail} onChange={(event) => setPersonalEmail(event.target.value)} />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-medium">Téléphone</span>
                  <Input value={personalPhone} onChange={(event) => setPersonalPhone(event.target.value)} />
                </label>
              </div>

              <div className="rounded-lg border bg-muted/30 p-4">
                <p className="text-sm font-medium text-foreground">Aperçu</p>
                <p className="mt-2 text-lg font-semibold text-foreground">{personalFullName || '—'}</p>
                <p className="text-sm text-muted-foreground">{personalTitle || '—'}</p>
                <p className="mt-2 text-sm text-muted-foreground">{personalEmail || '—'} · {personalPhone || '—'}</p>
              </div>

              <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={savePersonalInfo} disabled={personalSaving}>
                  {personalSaving ? <Loader2 className="animate-spin" /> : <Save />}
                  Enregistrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
