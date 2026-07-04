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
  Clock,
  Eye,
  FileText,
  Globe2,
  Home,
  Info,
  LogOut,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Phone,
  PhoneCall,
  Star,
  ShieldCheck,
  Sparkles,
  Sliders,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { ClientPortalDossier } from '@/lib/client-portal'
import type { Json } from '@/types/supabase'
import { ClientDocuments } from './client-documents'
import { ComparableLeafletMap } from './comparable-leaflet-map'
import { SignOutButton } from './sign-out-button'

const DEFAULT_CAL_URL = '/contact'

type PortalTab = 'dashboard' | 'valuation' | 'documents' | 'tracking'
type PortalMode = 'session' | 'test' | 'preview'

const TABS: Array<{ id: PortalTab; label: string; mobileLabel: string; icon: typeof Home }> = [
  { id: 'dashboard', label: 'Tableau de bord', mobileLabel: 'Accueil', icon: Home },
  { id: 'valuation', label: 'Mon estimation', mobileLabel: 'Prix', icon: TrendingUp },
  { id: 'documents', label: 'Mes documents', mobileLabel: 'Docs', icon: FileText },
  { id: 'tracking', label: 'Suivi de mandat', mobileLabel: 'Suivi', icon: CheckCircle2 },
]

export function ClientPortalView({
  data,
  mode = 'session',
  previewBackHref,
  showPreviewBanner = true,
}: {
  data: ClientPortalDossier
  mode?: PortalMode
  previewBackHref?: string
  showPreviewBanner?: boolean
}) {
  const [activeTab, setActiveTab] = useState<PortalTab>('dashboard')
  const vm = useMemo(() => buildViewModel(data, mode), [data, mode])
  const headerClientName = mode === 'test' ? 'Jean-Marc & Sylvie' : vm.clientName

  return (
    <main className="app-product client-portal min-h-screen bg-[#F8FAFC] pb-24 text-foreground">
      <header className="sticky top-0 z-40 border-b border-[#E2E8F0] bg-white/95 backdrop-blur">
        <div className="flex w-full px-3 py-2 sm:px-4 lg:px-6">
          <div className="grid min-h-12 w-full grid-cols-[auto_1fr_auto] items-center gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0077B6] text-[18px] font-extrabold leading-none text-white shadow-sm">
                iAD
              </span>
              <div className="min-w-0">
                <p className="truncate text-[17px] font-extrabold leading-none text-[#0F172A]">Alexandre Lopez immobilier</p>
                <p className="mt-0.5 truncate text-[10px] font-semibold leading-none text-[#64748B]">Provence Verte & Verdon</p>
              </div>
            </div>

            <nav className="mx-auto hidden rounded-full border border-[#E2E8F0] bg-[#F8FAFC] p-1 shadow-sm md:flex" aria-label="Navigation espace vendeur">
              {TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-[14px] font-extrabold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6] focus-visible:ring-offset-2 ${
                      isActive ? 'bg-[#0077B6] text-white shadow-sm' : 'text-[#64748B] hover:bg-white hover:text-[#0F172A]'
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden flex-col text-right lg:flex">
                <span className="max-w-44 truncate text-[15px] font-extrabold leading-none text-[#0F172A]">{headerClientName}</span>
                <span className="mt-0.5 flex items-center justify-end gap-1 text-[12px] font-extrabold leading-none text-[#10B981]">
                  <span className="size-2 rounded-full bg-[#10B981]" />
                  Vendeur
                </span>
              </div>
              <span className="hidden size-10 items-center justify-center rounded-full border border-[#B9DFF4] bg-[#E0F0FA] text-[#0077B6] shadow-sm sm:inline-flex">
                <User className="size-5" />
              </span>
              {mode === 'session' && <SignOutButton />}
              {mode === 'test' && (
                <button
                  type="button"
                  aria-label="Déconnexion"
                  className="hidden size-9 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A] sm:inline-flex"
                >
                  <LogOut className="size-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {mode === 'preview' && showPreviewBanner && (
        <div className="border-b border-[#B9DFF4] bg-[#E0F0FA] px-4 py-2 text-center text-xs font-extrabold text-[#0077B6]">
          Prévisualisation conseiller · les dépôts et actions vendeur sont désactivés.
          {previewBackHref && (
            <a href={previewBackHref} className="ml-2 underline underline-offset-2">
              Retour console
            </a>
          )}
        </div>
      )}

      <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-5 lg:px-6">
        {activeTab === 'dashboard' && <DashboardTab data={data} vm={vm} onNavigate={setActiveTab} />}
        {activeTab === 'valuation' && <ValuationTab vm={vm} />}
        {activeTab === 'documents' && <DocumentsTab data={data} vm={vm} readOnly={mode !== 'session'} />}
        {activeTab === 'tracking' && <TrackingTab vm={vm} mode={mode} />}
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
    <div className="space-y-6">
      <DashboardStatusCard vm={vm} />

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3" id="dashboard-kpis">
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

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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
                  <p className="text-[34px] font-extrabold leading-none tracking-tight text-[#0077B6]">{formatPriceCompact(safeSelectedPrice)}</p>
                </div>
                <div className="border-l border-[#E2E8F0] py-1 pl-6">
                  <p className="portal-label text-[#64748B]">Fourchette optimale</p>
                  <p className="text-lg font-extrabold leading-tight text-[#0F172A]">{formatPrice(low)} – {formatPrice(high)}</p>
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
              <p className="text-base font-extrabold text-[#0F172A]">{active.price ? formatPrice(active.price) : 'Vendu'}</p>
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
                <p className="text-base font-extrabold text-[#0F172A]">{comparable.price ? formatPrice(comparable.price) : 'Vendu'}</p>
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
    <ClientDocuments
      dossierId={data.dossier.id}
      documents={data.documents}
      readOnly={readOnly}
      commune={vm.summary.commune}
    />
  )
}

function TrackingTab({ vm, mode }: { vm: PortalViewModel; mode: PortalMode }) {
  const timeline = buildTrackingTimeline(vm, mode)
  const offers = buildOfferCards(vm, mode)
  const visits = buildVisitCards(vm, mode)

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_410px]">
        <TrackingTimelineCard steps={timeline} />

        <aside className="space-y-6">
          <TrackingAudienceCard vm={vm} />
          <MandateNoticeCard mandateType={vm.mandateType} />
        </aside>
      </section>

      <OfferManagementSection offers={offers} />
      <VisitReportsSection visits={visits} />
    </div>
  )
}

