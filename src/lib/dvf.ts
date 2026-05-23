/**
 * API DVF — données de valeurs foncières.
 *
 * La source primaire reste configurable pour éviter de dépendre en dur d'un
 * endpoint de préproduction. En cas d'indisponibilité, le module peut tenter
 * une source secondaire puis laisser le moteur d'estimation basculer sur son
 * fallback métier.
 */

const CEREMA_DVF_API = 'https://apidf-preprod.cerema.fr/dvf_opendata/geomutations/'
const CQUEST_DVF_API = 'https://api.cquest.org/dvf'

type DvfProvider = 'cerema' | 'cquest'

export interface DvfMutation {
  valeur_fonciere: number
  surface_reelle_bati: number
  type_local: string
  date_mutation: string
  code_postal: string
  /** Distance au bien estimé quand la géométrie DVF est disponible. */
  distance_m?: number
}

export function median(values: number[]): number {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function num(value: unknown): number | undefined {
  if (typeof value === 'string') {
    const normalized = value.replace(/\s/g, '').replace(',', '.')
    const n = Number(normalized)
    return Number.isFinite(n) ? n : undefined
  }
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}

function str(value: unknown): string {
  return typeof value === 'string' ? value : value == null ? '' : String(value)
}

function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)))
}

function coordinatesFromFeature(feature: Record<string, unknown>): { lat: number; lng: number } | null {
  const geometry = feature.geometry as { coordinates?: unknown; type?: unknown } | undefined
  const coords = geometry?.coordinates

  if (Array.isArray(coords) && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    return { lng: coords[0], lat: coords[1] }
  }

  // Certains GeoJSON peuvent exposer un MultiPoint ou une géométrie imbriquée.
  if (Array.isArray(coords) && Array.isArray(coords[0]) && typeof coords[0][0] === 'number' && typeof coords[0][1] === 'number') {
    return { lng: coords[0][0], lat: coords[0][1] }
  }

  return null
}

function normalizeMutation(raw: Record<string, unknown>, origin: { lat: number; lng: number }): DvfMutation | null {
  const valeur =
    num(raw.valeur_fonciere) ??
    num(raw.valeur) ??
    num(raw.valeurfonc) ??
    num(raw.prix)

  const surface =
    num(raw.surface_reelle_bati) ??
    num(raw.surface_bati) ??
    num(raw.sbati) ??
    num(raw.surface)

  if (!valeur || !surface) return null

  const lat = num(raw.lat) ?? num(raw.latitude)
  const lng = num(raw.lon) ?? num(raw.lng) ?? num(raw.longitude)
  const hasPoint = typeof lat === 'number' && typeof lng === 'number'

  return {
    valeur_fonciere: valeur,
    surface_reelle_bati: surface,
    type_local: str(raw.type_local ?? raw.type_local_label ?? raw.local_type),
    date_mutation: str(raw.date_mutation ?? raw.date ?? raw.datemut),
    code_postal: str(raw.code_postal ?? raw.postal_code ?? raw.cp),
    ...(hasPoint ? { distance_m: haversineMeters(origin, { lat, lng }) } : {}),
  }
}

function normalizeDvfResponse(data: unknown, origin: { lat: number; lng: number }): DvfMutation[] {
  if (Array.isArray(data)) {
    return data
      .map((raw) => normalizeMutation(asRecord(raw), origin))
      .filter((mutation: DvfMutation | null): mutation is DvfMutation => mutation != null)
  }

  const record = asRecord(data)

  if (Array.isArray(record.results)) {
    return record.results
      .map((raw) => normalizeMutation(asRecord(raw), origin))
      .filter((mutation: DvfMutation | null): mutation is DvfMutation => mutation != null)
  }

  if (Array.isArray(record.features)) {
    return record.features
      .map((featureRaw) => {
        const feature = asRecord(featureRaw)
        const props = asRecord(feature.properties)
        const point = coordinatesFromFeature(feature)
        return normalizeMutation({ ...props, ...(point ? { lat: point.lat, lng: point.lng } : {}) }, origin)
      })
      .filter((mutation: DvfMutation | null): mutation is DvfMutation => mutation != null)
  }

  return []
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function providerFromEnv(): DvfProvider {
  return process.env.DVF_PRIMARY_PROVIDER === 'cquest' ? 'cquest' : 'cerema'
}

function shouldUseFallback(primary: DvfProvider): boolean {
  if (process.env.DVF_ENABLE_FALLBACK === 'false') return false
  return primary === 'cerema'
}

function buildCeremaUrl(lat: number, lng: number, typeLocal: string, rayonMetres: number, dateMinStr: string): string {
  const base = (process.env.DVF_CEREMA_API_URL || CEREMA_DVF_API).replace(/\?$/, '')
  return (
    base +
    `?lat=${lat}&lon=${lng}&rayon=${rayonMetres}` +
    `&date_mutation_min=${dateMinStr}&nature_mutation=Vente` +
    `&in_type_local=${encodeURIComponent(typeLocal)}&ordering=-date_mutation&limit=100`
  )
}

function buildCquestUrl(lat: number, lng: number, typeLocal: string, rayonMetres: number): string {
  const base = (process.env.DVF_CQUEST_API_URL || CQUEST_DVF_API).replace(/\?$/, '')
  return (
    base +
    `?lat=${lat}&lon=${lng}&dist=${rayonMetres}` +
    `&nature_mutation=Vente&type_local=${encodeURIComponent(typeLocal)}`
  )
}

function buildProviderUrl(
  provider: DvfProvider,
  lat: number,
  lng: number,
  typeLocal: string,
  rayonMetres: number,
  dateMinStr: string,
): string {
  return provider === 'cquest'
    ? buildCquestUrl(lat, lng, typeLocal, rayonMetres)
    : buildCeremaUrl(lat, lng, typeLocal, rayonMetres, dateMinStr)
}

async function fetchProviderMutations({
  provider,
  lat,
  lng,
  typeLocal,
  rayonMetres,
  dateMinStr,
}: {
  provider: DvfProvider
  lat: number
  lng: number
  typeLocal: string
  rayonMetres: number
  dateMinStr: string
}): Promise<DvfMutation[]> {
  const url = buildProviderUrl(provider, lat, lng, typeLocal, rayonMetres, dateMinStr)

  try {
    const r = await fetch(url, { next: { revalidate: 86400 } } as RequestInit & { next: { revalidate: number } })
    if (!r.ok) {
      console.warn(`[DVF] Source ${provider} indisponible (${r.status})`)
      return []
    }

    const data = await r.json()
    return normalizeDvfResponse(data, { lat, lng })
  } catch (err) {
    console.warn(`[DVF] Source ${provider} en erreur`, err)
    return []
  }
}

export async function fetchDvfMutations(
  lat: number,
  lng: number,
  typeBien: string,
  rayonMetres = 1500,
): Promise<DvfMutation[]> {
  const dateMin = new Date()
  dateMin.setFullYear(dateMin.getFullYear() - 3)
  const dateMinStr = dateMin.toISOString().split('T')[0]
  const typeLocal = typeBien === 'appartement' ? 'Appartement' : 'Maison'
  const primary = providerFromEnv()

  const primaryMutations = await fetchProviderMutations({
    provider: primary,
    lat,
    lng,
    typeLocal,
    rayonMetres,
    dateMinStr,
  })

  if (primaryMutations.length > 0 || !shouldUseFallback(primary)) {
    return primaryMutations
  }

  return fetchProviderMutations({
    provider: 'cquest',
    lat,
    lng,
    typeLocal,
    rayonMetres,
    dateMinStr,
  })
}
