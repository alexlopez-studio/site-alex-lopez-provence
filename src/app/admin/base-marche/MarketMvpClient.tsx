'use client'

import { useMemo, useState } from 'react'

type Tab = 'database' | 'kanban' | 'rules'
type Priority = 'haute' | 'moyenne' | 'basse'
type OpportunityStage = 'À qualifier' | 'À surveiller' | 'Action à faire' | 'En suivi' | 'Converti' | 'Écarté'

type ApiProperty = {
  id: string
  title?: string
  description?: string
  city?: string
  insee?: string
  zipcode?: string
  price?: number
  pricePerMeter?: number
  surface?: number
  landSurface?: number
  room?: number
  bedroom?: number
  propertyType?: number
  energyCategory?: string
  greenHouseGasCategory?: string
  lat?: number
  lon?: number
  url?: string
  source?: string
  updatedAt?: string
  createdAt?: string
}

type MarketProperty = ApiProperty & {
  status: 'Nouveau' | 'Actif' | 'Prix en baisse' | 'À surveiller' | 'Opportunité' | 'Stagne' | 'Expiré' | 'Ignoré'
  tags: string[]
  daysOnline: number | null
  variationPercent: number | null
  opportunityScore: number
  recommendedAction: string
  note?: string
}

type Rule = {
  id: string
  name: string
  description: string
  active: boolean
  priority: Priority
  action: string
}

type Notification = {
  id: string
  title: string
  message: string
  priority: Priority
  propertyId: string
  ruleName: string
  createdAt: string
  status: 'Non lue' | 'Lue' | 'Traitée'
}

type Opportunity = {
  id: string
  propertyId: string
  title: string
  city: string
  price?: number
  signal: string
  priority: Priority
  stage: OpportunityStage
  nextAction: string
  note?: string
}

const stages: OpportunityStage[] = ['À qualifier', 'À surveiller', 'Action à faire', 'En suivi', 'Converti', 'Écarté']

const initialRules: Rule[] = [
  {
    id: 'new-listing',
    name: 'Nouvelle annonce sur la zone',
    description: 'Tague les annonces récentes du code postal surveillé.',
    active: true,
    priority: 'basse',
    action: 'Créer une notification et taguer Nouvelle annonce.',
  },
  {
    id: 'stale-90',
    name: 'Bien en ligne depuis plus de 90 jours',
    description: 'Détecte les annonces qui stagnent et peuvent indiquer un prix trop haut.',
    active: true,
    priority: 'moyenne',
    action: 'Taguer Plus de 90 jours et proposer une veille commerciale.',
  },
  {
    id: 'dpe-fg',
    name: 'DPE F ou G',
    description: 'Détecte les biens avec performance énergétique faible.',
    active: true,
    priority: 'moyenne',
    action: 'Taguer DPE faible et signaler un levier de négociation.',
  },
  {
    id: 'land-500',
    name: 'Maison avec terrain supérieur à 500 m²',
    description: 'Repère les maisons avec un terrain intéressant sur le secteur.',
    active: true,
    priority: 'basse',
    action: 'Taguer Terrain intéressant.',
  },
  {
    id: 'opportunity-score',
    name: 'Score opportunité élevé',
    description: 'Fait ressortir les biens cumulant plusieurs signaux utiles.',
    active: true,
    priority: 'haute',
    action: 'Créer une opportunité dans le kanban.',
  },
]

const sampleProperties: ApiProperty[] = [
  {
    id: 'demo-1',
    title: 'Maison de village avec terrasse',
    city: 'Pontevès',
    zipcode: '83670',
    price: 226000,
    pricePerMeter: 2260,
    surface: 100,
    landSurface: 68,
    room: 4,
    bedroom: 3,
    propertyType: 1,
    energyCategory: 'D',
    source: 'Donnée exemple',
    createdAt: daysAgoIso(118),
    updatedAt: daysAgoIso(3),
    url: '#',
  },
  {
    id: 'demo-2',
    title: 'Villa avec terrain et garage',
    city: 'Barjols',
    zipcode: '83670',
    price: 369000,
    pricePerMeter: 3075,
    surface: 120,
    landSurface: 740,
    room: 5,
    bedroom: 4,
    propertyType: 1,
    energyCategory: 'C',
    source: 'Donnée exemple',
    createdAt: daysAgoIso(21),
    updatedAt: daysAgoIso(1),
    url: '#',
  },
  {
    id: 'demo-3',
    title: 'Maison à rénover proche centre',
    city: 'Tavernes',
    zipcode: '83670',
    price: 185000,
    pricePerMeter: 2055,
    surface: 90,
    landSurface: 240,
    room: 4,
    bedroom: 2,
    propertyType: 1,
    energyCategory: 'F',
    source: 'Donnée exemple',
    createdAt: daysAgoIso(156),
    updatedAt: daysAgoIso(9),
    url: '#',
  },
  {
    id: 'demo-4',
    title: 'Maison familiale avec piscine',
    city: 'Varages',
    zipcode: '83670',
    price: 445000,
    pricePerMeter: 3296,
    surface: 135,
    landSurface: 980,
    room: 6,
    bedroom: 4,
    propertyType: 1,
    energyCategory: 'B',
    source: 'Donnée exemple',
    createdAt: daysAgoIso(7),
    updatedAt: daysAgoIso(2),
    url: '#',
  },
]

