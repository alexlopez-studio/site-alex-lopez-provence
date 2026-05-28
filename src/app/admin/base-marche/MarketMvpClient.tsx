'use client'

import type { ComponentType, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  BarChart3,
  Bell,
  Building2,
  ClipboardList,
  Columns3,
  Database,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Loader2,
  LogOut,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  TrendingDown,
  UserCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type MarketProperty = {
  id: string
  title?: string | null
  city?: string | null
  zipcode?: string | null
  price?: number | null
  price_per_m2?: number | null
  surface?: number | null
  land_surface?: number | null
  rooms?: number | null
  bedrooms?: number | null
  dpe?: string | null
  source?: string | null
  url?: string | null
  status?: string | null
  tags?: string[]
  days_online?: number | null
  price_variation_percent?: number | null
  opportunity_score?: number
  recommended_action?: string
}

type Rule = {
  id: string
  name: string
  description: string
  active: boolean
  priority: string
  trigger_type?: string
}

type Notification = {
  id: string
  title: string
  message: string
  priority: string
  market_property_id: string | null
  status: string
  created_at: string
}

type Opportunity = {
  id: string
  market_property_id: string | null
  title: string
  description?: string | null
  priority: string
  stage: string
  signal_type?: string | null
  next_action?: string | null
}

type UsageStats = {
  unitCostEur: number
  currency: 'EUR'
  itemsToday: number
  itemsMonth: number
  costTodayEur: number
  costMonthEur: number
  successfulSyncsToday: number
  successfulSyncsMonth: number
  lastSyncAt: string | null
}

type ViewMode = 'data' | 'kanban' | 'rules'

const emptyUsage: UsageStats = {
  unitCostEur: 0.01,
  currency: 'EUR',
  itemsToday: 0,
  itemsMonth: 0,
  costTodayEur: 0,
  costMonthEur: 0,
  successfulSyncsToday: 0,
  successfulSyncsMonth: 0,
  lastSyncAt: null,
}

const sampleProperties: MarketProperty[] = [
  {
    id: 'demo-1',
    title: 'Maison de village avec terrasse',
    city: 'Pontevès',
    zipcode: '83670',
    price: 226000,
    price_per_m2: 2260,
    surface: 100,
    land_surface: 68,
    dpe: 'D',
    source: 'Donnée exemple',
    tags: ['Plus de 90 jours', 'Baisse de prix', 'Opportunité mandat'],
    days_online: 118,
    price_variation_percent: -7.8,
    opportunity_score: 78,
    recommended_action: 'Créer une opportunité et préparer une lecture marché.',
  },
  {
    id: 'demo-2',
    title: 'Villa avec terrain et garage',
    city: 'Barjols',
    zipcode: '83670',
    price: 369000,
    price_per_m2: 3075,
    surface: 120,
    land_surface: 740,
    dpe: 'C',
    source: 'Donnée exemple',
    tags: ['Terrain intéressant'],
    days_online: 21,
    price_variation_percent: null,
    opportunity_score: 32,
    recommended_action: 'Conserver dans la veille marché.',
  },
  {
    id: 'demo-3',
    title: 'Maison à rénover proche centre',
    city: 'Tavernes',
    zipcode: '83670',
    price: 185000,
    price_per_m2: 2055,
    surface: 90,
    land_surface: 240,
    dpe: 'F',
    source: 'Donnée exemple',
    tags: ['Plus de 90 jours', 'Forte baisse', 'DPE faible', 'Opportunité mandat'],
    days_online: 156,
    price_variation_percent: -11.2,
    opportunity_score: 92,
    recommended_action: 'Créer une opportunité et préparer un argument prix / DPE.',
  },
]

const fallbackRules: Rule[] = [
  { id: 'demo-rule-1', name: 'Nouvelle annonce sur la zone', description: 'Tague les annonces nouvelles du code postal surveillé.', active: true, priority: 'low', trigger_type: 'new_listing' },
  { id: 'demo-rule-2', name: 'Bien en ligne depuis plus de 90 jours', description: 'Détecte les annonces qui stagnent.', active: true, priority: 'medium', trigger_type: 'days_online' },
  { id: 'demo-rule-3', name: 'DPE F ou G', description: 'Détecte les biens avec performance énergétique faible.', active: true, priority: 'medium', trigger_type: 'dpe' },
  { id: 'demo-rule-4', name: 'Score opportunité élevé', description: 'Crée une opportunité quand plusieurs signaux sont cumulés.', active: true, priority: 'high', trigger_type: 'opportunity_score' },
]

const stages = ['À qualifier', 'À surveiller', 'Action à faire', 'En suivi', 'Converti', 'Écarté']
const quickFilters = ['Nouveauté', 'Baisse de prix', 'Plus de 90 jours', 'DPE F/G', 'Opportunités', 'À relancer']

function currency(value?: number | null, maximumFractionDigits = 0): string {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits }).format(value)
}

