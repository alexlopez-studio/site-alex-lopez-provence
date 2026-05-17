'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Phone,
  CheckCircle,
  ArrowRight,
  Database,
  MapPin,
  Calculator,
  PartyPopper,
  Target,
  Lightbulb,
  ShieldCheck,
  Zap,
  Ruler,
  Building2,
  Clock,
  Users,
  Handshake,
  Trees,
  Smile,
  Home as HomeIcon,
  Car,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Search,
  ClipboardCheck,
  AlertTriangle,
  Euro,
  Wallet,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

type ToolType = 'vendre' | 'acheter' | 'audit'

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0)
}
function fmt0(n: number): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n || 0)
}

interface LeadData {
  prenom?: string
  adresse?: string
  type_bien?: string
  surface?: number
  nb_pieces?: number
  etat?: string
  delai?: string
  dpe?: string
  equipements?: string[]
  annee_construction?: number
}
interface AcheterData {
  prenom?: string
  type_bien?: string
  communes?: string
  budget_max?: number
  surface_min?: number
  nb_pieces_min?: number
  criteres?: string[]
  apport?: number
  accord_bancaire?: string
  primo_accedant?: string
}
interface AuditData {
  prenom?: string
  adresse?: string
  type_bien?: string
  surface?: number
  etat_toiture?: string
  etat_facade?: string
  etat_menuiseries?: string
  etat_plomberie?: string
  etat_electricite?: string
  humidite?: string
  isolation?: string[]
  type_chauffage?: string
  dpe?: string
  qualite?: string
  objectif?: string
}
interface AjustementBreakdown { key: string; label: string; pct: number; montant_eur: number; sign: 'positive' | 'negative' | 'neutral' }
interface StrategiePrix { probabilite_vente_rapide_pct: number; delai_estime: string; frequence_visites: string; negociation: string }
interface EstimResult {
  fourchette_basse: number; fourchette_haute: number; valeur_mediane: number
  prix_m2_median: number; prix_m2_brut_dvf: number; nb_transactions: number
  rayon_km: number; source: 'dvf' | 'fallback'; confiance: number
  prix_de_base: number; ajustements: AjustementBreakdown[]
  total_ajustement_pct: number; total_ajustement_eur: number
  prix_calcule: number; strategie: StrategiePrix; points_forts: string[]
}
interface AuditResult {
  score_global: number
  score_structure: number
  score_energie: number
  score_confort: number
  points_forts: string[]
  points_attention: string[]
  recommandations: string[]
  budget_travaux_estime?: { min: number; max: number }
}

const BIEN_LBL: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', commerce: 'Commerce', immeuble: 'Immeuble', autre: 'Autre' }
const ETAT_LBL: Record<string, string> = { neuf: 'Neuf / récent', tres_bon_etat: 'Très bon état', bon_etat: 'Bon état', rafraichir: 'À rafraîchir', travaux: 'Travaux importants' }
const OBJECTIF_LBL: Record<string, string> = { vente: 'Vente', achat: 'Achat', renovation: 'Rénovation', energie: 'Énergie' }

export interface ResultatsClientInitialData {
  data: Record<string, unknown>
  est: Record<string, unknown>
}

export interface ResultatsClientProps {
  initialData?: ResultatsClientInitialData
}

export default function ResultatsClient({ initialData }: ResultatsClientProps = {}) {
  const [tool, setTool] = useState<ToolType>('vendre')
  const [data, setData] = useState<Record<string, unknown>>(
    initialData ? initialData.data : {},
  )
  const [est, setEst] = useState<EstimResult | null>(
    initialData ? (initialData.est as unknown as EstimResult) : null,
  )
  const [loading, setLoading] = useState(initialData == null)

  useEffect(function () {
    if (initialData) return

    async function load() {
      const current = resolveLatestToolResult()
      setTool(current.type)
      setData(current.answers)

      if (current.type === 'vendre') {
        const leadData = current.answers as LeadData
        const lat = current.answers.lat
        const lng = current.answers.lng
        if (typeof lat === 'number' && typeof lng === 'number' && leadData.surface) {
          try {
            const res = await fetch('/api/estimation', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                lat,
                lng,
                surface: leadData.surface,
                type_bien: leadData.type_bien ?? 'maison',
                etat: leadData.etat ?? 'bon_etat',
                dpe: leadData.dpe ?? 'D',
                equipements: leadData.equipements ?? [],
                delai: leadData.delai ?? '3_6_mois',
              }),
            })
            if (res.ok) {
              const estData = await res.json()
              setEst(estData)
            }
          } catch { /* fallback */ }
        }
      }
      setLoading(false)
    }
    load()
  }, [initialData])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-base text-muted">Préparation de vos résultats...</p>
      </div>
    )
  }

  if (tool === 'acheter') return <AcheterResults data={data as AcheterData} />
  if (tool === 'audit') return <AuditResults data={data as AuditData} />

  if (!est || est.valeur_mediane <= 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-6 text-muted">Estimation indisponible. Reprenez le simulateur pour relancer le calcul.</p>
        <Button asChild variant="primary"><Link href="/outils/vendre">Refaire une estimation</Link></Button>
      </div>
    )
  }

  return <VendreResults data={data as LeadData} est={est} />
}

