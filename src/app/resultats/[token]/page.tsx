'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import type { CSSProperties } from 'react'
import { Phone, CheckCircle, TrendingUp, Home, Calendar, ArrowRight, Database } from 'lucide-react'
import Link from 'next/link'

const brand = '#0077B6'
const brandLight = '#E0F0FA'
const fg = '#0F172A'
const muted = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const white = '#ffffff'
const success = '#10B981'
const FONT = 'var(--font-plus-jakarta-sans, system-ui, sans-serif)'

const pageSt: CSSProperties = { minHeight: '100vh', backgroundColor: surface, fontFamily: FONT }
const navSt: CSSProperties = { backgroundColor: white, borderBottom: '1px solid ' + border, padding: '14px 20px' }
const navIn: CSSProperties = { maxWidth: '760px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const navLeft: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px' }
const avatarSt: CSSProperties = { width: '36px', height: '36px', borderRadius: '999px', backgroundColor: brand, color: white, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }
const navName: CSSProperties = { fontSize: '14px', fontWeight: 700, color: fg }
const navSub: CSSProperties = { fontSize: '11px', color: muted }
const phoneSt: CSSProperties = { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: fg, textDecoration: 'none' }
const wrap: CSSProperties = { maxWidth: '760px', margin: '0 auto', padding: '32px 20px 60px' }
const successBand: CSSProperties = { backgroundColor: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }
const successTxt: CSSProperties = { fontSize: '14px', fontWeight: 600, color: success }
const successSub: CSSProperties = { fontSize: '12px', color: '#059669' }
const mainCard: CSSProperties = { backgroundColor: white, borderRadius: '20px', border: '1px solid ' + border, padding: '32px', marginBottom: '20px' }
const eyebrowSt: CSSProperties = { fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: brand, marginBottom: '6px' } as CSSProperties
const priceRng: CSSProperties = { fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 900, color: fg, letterSpacing: '-0.03em', marginBottom: '6px' }
const priceSubSt: CSSProperties = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '28px' }
const priceGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }
const priceBox: CSSProperties = { backgroundColor: surface, borderRadius: '12px', padding: '16px', textAlign: 'center' } as CSSProperties
const priceBoxHL: CSSProperties = { backgroundColor: brandLight, border: '2px solid ' + brand, borderRadius: '12px', padding: '16px', textAlign: 'center' } as CSSProperties
const priceLbl: CSSProperties = { fontSize: '10px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '6px' } as CSSProperties
const priceLblHL: CSSProperties = { fontSize: '10px', fontWeight: 600, color: brand, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '6px' } as CSSProperties
const priceVal: CSSProperties = { fontSize: '18px', fontWeight: 800, color: muted }
const priceValHL: CSSProperties = { fontSize: '18px', fontWeight: 800, color: brand }
const m2Row: CSSProperties = { backgroundColor: surface, borderRadius: '10px', padding: '14px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const m2Lbl: CSSProperties = { fontSize: '13px', fontWeight: 500, color: muted }
const m2Val: CSSProperties = { fontSize: '15px', fontWeight: 800, color: fg }
const dividerSt: CSSProperties = { height: '1px', backgroundColor: border, margin: '24px 0' }
const confidWrap: CSSProperties = { marginBottom: '24px' }
const confidHdr: CSSProperties = { fontSize: '12px', fontWeight: 600, color: fg, marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }
const confidPct: CSSProperties = { fontSize: '12px', fontWeight: 700, color: success }
const confidTrack: CSSProperties = { height: '8px', backgroundColor: border, borderRadius: '999px', overflow: 'hidden' }
const recapLbl: CSSProperties = { fontSize: '12px', fontWeight: 600, color: muted, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.14em' } as CSSProperties
const detailGrid: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }
const detailItem: CSSProperties = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', backgroundColor: surface, borderRadius: '10px' }
const detailItemFull: CSSProperties = { ...detailItem, gridColumn: '1 / -1' }
const dLbl: CSSProperties = { fontSize: '12px', fontWeight: 500, color: muted }
const dVal: CSSProperties = { fontSize: '13px', fontWeight: 600, color: fg }
const sourceBand: CSSProperties = { backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }
const sourceTxt: CSSProperties = { fontSize: '12px', fontWeight: 500, color: '#166534' }
const cardsRow: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }
const smallCard: CSSProperties = { backgroundColor: white, borderRadius: '16px', border: '1px solid ' + border, padding: '20px' }
const smallHdr: CSSProperties = { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }
const smallTitle: CSSProperties = { fontSize: '13px', fontWeight: 700, color: fg }
const smallText: CSSProperties = { fontSize: '12px', fontWeight: 300, color: muted, lineHeight: 1.6 }
const ctaCard: CSSProperties = { backgroundColor: brandLight, borderRadius: '20px', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', marginBottom: '24px' }
const ctaTitle: CSSProperties = { fontSize: '18px', fontWeight: 800, color: fg, marginBottom: '6px', letterSpacing: '-0.02em' }
const ctaSub: CSSProperties = { fontSize: '13px', fontWeight: 300, color: muted }
const ctaBtn: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: brand, color: white, fontSize: '13px', fontWeight: 600, padding: '12px 20px', borderRadius: '999px', textDecoration: 'none', flexShrink: 0 }
const newEstLnk: CSSProperties = { fontSize: '13px', fontWeight: 500, color: muted, textDecoration: 'none' }
const loaderWrap: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }
const loaderTxt: CSSProperties = { fontSize: '16px', fontWeight: 500, color: muted }
const centeredSt: CSSProperties = { textAlign: 'center' }

