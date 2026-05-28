'use client'

import type { ComponentType, ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  Activity,
  ArrowDownRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Columns3,
  Database,
  FileText,
  Gauge,
  Home,
  Loader2,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  UserCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'
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

function percent(value?: number | null): string {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 }).format(value) + ' %'
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

function averageScore(properties: MarketProperty[]): number {
  if (properties.length === 0) return 0
  return Math.round(properties.reduce((total, property) => total + (property.opportunity_score ?? 0), 0) / properties.length)
}

function highIntentCount(properties: MarketProperty[]): number {
  return properties.filter((property) => (property.opportunity_score ?? 0) >= 70).length
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
    <div className="min-h-screen bg-surface text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <DashboardSidebar view={view} setView={setView} />
        <div className="min-w-0">
          <DashboardHeader status={status} loading={loading} syncing={syncing} onSync={() => void syncStreamEstate()} />
          <main className="space-y-6 p-4 sm:p-6 lg:p-8">
            <HeroSection filtered={filtered} properties={properties} usage={usage} zipcode={zipcode} />
            <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
              <TabsTrigger active={view === 'data'} onClick={() => setView('data')}><Database className="mr-2 h-4 w-4" />Base marché</TabsTrigger>
              <TabsTrigger active={view === 'kanban'} onClick={() => setView('kanban')}><ClipboardList className="mr-2 h-4 w-4" />Pipeline</TabsTrigger>
              <TabsTrigger active={view === 'rules'} onClick={() => setView('rules')}><Settings className="mr-2 h-4 w-4" />Règles</TabsTrigger>
            </TabsList>
            {view === 'data' ? (
              <MarketDataDashboard
                city={city}
                dpe={dpe}
                filtered={filtered}
                maxPrice={maxPrice}
                maxSurface={maxSurface}
                minPrice={minPrice}
                minSurface={minSurface}
                notifications={notifications}
                propertyType={propertyType}
                properties={properties}
                query={query}
                quickFilter={quickFilter}
                room={room}
                rules={rules}
                usage={usage}
                zipcode={zipcode}
                onApply={() => void loadPersistedData(zipcode)}
                onReset={() => { setQuickFilter('Toutes'); setQuery(''); setMinPrice(''); setMaxPrice(''); setMinSurface(''); setMaxSurface(''); setRoom(''); setDpe('Tous'); setCity('') }}
                onSelect={setSelected}
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
            ) : null}
            {view === 'kanban' ? <Kanban opportunities={opportunities} onMove={updateOpportunityStage} /> : null}
            {view === 'rules' ? <Rules rules={rules} notifications={notifications} onToggle={toggleRule} /> : null}
          </main>
        </div>
      </div>
      {selected ? <PropertyDrawer property={selected} onClose={() => setSelected(null)} onCreateOpportunity={createOpportunity} /> : null}
    </div>
  )
}

function DashboardSidebar({ view, setView }: { view: ViewMode; setView: (view: ViewMode) => void }) {
  return (
    <aside className="hidden border-r border-border bg-white lg:block">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-white shadow-sm"><Home className="h-5 w-5" /></div>
        <div>
          <div className="text-sm font-black tracking-tight">Mandat OS</div>
          <div className="text-xs text-muted">Market intelligence</div>
        </div>
      </div>
      <div className="px-4 py-5">
        <Button className="h-10 w-full rounded-md bg-foreground text-white hover:opacity-90"><Plus className="h-4 w-4" />Nouvelle opportunité</Button>
      </div>
      <nav className="space-y-1 px-3">
        <NavItem icon={BarChart3} label="Vue d’ensemble" active={view === 'data'} onClick={() => setView('data')} />
        <NavItem icon={Building2} label="Base marché" active={view === 'data'} onClick={() => setView('data')} />
        <NavItem icon={ClipboardList} label="Pipeline" active={view === 'kanban'} onClick={() => setView('kanban')} />
        <NavItem icon={ShieldCheck} label="Règles & alertes" active={view === 'rules'} onClick={() => setView('rules')} />
        <NavItem icon={Settings} label="Paramètres" active={false} onClick={() => setView('rules')} />
      </nav>
      <div className="absolute bottom-0 w-[280px] border-t border-border p-4">
        <div className="rounded-lg bg-surface p-4">
          <div className="flex items-center gap-2 text-sm font-bold"><Sparkles className="h-4 w-4 text-brand" />Sprint MVP</div>
          <p className="mt-2 text-xs leading-5 text-muted">Dashboard interne non indexé, connecté aux données marché et aux signaux faibles.</p>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: ComponentType<{ className?: string }>; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={cn('flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-foreground', active && 'bg-surface text-foreground shadow-sm')}>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  )
}

