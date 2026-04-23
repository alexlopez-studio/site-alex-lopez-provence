/**
 * API DVF Cerema — données de valeurs fonci\u00e8res
 */

const DVF_API = 'https://apidf-preprod.cerema.fr/dvf_opendata/geomutations/'

export interface DvfMutation {
  valeur_fonciere: number
  surface_reelle_bati: number
  type_local: string
  date_mutation: string
  code_postal: string
}

export function median(values: number[]): number {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

export async function fetchDvfMutations(
  lat: number,
  lng: number,
  typeBien: string,
  rayonMetres = 1500
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
    return d.results ?? d.features?.map((f: Record<string, unknown>) => f.properties) ?? []
  } catch {
    return []
  }
}