type TrackingStep = {
  id: string
  dateLabel: string
  title: string
  description: string
  state: 'done' | 'current' | 'future'
  badge?: string
}

type OfferCardModel = {
  id: string
  buyer: string
  dateLabel: string
  amount: number | null
  conditions: string
  status: 'active' | 'declined' | 'final'
}

type VisitCardModel = {
  id: string
  visitor: string
  dateLabel: string
  description: string
  rating: number | null
  status: 'done' | 'planned'
}

function TrackingTimelineCard({ steps }: { steps: TrackingStep[] }) {
  return (
    <section className="rounded-3xl border border-[#E2E8F0] bg-white px-6 py-7 shadow-sm md:px-8 md:py-8">
      <div>
        <h2 className="text-[20px] font-extrabold leading-tight text-[#0F172A]">Suivi de votre mandat pas à pas</h2>
        <p className="mt-1 text-[13px] leading-relaxed text-[#64748B]">Suivez la progression chronologique de la vente de votre villa.</p>
      </div>

      <ol className="relative mt-8 space-y-7 pl-10 before:absolute before:bottom-0 before:left-[10px] before:top-3 before:w-px before:bg-[#E2E8F0]">
        {steps.map((step) => {
          const current = step.state === 'current'
          const future = step.state === 'future'

          return (
            <li key={step.id} className="relative">
              <TimelineLineDot state={step.state} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className={`text-[12px] font-extrabold leading-none ${current ? 'text-[#0077B6]' : 'text-[#64748B]'}`}>
                    {step.dateLabel}
                  </p>
                  {step.badge && (
                    <span className="rounded-full border border-[#B9DFF4] bg-[#E0F0FA] px-3 py-1 text-[9px] font-extrabold uppercase leading-none text-[#6D9FBE]">
                      {step.badge}
                    </span>
                  )}
                </div>
                <h3 className={`mt-2 text-sm font-extrabold leading-snug ${future ? 'text-[#0F172A]' : current ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-[#8AA0BC]">{step.description}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function TimelineLineDot({ state }: { state: TrackingStep['state'] }) {
  if (state === 'done') {
    return (
      <span className="absolute -left-10 top-0.5 z-10 flex size-5 items-center justify-center rounded-full border-[3px] border-white bg-[#E0F0FA] text-[#0077B6] ring-2 ring-[#D4ECFA]">
        <CheckCircle2 className="size-3.5" />
      </span>
    )
  }

  if (state === 'current') {
    return (
      <span className="absolute -left-[42px] top-0 z-10 flex size-6 items-center justify-center rounded-full border-[4px] border-[#E0F0FA] bg-[#0077B6] text-white ring-2 ring-white">
        <span className="size-2 rounded-full bg-white" />
      </span>
    )
  }

  return (
    <span className="absolute -left-10 top-0.5 z-10 flex size-5 items-center justify-center rounded-full border-[3px] border-white bg-white ring-2 ring-[#CBD5E1]">
      <span className="size-2 rounded-full bg-white" />
    </span>
  )
}

function TrackingAudienceCard({ vm }: { vm: PortalViewModel }) {
  const sources = buildDiffusionSources(vm)
  const [activeSourceId, setActiveSourceId] = useState(sources[4]?.id ?? sources[0]?.id)
  const activeSource = sources.find((source) => source.id === activeSourceId) ?? sources[0]
  const totalViews = sources.slice(1).reduce((sum, source) => sum + source.views, 0)

  return (
    <section className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
      <h2 className="text-lg font-extrabold leading-tight text-[#0F172A]">Diffusion & Statistiques</h2>
      <p className="mt-1 text-xs leading-relaxed text-[#64748B]">
        Suivez l&apos;audience consolidée (Ombrelle) ou détaillez par portail immobilier.
      </p>

      <div className="mt-5 rounded-2xl bg-[#EEF4FA] p-1">
        <div className="flex flex-wrap gap-1">
          {sources.map((source) => (
            <button
              key={source.id}
              type="button"
              onClick={() => setActiveSourceId(source.id)}
              className={`min-h-8 rounded-lg px-3 text-[11px] font-extrabold leading-tight transition-colors ${
                activeSource.id === source.id
                  ? 'bg-[#10B981] text-white shadow-[inset_0_0_0_2px_#0077B6]'
                  : 'text-[#475569] hover:bg-white/70'
              }`}
            >
              {source.id === 'global' ? (
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                  <Globe2 className="size-3" />
                  {source.name}
                </span>
              ) : (
                <span className="whitespace-nowrap">{source.name}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <p className="text-[10px] font-extrabold uppercase leading-none text-[#8AA0BC]">Support de diffusion</p>
        <p className="mt-2 text-sm font-extrabold leading-none text-[#0F172A]">{activeSource.name}</p>
        <p className="mt-2 text-xs font-semibold leading-relaxed text-[#64748B]">{activeSource.description}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <DiffusionStat label="Vues" value={formatNumber(activeSource.views)} icon={Eye} tone="brand" />
        <DiffusionStat label="Engagement" value={`${activeSource.engagement} %`} icon={TrendingUp} tone="violet" />
        <DiffusionStat label="Appels" value={String(activeSource.calls)} icon={PhoneCall} tone="success" />
        <DiffusionStat label="Messages" value={String(activeSource.messages)} icon={MessageCircle} tone="warning" />
        <DiffusionStat label="Mises en favoris" value={activeSource.favorites} icon={Star} tone="pink" wide />
      </div>

      <div className="mt-5 border-t border-[#E2E8F0] pt-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-extrabold text-[#64748B]">Répartition des vues par support</p>
          <span className="text-[10px] font-extrabold uppercase text-[#0077B6]">Audience active</span>
        </div>
        <div className="mt-3 flex h-3 overflow-hidden rounded-full bg-[#E2E8F0]">
          {sources.slice(1).map((source) => (
            <span
              key={source.id}
              className="h-full"
              style={{
                width: `${totalViews ? (source.views / totalViews) * 100 : 0}%`,
                backgroundColor: source.color,
              }}
            />
          ))}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {sources.slice(1).map((source) => (
            <div key={source.id} className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748B]">
              <span className="size-2.5 rounded-full" style={{ backgroundColor: source.color }} />
              <span>
                {source.name} ({source.share}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-[#B26A00]">
        <strong>L&apos;avis d&apos;Alexandre :</strong> L&apos;annonce surpasse de +24% les performances moyennes des villas similaires à Saint-Maximin. L&apos;intérêt est très soutenu.
      </div>
    </section>
  )
}

type DiffusionSource = {
  id: string
  name: string
  description: string
  views: number
  engagement: number
  calls: number
  messages: number
  favorites: string
  share: number
  color: string
}

function buildDiffusionSources(vm: PortalViewModel): DiffusionSource[] {
  const fallback = buildFallbackDiffusionSources(vm)
  const saved = vm.audience.portals
  if (saved.length === 0) return fallback

  const savedById = new Map(saved.map((source) => [source.id, source]))
  const fallbackIds = new Set(fallback.map((source) => source.id))
  const supportTotal = saved
    .filter((source) => source.id !== 'global')
    .reduce((sum, source) => sum + source.views, 0)

  const merged = fallback.map((source) => {
    const override = savedById.get(source.id)
    if (!override) return source
    const favoriteCount = Number(override.favorites) || 0
    return {
      ...source,
      name: override.name || source.name,
      description: override.description || source.description,
      views: override.views,
      engagement: override.engagement,
      calls: override.calls,
      messages: override.messages,
      favorites: `${favoriteCount} ${favoriteCount > 1 ? 'acquéreurs' : 'acquéreur'}`,
      share: source.id === 'global' ? 100 : supportTotal ? Math.round((override.views / supportTotal) * 1000) / 10 : source.share,
    }
  })

  const extra = saved.filter((source) => !fallbackIds.has(source.id)).map((source, index) => {
    const favoriteCount = Number(source.favorites) || 0
    return {
      ...source,
      favorites: `${favoriteCount} ${favoriteCount > 1 ? 'acquéreurs' : 'acquéreur'}`,
      share: supportTotal ? Math.round((source.views / supportTotal) * 1000) / 10 : 0,
      color: ['#64748B', '#0EA5E9', '#14B8A6'][index % 3],
    }
  })

  return [...merged, ...extra]
}

function buildFallbackDiffusionSources(vm: PortalViewModel): DiffusionSource[] {
  const totalViews = vm.audience.views.count ?? 1420
  const contacts = vm.audience.contacts.count ?? 28
  const selogerViews = Math.max(1, Math.round(totalViews * 0.338))
  const leboncoinViews = Math.max(1, Math.round(totalViews * 0.366))
  const iadViews = Math.max(1, Math.round(totalViews * 0.218))
  const bieniciViews = totalViews === 1420 ? 110 : Math.max(1, totalViews - selogerViews - leboncoinViews - iadViews)

  return [
    {
      id: 'global',
      name: 'Global',
      description: 'Audience consolidée de tous les supports de diffusion.',
      views: totalViews,
      engagement: vm.audience.views.change ?? 12,
      calls: Math.max(1, Math.round(contacts * 0.35)),
      messages: Math.max(0, Math.round(contacts * 0.2)),
      favorites: `${Math.max(1, Math.round(contacts * 0.5))} acquéreurs`,
      share: 100,
      color: '#0077B6',
    },
    {
      id: 'seloger',
      name: 'SeLoger',
      description: 'Portail immobilier national à forte audience vendeurs et acquéreurs.',
      views: selogerViews,
      engagement: 3.1,
      calls: Math.max(1, Math.round(contacts * 0.18)),
      messages: Math.max(0, Math.round(contacts * 0.08)),
      favorites: `${Math.max(1, Math.round(contacts * 0.25))} acquéreurs`,
      share: 33.8,
      color: '#FF2E63',
    },
    {
      id: 'leboncoin',
      name: 'LeBonCoin',
      description: 'Support généraliste générant une forte visibilité locale.',
      views: leboncoinViews,
      engagement: 2.9,
      calls: Math.max(1, Math.round(contacts * 0.2)),
      messages: Math.max(0, Math.round(contacts * 0.1)),
      favorites: `${Math.max(1, Math.round(contacts * 0.3))} acquéreurs`,
      share: 36.6,
      color: '#FF9F1C',
    },
    {
      id: 'iad',
      name: 'iAD France',
      description: 'Diffusion réseau iAD auprès des acquéreurs qualifiés.',
      views: iadViews,
      engagement: 2.4,
      calls: Math.max(1, Math.round(contacts * 0.12)),
      messages: Math.max(0, Math.round(contacts * 0.06)),
      favorites: `${Math.max(1, Math.round(contacts * 0.18))} acquéreurs`,
      share: 21.8,
      color: '#123A63',
    },
    {
      id: 'bienici',
      name: "Bien'ici",
      description: 'Portail innovant avec cartographie 3D immersive.',
      views: bieniciViews,
      engagement: 2.7,
      calls: Math.max(1, Math.round(contacts * 0.04)),
      messages: 0,
      favorites: `${Math.max(1, Math.round(contacts * 0.08))} acquéreurs`,
      share: 7.8,
      color: '#00A896',
    },
  ]
}

function DiffusionStat({
  label,
  value,
  icon: Icon,
  tone,
  wide = false,
}: {
  label: string
  value: string
  icon: typeof Home
  tone: 'brand' | 'violet' | 'success' | 'warning' | 'pink'
  wide?: boolean
}) {
  const tones = {
    brand: 'bg-[#E0F0FA] text-[#0077B6]',
    violet: 'bg-violet-50 text-violet-600',
    success: 'bg-emerald-50 text-emerald-600',
    warning: 'bg-orange-50 text-orange-500',
    pink: 'bg-pink-50 text-pink-600',
  }

  return (
    <div className={`rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 ${wide ? 'col-span-2' : ''}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-extrabold uppercase leading-none text-[#8AA0BC]">{label}</p>
          <p className="mt-2 truncate text-xl font-extrabold leading-none text-[#0F172A]">{value}</p>
        </div>
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-5" />
        </span>
      </div>
    </div>
  )
}

function TrackingMetricCard({
  label,
  value,
  change,
  icon: Icon,
  tone,
  points,
}: {
  label: string
  value: number | null
  change: number | null
  icon: typeof Home
  tone: 'brand' | 'violet'
  points: number[]
}) {
  const color = tone === 'brand' ? '#0077B6' : '#8B5CF6'
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#64748B]">{label}</p>
          <p className="text-xl font-extrabold leading-none text-[#0F172A]">
            {value === null ? '—' : formatNumber(value)}
            {change !== null && <span className="ml-1 text-xs font-extrabold text-[#10B981]">(+{change}%)</span>}
          </p>
        </div>
        <Icon className="size-4" style={{ color }} />
      </div>
      <MiniSparkline color={color} points={points} />
    </div>
  )
}

function MiniSparkline({ color, points }: { color: string; points: number[] }) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const spread = Math.max(1, max - min)
  const plotted = points.map((point, index) => {
    const x = 10 + index * (120 / Math.max(1, points.length - 1))
    const y = 42 - ((point - min) / spread) * 28
    return `${x},${y}`
  }).join(' ')

  return (
    <svg className="mt-3 h-12 w-full" viewBox="0 0 140 52" aria-hidden="true">
      <polyline fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" points={plotted} />
    </svg>
  )
}

function MandateNoticeCard({ mandateType }: { mandateType: string | null }) {
  return (
    <section className="rounded-3xl border border-[#B9DFF4] bg-[#EAF6FC] p-6">
      <div className="flex gap-4">
        <Award className="mt-0.5 size-6 shrink-0 text-[#0077B6]" />
        <div>
          <h2 className="text-sm font-extrabold uppercase text-[#0F172A]">{mandateType || 'Mandat de vente exclusif (OS)'}</h2>
          <p className="mt-2 text-xs leading-relaxed text-[#64748B]">
            Profitez de la force de diffusion nationale du réseau iAD : diffusion illimitée de l&apos;annonce sur plus de 100 portails français et internationaux jusqu&apos;à la signature de l&apos;acte authentique.
          </p>
        </div>
      </div>
    </section>
  )
}

function OfferManagementSection({ offers }: { offers: OfferCardModel[] }) {
  return (
    <section className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-[20px] font-extrabold text-[#0F172A]">Gestion des offres d&apos;achat</h2>
      <p className="mt-1 text-sm text-[#64748B]">Consultez les offres d&apos;achat écrites transmises par les acquéreurs.</p>
      {offers.length > 0 ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {offers.map((offer) => <OfferCard key={offer.id} offer={offer} />)}
        </div>
      ) : (
        <EmptyState text="Les offres écrites validées par Alexandre apparaîtront ici." />
      )}
    </section>
  )
}

function OfferCard({ offer }: { offer: OfferCardModel }) {
  const declined = offer.status === 'declined'
  return (
    <article className={`rounded-2xl border p-6 ${declined ? 'border-[#FDB9B9] bg-white text-[#64748B]' : 'border-[#E2E8F0] bg-white'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold text-[#64748B]">Acheteur :</p>
          <h3 className="text-base font-extrabold text-[#0F172A]">{offer.buyer}</h3>
          <p className="text-xs text-[#94A3B8]">Transmise le {offer.dateLabel}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-extrabold text-[#64748B]">Montant proposé :</p>
          <p className="text-xl font-extrabold text-[#0F172A]">{offer.amount ? formatPriceCompact(offer.amount) : 'À consulter'}</p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
        <p className="flex items-center gap-2 text-xs font-extrabold text-[#0F172A]">
          <FileText className="size-4 text-[#0077B6]" />
          Conditions & Financement :
        </p>
        <p className="mt-2 text-xs leading-relaxed text-[#334155]">{offer.conditions}</p>
      </div>

      <div className="mt-6 border-t border-[#E2E8F0] pt-5">
        {declined ? (
          <p className="flex items-center gap-2 text-xs font-semibold text-[#EF4444]">
            <Clock className="size-4 text-[#94A3B8]" />
            Statut final : Offre déclinée
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <button type="button" aria-disabled className="h-10 rounded-full bg-[#10B981] px-4 text-xs font-extrabold text-white">Accepter l&apos;offre</button>
            <button type="button" aria-disabled className="h-10 rounded-full border border-[#E2E8F0] bg-white px-4 text-xs font-extrabold text-[#0F172A]">Contre-proposer</button>
            <button type="button" aria-disabled className="h-10 rounded-full px-4 text-xs font-extrabold text-[#EF4444]">Refuser</button>
          </div>
        )}
      </div>
    </article>
  )
}

function VisitReportsSection({ visits }: { visits: VisitCardModel[] }) {
  return (
    <section className="rounded-3xl border border-[#E2E8F0] bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-[20px] font-extrabold text-[#0F172A]">Comptes-rendus des visites physiques</h2>
      <p className="mt-1 text-sm text-[#64748B]">Suivi en temps réel des réactions à chaud des acquéreurs potentiels.</p>
      {visits.length > 0 ? (
        <div className="mt-6 space-y-4">
          {visits.map((visit) => <VisitReportCard key={visit.id} visit={visit} />)}
        </div>
      ) : (
        <EmptyState text="Les comptes-rendus de visites apparaîtront ici." />
      )}
    </section>
  )
}

function VisitReportCard({ visit }: { visit: VisitCardModel }) {
  const done = visit.status === 'done'
  return (
    <article className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#64748B]">
              <CalendarDays className="size-4 text-[#0077B6]" />
              {visit.dateLabel}
            </span>
            <h3 className="text-sm font-extrabold text-[#0F172A]">{visit.visitor}</h3>
            <span className={`rounded-full px-3 py-1 text-[10px] font-extrabold uppercase leading-none ${
              done ? 'bg-[#ECFDF5] text-[#10B981] ring-1 ring-[#9BE7C0]' : 'bg-[#FFF8E8] text-[#B26A00] ring-1 ring-[#F5C56B]'
            }`}>
              {done ? 'Visite effectuée' : 'Visite programmée'}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#334155]">{visit.description}</p>
        </div>
        {visit.rating !== null && (
          <div className="shrink-0 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-xs font-extrabold text-[#64748B]">
            Intérêt : <span className="text-amber-500">{ratingStars(visit.rating)}</span>
          </div>
        )}
      </div>
    </article>
  )
}

function AdvisorPanel() {
  const [imageError, setImageError] = useState(false)

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:p-6">
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
    <section className="relative overflow-hidden rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
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

        <div className="flex items-center gap-3 rounded-2xl border border-[#10B981]/20 bg-[#10B981]/10 p-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981]">
            <CheckCircle2 className="size-4" />
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
      className="portal-kpi-card group p-5 text-left transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6] focus-visible:ring-offset-2"
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
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
          <Icon className="size-5" />
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
    <section className="rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm md:p-6">
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
            className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-3.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6] focus-visible:ring-offset-2 ${
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
    <section className="flex flex-col justify-between rounded-3xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
      <div className="space-y-2">
        <h2 className="portal-h2 text-[#0F172A]">Diffusion & Audience</h2>
        <p className="portal-body text-[#64748B]">
          Audience consolidée des portails SeLoger, LeBonCoin, Logic-Immo & Réseau iAD.
        </p>
      </div>

      <div className="mt-6 space-y-4">
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
        className="portal-button-text mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-[#E2E8F0] bg-white py-3 text-[#0F172A] transition-colors hover:bg-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0077B6]"
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
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
      <div className="flex items-center gap-4">
        <span className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${tone === 'brand' ? 'bg-[#E0F0FA] text-[#0077B6]' : 'bg-violet-50 text-violet-600'}`}>
          <Icon className="size-5" />
        </span>
        <div>
          <p className="portal-h3 text-[#64748B]">{label}</p>
          <p className="text-lg font-extrabold tracking-tight text-[#0F172A]">{value === null ? '—' : formatNumber(value)}</p>
        </div>
      </div>
      <span className="whitespace-nowrap rounded-full bg-[#10B981]/10 px-2 py-1 text-[11px] font-extrabold leading-none text-[#10B981]">
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
    <div className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-center">
      <p className="portal-label text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm font-extrabold leading-tight text-[#0F172A]">{value}</p>
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
      className={`app-panel rounded-3xl border-[#E2E8F0] shadow-sm transition-shadow ${
        tone === 'brand' ? 'bg-[#E0F0FA]/65' : 'bg-white'
      }`}
    >
      <CardContent className="p-4 sm:p-5">{children}</CardContent>
    </Card>
  )
}

function MiniInfo({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Home }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#E0F0FA] text-[#0077B6]">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="portal-label block text-[#64748B]">{label}</span>
        <span className="portal-button-text mt-1 block truncate text-[#0F172A]">{value}</span>
      </span>
    </div>
  )
}

function MiniValue({ label, value, tone }: { label: string; value: string; tone?: 'brand' | 'warning' }) {
  return (
    <div className={`rounded-2xl border p-3 ${tone === 'brand' ? 'border-[#0077B6]/15 bg-[#E0F0FA]' : 'border-[#E2E8F0] bg-white'}`}>
      <p className="portal-label text-[#64748B]">{label}</p>
      <p className={`portal-button-text mt-1 ${tone === 'brand' ? 'text-[#0077B6]' : tone === 'warning' ? 'text-[#B26A00]' : 'text-[#0F172A]'}`}>{value}</p>
    </div>
  )
}

function TimelineList({ events, compact = false }: { events: PortalEvent[]; compact?: boolean }) {
  if (events.length === 0) return <EmptyState text="Les jalons visibles seront ajoutés par Alexandre." />
  return (
    <ol className={`relative ml-4 mt-5 border-l-2 border-[#E2E8F0] pl-5 ${compact ? 'space-y-4' : 'space-y-6'}`}>
      {events.map((event) => {
        const isDone = event.status === 'done'
        return (
          <li key={event.id} className="relative">
            <span className={`absolute -left-[31px] top-1 flex size-5 items-center justify-center rounded-full border-4 border-white ${isDone ? 'bg-[#10B981] text-white' : 'bg-white text-[#64748B] ring-1 ring-[#E2E8F0]'}`}>
              {isDone ? <CheckCircle2 className="size-3" /> : <Clock className="size-3" />}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {event.event_date && <span className="portal-meta text-[#0077B6]">{formatDate(event.event_date)}</span>}
              <Badge variant="outline" className="rounded-full border-[#E2E8F0] bg-white text-[#64748B]">{event.typeLabel}</Badge>
              {event.status !== 'done' && <Badge variant="outline" className="rounded-full border-[#0077B6]/20 bg-[#E0F0FA] text-[#0077B6]">En cours</Badge>}
            </div>
            <h3 className="portal-h3 mt-1 text-[#0F172A]">{event.title}</h3>
            {event.description && <p className="portal-body mt-1 text-[#64748B]">{event.description}</p>}
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
        <div key={event.id} className="rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full border-[#E2E8F0] bg-white text-[#64748B]">{event.typeLabel}</Badge>
            {event.event_date && <span className="portal-meta text-[#0077B6]">{formatDate(event.event_date)}</span>}
          </div>
          <h3 className="portal-h3 mt-2 text-[#0F172A]">{event.title}</h3>
          {event.description && <p className="portal-body mt-1 text-[#64748B]">{event.description}</p>}
          {event.payloadSummary && <p className="portal-meta mt-2 font-semibold text-[#0F172A]">{event.payloadSummary}</p>}
        </div>
      ))}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <div className="portal-body mt-4 rounded-2xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC] p-5 text-[#64748B]">{text}</div>
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

function buildTrackingTimeline(vm: PortalViewModel, mode: PortalMode): TrackingStep[] {
  const milestoneEvents = vm.visibleEvents.filter((event) => !['visit', 'offer', 'document', 'system'].includes(event.type))
  const source = milestoneEvents.length > 0 && mode !== 'test' ? milestoneEvents : []

  if (source.length > 0) {
    return source.map((event, index) => {
      const done = event.status === 'done'
      const current = !done && index === source.findIndex((item) => item.status !== 'done')
      return {
        id: event.id,
        dateLabel: event.event_date ? formatDate(event.event_date) : done ? 'Étape réalisée' : 'À venir',
        title: event.title,
        description: event.description ?? 'Alexandre mettra cette étape à jour dès qu’une information utile sera disponible.',
        state: done ? 'done' : current ? 'current' : 'future',
        badge: current ? 'Étape en cours' : undefined,
      }
    })
  }

  return [
    {
      id: 'estimate',
      dateLabel: '12 Mai 2026',
      title: 'Estimation & Avis de valeur',
      description: 'Visite technique du bien et remise du rapport d’estimation détaillé par Alexandre.',
      state: 'done',
    },
    {
      id: 'exclusive',
      dateLabel: '14 Mai 2026',
      title: 'Signature du mandat exclusif',
      description: 'Mise en place de la stratégie commerciale exclusive et constitution du dossier initial.',
      state: 'done',
    },
    {
      id: 'shooting',
      dateLabel: '20 Mai 2026',
      title: 'Shooting photo pro & Visite virtuelle 3D',
      description: 'Prise de clichés haute définition et numérisation 3D immersive par un photographe professionnel.',
      state: 'done',
    },
    {
      id: 'launch',
      dateLabel: '24 Mai 2026',
      title: 'Lancement de la commercialisation',
      description: 'Publication sur plus de 100 portails immobiliers nationaux et internationaux.',
      state: 'done',
    },
    {
      id: 'current-visits',
      dateLabel: 'En cours (Juin-Juillet 2026)',
      title: 'Visites qualifiées & retours acquéreurs',
      description: 'Sélection rigoureuse des profils, vérification des plans de financement, visites physiques et comptes-rendus hebdomadaires.',
      state: 'current',
      badge: 'Étape en cours',
    },
    {
      id: 'negotiation',
      dateLabel: 'Prochaine étape (Est. Fin Juillet)',
      title: 'Négociation & Signature du compromis',
      description: 'Analyse des offres d’achat écrites, contre-propositions et rédaction du compromis chez le notaire choisi.',
      state: 'future',
    },
    {
      id: 'signature',
      dateLabel: 'Est. Octobre 2026',
      title: 'Acte de vente authentique',
      description: 'Levée des conditions suspensives, virement des fonds par la banque et remise des clés.',
      state: 'future',
    },
  ]
}

function buildOfferCards(vm: PortalViewModel, mode: PortalMode): OfferCardModel[] {
  const events = vm.visibleEvents.filter((event) => event.type === 'offer')
  if (events.length > 0 && mode !== 'test') return events.map(offerFromEvent)

  if (mode === 'test') {
    return [
      {
        id: 'offer-giraud',
        buyer: 'M. & Mme Giraud',
        dateLabel: '29 Juin 2026',
        amount: 382000,
        conditions: 'Sous condition d’obtention de prêt de 262 000 € (apport personnel de 120 000 € déjà vérifié auprès de l’établissement financier).',
        status: 'active',
      },
      {
        id: 'offer-horizon',
        buyer: 'SCI Provence Horizon (M. Blanc)',
        dateLabel: '12 Juin 2026',
        amount: 360000,
        conditions: 'Paiement comptant sans condition de prêt bancaire. Offre refusée car le vendeur a jugée trop basse.',
        status: 'declined',
      },
    ]
  }

  return events.map(offerFromEvent)
}

function offerFromEvent(event: PortalEvent): OfferCardModel {
  const payload = asRecord(event.payload)
  const status = text(payload.status) ?? event.status
  return {
    id: event.id,
    buyer: text(payload.buyer_name) ?? event.title,
    dateLabel: event.event_date ? formatDate(event.event_date) : 'date à confirmer',
    amount: numberValue(payload.amount),
    conditions: text(payload.conditions) ?? event.description ?? 'Conditions transmises par Alexandre.',
    status: status === 'declined' || status === 'refused' || status === 'done' ? 'declined' : 'active',
  }
}

function buildVisitCards(vm: PortalViewModel, mode: PortalMode): VisitCardModel[] {
  const events = vm.visibleEvents.filter((event) => event.type === 'visit')
  if (events.length > 0 && mode !== 'test') return events.map(visitFromEvent)

  if (mode === 'test') {
    return [
      {
        id: 'visit-giraud',
        visitor: 'M. & Mme Giraud',
        dateLabel: '28 Juin 2026',
        description: 'Très fort intérêt pour la pièce à vivre et l’espace piscine. Ils apprécient l’exposition et le calme absolu. Financement validé par courtier, ils étudient une offre.',
        rating: 5,
        status: 'done',
      },
      {
        id: 'visit-dufour',
        visitor: 'Famille Dufour',
        dateLabel: '24 Juin 2026',
        description: 'Maison coup de cœur pour les parents, mais le terrain est jugé un peu trop en pente. Ils s’orientent vers un autre bien en centre-ville.',
        rating: 3,
        status: 'done',
      },
      {
        id: 'visit-roux',
        visitor: 'M. Bastien Roux',
        dateLabel: '18 Juin 2026',
        description: 'Investisseur cherchant sa résidence secondaire. Très emballé par la cuisine d’été et la qualité des prestations, mais trouve le prix un peu haut.',
        rating: 4,
        status: 'done',
      },
      {
        id: 'visit-vautier',
        visitor: 'Mme Claire Vautier',
        dateLabel: '04 Juillet 2026',
        description: 'Profil sérieusement sélectionné : mutation professionnelle d’Aix-en-Provence. Budget pré-approuvé. Visite fixée ce samedi à 10h.',
        rating: null,
        status: 'planned',
      },
    ]
  }

  return events.map(visitFromEvent)
}

function visitFromEvent(event: PortalEvent): VisitCardModel {
  const payload = asRecord(event.payload)
  return {
    id: event.id,
    visitor: text(payload.buyer_name) ?? text(payload.visitor_name) ?? event.title,
    dateLabel: event.event_date ? formatDate(event.event_date) : 'date à confirmer',
    description: event.description ?? 'Compte-rendu à compléter par Alexandre.',
    rating: numberValue(payload.rating),
    status: event.status === 'done' ? 'done' : 'planned',
  }
}

function ratingStars(value: number) {
  const rounded = Math.max(0, Math.min(5, Math.round(value)))
  return '★'.repeat(rounded) + '☆'.repeat(5 - rounded)
}

function buildViewModel(data: ClientPortalDossier, mode: PortalMode) {
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

function buildMapCenter(summary: ReturnType<typeof buildSummary>, mode: PortalMode) {
  if (summary.lat !== null && summary.lng !== null) return { lat: summary.lat, lng: summary.lng }
  if (mode === 'test') return { lat: 43.4521, lng: 5.8623 }
  return null
}

function buildEstimate(data: ClientPortalDossier, mode: PortalMode) {
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

function buildAudience(data: ClientPortalDossier, mode: PortalMode) {
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
    portals: audiencePortalList(audience.portals),
  }
}

function audiencePortalList(value: Json | undefined): Array<Omit<DiffusionSource, 'share' | 'color'>> {
  const portals = asRecord(value)
  const ids = ['global', 'seloger', 'leboncoin', 'iad', 'bienici', 'autre']

  return ids.flatMap((id) => {
    const portal = asRecord(portals[id])
    const views = numberValue(portal.views)
    if (views === null) return []
    const name = text(portal.name)
    const description = text(portal.description)
    return [{
      id,
      name: name ?? id,
      description: description ?? '',
      views,
      engagement: numberValue(portal.engagement) ?? 0,
      calls: numberValue(portal.calls) ?? 0,
      messages: numberValue(portal.messages) ?? 0,
      favorites: String(numberValue(portal.favorites) ?? 0),
    }]
  })
}

function buildPropertyHero(data: ClientPortalDossier, summary: ReturnType<typeof buildSummary>, mode: PortalMode) {
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

function comparableList(value: unknown, mode: PortalMode) {
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

function priceTrendList(value: unknown, mode: PortalMode) {
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