function daysAgoIso(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString()
}

function currency(value?: number): string {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

function number(value?: number): string {
  if (typeof value !== 'number') return '—'
  return new Intl.NumberFormat('fr-FR').format(Math.round(value))
}

function daysOnline(createdAt?: string): number | null {
  if (!createdAt) return null
  const created = new Date(createdAt).getTime()
  if (!Number.isFinite(created)) return null
  return Math.max(0, Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24)))
}

function enrichProperty(property: ApiProperty, index: number): MarketProperty {
  const days = daysOnline(property.createdAt)
  const variation = index === 0 ? -7.8 : index === 2 ? -11.2 : null
  const tags: string[] = []

  if (days != null && days <= 14) tags.push('Nouvelle annonce')
  if (days != null && days > 90) tags.push('Plus de 90 jours')
  if (variation != null && variation <= -5) tags.push('Baisse de prix')
  if (variation != null && variation <= -10) tags.push('Forte baisse')
  if (property.energyCategory === 'F' || property.energyCategory === 'G') tags.push('DPE faible')
  if ((property.landSurface ?? 0) >= 500) tags.push('Terrain intéressant')

  const score = Math.min(100, 20 + tags.length * 15 + (variation != null && variation <= -5 ? 20 : 0))
  if (score >= 70) tags.push('Opportunité mandat')

  let status: MarketProperty['status'] = 'Actif'
  if (variation != null && variation <= -5) status = 'Prix en baisse'
  if (days != null && days > 90) status = 'Stagne'
  if (score >= 70) status = 'Opportunité'
  if (days != null && days <= 14) status = 'Nouveau'

  return {
    ...property,
    status,
    tags,
    daysOnline: days,
    variationPercent: variation,
    opportunityScore: score,
    recommendedAction: score >= 70
      ? 'Créer une opportunité et préparer une lecture marché.'
      : tags.includes('Plus de 90 jours')
        ? 'Surveiller la durée de publication et la prochaine variation.'
        : 'Conserver dans la veille marché.',
  }
}

