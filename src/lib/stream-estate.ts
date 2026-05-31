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
    'X-API-Key': env.streamEstate.apiKey,
    Accept: 'application/json',
  }
}

/**
 * Récupère les annonces Stream Estate pour un code postal donné.
 */
export async function fetchListings(
  params: StreamEstateSyncParams,
): Promise<StreamEstateSyncResult> {
  const { zipcode, propertyType, transactionType = 'vente', page = 1, limit = 30 } = params

  const query = new URLSearchParams()
  query.set('zipcode', zipcode)
  query.set('transaction_type', transactionType)
  query.set('page', String(page))
  query.set('limit', String(Math.min(limit, 30)))
  if (propertyType) query.set('property_type', propertyType)

  const url = `${env.streamEstate.apiUrl}/listings?${query.toString()}`

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

  // Normalisation : on s'attend à un tableau dans data.listings ou data.data ou data
  const rawListings = Array.isArray(data)
    ? data
    : Array.isArray(data.listings)
      ? data.listings
      : Array.isArray(data.data)
        ? data.data
        : []

  const listings: StreamEstateListing[] = rawListings.map(normalizeListing)

  return {
    listings,
    total: data.total ?? data.total_count ?? listings.length,
    page,
    hasMore: (data.total ?? data.total_count ?? 0) > page * limit,
  }
}

/**
 * Récupère le détail d'une annonce par son ID externe.
 */
export async function fetchListingById(
  externalId: string,
): Promise<StreamEstateListing | null> {
  const url = `${env.streamEstate.apiUrl}/listings/${encodeURIComponent(externalId)}`

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
  const imagesRaw = raw.images ?? raw.photos
  const images: string[] = Array.isArray(imagesRaw) ? imagesRaw.map(String) : []

  return {
    id: String(raw.id ?? raw.uuid ?? ''),
    externalId: String(raw.external_id ?? raw.externalId ?? raw.id ?? ''),
    title: String(raw.title ?? raw.titre ?? raw.name ?? ''),
    description: String(raw.description ?? raw.descriptif ?? ''),
    city: String(raw.city ?? raw.ville ?? raw.commune ?? ''),
    zipcode: String(raw.zipcode ?? raw.code_postal ?? raw.cp ?? ''),
    inseeCode: String(raw.insee_code ?? raw.inseeCode ?? raw.code_insee ?? ''),
    lat: Number(raw.lat ?? raw.latitude ?? 0) || undefined,
    lon: Number(raw.lon ?? raw.longitude ?? raw.lng ?? 0) || undefined,
    propertyType: String(raw.property_type ?? raw.type_bien ?? raw.type ?? ''),
    price: Number(raw.price ?? raw.prix ?? 0) || undefined,
    surface: Number(raw.surface ?? raw.surface_habitable ?? 0) || undefined,
    landSurface: Number(raw.land_surface ?? raw.terrain ?? raw.surface_terrain ?? 0) || undefined,
    rooms: Number(raw.rooms ?? raw.pieces ?? 0) || undefined,
    bedrooms: Number(raw.bedrooms ?? raw.chambres ?? 0) || undefined,
    dpe: String(raw.dpe ?? raw.dpe_lettre ?? raw.energie ?? ''),
    ges: String(raw.ges ?? raw.ges_lettre ?? ''),
    url: String(raw.url ?? raw.source_url ?? raw.lien ?? ''),
    status: String(raw.status ?? raw.statut ?? 'active'),
    images,
    publishedAt: String(raw.published_at ?? raw.date_publication ?? raw.created_at ?? ''),
    updatedAt: String(raw.updated_at ?? raw.date_mise_a_jour ?? raw.updatedAt ?? ''),
    raw,
  }
}