function resolveLatestToolResult(): { type: ToolType; answers: Record<string, unknown>; updatedAt: number } {
  const candidates = [
    readPersistedStore('vendre-store', 'vendre'),
    readPersistedStore('acheter-store', 'acheter'),
    readPersistedStore('audit-store', 'audit'),
  ].filter((item): item is { type: ToolType; answers: Record<string, unknown>; updatedAt: number } => Boolean(item))

  if (candidates.length === 0) return { type: 'vendre', answers: {}, updatedAt: 0 }

  return candidates.sort(function (a, b) {
    const byDate = b.updatedAt - a.updatedAt
    if (byDate !== 0) return byDate
    return completionScore(b.answers) - completionScore(a.answers)
  })[0]
}

function readPersistedStore(key: string, type: ToolType) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    const state = parsed?.state ?? parsed
    const answers = state?.answers
    if (!answers || typeof answers !== 'object') return null
    return {
      type,
      answers: answers as Record<string, unknown>,
      updatedAt: typeof state.updatedAt === 'number' ? state.updatedAt : completionScore(answers as Record<string, unknown>),
    }
  } catch {
    return null
  }
}

function completionScore(answers: Record<string, unknown>): number {
  return Object.values(answers).filter(function (value) {
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== ''
  }).length
}

function VendreResults({ data, est }: { data: LeadData; est: EstimResult }) {
  return (
    <div className="min-h-screen bg-surface">
      <ResultHeader label="Résultat estimation" />
      <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <CardEstimation est={est} prenom={data.prenom} />
        <CardCalcul est={est} data={data} />
        <CardDetail est={est} />
        <CardStrategie est={est} />
        <CardEnvironnement />
        <CardCtaFinale />
        <div className="pt-2 text-center">
          <Link href="/outils/vendre" className="text-sm text-muted transition-colors hover:text-brand">
            Faire une nouvelle estimation
          </Link>
        </div>
      </main>
    </div>
  )
}

function AcheterResults({ data }: { data: AcheterData }) {
  const budget = data.budget_max ?? 0
  const apport = data.apport ?? 0
  const apportPct = budget > 0 ? Math.round((apport / budget) * 100) : 0
  const priority = buildBuyerPriorities(data)
  return (
    <div className="min-h-screen bg-surface">
      <ResultHeader label="Résultat achat" />
      <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger} className="rounded-2xl border border-border bg-white p-8 text-center lg:p-10">
          <motion.p variants={fadeInUp} className="mb-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand"><Search size={14} /> Votre projet d’achat</motion.p>
          <motion.h1 variants={fadeInUp} className="mb-4 font-serif text-4xl font-medium leading-tight tracking-[-0.04em] text-foreground sm:text-5xl">{data.prenom ? data.prenom + ', votre recherche est cadrée.' : 'Votre recherche est cadrée.'}</motion.h1>
          <motion.p variants={fadeInUp} className="mx-auto max-w-xl text-sm leading-relaxed text-muted">Voici une synthèse exploitable pour éviter les visites inutiles, clarifier vos priorités et préparer les prochains échanges.</motion.p>
        </motion.section>
        <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger} className="rounded-2xl border border-border bg-white p-7 lg:p-9">
          <motion.h2 variants={fadeInUp} className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-foreground"><Target size={20} className="text-brand" /> Cible de recherche</motion.h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoTile icon={HomeIcon} label="Type de bien" value={BIEN_LBL[data.type_bien ?? ''] ?? data.type_bien ?? 'À préciser'} />
            <InfoTile icon={MapPin} label="Communes" value={data.communes ?? 'À préciser'} />
            <InfoTile icon={Euro} label="Budget maximum" value={budget ? fmt(budget) : 'À préciser'} />
            <InfoTile icon={Ruler} label="Surface minimum" value={data.surface_min ? data.surface_min + ' m²' : 'À préciser'} />
          </div>
        </motion.section>
        <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger} className="rounded-2xl border border-border bg-white p-7 lg:p-9">
          <motion.h2 variants={fadeInUp} className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-foreground"><Wallet size={20} className="text-brand" /> Lecture budget</motion.h2>
          <div className="rounded-xl bg-brand-light p-5">
            <p className="text-sm font-semibold text-brand">Apport estimé : {apport ? fmt(apport) : 'à préciser'}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{apportPct > 0 ? 'Soit environ ' + apportPct + '% du budget maximum indiqué.' : 'Une simulation bancaire permettra de confirmer précisément l’enveloppe.'}</p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <InfoTile icon={ShieldCheck} label="Accord bancaire" value={data.accord_bancaire ?? 'À vérifier'} />
            <InfoTile icon={Users} label="Primo-accédant" value={data.primo_accedant ?? 'À préciser'} />
          </div>
        </motion.section>
        <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger} className="rounded-2xl border border-border bg-white p-7 lg:p-9">
          <motion.h2 variants={fadeInUp} className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-foreground"><Lightbulb size={20} className="text-brand" /> Prochaines actions</motion.h2>
          <ActionList items={priority} />
        </motion.section>
        <CardCtaTools title="Affiner cette recherche ?" text="Je peux relire vos critères, vérifier les secteurs cohérents avec votre budget et vous aider à prioriser les bonnes visites." />
      </main>
    </div>
  )
}