function statusColor(status: MarketProperty['status']): string {
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
  const [rawProperties, setRawProperties] = useState<ApiProperty[]>(sampleProperties)
  const [selected, setSelected] = useState<MarketProperty | null>(null)
  const [tab, setTab] = useState<Tab>('database')
  const [search, setSearch] = useState('')
  const [quickFilter, setQuickFilter] = useState('Toutes')
  const [rules, setRules] = useState<Rule[]>(initialRules)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState<string | null>(null)
  const [lastSync, setLastSync] = useState<string>('Données exemple — synchronisation non lancée')
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])

  const properties = useMemo(
    () => rawProperties.map(enrichProperty),
    [rawProperties],
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return properties.filter((property) => {
      const matchesSearch = !query || [property.title, property.city, property.zipcode, property.source]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query))

      const matchesQuick = quickFilter === 'Toutes'
        || (quickFilter === 'Nouveautés' && property.tags.includes('Nouvelle annonce'))
        || (quickFilter === 'Baisses de prix' && property.tags.includes('Baisse de prix'))
        || (quickFilter === 'Plus de 90 jours' && property.tags.includes('Plus de 90 jours'))
        || (quickFilter === 'DPE F/G' && property.tags.includes('DPE faible'))
        || (quickFilter === 'Opportunités' && property.tags.includes('Opportunité mandat'))
        || (quickFilter === 'Maisons avec terrain' && (property.landSurface ?? 0) >= 500)

      return matchesSearch && matchesQuick
    })
  }, [properties, quickFilter, search])

  const notifications = useMemo<Notification[]>(() => {
    const activeRules = rules.filter((rule) => rule.active)
    const list: Notification[] = []

    for (const property of properties) {
      if (activeRules.some((rule) => rule.id === 'new-listing') && property.tags.includes('Nouvelle annonce')) {
        list.push(notification(property, 'Nouvelle annonce', 'Un nouveau bien est apparu sur le code postal surveillé.', 'basse', 'Nouvelle annonce sur la zone'))
      }
      if (activeRules.some((rule) => rule.id === 'stale-90') && property.tags.includes('Plus de 90 jours')) {
        list.push(notification(property, 'Bien stagnant', `Annonce en ligne depuis ${property.daysOnline ?? 0} jours.`, 'moyenne', 'Bien en ligne depuis plus de 90 jours'))
      }
      if (activeRules.some((rule) => rule.id === 'dpe-fg') && property.tags.includes('DPE faible')) {
        list.push(notification(property, 'DPE faible', 'DPE F/G détecté : possible levier de négociation.', 'moyenne', 'DPE F ou G'))
      }
      if (activeRules.some((rule) => rule.id === 'opportunity-score') && property.opportunityScore >= 70) {
        list.push(notification(property, 'Opportunité détectée', 'Plusieurs signaux indiquent une opportunité à qualifier.', 'haute', 'Score opportunité élevé'))
      }
    }

    return list
  }, [properties, rules])

  const totalPriceM2 = properties.reduce((sum, property) => sum + (property.pricePerMeter ?? 0), 0)
  const medianPriceM2 = properties.length ? Math.round(totalPriceM2 / properties.length) : 0

  async function syncStreamEstate() {
    setSyncing(true)
    setSyncError(null)
    try {
      const params = new URLSearchParams()
      params.set('includedZipcodes', zipcode)
      params.set('propertyTypes', 'house')
      params.set('transactionType', 'sell')
      params.set('itemsPerPage', '30')
      params.set('withCoherentPrice', 'true')

      const response = await fetch('/api/stream-estate/properties?' + params.toString())
      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? 'Synchronisation impossible')
      }

      const apiProperties = Array.isArray(data.properties) ? data.properties as ApiProperty[] : []
      setRawProperties(apiProperties.length > 0 ? apiProperties : sampleProperties)
      setLastSync(new Date().toLocaleString('fr-FR'))
    } catch (error) {
      setSyncError(error instanceof Error ? error.message : 'Erreur inconnue')
      setRawProperties(sampleProperties)
      setLastSync('Données exemple — Stream Estate non disponible')
    } finally {
      setSyncing(false)
    }
  }

  function createOpportunity(property: MarketProperty, signal = 'Signal marché détecté') {
    setOpportunities((current) => {
      if (current.some((item) => item.propertyId === property.id)) return current
      return [
        ...current,
        {
          id: crypto.randomUUID(),
          propertyId: property.id,
          title: property.title ?? 'Bien sans titre',
          city: property.city ?? '—',
          price: property.price,
          signal,
          priority: property.opportunityScore >= 70 ? 'haute' : 'moyenne',
          stage: 'À qualifier',
          nextAction: property.recommendedAction,
        },
      ]
    })
  }

  function updateOpportunityStage(id: string, stage: OpportunityStage) {
    setOpportunities((current) => current.map((item) => item.id === id ? { ...item, stage } : item))
  }

  function toggleRule(id: string) {
    setRules((current) => current.map((rule) => rule.id === id ? { ...rule, active: !rule.active } : rule))
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
            <input
              value={zipcode}
              onChange={(event) => setZipcode(event.target.value)}
              className="h-11 w-28 rounded-xl border border-slate-200 bg-white px-3 text-sm font-bold outline-none focus:border-[#00b4ec]"
              aria-label="Code postal surveillé"
            />
            <button onClick={syncStreamEstate} disabled={syncing} className="h-11 rounded-xl bg-[#00b4ec] px-4 text-sm font-black text-white transition hover:bg-[#008EC3] disabled:cursor-wait disabled:opacity-60">
              {syncing ? 'Synchronisation...' : 'Synchroniser'}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[88rem] px-6 py-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          <Kpi label="Annonces" value={String(properties.length)} />
          <Kpi label="Nouveautés" value={String(properties.filter((item) => item.tags.includes('Nouvelle annonce')).length)} />
          <Kpi label="Baisses" value={String(properties.filter((item) => item.tags.includes('Baisse de prix')).length)} />
          <Kpi label="+90 jours" value={String(properties.filter((item) => item.tags.includes('Plus de 90 jours')).length)} />
          <Kpi label="Prix/m² moyen" value={number(medianPriceM2) + ' €'} />
          <Kpi label="Alertes" value={String(notifications.length)} accent />
        </section>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          Dernière mise à jour : <span className="font-bold text-slate-900">{lastSync}</span>
          {syncError ? <span className="ml-3 font-semibold text-orange-700">{syncError}. Affichage des données exemple.</span> : null}
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
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Rechercher une commune, une annonce, une source..."
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#00b4ec] lg:max-w-md"
                  />
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
                    <tr>
                      <th className="px-4 py-3">Statut</th>
                      <th className="px-4 py-3">Bien</th>
                      <th className="px-4 py-3">Commune</th>
                      <th className="px-4 py-3">Prix</th>
                      <th className="px-4 py-3">Surface</th>
                      <th className="px-4 py-3">Prix/m²</th>
                      <th className="px-4 py-3">Terrain</th>
                      <th className="px-4 py-3">DPE</th>
                      <th className="px-4 py-3">Jours</th>
                      <th className="px-4 py-3">Variation</th>
                      <th className="px-4 py-3">Score</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map((property) => (
                      <tr key={property.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3"><span className={'inline-flex rounded-full border px-2 py-1 text-xs font-bold ' + statusColor(property.status)}>{property.status}</span></td>
                        <td className="px-4 py-3">
                          <button onClick={() => setSelected(property)} className="max-w-[260px] text-left font-bold text-slate-900 hover:text-[#006390]">{property.title ?? 'Bien sans titre'}</button>
                          <div className="mt-1 flex flex-wrap gap-1">{property.tags.slice(0, 3).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">{tag}</span>)}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{property.city ?? '—'}<br /><span className="text-xs text-slate-400">{property.zipcode ?? zipcode}</span></td>
                        <td className="px-4 py-3 font-bold">{currency(property.price)}</td>
                        <td className="px-4 py-3">{number(property.surface)} m²</td>
                        <td className="px-4 py-3">{number(property.pricePerMeter)} €</td>
                        <td className="px-4 py-3">{number(property.landSurface)} m²</td>
                        <td className="px-4 py-3"><span className="font-bold">{property.energyCategory ?? '—'}</span></td>
                        <td className="px-4 py-3">{property.daysOnline ?? '—'}</td>
                        <td className="px-4 py-3 font-bold text-orange-700">{property.variationPercent != null ? property.variationPercent + ' %' : '—'}</td>
                        <td className="px-4 py-3"><span className="font-black text-[#006390]">{property.opportunityScore}</span>/100</td>
                        <td className="px-4 py-3"><button onClick={() => createOpportunity(property, property.tags[0] ?? 'Signal marché')} className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white">Créer opportunité</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <aside className="space-y-4">
              <Panel title="Notifications" count={notifications.length}>
                <div className="space-y-3">
                  {notifications.slice(0, 8).map((item) => {
                    const property = properties.find((p) => p.id === item.propertyId)
                    return (
                      <button key={item.id} onClick={() => property ? setSelected(property) : null} className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-3 text-left hover:border-[#00b4ec]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-slate-900">{item.title}</span>
                          <span className={'rounded-full border px-2 py-0.5 text-[11px] font-bold ' + priorityColor(item.priority)}>{item.priority}</span>
                        </div>
                        <p className="mt-1 text-xs leading-5 text-slate-600">{item.message}</p>
                        <p className="mt-1 text-[11px] font-semibold text-slate-400">{item.ruleName}</p>
                      </button>
                    )
                  })}
                </div>
              </Panel>
            </aside>
          </section>
        ) : null}

        {tab === 'kanban' ? (
          <section className="mt-6 grid gap-4 xl:grid-cols-6">
            {stages.map((stage) => (
              <div key={stage} className="min-h-[28rem] rounded-3xl border border-slate-200 bg-white p-4">
                <h2 className="text-sm font-black text-slate-900">{stage}</h2>
                <div className="mt-4 space-y-3">
                  {opportunities.filter((item) => item.stage === stage).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                      <div className="font-black text-slate-900">{item.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.city} · {currency(item.price)}</div>
                      <div className="mt-2 rounded-xl bg-white p-2 text-xs text-slate-600">{item.signal}</div>
                      <select value={item.stage} onChange={(event) => updateOpportunityStage(item.id, event.target.value as OpportunityStage)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-bold">
                        {stages.map((value) => <option key={value} value={value}>{value}</option>)}
                      </select>
                    </div>
                  ))}
                  {opportunities.filter((item) => item.stage === stage).length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">Aucune opportunité</div> : null}
                </div>
              </div>
            ))}
          </section>
        ) : null}

        {tab === 'rules' ? (
          <section className="mt-6 grid gap-4 lg:grid-cols-2">
            {rules.map((rule) => (
              <article key={rule.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-black tracking-[-0.02em]">{rule.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{rule.description}</p>
                  </div>
                  <button onClick={() => toggleRule(rule.id)} className={(rule.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500') + ' rounded-full px-3 py-1 text-xs font-black'}>{rule.active ? 'Active' : 'Inactive'}</button>
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <div className="font-bold text-slate-900">Action</div>
                  <div className="mt-1">{rule.action}</div>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Priorité {rule.priority}</span>
                  <span>{notifications.filter((item) => item.ruleName === rule.name).length} alerte(s)</span>
                </div>
              </article>
            ))}
            <article className="rounded-3xl border border-dashed border-slate-300 bg-white p-5">
              <h2 className="text-lg font-black tracking-[-0.02em]">Créer une règle</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Assistant prévu pour la prochaine itération : déclencheur, conditions, actions, nom de règle.</p>
              <button className="mt-4 rounded-xl bg-[#00b4ec] px-4 py-3 text-sm font-black text-white">Préparer l’assistant</button>
            </article>
          </section>
        ) : null}
      </main>

      {selected ? (
        <div className="fixed inset-0 z-50 bg-slate-950/30 p-4 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <aside className="ml-auto h-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">Vue détail</div>
                <h2 className="text-2xl font-black tracking-[-0.03em]">{selected.title}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.city} · {selected.zipcode}</p>
              </div>
              <button onClick={() => setSelected(null)} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black">×</button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Detail label="Prix" value={currency(selected.price)} />
              <Detail label="Prix/m²" value={number(selected.pricePerMeter) + ' €'} />
              <Detail label="Surface" value={number(selected.surface) + ' m²'} />
              <Detail label="Terrain" value={number(selected.landSurface) + ' m²'} />
              <Detail label="DPE" value={selected.energyCategory ?? '—'} />
              <Detail label="Jours en ligne" value={selected.daysOnline != null ? String(selected.daysOnline) : '—'} />
            </div>

            <div className="mt-6 rounded-3xl bg-[#E9FCFF] p-5">
              <h3 className="font-black text-[#006390]">Lecture métier</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">{selected.recommendedAction}</p>
              <div className="mt-3 flex flex-wrap gap-2">{selected.tags.map((tag) => <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700">{tag}</span>)}</div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-200 p-5">
              <h3 className="font-black">Historique de prix</h3>
              <div className="mt-3 text-sm text-slate-600">{selected.variationPercent != null ? 'Variation détectée : ' + selected.variationPercent + ' %' : 'Aucune variation détectée sur cette version MVP.'}</div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button onClick={() => createOpportunity(selected, selected.tags[0] ?? 'Analyse manuelle')} className="rounded-xl bg-[#00b4ec] px-4 py-3 text-sm font-black text-white">Créer une opportunité</button>
              {selected.url && selected.url !== '#' ? <a href={selected.url} target="_blank" rel="noreferrer" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-black text-white">Ouvrir l’annonce</a> : null}
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  )
}

function notification(property: MarketProperty, title: string, message: string, priority: Priority, ruleName: string): Notification {
  return {
    id: `${property.id}-${title}`,
    title,
    message,
    priority,
    propertyId: property.id,
    ruleName,
    createdAt: new Date().toISOString(),
    status: 'Non lue',
  }
}

function Kpi({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={(accent ? 'border-[#00b4ec] bg-[#E9FCFF]' : 'border-slate-200 bg-white') + ' rounded-3xl border p-4 shadow-sm'}>
      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-black tracking-[-0.04em] text-slate-950">{value}</div>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={(active ? 'bg-slate-950 text-white' : 'bg-white text-slate-700 hover:bg-slate-50') + ' rounded-full border border-slate-200 px-4 py-2 text-sm font-black'}>{children}</button>
}

function Panel({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-black tracking-[-0.02em]">{title}</h2>
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{count}</span>
      </div>
      {children}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-1 text-lg font-black text-slate-900">{value}</div>
    </div>
  )
}