function number(value?: number | null): string {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('fr-FR').format(Math.round(value))
}

function propertyTypeLabel(property: MarketProperty): string {
  const title = (property.title ?? '').toLowerCase()
  if (title.includes('appartement')) return 'Appartement'
  if (title.includes('studio')) return 'Studio'
  if (title.includes('loft')) return 'Loft'
  if (title.includes('terrain')) return 'Terrain'
  if (title.includes('villa')) return 'Villa'
  return 'Maison'
}

function reference(property: MarketProperty): string {
  const compact = property.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6).toUpperCase()
  return `REF-${compact || 'MARKET'}`
}

function statusLabel(property: MarketProperty): string {
  if ((property.opportunity_score ?? 0) >= 70) return 'Opportunité'
  if ((property.price_variation_percent ?? 0) <= -5) return 'Baisse de prix'
  if ((property.days_online ?? 0) >= 90) return 'Plus de 90 jours'
  if ((property.days_online ?? 999) <= 14) return 'Nouveauté'
  return property.status === 'active' ? 'Actif' : property.status ?? 'Actif'
}

function priorityLabel(value?: string): string {
  if (value === 'high') return 'Haute'
  if (value === 'low') return 'Basse'
  return 'Moyenne'
}

function formatDateTime(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })
}

export function MarketMvpClient() {
  const [zipcode, setZipcode] = useState('83670')
  const [city, setCity] = useState('')
  const [properties, setProperties] = useState<MarketProperty[]>(sampleProperties)
  const [rules, setRules] = useState<Rule[]>(fallbackRules)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [usage, setUsage] = useState<UsageStats>(emptyUsage)
  const [selected, setSelected] = useState<MarketProperty | null>(null)
  const [view, setView] = useState<ViewMode>('data')
  const [query, setQuery] = useState('')
  const [quickFilter, setQuickFilter] = useState('Toutes')
  const [propertyType, setPropertyType] = useState('Tous les types')
  const [dpe, setDpe] = useState('Tous')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minSurface, setMinSurface] = useState('')
  const [maxSurface, setMaxSurface] = useState('')
  const [room, setRoom] = useState('')
  const [syncing, setSyncing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('Données exemple — synchronisation non lancée')

  async function loadUsage() {
    const response = await fetch('/api/market/usage', { cache: 'no-store' })
    const data = await response.json()
    if (data.success && data.usage) setUsage(data.usage)
  }

  async function loadPersistedData(currentZipcode = zipcode) {
    setLoading(true)
    try {
      const [propertiesRes, rulesRes, notificationsRes, opportunitiesRes, usageRes] = await Promise.all([
        fetch('/api/market/properties?zipcode=' + encodeURIComponent(currentZipcode), { cache: 'no-store' }),
        fetch('/api/rules', { cache: 'no-store' }),
        fetch('/api/notifications', { cache: 'no-store' }),
        fetch('/api/opportunities', { cache: 'no-store' }),
        fetch('/api/market/usage', { cache: 'no-store' }),
      ])
      const [propertiesJson, rulesJson, notificationsJson, opportunitiesJson, usageJson] = await Promise.all([
        propertiesRes.json(), rulesRes.json(), notificationsRes.json(), opportunitiesRes.json(), usageRes.json(),
      ])

      if (propertiesJson.success && Array.isArray(propertiesJson.properties) && propertiesJson.properties.length > 0) {
        setProperties(propertiesJson.properties)
        setStatus('Données persistées chargées')
      }
      if (rulesJson.success && Array.isArray(rulesJson.rules)) setRules(rulesJson.rules)
      if (notificationsJson.success && Array.isArray(notificationsJson.notifications)) setNotifications(notificationsJson.notifications)
      if (opportunitiesJson.success && Array.isArray(opportunitiesJson.opportunities)) setOpportunities(opportunitiesJson.opportunities)
      if (usageJson.success && usageJson.usage) setUsage(usageJson.usage)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Base persistée indisponible')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPersistedData('83670')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase()
    const minP = Number(minPrice) || 0
    const maxP = Number(maxPrice) || Number.POSITIVE_INFINITY
    const minS = Number(minSurface) || 0
    const maxS = Number(maxSurface) || Number.POSITIVE_INFINITY

    return properties.filter((property) => {
      const tags = property.tags ?? []
      const label = statusLabel(property)
      const type = propertyTypeLabel(property)
      const matchesSearch = !search || [property.title, property.city, property.zipcode, property.source, reference(property)]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
      const matchesQuick = quickFilter === 'Toutes'
        || label === quickFilter
        || tags.includes(quickFilter)
        || (quickFilter === 'Opportunités' && tags.includes('Opportunité mandat'))
        || (quickFilter === 'DPE F/G' && ['F', 'G'].includes(property.dpe ?? ''))
      const matchesType = propertyType === 'Tous les types' || type === propertyType
      const matchesDpe = dpe === 'Tous' || property.dpe === dpe
      const matchesPrice = (property.price ?? 0) >= minP && (property.price ?? 0) <= maxP
      const matchesSurface = (property.surface ?? 0) >= minS && (property.surface ?? 0) <= maxS
      const matchesRooms = !room || (property.rooms ?? 0) >= Number(room.replace('+', ''))
      const matchesCity = !city || (property.city ?? '').toLowerCase().includes(city.toLowerCase())
      const matchesZipcode = !zipcode || property.zipcode === zipcode || property.id.startsWith('demo-')
      return matchesSearch && matchesQuick && matchesType && matchesDpe && matchesPrice && matchesSurface && matchesRooms && matchesCity && matchesZipcode
    })
  }, [city, dpe, maxPrice, maxSurface, minPrice, minSurface, properties, propertyType, query, quickFilter, room, zipcode])

  async function syncStreamEstate() {
    setSyncing(true)
    setStatus('Synchronisation Stream Estate en cours...')
    try {
      const response = await fetch('/api/market/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipcode }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error ?? 'Synchronisation impossible')
      if (Array.isArray(data.properties) && data.properties.length > 0) setProperties(data.properties)
      if (data.usage) setUsage(data.usage)
      setStatus(`${data.fetched ?? 0} bien(s) synchronisé(s) · ${new Date().toLocaleString('fr-FR')}`)
      await loadPersistedData(zipcode)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Synchronisation non disponible')
      await loadUsage().catch(() => undefined)
    } finally {
      setSyncing(false)
    }
  }

  async function createOpportunity(property: MarketProperty) {
    if (property.id.startsWith('demo-')) {
      setOpportunities((current) => current.some((item) => item.market_property_id === property.id)
        ? current
        : [{
          id: crypto.randomUUID(),
          market_property_id: property.id,
          title: property.title ?? 'Bien sans titre',
          priority: (property.opportunity_score ?? 0) >= 70 ? 'high' : 'medium',
          stage: 'À qualifier',
          signal_type: (property.tags ?? [])[0] ?? 'Signal marché',
          next_action: property.recommended_action,
        }, ...current])
      return
    }

    const response = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: property.id }),
    })
    const data = await response.json()
    if (data.success) await loadPersistedData(zipcode)
  }

  async function updateOpportunityStage(id: string, stage: string) {
    setOpportunities((current) => current.map((item) => item.id === id ? { ...item, stage } : item))
    if (!id.includes('-')) {
      await fetch('/api/opportunities/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage }),
      })
    }
  }

  async function toggleRule(rule: Rule) {
    setRules((current) => current.map((item) => item.id === rule.id ? { ...item, active: !item.active } : item))
    if (!rule.id.startsWith('demo-')) {
      await fetch('/api/rules/' + rule.id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !rule.active }),
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f7f8] text-[#1f2933]">
      <div className="flex min-h-screen">
        <MarketSidebar view={view} setView={setView} />

        <aside className="w-[340px] shrink-0 border-r border-border bg-white">
          <div className="flex h-16 items-center border-b border-border px-6 text-xl font-black text-[#00577c]">Market Data</div>
          <div className="h-[calc(100vh-64px)] overflow-y-auto px-4 py-5">
            <UsagePanel usage={usage} />
            <FilterPanel
              city={city}
              dpe={dpe}
              filteredCount={filtered.length}
              maxPrice={maxPrice}
              maxSurface={maxSurface}
              minPrice={minPrice}
              minSurface={minSurface}
              propertyType={propertyType}
              query={query}
              quickFilter={quickFilter}
              room={room}
              zipcode={zipcode}
              onApply={() => void loadPersistedData(zipcode)}
              onReset={() => { setQuickFilter('Toutes'); setQuery(''); setMinPrice(''); setMaxPrice(''); setMinSurface(''); setMaxSurface(''); setRoom(''); setDpe('Tous'); setCity('') }}
              setCity={setCity}
              setDpe={setDpe}
              setMaxPrice={setMaxPrice}
              setMaxSurface={setMaxSurface}
              setMinPrice={setMinPrice}
              setMinSurface={setMinSurface}
              setPropertyType={setPropertyType}
              setQuery={setQuery}
              setQuickFilter={setQuickFilter}
              setRoom={setRoom}
              setZipcode={setZipcode}
            />
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-white">
          <Topbar />
          {view === 'data' ? <MarketDataView filtered={filtered} loading={loading} properties={properties} status={status} syncing={syncing} usage={usage} onSelect={setSelected} onSync={() => void syncStreamEstate()} /> : null}
          {view === 'kanban' ? <Kanban opportunities={opportunities} onMove={updateOpportunityStage} /> : null}
          {view === 'rules' ? <Rules rules={rules} notifications={notifications} onToggle={toggleRule} /> : null}
        </main>
      </div>

      {selected ? <PropertyDrawer property={selected} onClose={() => setSelected(null)} onCreateOpportunity={createOpportunity} /> : null}
    </div>
  )
}

