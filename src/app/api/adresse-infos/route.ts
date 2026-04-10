import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const q = searchParams.get('q') ?? ''

  if (!lat || !lng) return NextResponse.json({ error: 'lat et lng requis' }, { status: 400 })

  const result: {
    dpe?: { lettre: string }
    parcelle?: { id: string; commune: string; surface: number | null }
  } = {}

  // Parcelle cadastrale IGN
  try {
    const ignUrl =
      'https://geocodage.ign.fr/look4/parcel/search' +
      '?lat=' + lat + '&lon=' + lng +
      '&outputfields=all&fuzzyMatch=false&returntruegeometry=false&maximumResponses=1'
    const r = await fetch(ignUrl, { next: { revalidate: 86400 } })
    if (r.ok) {
      const d = await r.json()
      const first = d.results?.[0]
      if (first) {
        result.parcelle = {
          id: first.extrafields?.parcelle_id ?? first.toponym ?? '',
          commune: first.city ?? '',
          surface: first.extrafields?.surface_parcelle ?? null,
        }
      }
    }
  } catch { /* non disponible */ }

  // DPE ADEME
  try {
    const ademeUrl =
      'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines' +
      '?qs=adresse_ban%3A' + encodeURIComponent(q) +
      '&size=1&select=etiquette_dpe'
    const r = await fetch(ademeUrl, { next: { revalidate: 86400 } })
    if (r.ok) {
      const d = await r.json()
      const lettre = d.results?.[0]?.etiquette_dpe
      if (lettre) result.dpe = { lettre }
    }
  } catch { /* non disponible */ }

  return NextResponse.json(result)
}
