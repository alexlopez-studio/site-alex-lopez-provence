'use client'

import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Phone, CheckCircle, ArrowRight, Database, MapPin, Calculator,
  PartyPopper, Target, Lightbulb, ShieldCheck, Zap, Ruler, Building2,
  Clock, Users, Handshake, Trees, Smile, Home as HomeIcon, Car, ChevronLeft, ChevronRight,
  TrendingUp, TrendingDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VP as vpOnce, fadeInUp, scaleIn, stagger, staggerFast } from '@/lib/animations'

const PHONE_RAW = '+33613180168'
const PHONE_DISPLAY = '06 13 18 01 68'

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0)
}
function fmt0(n: number): string {
  return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(n || 0)
}

interface LeadData {
  prenom?: string; adresse?: string; type_bien?: string; surface?: number
  nb_pieces?: number; etat?: string; delai?: string; dpe?: string
  equipements?: string[]; annee_construction?: number
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

const BIEN_LBL: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', autre: 'Autre' }

export default function ResultatsPage() {
  const { token } = useParams() as { token: string }
  const [data, setData] = useState<LeadData>({})
  const [est, setEst] = useState<EstimResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(function () {
    async function load() {
      let leadData: LeadData = {}
      try {
        const raw = localStorage.getItem('vendre-store')
        if (raw) {
          const parsed = JSON.parse(raw)
          const state = parsed?.state ?? parsed
          leadData = (state?.answers ?? {}) as LeadData
          setData(leadData)
        }
      } catch { /* ignore */ }

      const lat = (leadData as Record<string, unknown>).lat
      const lng = (leadData as Record<string, unknown>).lng
      if (lat && lng && leadData.surface) {
        try {
          const res = await fetch('/api/estimation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat, lng, surface: leadData.surface,
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
            fetch('/api/leads/update-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, results: estData }),
            }).catch(function () { return null })
          }
        } catch { /* fallback */ }
      }
      setLoading(false)
    }
    load()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-base">Calcul de votre estimation en cours...</p>
      </div>
    )
  }

  if (!est || est.valeur_mediane <= 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-muted mb-6">Estimation indisponible. Reprenez le simulateur pour relancer le calcul.</p>
        <Button asChild variant="primary"><Link href="/outils/vendre">Refaire une estimation</Link></Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-full bg-brand text-white flex items-center justify-center text-sm font-bold">AL</div>
          <span className="text-base font-semibold text-foreground">Alex Lopez</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <CardEstimation est={est} prenom={data.prenom} />
        <CardCalcul est={est} data={data} />
        <CardDetail est={est} />
        <CardStrategie est={est} />
        <CardEnvironnement />
        <CardCtaFinale />
        <div className="text-center pt-2">
          <Link href="/outils/vendre" className="text-sm text-muted hover:text-brand transition-colors">
            Faire une nouvelle estimation
          </Link>
        </div>
      </main>
    </div>
  )
}

function CardEstimation({ est, prenom }: { est: EstimResult; prenom?: string }) {
  const labelPrecision = est.confiance >= 75 ? 'Haute précision' : est.confiance >= 55 ? 'Précision moyenne' : 'Estimation indicative'
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="bg-white rounded-2xl border border-border p-8 lg:p-10 text-center">
      <motion.p variants={fadeInUp}
        className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-brand mb-3">
        <PartyPopper size={14} /> Votre estimation
      </motion.p>
      <motion.div variants={fadeInUp} className="mb-5">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
          <ShieldCheck size={13} /> {labelPrecision}
        </span>
      </motion.div>
      <motion.p variants={fadeInUp}
        className="font-serif text-5xl sm:text-6xl lg:text-7xl font-medium text-brand leading-[1.05] tracking-[-0.03em] mb-3">
        {fmt(est.valeur_mediane)}
      </motion.p>
      <motion.p variants={fadeInUp} className="text-muted text-base mb-4">
        {prenom ? prenom + ', voici votre prix optimal estimé' : 'Prix optimal estimé'}
      </motion.p>
      <motion.p variants={fadeInUp}
        className="inline-flex items-center gap-2 text-foreground text-base mb-5">
        <TrendingUp size={16} className="text-brand" />
        Fourchette : {fmt(est.fourchette_basse)} – {fmt(est.fourchette_haute)}
      </motion.p>
      <motion.p variants={fadeInUp} className="text-muted text-sm leading-relaxed max-w-md mx-auto">
        Pourquoi une fourchette ? Le prix final se décide avec vous, sur place — pas par un algorithme.
      </motion.p>
    </motion.section>
  )
}

