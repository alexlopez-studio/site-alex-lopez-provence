'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  Award,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock,
  Eye,
  FileText,
  Home,
  Info,
  Map as MapIcon,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Sliders,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { ClientPortalDossier } from '@/lib/client-portal'
import type { Json } from '@/types/supabase'
import { ClientDocuments } from './client-documents'
import { ComparableLeafletMap } from './comparable-leaflet-map'
import { SignOutButton } from './sign-out-button'

const PHONE_DISPLAY = '06 13 18 01 68'
const DEFAULT_CAL_URL = '/contact'

type PortalTab = 'dashboard' | 'valuation' | 'documents' | 'tracking'

const TABS: Array<{ id: PortalTab; label: string; mobileLabel: string; icon: typeof Home }> = [
  { id: 'dashboard', label: 'Accueil', mobileLabel: 'Accueil', icon: Home },
  { id: 'valuation', label: 'Estimation', mobileLabel: 'Prix', icon: TrendingUp },
  { id: 'documents', label: 'Documents', mobileLabel: 'Docs', icon: FileText },
  { id: 'tracking', label: 'Suivi', mobileLabel: 'Suivi', icon: CheckCircle2 },
]

export function ClientPortalView({
  data,
  mode = 'session',
}: {
  data: ClientPortalDossier
  mode?: 'session' | 'test'
}) {
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard')
  const vm = useMemo(() => buildViewModel(data, mode), [data, mode])

  return (
    <main className="app-product client-portal min-h-screen bg-[#F8FAFC] pb-24 text-foreground">
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {mode === 'test' && (
            <div className="portal-body rounded-md border border-amber-200 bg-amber-50/70 px-4 py-3 text-amber-900">
              Session test locale sans connexion. Les dépôts de documents sont désactivés sur cette vue.
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="portal-button-text flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0077B6] text-white shadow-sm">
                iAD
              </span>
              <div className="min-w-0">
                <p className="portal-button-text truncate leading-tight">Alexandre Lopez</p>
                <p className="portal-meta truncate uppercase text-muted-foreground">Espace vendeur</p>
              </div>
            </div>

            <nav className="hidden rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1 md:flex" aria-label="Navigation espace vendeur">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`portal-button-text inline-flex h-10 items-center gap-2 rounded-full px-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${
                      isActive ? 'bg-[#0077B6] text-white shadow-sm' : 'text-[#64748B] hover:bg-white hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <div className="hidden flex-col text-right lg:flex">
                <span className="portal-button-text max-w-36 truncate">{vm.clientName}</span>
                <span className="portal-meta text-success">Vendeur</span>
              </div>
              <Button asChild size="sm" className="hidden rounded-full bg-[#0077B6] hover:bg-[#005F96] sm:inline-flex">
                <a href={process.env.NEXT_PUBLIC_CALCOM_URL || DEFAULT_CAL_URL}>
                  <CalendarDays className="mr-2 size-4" />
                  Rendez-vous
                </a>
              </Button>
              <a
                href={`tel:${PHONE_DISPLAY.replace(/\s/g, '')}`}
                className="inline-flex size-9 items-center justify-center rounded-full border border-[#E2E8F0] bg-white text-[#0077B6] transition-colors hover:bg-[#E0F0FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                aria-label={`Appeler Alexandre Lopez au ${PHONE_DISPLAY}`}
              >
                <Phone className="size-4" />
              </a>
              {mode === 'session' && <SignOutButton />}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <DashboardTab data={data} vm={vm} onNavigate={setActiveTab} />}
        {activeTab === 'valuation' && <ValuationTab vm={vm} />}
        {activeTab === 'documents' && <DocumentsTab data={data} vm={vm} readOnly={mode === 'test'} />}
        {activeTab === 'tracking' && <TrackingTab vm={vm} />}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white px-2 py-2 shadow-lg md:hidden" aria-label="Navigation mobile espace vendeur">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`portal-meta flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl px-2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                  isActive ? 'bg-[#E0F0FA] text-[#0077B6]' : 'text-[#64748B]'
                }`}
              >
                <Icon className="size-5" />
                {tab.mobileLabel}
              </button>
            )
          })}
        </div>
      </nav>
    </main>
  )
}

function DashboardTab({
  data,
  vm,
  onNavigate,
}: {
  data: ClientPortalDossier
  vm: PortalViewModel
  onNavigate: (tab: PortalTab) => void
}) {
  const visits = vm.visibleEvents.filter((event) => event.type === 'visit')
  const offers = vm.visibleEvents.filter((event) => event.type === 'offer')
  const checklist = [
    {
      id: 'documents',
      label:
        vm.documents.missing > 0
          ? `Compléter les pièces manquantes (${vm.documents.missing})`
          : 'Dossier administratif complet',
      done: vm.documents.total > 0 && vm.documents.missing === 0,
      target: 'documents' as const,
    },
    {
      id: 'valuation',
      label: vm.estimate.median ? `Lire l’avis de valeur (${formatPrice(vm.estimate.median)})` : 'Attendre l’avis de valeur conseiller',
      done: Boolean(vm.estimate.median),
      target: 'valuation' as const,
    },
    {
      id: 'tracking',
      label: offers.length > 0 ? 'Consulter les offres et retours acheteurs' : 'Suivre les jalons de commercialisation',
      done: vm.visibleEvents.some((event) => event.status === 'done'),
      target: 'tracking' as const,
    },
  ]
  const completedChecklist = checklist.filter((item) => item.done).length

  return (
    <div className="space-y-8">
      <DashboardStatusCard vm={vm} />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3" id="dashboard-kpis">
        <DashboardKpi
          label="Prix retenu"
          value={vm.estimate.median ? formatPriceCompact(vm.estimate.median) : 'À confirmer'}
          helper="Voir l’estimation"
          icon={TrendingUp}
          tone="brand"
          onClick={() => onNavigate('valuation')}
        />
        <DashboardKpi
          label="Visites physiques"
          value={String(visits.length)}
          valueSuffix={visits.length > 1 ? 'effectuées' : 'effectuée'}
          helper="Consulter l’historique"
          icon={Users}
          tone="success"
          onClick={() => onNavigate('tracking')}
        />
        <DashboardKpi
          label="Offre d’achat"
          value={String(offers.length)}
          valueSuffix={offers.length > 0 ? 'En attente' : 'À venir'}
          helper="Étudier l’offre"
          icon={FileText}
          tone="warning"
          onClick={() => onNavigate('tracking')}
        />
      </section>

      <NextStepsPanel checklist={checklist} completed={completedChecklist} onNavigate={onNavigate} />

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <h2 className="portal-h2 flex items-center gap-2 text-[#0F172A]">
            <span aria-hidden="true">🤝</span>
            Accompagnement de votre conseiller
          </h2>
          <AdvisorPanel />
        </div>
        <AudiencePanel views={vm.audience.views} contacts={vm.audience.contacts} onNavigate={() => onNavigate('tracking')} />
      </section>

      <PropertyHeroPanel vm={vm} onNavigate={() => onNavigate('valuation')} />

      {data.dossier.advisor_note && (
        <div className="portal-body rounded-3xl border border-[#0077B6]/15 bg-[#E0F0FA] p-5 text-[#005F96]">
          <strong className="text-[#0F172A]">Message d’Alexandre : </strong>
          {data.dossier.advisor_note}
        </div>
      )}

      <DashboardCta />
    </div>
  )
}

function ValuationTab({ vm }: { vm: PortalViewModel }) {
  const [valuationType, setValuationType] = useState<'advisor' | 'express'>('advisor')
  const [selectedPrice, setSelectedPrice] = useState(vm.estimate.median ?? vm.estimate.low ?? 0)
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [activeComparable, setActiveComparable] = useState<string | null>(vm.estimate.comparables[0]?.id ?? null)

  const low = vm.estimate.low ?? Math.round((vm.estimate.median ?? selectedPrice) * 0.94)
  const high = vm.estimate.high ?? Math.round((vm.estimate.median ?? selectedPrice) * 1.06)
  const safeSelectedPrice = selectedPrice || vm.estimate.median || low
  const commissionRate = vm.estimate.commissionRate
  const fees = safeSelectedPrice ? Math.round(safeSelectedPrice * commissionRate) : null
  const netSeller = safeSelectedPrice && fees ? safeSelectedPrice - fees : null

  return (
    <div className="space-y-8" id="valuation-tab">
      <section className="flex flex-col justify-between gap-4 rounded-3xl border border-[#E2E8F0] bg-white p-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="portal-h2 text-[#0F172A]">Rapport d’estimation du bien</h2>
          <p className="portal-meta text-[#64748B]">Comparez l’avis d’expert d’Alexandre et l’évaluation automatique.</p>
        </div>

        <div className="flex w-full rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1.5 sm:w-auto">
          <button
            type="button"
            onClick={() => setValuationType('advisor')}
            className={`portal-button-text flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2 transition-all sm:flex-none ${
              valuationType === 'advisor' ? 'bg-[#0077B6] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Sparkles className="size-3.5" />
            Avis de valeur Conseiller
          </button>
          <button
            type="button"
            onClick={() => setValuationType('express')}
            className={`portal-button-text flex flex-1 items-center justify-center gap-1.5 rounded-full px-5 py-2 transition-all sm:flex-none ${
              valuationType === 'express' ? 'bg-[#0F172A] text-white shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            Estimation Express iAD
          </button>
        </div>
      </section>

      {valuationType === 'express' ? (
        <section className="rounded-3xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#0F172A]/5 text-[#0F172A]">
            <Info className="size-8" />
          </div>
          <div className="mx-auto mt-6 max-w-xl space-y-2">
            <h3 className="portal-h2 text-[#0F172A]">Estimation en ligne indicative</h3>
            <p className="portal-body text-[#64748B]">
              L’algorithme automatique donne un premier repère entre <strong className="text-[#0F172A]">{formatPrice(low)}</strong> et{' '}
              <strong className="text-[#0F172A]">{formatPrice(high)}</strong>. L’avis conseiller ajuste ce repère avec les prestations réelles, l’environnement et la stratégie de vente.
            </p>
          </div>
          <div className="portal-body mx-auto mt-6 max-w-2xl rounded-2xl border border-amber-100 bg-amber-50 p-4 text-left text-amber-800">
            Les algorithmes ne prennent pas toujours en compte l’exposition, les extérieurs, le calme réel ou les prestations. C’est pourquoi Alexandre affine le prix retenu.
          </div>
          <Button className="mt-6 rounded-full bg-[#0077B6] hover:bg-[#005F96]" onClick={() => setValuationType('advisor')}>
            <Sparkles className="mr-2 size-4" />
            Consulter l’avis de valeur révisé d’Alexandre
          </Button>
        </section>
      ) : (
        <div className="space-y-8" id="valuation-advisor-block">
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col justify-between space-y-6 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8 lg:col-span-2">
              <div className="space-y-2">
                <span className="portal-label inline-flex rounded-full bg-[#E0F0FA] px-3 py-1 text-[#0077B6]">
                  Validation Conseiller
                </span>
                <h3 className="portal-h3 text-[#0F172A]">Valeur recommandée pour votre bien</h3>
                <p className="portal-meta text-[#64748B]">Fourchette de commercialisation optimale pour susciter le coup de cœur sans brader.</p>
              </div>

              <div className="flex flex-wrap items-end gap-6 border-b border-[#E2E8F0] pb-5">
                <div>
                  <p className="portal-label text-[#64748B]">Prix de mise en vente suggéré</p>
                  <p className="text-5xl font-extrabold tracking-tight text-[#0077B6]">{formatPriceCompact(safeSelectedPrice)}</p>
                </div>
                <div className="border-l border-[#E2E8F0] py-1 pl-6">
                  <p className="portal-label text-[#64748B]">Fourchette optimale</p>
                  <p className="portal-h3 text-[#0F172A]">{formatPrice(low)} – {formatPrice(high)}</p>
                </div>
              </div>

              <PricePositionGauge low={low} selected={safeSelectedPrice} high={high} />

              <div className="space-y-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAdjusting((value) => !value)}
                    className="portal-button-text flex items-center gap-1.5 text-[#0F172A] hover:underline"
                  >
                    <Sliders className="size-4 text-[#0077B6]" />
                    {isAdjusting ? 'Masquer les outils de simulation' : 'Simuler un autre prix de vente'}
                  </button>
                  <span className="portal-label text-[#64748B]">Simulation Net Vendeur</span>
                </div>

                {isAdjusting && (
                  <div className="space-y-4 border-t border-[#E2E8F0] pt-3">
                    <input
                      type="range"
                      min={low}
                      max={high}
                      step={5000}
                      value={safeSelectedPrice}
                      onChange={(event) => setSelectedPrice(Number(event.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#0077B6]"
                    />
                    <div className="grid grid-cols-1 gap-4 text-xs font-semibold sm:grid-cols-3">
                      <MiniValue label="Prix affiché FAI" value={formatPrice(safeSelectedPrice)} />
                      <MiniValue label="Honoraires iAD" value={fees ? `- ${formatPrice(fees)}` : 'À calculer'} tone="warning" />
                      <MiniValue label="Net vendeur estimé" value={netSeller ? formatPrice(netSeller) : 'À confirmer'} tone="brand" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <AdvisorArgumentsCard price={safeSelectedPrice} argumentsList={vm.estimate.arguments} />
          </section>

          <section className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <ComparableMap
              comparables={vm.estimate.comparables}
              activeComparable={activeComparable}
              setActiveComparable={setActiveComparable}
              city={vm.summary.commune ?? 'Secteur'}
              center={vm.mapCenter}
            />
            <ComparableList
              comparables={vm.estimate.comparables}
              activeComparable={activeComparable}
              setActiveComparable={setActiveComparable}
            />
          </section>

          <PriceTrendChart trend={vm.estimate.priceTrend} city={vm.summary.commune ?? 'secteur'} />
        </div>
      )}
    </div>
  )
}

function PricePositionGauge({ low, selected, high }: { low: number; selected: number; high: number }) {
  const position = high > low ? Math.min(100, Math.max(0, ((selected - low) / (high - low)) * 100)) : 50

  return (
    <div className="space-y-4">
      <div className="portal-meta flex flex-col gap-2 text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
        <span>Fourchette basse ({formatPrice(low)})</span>
        <span className="w-fit rounded-full bg-[#E0F0FA] px-3 py-1 font-extrabold text-[#0077B6]">Prix retenu : {formatPrice(selected)}</span>
        <span>Fourchette haute ({formatPrice(high)})</span>
      </div>

      <div className="relative h-4 rounded-full border border-slate-200 bg-slate-100">
        <div className="absolute inset-y-0 left-[20%] right-[20%] rounded-full border-y border-[#0077B6]/10 bg-[#0077B6]/20" />
        <div className="absolute top-0 z-10 h-full w-1 bg-[#0077B6]" style={{ left: '50%' }}>
          <div className="-mt-0.5 size-2.5 rounded-full bg-[#0077B6]" />
        </div>
        <div
          className="absolute top-1/2 z-20 size-6 -translate-y-1/2 rounded-full border-4 border-[#0077B6] bg-white shadow-md"
          style={{ left: `${position}%`, transform: 'translate(-50%, -50%)' }}
        />
      </div>

      <div className="portal-meta flex justify-between text-[#64748B]">
        <span>Vente rapide</span>
        <span className="font-semibold text-[#0077B6]">Équilibre conseillé</span>
        <span>Position haute</span>
      </div>
    </div>
  )
}

function AdvisorArgumentsCard({ price, argumentsList }: { price: number; argumentsList: string[] }) {
  const visibleArguments = argumentsList.length > 0 ? argumentsList : [
    'Positionnement cohérent avec les prestations et le secteur.',
    'Fourchette construite pour déclencher des visites qualifiées.',
    'Ajustement prévu selon les retours acquéreurs et la concurrence active.',
  ]

  return (
    <section className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#0F172A] p-6 text-white shadow-md md:p-8">
      <div className="absolute right-0 top-0 size-36 rounded-full bg-[#0077B6]/10 blur-2xl" />
      <div className="relative space-y-6">
        <span className="portal-label inline-flex rounded-full bg-[#0077B6]/15 px-4 py-2 text-[#0077B6]">
          Arguments d’Alexandre
        </span>
        <h2 className="portal-h2">Pourquoi ce prix de {formatPriceCompact(price)} ?</h2>
        <ul className="space-y-5 portal-body text-slate-300">
          {visibleArguments.slice(0, 4).map((argument) => (
            <li key={argument} className="flex items-start gap-4">
              <Check className="mt-1 size-5 shrink-0 text-[#10B981]" />
              <span>{highlightArgument(argument)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative mt-8 flex items-center gap-3 border-t border-slate-800 pt-6">
        <ShieldCheck className="size-6 shrink-0 text-[#10B981]" />
        <p className="portal-meta text-slate-400">Estimation appuyée par les outils d’évaluation exclusifs du réseau iAD France.</p>
      </div>
    </section>
  )
}

function highlightArgument(argument: string) {
  const [first, ...rest] = argument.split(':')
  if (rest.length === 0) return argument
  return (
    <>
      <strong className="font-extrabold text-slate-200">{first} :</strong>
      {rest.join(':')}
    </>
  )
}

function ComparableMap({
  comparables,
  activeComparable,
  setActiveComparable,
  city,
  center,
}: {
  comparables: PortalComparable[]
  activeComparable: string | null
  setActiveComparable: (id: string | null) => void
  city: string
  center: { lat: number; lng: number } | null
}) {
  const active = comparables.find((item) => item.id === activeComparable)

  return (
    <section className="space-y-5 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm lg:col-span-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="portal-h2 flex items-center gap-2 text-[#0F172A]">
            <MapIcon className="size-6 text-[#0077B6]" />
            Carte des biens comparables vendus
          </h2>
          <p className="portal-body mt-1 text-[#64748B]">Cliquez sur un repère pour examiner un bien vendu dans le quartier.</p>
        </div>
        <span className="portal-label w-fit rounded-lg bg-slate-50 px-3 py-2 text-[#64748B]">{city}</span>
      </div>

      <div className="relative">
        <ComparableLeafletMap
          comparables={comparables}
          activeComparable={activeComparable}
          setActiveComparable={setActiveComparable}
          center={center}
          city={city}
        />

        {active && (
          <div className="mt-4 flex items-center justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 shadow-sm">
            <div>
              <p className="portal-label flex items-center gap-1 text-[#0077B6]">
                <MapPin className="size-3" />
                Comparable · {active.distance}
              </p>
              <h4 className="portal-h3 mt-1 text-[#0F172A]">{active.title}</h4>
              <p className="portal-meta text-[#64748B]">
                {active.surface ? `${active.surface} m²` : 'Surface nc'} · {active.rooms ? `${active.rooms} pièces` : 'Pièces nc'} ·{' '}
                <strong>{active.pricePerSqm ? `${formatNumber(active.pricePerSqm)} €/m²` : 'Prix/m² nc'}</strong>
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-extrabold text-[#0F172A]">{active.price ? formatPrice(active.price) : 'Vendu'}</p>
              <span className="portal-button-text rounded bg-[#10B981]/10 px-2 py-1 text-[#10B981]">Vendu</span>
            </div>
          </div>
        )}

        {comparables.length === 0 && (
          <div className="portal-body mt-4 rounded-2xl border border-dashed border-[#E2E8F0] bg-white/85 p-5 text-[#64748B]">
            Les comparables validés par Alexandre apparaîtront ici.
          </div>
        )}
      </div>
    </section>
  )
}

function ComparableList({
  comparables,
  activeComparable,
  setActiveComparable,
}: {
  comparables: PortalComparable[]
  activeComparable: string | null
  setActiveComparable: (id: string | null) => void
}) {
  return (
    <section className="space-y-4 lg:col-span-2">
      <h2 className="portal-h2 text-[#0F172A]">Détail des ventes récentes</h2>
      <div className="space-y-4">
        {comparables.length === 0 && (
          <div className="portal-body rounded-3xl border border-dashed border-[#E2E8F0] bg-white p-6 text-[#64748B]">
            Les ventes récentes seront affichées après validation des comparables.
          </div>
        )}
        {comparables.map((comparable, index) => {
          const active = activeComparable === comparable.id
          return (
            <button
              key={comparable.id}
              type="button"
              onClick={() => setActiveComparable(active ? null : comparable.id)}
              className={`flex w-full items-center justify-between gap-4 rounded-3xl border p-5 text-left transition-all ${
                active ? 'border-[#0077B6] bg-[#E0F0FA]/30 shadow-sm' : 'border-[#E2E8F0] bg-[#F8FAFC] hover:bg-white hover:shadow-sm'
              }`}
            >
              <div className="min-w-0 space-y-2">
                <p className="portal-h3 flex items-center gap-2 text-[#0F172A]">
                  <span className="portal-button-text flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200">{index + 1}</span>
                  {comparable.distance}
                </p>
                <p className="portal-body line-clamp-1 text-[#64748B]">{comparable.title}</p>
                <p className="portal-body text-[#64748B]">
                  {comparable.surface ? `${comparable.surface} m²` : 'Surface nc'} • {comparable.rooms ? `${comparable.rooms} p.` : 'Pièces nc'} •{' '}
                  <span className="font-semibold text-[#0F172A]">{comparable.pricePerSqm ? `${formatNumber(comparable.pricePerSqm)} €/m²` : 'Prix/m² nc'}</span>
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xl font-extrabold text-[#0F172A]">{comparable.price ? formatPrice(comparable.price) : 'Vendu'}</p>
                <span className="portal-button-text rounded-lg bg-[#10B981]/10 px-3 py-1 text-[#10B981]">Vendu iAD</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function PriceTrendChart({ trend, city }: { trend: Array<{ year: string; price: number }>; city: string }) {
  if (trend.length === 0) {
    return (
      <section className="space-y-4 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
        <h2 className="portal-h2 flex items-center gap-2 text-[#0F172A]">
          <TrendingUp className="size-6 text-[#0077B6]" />
          Évolution du prix médian au m²
        </h2>
        <div className="portal-body rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-6 text-[#64748B]">
          La tendance de marché sera affichée ici dès que les données conseiller seront renseignées.
        </div>
      </section>
    )
  }

  const min = Math.min(...trend.map((item) => item.price))
  const max = Math.max(...trend.map((item) => item.price))
  const spread = Math.max(1, max - min)
  const points = trend.map((item, index) => {
    const x = 42 + index * (416 / Math.max(1, trend.length - 1))
    const y = 100 - ((item.price - min) / spread) * 52
    return { ...item, x, y }
  })
  const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ')
  const areaPoints = `${linePoints} ${points[points.length - 1]?.x ?? 458},100 ${points[0]?.x ?? 42},100`
  const first = trend[0]?.price ?? 0
  const last = trend[trend.length - 1]?.price ?? first
  const evolution = first ? Math.round(((last - first) / first) * 1000) / 10 : null

  return (
    <section className="space-y-6 rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="portal-h2 flex items-center gap-2 text-[#0F172A]">
            <TrendingUp className="size-6 text-[#0077B6]" />
            Évolution du prix médian au m² (DVF {city})
          </h2>
          <p className="portal-body mt-1 text-[#64748B]">Données de ventes officielles pour les maisons individuelles.</p>
        </div>
        {evolution !== null && (
          <span className="portal-button-text w-fit rounded-full bg-[#10B981]/10 px-4 py-2 text-[#10B981]">
            +{evolution}% depuis {trend[0]?.year}
          </span>
        )}
      </div>

      <div className="w-full overflow-x-auto pt-4">
        <div className="relative h-44 min-w-[560px]">
          <svg className="size-full" viewBox="0 0 500 150" aria-hidden="true">
            <line x1="0" y1="28" x2="500" y2="28" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="72" x2="500" y2="72" stroke="#F1F5F9" strokeWidth="1" />
            <line x1="0" y1="116" x2="500" y2="116" stroke="#E2E8F0" strokeWidth="1.5" />
            <defs>
              <linearGradient id="portal-chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0077B6" />
                <stop offset="100%" stopColor="#0077B6" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon fill="url(#portal-chart-grad)" opacity="0.12" points={areaPoints} />
            <polyline fill="none" stroke="#0077B6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={linePoints} />
            {points.map((point, index) => {
              const isLast = index === points.length - 1
              return (
                <g key={point.year}>
                  <circle cx={point.x} cy={point.y} r="7" fill={isLast ? '#0077B6' : '#FFFFFF'} stroke="#0077B6" strokeWidth="3" />
                  <text x={point.x} y="139" fontSize="11" fill="#64748B" fontWeight="700" textAnchor="middle">{point.year}</text>
                  <text x={point.x} y={point.y - 14} fontSize={isLast ? '12' : '11'} fill={isLast ? '#0077B6' : '#0F172A'} fontWeight="800" textAnchor="middle">
                    {formatNumber(point.price)} €/m²
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      <p className="portal-body text-center italic text-[#64748B]">
        *Note : cette tendance conforte la stratégie de commercialisation et positionne le bien dans une lecture de marché argumentée.
      </p>
    </section>
  )
}

function DocumentsTab({
  data,
  vm,
  readOnly,
}: {
  data: ClientPortalDossier
  vm: PortalViewModel
  readOnly: boolean
}) {
  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="portal-h2">Dossier administratif</h2>
            <p className="portal-body mt-1 max-w-2xl text-muted-foreground">
              Chaque pièce fournie est vérifiée par Alexandre avant transmission aux interlocuteurs utiles.
            </p>
          </div>
          <div className="w-full rounded-md border bg-surface/80 p-4 md:w-72">
            <div className="portal-label flex justify-between text-muted-foreground">
              <span>Avancement</span>
              <span className="text-brand">{vm.documents.provided}/{vm.documents.total}</span>
            </div>
            <Progress value={vm.documents.progress} className="mt-3 h-2.5" />
            <p className="portal-meta mt-2 text-muted-foreground">
              {vm.documents.progress === 100 ? 'Votre dossier est complet.' : 'Les pièces manquantes restent visibles en priorité.'}
            </p>
          </div>
        </div>
      </Panel>

      <Panel>
        <ClientDocuments dossierId={data.dossier.id} documents={data.documents} readOnly={readOnly} />
      </Panel>
    </div>
  )
}

function TrackingTab({ vm }: { vm: PortalViewModel }) {
  const visits = vm.visibleEvents.filter((event) => event.type === 'visit')
  const offers = vm.visibleEvents.filter((event) => event.type === 'offer')

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel>
          <h2 className="portal-h2">Suivi de votre mandat</h2>
          <p className="portal-body mt-1 text-muted-foreground">La progression visible de votre vente, étape par étape.</p>
          <TimelineList events={vm.visibleEvents} />
        </Panel>

        <Panel>
          <h2 className="portal-h2">Audience & actions</h2>
          <div className="mt-4 grid gap-3">
            <MiniInfo label="Visites renseignées" value={String(visits.length)} icon={Users} />
            <MiniInfo label="Offres consultables" value={String(offers.length)} icon={FileText} />
            <MiniInfo label="Prochaine action" value={vm.nextAction} icon={Clock} />
          </div>
          <div className="portal-body mt-5 rounded-md border border-amber-200 bg-amber-50/80 p-4 text-amber-900">
            <CircleAlert className="mb-2 size-5" />
            Les offres sont consultables dans cette v1. Les décisions juridiquement sensibles restent traitées directement avec Alexandre.
          </div>
        </Panel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <h2 className="portal-h2">Retours de visites</h2>
          <EventCards events={visits} empty="Les comptes-rendus de visites apparaîtront ici." />
        </Panel>
        <Panel>
          <h2 className="portal-h2">Offres et négociation</h2>
          <EventCards events={offers} empty="Les offres écrites validées par Alexandre apparaîtront ici." />
        </Panel>
      </section>
    </div>
  )
}

function AdvisorPanel() {
  const [imageError, setImageError] = useState(false)

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
      <div className="absolute right-0 top-0 h-36 w-36 rounded-full bg-[#E0F0FA]/40 blur-2xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
        <div className="relative shrink-0">
          <div className="relative size-28 overflow-hidden rounded-full border-[3px] border-[#0077B6] bg-[#E0F0FA] shadow-sm">
            {imageError ? (
              <div className="flex size-full items-center justify-center text-2xl font-extrabold text-[#0077B6]">AL</div>
            ) : (
              <Image
                src="/alexandre-lopez-face.jpg"
                alt="Alexandre Lopez"
                fill
                sizes="112px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <span className="absolute bottom-2 right-0 flex size-7 items-center justify-center rounded-full bg-white shadow-sm">
            <span className="size-5 rounded-full border-2 border-white bg-[#10B981]" />
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="portal-label inline-flex items-center gap-1 rounded-full bg-[#E0F0FA] px-3 py-1 text-[#0077B6]">
              <Sparkles className="size-4" />
              Votre conseiller dédié
            </span>
            <span className="portal-meta rounded-full bg-[#10B981]/10 px-3 py-1 text-[#10B981]">
              Disponible aujourd’hui
            </span>
          </div>
          <div>
            <h3 className="portal-h2 text-[#0F172A]">Alexandre Lopez</h3>
            <p className="portal-body mt-2 text-[#64748B]">
              Conseiller Immobilier iAD France · Spécialiste Provence Verte
            </p>
          </div>
          <p className="portal-body max-w-3xl italic text-[#334155]">
            « Votre projet de vie mérite un accompagnement d’exception. À chaque étape, je m’engage à vos côtés pour valoriser au mieux votre patrimoine. »
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-3 sm:flex-row md:w-auto md:flex-col">
          <Button asChild className="portal-button-text h-14 flex-1 rounded-full bg-[#0077B6] px-8 hover:bg-[#005F96] md:flex-none">
            <a href={process.env.NEXT_PUBLIC_CALCOM_URL || DEFAULT_CAL_URL}>
              <CalendarDays className="mr-2 size-5" />
              Prendre RDV
            </a>
          </Button>
          <Button asChild variant="outline" className="portal-button-text h-14 flex-1 rounded-full border-[#E2E8F0] bg-white px-8 text-[#0F172A] hover:bg-[#F8FAFC] md:flex-none">
            <a href="tel:0613180168">
              <Phone className="mr-2 size-5 text-[#0077B6]" />
              Nous appeler
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}

function DashboardStatusCard({ vm }: { vm: PortalViewModel }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
      <div className="absolute left-0 top-0 h-full w-2 bg-[#0077B6]" />
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="portal-label inline-flex items-center gap-1 rounded-full bg-[#E0F0FA] px-3 py-1 text-[#0077B6]">
              <Award className="size-3.5" />
              {vm.mandateType || 'Mandat vendeur'}
            </span>
            <span className="portal-meta text-[#64748B]">Référence : {vm.reference}</span>
          </div>
          <h1 className="portal-h1 text-[#0F172A]">Bonjour, {vm.clientName}</h1>
          <p className="portal-meta flex items-center gap-1 text-[#64748B]">
            <MapPin className="size-4 text-[#0077B6]" />
            {vm.summary.adresse ?? vm.summary.commune ?? vm.title}
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10 p-4">
          <span className="flex size-10 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981]">
            <CheckCircle2 className="size-5" />
          </span>
          <div>
            <p className="portal-label text-[#64748B]">Statut commercial</p>
            <p className="portal-button-text text-[#10B981]">{vm.statusLabel} · {vm.currentStage}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function DashboardKpi({
  label,
  value,
  valueSuffix,
  helper,
  icon: Icon,
  tone,
  onClick,
}: {
  label: string
  value: string
  valueSuffix?: string
  helper: string
  icon: typeof Home
  tone: 'brand' | 'success' | 'warning'
  onClick: () => void
}) {
  const tones = {
    brand: 'bg-[#E0F0FA] text-[#0077B6]',
    success: 'bg-[#10B981]/10 text-[#10B981]',
    warning: 'bg-[#B26A00]/10 text-[#B26A00]',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="portal-kpi-card group p-6 text-left transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6] focus-visible:ring-offset-2"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 space-y-1">
          <p className="portal-label text-[#64748B]">{label}</p>
          <p className="portal-value text-[#0F172A]">
            {value}
            {valueSuffix && <span className="portal-meta ml-2 align-middle text-[#64748B]">{valueSuffix}</span>}
          </p>
          <p className="portal-meta flex items-center gap-1 text-[#0077B6] group-hover:underline">
            {helper}
            <ChevronRight className="size-3.5" />
          </p>
        </div>
        <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-6" />
        </span>
      </div>
    </button>
  )
}

function NextStepsPanel({
  checklist,
  completed,
  onNavigate,
}: {
  checklist: Array<{ id: string; label: string; done: boolean; target: PortalTab }>
  completed: number
  onNavigate: (tab: PortalTab) => void
}) {
  return (
    <section className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="portal-h2 text-[#0F172A]">Prochaines étapes conseillées</h2>
          <p className="portal-body text-[#64748B]">Cochez ou cliquez sur les actions pour avancer sereinement dans la vente.</p>
        </div>
        <span className="portal-button-text w-fit rounded-full bg-[#E0F0FA] px-3 py-1 text-[#0077B6]">
          {completed} / {checklist.length} Validées
        </span>
      </div>

      <div className="mt-5 space-y-3.5">
        {checklist.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.target)}
            className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6] focus-visible:ring-offset-2 ${
              item.done ? 'border-[#E2E8F0] bg-slate-50/70 text-[#64748B] opacity-85' : 'border-[#E2E8F0] bg-white hover:border-[#0077B6]'
            }`}
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className={`flex size-6 shrink-0 items-center justify-center rounded-full border-2 ${
                item.done ? 'border-[#10B981] bg-[#10B981] text-white' : 'border-[#CBD5E1] text-transparent'
              }`}>
                {item.done && <CheckCircle2 className="size-4 stroke-[3]" />}
              </span>
              <span className={`portal-body ${item.done ? 'line-through text-[#64748B]' : 'text-[#0F172A]'}`}>
                {item.label}
              </span>
            </span>
            <span className="portal-button-text flex items-center gap-1 text-[#0077B6]">
              Gérer
              <ChevronRight className="size-4" />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function AudiencePanel({
  views,
  contacts,
  onNavigate,
}: {
  views: { count: number | null; change: number | null }
  contacts: { count: number | null; change: number | null }
  onNavigate: () => void
}) {
  return (
    <section className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="portal-h2 text-[#0F172A]">Diffusion & Audience</h2>
        <p className="portal-body text-[#64748B]">
          Audience consolidée des portails SeLoger, LeBonCoin, Logic-Immo & Réseau iAD.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        <AudienceMetric
          label="Vues de l’annonce"
          value={views.count}
          change={views.change}
          icon={Eye}
          tone="brand"
        />
        <AudienceMetric
          label="Contacts qualifiés"
          value={contacts.count}
          change={contacts.change}
          icon={Users}
          tone="violet"
        />
      </div>

      <button
        type="button"
        onClick={onNavigate}
        className="portal-button-text mt-8 flex w-full items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white py-4 text-[#0F172A] transition-colors hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6]"
      >
        Voir les statistiques détaillées
        <ArrowRight className="size-4 text-[#0077B6]" />
      </button>
    </section>
  )
}

function AudienceMetric({
  label,
  value,
  change,
  icon: Icon,
  tone,
}: {
  label: string
  value: number | null
  change: number | null
  icon: typeof Home
  tone: 'brand' | 'violet'
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
      <div className="flex items-center gap-4">
        <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${tone === 'brand' ? 'bg-[#E0F0FA] text-[#0077B6]' : 'bg-violet-50 text-violet-600'}`}>
          <Icon className="size-6" />
        </span>
        <div>
          <p className="portal-h3 text-[#64748B]">{label}</p>
          <p className="text-4xl font-extrabold tracking-tight text-[#0F172A]">{value === null ? '—' : formatNumber(value)}</p>
        </div>
      </div>
      <span className="portal-h3 rounded-full bg-[#10B981]/10 px-4 py-2 text-[#10B981]">
        {change === null ? '+—' : `+${change}%`} cette sem.
      </span>
    </div>
  )
}

function PropertyHeroPanel({ vm, onNavigate }: { vm: PortalViewModel; onNavigate: () => void }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden bg-[#E0F0FA]/55 p-8 lg:col-span-2">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-35">
            <svg viewBox="0 0 100 100" className="h-full w-full scale-110 text-[#0077B6]" fill="currentColor" aria-hidden="true">
              <path d="M10,80 L90,80 L90,40 L50,15 L10,40 Z" />
              <path d="M25,80 L25,55 L35,55 L35,80 Z" />
              <circle cx="50" cy="35" r="8" />
              <path d="M60,50 L75,50 L75,65 L60,65 Z" />
            </svg>
          </div>
          <span className="portal-label relative z-10 w-fit rounded-full bg-[#0F172A] px-4 py-2 text-white">
            {vm.propertyHero.typeLabel}
          </span>
          <div className="relative z-10 space-y-2">
            <p className="portal-label text-[#0077B6]">{vm.propertyHero.sector}</p>
            <h2 className="portal-h2 text-[#0F172A]">{vm.propertyHero.title}</h2>
            <p className="portal-body text-[#64748B]">{vm.propertyHero.city}</p>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 p-6 md:p-8 lg:col-span-3">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <PropertyFact label="Surface" value={vm.summary.surface ? `${vm.summary.surface} m²` : '—'} />
            <PropertyFact label="Pièces" value={vm.summary.rooms ? `${vm.summary.rooms} pièces` : '—'} />
            <PropertyFact label="Chambres" value={vm.propertyHero.bedrooms ? `${vm.propertyHero.bedrooms} ch.` : '—'} />
            <PropertyFact label="Terrain" value={vm.summary.surfaceTerrain ? `${vm.summary.surfaceTerrain} m²` : '—'} />
          </div>

          <p className="portal-body line-clamp-4 text-[#334155]">{vm.propertyHero.description}</p>

          <div className="flex flex-col gap-4 border-t border-[#E2E8F0] pt-5 md:flex-row md:items-center md:justify-between">
            <span className="portal-body text-[#64748B]">{vm.propertyHero.features.join(' • ')}</span>
            <button
              type="button"
              onClick={onNavigate}
              className="portal-button-text flex items-center gap-2 text-[#0077B6] hover:underline"
            >
              Fiche complète du bien
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function PropertyFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
      <p className="portal-label text-[#64748B]">{label}</p>
      <p className="portal-value mt-2 text-[#0F172A]">{value}</p>
    </div>
  )
}

function DashboardCta() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#0077B6]/15 bg-[#E0F0FA] p-6 shadow-sm md:p-8">
      <div className="pointer-events-none absolute -bottom-10 -right-10 size-44 rounded-full bg-[#0077B6]/5 blur-xl" />
      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h2 className="portal-h2 text-[#0F172A]">Une question ou besoin d’ajustements ?</h2>
          <p className="portal-body text-[#005F96]">Alexandre Lopez est disponible pour vous guider au quotidien.</p>
        </div>
        <a
          href={process.env.NEXT_PUBLIC_CALCOM_URL || DEFAULT_CAL_URL}
          className="portal-button-text flex shrink-0 items-center gap-2 rounded-full bg-[#0077B6] px-6 py-3.5 text-white shadow-sm transition-all hover:bg-[#005F96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6] focus-visible:ring-offset-2"
        >
          Prendre un rendez-vous rapide
          <ArrowRight className="size-4" />
        </a>
      </div>
    </section>
  )
}

function Panel({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'brand' }) {
  return (
    <Card
      className={`app-panel rounded-lg border-slate-200/90 shadow-[0_18px_50px_-42px_rgba(15,23,42,0.55)] ${
        tone === 'brand' ? 'bg-brand-light/65' : 'bg-white'
      }`}
    >
      <CardContent className="p-5 sm:p-6">{children}</CardContent>
    </Card>
  )
}

function MiniInfo({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Home }) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-surface/80 p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-white text-foreground">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="portal-label block text-muted-foreground">{label}</span>
        <span className="portal-button-text mt-1 block truncate">{value}</span>
      </span>
    </div>
  )
}

function MiniValue({ label, value, tone }: { label: string; value: string; tone?: 'brand' | 'warning' }) {
  return (
    <div className={`rounded-md border p-3 ${tone === 'brand' ? 'border-brand/15 bg-brand-light/60' : 'bg-surface/80'}`}>
      <p className="portal-label text-muted-foreground">{label}</p>
      <p className={`portal-button-text mt-1 ${tone === 'brand' ? 'text-brand-hover' : tone === 'warning' ? 'text-[#B26A00]' : ''}`}>{value}</p>
    </div>
  )
}

function TimelineList({ events, compact = false }: { events: PortalEvent[]; compact?: boolean }) {
  if (events.length === 0) return <EmptyState text="Les jalons visibles seront ajoutés par Alexandre." />
  return (
    <ol className={`relative ml-4 mt-5 border-l-2 border-border pl-5 ${compact ? 'space-y-4' : 'space-y-6'}`}>
      {events.map((event) => {
        const isDone = event.status === 'done'
        return (
          <li key={event.id} className="relative">
            <span className={`absolute -left-[31px] top-1 flex size-5 items-center justify-center rounded-md border-4 border-white ${isDone ? 'bg-foreground text-white' : 'bg-white text-muted-foreground ring-1 ring-border'}`}>
              {isDone ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {event.event_date && <span className="portal-meta text-brand">{formatDate(event.event_date)}</span>}
              <Badge variant="outline" className="rounded-md">{event.typeLabel}</Badge>
              {event.status !== 'done' && <Badge variant="outline" className="rounded-md border-brand/20 bg-brand-light/70 text-brand">En cours</Badge>}
            </div>
            <h3 className="portal-h3 mt-1">{event.title}</h3>
            {event.description && <p className="portal-body mt-1 text-muted-foreground">{event.description}</p>}
          </li>
        )
      })}
    </ol>
  )
}

function EventCards({ events, empty }: { events: PortalEvent[]; empty: string }) {
  if (events.length === 0) return <EmptyState text={empty} />
  return (
    <div className="mt-4 space-y-3">
      {events.map((event) => (
        <div key={event.id} className="rounded-md border bg-surface/80 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-md">{event.typeLabel}</Badge>
            {event.event_date && <span className="portal-meta text-brand">{formatDate(event.event_date)}</span>}
          </div>
          <h3 className="portal-h3 mt-2">{event.title}</h3>
          {event.description && <p className="portal-body mt-1 text-muted-foreground">{event.description}</p>}
          {event.payloadSummary && <p className="portal-meta mt-2 font-semibold text-foreground">{event.payloadSummary}</p>}
        </div>
      ))}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="portal-body mt-4 rounded-md border border-dashed bg-surface/80 p-5 text-muted-foreground">{text}</div>
}

type PortalViewModel = ReturnType<typeof buildViewModel>
type PortalEvent = PortalViewModel['visibleEvents'][number]
type PortalComparable = PortalViewModel['estimate']['comparables'][number]

const TEST_PRICE_TREND = [
  { year: '2021', price: 3120 },
  { year: '2022', price: 3310 },
  { year: '2023', price: 3480 },
  { year: '2024', price: 3510 },
  { year: '2025', price: 3590 },
  { year: '2026', price: 3640 },
]

function buildViewModel(data: ClientPortalDossier, mode: 'session' | 'test') {
  const summary = buildSummary(data)
  const estimate = buildEstimate(data, mode)
  const visibleEvents = data.events
    .filter((event) => event.visible_to_client)
    .map((event) => ({
      ...event,
      typeLabel: eventTypeLabel(event.type),
      payloadSummary: summarizePayload(asRecord(event.payload)),
    }))

  const total = data.documents.length
  const provided = data.documents.filter((doc) => ['uploaded', 'validated'].includes(doc.status)).length
  const missing = data.documents.filter((doc) => ['missing', 'requested', 'rejected'].includes(doc.status)).length
  const progress = total ? Math.round((provided / total) * 100) : 0

  return {
    title: data.dossier.title,
    clientName: [data.profile.first_name, data.profile.last_name].filter(Boolean).join(' ').trim() || data.profile.first_name || 'et bienvenue',
    statusLabel: data.dossier.status === 'active' ? 'Dossier actif' : data.dossier.status,
    mandateType: text(asRecord(data.dossier.property_snapshot).mandate_type) ?? text(asRecord(data.dossier.professional_opinion).mandate_type),
    reference: text(asRecord(data.dossier.property_snapshot).mandate_number) ?? text(asRecord(data.dossier.professional_opinion).mandate_number) ?? (mode === 'test' ? 'M-2026-0814' : data.dossier.id.slice(0, 8)),
    currentStage: data.opportunity?.stage ?? data.lead?.status ?? 'En préparation',
    nextAction: data.opportunity?.next_action ?? data.lead?.next_action ?? 'Compléter les pièces utiles au dossier',
    summary,
    mapCenter: buildMapCenter(summary, mode),
    estimate,
    visibleEvents,
    documents: { total, provided, missing, progress },
    audience: buildAudience(data, mode),
    propertyHero: buildPropertyHero(data, summary, mode),
  }
}

function buildSummary(data: ClientPortalDossier) {
  const snapshot = asRecord(data.dossier.property_snapshot)
  const formData = asRecord(data.lead?.form_data ?? null)
  return {
    adresse: text(snapshot.adresse) ?? data.sellerProperty?.adresse ?? text(formData.adresse),
    commune: text(snapshot.commune) ?? data.lead?.commune ?? data.opportunity?.property_city,
    typeBien: text(snapshot.type_bien) ?? data.sellerProperty?.type_bien ?? data.opportunity?.property_type,
    surface: numberValue(snapshot.surface) ?? data.sellerProperty?.surface ?? data.opportunity?.property_surface,
    surfaceTerrain: numberValue(snapshot.surface_terrain) ?? data.sellerProperty?.surface_terrain ?? data.opportunity?.property_land_surface,
    rooms: numberValue(snapshot.nb_pieces) ?? data.sellerProperty?.nb_pieces ?? data.opportunity?.property_rooms,
    dpe: text(snapshot.dpe),
    equipments: text(snapshot.equipements),
    context: text(snapshot.contexte),
    delai: data.sellerProperty?.delai ?? text(formData.delai),
    lat:
      numberValue(snapshot.lat)
      ?? numberValue(snapshot.latitude)
      ?? data.sellerProperty?.lat
      ?? numberValue(formData.lat)
      ?? numberValue(formData.latitude)
      ?? null,
    lng:
      numberValue(snapshot.lng)
      ?? numberValue(snapshot.lon)
      ?? numberValue(snapshot.longitude)
      ?? data.sellerProperty?.lon
      ?? numberValue(formData.lng)
      ?? numberValue(formData.lon)
      ?? numberValue(formData.longitude)
      ?? null,
  }
}

function buildMapCenter(summary: ReturnType<typeof buildSummary>, mode: 'session' | 'test') {
  if (summary.lat !== null && summary.lng !== null) return { lat: summary.lat, lng: summary.lng }
  if (mode === 'test') return { lat: 43.4521, lng: 5.8623 }
  return null
}

function buildEstimate(data: ClientPortalDossier, mode: 'session' | 'test') {
  const results = asRecord(data.lead?.results ?? null)
  const snapshot = asRecord(data.dossier.property_snapshot)
  const opinion = asRecord(data.dossier.professional_opinion)
  const median =
    numberValue(opinion.price)
    ?? numberValue(opinion.prix_retenu)
    ?? numberValue(opinion.price_suggested)
    ?? numberValue(snapshot.prix_estime)
    ?? numberValue(results.valeur_mediane)
    ?? numberValue(results.prix_calcule)
    ?? data.sellerProperty?.prix_estime
    ?? null

  const low =
    numberValue(opinion.price_low)
    ?? numberValue(opinion.fourchette_basse)
    ?? numberValue(snapshot.fourchette_basse)
    ?? numberValue(results.fourchette_basse)
    ?? (median ? Math.round(median * 0.94) : null)

  const high =
    numberValue(opinion.price_high)
    ?? numberValue(opinion.fourchette_haute)
    ?? numberValue(snapshot.fourchette_haute)
    ?? numberValue(results.fourchette_haute)
    ?? (median ? Math.round(median * 1.06) : null)

  const commissionRate = numberValue(opinion.commission_rate) ?? 0.045
  const fees = median ? Math.round(median * commissionRate) : null

  return {
    median,
    low,
    high,
    fees,
    netSeller: median && fees ? median - fees : null,
    commissionRate,
    summary: text(opinion.summary) ?? text(opinion.market_context),
    arguments: listValue(opinion.arguments).length > 0 ? listValue(opinion.arguments) : fallbackArguments(data),
    comparables: comparableList(opinion.comparables, mode),
    priceTrend: priceTrendList(opinion.price_trend, mode),
  }
}

function buildAudience(data: ClientPortalDossier, mode: 'session' | 'test') {
  const opinion = asRecord(data.dossier.professional_opinion)
  const audience = asRecord(opinion.audience)
  return {
    views: {
      count: numberValue(audience.views_count) ?? numberValue(audience.views) ?? (mode === 'test' ? 1420 : null),
      change: numberValue(audience.views_change) ?? (mode === 'test' ? 12 : null),
    },
    contacts: {
      count: numberValue(audience.contacts_count) ?? numberValue(audience.contacts) ?? (mode === 'test' ? 28 : null),
      change: numberValue(audience.contacts_change) ?? (mode === 'test' ? 8 : null),
    },
  }
}

function buildPropertyHero(data: ClientPortalDossier, summary: ReturnType<typeof buildSummary>, mode: 'session' | 'test') {
  const snapshot = asRecord(data.dossier.property_snapshot)
  const opinion = asRecord(data.dossier.professional_opinion)
  const features = listValue(snapshot.features).length > 0
    ? listValue(snapshot.features)
    : [text(snapshot.exposition) ?? (mode === 'test' ? 'Exposition Sud' : null), text(snapshot.etat) ?? (mode === 'test' ? 'Calme absolu' : null), text(snapshot.equipements)?.split(',')[0]?.trim() ?? (mode === 'test' ? 'Piscine' : null)].filter((item): item is string => Boolean(item))

  return {
    typeLabel: text(snapshot.type_label) ?? text(snapshot.type_bien) ?? (mode === 'test' ? 'Villa Provençale Contemporaine' : 'Bien vendeur'),
    sector: text(snapshot.sector) ?? text(snapshot.territoire) ?? (mode === 'test' ? 'Provence Verte' : summary.commune ?? 'Secteur'),
    title: text(snapshot.hero_title) ?? data.dossier.title ?? (mode === 'test' ? 'Maison Provençale Plain-pied' : 'Projet de vente'),
    city: summary.commune ?? data.opportunity?.property_city ?? (mode === 'test' ? 'Saint-Maximin-la-Sainte-Baume' : 'Commune à confirmer'),
    bedrooms: numberValue(snapshot.chambres) ?? numberValue(snapshot.bedrooms) ?? (mode === 'test' ? 3 : null),
    description: text(snapshot.description) ?? text(opinion.property_description) ?? summary.context ?? (mode === 'test' ? 'Magnifique maison provençale plain-pied de 112 m² habitables, idéalement exposée plein sud au calme absolu. Vaste pièce de vie lumineuse avec cuisine ouverte, extérieurs soignés et prestations de qualité.' : 'Description du bien à compléter.'),
    features: features.length > 0 ? features.slice(0, 4) : ['Informations à compléter'],
  }
}

function fallbackArguments(data: ClientPortalDossier) {
  const snapshot = asRecord(data.dossier.property_snapshot)
  return [
    text(snapshot.equipements) ? `Équipements valorisants : ${text(snapshot.equipements)}` : null,
    text(snapshot.etat) ? `État général : ${text(snapshot.etat)}` : null,
    data.opportunity?.property_city ? `Secteur recherché : ${data.opportunity.property_city}` : null,
  ].filter((item): item is string => Boolean(item))
}

function comparableList(value: unknown, mode: 'session' | 'test') {
  if (!Array.isArray(value) || value.length === 0) return mode === 'test' ? testComparables() : []
  return value
    .map((item, index) => {
      const record = asRecord(item)
      const surface = numberValue(record.surface)
      const price = numberValue(record.price)
      const pricePerSqm = numberValue(record.price_per_sqm) ?? (surface && price ? Math.round(price / surface) : null)
      const coordinates = asRecord(record.coordinates)
      return {
        id: text(record.id) ?? `comp-${index + 1}`,
        title: text(record.title) ?? text(record.label) ?? 'Bien comparable',
        location: text(record.location),
        distance: text(record.distance) ?? `à ${index + 1} km`,
        surface,
        rooms: numberValue(record.rooms) ?? numberValue(record.nb_pieces),
        price,
        pricePerSqm,
        coordinates: {
          x: numberValue(coordinates.x) ?? numberValue(record.x) ?? [35, 65, 48][index % 3],
          y: numberValue(coordinates.y) ?? numberValue(record.y) ?? [35, 25, 70][index % 3],
        },
        lat: numberValue(record.lat) ?? numberValue(record.latitude),
        lng: numberValue(record.lng) ?? numberValue(record.lon) ?? numberValue(record.longitude),
      }
    })
    .slice(0, 6)
}

function testComparables() {
  return [
    {
      id: 'comp-1',
      title: 'Maison de plain-pied traditionnelle, piscine',
      location: 'Saint-Maximin',
      distance: 'à 450m',
      surface: 105,
      rooms: 4,
      price: 385000,
      pricePerSqm: 3666,
      coordinates: { x: 35, y: 35 },
      lat: 43.4558,
      lng: 5.8664,
    },
    {
      id: 'comp-2',
      title: 'Villa provençale arborée, quartier recherché',
      location: 'Saint-Maximin',
      distance: 'à 1.2 km',
      surface: 118,
      rooms: 5,
      price: 410000,
      pricePerSqm: 3474,
      coordinates: { x: 65, y: 25 },
      lat: 43.4494,
      lng: 5.8556,
    },
    {
      id: 'comp-3',
      title: 'Maison contemporaine avec dépendances, Saint-Maximin',
      location: 'Saint-Maximin',
      distance: 'à 800m',
      surface: 110,
      rooms: 4,
      price: 399000,
      pricePerSqm: 3627,
      coordinates: { x: 48, y: 70 },
      lat: 43.4587,
      lng: 5.8589,
    },
  ]
}

function priceTrendList(value: unknown, mode: 'session' | 'test') {
  if (!Array.isArray(value) || value.length === 0) return mode === 'test' ? TEST_PRICE_TREND : []
  return value
    .map((item) => {
      const record = asRecord(item)
      const year = text(record.year)
      const price = numberValue(record.price)
      return year && price ? { year, price } : null
    })
    .filter((item): item is { year: string; price: number } => Boolean(item))
}

function listValue(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => text(item)).filter((item): item is string => Boolean(item))
  if (typeof value === 'string') return value.split('\n').map((item) => item.trim()).filter(Boolean)
  return []
}

function summarizePayload(payload: Record<string, Json | undefined>) {
  const amount = numberValue(payload.amount)
  const buyer = text(payload.buyer_name)
  const rating = numberValue(payload.rating)
  return [buyer, amount ? formatPrice(amount) : null, rating ? `Intérêt ${rating}/5` : null].filter(Boolean).join(' · ')
}

function eventTypeLabel(type: string) {
  const labels: Record<string, string> = {
    milestone: 'Jalon',
    visit: 'Visite',
    offer: 'Offre',
    note: 'Note',
    document: 'Document',
    system: 'Info',
  }
  return labels[type] ?? type
}

function asRecord(value: unknown): Record<string, Json | undefined> {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) return value as Record<string, Json | undefined>
  return {}
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function numberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value.replace(/\s/g, '').replace(',', '.'))
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatPriceCompact(value: number) {
  return `${formatNumber(value)} €`
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(value)
}

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