function DashboardHeader({ status, loading, syncing, onSync }: { status: string; loading: boolean; syncing: boolean; onSync: () => void }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-xs font-medium text-muted">
          <span>Admin</span><ChevronRight className="h-3 w-3" /><span>Mandat OS</span><ChevronRight className="h-3 w-3" /><span className="text-foreground">Base marché</span>
        </div>
        <div className="mt-1 truncate text-xs text-muted">{loading ? 'Chargement des données...' : status}</div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSync} disabled={syncing} className="rounded-md">
          {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          <span className="hidden sm:inline">Synchroniser</span>
        </Button>
        <Button variant="ghost" size="sm" className="rounded-md px-2"><Bell className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" className="rounded-md px-2"><MoreHorizontal className="h-4 w-4" /></Button>
        <Button variant="ghost" size="sm" className="h-9 w-9 rounded-full border border-border bg-white p-0"><UserCircle className="h-5 w-5" /></Button>
      </div>
    </header>
  )
}

function HeroSection({ filtered, properties, usage, zipcode }: { filtered: MarketProperty[]; properties: MarketProperty[]; usage: UsageStats; zipcode: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={Database} label="Biens filtrés" value={number(filtered.length)} description={`${number(properties.length)} biens en base · CP ${zipcode || '—'}`} />
      <MetricCard icon={Gauge} label="Score moyen" value={`${averageScore(filtered)}/100`} description={`${highIntentCount(filtered)} opportunité(s) à prioriser`} />
      <MetricCard icon={Activity} label="Items ce mois-ci" value={number(usage.itemsMonth)} description={`${usage.successfulSyncsMonth} synchro(s) Stream Estate`} />
      <MetricCard icon={ArrowDownRight} label="Coût estimé" value={currency(usage.costMonthEur, 2)} description={`${currency(usage.unitCostEur, 2)} par item en pay as you go`} highlighted />
    </div>
  )
}

function MetricCard({ icon: Icon, label, value, description, highlighted = false }: { icon: ComponentType<{ className?: string }>; label: string; value: string; description: string; highlighted?: boolean }) {
  return (
    <Card className={cn('overflow-hidden', highlighted && 'border-brand/40 bg-surface-alt')}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription className="text-xs font-bold uppercase tracking-wide">{label}</CardDescription>
        <Icon className={cn('h-4 w-4 text-muted', highlighted && 'text-brand-dark')} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black tracking-tight">{value}</div>
        <p className="mt-1 text-xs text-muted">{description}</p>
      </CardContent>
    </Card>
  )
}

function MarketDataDashboard(props: {
  city: string
  dpe: string
  filtered: MarketProperty[]
  maxPrice: string
  maxSurface: string
  minPrice: string
  minSurface: string
  notifications: Notification[]
  propertyType: string
  properties: MarketProperty[]
  query: string
  quickFilter: string
  room: string
  rules: Rule[]
  usage: UsageStats
  zipcode: string
  onApply: () => void
  onReset: () => void
  onSelect: (property: MarketProperty) => void
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
    <div className="grid gap-6 xl:grid-cols-[320px_1fr_300px]">
      <FilterCard {...props} />
      <MarketTable properties={props.filtered} total={props.properties.length} onSelect={props.onSelect} query={props.query} setQuery={props.setQuery} quickFilter={props.quickFilter} setQuickFilter={props.setQuickFilter} />
      <ActivityPanel notifications={props.notifications} rules={props.rules} usage={props.usage} properties={props.filtered} />
    </div>
  )
}

