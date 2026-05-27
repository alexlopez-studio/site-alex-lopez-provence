/**
 * Stream Estate — API immobilière temps réel.
 *
 * Documentation : https://docs.stream.estate
 * Endpoint intégré : GET https://api.stream.estate/documents/properties
 * Authentification : header X-API-KEY.
 *
 * Important : la clé reste strictement côté serveur via STREAMESTATE_API_KEY.
 */

const DEFAULT_STREAM_ESTATE_API_URL = 'https://api.stream.estate'

export type StreamEstatePropertyType =
  | 'apartment'
  | 'house'
  | 'building'
  | 'parking'
  | 'office'
  | 'land'
  | 'shop'

export type StreamEstateTransactionType = 'sell' | 'rent'

export type StreamEstatePropertiesInput = {
  lat?: number
  lon?: number
  lng?: number
  radiusKm?: number
  includedInseeCodes?: string[]
  includedZipcodes?: string[]
  includedDepartments?: string[]
  propertyTypes?: StreamEstatePropertyType[]
  transactionType?: StreamEstateTransactionType
  budgetMin?: number
  budgetMax?: number
  surfaceMin?: number
  surfaceMax?: number
  landSurfaceMin?: number
  landSurfaceMax?: number
  roomMin?: number
  roomMax?: number
  bedroomMin?: number
  bedroomMax?: number
  energyCategories?: string[]
  withCoherentPrice?: boolean
  withLocation?: boolean
  expired?: boolean | null
  page?: number
  /** Max Stream Estate documenté : 30. 0 est autorisé pour demander seulement le nombre de résultats. */
  itemsPerPage?: number
  orderBy?: 'createdAt' | 'updatedAt' | 'pricePerMeter' | 'price' | 'surface'
  order?: 'asc' | 'desc'
}

export type StreamEstatePropertySummary = {
  id: string
  title?: string
  description?: string
  city?: string
  insee?: string
  zipcode?: string
  price?: number
  pricePerMeter?: number
  surface?: number
  landSurface?: number
  room?: number
  bedroom?: number
  propertyType?: number
  energyCategory?: string
  greenHouseGasCategory?: string
  lat?: number
  lon?: number
  url?: string
  source?: string
  updatedAt?: string
  createdAt?: string
}

export type StreamEstatePropertiesResult = {
  ok: boolean
  skipped: boolean
  reason?: 'missing_api_key'
  error?: string
  totalItems?: number
  properties: StreamEstatePropertySummary[]
}

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

const PROPERTY_TYPE_CODES: Record<StreamEstatePropertyType, number> = {
  apartment: 0,
  house: 1,
  building: 2,
  parking: 3,
  office: 4,
  land: 5,
  shop: 6,
}

const TRANSACTION_TYPE_CODES: Record<StreamEstateTransactionType, number> = {
  sell: 0,
  rent: 1,
}

function num(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value.replace(/\s/g, '').replace(',', '.'))
    if (Number.isFinite(n)) return n
  }
  return undefined
}

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function clampItemsPerPage(value: number | undefined): number {
  if (value === 0) return 0
  if (!value || !Number.isFinite(value)) return 10
  return Math.max(1, Math.min(30, Math.floor(value)))
}

function appendNumber(params: URLSearchParams, key: string, value: number | undefined): void {
  if (typeof value === 'number' && Number.isFinite(value)) {
    params.set(key, String(value))
  }
}

function appendBoolean(params: URLSearchParams, key: string, value: boolean | null | undefined): void {
  if (typeof value === 'boolean') params.set(key, String(value))
  else if (value === null) params.set(key, 'null')
}

function appendArray(params: URLSearchParams, key: string, values: Array<string | number> | undefined): void {
  for (const value of values ?? []) {
    if (value !== '' && value != null) params.append(`${key}[]`, String(value))
  }
}

function normalizeDepartmentRef(value: string): string {
  const trimmed = value.trim().replace(/^\/+/, '')
  if (trimmed.startsWith('departments/')) return trimmed
  return `departments/${trimmed}`
}

function normalizeBaseUrl(apiUrl: string): string {
  return apiUrl.replace(/\/+$/, '')
}

