import { NextRequest, NextResponse } from 'next/server'

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

function originFromRequest(req: NextRequest) {
  try {
    return new URL(req.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr'
  }
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

export async function GET(req: NextRequest) {
  const origin = originFromRequest(req)

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
        detail: count > 0 ? 'API Adresse disponible.' : 'API Adresse joignable, mais aucun résultat de test.',
      }
    }, { id: 'adresse-autocomplete', label: 'Recherche adresse' }),

    safeCheck(async () => {
      const url = new URL('/api/adresse-infos', origin)
      url.searchParams.set('lat', String(TEST_COORDS.lat))
      url.searchParams.set('lng', String(TEST_COORDS.lng))
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) throw new Error('/api/adresse-infos HTTP ' + response.status)
      const data = await response.json()
      const found = [data?.dpe ? 'DPE' : null, data?.parcelle ? 'cadastre' : null].filter(Boolean).join(' + ')
      return {
        id: 'adresse-infos',
        label: 'DPE / cadastre',
        status: 'ok',
        detail: found ? 'Route disponible, données trouvées : ' + found + '.' : 'Route disponible. Aucune donnée trouvée sur le point de test, ce qui reste acceptable.',
      }
    }, { id: 'adresse-infos', label: 'DPE / cadastre' }),

    safeCheck(async () => {
      const response = await fetch(new URL('/api/estimation', origin), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          lat: TEST_COORDS.lat,
          lng: TEST_COORDS.lng,
          surface: 90,
          type_bien: 'maison',
          etat: 'bon_etat',
          dpe: 'D',
          equipements: ['Terrasse'],
          delai: '3_6_mois',
        }),
      })
      if (!response.ok) throw new Error('/api/estimation HTTP ' + response.status)
      const data = await response.json()
      const hasEstimate = data && typeof data === 'object'
      return {
        id: 'estimation',
        label: 'Calcul estimation',
        status: hasEstimate ? 'ok' : 'warning',
        detail: hasEstimate ? 'Route estimation disponible.' : 'Route estimation répond, mais sans résultat exploitable.',
      }
    }, { id: 'estimation', label: 'Calcul estimation' }),

    safeCheck(async () => {
      const response = await fetch(new URL('/api/leads', origin), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({
          dry_run: true,
          type: 'audit',
          token: 'api-check-' + Date.now(),
          email: 'test@example.com',
          prenom: 'Test',
          nom: 'API',
          telephone: '0600000000',
          opt_in: true,
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
        }),
      })
      if (!response.ok) throw new Error('/api/leads HTTP ' + response.status)
      const data = await response.json()
      return {
        id: 'leads',
        label: 'Création lead',
        status: data?.success && data?.dryRun ? 'ok' : 'warning',
        detail: data?.success && data?.dryRun ? 'Route leads validée en mode test, sans email ni sauvegarde réelle.' : 'Route leads répond, mais le mode test n’a pas été confirmé.',
      }
    }, { id: 'leads', label: 'Création lead' }),
  ])

  return NextResponse.json({
    checkedAt: new Date().toISOString(),
    overallStatus: statusFromChecks(checks),
    checks,
  })
}