function MarketSidebar({ view, setView }: { view: ViewMode; setView: (view: ViewMode) => void }) {
  return (
    <aside className="flex w-[280px] shrink-0 flex-col bg-[#006d92] text-white">
      <div className="px-8 py-8">
        <div className="text-3xl font-black tracking-[-0.04em]">Mandat OS</div>
        <div className="mt-2 text-sm text-sky-100">Base Marché</div>
        <Button onClick={() => setView('data')} className="mt-8 h-12 w-full rounded-lg bg-[#12b8e8] text-sm font-black text-[#00384f] hover:bg-[#28c7f3]">
          <Plus className="h-5 w-5" /> New Mandate
        </Button>
      </div>
      <nav className="mt-4 space-y-1 px-4 text-base font-bold text-sky-100">
        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={false} onClick={() => setView('data')} />
        <SidebarItem icon={Building2} label="Portfolio" active={false} onClick={() => setView('data')} />
        <SidebarItem icon={BarChart3} label="Market Data" active={view === 'data'} onClick={() => setView('data')} />
        <SidebarItem icon={FileText} label="Mandates" active={view === 'kanban'} onClick={() => setView('kanban')} />
        <SidebarItem icon={ClipboardList} label="Tasks" active={view === 'rules'} onClick={() => setView('rules')} />
        <SidebarItem icon={Settings} label="Settings" active={false} onClick={() => setView('rules')} />
      </nav>
      <div className="mt-auto border-t border-white/15 px-8 py-8 text-sm font-semibold text-sky-100">
        <div className="mb-4 flex items-center gap-3"><HelpCircle className="h-4 w-4" /> Help</div>
        <div className="flex items-center gap-3"><LogOut className="h-4 w-4" /> Logout</div>
      </div>
    </aside>
  )
}