function AuditResults({ data }: { data: AuditData }) {
  const result = useMemo(function () { return buildAuditResult(data) }, [data])
  return (
    <div className="min-h-screen bg-surface">
      <ResultHeader label="Résultat audit" />
      <main className="mx-auto max-w-3xl space-y-6 px-6 py-10">
        <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger} className="rounded-2xl border border-border bg-white p-8 text-center lg:p-10">
          <motion.p variants={fadeInUp} className="mb-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand"><ClipboardCheck size={14} /> Audit immobilier</motion.p>
          <motion.p variants={fadeInUp} className="mb-3 font-serif text-6xl font-medium text-brand">{result.score_global}/100</motion.p>
          <motion.h1 variants={fadeInUp} className="mb-4 font-serif text-3xl font-medium leading-tight tracking-[-0.04em] text-foreground sm:text-4xl">{auditScoreLabel(result.score_global)}</motion.h1>
          <motion.p variants={fadeInUp} className="mx-auto max-w-xl text-sm leading-relaxed text-muted">Ce score donne un premier repère. Il ne remplace pas un diagnostic professionnel, mais il aide à identifier les points à vérifier en priorité.</motion.p>
        </motion.section>
        <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger} className="rounded-2xl border border-border bg-white p-7 lg:p-9">
          <motion.h2 variants={fadeInUp} className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-foreground"><Calculator size={20} className="text-brand" /> Détail du score</motion.h2>
          <ScoreRow label="Structure" value={result.score_structure} />
          <ScoreRow label="Énergie" value={result.score_energie} />
          <ScoreRow label="Confort" value={result.score_confort} />
          {(data.adresse || data.surface || data.type_bien) && (
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-surface px-4 py-3 text-sm">
              {data.type_bien && <span className="inline-flex items-center gap-1.5 text-foreground"><HomeIcon size={14} className="text-brand" />{BIEN_LBL[data.type_bien] ?? data.type_bien}</span>}
              {data.surface && <span className="inline-flex items-center gap-1.5 text-foreground"><Ruler size={14} className="text-brand" />{data.surface} m²</span>}
              {data.adresse && <span className="inline-flex items-center gap-1.5 text-foreground"><MapPin size={14} className="text-brand" />{data.adresse}</span>}
            </div>
          )}
        </motion.section>
        <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger} className="rounded-2xl border border-border bg-white p-7 lg:p-9">
          <motion.h2 variants={fadeInUp} className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-foreground"><AlertTriangle size={20} className="text-brand" /> Points à surveiller</motion.h2>
          <ActionList items={result.points_attention.length ? result.points_attention : ['Aucun point critique détecté dans vos réponses.', 'Une visite reste nécessaire pour confirmer l’état réel du bien.']} />
          {result.budget_travaux_estime && (
            <div className="mt-5 rounded-xl bg-orange-50 p-5 text-sm text-orange-900">
              <strong>Budget travaux indicatif :</strong> {fmt(result.budget_travaux_estime.min)} à {fmt(result.budget_travaux_estime.max)} selon les vérifications sur place.
            </div>
          )}
        </motion.section>
        <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger} className="rounded-2xl border border-border bg-white p-7 lg:p-9">
          <motion.h2 variants={fadeInUp} className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-foreground"><Lightbulb size={20} className="text-brand" /> Recommandations</motion.h2>
          <ActionList items={result.recommandations.length ? result.recommandations : ['Préparer les diagnostics disponibles.', 'Comparer le prix demandé avec l’état réel du bien.', 'Identifier les travaux à chiffrer avant toute décision.']} />
          {data.objectif && <p className="mt-5 rounded-xl bg-brand-light p-4 text-sm text-brand-dark">Objectif déclaré : {OBJECTIF_LBL[data.objectif] ?? data.objectif}</p>}
        </motion.section>
        <CardCtaTools title="Faire relire cet audit ?" text="Je peux vous aider à transformer ce premier score en vraie grille de décision avant vente, achat ou rénovation." />
      </main>
    </div>
  )
}

