'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'

const brand = '#0077B6'
const surface = '#F8FAFC'
const border = '#E2E8F0'
const muted = '#64748B'
const success = '#10B981'

export default function ResendMagicLinkButton({ token }: { token: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleResend() {
    setStatus('loading')
    try {
      const res = await fetch('/api/admin/resend-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      setStatus(res.ok ? 'done' : 'error')
    } catch {
      setStatus('error')
    }
  }

  const base: CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, padding: '10px 18px', borderRadius: '999px', cursor: 'pointer', border: '1px solid ' + border }
  const idle: CSSProperties = { ...base, backgroundColor: surface, color: muted }
  const loading: CSSProperties = { ...base, backgroundColor: surface, color: muted, cursor: 'wait' }
  const done: CSSProperties = { ...base, backgroundColor: '#d1fae5', color: success, borderColor: '#a7f3d0', cursor: 'default' }
  const errSt: CSSProperties = { ...base, backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5', cursor: 'default' }

  if (status === 'done') return <div style={done}>\✅ Magic link renvoy\é</div>
  if (status === 'error') return <div style={errSt}>\❌ Erreur \— r\éessayez</div>

  return (
    <button
      style={status === 'loading' ? loading : idle}
      onClick={handleResend}
      disabled={status === 'loading'}
    >
      {status === 'loading' ? 'Envoi...' : '\�\� Renvoyer le magic link'}
    </button>
  )
}