function SidebarItem({ icon: Icon, label, active, onClick }: { icon: ComponentType<{ className?: string }>; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn('flex w-full items-center gap-4 px-4 py-4 text-left transition hover:bg-white/10', active && 'bg-[#0a83ad] text-white shadow-[inset_4px_0_0_#15c8f5]')}>
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </button>
  )
}

function Topbar() {
  return (
    <div className="flex h-16 items-center justify-end gap-6 border-b border-border px-8 text-slate-700">
      <Button variant="ghost" size="sm" className="rounded-md px-2"><Bell className="h-5 w-5" /></Button>
      <Button variant="ghost" size="sm" className="rounded-md px-2"><MoreHorizontal className="h-5 w-5" /></Button>
      <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full border border-border bg-surface p-0"><UserCircle className="h-5 w-5" /></Button>
    </div>
  )
}

function MarketDataView({ filtered, loading, properties, status, syncing, usage, onSelect, onSync }: { filtered: MarketProperty[]; loading: boolean; properties: MarketProperty[]; status: string; syncing: boolean; usage: UsageStats; onSelect: (property: MarketProperty) => void; onSync: () => void }) {
  return (
    <section className="p-6">
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950">Base de données globale</h1>
          <p className="mt-1 text-sm text-muted">Vue filtrée des opportunités sur le marché actuel. {loading ? 'Chargement...' : status}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onSync} disabled={syncing} className="rounded-md border-slate-300 px-4 text-xs font-black uppercase tracking-wide text-slate-700">
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
            {syncing ? 'Sync...' : 'Synchroniser'}
          </Button>
          <Button variant="outline" className="rounded-md border-slate-300 px-4 text-xs font-black uppercase tracking-wide text-slate-700"><FileText className="h-4 w-4" /> Exporter</Button>
          <Button variant="outline" className="rounded-md border-slate-300 px-4 text-xs font-black uppercase tracking-wide text-slate-700"><Columns3 className="h-4 w-4" /> Colonnes</Button>
        </div>
      </div>
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <UsageCard label="Items consommés aujourd’hui" value={number(usage.itemsToday)} sub={`${usage.successfulSyncsToday} synchro(s) réussie(s)`} />
        <UsageCard label="Items consommés ce mois-ci" value={number(usage.itemsMonth)} sub={`Dernière sync : ${formatDateTime(usage.lastSyncAt)}`} />
        <UsageCard label="Coût estimé" value={currency(usage.costMonthEur, 2)} sub={`Pay as you go estimé · ${currency(usage.unitCostEur, 2)} / item`} accent />
      </div>
      <MarketTable properties={filtered} total={properties.length} onSelect={onSelect} />
    </section>
  )
}