function FilterCard(props: {
  city: string
  dpe: string
  filtered: MarketProperty[]
  maxPrice: string
  maxSurface: string
  minPrice: string
  minSurface: string
  propertyType: string
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
  setQuickFilter: (value: string) => void
  setRoom: (value: string) => void
  setZipcode: (value: string) => void
}) {
  return (
    <Card className="h-fit xl:sticky xl:top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Filtres marché</CardTitle>
            <CardDescription>{props.filtered.length} résultat(s) dans la vue</CardDescription>
          </div>
          <SlidersHorizontal className="h-4 w-4 text-muted" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <FilterGroup title="Filtres rapides">
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => (
              <Badge as="button" key={filter} onClick={() => props.setQuickFilter(props.quickFilter === filter ? 'Toutes' : filter)} variant={props.quickFilter === filter ? 'default' : filter === 'DPE F/G' || filter === 'À relancer' ? 'destructive' : 'outline'} className="cursor-pointer rounded-md">
                {filter}
              </Badge>
            ))}
          </div>
        </FilterGroup>
        <Separator />
        <FilterGroup title="Localisation">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Code postal" value={props.zipcode} onChange={props.setZipcode} placeholder="83670" />
            <Field label="Commune" value={props.city} onChange={props.setCity} placeholder="Barjols" />
          </div>
        </FilterGroup>
        <FilterGroup title="Bien recherché">
          <FieldSelect label="Type" value={props.propertyType} onChange={props.setPropertyType} values={['Tous les types', 'Maison', 'Villa', 'Appartement', 'Studio', 'Terrain', 'Loft']} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix min" value={props.minPrice} onChange={props.setMinPrice} placeholder="0" />
            <Field label="Prix max" value={props.maxPrice} onChange={props.setMaxPrice} placeholder="500000" />
            <Field label="Surface min" value={props.minSurface} onChange={props.setMinSurface} placeholder="60" />
            <Field label="Surface max" value={props.maxSurface} onChange={props.setMaxSurface} placeholder="180" />
          </div>
        </FilterGroup>
        <FilterGroup title="Signaux faibles">
          <div className="grid grid-cols-2 gap-3">
            <FieldSelect label="DPE" value={props.dpe} onChange={props.setDpe} values={['Tous', 'A', 'B', 'C', 'D', 'E', 'F', 'G']} />
            <FieldSelect label="Statut" value={props.quickFilter} onChange={props.setQuickFilter} values={['Toutes', 'Nouveauté', 'Baisse de prix', 'Plus de 90 jours', 'Opportunités']} />
          </div>
          <div>
            <div className="mb-2 text-xs font-medium text-muted">Pièces minimum</div>
            <div className="grid grid-cols-5 gap-2">
              {['1', '2', '3', '4', '5+'].map((value) => (
                <Button key={value} variant="outline" size="sm" onClick={() => props.setRoom(props.room === value ? '' : value)} className={cn('h-9 rounded-md px-0', props.room === value && 'border-brand bg-surface-alt text-brand-dark')}>
                  {value}
                </Button>
              ))}
            </div>
          </div>
        </FilterGroup>
        <div className="flex gap-2 pt-1">
          <Button onClick={props.onApply} className="flex-1 rounded-md">Appliquer</Button>
          <Button variant="outline" onClick={props.onReset} className="rounded-md">Reset</Button>
        </div>
      </CardContent>
    </Card>
  )
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-3"><h3 className="text-sm font-semibold tracking-tight">{title}</h3>{children}</section>
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="space-y-1.5"><label className="text-xs font-medium text-muted">{label}</label><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="rounded-md" /></div>
}

function FieldSelect({ label, value, onChange, values }: { label: string; value: string; onChange: (value: string) => void; values: string[] }) {
  return <div className="space-y-1.5"><label className="text-xs font-medium text-muted">{label}</label><Select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-md">{values.map((item) => <option key={item} value={item}>{item}</option>)}</Select></div>
}

