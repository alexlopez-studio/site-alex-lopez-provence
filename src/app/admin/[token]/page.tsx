import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CSSProperties } from 'react'
import type { Database } from '@/types/supabase'
import ResendMagicLinkButton from './ResendButton'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params
  return { title: 'Dossier ' + token.slice(0, 8) + '… — Admin' }
}

type Lead = Database['public']['Tables']['leads']['Row']

async function getLead(token: string): Promise<Lead | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const sb = createClient<Database>(url, key)
  const { data, error } = await sb.from('leads').select('*').eq('token', token).single()
  if (error) return null
  return data
}

function fmt(n: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}
function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const brand = '#0077B6'
const brandLight = '#E0F0FA'
const fg = '#0F172A'
const muted = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const white = '#ffffff'
const FONT = 'var(--font-plus-jakarta-sans, system-ui, sans-serif)'

const pageSt: CSSProperties = { minHeight: '100vh', backgroundColor: surface, fontFamily: FONT }
const headerSt: CSSProperties = { backgroundColor: white, borderBottom: '1px solid ' + border, padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }
const backSt: CSSProperties = { fontSize: '13px', color: muted, textDecoration: 'none' }
const sepSt: CSSProperties = { color: border, fontSize: '13px' }
const nameSt: CSSProperties = { fontSize: '15px', fontWeight: 700, color: fg }
const dateSt: CSSProperties = { fontSize: '12px', color: muted, marginLeft: 'auto' }
const mainSt: CSSProperties = { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }
const gridSt: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }
const cardSt: CSSProperties = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '16px', padding: '24px' }
const cardFullSt: CSSProperties = { ...cardSt, gridColumn: '1 / -1' }
const cardTitleSt: CSSProperties = { fontSize: '11px', fontWeight: 700, color: muted, textTransform: 'uppercase' as const, letterSpacing: '0.12em', marginBottom: '16px' }
const rowSt: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid ' + border }
const rowLastSt: CSSProperties = { ...rowSt, borderBottom: 'none' }
const rowLbl: CSSProperties = { fontSize: '12px', color: muted }
const rowVal: CSSProperties = { fontSize: '13px', fontWeight: 600, color: fg }
const estimBig: CSSProperties = { fontSize: '32px', fontWeight: 900, color: brand, letterSpacing: '-0.03em', marginBottom: '4px' }
const estimSub: CSSProperties = { fontSize: '13px', color: muted }
const scoreNumSt: CSSProperties = { fontSize: '32px', fontWeight: 900, color: brand, letterSpacing: '-0.03em' }
const scoreUnitSt: CSSProperties = { fontSize: '16px', color: muted, fontWeight: 400 }
const scoreWrapSt: CSSProperties = { marginBottom: '16px' }
const actionsWrap: CSSProperties = { display: 'flex', flexDirection: 'column', gap: '10px' }
const attioBtn: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: brandLight, color: brand, fontSize: '13px', fontWeight: 600, padding: '10px 18px', borderRadius: '999px', textDecoration: 'none', border: '1px solid ' + brand }
const prospectBtn: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: surface, color: fg, fontSize: '13px', fontWeight: 600, padding: '10px 18px', borderRadius: '999px', textDecoration: 'none', border: '1px solid ' + border }
const jsonPre: CSSProperties = { fontSize: '11px', color: muted, backgroundColor: surface, padding: '12px', borderRadius: '8px', overflow: 'auto', maxHeight: '300px', margin: 0 }
const estimRowsWrap: CSSProperties = { marginTop: '16px' }

export default async function AdminDossierPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const lead = await getLead(token)
  if (!lead) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr'
  const prospectUrl = siteUrl + '/resultats/' + lead.token
  const attioUrl = lead.attio_record_id
    ? 'https://app.attio.com/person/' + lead.attio_record_id
    : null

  const results = lead.results as Record<string, unknown> | null
  const formData = lead.form_data as Record<string, unknown> | null
  const hasEstim = results != null && 'valeur_mediane' in results
  const hasAudit = results != null && 'score_global' in results

  const contactRows = [
    { lbl: 'Prénom', val: lead.prenom ?? '—' },
    { lbl: 'Nom', val: lead.nom ?? '—' },
    { lbl: 'Email', val: lead.email },
    { lbl: 'Téléphone', val: lead.telephone ?? '—' },
    { lbl: 'Date de soumission', val: fmtDate(lead.created_at) },
    { lbl: 'Opt-in RGPD', val: lead.opt_in ? '✅ Accepté' : '❌ Non' },
  ]

  return (
    <div style={pageSt}>
      <header style={headerSt}>
        <Link href="/admin" style={backSt}>← Retour</Link>
        <span style={sepSt}>|</span>
        <span style={nameSt}>{lead.prenom ?? ''} {lead.nom ?? ''}</span>
        <span style={dateSt}>{fmtDate(lead.created_at)}</span>
      </header>
      <main style={mainSt}>
        <div style={gridSt}>

          <div style={cardSt}>
            <div style={cardTitleSt}>Contact</div>
            {contactRows.map(({ lbl, val }, i) => (
              <div key={lbl} style={i === contactRows.length - 1 ? rowLastSt : rowSt}>
                <span style={rowLbl}>{lbl}</span>
                <span style={rowVal}>{val}</span>
              </div>
            ))}
          </div>

          <div style={cardSt}>
            <div style={cardTitleSt}>CRM & Actions</div>
            <div style={actionsWrap}>
              {attioUrl && (
                <a href={attioUrl} target="_blank" rel="noopener noreferrer" style={attioBtn}>
                  📡 Ouvrir la fiche Attio
                </a>
              )}
              <a href={prospectUrl} target="_blank" rel="noopener noreferrer" style={prospectBtn}>
                🔗 Lien prospect
              </a>
              <ResendMagicLinkButton token={lead.token} />
            </div>
          </div>

          {hasEstim && results && (
            <div style={cardSt}>
              <div style={cardTitleSt}>Estimation DVF</div>
              <div style={estimBig}>{fmt(results.valeur_mediane as number)}</div>
              <div style={estimSub}>{fmt(results.fourchette_basse as number)} — {fmt(results.fourchette_haute as number)}</div>
              <div style={estimRowsWrap}>
                {([
                  ['Prix au m²', (results.prix_m2_median as number).toLocaleString('fr-FR') + ' €/m²'],
                  ['Transactions DVF', String(results.nb_transactions)],
                  ['Rayon', results.rayon_km + ' km'],
                  ['Fiabilité', results.confiance + '%'],
                ] as [string, string][]).map(([lbl, val], i, arr) => (
                  <div key={lbl} style={i === arr.length - 1 ? rowLastSt : rowSt}>
                    <span style={rowLbl}>{lbl}</span><span style={rowVal}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasAudit && results && (
            <div style={cardSt}>
              <div style={cardTitleSt}>Score audit</div>
              <div style={scoreWrapSt}>
                <span style={scoreNumSt}>{results.score_global as number}</span>
                <span style={scoreUnitSt}>/100</span>
              </div>
              {([
                ['Structure', (results.score_structure as number) + '/100'],
                ['Énergie', (results.score_energie as number) + '/100'],
                ['Confort', (results.score_confort as number) + '/100'],
              ] as [string, string][]).map(([lbl, val], i, arr) => (
                <div key={lbl} style={i === arr.length - 1 ? rowLastSt : rowSt}>
                  <span style={rowLbl}>{lbl}</span><span style={rowVal}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {formData && (
            <div style={cardFullSt}>
              <div style={cardTitleSt}>Données brutes du formulaire</div>
              <pre style={jsonPre}>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
