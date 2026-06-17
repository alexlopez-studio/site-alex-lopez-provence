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
  transactionType?: 0 | 1 | null  // 0 = vente, 1 = location
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
  if (!env.streamEstate.apiKey) {
    throw new Error('STREAMESTATE_API_KEY manquante dans les variables d’environnement')
  }

  return {
    'Content-Type': 'application/json',
    'X-API-KEY': env.streamEstate.apiKey,
    Accept: 'application/json',
  }
}

// Cache en mémoire : code postal → ID interne département Stream Estate
const deptIdCache = new Map<string, string>()

// Cache des résultats par département : évite de re-scinder le même dépt pour chaque CP
const deptResultsCache = new Map<string, { listings: StreamEstateListing[]; expiresAt: number }>()
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

// Stream Estate utilise des IDs internes pour les départements (pas les codes INSEE).
// Ex: Var (code 83) = id 85. On résout via l'endpoint /cities.
async function deptIdFromZipcode(zipcode: string): Promise<string> {
  if (deptIdCache.has(zipcode)) return deptIdCache.get(zipcode)!

  const url = `${env.streamEstate.apiUrl}/cities?zipcode=${encodeURIComponent(zipcode)}`
  const res = await fetch(url, { headers: getHeaders(), cache: 'no-store' })
  if (res.ok) {
    const data = await res.json()
    const dept: string | undefined = Array.isArray(data) ? data[0]?.department : undefined
    if (dept) {
      // "/departments/85" → "85"
      const id = dept.split('/').pop() ?? zipcode.slice(0, 2)
      deptIdCache.set(zipcode, id)
      return id
    }
  }
  // Fallback : code INSEE brut (incorrect pour certains depts, mais évite un crash)
  return zipcode.slice(0, 2)
}

/**
 * Récupère TOUTES les annonces d'un département (paginé) avec mise en cache.
 * Si déjà en cache et pas expiré, retourne le cache.
 */
async function fetchAllByDept(
  deptId: string,
  transactionType: number | null,
  propertyType?: string,
): Promise<StreamEstateListing[]> {
  const cacheKey = `${deptId}-${transactionType ?? 'all'}-${propertyType ?? 'all'}`

  const cached = deptResultsCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.listings
  }

  const allListings: StreamEstateListing[] = []
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { listings, hasMore } = await fetchOnePage(deptId, page, transactionType, propertyType)
    allListings.push(...listings)
    if (!hasMore) break
  }

  deptResultsCache.set(cacheKey, {
    listings: allListings,
    expiresAt: Date.now() + CACHE_TTL_MS,
  })

  return allListings
}

// Nombre max de pages à parcourir par département.
// 4 pages × 30 annonces = 120 annonces max par département : largement suffisant
// pour couvrir les annonces actives d'un CP. Si tu veux +, ajuste ici ou via MANDAT_CP.
const MAX_PAGES = 4
const PAGE_SIZE = 30