function FilterPanel(props: {
  city: string
  dpe: string
  filteredCount: number
  maxPrice: string
  maxSurface: string
  minPrice: string
  minSurface: string
  propertyType: string
  query: string
  quickFilter: string
  room: string
  zipcode: string
  onApply: () => void
  onReset: () => void
  setCity: (value: string) => void
  setDpe: (value: string) => void
  setMaxPrice: (value: string) => void
  setMaxSurface: (value: string) => void
  setMinPrice: (value: string) => void
  setMinSurface: (value: string) => void
  setPropertyType: (value: string) => void
  setQuery: (value: string) => void
  setQuickFilter: (value: string) => void
  setRoom: (value: string) => void
  setZipcode: (value: string) => void
}) {
  return (
    <>
      <div className="relative mt-5">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
        <Input value={props.query} onChange={(event) => props.setQuery(event.target.value)} className="rounded-none pl-9" placeholder="Rechercher une commune, une adresse" />
      </div>
      <FilterSection title="FILTRES RAPIDES">
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((filter) => (
            <Badge as="button" key={filter} onClick={() => props.setQuickFilter(props.quickFilter === filter ? 'Toutes' : filter)} variant={props.quickFilter === filter ? 'default' : filter === 'DPE F/G' || filter === 'À relancer' ? 'destructive' : 'outline'} className="cursor-pointer">
              {filter === 'Baisse de prix' ? <TrendingDown className="mr-1 h-3 w-3" /> : null}{filter}
            </Badge>
          ))}
        </div>
      </FilterSection>
      <FilterSection title="Localisation">
        <div className="grid grid-cols-2 gap-3">
          <Field label="CP" value={props.zipcode} onChange={props.setZipcode} placeholder="Ex: 83670" />
          <Field label="Commune" value={props.city} onChange={props.setCity} placeholder="Ex: Barjols" />
        </div>
      </FilterSection>
      <FilterSection title="Critères principaux">
        <label className="text-xs font-bold text-slate-600">Type de bien</label>
        <Select value={props.propertyType} onChange={(event) => props.setPropertyType(event.target.value)} className="mt-1 rounded-none">
          {['Tous les types', 'Maison', 'Villa', 'Appartement', 'Studio', 'Terrain', 'Loft'].map((value) => <option key={value}>{value}</option>)}
        </Select>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Field label="Prix Min (€)" value={props.minPrice} onChange={props.setMinPrice} placeholder="Min" />
          <Field label="Prix Max (€)" value={props.maxPrice} onChange={props.setMaxPrice} placeholder="Max" />
          <Field label="Surface (m²)" value={props.minSurface} onChange={props.setMinSurface} placeholder="Min" />
          <Field label="" value={props.maxSurface} onChange={props.setMaxSurface} placeholder="Max" />
        </div>
        <div className="mt-3">
          <div className="mb-1 text-xs font-bold text-slate-600">Pièces</div>
          <div className="grid grid-cols-5 gap-2">
            {['1', '2', '3', '4', '5+'].map((value) => (
              <Button key={value} variant="outline" size="sm" onClick={() => props.setRoom(props.room === value ? '' : value)} className={cn('h-9 rounded-none border-slate-300 px-0 text-sm font-bold text-slate-700', props.room === value && 'border-[#0b8ebd] bg-[#e8f8fd] text-[#006d92]')}>
                {value}
              </Button>
            ))}
          </div>
        </div>
      </FilterSection>
      <FilterSection title="Critères avancés" icon={<SlidersHorizontal className="h-4 w-4" />}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-600">DPE</label>
            <Select value={props.dpe} onChange={(event) => props.setDpe(event.target.value)} className="mt-1 rounded-none">
              {['Tous', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].map((value) => <option key={value}>{value}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Statut</label>
            <Select value={props.quickFilter} onChange={(event) => props.setQuickFilter(event.target.value)} className="mt-1 rounded-none">
              {['Toutes', 'Nouveauté', 'Baisse de prix', 'Plus de 90 jours', 'Opportunités'].map((value) => <option key={value}>{value}</option>)}
            </Select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-600">Source</label>
            <Select className="mt-1 rounded-none">
              <option>Toutes sources</option>
              <option>Stream Estate</option>
            </Select>
          </div>
          <Field label="Score Mandat" value="" onChange={() => undefined} placeholder="Min %" />
        </div>
      </FilterSection>
      <Button onClick={props.onApply} className="mt-4 h-12 w-full rounded-none bg-[#006d92] text-base font-black text-white hover:bg-[#00577c]">
        Appliquer les filtres <Badge variant="secondary" className="bg-white/20 text-white">{props.filteredCount} résultats</Badge>
      </Button>
      <button onClick={props.onReset} className="mt-3 w-full text-center text-xs font-black text-[#006d92]">Réinitialiser</button>
    </>
  )
}

function FilterSection({ title, children, icon }: { title: string; children: ReactNode; icon?: ReactNode }) {
  return <section className="mt-6 border-t border-border pt-5"><h2 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-800">{icon}{title}</h2>{children}</section>
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div><label className="text-xs font-bold text-slate-600">{label || '\u00A0'}</label><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1 rounded-none" /></div>
}

function UsagePanel({ usage }: { usage: UsageStats }) {
  return (
    <Card className="border-[#bce9f7] bg-[#e8f8fd] shadow-none">
      <CardContent className="p-3">
        <div className="text-xs font-black uppercase tracking-wide text-[#006d92]">Suivi API Stream Estate</div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <MiniUsage value={number(usage.itemsToday)} label="items jour" />
          <MiniUsage value={number(usage.itemsMonth)} label="items mois" />
          <MiniUsage value={currency(usage.costMonthEur, 2)} label="estimé" accent />
        </div>
      </CardContent>
    </Card>
  )
}

function MiniUsage({ value, label, accent = false }: { value: string; label: string; accent?: boolean }) {
  return <div className="rounded-md bg-white p-2"><div className={cn('text-lg font-black text-slate-900', accent && 'text-[#006d92]')}>{value}</div><div className="text-[10px] font-bold text-muted">{label}</div></div>
}

function UsageCard({ label, value, sub, accent = false }: { label: string; value: string; sub: string; accent?: boolean }) {
  return <Card className={cn('shadow-sm', accent && 'border-[#12b8e8] bg-[#e8f8fd]')}><CardContent className="p-4"><div className="text-xs font-black uppercase tracking-wide text-muted">{label}</div><div className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">{value}</div><div className="mt-1 text-xs font-semibold text-muted">{sub}</div></CardContent></Card>
}

function MarketTable({ properties, total, onSelect }: { properties: MarketProperty[]; total: number; onSelect: (property: MarketProperty) => void }) {
  return (
    <Card className="overflow-hidden rounded-md">
      <Table className="min-w-[860px]">
        <TableHeader className="bg-[#f3f3ef]">
          <TableRow>
            <TableHead className="w-12"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" /></TableHead>
            <TableHead>Référence / Adresse</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Prix</TableHead>
            <TableHead className="text-right">Surface</TableHead>
            <TableHead className="text-right">Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              <TableCell><input type="checkbox" className="h-4 w-4 rounded border-slate-300" /></TableCell>
              <TableCell>
                <button onClick={() => onSelect(property)} className="font-black text-[#0075a3] hover:underline">{reference(property)}</button>
                <div className="mt-1 text-xs text-muted">{property.title ?? 'Bien sans titre'}, {property.city ?? '—'} {property.zipcode ?? ''}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {(property.tags ?? []).slice(0, 3).map((tag) => <Badge key={tag} variant="secondary" className="text-[10px] text-muted">{tag}</Badge>)}
                </div>
              </TableCell>
              <TableCell className="font-semibold text-slate-700">{propertyTypeLabel(property)}</TableCell>
              <TableCell className="text-right font-black text-slate-900">
                {currency(property.price)}
                {property.price_variation_percent != null ? <div className="text-xs font-black text-red-500">↘ {property.price_variation_percent}%</div> : null}
              </TableCell>
              <TableCell className="text-right font-semibold text-slate-700">{number(property.surface)} m²</TableCell>
              <TableCell className="text-right"><span className="font-black text-[#006d92]">{property.opportunity_score ?? 0}</span><span className="text-slate-400">/100</span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between border-t border-border px-4 py-4 text-sm text-muted">
        <span>Affichage 1-{properties.length} sur {total} résultats</span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 w-9 rounded-md px-0 text-muted">‹</Button>
          <Button size="sm" className="h-9 w-9 rounded-md bg-[#006d92] px-0 font-black text-white">1</Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 rounded-md px-0 text-slate-600">2</Button>
          <Button variant="ghost" size="sm" className="h-9 w-9 rounded-md px-0 text-slate-600">3</Button>
          <span>...</span>
          <Button variant="outline" size="sm" className="h-9 w-9 rounded-md px-0 text-slate-600">›</Button>
        </div>
      </div>
    </Card>
  )
}

function Kanban({ opportunities, onMove }: { opportunities: Opportunity[]; onMove: (id: string, stage: string) => void }) {
  return <section className="p-6"><h1 className="mb-5 text-3xl font-black tracking-[-0.04em] text-slate-950">Pipeline d’opportunités</h1><div className="grid gap-4 xl:grid-cols-6">{stages.map((stage) => <Card key={stage} className="min-h-[28rem] bg-[#f7fafc]"><CardContent className="p-4"><h2 className="text-sm font-black text-slate-900">{stage}</h2><div className="mt-4 space-y-3">{opportunities.filter((item) => item.stage === stage).map((item) => <Card key={item.id}><CardContent className="p-3"><div className="font-black text-slate-900">{item.title}</div><div className="mt-2 rounded bg-slate-50 p-2 text-xs text-slate-600">{item.signal_type ?? item.description}</div><Select value={item.stage} onChange={(event) => void onMove(item.id, event.target.value)} className="mt-3 text-xs font-bold">{stages.map((value) => <option key={value} value={value}>{value}</option>)}</Select></CardContent></Card>)}{opportunities.filter((item) => item.stage === stage).length === 0 ? <div className="rounded border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">Aucune opportunité</div> : null}</div></CardContent></Card>)}</div></section>
}

function Rules({ rules, notifications, onToggle }: { rules: Rule[]; notifications: Notification[]; onToggle: (rule: Rule) => void }) {
  return <section className="p-6"><h1 className="mb-5 text-3xl font-black tracking-[-0.04em] text-slate-950">Règles de gestion</h1><div className="grid gap-4 lg:grid-cols-2">{rules.map((rule) => <Card key={rule.id}><CardContent className="p-5"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-black tracking-[-0.02em]">{rule.name}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{rule.description}</p></div><Badge as="button" onClick={() => void onToggle(rule)} variant={rule.active ? 'success' : 'secondary'} className="cursor-pointer">{rule.active ? 'Active' : 'Inactive'}</Badge></div><div className="mt-4 rounded bg-slate-50 p-4 text-sm text-slate-600"><div className="font-bold text-slate-900">Déclencheur</div><div className="mt-1">{rule.trigger_type ?? 'Règle métier'}</div></div><div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Priorité {priorityLabel(rule.priority)}</span><span>{notifications.filter((item) => item.priority === rule.priority).length} alerte(s)</span></div></CardContent></Card>)}</div></section>
}

function PropertyDrawer({ property, onClose, onCreateOpportunity }: { property: MarketProperty; onClose: () => void; onCreateOpportunity: (property: MarketProperty) => void }) {
  return <div className="fixed inset-0 z-50 bg-slate-950/30 p-4 backdrop-blur-sm" onClick={onClose}><aside className="ml-auto h-full max-w-xl overflow-y-auto rounded-md bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><Badge variant="secondary" className="mb-2">Vue détail</Badge><h2 className="text-2xl font-black tracking-[-0.03em]">{property.title}</h2><p className="mt-1 text-sm text-muted">{property.city} · {property.zipcode}</p></div><Button variant="ghost" onClick={onClose} className="h-8 w-8 rounded-full bg-slate-100 p-0">×</Button></div><div className="mt-6 grid grid-cols-2 gap-3"><Detail label="Prix" value={currency(property.price)} /><Detail label="Prix/m²" value={number(property.price_per_m2) + ' €'} /><Detail label="Surface" value={number(property.surface) + ' m²'} /><Detail label="Terrain" value={number(property.land_surface) + ' m²'} /><Detail label="DPE" value={property.dpe ?? '—'} /><Detail label="Jours en ligne" value={property.days_online != null ? String(property.days_online) : '—'} /></div><Card className="mt-6 border-[#bce9f7] bg-[#e8f8fd]"><CardContent className="p-5"><h3 className="font-black text-[#006d92]">Lecture métier</h3><p className="mt-2 text-sm leading-6 text-slate-700">{property.recommended_action}</p><div className="mt-3 flex flex-wrap gap-2">{(property.tags ?? []).map((tag) => <Badge key={tag} variant="secondary" className="bg-white text-slate-700">{tag}</Badge>)}</div></CardContent></Card><div className="mt-6 flex flex-wrap gap-2"><Button onClick={() => void onCreateOpportunity(property)} className="rounded-md bg-[#006d92] text-white hover:bg-[#00577c]">Créer une opportunité</Button>{property.url && property.url !== '#' ? <Button asChild variant="secondary" className="rounded-md bg-slate-900 text-white hover:opacity-90"><a href={property.url} target="_blank" rel="noreferrer">Ouvrir l’annonce</a></Button> : null}</div></aside></div>
}

function Detail({ label, value }: { label: string; value: string }) {
  return <Card className="bg-slate-50 shadow-none"><CardContent className="p-4"><div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-lg font-black text-slate-900">{value}</div></CardContent></Card>
}
