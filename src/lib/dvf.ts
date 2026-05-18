/**
 * API DVF Cerema — données de valeurs foncières
 */

const DVF_API = 'https://apidf-preprod.cerema.fr/dvf_opendata/geomutations/'

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
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
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
  const geometry = feature.geometry as { coordinates?: unknown } | undefined
  const coords = geometry?.coordinates
  if (Array.isArray(coords) && typeof coords[0] === 'number' && typeof coords[1] === 'number') {
    return { lng: coords[0], lat: coords[1] }
  }
  return null
}

function normalizeMutation(raw: Record<string, unknown>, origin: { lat: number; lng: number }): DvfMutation | null {
  const valeur = num(raw.valeur_fonciere)
  const surface = num(raw.surface_reelle_bati)
  if (!valeur || !surface) return null

  const lat = num(raw.lat) ?? num(raw.latitude)
  const lng = num(raw.lon) ?? num(raw.lng) ?? num(raw.longitude)
  const hasPoint = typeof lat === 'number' && typeof lng === 'number'

  return {
    valeur_fonciere: valeur,
    surface_reelle_bati: surface,
    type_local: String(raw.type_local ?? ''),
    date_mutation: String(raw.date_mutation ?? ''),
    code_postal: String(raw.code_postal ?? ''),
    ...(hasPoint ? { distance_m: haversineMeters(origin, { lat, lng }) } : {}),
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

  const url =
    DVF_API +
    `?lat=${lat}&lon=${lng}&rayon=${rayonMetres}` +
    `&date_mutation_min=${dateMinStr}&nature_mutation=Vente` +
    `&in_type_local=${typeLocal}&ordering=-date_mutation&limit=100`

  try {
    const r = await fetch(url, { next: { revalidate: 86400 } })
    if (!r.ok) return []
    const d = await r.json()
    const origin = { lat, lng }

    if (Array.isArray(d.results)) {
      return d.results
        .map((raw: Record<string, unknown>) => normalizeMutation(raw, origin))
        .filter((mutation: DvfMutation | null): mutation is DvfMutation => mutation != null)
    }

    if (Array.isArray(d.features)) {
      return d.features
        .map((feature: Record<string, unknown>) => {
          const props = (feature.properties ?? {}) as Record<string, unknown>
          const point = coordinatesFromFeature(feature)
          return normalizeMutation({ ...props, ...(point ? { lat: point.lat, lng: point.lng } : {}) }, origin)
        })
        .filter((mutation: DvfMutation | null): mutation is DvfMutation => mutation != null)
    }

    return []
  } catch {
    return []
  }
}
