/**
 * Base Adresse Nationale (BAN) search client — Phase B v2 Step B2-2.5.
 *
 * Résoud le problème "BAN trouve la voie sans numéro" en :
 *  1. ré-classant les suggestions par type (housenumber > street > locality)
 *  2. annotant chaque résultat avec un score de précision exploitable par l'UI
 *  3. exposant les champs clés pour les lookups en aval (cadastre, ADEME, etc.)
 *
 * Endpoint : https://api-adresse.data.gouv.fr/search/
 */

const BAN_ENDPOINT = 'https://api-adresse.data.gouv.fr/search/'
const DEFAULT_TIMEOUT_MS = 4000
const DEFAULT_LIMIT = 6

export type BanFeatureType =
  | 'housenumber'
  | 'street'
  | 'locality'
  | 'municipality'
  | 'unknown'

/** UI-friendly precision derived from BAN's `type`. */
export type BanPrecision = 'exact' | 'street' | 'locality' | 'unknown'

export interface BanSuggestion {
  /** Full label as returned by BAN, e.g. "3252 Route d'Entrecasteaux 83570 Cotignac" */
  label: string
  lat: number
  lng: number
  /** Raw BAN type */
  type: BanFeatureType
  /** Confidence score returned by BAN (0..1) */
  score: number
  /** UI-friendly precision derived from `type` */
  precision: BanPrecision
  /** BAN feature id (stable identifier for downstream lookups) */
  id: string
  /** city name (BAN `city`) */
  city: string | null
  /** INSEE code (BAN `citycode`) */
  citycode: string | null
  /** house number digits if present, else null */
  housenumber: string | null
  /** postal code if present */
  postcode: string | null
}

export interface SearchBanOptions {
  q: string
  /** max results to return (default 6) */
  limit?: number
  timeoutMs?: number
  /** Optional auto-complete flag (default true) */
  autocomplete?: boolean
}

const PRECISION_RANK: Record<BanPrecision, number> = {
  exact: 0,
  street: 1,
  locality: 2,
  unknown: 3,
}

function precisionFromType(t: BanFeatureType): BanPrecision {
  if (t === 'housenumber') return 'exact'
  if (t === 'street') return 'street'
  if (t === 'locality' || t === 'municipality') return 'locality'
  return 'unknown'
}

function strOrNull(v: unknown): string | null {
  if (v === null || v === undefined || v === '') return null
  return String(v)
}

interface BanFeature {
  type?: string
  geometry?: { type?: string; coordinates?: [number, number] }
  properties?: Record<string, unknown>
}

interface BanResponse {
  type?: string
  features?: BanFeature[]
}

function parseFeature(f: BanFeature): BanSuggestion | null {
  const props = f.properties ?? {}
  const coords = f.geometry?.coordinates
  if (!Array.isArray(coords) || coords.length < 2) return null
  const [lng, lat] = coords
  const rawType = String(props.type ?? '')
  const banType: BanFeatureType =
    rawType === 'housenumber' ||
    rawType === 'street' ||
    rawType === 'locality' ||
    rawType === 'municipality'
      ? (rawType as BanFeatureType)
      : 'unknown'
  return {
    label: String(props.label ?? ''),
    lat: Number(lat),
    lng: Number(lng),
    type: banType,
    score: Number(props.score ?? 0),
    precision: precisionFromType(banType),
    id: String(props.id ?? ''),
    city: strOrNull(props.city),
    citycode: strOrNull(props.citycode),
    housenumber: strOrNull(props.housenumber),
    postcode: strOrNull(props.postcode),
  }
}

function sortByPrecisionThenScore(a: BanSuggestion, b: BanSuggestion): number {
  const r = PRECISION_RANK[a.precision] - PRECISION_RANK[b.precision]
  if (r !== 0) return r
  return b.score - a.score
}

/**
 * Search the BAN for an address query, returning suggestions ranked
 * housenumber-first and annotated with a precision score.
 *
 * Resilient: returns [] on HTTP errors, timeouts, or malformed responses.
 */
export async function searchBanAddresses(
  opts: SearchBanOptions,
): Promise<BanSuggestion[]> {
  const q = opts.q.trim()
  if (q.length < 3) return []
  const limit = Math.min(opts.limit ?? DEFAULT_LIMIT, 15)
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const autocomplete = opts.autocomplete !== false

  const url = new URL(BAN_ENDPOINT)
  url.searchParams.set('q', q)
  url.searchParams.set('limit', String(limit))
  url.searchParams.set('autocomplete', autocomplete ? '1' : '0')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      throw new Error(`BAN HTTP ${res.status}`)
    }
    const data = (await res.json()) as BanResponse
    const features = data.features ?? []
    const parsed: BanSuggestion[] = []
    for (const f of features) {
      const sug = parseFeature(f)
      if (sug) parsed.push(sug)
    }
    parsed.sort(sortByPrecisionThenScore)
    return parsed
  } catch (err) {
    console.error('[ban] searchBanAddresses failed', err)
    return []
  } finally {
    clearTimeout(timer)
  }
}

/** UI helper: short human-readable label for a precision bucket (FR). */
export function precisionLabel(p: BanPrecision): string {
  if (p === 'exact') return 'N° exact'
  if (p === 'street') return 'Voie sans n°'
  if (p === 'locality') return 'Localité'
  return 'Imprecis'
}
