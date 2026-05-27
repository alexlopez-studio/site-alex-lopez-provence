'use client'

import { useEffect, useMemo, useState } from 'react'

type Tab = 'database' | 'kanban' | 'rules'
type Priority = 'haute' | 'moyenne' | 'basse'
type OpportunityStage = 'À qualifier' | 'À surveiller' | 'Action à faire' | 'En suivi' | 'Converti' | 'Écarté'

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
  actions_json?: Record<string, unknown>
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
  city?: string | null
  price?: number | null
  signal_type?: string | null
  priority: string
  stage: string
  next_action?: string | null
  note?: string | null
}

const stages: OpportunityStage[] = ['À qualifier', 'À surveiller', 'Action à faire', 'En suivi', 'Converti', 'Écarté']

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
  { id: 'demo-rule-1', name: 'Nouvelle annonce sur la zone', description: 'Tague les annonces nouvelles du code postal surveillé.', active: true, priority: 'low' },
  { id: 'demo-rule-2', name: 'Bien en ligne depuis plus de 90 jours', description: 'Détecte les annonces qui stagnent.', active: true, priority: 'medium' },
  { id: 'demo-rule-3', name: 'DPE F ou G', description: 'Détecte les biens avec performance énergétique faible.', active: true, priority: 'medium' },
  { id: 'demo-rule-4', name: 'Score opportunité élevé', description: 'Crée une opportunité quand plusieurs signaux sont cumulés.', active: true, priority: 'high' },
]

function currency(value?: number | null): string {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

function number(value?: number | null): string {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('fr-FR').format(Math.round(value))
}

function toPriority(value?: string): Priority {
  if (value === 'high' || value === 'haute') return 'haute'
  if (value === 'low' || value === 'basse') return 'basse'
  return 'moyenne'
}

function statusLabel(property: MarketProperty): string {
  if ((property.opportunity_score ?? 0) >= 70) return 'Opportunité'
  if ((property.price_variation_percent ?? 0) <= -5) return 'Prix en baisse'
  if ((property.days_online ?? 0) >= 90) return 'Stagne'
  if ((property.days_online ?? 999) <= 14) return 'Nouveau'
  return property.status === 'active' ? 'Actif' : property.status ?? 'Actif'
}

function statusColor(status: string): string {
  if (status === 'Opportunité') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'Prix en baisse') return 'bg-orange-50 text-orange-700 border-orange-200'
  if (status === 'Stagne') return 'bg-red-50 text-red-700 border-red-200'
  if (status === 'Nouveau') return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-slate-50 text-slate-700 border-slate-200'
}

function priorityColor(priority: Priority): string {
  if (priority === 'haute') return 'bg-red-50 text-red-700 border-red-200'
  if (priority === 'moyenne') return 'bg-orange-50 text-orange-700 border-orange-200'
  return 'bg-slate-50 text-slate-700 border-slate-200'
}

