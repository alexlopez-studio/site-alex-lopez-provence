import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/leads-repo', () => ({
  getLeadById: vi.fn(),
}))

import { lookupLead, isUuidToken } from '../lookup'
import { getLeadById } from '@/lib/leads-repo'

const mockedGetLeadById = vi.mocked(getLeadById)

const VALID_UUID = '11111111-2222-3333-4444-555555555555'

const FAKE_LEAD = {
  id: VALID_UUID,
  prospect_id: 'p-1',
  tool: 'vendre' as const,
  status: 'nouveau' as const,
  form_data: { surface: 80 },
  results: { value: 250000 },
  commune: 'Brignoles',
  source_channel: 'estimation_site',
  priority: 'medium' as const,
  next_action: 'Qualifier la demande d’estimation',
  due_date: null,
  follow_up_at: null,
  magic_link_expires_at: '2099-01-01T00:00:00.000Z',
  magic_link_sent_at: null,
  deleted_at: null,
  created_at: '2026-05-03T12:00:00.000Z',
  updated_at: '2026-05-03T12:00:00.000Z',
  prospect: {
    id: 'p-1',
    email: 'jane@example.com',
    first_name: 'Jane',
    last_name: 'Doe',
    phone: null,
  },
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('isUuidToken', () => {
  it('accepts valid lowercase and uppercase UUID v4-shaped strings', () => {
    expect(isUuidToken(VALID_UUID)).toBe(true)
    expect(isUuidToken(VALID_UUID.toUpperCase())).toBe(true)
  })

  it('rejects legacy JWT tokens', () => {
    expect(isUuidToken('eyJhbGciOiJIUzI1NiJ9.payload.signature')).toBe(false)
  })

  it('rejects empty / random / mis-shaped strings', () => {
    expect(isUuidToken('')).toBe(false)
    expect(isUuidToken('not-a-uuid')).toBe(false)
    expect(isUuidToken('1234')).toBe(false)
  })
})

describe('lookupLead', () => {
  it('returns invalid-format on non-UUID token without hitting the DB', async () => {
    const r = await lookupLead('not-a-uuid')
    expect(r.kind).toBe('invalid-format')
    expect(mockedGetLeadById).not.toHaveBeenCalled()
  })

  it('returns not-found when getLeadById returns null', async () => {
    mockedGetLeadById.mockResolvedValueOnce(null)
    const r = await lookupLead(VALID_UUID)
    expect(r.kind).toBe('not-found')
  })

  it('returns expired when magic_link_expires_at is in the past', async () => {
    mockedGetLeadById.mockResolvedValueOnce({
      ...FAKE_LEAD,
      magic_link_expires_at: '2020-01-01T00:00:00.000Z',
    })
    const r = await lookupLead(VALID_UUID)
    expect(r.kind).toBe('expired')
  })

  it('returns ok with the joined lead on happy path', async () => {
    mockedGetLeadById.mockResolvedValueOnce(FAKE_LEAD)
    const r = await lookupLead(VALID_UUID)
    expect(r.kind).toBe('ok')
    if (r.kind === 'ok') {
      expect(r.lead.id).toBe(VALID_UUID)
      expect(r.lead.tool).toBe('vendre')
      expect(r.lead.prospect.email).toBe('jane@example.com')
    }
  })

  it('returns error when getLeadById throws', async () => {
    mockedGetLeadById.mockRejectedValueOnce(new Error('connection lost'))
    const r = await lookupLead(VALID_UUID)
    expect(r.kind).toBe('error')
  })

  it('accepts uppercase UUIDs and still resolves', async () => {
    mockedGetLeadById.mockResolvedValueOnce(FAKE_LEAD)
    const r = await lookupLead(VALID_UUID.toUpperCase())
    expect(r.kind).toBe('ok')
    expect(mockedGetLeadById).toHaveBeenCalledWith(VALID_UUID.toUpperCase())
  })
})
