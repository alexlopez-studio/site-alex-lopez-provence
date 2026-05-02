'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import type { CSSProperties } from 'react'
import { Suspense } from 'react'

const brand = '#0077B6'
const fg = '#0F172A'
const muted = '#64748B'
const border = '#E2E8F0'
const surface = '#F8FAFC'
const white = '#ffffff'
const error = '#EF4444'
const FONT = 'var(--font-plus-jakarta-sans, system-ui, sans-serif)'

const pageSt: CSSProperties = { minHeight: '100vh', backgroundColor: surface, fontFamily: FONT, display: 'flex', alignItems: 'center', justifyContent: 'center' }
const cardSt: CSSProperties = { backgroundColor: white, border: '1px solid ' + border, borderRadius: '20px', padding: '40px 36px', width: '100%', maxWidth: '380px' }
const titleSt: CSSProperties = { fontSize: '20px', fontWeight: 900, color: fg, marginBottom: '6px', letterSpacing: '-0.02em' }
const subSt: CSSProperties = { fontSize: '13px', fontWeight: 300, color: muted, marginBottom: '28px' }
const labelSt: CSSProperties = { fontSize: '12px', fontWeight: 600, color: fg, marginBottom: '6px', display: 'block' }
const inputSt: CSSProperties = { width: '100%', padding: '12px 14px', border: '1.5px solid ' + border, borderRadius: '12px', fontSize: '14px', color: fg, outline: 'none', boxSizing: 'border-box', marginBottom: '16px' }
const btnSt: CSSProperties = { width: '100%', padding: '13px', borderRadius: '12px', backgroundColor: brand, border: 'none', color: white, fontSize: '14px', fontWeight: 600, cursor: 'pointer' }
const btnOffSt: CSSProperties = { ...btnSt, backgroundColor: border, color: muted, cursor: 'not-allowed' }
const errorSt: CSSProperties = { fontSize: '13px', color: error, marginBottom: '12px', fontWeight: 500 }

function LoginForm() {
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/admin'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password.trim()) return
    setLoading(true)
    setErr('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push(redirect)
        router.refresh()
      } else {
        setErr('Mot de passe incorrect')
      }
    } catch {
      setErr('Erreur r\éseau, r\éessayez')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={pageSt}>
      <div style={cardSt}>
        <div style={titleSt}>Administration</div>
        <div style={subSt}>Alex Lopez Provence \· Acc\ès r\éserv\é</div>
        <form onSubmit={handleSubmit}>
          <label style={labelSt}>Mot de passe</label>
          <input
            type="password"
            style={inputSt}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            disabled={loading}
          />
          {err && <div style={errorSt}>{err}</div>}
          <button
            type="submit"
            style={password.trim() && !loading ? btnSt : btnOffSt}
            disabled={!password.trim() || loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
