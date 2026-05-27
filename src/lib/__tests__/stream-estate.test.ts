import { describe, expect, it, vi } from 'vitest'
import {
  buildStreamEstatePropertiesUrl,
  searchStreamEstateProperties,
} from '@/lib/stream-estate'

describe('lib/stream-estate.buildStreamEstatePropertiesUrl', () => {
  it('builds the Stream Estate properties URL with documented query params', () => {
    const url = new URL(buildStreamEstatePropertiesUrl({
      lat: 43.553985,
      lon: 6.029528,
      radiusKm: 8,
      propertyTypes: ['house'],
      transactionType: 'sell',
      includedDepartments: ['83'],
      surfaceMin: 80,
      surfaceMax: 140,
      withCoherentPrice: true,
      itemsPerPage: 50,
      orderBy: 'updatedAt',
    }))

    expect(url.origin).toBe('https://api.stream.estate')
    expect(url.pathname).toBe('/documents/properties')
    expect(url.searchParams.get('lat')).toBe('43.553985')
    expect(url.searchParams.get('lon')).toBe('6.029528')
    expect(url.searchParams.get('radius')).toBe('8')
    expect(url.searchParams.get('transactionType')).toBe('0')
    expect(url.searchParams.getAll('propertyTypes[]')).toEqual(['1'])
    expect(url.searchParams.getAll('includedDepartments[]')).toEqual(['departments/83'])
    expect(url.searchParams.get('surfaceMin')).toBe('80')
    expect(url.searchParams.get('surfaceMax')).toBe('140')
    expect(url.searchParams.get('withCoherentPrice')).toBe('true')
    expect(url.searchParams.get('itemsPerPage')).toBe('30')
    expect(url.searchParams.get('order[updatedAt]')).toBe('desc')
  })

  it('allows itemsPerPage=0 for count-only requests', () => {
    const url = new URL(buildStreamEstatePropertiesUrl({ itemsPerPage: 0 }))
    expect(url.searchParams.get('itemsPerPage')).toBe('0')
  })
})

describe('lib/stream-estate.searchStreamEstateProperties', () => {
  it('skips safely when the API key is missing', async () => {
    const result = await searchStreamEstateProperties({}, { apiKey: '' })

    expect(result).toEqual({
      ok: false,
      skipped: true,
      reason: 'missing_api_key',
      properties: [],
    })
  })

  it('calls Stream Estate with X-API-KEY and normalizes properties', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({
      'hydra:totalItems': 1,
      'hydra:member': [
        {
          '@id': '/documents/properties/abc',
          uuid: 'abc',
          city: { name: 'Pontevès', insee: '83095', zipcode: '83670' },
          locations: { lat: 43.553985, lon: 6.029528 },
          price: 245000,
          pricePerMeter: 2450,
          surface: 100,
          landSurface: 60,
          propertyType: 1,
          room: 4,
          bedroom: 3,
          adverts: [
            {
              title: 'Maison de village 4 pièces',
              description: 'Maison avec terrasse',
              url: 'https://example.com/annonce',
              publisher: { name: 'Portail test' },
              energy: { category: 'D' },
              greenHouseGas: { category: 'B' },
            },
          ],
          lastCrawledAt: '2026-05-27T10:00:00+02:00',
        },
      ],
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }))

    const result = await searchStreamEstateProperties({
      includedInseeCodes: ['83095'],
      propertyTypes: ['house'],
      itemsPerPage: 1,
    }, {
      apiKey: 'test-key',
      fetcher,
    })

    expect(fetcher).toHaveBeenCalledTimes(1)
    const [, init] = fetcher.mock.calls[0]
    expect(init?.headers).toMatchObject({
      'Content-Type': 'application/json',
      'X-API-KEY': 'test-key',
    })
    expect(result.ok).toBe(true)
    expect(result.totalItems).toBe(1)
    expect(result.properties[0]).toMatchObject({
      id: 'abc',
      title: 'Maison de village 4 pièces',
      city: 'Pontevès',
      insee: '83095',
      price: 245000,
      pricePerMeter: 2450,
      surface: 100,
      landSurface: 60,
      propertyType: 1,
      energyCategory: 'D',
      source: 'Portail test',
    })
  })

  it('returns a readable error without throwing on HTTP failures', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ error: 'nope' }), { status: 401 }))

    const result = await searchStreamEstateProperties({}, {
      apiKey: 'bad-key',
      fetcher,
    })

    expect(result.ok).toBe(false)
    expect(result.skipped).toBe(false)
    expect(result.error).toBe('Stream Estate HTTP 401')
    expect(result.properties).toEqual([])
  })
})