/** Construit l'URL Stream Estate sans exposer la clé API. Exporté pour tests. */
export function buildStreamEstatePropertiesUrl(
  input: StreamEstatePropertiesInput,
  apiUrl = process.env.STREAMESTATE_API_URL || DEFAULT_STREAM_ESTATE_API_URL,
): string {
  const url = new URL('/documents/properties', normalizeBaseUrl(apiUrl))
  const params = url.searchParams

  appendNumber(params, 'lat', input.lat)
  appendNumber(params, 'lon', input.lon ?? input.lng)
  appendNumber(params, 'radius', input.radiusKm)
  appendNumber(params, 'budgetMin', input.budgetMin)
  appendNumber(params, 'budgetMax', input.budgetMax)
  appendNumber(params, 'surfaceMin', input.surfaceMin)
  appendNumber(params, 'surfaceMax', input.surfaceMax)
  appendNumber(params, 'landSurfaceMin', input.landSurfaceMin)
  appendNumber(params, 'landSurfaceMax', input.landSurfaceMax)
  appendNumber(params, 'roomMin', input.roomMin)
  appendNumber(params, 'roomMax', input.roomMax)
  appendNumber(params, 'bedroomMin', input.bedroomMin)
  appendNumber(params, 'bedroomMax', input.bedroomMax)

  appendArray(params, 'includedInseeCodes', input.includedInseeCodes)
  appendArray(params, 'includedZipcodes', input.includedZipcodes)
  appendArray(params, 'includedDepartments', input.includedDepartments?.map(normalizeDepartmentRef))
  appendArray(params, 'energyCategories', input.energyCategories)
  appendArray(params, 'propertyTypes', input.propertyTypes?.map((type) => PROPERTY_TYPE_CODES[type]))

  if (input.transactionType) {
    params.set('transactionType', String(TRANSACTION_TYPE_CODES[input.transactionType]))
  }

  appendBoolean(params, 'withCoherentPrice', input.withCoherentPrice)
  appendBoolean(params, 'withLocation', input.withLocation)
  appendBoolean(params, 'expired', input.expired)

  params.set('itemsPerPage', String(clampItemsPerPage(input.itemsPerPage)))
  params.set('page', String(Math.max(1, Math.floor(input.page ?? 1))))

  if (input.orderBy) {
    params.set(`order[${input.orderBy}]`, input.order ?? 'desc')
  }

  return url.toString()
}

function normalizeProperty(raw: unknown): StreamEstatePropertySummary | null {
  const record = asRecord(raw)
  const adverts = asArray(record.adverts).map(asRecord)
  const firstAdvert = adverts[0] ?? {}
  const city = asRecord(record.city)
  const locations = asRecord(record.locations)
  const energy = asRecord(firstAdvert.energy)
  const greenHouseGas = asRecord(firstAdvert.greenHouseGas)
  const publisher = asRecord(firstAdvert.publisher)

  const id =
    str(record.uuid) ??
    str(record.property) ??
    str(record['@id']) ??
    str(firstAdvert.uuid)

  if (!id) return null

  return {
    id,
    title: str(record.title) ?? str(firstAdvert.title),
    description: str(record.description) ?? str(firstAdvert.description),
    city: str(city.name) ?? str(city.originalName),
    insee: str(city.insee),
    zipcode: str(city.zipcode),
    price: num(record.price) ?? num(firstAdvert.priceExcludingFees) ?? num(firstAdvert.price),
    pricePerMeter: num(record.pricePerMeter),
    surface: num(record.surface) ?? num(firstAdvert.surface),
    landSurface: num(record.landSurface) ?? num(firstAdvert.landSurface),
    room: num(record.room),
    bedroom: num(record.bedroom),
    propertyType: num(record.propertyType),
    energyCategory: str(energy.category),
    greenHouseGasCategory: str(greenHouseGas.category),
    lat: num(locations.lat),
    lon: num(locations.lon),
    url: str(firstAdvert.url),
    source: str(publisher.name),
    updatedAt: str(record.lastCrawledAt) ?? str(record.updatedAt) ?? str(firstAdvert.updatedAt),
    createdAt: str(record.createdAt) ?? str(firstAdvert.createdAt),
  }
}

export async function searchStreamEstateProperties(
  input: StreamEstatePropertiesInput,
  deps: {
    apiKey?: string
    apiUrl?: string
    fetcher?: Fetcher
  } = {},
): Promise<StreamEstatePropertiesResult> {
  const apiKey = deps.apiKey ?? process.env.STREAMESTATE_API_KEY
  if (!apiKey) {
    return {
      ok: false,
      skipped: true,
      reason: 'missing_api_key',
      properties: [],
    }
  }

  const fetcher = deps.fetcher ?? fetch
  const url = buildStreamEstatePropertiesUrl(input, deps.apiUrl)

  try {
    const response = await fetcher(url, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
    })

    if (!response.ok) {
      return {
        ok: false,
        skipped: false,
        error: `Stream Estate HTTP ${response.status}`,
        properties: [],
      }
    }

    const data = await response.json()
    const record = asRecord(data)
    const members = asArray(record['hydra:member'])
    const properties = members
      .map(normalizeProperty)
      .filter((property): property is StreamEstatePropertySummary => property != null)

    return {
      ok: true,
      skipped: false,
      totalItems: num(record['hydra:totalItems']) ?? properties.length,
      properties,
    }
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      error: err instanceof Error ? err.message : 'Erreur Stream Estate inconnue',
      properties: [],
    }
  }
}
