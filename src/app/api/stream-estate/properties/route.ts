import { NextRequest, NextResponse } from 'next/server'
import {
  searchStreamEstateProperties,
  type StreamEstatePropertyType,
  type StreamEstateTransactionType,
} from '@/lib/stream-estate'

function num(value: string | null): number | undefined {
  if (!value) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function bool(value: string | null): boolean | undefined {
  if (value == null) return undefined
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

function list(params: URLSearchParams, key: string): string[] | undefined {
  const values = params.getAll(key).concat(params.getAll(`${key}[]`)).filter(Boolean)
  return values.length > 0 ? values : undefined
}

function propertyTypes(params: URLSearchParams): StreamEstatePropertyType[] | undefined {
  const allowed = new Set<StreamEstatePropertyType>([
    'apartment',
    'house',
    'building',
    'parking',
    'office',
    'land',
    'shop',
  ])
  const values = list(params, 'propertyTypes')
    ?.filter((value): value is StreamEstatePropertyType => allowed.has(value as StreamEstatePropertyType))
  return values && values.length > 0 ? values : undefined
}

function transactionType(value: string | null): StreamEstateTransactionType | undefined {
  return value === 'rent' || value === 'sell' ? value : undefined
}

export async function GET(req: NextRequest) {
  const params = new URL(req.url).searchParams
  const result = await searchStreamEstateProperties({
    lat: num(params.get('lat')),
    lon: num(params.get('lon')) ?? num(params.get('lng')),
    radiusKm: num(params.get('radiusKm')) ?? num(params.get('radius')),
    includedInseeCodes: list(params, 'includedInseeCodes'),
    includedZipcodes: list(params, 'includedZipcodes'),
    includedDepartments: list(params, 'includedDepartments'),
    propertyTypes: propertyTypes(params),
    transactionType: transactionType(params.get('transactionType')) ?? 'sell',
    budgetMin: num(params.get('budgetMin')),
    budgetMax: num(params.get('budgetMax')),
    surfaceMin: num(params.get('surfaceMin')),
    surfaceMax: num(params.get('surfaceMax')),
    landSurfaceMin: num(params.get('landSurfaceMin')),
    landSurfaceMax: num(params.get('landSurfaceMax')),
    roomMin: num(params.get('roomMin')),
    roomMax: num(params.get('roomMax')),
    bedroomMin: num(params.get('bedroomMin')),
    bedroomMax: num(params.get('bedroomMax')),
    energyCategories: list(params, 'energyCategories'),
    withCoherentPrice: bool(params.get('withCoherentPrice')) ?? true,
    withLocation: bool(params.get('withLocation')),
    itemsPerPage: Math.min(num(params.get('itemsPerPage')) ?? 10, 30),
    page: num(params.get('page')),
    orderBy: 'updatedAt',
    order: 'desc',
  })

  if (result.skipped) {
    return NextResponse.json(
      {
        success: false,
        error: 'STREAMESTATE_API_KEY non configurée côté serveur',
        properties: [],
      },
      { status: 503 },
    )
  }

  if (!result.ok) {
    return NextResponse.json(
      {
        success: false,
        error: result.error ?? 'Erreur Stream Estate',
        properties: [],
      },
      { status: 502 },
    )
  }

  return NextResponse.json({
    success: true,
    totalItems: result.totalItems,
    properties: result.properties,
  })
}