function ResultHeader({ label }: { label: string }) {
  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-3 px-6 py-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">AL</div>
        <div>
          <span className="block text-base font-semibold text-foreground">Alex Lopez</span>
          <span className="text-xs font-medium text-muted">{label}</span>
        </div>
      </div>
    </header>
  )
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof HomeIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface p-4">
      <p className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted"><Icon size={13} className="text-brand" /> {label}</p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function ActionList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map(function (item) {
        return <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground"><CheckCircle size={16} className="mt-0.5 shrink-0 text-brand" />{item}</li>
      })}
    </ul>
  )
}

function CardCtaTools({ title, text }: { title: string; text: string }) {
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger} className="rounded-2xl bg-brand-light p-7 text-center lg:p-9">
      <motion.h3 variants={fadeInUp} className="mb-3 font-serif text-2xl font-medium text-foreground">{title}</motion.h3>
      <motion.p variants={fadeInUp} className="mb-6 text-sm text-muted">{text}</motion.p>
      <motion.div variants={fadeInUp}>
        <Button asChild variant="primary" size="lg">
          <a href={'tel:' + PHONE_RAW}><Phone size={16} /> {PHONE_DISPLAY}<ArrowRight size={14} /></a>
        </Button>
      </motion.div>
    </motion.section>
  )
}

function buildBuyerPriorities(data: AcheterData): string[] {
  const items: string[] = []
  if (data.accord_bancaire !== 'Oui') items.push('Valider l’enveloppe bancaire avant d’élargir les visites.')
  if ((data.criteres ?? []).length > 0) items.push('Prioriser les critères non négociables : ' + (data.criteres ?? []).join(', ') + '.')
  if (data.communes) items.push('Comparer les communes ciblées avec le budget maximum indiqué.')
  if (data.budget_max && data.surface_min) items.push('Vérifier la cohérence budget / surface sur les annonces récentes du secteur.')
  items.push('Préparer une shortlist de biens à visiter avec une grille de comparaison simple.')
  return items
}

function buildAuditResult(data: AuditData): AuditResult {
  const structureKeys = [data.etat_toiture, data.etat_facade, data.etat_menuiseries, data.etat_plomberie, data.etat_electricite]
  const structureBase = averageScore(structureKeys.map(scoreEtat))
  const humidityPenalty = data.humidite === 'Oui' ? 15 : 0
  const score_structure = clamp(Math.round(structureBase - humidityPenalty))

  const iso = data.isolation ?? []
  const isoScore = Math.min(100, 35 + iso.length * 18)
  const dpeScore = scoreDpe(data.dpe)
  const score_energie = clamp(Math.round(isoScore * 0.45 + dpeScore * 0.55))

  let confort = 60
  if (data.type_chauffage === 'pac') confort += 18
  if (data.type_chauffage === 'fioul') confort -= 12
  if (iso.includes('Double vitrage')) confort += 8
  const score_confort = clamp(confort)

  const points_attention: string[] = []
  const recommandations: string[] = []
  const points_forts: string[] = []
  let min = 0
  let max = 0

  addAuditLine(data.etat_toiture, 'Toiture', 'Prévoir une vérification toiture / couverture.', 8000, 30000)
  addAuditLine(data.etat_facade, 'Façade', 'Contrôler l’état de façade et les éventuelles reprises.', 3000, 15000)
  addAuditLine(data.etat_menuiseries, 'Menuiseries', 'Chiffrer le remplacement ou l’amélioration des menuiseries.', 4000, 18000)
  addAuditLine(data.etat_plomberie, 'Plomberie', 'Prévoir une vérification plomberie.', 2500, 12000)
  addAuditLine(data.etat_electricite, 'Électricité', 'Vérifier la conformité électrique.', 3000, 12000)

  if (data.humidite === 'Oui') {
    points_attention.push('Présence d’humidité à vérifier rapidement.')
    recommandations.push('Identifier l’origine de l’humidité avant toute décision de prix ou de travaux.')
    min += 1000
    max += 10000
  }
  if (['F', 'G'].includes(data.dpe ?? '')) {
    points_attention.push('DPE faible : impact possible sur la négociation et les travaux.')
    recommandations.push('Prévoir un scénario de rénovation énergétique.')
  }
  if (score_structure >= 70) points_forts.push('Structure globalement rassurante d’après vos réponses.')
  if (score_energie >= 70) points_forts.push('Profil énergétique plutôt favorable.')

  function addAuditLine(value: string | undefined, label: string, recommendation: string, low: number, high: number) {
    if (value === 'mauvais') {
      points_attention.push(label + ' en mauvais état.')
      recommandations.push(recommendation)
      min += low
      max += high
    } else if (value === 'bon') {
      points_forts.push(label + ' en bon état.')
    }
  }

  return {
    score_global: clamp(Math.round(score_structure * 0.5 + score_energie * 0.35 + score_confort * 0.15)),
    score_structure,
    score_energie,
    score_confort,
    points_forts,
    points_attention,
    recommandations,
    ...(min > 0 ? { budget_travaux_estime: { min, max } } : {}),
  }
}

