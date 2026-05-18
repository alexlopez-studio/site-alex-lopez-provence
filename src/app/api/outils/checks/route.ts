import { NextResponse } from 'next/server'
import { findDpeNearby } from '@/lib/ademe'
import { findParcelByPoint } from '@/lib/cadastre'
import { calculerEstimation } from '@/lib/estimation'
import { computeLeadResults } from '@/lib/leads/compute-results'

type Status = 'ok' | 'warning' | 'error'

type Check = {
  id: string
  label: string
  status: Status
  detail: string
}

const TEST_COORDS = {
  lat: 43.5284,
  lng: 6.1498,
}

const KNOWN_DPE_TEST = {
  address: '571 Chemin du Petit Ruisseau 83470 Saint-Maximin-la-Sainte-Baume',
  lat: 43.439497,
  lng: 5.863864,
  expected: 'B',
}

function statusFromChecks(checks: Check[]): Status {
  if (checks.some((check) => check.status === 'error')) return 'error'
  if (checks.some((check) => check.status === 'warning')) return 'warning'
  return 'ok'
}

async function safeCheck(check: () => Promise<Check>, fallback: Omit<Check, 'status' | 'detail'>): Promise<Check> {
  try {
    return await check()
  } catch (err) {
    return {
      ...fallback,
      status: 'error',
      detail: err instanceof Error ? err.message : 'Erreur inconnue',
    }
  }
}

export async function GET() {
  const checks = await Promise.all([
    safeCheck(async () => {
      const url = new URL('https://api-adresse.data.gouv.fr/search/')
      url.searchParams.set('q', 'Cotignac')
      url.searchParams.set('limit', '1')
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) throw new Error('API Adresse HTTP ' + response.status)
      const data = await response.json()
      const count = Array.isArray(data?.features) ? data.features.length : 0
      return {
        id: 'adresse-autocomplete',
        label: 'Recherche adresse',
        status: count > 0 ? 'ok' : 'warning',
        detail: count > 0 ? 'Recherche d’adresse opérationnelle.' : 'Recherche d’adresse joignable, mais aucun résultat de test.',
      }
    }, { id: 'adresse-autocomplete', label: 'Recherche adresse' }),

    safeCheck(async () => {
      const [dpeLookup, parcel] = await Promise.all([
        findDpeNearby({
          lat: KNOWN_DPE_TEST.lat,
          lng: KNOWN_DPE_TEST.lng,
          address: KNOWN_DPE_TEST.address,
          radius: 500,
        }),
        findParcelByPoint({
          lat: KNOWN_DPE_TEST.lat,
          lng: KNOWN_DPE_TEST.lng,
        }),
      ])

      const dpeFound = Boolean(dpeLookup.dpe?.etiquette_dpe)
      const parcelFound = Boolean(parcel)
      const dpeLetter = dpeLookup.dpe?.etiquette_dpe
      return {
        id: 'adresse-infos',
        label: 'DPE / cadastre',
        status: dpeFound && dpeLetter === KNOWN_DPE_TEST.expected ? 'ok' : dpeFound || parcelFound ? 'warning' : 'error',
        detail: dpeFound ? 'DPE retrouvé sur adresse test : classe ' + dpeLetter + (parcelFound ? ' + parcelle.' : '.') : 'DPE non retrouvé sur l’adresse test connue.',
      }
    }, { id: 'adresse-infos', label: 'DPE / cadastre' }),

    safeCheck(async () => {
      const data = await calculerEstimation({
        lat: TEST_COORDS.lat,
        lng: TEST_COORDS.lng,
        surface: 90,
        type_bien: 'maison',
        etat: 'bon_etat',
        dpe: 'D',
        equipements: ['Terrasse'],
        delai: '3_6_mois',
      })
      const hasEstimate = Number.isFinite(data?.valeur_mediane) && data.valeur_mediane > 0
      return {
        id: 'estimation',
        label: 'Calcul estimation',
        status: hasEstimate ? 'ok' : 'warning',
        detail: hasEstimate ? 'Calcul estimation opérationnel : ' + new Intl.NumberFormat('fr-FR').format(data.valeur_mediane) + ' €.' : 'Calcul estimation joignable, mais sans résultat exploitable.',
      }
    }, { id: 'estimation', label: 'Calcul estimation' }),

    safeCheck(async () => {
      const results = await computeLeadResults({
        type: 'audit',
        formData: {
          etat_toiture: 'bon',
          etat_facade: 'bon',
          etat_menuiseries: 'bon',
          etat_plomberie: 'bon',
          etat_electricite: 'bon',
          humidite: false,
          isolation_murs: 'bonne',
          isolation_combles: 'bonne',
          isolation_fenetres: 'double_vitrage',
          type_chauffage: 'pac',
          dpe: 'C',
          objectif: 'vente',
        },
      })
      const score = typeof results?.score_global === 'number' ? results.score_global : null
      return {
        id: 'leads',
        label: 'Création lead',
        status: score != null ? 'ok' : 'warning',
        detail: score != null ? 'Calcul lead validé en mode test, sans email ni sauvegarde réelle. Score audit : ' + score + '/100.' : 'Moteur lead joignable, mais résultat de test incomplet.',
      }
    }, { id: 'leads', label: 'Création lead' }),
  ])

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    overallStatus: statusFromChecks(checks),
    checks,
  })
}
