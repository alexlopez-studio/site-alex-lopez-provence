import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../route'

vi.mock('@/lib/leads-repo', () => ({
  upsertProspect: vi.fn().mockResolvedValue({ id: 'prospect-123' }),
  createLead: vi.fn().mockResolvedValue({ id: 'lead-456' }),
}))

describe('POST /api/guide/download', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects requests without email', async () => {
    const req = new NextRequest('http://localhost/api/guide/download', {
      method: 'POST',
      body: JSON.stringify({ prenom: 'Jean', opt_in: true }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('email valide est requise')
  })

  it('rejects requests without RGPD opt_in', async () => {
    const req = new NextRequest('http://localhost/api/guide/download', {
      method: 'POST',
      body: JSON.stringify({ email: 'jean@example.fr', opt_in: false }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
    const json = await res.json()
    expect(json.success).toBe(false)
    expect(json.error).toContain('consentement RGPD')
  })

  it('accepts valid download request and returns guide access URL', async () => {
    const req = new NextRequest('http://localhost/api/guide/download', {
      method: 'POST',
      body: JSON.stringify({
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.fr',
        telephone: '0612345678',
        commune: 'Cotignac',
        opt_in: true,
      }),
    })
    const res = await POST(req)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.downloadUrl).toBe('/guide-vendeur')
  })
})
