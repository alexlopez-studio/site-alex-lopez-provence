'use client'

import { useEffect, useMemo, useState } from 'react'

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

type ViewMode = 'data' | 'kanban' | 'rules'

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

function currency(value?: number | null): string {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
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

export function MarketMvpClient() {
  const [zipcode, setZipcode] = useState('83670')
  const [city, setCity] = useState('')
  const [properties, setProperties] = useState<MarketProperty[]>(sampleProperties)
  const [rules, setRules] = useState<Rule[]>(fallbackRules)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
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
        propertiesRes.json(), rulesRes.json(), notificationsRes.json(), opportunitiesRes.json(),
      ])

      if (propertiesJson.success && Array.isArray(propertiesJson.properties) && propertiesJson.properties.length > 0) {
        setProperties(propertiesJson.properties)
        setStatus('Données persistées chargées')
      }
      if (rulesJson.success && Array.isArray(rulesJson.rules)) setRules(rulesJson.rules)
      if (notificationsJson.success && Array.isArray(notificationsJson.notifications)) setNotifications(notificationsJson.notifications)
      if (opportunitiesJson.success && Array.isArray(opportunitiesJson.opportunities)) setOpportunities(opportunitiesJson.opportunities)
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
      setStatus(`${data.fetched ?? 0} bien(s) synchronisé(s) · ${new Date().toLocaleString('fr-FR')}`)
      await loadPersistedData(zipcode)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Synchronisation non disponible')
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
        <aside className="flex w-[280px] shrink-0 flex-col bg-[#006d92] text-white">
          <div className="px-8 py-8">
            <div className="text-3xl font-black tracking-[-0.04em]">Mandat OS</div>
            <div className="mt-2 text-sm text-sky-100">Base Marché</div>
            <button onClick={() => setView('data')} className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#12b8e8] text-sm font-black text-[#00384f] shadow-sm transition hover:bg-[#28c7f3]">
              <span className="text-xl">＋</span> New Mandate
            </button>
          </div>

          <nav className="mt-4 space-y-1 px-4 text-base font-bold text-sky-100">
            <SidebarItem icon="▦" label="Dashboard" active={false} onClick={() => setView('data')} />
            <SidebarItem icon="▣" label="Portfolio" active={false} onClick={() => setView('data')} />
            <SidebarItem icon="⌁" label="Market Data" active={view === 'data'} onClick={() => setView('data')} />
            <SidebarItem icon="▤" label="Mandates" active={view === 'kanban'} onClick={() => setView('kanban')} />
            <SidebarItem icon="☷" label="Tasks" active={view === 'rules'} onClick={() => setView('rules')} />
            <SidebarItem icon="⚙" label="Settings" active={false} onClick={() => setView('rules')} />
          </nav>

          <div className="mt-auto border-t border-white/15 px-8 py-8 text-sm font-semibold text-sky-100">
            <div className="mb-4 flex items-center gap-3">ⓘ Help</div>
            <div className="flex items-center gap-3">↪ Logout</div>
          </div>
        </aside>

        <aside className="w-[330px] shrink-0 border-r border-slate-200 bg-white">
          <div className="flex h-[64px] items-center border-b border-slate-200 px-6 text-xl font-black text-[#00577c]">Market Data</div>
          <div className="h-[calc(100vh-64px)] overflow-y-auto px-4 py-5">
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-[#0b8ebd]" placeholder="Rechercher une commune, une adresse" />
            </div>

            <FilterSection title="FILTRES RAPIDES">
              <div className="flex flex-wrap gap-2">
                {['Nouveauté', 'Baisse de prix', 'Plus de 90 jours', 'DPE F/G', 'Opportunités', 'À relancer'].map((filter) => (
                  <button key={filter} onClick={() => setQuickFilter(quickFilter === filter ? 'Toutes' : filter)} className={(quickFilter === filter ? 'border-[#16a6d9] bg-[#e8f8fd] text-[#0078a6]' : filter === 'DPE F/G' || filter === 'À relancer' ? 'border-red-200 bg-red-50 text-red-600' : 'border-slate-300 bg-white text-slate-600') + ' rounded-full border px-3 py-1.5 text-xs font-bold'}>{filter}</button>
                ))}
              </div>
            </FilterSection>

            <FilterSection title="⌖ Localisation">
              <div className="grid grid-cols-2 gap-3">
                <Field label="CP" value={zipcode} onChange={setZipcode} placeholder="Ex: 83670" />
                <Field label="Commune" value={city} onChange={setCity} placeholder="Ex: Barjols" />
              </div>
            </FilterSection>

            <FilterSection title="⌂ Critères principaux">
              <label className="text-xs font-bold text-slate-600">Type de bien</label>
              <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className="mt-1 h-10 w-full border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-[#0b8ebd]">
                {['Tous les types', 'Maison', 'Villa', 'Appartement', 'Studio', 'Terrain', 'Loft'].map((value) => <option key={value}>{value}</option>)}
              </select>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Field label="Prix Min (€)" value={minPrice} onChange={setMinPrice} placeholder="Min" />
                <Field label="Prix Max (€)" value={maxPrice} onChange={setMaxPrice} placeholder="Max" />
                <Field label="Surface (m²)" value={minSurface} onChange={setMinSurface} placeholder="Min" />
                <Field label="" value={maxSurface} onChange={setMaxSurface} placeholder="Max" />
              </div>
              <div className="mt-3">
                <div className="mb-1 text-xs font-bold text-slate-600">Pièces</div>
                <div className="grid grid-cols-5 gap-2">
                  {['1', '2', '3', '4', '5+'].map((value) => <button key={value} onClick={() => setRoom(room === value ? '' : value)} className={(room === value ? 'border-[#0b8ebd] bg-[#e8f8fd] text-[#006d92]' : 'border-slate-300 bg-white text-slate-700') + ' h-9 border text-sm font-bold'}>{value}</button>)}
                </div>
              </div>
            </FilterSection>

            <FilterSection title="☷ Critères avancés">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">DPE</label>
                  <select value={dpe} onChange={(event) => setDpe(event.target.value)} className="mt-1 h-10 w-full border border-slate-300 px-3 text-sm outline-none focus:border-[#0b8ebd]">
                    {['Tous', 'A', 'B', 'C', 'D', 'E', 'F', 'G'].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Statut</label>
                  <select value={quickFilter} onChange={(event) => setQuickFilter(event.target.value)} className="mt-1 h-10 w-full border border-slate-300 px-3 text-sm outline-none focus:border-[#0b8ebd]">
                    {['Toutes', 'Nouveauté', 'Baisse de prix', 'Plus de 90 jours', 'Opportunités'].map((value) => <option key={value}>{value}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Source</label>
                  <select className="mt-1 h-10 w-full border border-slate-300 px-3 text-sm outline-none focus:border-[#0b8ebd]">
                    <option>Toutes sources</option>
                    <option>Stream Estate</option>
                  </select>
                </div>
                <Field label="Score Mandat" value="" onChange={() => undefined} placeholder="Min %" />
              </div>
            </FilterSection>

            <button onClick={() => void loadPersistedData(zipcode)} className="mt-4 flex h-12 w-full items-center justify-center gap-3 bg-[#006d92] px-4 text-base font-black text-white hover:bg-[#00577c]">
              Appliquer les filtres <span className="rounded-full bg-white/20 px-2 py-1 text-xs">{filtered.length} résultats</span>
            </button>
            <button onClick={() => { setQuickFilter('Toutes'); setQuery(''); setMinPrice(''); setMaxPrice(''); setMinSurface(''); setMaxSurface(''); setRoom(''); setDpe('Tous'); setCity('') }} className="mt-3 w-full text-center text-xs font-black text-[#006d92]">Réinitialiser</button>
          </div>
        </aside>

        <main className="min-w-0 flex-1 bg-white">
          <div className="flex h-[64px] items-center justify-end gap-6 border-b border-slate-200 px-8 text-xl text-slate-700">
            <button title="Notifications">♧</button>
            <button title="Applications">▦</button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50" title="Compte">☻</button>
          </div>

          {view === 'data' ? (
            <section className="p-6">
              <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="text-3xl font-black tracking-[-0.04em] text-slate-950">Base de données globale</h1>
                  <p className="mt-1 text-sm text-slate-500">Vue filtrée des opportunités sur le marché actuel. {loading ? 'Chargement...' : status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => void syncStreamEstate()} disabled={syncing} className="border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50 disabled:opacity-60">↧ {syncing ? 'Sync...' : 'Synchroniser'}</button>
                  <button className="border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50">↥ Exporter</button>
                  <button className="border border-slate-300 bg-white px-4 py-2 text-xs font-black uppercase tracking-wide text-slate-700 hover:bg-slate-50">▥ Colonnes</button>
                </div>
              </div>

              <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[860px] text-left text-sm">
                    <thead className="border-b border-slate-200 bg-[#f3f3ef] text-xs font-black uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="w-12 px-4 py-3"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" /></th>
                        <th className="px-4 py-3">Référence / Adresse</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3 text-right">Prix</th>
                        <th className="px-4 py-3 text-right">Surface</th>
                        <th className="px-4 py-3 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filtered.map((property) => (
                        <tr key={property.id} className="hover:bg-slate-50">
                          <td className="px-4 py-4"><input type="checkbox" className="h-4 w-4 rounded border-slate-300" /></td>
                          <td className="px-4 py-4">
                            <button onClick={() => setSelected(property)} className="font-black text-[#0075a3] hover:underline">{reference(property)}</button>
                            <div className="mt-1 text-xs text-slate-500">{property.title ?? 'Bien sans titre'}, {property.city ?? '—'} {property.zipcode ?? ''}</div>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {(property.tags ?? []).slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">{tag}</span>)}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-semibold text-slate-700">{propertyTypeLabel(property)}</td>
                          <td className="px-4 py-4 text-right font-black text-slate-900">
                            {currency(property.price)}
                            {property.price_variation_percent != null ? <div className="text-xs font-black text-red-500">↘ {property.price_variation_percent}%</div> : null}
                          </td>
                          <td className="px-4 py-4 text-right font-semibold text-slate-700">{number(property.surface)} m²</td>
                          <td className="px-4 py-4 text-right"><span className="font-black text-[#006d92]">{property.opportunity_score ?? 0}</span><span className="text-slate-400">/100</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 px-4 py-4 text-sm text-slate-500">
                  <span>Affichage 1-{filtered.length} sur {properties.length} résultats</span>
                  <div className="flex items-center gap-2">
                    <button className="h-9 w-9 rounded border border-slate-300 text-slate-400">‹</button>
                    <button className="h-9 w-9 rounded bg-[#006d92] font-black text-white">1</button>
                    <button className="h-9 w-9 rounded text-slate-600">2</button>
                    <button className="h-9 w-9 rounded text-slate-600">3</button>
                    <span>...</span>
                    <button className="h-9 w-9 rounded border border-slate-300 text-slate-600">›</button>
                  </div>
                </div>
              </div>
            </section>
          ) : null}

          {view === 'kanban' ? <Kanban opportunities={opportunities} onMove={updateOpportunityStage} /> : null}
          {view === 'rules' ? <Rules rules={rules} notifications={notifications} onToggle={toggleRule} /> : null}
        </main>
      </div>

      {selected ? <PropertyDrawer property={selected} onClose={() => setSelected(null)} onCreateOpportunity={createOpportunity} /> : null}
    </div>
  )
}

function SidebarItem({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return <button onClick={onClick} className={(active ? 'bg-[#0a83ad] text-white shadow-[inset_4px_0_0_#15c8f5]' : 'hover:bg-white/10') + ' flex w-full items-center gap-4 px-4 py-4 text-left transition'}><span className="w-5 text-center text-xl">{icon}</span><span>{label}</span></button>
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="mt-6 border-t border-slate-200 pt-5"><h2 className="mb-3 text-sm font-black text-slate-800">{title}</h2>{children}</section>
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div><label className="text-xs font-bold text-slate-600">{label || '\u00A0'}</label><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-1 h-10 w-full border border-slate-300 px-3 text-sm outline-none focus:border-[#0b8ebd]" /></div>
}

function Kanban({ opportunities, onMove }: { opportunities: Opportunity[]; onMove: (id: string, stage: string) => void }) {
  return <section className="p-6"><h1 className="mb-5 text-3xl font-black tracking-[-0.04em] text-slate-950">Pipeline d’opportunités</h1><div className="grid gap-4 xl:grid-cols-6">{stages.map((stage) => <div key={stage} className="min-h-[28rem] rounded-md border border-slate-200 bg-[#f7fafc] p-4"><h2 className="text-sm font-black text-slate-900">{stage}</h2><div className="mt-4 space-y-3">{opportunities.filter((item) => item.stage === stage).map((item) => <div key={item.id} className="rounded-md border border-slate-200 bg-white p-3 shadow-sm"><div className="font-black text-slate-900">{item.title}</div><div className="mt-2 rounded bg-slate-50 p-2 text-xs text-slate-600">{item.signal_type ?? item.description}</div><select value={item.stage} onChange={(event) => void onMove(item.id, event.target.value)} className="mt-3 w-full border border-slate-300 bg-white p-2 text-xs font-bold">{stages.map((value) => <option key={value} value={value}>{value}</option>)}</select></div>)}{opportunities.filter((item) => item.stage === stage).length === 0 ? <div className="rounded border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">Aucune opportunité</div> : null}</div></div>)}</div></section>
}

function Rules({ rules, notifications, onToggle }: { rules: Rule[]; notifications: Notification[]; onToggle: (rule: Rule) => void }) {
  return <section className="p-6"><h1 className="mb-5 text-3xl font-black tracking-[-0.04em] text-slate-950">Règles de gestion</h1><div className="grid gap-4 lg:grid-cols-2">{rules.map((rule) => <article key={rule.id} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-black tracking-[-0.02em]">{rule.name}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{rule.description}</p></div><button onClick={() => void onToggle(rule)} className={(rule.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500') + ' rounded-full px-3 py-1 text-xs font-black'}>{rule.active ? 'Active' : 'Inactive'}</button></div><div className="mt-4 rounded bg-slate-50 p-4 text-sm text-slate-600"><div className="font-bold text-slate-900">Déclencheur</div><div className="mt-1">{rule.trigger_type ?? 'Règle métier'}</div></div><div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>Priorité {priorityLabel(rule.priority)}</span><span>{notifications.filter((item) => item.priority === rule.priority).length} alerte(s)</span></div></article>)}</div></section>
}

function PropertyDrawer({ property, onClose, onCreateOpportunity }: { property: MarketProperty; onClose: () => void; onCreateOpportunity: (property: MarketProperty) => void }) {
  return <div className="fixed inset-0 z-50 bg-slate-950/30 p-4 backdrop-blur-sm" onClick={onClose}><aside className="ml-auto h-full max-w-xl overflow-y-auto rounded-md bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-4"><div><div className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Vue détail</div><h2 className="text-2xl font-black tracking-[-0.03em]">{property.title}</h2><p className="mt-1 text-sm text-slate-500">{property.city} · {property.zipcode}</p></div><button onClick={onClose} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black">×</button></div><div className="mt-6 grid grid-cols-2 gap-3"><Detail label="Prix" value={currency(property.price)} /><Detail label="Prix/m²" value={number(property.price_per_m2) + ' €'} /><Detail label="Surface" value={number(property.surface) + ' m²'} /><Detail label="Terrain" value={number(property.land_surface) + ' m²'} /><Detail label="DPE" value={property.dpe ?? '—'} /><Detail label="Jours en ligne" value={property.days_online != null ? String(property.days_online) : '—'} /></div><div className="mt-6 rounded-md bg-[#e8f8fd] p-5"><h3 className="font-black text-[#006d92]">Lecture métier</h3><p className="mt-2 text-sm leading-6 text-slate-700">{property.recommended_action}</p><div className="mt-3 flex flex-wrap gap-2">{(property.tags ?? []).map((tag) => <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">{tag}</span>)}</div></div><div className="mt-6 flex flex-wrap gap-2"><button onClick={() => void onCreateOpportunity(property)} className="rounded bg-[#006d92] px-4 py-3 text-sm font-black text-white">Créer une opportunité</button>{property.url && property.url !== '#' ? <a href={property.url} target="_blank" rel="noreferrer" className="rounded bg-slate-900 px-4 py-3 text-sm font-black text-white">Ouvrir l’annonce</a> : null}</div></aside></div>
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded bg-slate-50 p-4"><div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div><div className="mt-1 text-lg font-black text-slate-900">{value}</div></div>
}