function averageScore(values: number[]) {
  if (values.length === 0) return 50
  return values.reduce((sum, item) => sum + item, 0) / values.length
}
function scoreEtat(value: string | undefined) {
  if (value === 'bon') return 82
  if (value === 'moyen') return 55
  if (value === 'mauvais') return 25
  return 50
}
function scoreDpe(value: string | undefined) {
  const map: Record<string, number> = { A: 95, B: 85, C: 72, D: 58, E: 43, F: 28, G: 15 }
  return map[value ?? ''] ?? 50
}
function clamp(value: number) { return Math.max(0, Math.min(100, value)) }
function auditScoreLabel(score: number) {
  if (score >= 75) return 'Bien globalement rassurant.'
  if (score >= 55) return 'Bien à analyser avec méthode.'
  return 'Plusieurs points méritent une vigilance forte.'
}

function CardEstimation({ est, prenom }: { est: EstimResult; prenom?: string }) {
  const labelPrecision = est.confiance >= 75 ? 'Haute précision' : est.confiance >= 55 ? 'Précision moyenne' : 'Estimation indicative'
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="rounded-2xl border border-border bg-white p-8 text-center lg:p-10">
      <motion.p variants={fadeInUp}
        className="mb-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand">
        <PartyPopper size={14} /> Votre estimation
      </motion.p>
      <motion.div variants={fadeInUp} className="mb-5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          <ShieldCheck size={13} /> {labelPrecision}
        </span>
      </motion.div>
      <motion.p variants={fadeInUp}
        className="mb-3 font-serif text-5xl font-medium leading-[1.05] tracking-[-0.03em] text-brand sm:text-6xl lg:text-7xl">
        {fmt(est.valeur_mediane)}
      </motion.p>
      <motion.p variants={fadeInUp} className="mb-4 text-base text-muted">
        {prenom ? prenom + ', voici votre prix optimal estimé' : 'Prix optimal estimé'}
      </motion.p>
      <motion.p variants={fadeInUp}
        className="mb-5 inline-flex items-center gap-2 text-base text-foreground">
        <TrendingUp size={16} className="text-brand" />
        Fourchette : {fmt(est.fourchette_basse)} – {fmt(est.fourchette_haute)}
      </motion.p>
      <motion.p variants={fadeInUp} className="mx-auto max-w-md text-sm leading-relaxed text-muted">
        Pourquoi une fourchette ? Le prix final se décide avec vous, sur place — pas par un algorithme.
      </motion.p>
    </motion.section>
  )
}

