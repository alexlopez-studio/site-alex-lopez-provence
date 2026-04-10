import type { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import type { Database } from '@/types/supabase'

export const metadata: Metadata = { title: 'Administration \u2014 Alex Lopez Provence' }
export const dynamic = 'force-dynamic'

const brand = '#0077B6'
const fg = '#0F172A'
const muted = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const white = '#ffffff'
const success = '#10B981'
const FONT = 'var(--font-plus-jakarta-sans, system-ui, sans-serif)'

const TYPE_COLOR: Record<string, string> = { vendre: '#E0F0FA', acheter: '#d1fae5', audit: '#fef9c3' }
const TYPE_TEXT: Record<string, string> = { vendre: brand, acheter: '#059669', audit: '#92400e' }
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
    return parts[parts.length - 1]?.trim() ?? '\u2014'
  } catch { return '\u2014' }
}

async function getLeads(): Promise<Lead[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []
  const sb = createClient<Database>(url, key)
  const { data, error } = await sb.from('leads').select('*').order('created_at', { ascending: false })
  if (error) { console.error('[Admin] Supabase:', error); return [] }
  return data ?? []
}

export default async function AdminPage() {
  const leads = await getLeads()

  const pageSt: CSSProperties = { minHeight: '100vh', backgroundColor: surface, fontFamily: FONT }
  const headerSt: CSSProperties = { backgroundColor: white, borderBottom: '1px solid ' + border, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
  const titleSt: CSSProperties = { fontSize: '18px', fontWeight: 900, color: fg, letterSpacing: '-0.02em' }
  const subSt: CSSProperties = { fontSize: '12px', color: muted }
  const mainSt: CSSProperties = { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }
  const statRow: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }
  const statCard: CSSProperties = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '16px', padding: '20px 24px' }
  const statNum: CSSProperties = { fontSize: '28px', fontWeight: 900, color: fg, letterSpacing: '-0.03em' }
  const statLbl: CSSProperties = { fontSize: '12px', color: muted, marginTop: '4px' }
  const tableSt: CSSProperties = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '16px', overflow: 'hidden' }
  const thSt: CSSProperties = { padding: '12px 16px', fontSize: '11px', fontWeight: 600, color: muted, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left', borderBottom: '1px solid ' + border, backgroundColor: surface } as CSSProperties
  const tdSt: CSSProperties = { padding: '14px 16px', fontSize: '13px', color: fg, borderBottom: '1px solid ' + border, verticalAlign: 'middle' }
  const tdLastSt: CSSProperties = { ...tdSt, borderBottom: 'none' }
  const lnkSt: CSSProperties = { color: brand, fontWeight: 600, textDecoration: 'none' }
  const emptyWrap: CSSProperties = { padding: '60px 24px', textAlign: 'center', color: muted }

  const vendreCount = leads.filter((l) => l.type === 'vendre').length
  const acheterCount = leads.filter((l) => l.type === 'acheter').length
  const auditCount = leads.filter((l) => l.type === 'audit').length

  function typeBadge(type: string) {
    const bg = TYPE_COLOR[type] ?? border
    const c = TYPE_TEXT[type] ?? muted
    const lbl = TYPE_LBL[type] ?? type
    const badgeSt: CSSProperties = { display: 'inline-block', backgroundColor: bg, color: c, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px' }
    return <span style={badgeSt}>{lbl}</span>
  }

  return (
    <div style={pageSt}>
      <header style={headerSt}>
        <div>
          <div style={titleSt}>Administration</div>
          <div style={subSt}>Alex Lopez Provence \u00b7 {leads.length} dossier{leads.length !== 1 ? 's' : ''}</div>
        </div>
        <Link href="/" style= fontSize: '13px', color: muted, textDecoration: 'none' >\u2190 Retour au site</Link>
      </header>

      <main style={mainSt}>
        <div style={statRow}>
          <div style={statCard}><div style={statNum}>{leads.length}</div><div style={statLbl}>Total dossiers</div></div>
          <div style={statCard}><div style={statNum}>{vendreCount}</div><div style={statLbl}>Estimations vendeur</div></div>
          <div style={statCard}><div style= ...statNum, fontSize: '22px' >{acheterCount} \u00b7 {auditCount}</div><div style={statLbl}>Acheteurs \u00b7 Audits</div></div>
        </div>

        <div style={tableSt}>
          {leads.length === 0 ? (
            <div style={emptyWrap}>Aucun dossier pour le moment.</div>
          ) : (
            <table style= width: '100%', borderCollapse: 'collapse' >
              <thead>
                <tr>
                  <th style={thSt}>Date</th>
                  <th style={thSt}>Nom</th>
                  <th style={thSt}>Type</th>
                  <th style={thSt}>Commune</th>
                  <th style={thSt}>Email</th>
                  <th style={thSt}>Dossier</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, i) => {
                  const isLast = i === leads.length - 1
                  const td = isLast ? tdLastSt : tdSt
                  return (
                    <tr key={lead.id}>
                      <td style={td}>{fmtDate(lead.created_at)}</td>
                      <td style= ...td, fontWeight: 600 >{lead.prenom ?? ''} {lead.nom ?? ''}</td>
                      <td style={td}>{typeBadge(lead.type)}</td>
                      <td style={td}>{getCommune(lead)}</td>
                      <td style= ...td, color: muted >{lead.email}</td>
                      <td style={td}>
                        <Link href={`/admin/${lead.token}`} style={lnkSt}>Ouvrir \u2192</Link>
                      </td>
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