function MarketTable({ properties, total, onSelect, query, setQuery, quickFilter, setQuickFilter }: { properties: MarketProperty[]; total: number; onSelect: (property: MarketProperty) => void; query: string; setQuery: (value: string) => void; quickFilter: string; setQuickFilter: (value: string) => void }) {
  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>Base de données globale</CardTitle>
            <CardDescription>Vue filtrée des opportunités sur le marché actuel</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="rounded-md"><FileText className="h-4 w-4" />Exporter</Button>
            <Button variant="outline" size="sm" className="rounded-md"><Columns3 className="h-4 w-4" />Colonnes</Button>
          </div>
        </div>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} className="rounded-md pl-9" placeholder="Rechercher référence, ville, source..." />
          </div>
          <TabsList className="justify-start overflow-x-auto">
            {['Toutes', 'Baisse de prix', 'Plus de 90 jours', 'Opportunités'].map((item) => (
              <TabsTrigger key={item} active={quickFilter === item} onClick={() => setQuickFilter(item)}>{item}</TabsTrigger>
            ))}
          </TabsList>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-surface/80">
            <TableRow>
              <TableHead className="w-10"><input type="checkbox" className="h-4 w-4 rounded border-border" /></TableHead>
              <TableHead>Bien</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Signal</TableHead>
              <TableHead className="text-right">Prix</TableHead>
              <TableHead className="text-right">Surface</TableHead>
              <TableHead className="text-right">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id} className="cursor-pointer" onClick={() => onSelect(property)}>
                <TableCell onClick={(event) => event.stopPropagation()}><input type="checkbox" className="h-4 w-4 rounded border-border" /></TableCell>
                <TableCell>
                  <div className="font-semibold text-foreground">{property.title ?? 'Bien sans titre'}</div>
                  <div className="mt-1 text-xs text-muted">{reference(property)} · {property.city ?? '—'} {property.zipcode ?? ''}</div>
                </TableCell>
                <TableCell><Badge variant="secondary" className="rounded-md">{propertyTypeLabel(property)}</Badge></TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(property.tags ?? [statusLabel(property)]).slice(0, 2).map((tag) => <Badge key={tag} variant={tag.includes('Baisse') || tag.includes('DPE') ? 'destructive' : 'outline'} className="rounded-md text-[11px]">{tag}</Badge>)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-semibold">{currency(property.price)}</div>
                  {property.price_variation_percent != null ? <div className="text-xs font-semibold text-accent"><TrendingDown className="mr-1 inline h-3 w-3" />{percent(property.price_variation_percent)}</div> : null}
                </TableCell>
                <TableCell className="text-right text-sm text-muted">{number(property.surface)} m²</TableCell>
                <TableCell className="text-right"><ScoreBadge score={property.opportunity_score ?? 0} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm text-muted">
          <span>Affichage 1-{properties.length} sur {total}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8 w-8 rounded-md px-0">‹</Button>
            <Button size="sm" className="h-8 w-8 rounded-md px-0">1</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md px-0">2</Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 rounded-md px-0">3</Button>
            <Button variant="outline" size="sm" className="h-8 w-8 rounded-md px-0">›</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ScoreBadge({ score }: { score: number }) {
  return <span className={cn('inline-flex h-8 min-w-14 items-center justify-center rounded-md px-2 text-sm font-black', score >= 70 ? 'bg-emerald-50 text-emerald-700' : score >= 40 ? 'bg-amber-50 text-amber-700' : 'bg-surface text-muted')}>{score}/100</span>
}

