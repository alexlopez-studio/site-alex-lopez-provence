import type { Metadata } from 'next'
import Link from 'next/link'
import type { CSSProperties } from 'react'

export const metadata: Metadata = { title: 'Administration — Alex Lopez Provence' }

const brand = '#0077B6'
const fg = '#0F172A'
const muted = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const white = '#ffffff'
const FONT = 'var(--font-plus-jakarta-sans, system-ui, sans-serif)'

export default function AdminPage() {
  const pageSt: CSSProperties = { minHeight: '100vh', backgroundColor: surface, fontFamily: FONT }
  const headerSt: CSSProperties = { backgroundColor: white, borderBottom: '1px solid ' + border, padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }
  const titleSt: CSSProperties = { fontSize: '18px', fontWeight: 900, color: fg, letterSpacing: '-0.02em' }
  const subTitleSt: CSSProperties = { fontSize: '12px', color: muted }
  const mainSt: CSSProperties = { maxWidth: '720px', margin: '0 auto', padding: '48px 24px' }
  const cardSt: CSSProperties = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '20px', padding: '28px', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' }
  const h1St: CSSProperties = { fontSize: '24px', fontWeight: 900, color: fg, letterSpacing: '-0.03em', margin: 0 }
  const pSt: CSSProperties = { fontSize: '14px', lineHeight: 1.7, color: muted, marginTop: '12px' }
  const badgeSt: CSSProperties = { display: 'inline-flex', alignItems: 'center', borderRadius: '999px', backgroundColor: '#E0F0FA', color: brand, fontSize: '12px', fontWeight: 800, padding: '6px 12px', marginBottom: '16px' }
  const backLnkSt: CSSProperties = { fontSize: '13px', color: muted, textDecoration: 'none' }
  const ctaSt: CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginTop: '20px', borderRadius: '999px', backgroundColor: brand, color: white, padding: '12px 18px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }

  return (
    <div style={pageSt}>
      <header style={headerSt}>
        <div>
          <div style={titleSt}>Administration</div>
          <div style={subTitleSt}>Dashboard mis en pause — priorité estimation</div>
        </div>
        <Link href="/" style={backLnkSt}>← Retour au site</Link>
      </header>
      <main style={mainSt}>
        <section style={cardSt}>
          <div style={badgeSt}>Mode estimation-first</div>
          <h1 style={h1St}>Le dashboard Supabase est temporairement désactivé.</h1>
          <p style={pSt}>
            Pour stabiliser rapidement l’outil d’estimation sur preview, Supabase
            est sorti du chemin critique. Les nouvelles demandes d’estimation
            passent par le flux autonome et peuvent être sauvegardées dans Notion
            si les variables Notion sont configurées.
          </p>
          <p style={pSt}>
            Le dashboard complet sera repris plus tard, après validation de
            l’estimation.
          </p>
          <Link href="/outils/vendre" style={ctaSt}>Tester l’estimation</Link>
        </section>
      </main>
    </div>
  )
}
