import { env } from './env'

// ── Types Stream Estate ────────────────────────────────────

export interface StreamEstateListing {
  id: string
  externalId?: string
  title?: string
  description?: string
  city?: string
  zipcode?: string
  inseeCode?: string
  lat?: number
  lon?: number
  propertyType?: string
  price?: number
  surface?: number
  landSurface?: number
  rooms?: number
  bedrooms?: number
  dpe?: string
  ges?: string
  url?: string
  status?: string
  images?: string[]
  publishedAt?: string
  updatedAt?: string
  raw?: Record<string, unknown>
}

export interface StreamEstateSyncParams {
  zipcode: string
  propertyType?: string
  transactionType?: string
  page?: number
  limit?: number
}

export interface StreamEstateSyncResult {
  listings: StreamEstateListing[]
  total: number
  page: number
  hasMore: boolean
}

// ── Client ──────────────────────────────────────────────────

function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-API-KEY': env.streamEstate.apiKey,
    Accept: 'application/json',
  }
}

// Extrait le code département depuis un code postal (ex: "83670" → "83")
function deptFromZipcode(zipcode: string): string {
  return zipcode.slice(0, 2)
}

/**
 * Récupère les annonces Stream Estate pour un code postal donné.
 * API : https://api.stream.estate/documents/properties
 */
export async function fetchListings(
  params: StreamEstateSyncParams,
): Promise<StreamEstateSyncResult> {
  const { zipcode, propertyType, transactionType = 'SELL', page = 1, limit = 30 } = params

  const query = new URLSearchParams()
  // Filtrage géographique par département (2 premiers chiffres du CP)
  query.append('includedDepartments[]', deptFromZipcode(zipcode))
  query.set('transactionType', transactionType)
  query.set('page', String(page))
  query.set('itemsPerPage', String(Math.min(limit, 30)))
  if (propertyType) query.append('propertyTypes[]', propertyType)

  const url = `${env.streamEstate.apiUrl}/documents/properties?${query.toString()}`

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Stream Estate API error ${res.status}: ${text}`)
  }

  const data = await res.json()

  // Format stream.estate : { "hydra:member": [...], "hydra:totalItems": N }
  const rawListings: Record<string, unknown>[] = Array.isArray(data['hydra:member'])
    ? data['hydra:member']
    : Array.isArray(data)
      ? data
      : Array.isArray(data.listings)
        ? data.listings
        : Array.isArray(data.data)
          ? data.data
          : []

  const listings: StreamEstateListing[] = rawListings.map(normalizeListing)
  const total: number = data['hydra:totalItems'] ?? data.total ?? data.total_count ?? listings.length

  return {
    listings,
    total,
    page,
    hasMore: total > page * limit,
  }
}

/**
 * Récupère le détail d'une annonce par son ID externe.
 */
export async function fetchListingById(
  externalId: string,
): Promise<StreamEstateListing | null> {
  const url = `${env.streamEstate.apiUrl}/documents/properties/${encodeURIComponent(externalId)}`

  const res = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    cache: 'no-store',
  })

  if (!res.ok) {
    if (res.status === 404) return null
    const text = await res.text().catch(() => '')
    throw new Error(`Stream Estate API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  return normalizeListing(data)
}

// ── Normalisation ───────────────────────────────────────────

function normalizeListing(raw: Record<string, unknown>): StreamEstateListing {
  // stream.estate renvoie les photos dans adverts[0].photos ou directement photos
  const adverts = Array.isArray(raw.adverts) ? raw.adverts as Record<string, unknown>[] : []
  const firstAdvert = adverts[0] ?? {}
  const imagesRaw = raw.photos ?? firstAdvert.photos ?? raw.images
  const images: string[] = Array.isArray(imagesRaw) ? imagesRaw.map(String) : []

  // Prix : stream.estate stocke le prix dans adverts[0].price ou price
  const price = Number(firstAdvert.price ?? raw.price ?? raw.prix ?? 0) || undefined

  // URL de l'annonce : adverts[0].url ou url
  const url = String(firstAdvert.url ?? raw.url ?? raw.source_url ?? '')

  // Localisation : raw.postalCode, raw.city, raw.inseeCode
  const location = (raw.location ?? {}) as Record<string, unknown>

  return {
    id: String(raw.id ?? raw['@id'] ?? ''),
    externalId: String(raw.id ?? raw.external_id ?? raw.externalId ?? ''),
    title: String(firstAdvert.title ?? raw.title ?? raw.titre ?? ''),
    description: String(firstAdvert.description ?? raw.description ?? ''),
    city: String(location.city ?? raw.city ?? raw.ville ?? ''),
    zipcode: String(location.postalCode ?? raw.zipcode ?? raw.postalCode ?? raw.code_postal ?? ''),
    inseeCode: String(location.inseeCode ?? raw.inseeCode ?? raw.insee_code ?? ''),
    lat: Number(location.lat ?? raw.lat ?? raw.latitude ?? 0) || undefined,
    lon: Number(location.lon ?? location.lng ?? raw.lon ?? raw.longitude ?? 0) || undefined,
    propertyType: String(raw.propertyType ?? raw.property_type ?? raw.type ?? ''),
    price,
    surface: Number(raw.surface ?? raw.surface_habitable ?? 0) || undefined,
    landSurface: Number(raw.landSurface ?? raw.land_surface ?? raw.terrain ?? 0) || undefined,
    rooms: Number(raw.roomsCount ?? raw.rooms ?? raw.pieces ?? 0) || undefined,
    bedrooms: Number(raw.bedroomsCount ?? raw.bedrooms ?? raw.chambres ?? 0) || undefined,
    dpe: String(raw.dpeValue ?? raw.dpe ?? ''),
    ges: String(raw.gesValue ?? raw.ges ?? ''),
    url,
    status: String(raw.status ?? raw.statut ?? 'active'),
    images,
    publishedAt: String(raw.published_at ?? raw.date_publication ?? raw.created_at ?? ''),
    updatedAt: String(raw.updated_at ?? raw.date_mise_a_jour ?? raw.updatedAt ?? ''),
    raw,
  }
}