function ActivityPanel({ notifications, rules, usage, properties }: { notifications: Notification[]; rules: Rule[]; usage: UsageStats; properties: MarketProperty[] }) {
  const latestSignals = properties.slice(0, 4)
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Observabilité API</CardTitle>
          <CardDescription>Consommation Stream Estate</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <UsageLine label="Aujourd’hui" value={number(usage.itemsToday)} sub={currency(usage.costTodayEur, 2)} />
          <UsageLine label="Ce mois-ci" value={number(usage.itemsMonth)} sub={currency(usage.costMonthEur, 2)} />
          <UsageLine label="Dernière sync" value={formatDateTime(usage.lastSyncAt)} sub={`${usage.successfulSyncsMonth} réussite(s)`} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Signaux faibles</CardTitle>
          <CardDescription>{rules.filter((rule) => rule.active).length} règle(s) active(s)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {latestSignals.map((property) => (
            <div key={property.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between gap-3">
                <div className="truncate text-sm font-semibold">{property.city ?? '—'}</div>
                <ScoreBadge score={property.opportunity_score ?? 0} />
              </div>
              <div className="mt-1 line-clamp-2 text-xs text-muted">{property.title}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alertes</CardTitle>
          <CardDescription>{notifications.length} notification(s)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.slice(0, 3).map((notification) => <div key={notification.id} className="text-sm"><div className="font-semibold">{notification.title}</div><div className="text-xs text-muted">{notification.message}</div></div>)}
          {notifications.length === 0 ? <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted">Aucune alerte pour le moment</div> : null}
        </CardContent>
      </Card>
    </div>
  )
}

function UsageLine({ label, value, sub }: { label: string; value: string; sub: string }) {
  return <div className="flex items-center justify-between gap-3"><div><div className="text-sm font-medium">{label}</div><div className="text-xs text-muted">{sub}</div></div><div className="text-sm font-black">{value}</div></div>
}

function Kanban({ opportunities, onMove }: { opportunities: Opportunity[]; onMove: (id: string, stage: string) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Pipeline d’opportunités</h1>
        <p className="text-sm text-muted">Suivi simple des opportunités issues de la base marché.</p>
      </div>
      <div className="grid gap-4 xl:grid-cols-6">
        {stages.map((stage) => (
          <Card key={stage} className="min-h-[28rem] bg-white/70">
            <CardHeader className="pb-3"><CardTitle className="text-sm">{stage}</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {opportunities.filter((item) => item.stage === stage).map((item) => (
                <Card key={item.id} className="shadow-none">
                  <CardContent className="p-3">
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-2 rounded-md bg-surface p-2 text-xs text-muted">{item.signal_type ?? item.description}</div>
                    <Select value={item.stage} onChange={(event) => void onMove(item.id, event.target.value)} className="mt-3 text-xs font-medium">{stages.map((value) => <option key={value} value={value}>{value}</option>)}</Select>
                  </CardContent>
                </Card>
              ))}
              {opportunities.filter((item) => item.stage === stage).length === 0 ? <div className="rounded-lg border border-dashed border-border p-4 text-center text-xs text-muted">Aucune opportunité</div> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Rules({ rules, notifications, onToggle }: { rules: Rule[]; notifications: Notification[]; onToggle: (rule: Rule) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Règles de gestion</h1>
        <p className="text-sm text-muted">Règles modifiables pour faire remonter les signaux faibles.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {rules.map((rule) => (
          <Card key={rule.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div><CardTitle className="text-base">{rule.name}</CardTitle><CardDescription className="mt-1">{rule.description}</CardDescription></div>
                <Badge as="button" onClick={() => void onToggle(rule)} variant={rule.active ? 'success' : 'secondary'} className="cursor-pointer rounded-md">{rule.active ? 'Active' : 'Inactive'}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-surface p-4 text-sm text-muted"><div className="font-semibold text-foreground">Déclencheur</div><div className="mt-1">{rule.trigger_type ?? 'Règle métier'}</div></div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted"><span>Priorité {priorityLabel(rule.priority)}</span><span>{notifications.filter((item) => item.priority === rule.priority).length} alerte(s)</span></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function PropertyDrawer({ property, onClose, onCreateOpportunity }: { property: MarketProperty; onClose: () => void; onCreateOpportunity: (property: MarketProperty) => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <aside className="ml-auto h-full max-w-xl overflow-y-auto rounded-xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="border-b border-border p-6">
          <div className="flex items-start justify-between gap-4">
            <div><Badge variant="secondary" className="mb-3 rounded-md">Vue détail</Badge><h2 className="text-2xl font-black tracking-tight">{property.title}</h2><p className="mt-1 text-sm text-muted">{property.city} · {property.zipcode}</p></div>
            <Button variant="ghost" onClick={onClose} className="h-8 w-8 rounded-md p-0">×</Button>
          </div>
        </div>
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-3"><Detail label="Prix" value={currency(property.price)} /><Detail label="Prix/m²" value={number(property.price_per_m2) + ' €'} /><Detail label="Surface" value={number(property.surface) + ' m²'} /><Detail label="Terrain" value={number(property.land_surface) + ' m²'} /><Detail label="DPE" value={property.dpe ?? '—'} /><Detail label="Jours en ligne" value={property.days_online != null ? String(property.days_online) : '—'} /></div>
          <Card className="border-brand/30 bg-surface-alt"><CardHeader><CardTitle className="text-base">Lecture métier</CardTitle><CardDescription>{property.recommended_action}</CardDescription></CardHeader><CardContent><div className="flex flex-wrap gap-2">{(property.tags ?? []).map((tag) => <Badge key={tag} variant="secondary" className="rounded-md bg-white text-muted">{tag}</Badge>)}</div></CardContent></Card>
          <div className="flex flex-wrap gap-2"><Button onClick={() => void onCreateOpportunity(property)} className="rounded-md"><CheckCircle2 className="h-4 w-4" />Créer une opportunité</Button>{property.url && property.url !== '#' ? <Button asChild variant="secondary" className="rounded-md"><a href={property.url} target="_blank" rel="noreferrer">Ouvrir l’annonce</a></Button> : null}</div>
        </div>
      </aside>
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return <Card className="bg-surface shadow-none"><CardContent className="p-4"><div className="text-xs font-medium uppercase tracking-wide text-muted">{label}</div><div className="mt-1 text-lg font-black">{value}</div></CardContent></Card>
}
