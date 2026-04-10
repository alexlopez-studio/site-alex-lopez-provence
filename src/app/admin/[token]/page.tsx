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
  return { title: `Dossier ${token.slice(0, 8)}... \u2014 Admin` }
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
const success = '#10B981'
const FONT = 'var(--font-plus-jakarta-sans, system-ui, sans-serif)'

const pageSt: CSSProperties = { minHeight: '100vh', backgroundColor: surface, fontFamily: FONT }
const headerSt: CSSProperties = { backgroundColor: white, borderBottom: '1px solid ' + border, padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '16px' }
const backSt: CSSProperties = { fontSize: '13px', color: muted, textDecoration: 'none' }
const mainSt: CSSProperties = { maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }
const gridSt: CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }
const cardSt: CSSProperties = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '16px', padding: '24px' }
const cardFullSt: CSSProperties = { ...cardSt, gridColumn: '1 / -1' }
const cardTitleSt: CSSProperties = { fontSize: '11px', fontWeight: 700, color: muted, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '16px' } as CSSProperties
const rowSt: CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid ' + border }
const rowLastSt: CSSProperties = { ...rowSt, borderBottom: 'none' }
const rowLbl: CSSProperties = { fontSize: '12px', color: muted }
const rowVal: CSSProperties = { fontSize: '13px', fontWeight: 600, color: fg }
const estimBig: CSSProperties = { fontSize: '32px', fontWeight: 900, color: brand, letterSpacing: '-0.03em', marginBottom: '4px' }
const estimSub: CSSProperties = { fontSize: '13px', color: muted }
const attioBtn: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: brandLight, color: brand, fontSize: '13px', fontWeight: 600, padding: '10px 18px', borderRadius: '999px', textDecoration: 'none', border: '1px solid ' + brand }
const jsonPre: CSSProperties = { fontSize: '11px', color: muted, backgroundColor: surface, padding: '12px', borderRadius: '8px', overflow: 'auto', maxHeight: '300px', margin: 0 }

export default async function AdminDossierPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const lead = await getLead(token)
  if (!lead) notFound()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr'
  const prospectUrl = `${siteUrl}/resultats/${lead.token}`

  const results = lead.results as Record<string, unknown> | null
  const formData = lead.form_data as Record<string, unknown> | null
  const hasEstim = results && typeof results === 'object' && 'valeur_mediane' in results
  const hasAudit = results && typeof results === 'object' && 'score_global' in results
  const attioUrl = lead.attio_record_id
    ? `https://app.attio.com/alexlopez/person/${lead.attio_record_id}`
    : null

  return (
    <div style={pageSt}>
      <header style={headerSt}>
        <Link href="/admin" style={backSt}>\u2190 Retour \u00e0 la liste</Link>
        <span style= color: border >|</span>
        <span style= fontSize: '13px', fontWeight: 600, color: fg >{lead.prenom ?? ''} {lead.nom ?? ''}</span>
        <span style= fontSize: '12px', color: muted, marginLeft: 'auto' >{fmtDate(lead.created_at)}</span>
      </header>

      <main style={mainSt}>
        <div style={gridSt}>

          {/* Contact */}
          <div style={cardSt}>
            <div style={cardTitleSt}>Contact</div>
            {[{ lbl: 'Pr\u00e9nom', val: lead.prenom ?? '\u2014' }, { lbl: 'Nom', val: lead.nom ?? '\u2014' }, { lbl: 'Email', val: lead.email }, { lbl: 'T\u00e9l\u00e9phone', val: lead.telephone ?? '\u2014' }, { lbl: 'Opt-in RGPD', val: lead.opt_in ? '\u2705 Accept\u00e9' : '\u274c Non' }].map(({ lbl, val }, i, arr) => (
              <div key={lbl} style={i === arr.length - 1 ? rowLastSt : rowSt}>
                <span style={rowLbl}>{lbl}</span>
                <span style={rowVal}>{val}</span>
              </div>
            ))}
          </div>

          {/* CRM & Actions */}
          <div style={cardSt}>
            <div style={cardTitleSt}>CRM & Actions</div>
            <div style= display: 'flex', flexDirection: 'column', gap: '12px' >
              {attioUrl && (
                <a href={attioUrl} target="_blank" rel="noopener noreferrer" style={attioBtn}>
                  \ud83d\udce1 Ouvrir la fiche Attio
                </a>
              )}
              <a href={prospectUrl} target="_blank" rel="noopener noreferrer" style= ...attioBtn, backgroundColor: surface, color: muted, borderColor: border >
                \ud83d\udd17 Lien prospect
              </a>
              <ResendMagicLinkButton token={lead.token} />
            </div>
          </div>

          {/* R\u00e9sultats estimation */}
          {hasEstim && (
            <div style={cardSt}>
              <div style={cardTitleSt}>Estimation DVF</div>
              <div style={estimBig}>{fmt(results.valeur_mediane as number)}</div>
              <div style={estimSub}>{fmt(results.fourchette_basse as number)} \u2014 {fmt(results.fourchette_haute as number)}</div>
              <div style= marginTop: '16px' >
                {[{ lbl: 'Prix au m\u00b2', val: `${results.prix_m2_median} \u20ac/m\u00b2` }, { lbl: 'Transactions DVF', val: String(results.nb_transactions) }, { lbl: 'Rayon', val: `${results.rayon_km} km` }, { lbl: 'Fiabilit\u00e9', val: `${results.confiance}%` }].map(({ lbl, val }, i, arr) => (
                  <div key={lbl} style={i === arr.length - 1 ? rowLastSt : rowSt}>
                    <span style={rowLbl}>{lbl}</span><span style={rowVal}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Score audit */}
          {hasAudit && (
            <div style={cardSt}>
              <div style={cardTitleSt}>Score audit</div>
              <div style= fontSize: '48px', fontWeight: 900, color: Number(results.score_global) >= 70 ? success : '#F59E0B', letterSpacing: '-0.03em' >{results.score_global as number}<span style= fontSize: '20px', fontWeight: 400, color: muted >/100</span></div>
              {[{ lbl: 'Structure', val: `${results.score_structure}/100` }, { lbl: '\u00c9nergie', val: `${results.score_energie}/100` }, { lbl: 'Confort', val: `${results.score_confort}/100` }].map(({ lbl, val }, i, arr) => (
                <div key={lbl} style={i === arr.length - 1 ? rowLastSt : rowSt}>
                  <span style={rowLbl}>{lbl}</span><span style={rowVal}>{val}</span>
                </div>
              ))}
            </div>
          )}

          {/* Donn\u00e9es brutes formulaire */}
          {formData && (
            <div style={cardFullSt}>
              <div style={cardTitleSt}>Donn\u00e9es brutes du formulaire</div>
              <pre style={jsonPre}>{JSON.stringify(formData, null, 2)}</pre>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