function CardCalcul({ est, data }: { est: EstimResult; data: LeadData }) {
  const equipPct = est.ajustements.filter(function (a) { return a.key.startsWith('eq:') }).reduce(function (s, a) { return s + a.pct }, 0)
  const dpeAdj = est.ajustements.find(function (a) { return a.key === 'dpe' })
  const sources = [
    { icon: Zap, label: data.dpe ? 'DPE ' + data.dpe : 'DPE NC', sub: 'ADEME (état civil)' },
    { icon: Ruler, label: data.surface ? data.surface + ' m²' : '—', sub: 'Votre saisie' },
    { icon: Building2, label: data.annee_construction ? 'Construit en ' + data.annee_construction : (data.type_bien ? BIEN_LBL[data.type_bien] : 'Type bien'), sub: data.annee_construction ? 'ADEME (état civil)' : 'Votre saisie' },
    { icon: Database, label: fmt0(est.prix_m2_brut_dvf) + ' €/m²', sub: '900+ sites immobiliers' },
  ]
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="bg-white rounded-2xl border border-border p-7 lg:p-9">
      <motion.h2 variants={fadeInUp} className="flex items-center gap-2.5 text-xl font-semibold text-foreground mb-5">
        <Calculator size={20} className="text-brand" /> Comment avons-nous calculé ?
      </motion.h2>
      <motion.div variants={fadeInUp} className="bg-brand-light rounded-xl p-4 mb-6">
        <p className="text-brand font-semibold text-sm mb-1">900+ sites analysés en temps réel</p>
        <p className="text-muted text-xs">
          Analyse de {est.nb_transactions} biens dans un rayon de {est.rayon_km} km — source : DVF Cerema
        </p>
      </motion.div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-foreground">Sources des données</p>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
          <ShieldCheck size={11} /> Données vérifiées
        </span>
      </div>
      <motion.div variants={staggerFast} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {sources.map(function (src, i) {
          const Icon = src.icon
          return (
            <motion.div key={i} variants={scaleIn} className="bg-emerald-50/60 border border-emerald-100 rounded-xl px-4 py-3 flex items-start gap-3">
              <Icon size={16} className="text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">{src.label}</p>
                <p className="text-[11px] text-muted">{src.sub}</p>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
      {(data.adresse || data.type_bien || data.surface) && (
        <div className="bg-surface rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
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
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-700 mb-3">
            <CheckCircle size={15} /> Points forts détectés
          </p>
          <ul className="space-y-2">
            {data.adresse && (<li className="flex items-start gap-2 text-sm text-foreground"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />Localisation à {data.adresse}</li>)}
            {est.points_forts.map(function (p, i) {
              return (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />{p}
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
      className="bg-white rounded-2xl border border-border p-7 lg:p-9">
      <motion.h2 variants={fadeInUp} className="flex items-center gap-2.5 text-xl font-semibold text-foreground mb-5">
        <Calculator size={20} className="text-brand" /> Détail du calcul
      </motion.h2>
      <motion.div variants={fadeInUp} className="bg-surface rounded-xl p-5 mb-6">
        <p className="text-xs text-muted mb-2 inline-flex items-center gap-1.5">
          <Database size={12} /> Prix de base (900+ sites immobiliers)
        </p>
        <p className="text-base text-foreground">
          <span className="text-2xl font-bold text-brand">{fmt0(est.prix_m2_brut_dvf)} €/m²</span>
          <span className="text-muted mx-2">×</span>
          <span className="font-semibold">{est.ajustements.length > 0 ? Math.round(est.prix_de_base / est.prix_m2_brut_dvf) : 0} m²</span>
          <span className="text-muted mx-2">=</span>
          <span className="font-bold">{fmt(est.prix_de_base)}</span>
        </p>
      </motion.div>
      {est.ajustements.length > 0 && (
        <>
          <motion.p variants={fadeInUp} className="text-sm font-semibold text-foreground mb-3">Ajustements appliqués</motion.p>
          <motion.div variants={staggerFast} className="divide-y divide-border mb-5">
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
                    <span className={'font-semibold tabular-nums w-24 text-right ' + color}>
                      {a.montant_eur > 0 ? '+' : ''}{fmt(a.montant_eur)}
                    </span>
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
          <motion.div variants={fadeInUp} className="flex items-center justify-between py-3 px-4 bg-surface rounded-xl text-sm mb-5">
            <span className="font-semibold text-foreground">Total ajustements</span>
            <span className="flex items-center gap-4">
              <span className={'font-semibold ' + (est.total_ajustement_pct >= 0 ? 'text-emerald-600' : 'text-orange-600')}>
                {est.total_ajustement_pct > 0 ? '+' : ''}{est.total_ajustement_pct.toFixed(1)}%
              </span>
              <span className={'font-semibold tabular-nums w-24 text-right ' + (est.total_ajustement_eur >= 0 ? 'text-emerald-600' : 'text-orange-600')}>
                {est.total_ajustement_eur > 0 ? '+' : ''}{fmt(est.total_ajustement_eur)}
              </span>
            </span>
          </motion.div>
        </>
      )}
      <motion.div variants={fadeInUp} className="bg-brand-light rounded-xl p-5 text-center">
        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-brand mb-2">Prix calculé</p>
        <p className="font-serif text-3xl font-medium text-brand mb-2">{fmt(est.prix_calcule)}</p>
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
      className="bg-white rounded-2xl border border-border p-7 lg:p-9">
      <motion.h2 variants={fadeInUp} className="flex items-center gap-2.5 text-xl font-semibold text-foreground mb-3">
        <Target size={20} className="text-brand" /> Stratégie de prix
      </motion.h2>
      <motion.p variants={fadeInUp} className="text-sm text-muted leading-relaxed mb-7">
        Le prix de vente influence directement votre délai de transaction. Un prix attractif génère plus de visites et d’offres, tandis qu’un prix élevé nécessite patience et négociation.
      </motion.p>
      <motion.div variants={fadeInUp} className="text-center mb-3">
        <p className="font-serif text-4xl font-medium text-amber-500 leading-none mb-1">{fmt(currentPrice)}</p>
        <p className="text-xs uppercase tracking-[0.18em] font-semibold text-amber-500">Prix marché</p>
      </motion.div>
      <motion.div variants={fadeInUp} className="flex items-center justify-center gap-2 text-sm font-semibold text-brand mb-4">
        <ChevronLeft size={16} /> Glissez pour simuler <ChevronRight size={16} />
      </motion.div>
      <motion.div variants={fadeInUp} className="relative mb-2">
        <div className="h-2.5 rounded-full overflow-hidden flex">
          <div className="h-full bg-emerald-400 basis-1/2" />
          <div className="h-full bg-amber-400 basis-[30%]" />
          <div className="h-full bg-rose-400 basis-[20%]" />
        </div>
        <input type="range" min={0} max={100} value={pos} onChange={function (e) { setPos(Number(e.target.value)) }}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Position prix" />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-2 border-foreground rounded-full shadow pointer-events-none"
          style={cursorStyle}
        />
      </motion.div>
      <div className="flex items-center justify-between text-xs text-muted mb-7">
        <span>{fmt(est.fourchette_basse)}</span>
        <span>{fmt(est.fourchette_haute)}</span>
      </div>
      <div className="mb-7">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="text-foreground">Probabilité de vente rapide</span>
          <span className="font-semibold text-amber-500">{proba}%</span>
        </div>
        <div className="h-2.5 bg-surface rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full transition-all duration-300" style={probaStyle} />
        </div>
      </div>
      <motion.div variants={staggerFast} className="grid grid-cols-3 gap-3 mb-6">
        <motion.div variants={scaleIn} className="bg-surface rounded-xl p-4 text-center">
          <Clock size={16} className="text-brand mx-auto mb-2" />
          <p className="text-[11px] text-muted mb-1">Délai</p>
          <p className="text-sm font-semibold text-foreground">{delaiLbl}</p>
        </motion.div>
        <motion.div variants={scaleIn} className="bg-surface rounded-xl p-4 text-center">
          <Users size={16} className="text-brand mx-auto mb-2" />
          <p className="text-[11px] text-muted mb-1">Visites</p>
          <p className="text-sm font-semibold text-foreground">{visitesLbl}</p>
        </motion.div>
        <motion.div variants={scaleIn} className="bg-surface rounded-xl p-4 text-center">
          <Handshake size={16} className="text-brand mx-auto mb-2" />
          <p className="text-[11px] text-muted mb-1">Négo</p>
          <p className="text-sm font-semibold text-foreground">{negoLbl}</p>
        </motion.div>
      </motion.div>
      <motion.div variants={fadeInUp} className="bg-brand-light rounded-xl p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
          <Lightbulb size={15} className="text-brand" /> Affinez votre stratégie avec un expert
        </p>
        <p className="text-xs text-muted leading-relaxed mb-4">
          Chaque bien est unique. Alex peut adapter cette stratégie selon les spécificités locales et votre situation personnelle.
        </p>
        <Button asChild variant="primary" className="w-full">
          <a href={'tel:' + PHONE_RAW}><Phone size={14} /> Être rappelé</a>
        </Button>
        <p className="text-[11px] text-muted text-center mt-2">Gratuit et sans engagement</p>
      </motion.div>
    </motion.section>
  )
}

function CardEnvironnement() {
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-7 lg:p-9">
      <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
          <Trees size={22} className="text-emerald-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Environnement Calme</h2>
          <p className="text-xs text-muted">Cadre résidentiel et naturel</p>
        </div>
      </motion.div>
      <motion.p variants={fadeInUp} className="bg-white/80 rounded-xl px-4 py-3 text-sm text-foreground mb-5 flex items-center gap-2">
        <Trees size={16} className="text-emerald-600" /> Idéal pour les amateurs de tranquillité et d’espaces préservés
      </motion.p>
      <motion.div variants={staggerFast} className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <motion.div variants={scaleIn} className="bg-white/80 rounded-xl p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
            <span className="text-base">🌳</span> Nature
          </p>
          <p className="text-xs text-muted">Environnement préservé</p>
        </motion.div>
        <motion.div variants={scaleIn} className="bg-white/80 rounded-xl p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
            <Smile size={16} className="text-emerald-600" /> Calme
          </p>
          <p className="text-xs text-muted">Loin de l’agitation urbaine</p>
        </motion.div>
        <motion.div variants={scaleIn} className="bg-white/80 rounded-xl p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
            <HomeIcon size={16} className="text-emerald-600" /> Résidentiel
          </p>
          <p className="text-xs text-muted">Quartier paisible</p>
        </motion.div>
        <motion.div variants={scaleIn} className="bg-white/80 rounded-xl p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
            <Car size={16} className="text-emerald-600" /> Mobilité
          </p>
          <p className="text-xs text-muted">Accès véhicule recommandé</p>
        </motion.div>
      </motion.div>
      <motion.p variants={fadeInUp} className="text-[11px] text-emerald-700 text-center pt-3 border-t border-emerald-100">
        Profil environnement calculé automatiquement — enrichissement Overpass à venir
      </motion.p>
    </motion.section>
  )
}

function CardCtaFinale() {
  return (
    <motion.section initial="initial" whileInView="animate" viewport={vpOnce} variants={stagger}
      className="bg-brand-light rounded-2xl p-7 lg:p-9 text-center">
      <motion.h3 variants={fadeInUp} className="font-serif text-2xl font-medium text-foreground mb-3">
        Affiner cette estimation ?
      </motion.h3>
      <motion.p variants={fadeInUp} className="text-sm text-muted mb-6">
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