function confidFillSt(pct: number): CSSProperties {
  return { height: '100%', width: pct + '%', backgroundColor: success, borderRadius: '999px', transition: 'width 1s ease' }
}
function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

interface LeadData {
  prenom?: string; adresse?: string; type_bien?: string; surface?: number
  nb_pieces?: number; etat?: string; delai?: string
}
interface EstimResult {
  fourchette_basse: number; fourchette_haute: number; valeur_mediane: number
  prix_m2_median: number; nb_transactions: number; rayon_km: number
  source: 'dvf' | 'fallback'; confiance: number
}

const ETAT_LBL: Record<string, string> = { neuf: 'Neuf / récent', tres_bon_etat: 'Très bon état', bon_etat: 'Bon état', rafraichir: 'À rafraîchir', travaux: 'Travaux importants' }
const BIEN_LBL: Record<string, string> = { appartement: 'Appartement', maison: 'Maison', terrain: 'Terrain', autre: 'Autre' }
const DELAI_LBL: Record<string, string> = { immediat: 'Immédiat', '1_3_mois': '1 – 3 mois', '3_6_mois': '3 – 6 mois', '6_mois': '+6 mois', pas_decide: 'Pas décidé' }

export default function ResultatsPage() {
  const { token } = useParams() as { token: string }
  const [data, setData] = useState<LeadData>({})
  const [prenom, setPrenom] = useState('')
  const [est, setEst] = useState<EstimResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      let leadData: Record<string, unknown> = {}
      try {
        const raw = localStorage.getItem('vendre-store')
        if (raw) {
          const parsed = JSON.parse(raw)
          const state = parsed?.state ?? parsed
          leadData = state?.answers ?? {}
          setData(leadData as LeadData)
          setPrenom(leadData.prenom as string ?? '')
        }
      } catch { /* ignore */ }

      if (leadData.lat && leadData.lng && leadData.surface) {
        try {
          const res = await fetch('/api/estimation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: leadData.lat, lng: leadData.lng, surface: leadData.surface,
              type_bien: leadData.type_bien ?? 'maison', etat: leadData.etat ?? 'bon_etat',
              dpe: leadData.dpe ?? 'D', equipements: leadData.equipements ?? [], delai: leadData.delai ?? '3_6_mois',
            }),
          })
          if (res.ok) {
            const estData = await res.json()
            setEst(estData)
            fetch('/api/leads/update-results', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token, results: estData }),
            }).catch(() => null)
          }
        } catch { /* fallback */ }
      }
      setLoading(false)
    }
    load()
  }, [token])

  const estFinal: EstimResult = est ?? { fourchette_basse: 0, fourchette_haute: 0, valeur_mediane: 0, prix_m2_median: 0, nb_transactions: 0, rayon_km: 0, source: 'fallback', confiance: 0 }

  if (loading) {
    return (
      <div style={pageSt}>
        <div style={loaderWrap}><p style={loaderTxt}>Calcul de votre estimation en cours...</p></div>
      </div>
    )
  }

  const hasEst = estFinal.valeur_mediane > 0

  return (
    <div style={pageSt}>
      <header style={navSt}>
        <div style={navIn}>
          <div style={navLeft}>
            <div style={avatarSt}>AL</div>
            <div><div style={navName}>Alex Lopez</div><div style={navSub}>Mandataire IAD · Provence Verte</div></div>
          </div>
          <a href="tel:+33613180168" style={phoneSt}><Phone size={13} color={brand} /> 06 13 18 01 68</a>
        </div>
      </header>
      <main style={wrap}>
        <div style={successBand}>
          <CheckCircle size={22} color={success} />
          <div>
            <div style={successTxt}>Estimation générée avec succès</div>
            <div style={successSub}>{prenom ? 'Bonjour ' + prenom + ' ! ' : ''}Un email de confirmation vous a été envoyé.</div>
          </div>
        </div>

        {hasEst && (
          <>
            {estFinal.source === 'dvf' && (
              <div style={sourceBand}>
                <Database size={15} color="#166534" />
                <span style={sourceTxt}>Estimation basée sur <strong>{estFinal.nb_transactions}</strong> ventes DVF dans un rayon de <strong>{estFinal.rayon_km} km</strong></span>
              </div>
            )}
            <div style={mainCard}>
              <p style={eyebrowSt}>🏠 Votre estimation</p>
              <p style={priceRng}>{fmt(estFinal.fourchette_basse)} — {fmt(estFinal.fourchette_haute)}</p>
              <p style={priceSubSt}>Fourchette estimée basée sur le marché local de Provence Verte</p>
              <div style={priceGrid}>
                <div style={priceBox}><div style={priceLbl}>Estimation basse</div><div style={priceVal}>{fmt(estFinal.fourchette_basse)}</div></div>
                <div style={priceBoxHL}><div style={priceLblHL}>Valeur estimée</div><div style={priceValHL}>{fmt(estFinal.valeur_mediane)}</div></div>
                <div style={priceBox}><div style={priceLbl}>Estimation haute</div><div style={priceVal}>{fmt(estFinal.fourchette_haute)}</div></div>
              </div>
              <div style={m2Row}><span style={m2Lbl}>Prix au m²</span><span style={m2Val}>{estFinal.prix_m2_median.toLocaleString('fr-FR')} €/m²</span></div>
              <div style={confidWrap}>
                <div style={confidHdr}><span>Indice de fiabilité</span><span style={confidPct}>{estFinal.confiance}%</span></div>
                <div style={confidTrack}><div style={confidFillSt(estFinal.confiance)} /></div>
              </div>
              <div style={dividerSt} />
              <p style={recapLbl}>Récapitulatif du bien</p>
              <div style={detailGrid}>
                {data.adresse && (<div style={detailItemFull}><Home size={14} color={brand} /><div><div style={dLbl}>Adresse</div><div style={dVal}>{data.adresse}</div></div></div>)}
                {data.type_bien && (<div style={detailItem}><div><div style={dLbl}>Type</div><div style={dVal}>{BIEN_LBL[data.type_bien] ?? data.type_bien}</div></div></div>)}
                {data.surface && (<div style={detailItem}><div><div style={dLbl}>Surface</div><div style={dVal}>{data.surface} m²</div></div></div>)}
                {data.nb_pieces && (<div style={detailItem}><div><div style={dLbl}>Pièces</div><div style={dVal}>{data.nb_pieces} pièce{Number(data.nb_pieces) > 1 ? 's' : ''}</div></div></div>)}
                {data.etat && (<div style={detailItem}><div><div style={dLbl}>État</div><div style={dVal}>{ETAT_LBL[data.etat] ?? data.etat}</div></div></div>)}
                {data.delai && (<div style={detailItem}><Calendar size={14} color={brand} /><div><div style={dLbl}>Délai</div><div style={dVal}>{DELAI_LBL[data.delai] ?? data.delai}</div></div></div>)}
              </div>
            </div>
          </>
        )}

        <div style={cardsRow}>
          <div style={smallCard}><div style={smallHdr}><TrendingUp size={16} color={brand} /><span style={smallTitle}>Conseil du marché</span></div><p style={smallText}>Le marché en Provence Verte est actif. Les biens bien présentés se vendent en 60 90 jours en moyenne.</p></div>
          <div style={smallCard}><div style={smallHdr}><CheckCircle size={16} color={success} /><span style={smallTitle}>Prochaine étape</span></div><p style={smallText}>Une estimation précise nécessite une visite. Alex Lopez se déplace gratuitement pour affiner cette fourchette.</p></div>
        </div>

        <div style={ctaCard}>
          <div>
            <div style={ctaTitle}>Affiner cette estimation ?</div>
            <div style={ctaSub}>Alex Lopez se déplace gratuitement · Sans engagement · Sous 48h</div>
          </div>
          <a href="tel:+33613180168" style={ctaBtn}><Phone size={14} /> 06 13 18 01 68 <ArrowRight size={13} /></a>
        </div>

        <div style={centeredSt}>
          <Link href="/vendre" style={newEstLnk}>Faire une nouvelle estimation</Link>
        </div>
      </main>
    </div>
  )
}