export function MarketMvpClient() {
  const [zipcode, setZipcode] = useState('83670')
  const [properties, setProperties] = useState<MarketProperty[]>(sampleProperties)
  const [rules, setRules] = useState<Rule[]>(fallbackRules)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [selected, setSelected] = useState<MarketProperty | null>(null)
  const [tab, setTab] = useState<Tab>('database')
  const [search, setSearch] = useState('')
  const [quickFilter, setQuickFilter] = useState('Toutes')
  const [syncing, setSyncing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<string>('Données exemple — synchronisation non lancée')

  async function loadPersistedData(currentZipcode = zipcode) {
    setLoading(true)
    try {
      const [propertiesRes, rulesRes, notificationsRes, opportunitiesRes] = await Promise.all([
        fetch('/api/market/properties?zipcode=' + encodeURIComponent(currentZipcode), { cache: 'no-store' }),
        fetch('/api/rules', { cache: 'no-store' }),
        fetch('/api/notifications', { cache: 'no-store' }),
        fetch('/api/opportunities', { cache: 'no-store' }),
      ])

      const [propertiesJson, rulesJson, notificationsJson, opportunitiesJson] = await Promise.all([
        propertiesRes.json(),
        rulesRes.json(),
        notificationsRes.json(),
        opportunitiesRes.json(),
      ])

      if (propertiesJson.success && Array.isArray(propertiesJson.properties) && propertiesJson.properties.length > 0) {
        setProperties(propertiesJson.properties)
        setLastSync('Données persistées chargées')
      }
      if (rulesJson.success && Array.isArray(rulesJson.rules)) setRules(rulesJson.rules)
      if (notificationsJson.success && Array.isArray(notificationsJson.notifications)) setNotifications(notificationsJson.notifications)
      if (opportunitiesJson.success && Array.isArray(opportunitiesJson.opportunities)) setOpportunities(opportunitiesJson.opportunities)
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Base persistée indisponible')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadPersistedData('83670')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return properties.filter((property) => {
      const tags = property.tags ?? []
      const matchesSearch = !query || [property.title, property.city, property.zipcode, property.source]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))

      const matchesQuick = quickFilter === 'Toutes'
        || (quickFilter === 'Nouveautés' && tags.includes('Nouvelle annonce'))
        || (quickFilter === 'Baisses de prix' && tags.includes('Baisse de prix'))
        || (quickFilter === 'Plus de 90 jours' && tags.includes('Plus de 90 jours'))
        || (quickFilter === 'DPE F/G' && tags.includes('DPE faible'))
        || (quickFilter === 'Opportunités' && tags.includes('Opportunité mandat'))
        || (quickFilter === 'Maisons avec terrain' && (property.land_surface ?? 0) >= 500)

      return matchesSearch && matchesQuick
    })
  }, [properties, quickFilter, search])

  const medianPriceM2 = properties.length
    ? Math.round(properties.reduce((sum, property) => sum + (property.price_per_m2 ?? 0), 0) / properties.length)
    : 0

  async function syncStreamEstate() {
    setSyncing(true)
    setSyncError(null)
    try {
      const response = await fetch('/api/market/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zipcode }),
      })
      const data = await response.json()
      if (!response.ok || !data.success) throw new Error(data.error ?? 'Synchronisation impossible')
      if (Array.isArray(data.properties) && data.properties.length > 0) setProperties(data.properties)
      setLastSync(new Date().toLocaleString('fr-FR') + ` · ${data.fetched ?? 0} bien(s) récupéré(s)`)
      await loadPersistedData(zipcode)
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Erreur inconnue')
      setLastSync('Données exemple — synchronisation non disponible')
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
          city: property.city,
          price: property.price,
          signal_type: (property.tags ?? [])[0] ?? 'Signal marché',
          priority: (property.opportunity_score ?? 0) >= 70 ? 'high' : 'medium',
          stage: 'À qualifier',
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

  async function updateOpportunityStage(id: string, stage: OpportunityStage) {
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
      await loadPersistedData(zipcode)
    }
  }

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#0F172A]">
      <header className="border-b border-slate-200 bg-white px-6 py-5">
        <div className="mx-auto flex max-w-[88rem] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-bold text-[#006390]">Outil interne non indexé · /admin/base-marche</div>
            <h1 className="text-3xl font-black tracking-[-0.04em]">Base marché — {zipcode}</h1>
            <p className="mt-1 text-sm text-slate-500">Base de données immobilière, règles de gestion et pipeline d’opportunités.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input value={zipcode} onChange={(event) => setZipcode(event.target.value)} className="h-11 w-28 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#00b4ec]" aria-label="Code postal surveillé" />
            <button onClick={() => void loadPersistedData(zipcode)} className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700">Charger</button>
            <button onClick={() => void syncStreamEstate()} disabled={syncing} className="h-11 rounded-xl bg-[#00b4ec] px-4 text-sm font-black text-white transition hover:bg-[#008EC3] disabled:cursor-wait disabled:opacity-60">{syncing ? 'Synchronisation...' : 'Synchroniser'}</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[88rem] px-6 py-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Kpi label="Annonces" value={String(properties.length)} />
          <Kpi label="Nouveautés" value={String(properties.filter((item) => item.tags?.includes('Nouvelle annonce')).length)} />
          <Kpi label="Baisses" value={String(properties.filter((item) => item.tags?.includes('Baisse de prix')).length)} />
          <Kpi label="+90 jours" value={String(properties.filter((item) => item.tags?.includes('Plus de 90 jours')).length)} />
          <Kpi label="Prix/m² moyen" value={number(medianPriceM2) + ' €'} />
          <Kpi label="Alertes" value={String(notifications.length)} accent />
        </section>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          État : <span className="font-bold text-slate-900">{loading ? 'Chargement...' : lastSync}</span>
          {syncError ? <span className="ml-3 font-semibold text-orange-700">{syncError}. Données exemple disponibles si besoin.</span> : null}
        </div>

        <nav className="mt-6 flex flex-wrap gap-2">
          <TabButton active={tab === 'database'} onClick={() => setTab('database')}>Base de données</TabButton>
          <TabButton active={tab === 'kanban'} onClick={() => setTab('kanban')}>Kanban opportunités</TabButton>
          <TabButton active={tab === 'rules'} onClick={() => setTab('rules')}>Règles de gestion</TabButton>
        </nav>

        {tab === 'database' ? (
          <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_24rem]">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 p-4">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher une commune, une annonce, une source..." className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#00b4ec] lg:max-w-md" />
                  <div className="flex flex-wrap gap-2">
                    {['Toutes', 'Nouveautés', 'Baisses de prix', 'Plus de 90 jours', 'DPE F/G', 'Maisons avec terrain', 'Opportunités'].map((filter) => (
                      <button key={filter} onClick={() => setQuickFilter(filter)} className={(quickFilter === filter ? 'bg-[#006390] text-white' : 'bg-slate-50 text-slate-700 hover:bg-slate-100') + ' rounded-full px-3 py-2 text-xs font-bold'}>{filter}</button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-[1180px] w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr><th className="px-4 py-3">Statut</th><th className="px-4 py-3">Bien</th><th className="px-4 py-3">Commune</th><th className="px-4 py-3">Prix</th><th className="px-4 py-3">Surface</th><th className="px-4 py-3">Prix/m²</th><th className="px-4 py-3">Terrain</th><th className="px-4 py-3">DPE</th><th className="px-4 py-3">Jours</th><th className="px-4 py-3">Variation</th><th className="px-4 py-3">Score</th><th className="px-4 py-3">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((property) => {
                      const status = statusLabel(property)
                      return (
                        <tr key={property.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3"><span className={'inline-flex rounded-full border px-2 py-1 text-xs font-bold ' + statusColor(status)}>{status}</span></td>
                          <td className="px-4 py-3"><button onClick={() => setSelected(property)} className="max-w-[260px] text-left font-bold text-slate-900 hover:text-[#006390]">{property.title ?? 'Bien sans titre'}</button><div className="mt-1 flex flex-wrap gap-1">{(property.tags ?? []).slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{tag}</span>)}</div></td>
                          <td className="px-4 py-3 text-slate-600">{property.city ?? '—'}<br /><span className="text-xs text-slate-400">{property.zipcode ?? zipcode}</span></td>
                          <td className="px-4 py-3 font-bold">{currency(property.price)}</td><td className="px-4 py-3">{number(property.surface)} m²</td><td className="px-4 py-3">{number(property.price_per_m2)} €</td><td className="px-4 py-3">{number(property.land_surface)} m²</td><td className="px-4 py-3"><span className="font-bold">{property.dpe ?? '—'}</span></td><td className="px-4 py-3">{property.days_online ?? '—'}</td><td className="px-4 py-3 font-bold text-orange-700">{property.price_variation_percent != null ? property.price_variation_percent + ' %' : '—'}</td><td className="px-4 py-3"><span className="font-black text-[#006390]">{property.opportunity_score ?? 0}</span>/100</td><td className="px-4 py-3"><button onClick={() => void createOpportunity(property)} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">Créer opportunité</button></td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="space-y-4">
              <Panel title="Notifications" count={notifications.length}>
                <div className="space-y-3">
                  {notifications.slice(0, 8).map((item) => {
                    const property = properties.find((p) => p.id === item.market_property_id)
                    return <button key={item.id} onClick={() => property ? setSelected(property) : null} className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left hover:border-[#00b4ec]"><div className="flex items-center justify-between gap-2"><span className="font-black text-slate-900">{item.title}</span><span className={'rounded-full border px-2 py-0.5 text-[11px] font-bold ' + priorityColor(toPriority(item.priority))}>{toPriority(item.priority)}</span></div><p className="mt-1 text-xs leading-5 text-slate-600">{item.message}</p><p className="mt-1 text-[11px] font-semibold text-slate-400">{new Date(item.created_at).toLocaleDateString('fr-FR')}</p></button>
                  })}
                  {notifications.length === 0 ? <p className="text-sm text-slate-500">Aucune notification persistée pour le moment.</p> : null}
                </div>
              </Panel>
            </aside>
          </section>
        ) : null}

        {tab === 'kanban' ? <Kanban opportunities={opportunities} onMove={updateOpportunityStage} /> : null}
        {tab === 'rules' ? <Rules rules={rules} notifications={notifications} onToggle={toggleRule} /> : null}
      </main>

      {selected ? <PropertyDrawer property={selected} onClose={() => setSelected(null)} onCreateOpportunity={createOpportunity} /> : null}
    </div>
  )
}

function Kanban({ opportunities, onMove }: { opportunities: Opportunity[]; onMove: (id: string, stage: OpportunityStage) => void }) {
  return <section className="mt-6 grid gap-4 xl:grid-cols-6">{stages.map((stage) => <div key={stage} className="min-h-[28rem] rounded-3xl border border-slate-200 bg-white p-4"><h2 className="text-sm font-black text-slate-900">{stage}</h2><div className="mt-4 space-y-3">{opportunities.filter((item) => item.stage === stage).map((item) => <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3"><div className="font-black text-slate-900">{item.title}</div><div className="mt-1 text-xs text-slate-500">{currency(item.price)}</div><div className="mt-2 rounded-xl bg-white p-2 text-xs text-slate-600">{item.signal_type ?? item.description}</div><select value={item.stage} onChange={(event) => void onMove(item.id, event.target.value as OpportunityStage)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold">{stages.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>)}{opportunities.filter((item) => item.stage === stage).length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">Aucune opportunité</div> : null}</div></div>)}</section>
}

function Rules({ rules, notifications, onToggle }: { rules: Rule[]; notifications: Notification[]; onToggle: (rule: Rule) => void }) {
  return <section className="mt-6 grid gap-4 lg:grid-cols-2">{rules.map((rule) => <article key={rule.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-black tracking-[-0.02em]">{rule.name}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{rule.description}</p></div><button onClick={() => void onToggle(rule)} className={(rule.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500') + ' rounded-full px-3 py-1 text-xs font-black'}>{rule.active ? 'Active' : 'Inactive'}</button></div><div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><div className="font-bold text-slate-900">Déclencheur</div><div className="mt-1">{rule.trigger_type ?? 'Règle métier'}</div></div><div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Priorité {toPriority(rule.priority)}</span><span>{notifications.filter((item) => item.priority === rule.priority).length} alerte(s)</span></div></article>)}<article className="rounded-3xl border border-dashed border-slate-300 bg-white p-5"><h2 className="text-lg font-black tracking-[-0.02em]">Créer une règle</h2><p className="mt-2 text-sm leading-6 text-slate-600">Assistant prévu pour la prochaine itération : déclencheur, conditions, actions, nom de règle.</p><button className="mt-4 rounded-xl bg-[#00b4ec] px-4 py-3 text-sm font-black text-white">Préparer l’assistant</button></article></section>
}

function PropertyDrawer({ property, onClose, onCreateOpportunity }: { property: MarketProperty; onClose: () => void; onCreateOpportunity: (property: MarketProperty) => void }) {
  return <div className="fixed inset-0 z-50 bg-slate-950/30 p-4 backdrop-blur-sm" onClick={onClose}><aside className="ml-auto h-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><div className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Vue détail</div><h2 className="text-2xl font-black tracking-[-0.03em]">{property.title}</h2><p className="mt-1 text-sm text-slate-500">{property.city} · {property.zipcode}</p></div><button onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black">×</button></div><div className="mt-6 grid grid-cols-2 gap-3"><Detail label="Prix" value={currency(property.price)} /><Detail label="Prix/m²" value={number(property.price_per_m2) + ' €'} /><Detail label="Surface" value={number(property.surface) + ' m²'} /><Detail label="Terrain" value={number(property.land_surface) + ' m²'} /><Detail label="DPE" value={property.dpe ?? '—'} /><Detail label="Jours en ligne" value={property.days_online != null ? String(property.days_online) : '—'} /></div><div className="mt-6 rounded-3xl bg-[#E9FCFF] p-5"><h3 className="font-black text-[#006390]">Lecture métier</h3><p className="mt-2 text-sm leading-6 text-slate-700">{property.recommended_action}</p><div className="mt-3 flex flex-wrap gap-2">{(property.tags ?? []).map((tag) => <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">{tag}</span>)}</div></div><div className="mt-6 rounded-3xl border border-slate-200 p-5"><h3 className="font-black">Historique de prix</h3><div className="mt-3 text-sm text-slate-600">{property.price_variation_percent != null ? 'Variation détectée : ' + property.price_variation_percent + ' %' : 'Aucune variation détectée.'}</div></div><div className="mt-6 flex flex-wrap gap-2"><button onClick={() => void onCreateOpportunity(property)} className="rounded-xl bg-[#00b4ec] px-4 py-3 text-sm font-black text-white">Créer une opportunité</button>{property.url && property.url !== '#' ? <a href={property.url} target="_blank" rel="noreferrer" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white">Ouvrir l’annonce</a> : null}</div></aside></div>
}

function Kpi({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className={(accent ? 'border-[#00b4ec] bg-[#E9FCFF]' : 'border-slate-200 bg-white') + ' rounded-3xl border p-4 shadow-sm'}><div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">{value}</div></div>
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={(active ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 hover:bg-slate-50') + ' rounded-full border border-slate-200 px-4 py-2 text-sm font-black'}>{children}</button>
}

function Panel({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-4 flex items-center justify-between"><h2 className="font-black tracking-[-0.02em]">{title}</h2><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{count}</span></div>{children}</div>
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-lg font-black text-slate-900">{value}</div></div>
}
