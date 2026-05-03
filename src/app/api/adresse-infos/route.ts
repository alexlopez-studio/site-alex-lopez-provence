import { NextRequest, NextResponse } from 'next/server'
import { findDpeNearby } from '@/lib/ademe'
import { findParcelByPoint } from '@/lib/cadastre'

/**
 * GET /api/adresse-infos?lat=...&lng=...
 *
 * Phase B v2 — câblé sur les libs typées :
 *  - DPE : recherche géographique sur l'API ADEME (data-fair, dataset v2)
 *  - Parcelle : APICarto IGN (endpoint moderne, remplace look4/parcel/search déprécié)
 *
 * Répond avec un JSON tolérant aux trous : si une API est down ou ne trouve
 * rien, le champ correspondant est simplement absent de la réponse.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const latStr = searchParams.get('lat')
  const lngStr = searchParams.get('lng')

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: 'lat et lng requis' },
      { status: 400 },
    )
  }

  const lat = Number(latStr)
  const lng = Number(lngStr)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return NextResponse.json(
      { error: 'lat et lng invalides' },
      { status: 400 },
    )
  }

  const result: {
    dpe?: { lettre: string; confidence: 'exact' | 'approximatif' | 'non_trouve' }
    parcelle?: {
      id: string
      idu: string
      commune: string
      surface: number | null
    }
  } = {}

  // Lookups en parallèle pour minimiser la latence côté client.
  // Les deux libs sont résilientes (retournent null / non_trouve sur erreur),
  // donc Promise.all ne peut pas rejeter ici.
  const [dpeLookup, parcel] = await Promise.all([
    findDpeNearby({ lat, lng }),
    findParcelByPoint({ lat, lng }),
  ])

  if (dpeLookup.dpe?.etiquette_dpe) {
    result.dpe = {
      lettre: dpeLookup.dpe.etiquette_dpe,
      confidence: dpeLookup.confidence,
    }
  }

  if (parcel) {
    result.parcelle = {
      // Format affichable : section-numero, ex. "0D-1366"
      id: parcel.section + '-' + parcel.numero,
      // Identifiant unique 14-15 chars (pour lookups en aval, BDNB notamment)
      idu: parcel.idu,
      commune: parcel.nom_com,
      surface: parcel.contenance_m2,
    }
  }

  return NextResponse.json(result)
}