function CardCalcul({ est, data }: { est: EstimResult; data: LeadData }) {
  const equipPct = est.ajustements.filter(function (a) { return a.key.startsWith('eq:') }).reduce(function (s, a) { return s + a.pct }, 0)
  const dpeAdj = est.ajustements.find(function (a) { return a.key === 'dpe' })
  const sources = [
    { icon: Zap, label: data.dpe ? 'DPE ' + data.dpe : 'DPE NC', sub: 'Votre saisie' },
    { icon: Ruler, label: data.surface ? data.surface + ' m²' : '—', sub: 'Votre saisie' },
    { icon: Building2, label: data.type_bien ? BIEN_LBL[data.type_bien] : 'Type bien', sub: 'Votre saisie' },
    { icon: Database, label: fmt0(est.prix_m2_brut_dvf) + ' €/m²', sub: est.source === 'dvf' ? 'DVF Cerema' : 'Référence indicative' },
  ]
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="rounded-2xl border border-border bg-white p-7 lg:p-9">
      <motion.h2 variants={fadeInUp} className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-foreground">
        <Calculator size={20} className="text-brand" /> Comment avons-nous calculé ?
      </motion.h2>
      <motion.div variants={fadeInUp} className="mb-6 rounded-xl bg-brand-light p-4">
        <p className="mb-1 text-sm font-semibold text-brand">Analyse locale automatisée</p>
        <p className="text-xs text-muted">
          Analyse de {est.nb_transactions} biens dans un rayon de {est.rayon_km} km — source : {est.source === 'dvf' ? 'DVF Cerema' : 'référence indicative'}
        </p>
      </motion.div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Sources des données</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          <ShieldCheck size={11} /> Données vérifiées
        </span>
      </div>
      <motion.div variants={staggerFast} className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sources.map(function (src, i) {
          const Icon = src.icon
          return (
            <motion.div key={i} variants={scaleIn} className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
              <Icon size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-semibold text-foreground">{src.label}</p>
                <p className="text-[11px] text-muted">{src.sub}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
      {(data.adresse || data.type_bien || data.surface) && (
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-surface px-4 py-3 text-sm">
          {data.type_bien && <span className="inline-flex items-center gap-1.5 text-foreground"><HomeIcon size={14} className="text-brand" />{BIEN_LBL[data.type_bien] ?? data.type_bien}{data.nb_pieces ? ' T' + data.nb_pieces : ''}</span>}
          {data.surface && <span className="inline-flex items-center gap-1.5 text-foreground"><Ruler size={14} className="text-brand" />{data.surface} m²</span>}
          {data.adresse && <span className="inline-flex items-center gap-1.5 text-foreground"><MapPin size={14} className="text-brand" />{data.adresse}</span>}
        </div>
      )}
      <div className="divide-y divide-border">
        <div className="flex items-center justify-between py-3 text-sm">
          <span className="text-foreground">Prix moyen au m² dans votre secteur</span>
          <span className="font-semibold text-foreground">{fmt0(est.prix_m2_brut_dvf)} €/m²</span>
        </div>
        {equipPct !== 0 && (
          <div className="flex items-center justify-between py-3 text-sm">
            <span className="text-foreground">Équipements ({(data.equipements ?? []).length})</span>
            <span className={'font-semibold ' + (equipPct > 0 ? 'text-emerald-600' : 'text-orange-600')}>{equipPct > 0 ? '+' : ''}{equipPct.toFixed(1)}%</span>
          </div>
        )}
        {dpeAdj && (
          <div className="flex items-center justify-between py-3 text-sm">
            <span className="text-foreground">Performance énergétique (DPE {data.dpe})</span>
            <span className={'font-semibold ' + (dpeAdj.pct > 0 ? 'text-emerald-600' : 'text-orange-600')}>{dpeAdj.pct > 0 ? '+' : ''}{dpeAdj.pct.toFixed(1)}%</span>
          </div>
        )}
      </div>
      {est.points_forts.length > 0 && (
        <div className="mt-6">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
            <CheckCircle size={15} /> Points forts détectés
          </p>
          <ul className="space-y-2">
            {data.adresse && (<li className="flex items-start gap-2 text-sm text-foreground"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />Localisation à {data.adresse}</li>)}
            {est.points_forts.map(function (p, i) {
              return (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />{p}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </motion.section>
  )
}

function CardDetail({ est }: { est: EstimResult }) {
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="rounded-2xl border border-border bg-white p-7 lg:p-9">
      <motion.h2 variants={fadeInUp} className="mb-5 flex items-center gap-2.5 text-xl font-semibold text-foreground">
        <Calculator size={20} className="text-brand" /> Détail du calcul
      </motion.h2>
      <motion.div variants={fadeInUp} className="mb-6 rounded-xl bg-surface p-5">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs text-muted">
          <Database size={12} /> Prix de base
        </p>
        <p className="text-base text-foreground">
          <span className="text-2xl font-bold text-brand">{fmt0(est.prix_m2_brut_dvf)} €/m²</span>
          <span className="mx-2 text-muted">×</span>
          <span className="font-semibold">{est.prix_m2_brut_dvf > 0 ? Math.round(est.prix_de_base / est.prix_m2_brut_dvf) : 0} m²</span>
          <span className="mx-2 text-muted">=</span>
          <span className="font-bold">{fmt(est.prix_de_base)}</span>
        </p>
      </motion.div>
      {est.ajustements.length > 0 && (
        <>
          <motion.p variants={fadeInUp} className="mb-3 text-sm font-semibold text-foreground">Ajustements appliqués</motion.p>
          <motion.div variants={staggerFast} className="mb-5 divide-y divide-border">
            {est.ajustements.map(function (a) {
              const Icon = a.sign === 'positive' ? TrendingUp : TrendingDown
              const color = a.sign === 'positive' ? 'text-emerald-600' : 'text-orange-600'
              return (
                <motion.div key={a.key} variants={fadeInUp} className="flex items-center justify-between py-3 text-sm">
                  <span className="flex items-center gap-2 text-foreground">
                    <Icon size={15} className={color} /> {a.label}
                  </span>
                  <span className="flex items-center gap-4">
                    <span className={'font-semibold ' + color}>{a.pct > 0 ? '+' : ''}{a.pct.toFixed(1)}%</span>
                    <span className={'w-24 text-right font-semibold tabular-nums ' + color}>
                      {a.montant_eur > 0 ? '+' : ''}{fmt(a.montant_eur)}
                    </span>
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        </>
      )}
      <motion.div variants={fadeInUp} className="rounded-xl bg-brand-light p-5 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">Prix calculé</p>
        <p className="mb-2 font-serif text-3xl font-medium text-brand">{fmt(est.prix_calcule)}</p>
        <p className="text-xs text-muted">Fourchette marché (±7%) : {fmt(est.fourchette_basse)} – {fmt(est.fourchette_haute)}</p>
      </motion.div>
    </motion.section>
  )
}

function CardStrategie({ est }: { est: EstimResult }) {
  const [pos, setPos] = useState(50)
  const span = est.fourchette_haute - est.fourchette_basse || 1
  const currentPrice = useMemo(function () {
    return Math.round((est.fourchette_basse + (span * pos) / 100) / 1000) * 1000
  }, [pos, span, est.fourchette_basse])
  const proba = useMemo(function () {
    const base = est.strategie.probabilite_vente_rapide_pct
    return Math.max(15, Math.min(95, Math.round(base - (pos - 50) * 0.7)))
  }, [pos, est.strategie.probabilite_vente_rapide_pct])
  const delaiLbl = pos < 35 ? '1-2 mois' : pos > 65 ? '3-6 mois' : est.strategie.delai_estime
  const visitesLbl = pos < 35 ? 'Soutenues' : pos > 65 ? 'Espacées' : est.strategie.frequence_visites
  const negoLbl = pos < 35 ? 'Minimale' : pos > 65 ? 'Importante' : est.strategie.negociation
  const cursorStyle: CSSProperties = { left: pos + '%' }
  const probaStyle: CSSProperties = { width: proba + '%' }
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="rounded-2xl border border-border bg-white p-7 lg:p-9">
      <motion.h2 variants={fadeInUp} className="mb-3 flex items-center gap-2.5 text-xl font-semibold text-foreground">
        <Target size={20} className="text-brand" /> Stratégie de prix
      </motion.h2>
      <motion.p variants={fadeInUp} className="mb-7 text-sm leading-relaxed text-muted">
        Le prix de vente influence directement votre délai de transaction. Un prix attractif génère plus de visites et d’offres, tandis qu’un prix élevé nécessite patience et négociation.
      </motion.p>
      <motion.div variants={fadeInUp} className="mb-3 text-center">
        <p className="mb-1 font-serif text-4xl font-medium leading-none text-amber-500">{fmt(currentPrice)}</p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-500">Prix marché</p>
      </motion.div>
      <motion.div variants={fadeInUp} className="mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-brand">
        <ChevronLeft size={16} /> Glissez pour simuler <ChevronRight size={16} />
      </motion.div>
      <motion.div variants={fadeInUp} className="relative mb-2">
        <div className="flex h-2.5 overflow-hidden rounded-full">
          <div className="h-full basis-1/2 bg-emerald-400" />
          <div className="h-full basis-[30%] bg-amber-400" />
          <div className="h-full basis-[20%] bg-rose-400" />
        </div>
        <input type="range" min={0} max={100} value={pos} onChange={function (e) { setPos(Number(e.target.value)) }}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0" aria-label="Position prix" />
        <div
          className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-white shadow"
          style={cursorStyle}
        />
      </motion.div>
      <div className="mb-7 flex items-center justify-between text-xs text-muted">
        <span>{fmt(est.fourchette_basse)}</span>
        <span>{fmt(est.fourchette_haute)}</span>
      </div>
      <div className="mb-7">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-foreground">Probabilité de vente rapide</span>
          <span className="font-semibold text-amber-500">{proba}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-amber-400 transition-all duration-300" style={probaStyle} />
        </div>
      </div>
      <motion.div variants={staggerFast} className="mb-6 grid grid-cols-3 gap-3">
        <motion.div variants={scaleIn} className="rounded-xl bg-surface p-4 text-center">
          <Clock size={16} className="mx-auto mb-2 text-brand" />
          <p className="mb-1 text-[11px] text-muted">Délai</p>
          <p className="text-sm font-semibold text-foreground">{delaiLbl}</p>
        </motion.div>
        <motion.div variants={scaleIn} className="rounded-xl bg-surface p-4 text-center">
          <Users size={16} className="mx-auto mb-2 text-brand" />
          <p className="mb-1 text-[11px] text-muted">Visites</p>
          <p className="text-sm font-semibold text-foreground">{visitesLbl}</p>
        </motion.div>
        <motion.div variants={scaleIn} className="rounded-xl bg-surface p-4 text-center">
          <Handshake size={16} className="mx-auto mb-2 text-brand" />
          <p className="mb-1 text-[11px] text-muted">Négo</p>
          <p className="text-sm font-semibold text-foreground">{negoLbl}</p>
        </motion.div>
      </motion.div>
      <motion.div variants={fadeInUp} className="rounded-xl bg-brand-light p-5">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Lightbulb size={15} className="text-brand" /> Affinez votre stratégie avec un expert
        </p>
        <p className="mb-4 text-xs leading-relaxed text-muted">
          Chaque bien est unique. Alex peut adapter cette stratégie selon les spécificités locales et votre situation personnelle.
        </p>
        <Button asChild variant="primary" className="w-full">
          <a href={'tel:' + PHONE_RAW}><Phone size={14} /> Être rappelé</a>
        </Button>
        <p className="mt-2 text-center text-[11px] text-muted">Gratuit et sans engagement</p>
      </motion.div>
    </motion.section>
  )
}

function CardEnvironnement() {
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-7 lg:p-9">
      <motion.div variants={fadeInUp} className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100">
          <Trees size={22} className="text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Environnement Calme</h2>
          <p className="text-xs text-muted">Cadre résidentiel et naturel</p>
        </div>
      </motion.div>
      <motion.p variants={fadeInUp} className="mb-5 flex items-center gap-2 rounded-xl bg-white/80 px-4 py-3 text-sm text-foreground">
        <Trees size={16} className="text-emerald-600" /> Idéal pour les amateurs de tranquillité et d’espaces préservés
      </motion.p>
      <motion.div variants={staggerFast} className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <motion.div variants={scaleIn} className="rounded-xl bg-white/80 p-4">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground"><span className="text-base">🌳</span> Nature</p>
          <p className="text-xs text-muted">Environnement préservé</p>
        </motion.div>
        <motion.div variants={scaleIn} className="rounded-xl bg-white/80 p-4">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground"><Smile size={16} className="text-emerald-600" /> Calme</p>
          <p className="text-xs text-muted">Loin de l’agitation urbaine</p>
        </motion.div>
        <motion.div variants={scaleIn} className="rounded-xl bg-white/80 p-4">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground"><HomeIcon size={16} className="text-emerald-600" /> Résidentiel</p>
          <p className="text-xs text-muted">Quartier paisible</p>
        </motion.div>
        <motion.div variants={scaleIn} className="rounded-xl bg-white/80 p-4">
          <p className="mb-1 flex items-center gap-2 text-sm font-semibold text-foreground"><Car size={16} className="text-emerald-600" /> Mobilité</p>
          <p className="text-xs text-muted">Accès véhicule recommandé</p>
        </motion.div>
      </motion.div>
      <motion.p variants={fadeInUp} className="border-t border-emerald-100 pt-3 text-center text-[11px] text-emerald-700">
        Profil environnement calculé automatiquement — enrichissement Overpass à venir
      </motion.p>
    </motion.section>
  )
}

function CardCtaFinale() {
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="rounded-2xl bg-brand-light p-7 text-center lg:p-9">
      <motion.h3 variants={fadeInUp} className="mb-3 font-serif text-2xl font-medium text-foreground">
        Affiner cette estimation ?
      </motion.h3>
      <motion.p variants={fadeInUp} className="mb-6 text-sm text-muted">
        Alex se déplace gratuitement · Sans engagement · Sous 48h
      </motion.p>
      <motion.div variants={fadeInUp}>
        <Button asChild variant="primary" size="lg">
          <a href={'tel:' + PHONE_RAW}><Phone size={16} /> {PHONE_DISPLAY}<ArrowRight size={14} /></a>
        </Button>
      </motion.div>
    </motion.section>
  )
}

function ScoreRow({ label, value }: { label: string; value: number }) {
  const style: CSSProperties = { width: value + '%' }
  return (
    <div className="border-b border-border py-4 last:border-0">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-semibold text-brand">{value}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full bg-brand" style={style} />
      </div>
    </div>
  )
}
