/**
 * APICarto IGN Cadastre client — Phase B v2 Step B2-2.
 *
 * Récupère la parcelle cadastrale (n° + section + surface terrain) à partir
 * d'un point géographique (lat/lng) ou d'un code (INSEE + section + numéro).
 *
 * Endpoint : https://apicarto.ign.fr/api/cadastre/parcelle
 * Source par défaut : PCI (Parcellaire Express)
 * Réponse : GeoJSON FeatureCollection
 */

const APICARTO_BASE = 'https://apicarto.ign.fr/api/cadastre'
const DEFAULT_TIMEOUT_MS = 5000

export interface Parcel {
  /** Identifiant unique parcelle (15 caractères, ex. 830420000A0123) */
  idu: string
  code_insee: string
  code_dep: string
  code_com: string
  code_arr: string
  nom_com: string
  section: string
  numero: string
  /** Surface terrain en m² (contenance cadastrale) */
  contenance_m2: number | null
  /** Géométrie GeoJSON brute (Polygon ou MultiPolygon) */
  geometry: unknown
}

export interface ParcelByCodeOptions {
  codeInsee: string
  section: string
  numero: string
  timeoutMs?: number
}

export interface ParcelByPointOptions {
  lat: number
  lng: number
  timeoutMs?: number
}

interface FeatureCollectionLike {
  type?: string
  features?: Array<{
    type?: string
    geometry?: unknown
    properties?: Record<string, unknown> | null
  }>
}

async function apicartoFetch(
  url: string,
  timeoutMs: number,
): Promise<FeatureCollectionLike> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`APICarto Cadastre HTTP ${res.status}`)
    }
    return (await res.json()) as FeatureCollectionLike
  } finally {
    clearTimeout(timer)
  }
}

function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null
  return String(v)
}
function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

function normalizeFeature(
  f: NonNullable<FeatureCollectionLike['features']>[number],
): Parcel | null {
  const p = f.properties ?? {}
  const idu = strOrNull(p.idu)
  if (!idu) return null
  return {
    idu,
    code_insee: strOrNull(p.code_insee) ?? '',
    code_dep: strOrNull(p.code_dep) ?? '',
    code_com: strOrNull(p.code_com) ?? '',
    code_arr: strOrNull(p.code_arr) ?? '',
    nom_com: strOrNull(p.nom_com) ?? '',
    section: strOrNull(p.section) ?? '',
    numero: strOrNull(p.numero) ?? '',
    contenance_m2: numOrNull(p.contenance),
    geometry: f.geometry ?? null,
  }
}

function firstParcel(fc: FeatureCollectionLike): Parcel | null {
  const features = fc.features ?? []
  for (const f of features) {
    const parcel = normalizeFeature(f)
    if (parcel) return parcel
  }
  return null
}

/**
 * Find the cadastral parcel that contains a given lat/lng point.
 * Resilient: returns null on HTTP errors or if no parcel is found.
 */
export async function findParcelByPoint(
  opts: ParcelByPointOptions,
): Promise<Parcel | null> {
  try {
    const geom = JSON.stringify({
      type: 'Point',
      coordinates: [opts.lng, opts.lat],
    })
    const url = `${APICARTO_BASE}/parcelle?geom=${encodeURIComponent(geom)}`
    const fc = await apicartoFetch(
      url,
      opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    )
    return firstParcel(fc)
  } catch (err) {
    console.error('[cadastre] findParcelByPoint failed', err)
    return null
  }
}

/**
 * Direct lookup by INSEE code + cadastral section + numero.
 * Returns null if not found or on error.
 */
export async function findParcelByCode(
  opts: ParcelByCodeOptions,
): Promise<Parcel | null> {
  try {
    const params = new URLSearchParams({
      code_insee: opts.codeInsee,
      section: opts.section,
      numero: opts.numero,
    })
    const url = `${APICARTO_BASE}/parcelle?${params.toString()}`
    const fc = await apicartoFetch(
      url,
      opts.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    )
    return firstParcel(fc)
  } catch (err) {
    console.error('[cadastre] findParcelByCode failed', err)
    return null
  }
}
