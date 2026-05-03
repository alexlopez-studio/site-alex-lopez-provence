import { describe, it, expect, afterEach, vi } from 'vitest'
import {
  searchBanAddresses,
  precisionLabel,
  type BanFeatureType,
} from '@/lib/ban'

type MockResponse = { status?: number; body: unknown }

function mockFetch(
  routes: Array<{ match: string; response: MockResponse }>,
) {
  const fn = vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString()
    for (const route of routes) {
      if (url.includes(route.match)) {
        return new Response(JSON.stringify(route.response.body), {
          status: route.response.status ?? 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }
    return new Response(
      JSON.stringify({ type: 'FeatureCollection', features: [] }),
      { status: 200 },
    )
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

function feature(
  type: BanFeatureType,
  overrides: Record<string, unknown> = {},
) {
  return {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [6.1494, 43.5283] },
    properties: {
      label: '3252 Route d\'Entrecasteaux 83570 Cotignac',
      score: 0.7,
      type,
      id: 'X' + type,
      city: 'Cotignac',
      citycode: '83042',
      postcode: '83570',
      housenumber: type === 'housenumber' ? '3252' : null,
      ...overrides,
    },
  }
}

describe('lib/ban.precisionLabel', () => {
  it('maps each precision to a French label', () => {
    expect(precisionLabel('exact')).toBe('N° exact')
    expect(precisionLabel('street')).toBe('Voie sans n°')
    expect(precisionLabel('locality')).toBe('Localité')
    expect(precisionLabel('unknown')).toBe('Imprecis')
  })
})

describe('lib/ban.searchBanAddresses', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('returns empty array for queries shorter than 3 chars', async () => {
    mockFetch([])
    expect(await searchBanAddresses({ q: 'ab' })).toEqual([])
    expect(await searchBanAddresses({ q: '   ' })).toEqual([])
  })

  it('parses suggestions and maps precision from BAN type', async () => {
    mockFetch([
      {
        match: 'api-adresse.data.gouv.fr',
        response: {
          body: {
            type: 'FeatureCollection',
            features: [feature('housenumber')],
          },
        },
      },
    ])
    const r = await searchBanAddresses({ q: '3252 route entrecasteaux' })
    expect(r).toHaveLength(1)
    expect(r[0].precision).toBe('exact')
    expect(r[0].type).toBe('housenumber')
    expect(r[0].housenumber).toBe('3252')
    expect(r[0].lat).toBe(43.5283)
    expect(r[0].lng).toBe(6.1494)
    expect(r[0].city).toBe('Cotignac')
    expect(r[0].citycode).toBe('83042')
  })

  it('ranks housenumber suggestions before street ones (the bug we are fixing)', async () => {
    mockFetch([
      {
        match: 'api-adresse.data.gouv.fr',
        response: {
          body: {
            type: 'FeatureCollection',
            features: [
              // BAN may return street first with higher score
              feature('street', {
                id: 'STREET',
                score: 0.95,
                housenumber: null,
              }),
              feature('housenumber', {
                id: 'HN',
                score: 0.6,
              }),
            ],
          },
        },
      },
    ])
    const r = await searchBanAddresses({ q: 'route entrecasteaux' })
    expect(r).toHaveLength(2)
    expect(r[0].id).toBe('HN')
    expect(r[0].precision).toBe('exact')
    expect(r[1].id).toBe('STREET')
    expect(r[1].precision).toBe('street')
  })

  it('falls back to score ordering within the same precision bucket', async () => {
    mockFetch([
      {
        match: 'api-adresse.data.gouv.fr',
        response: {
          body: {
            type: 'FeatureCollection',
            features: [
              feature('housenumber', { id: 'HN1', score: 0.5 }),
              feature('housenumber', { id: 'HN2', score: 0.9 }),
            ],
          },
        },
      },
    ])
    const r = await searchBanAddresses({ q: 'route entrecasteaux' })
    expect(r[0].id).toBe('HN2')
    expect(r[1].id).toBe('HN1')
  })

  it('maps locality and municipality types to the locality precision bucket', async () => {
    mockFetch([
      {
        match: 'api-adresse.data.gouv.fr',
        response: {
          body: {
            type: 'FeatureCollection',
            features: [
              feature('municipality', { id: 'MU' }),
              feature('locality', { id: 'LOC' }),
            ],
          },
        },
      },
    ])
    const r = await searchBanAddresses({ q: 'cotignac' })
    expect(r[0].precision).toBe('locality')
    expect(r[1].precision).toBe('locality')
  })

  it('skips features without coordinates', async () => {
    mockFetch([
      {
        match: 'api-adresse.data.gouv.fr',
        response: {
          body: {
            type: 'FeatureCollection',
            features: [
              { type: 'Feature', properties: feature('housenumber').properties }, // no geometry
              feature('housenumber'),
            ],
          },
        },
      },
    ])
    const r = await searchBanAddresses({ q: 'route entrecasteaux' })
    expect(r).toHaveLength(1)
  })

  it('returns [] gracefully on HTTP 500', async () => {
    mockFetch([
      {
        match: 'api-adresse.data.gouv.fr',
        response: { status: 500, body: { error: 'boom' } },
      },
    ])
    const r = await searchBanAddresses({ q: 'cotignac' })
    expect(r).toEqual([])
  })

  it('respects the limit parameter on the URL', async () => {
    const fetchMock = mockFetch([
      {
        match: 'api-adresse.data.gouv.fr',
        response: { body: { type: 'FeatureCollection', features: [] } },
      },
    ])
    await searchBanAddresses({ q: 'cotignac', limit: 10 })
    const url = String(fetchMock.mock.calls[0]?.[0])
    expect(url).toContain('limit=10')
  })

  it('caps the limit at 15', async () => {
    const fetchMock = mockFetch([
      {
        match: 'api-adresse.data.gouv.fr',
        response: { body: { type: 'FeatureCollection', features: [] } },
      },
    ])
    await searchBanAddresses({ q: 'cotignac', limit: 999 })
    const url = String(fetchMock.mock.calls[0]?.[0])
    expect(url).toContain('limit=15')
  })

  it('handles unknown BAN types gracefully', async () => {
    mockFetch([
      {
        match: 'api-adresse.data.gouv.fr',
        response: {
          body: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                geometry: { type: 'Point', coordinates: [6.1494, 43.5283] },
                properties: {
                  label: 'Mystery',
                  score: 0.5,
                  type: 'something_new',
                  id: 'X',
                },
              },
            ],
          },
        },
      },
    ])
    const r = await searchBanAddresses({ q: 'mystery' })
    expect(r[0].type).toBe('unknown')
    expect(r[0].precision).toBe('unknown')
  })

  it('returns [] when network throws', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down')
      }),
    )
    const r = await searchBanAddresses({ q: 'cotignac' })
    expect(r).toEqual([])
  })
})
