import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Database } from '@/types/supabase'

export const metadata: Metadata = { title: 'Administration — Alex Lopez Provence' }
export const dynamic = 'force-dynamic'

const brand = '#0077B6'
const fg = '#0F172A'
const muted = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const white = '#ffffff'
const FONT = 'var(--font-plus-jakarta-sans, system-ui, sans-serif)'

const TYPE_BG: Record<string, string> = { vendre: '#E0F0FA', acheter: '#d1fae5', audit: '#fef9c3' }
const TYPE_CLR: Record<string, string> = { vendre: brand, acheter: '#059669', audit: '#92400e' }
const TYPE_LBL: Record<string, string> = { vendre: 'Estimation', acheter: 'Acheteur', audit: 'Audit' }

type Lead = Database['public']['Tables']['leads']['Row']

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function getCommune(lead: Lead): string {
  try {
    const fd = lead.form_data as Record<string, unknown>
    const adresse = (fd?.adresse ?? '') as string
    const parts = adresse.split(',')
    return parts[parts.length - 1]?.trim() ?? '—'
  } catch { return '—' }
}

async function getLeads(): Promise<Lead[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []
  const sb = createClient<Database>(url, key)
  const { data, error } = await sb.from('leads').select('*').order('created_at', { ascending: false })
  if (error) return []
  return data ?? []
}

export default async function AdminPage() {
  const leads = await getLeads()

  const pageSt: CSSProperties = { minHeight: '100vh', backgroundColor: surface, fontFamily: FONT }
  const headerSt: CSSProperties = { backgroundColor: white, borderBottom: '1px solid ' + border, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
  const titleSt: CSSProperties = { fontSize: '18px', fontWeight: 900, color: fg, letterSpacing: '-0.02em' }
  const subTitleSt: CSSProperties = { fontSize: '12px', color: muted }
  const mainSt: CSSProperties = { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }
  const statRow: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }
  const statCard: CSSProperties = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '16px', padding: '20px 24px' }
  const statNum: CSSProperties = { fontSize: '28px', fontWeight: 900, color: fg, letterSpacing: '-0.03em' }
  const statLbl: CSSProperties = { fontSize: '12px', color: muted, marginTop: '4px' }
  const tableSt: CSSProperties = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '16px', overflow: 'hidden' }
  const tableInnerSt: CSSProperties = { width: '100%', borderCollapse: 'collapse' }
  const thSt: CSSProperties = { padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: muted, textTransform: 'uppercase' as const, letterSpacing: '0.1em', textAlign: 'left' as const, borderBottom: '1px solid ' + border, backgroundColor: surface }
  const tdSt: CSSProperties = { padding: '14px 16px', fontSize: '13px', color: fg, borderBottom: '1px solid ' + border, verticalAlign: 'middle' as const }
  const tdLastSt: CSSProperties = { ...tdSt, borderBottom: 'none' }
  const tdBoldSt: CSSProperties = { ...tdSt, fontWeight: 700 }
  const tdBoldLastSt: CSSProperties = { ...tdLastSt, fontWeight: 700 }
  const tdMutedSt: CSSProperties = { ...tdSt, color: muted }
  const tdMutedLastSt: CSSProperties = { ...tdLastSt, color: muted }
  const lnkSt: CSSProperties = { color: brand, fontWeight: 600, textDecoration: 'none' }
  const backLnkSt: CSSProperties = { fontSize: '13px', color: muted, textDecoration: 'none' }
  const emptyWrap: CSSProperties = { padding: '60px 24px', textAlign: 'center' as const, color: muted }

  const vendreCount = leads.filter((l) => l.type === 'vendre').length
  const acheterCount = leads.filter((l) => l.type === 'acheter').length
  const auditCount = leads.filter((l) => l.type === 'audit').length

  function typeBadge(type: string) {
    const badgeSt: CSSProperties = { display: 'inline-block', backgroundColor: TYPE_BG[type] ?? border, color: TYPE_CLR[type] ?? muted, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }
    return <span style={badgeSt}>{TYPE_LBL[type] ?? type}</span>
  }

  return (
    <div style={pageSt}>
      <header style={headerSt}>
        <div>
          <div style={titleSt}>Administration</div>
          <div style={subTitleSt}>Alex Lopez Provence · {leads.length} dossier{leads.length !== 1 ? 's' : ''}</div>
        </div>
        <Link href="/" style={backLnkSt}>← Retour au site</Link>
      </header>
      <main style={mainSt}>
        <div style={statRow}>
          <div style={statCard}><div style={statNum}>{leads.length}</div><div style={statLbl}>Total dossiers</div></div>
          <div style={statCard}><div style={statNum}>{vendreCount}</div><div style={statLbl}>Estimations vendeur</div></div>
          <div style={statCard}><div style={statNum}>{acheterCount + auditCount}</div><div style={statLbl}>Acheteurs + Audits</div></div>
        </div>
        <div style={tableSt}>
          {leads.length === 0 ? (
            <div style={emptyWrap}>Aucun dossier pour le moment.</div>
          ) : (
            <table style={tableInnerSt}>
              <thead>
                <tr>
                  {['Date', 'Nom', 'Type', 'Commune', 'Email', 'Dossier'].map((h) => (
                    <th key={h} style={thSt}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => {
                  const isLast = i === leads.length - 1
                  const td = isLast ? tdLastSt : tdSt
                  const tdB = isLast ? tdBoldLastSt : tdBoldSt
                  const tdM = isLast ? tdMutedLastSt : tdMutedSt
                  return (
                    <tr key={lead.id}>
                      <td style={td}>{fmtDate(lead.created_at)}</td>
                      <td style={tdB}>{lead.prenom ?? ''} {lead.nom ?? ''}</td>
                      <td style={td}>{typeBadge(lead.type)}</td>
                      <td style={td}>{getCommune(lead)}</td>
                      <td style={tdM}>{lead.email}</td>
                      <td style={td}><Link href={'/admin/' + lead.token} style={lnkSt}>Ouvrir →</Link></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
