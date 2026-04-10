import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft, Phone, Clock } from 'lucide-react'
import type { CSSProperties } from 'react'

export const metadata: Metadata = {
  title: 'Audit immobilier express | Alex Lopez \u00b7 Mandataire IAD',
  description: 'Obtenez un audit express de votre bien immobilier en Provence Verte avec Alex Lopez, mandataire IAD.',
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
const navSt: CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: white, borderBottom: '1px solid ' + border }
const navIn: CSSProperties = { maxWidth: '75rem', margin: '0 auto', padding: '18px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
const backLnk: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: muted, textDecoration: 'none' }
const phoneLnk: CSSProperties = { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: fg, textDecoration: 'none' }
const mainSt: CSSProperties = { maxWidth: '600px', margin: '0 auto', padding: '120px 24px 60px', textAlign: 'center' }
const cardSt: CSSProperties = { backgroundColor: white, borderRadius: '20px', border: '1px solid ' + border, padding: '48px 36px' }
const badgeSt: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: brandLight, color: brand, fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '999px', marginBottom: '20px' }
const h1St: CSSProperties = { fontSize: '24px', fontWeight: 900, color: fg, marginBottom: '12px', letterSpacing: '-0.02em' }
const subSt: CSSProperties = { fontSize: '15px', fontWeight: 300, color: muted, lineHeight: 1.6, marginBottom: '32px' }
const ctaBtnSt: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: brand, color: white, fontSize: '14px', fontWeight: 600, padding: '14px 28px', borderRadius: '999px', textDecoration: 'none' }

export default function AuditPage() {
  return (
    <div style={pageSt}>
      <header style={navSt}>
        <div style={navIn}>
          <Link href="/" style={backLnk}><ChevronLeft size={16} /> Retour</Link>
          <a href="tel:+33613180168" style={phoneLnk}><Phone size={14} color={brand} /> 06\u00a013\u00a018\u00a001\u00a068</a>
        </div>
      </header>
      <main style={mainSt}>
        <div style={cardSt}>
          <div style={badgeSt}><Clock size={13} /> Bient\u00f4t disponible</div>
          <h1 style={h1St}>Audit immobilier express</h1>
          <p style={subSt}>Le formulaire d\'audit express sera disponible prochainement. Pour une \u00e9valuation imm\u00e9diate, appelez-moi directement.</p>
          <a href="tel:+33613180168" style={ctaBtnSt}><Phone size={14} /> Appeler Alex Lopez</a>
        </div>
      </main>
    </div>
  )
}