async function fetchOnePage(
  deptId: string,
  page: number,
  transactionType: number | null,
  propertyType?: string,
): Promise<{ listings: StreamEstateListing[]; hasMore: boolean }> {
  const query = new URLSearchParams()
  query.append('includedDepartments[]', deptId)
  if (transactionType !== null && transactionType !== undefined) {
    query.set('transactionType', String(transactionType))
  }
  query.set('page', String(page))
  query.set('itemsPerPage', String(PAGE_SIZE))
  if (propertyType) query.append('propertyTypes[]', propertyType)

  const url = `${env.streamEstate.apiUrl}/documents/properties?${query.toString()}`
  const res = await fetch(url, { method: 'GET', headers: getHeaders(), cache: 'no-store' })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Stream Estate API error ${res.status}: ${text}`)
  }

  const data = await res.json()
  const rawListings: Record<string, unknown>[] = Array.isArray(data['hydra:member'])
    ? data['hydra:member']
    : Array.isArray(data)
      ? data
      : Array.isArray(data.listings)
        ? data.listings
        : Array.isArray(data.data)
          ? data.data
          : []

  const explicitTotal: number | undefined = data['hydra:totalItems'] ?? data.total ?? undefined
  const listings = rawListings.map(normalizeListing)
  // Si l'API ne donne pas de total, on continue tant qu'une page pleine est retournée
  const hasMore = explicitTotal !== undefined
    ? explicitTotal > page * PAGE_SIZE
    : rawListings.length === PAGE_SIZE
  return { listings, hasMore }
}

/**
 * Récupère les annonces Stream Estate pour un code postal donné.
 * Pagine sur plusieurs pages (max MAX_PAGES) pour trouver les biens du bon code postal,
 * car l'API filtre par département entier.
 */
export async function fetchListings(
  params: StreamEstateSyncParams,
): Promise<StreamEstateSyncResult> {
  const { zipcode, propertyType, transactionType = 0 } = params

  const deptId = await deptIdFromZipcode(zipcode)
  const allDeptListings = await fetchAllByDept(deptId, transactionType, propertyType)

  const matched = allDeptListings.filter((l) => l.zipcode === zipcode)

  return {
    listings: matched,
    total: matched.length,
    page: 1,
    hasMore: false,
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

// Codes numériques Stream Estate → labels lisibles
const PROPERTY_TYPE_LABELS: Record<number, string> = {
  0: 'Appartement',
  1: 'Maison',
  2: 'Villa',
  3: 'Studio',
  4: 'Loft',
  5: 'Terrain',
  6: 'Commerce',
  7: 'Bureau',
  8: 'Immeuble',
  9: 'Parking',
  10: 'Autre',
}

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

  const location = (raw.location ?? {}) as Record<string, unknown>

  const cityObj = (typeof raw.city === 'object' && raw.city !== null)
    ? raw.city as Record<string, unknown>
    : null
  const cityName  = String(cityObj?.name ?? cityObj?.originalName ?? raw.ville ?? '')
  const zipcode   = String(cityObj?.zipcode ?? raw.zipcode ?? raw.postalCode ?? raw.code_postal ?? '')
  const rawTitle  = String(firstAdvert.title ?? raw.title ?? raw.titre ?? '').trim()
  const ptRaw     = raw.propertyType ?? raw.property_type ?? raw.type
  const ptNum     = typeof ptRaw === 'number' ? ptRaw : (ptRaw !== undefined ? Number(ptRaw) : NaN)
  const pType     = (!isNaN(ptNum) && PROPERTY_TYPE_LABELS[ptNum])
    ? PROPERTY_TYPE_LABELS[ptNum]
    : (typeof ptRaw === 'string' && ptRaw ? ptRaw : '')
  const surfaceN  = Number(raw.surface ?? raw.surface_habitable ?? 0) || undefined
  const roomsN    = Number(raw.roomsCount ?? raw.rooms ?? raw.pieces ?? 0) || undefined

  // Génère un titre lisible si Stream Estate retourne un titre trop générique ou vide
  function buildTitle(): string {
    if (rawTitle && rawTitle.length > 5 && !rawTitle.toLowerCase().includes('neuf à vendre')) return rawTitle
    const parts: string[] = []
    if (pType) parts.push(pType)
    if (roomsN) parts.push(`${roomsN} pièce${roomsN > 1 ? 's' : ''}`)
    if (surfaceN) parts.push(`${surfaceN} m²`)
    if (cityName) parts.push(`à ${cityName}`)
    return parts.length ? parts.join(' · ') : rawTitle || 'Bien immobilier'
  }

  return {
    id: String(raw.uuid ?? raw.id ?? raw['@id'] ?? ''),
    externalId: String(raw.uuid ?? raw.id ?? raw.external_id ?? raw.externalId ?? ''),
    title: buildTitle(),
    description: String(firstAdvert.description ?? raw.description ?? ''),
    city: cityName,
    zipcode,
    inseeCode: String(cityObj?.insee ?? raw.inseeCode ?? raw.insee_code ?? ''),
    lat: Number(location.lat ?? raw.lat ?? raw.latitude ?? 0) || undefined,
    lon: Number(location.lon ?? location.lng ?? raw.lon ?? raw.longitude ?? 0) || undefined,
    propertyType: pType,
    price,
    surface: surfaceN,
    landSurface: Number(raw.landSurface ?? raw.land_surface ?? raw.terrain ?? 0) || undefined,
    rooms: roomsN,
    bedrooms: Number(raw.bedroomsCount ?? raw.bedrooms ?? raw.chambres ?? 0) || undefined,
    dpe: String(raw.dpeValue ?? raw.dpe ?? ''),
    ges: String(raw.gesValue ?? raw.ges ?? ''),
    url,
    status: String(raw.status ?? raw.statut ?? 'active'),
    images,
    publishedAt: (raw.published_at ?? raw.date_publication ?? raw.created_at ?? raw.createdAt) as string | undefined || undefined,
    updatedAt: (raw.updated_at ?? raw.date_mise_a_jour ?? raw.updatedAt) as string | undefined || undefined,
    raw,
  }
}
