import { describe, it, expect, afterEach, vi } from 'vitest'
import { calculerEstimation } from '@/lib/estimation'

/**
 * Tests baseline du moteur d'estimation (Step 1).
 *
 * Ces tests figent le comportement du moteur AVANT les Steps 2-5 (DVF prod,
 * exclusion outliers IQR, pondération comparables, confiance adaptative,
 * enrichissement ADEME). Ils servent de filet pour mesurer que chaque step
 * d'amélioration n'introduit pas de régression.
 *
 * Le mock cible l'URL DVF actuelle (apidf-preprod.cerema.fr). Lors du passage
 * en prod au Step 2, mettre à jour le `match` ci-dessous.
 */

const LAT = 43.5283
const LNG = 6.1494

type MockResponse = { status?: number; body: unknown }

function mockFetch(
  routes: Array<{ match: string; response: MockResponse }>,
) {
  const fn = vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.toString()
    for (const route of routes) {
      if (url.includes(route.match)) {
        return new Response(JSON.stringify(route.response.body), {
          status: route.response.status ?? 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    }
    return new Response(JSON.stringify({ results: [] }), { status: 200 })
  })
  vi.stubGlobal('fetch', fn)
  return fn
}

function mut(overrides: Record<string, unknown> = {}) {
  return {
    valeur_fonciere: 400_000,
    surface_reelle_bati: 100,
    type_local: 'Maison',
    date_mutation: '2024-06-15',
    code_postal: '83570',
    ...overrides,
  }
}

function dvfResp(mutations: ReturnType<typeof mut>[]) {
  return {
    match: 'apidf-preprod.cerema.fr',
    response: { body: { results: mutations } },
  }
}

describe('lib/estimation.calculerEstimation — scénarios DVF nominaux', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('produit une fourchette cohérente avec 5 mutations alignées', async () => {
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      etat: 'bon_etat',
      dpe: 'D',
      equipements: [],
      delai: '3_6_mois',
    })
    expect(r.source).toBe('dvf')
    expect(r.nb_transactions).toBe(5)
    expect(r.prix_m2_brut_dvf).toBe(4000)
    expect(r.valeur_mediane).toBe(400_000)
    expect(r.fourchette_basse).toBeLessThan(r.valeur_mediane)
    expect(r.fourchette_haute).toBeGreaterThan(r.valeur_mediane)
    expect(r.fourchette_basse).toBe(372_000)
    expect(r.fourchette_haute).toBe(428_000)
    expect(r.confiance).toBe(65)
    expect(r.rayon_km).toBe(1.5)
    expect(r.generated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('escalade le rayon à 5km quand moins de 5 mutations au rayon initial', async () => {
    let callCount = 0
    const fn = vi.fn(async (input: RequestInfo | URL): Promise<Response> => {
      const url = typeof input === 'string' ? input : input.toString()
      if (!url.includes('apidf-preprod.cerema.fr')) {
        return new Response(JSON.stringify({ results: [] }), { status: 200 })
      }
      callCount++
      const mutations =
        callCount === 1
          ? [mut(), mut()] // 2 mutations < 5 → escalade
          : Array.from({ length: 5 }, () => mut())
      return new Response(JSON.stringify({ results: mutations }), {
        status: 200,
      })
    })
    vi.stubGlobal('fetch', fn)

    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
    })
    expect(callCount).toBe(2)
    expect(r.rayon_km).toBe(5)
    expect(r.source).toBe('dvf')
  })

  it('utilise le fallback BASE_M2 quand aucune mutation DVF disponible', async () => {
    mockFetch([dvfResp([])])
    const r = await calculerEstimation({
      lat: 0,
      lng: 0,
      surface: 100,
      type_bien: 'maison',
    })
    expect(r.source).toBe('fallback')
    expect(r.nb_transactions).toBe(0)
    expect(r.confiance).toBe(40)
    // BASE_M2.maison = 3200 ; coefs neutres → prix de base = 320 000
    expect(r.prix_m2_brut_dvf).toBe(3200)
    expect(r.valeur_mediane).toBe(320_000)
    // En fallback, le moteur tente toujours la 2e requête (rayon 5000m)
    expect(r.rayon_km).toBe(5)
  })

  it('utilise BASE_M2.appartement (2800 €/m²) pour un appartement en fallback', async () => {
    mockFetch([dvfResp([])])
    const r = await calculerEstimation({
      lat: 0,
      lng: 0,
      surface: 50,
      type_bien: 'appartement',
    })
    expect(r.source).toBe('fallback')
    expect(r.prix_m2_brut_dvf).toBe(2800)
    expect(r.valeur_mediane).toBe(140_000)
  })

  it('passe in_type_local=Appartement dans l’URL DVF pour un appartement', async () => {
    const fetch = mockFetch([dvfResp([])])
    await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 60,
      type_bien: 'appartement',
    })
    const calledUrl = String(fetch.mock.calls[0]?.[0])
    expect(calledUrl).toContain('in_type_local=Appartement')
    expect(calledUrl).toContain('nature_mutation=Vente')
  })
})

describe('lib/estimation.calculerEstimation — filtres comparables', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('exclut les mutations dont la surface est hors range (±35/45 %)', async () => {
    // surface=100 → range valide [65, 145]
    mockFetch([
      dvfResp([
        mut({ surface_reelle_bati: 100, valeur_fonciere: 400_000 }),
        mut({ surface_reelle_bati: 110, valeur_fonciere: 440_000 }),
        mut({ surface_reelle_bati: 300, valeur_fonciere: 600_000 }), // hors range
      ]),
    ])
    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
    })
    expect(r.source).toBe('dvf')
    expect(r.prix_m2_brut_dvf).toBe(4000)
    expect(r.nb_transactions).toBe(2)
  })

  it('exclut les prix au m² aberrants (<500 € ou >20 000 €)', async () => {
    mockFetch([
      dvfResp([
        mut({ valeur_fonciere: 400_000, surface_reelle_bati: 100 }), // 4000 OK
        mut({ valeur_fonciere: 440_000, surface_reelle_bati: 110 }), // 4000 OK
        mut({ valeur_fonciere: 3_000_000, surface_reelle_bati: 100 }), // 30 000 → exclu
        mut({ valeur_fonciere: 10_000, surface_reelle_bati: 100 }), // 100 → exclu
      ]),
    ])
    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
    })
    expect(r.prix_m2_brut_dvf).toBe(4000)
    expect(r.nb_transactions).toBe(2)
  })

  it('bascule en fallback quand moins de 2 mutations valides après filtres', async () => {
    mockFetch([
      dvfResp([
        mut({ surface_reelle_bati: 100, valeur_fonciere: 400_000 }), // valide
        mut({ surface_reelle_bati: 300 }), // exclu (surface hors range)
        mut({ surface_reelle_bati: 310 }), // exclu (surface hors range)
      ]),
    ])
    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
    })
    expect(r.source).toBe('fallback')
  })
})

describe('lib/estimation.calculerEstimation — coefficients métiers', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('applique le coefficient d’état (« neuf » ≈ +20 %)', async () => {
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const ref = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      etat: 'bon_etat',
      dpe: 'D',
    })
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const neuf = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      etat: 'neuf',
      dpe: 'D',
    })
    expect(neuf.valeur_mediane).toBeGreaterThan(ref.valeur_mediane)
    // médiane neuf ≈ médiane ref × 1.2 (à l’arrondi €1000 près)
    expect(
      Math.abs(neuf.valeur_mediane - ref.valeur_mediane * 1.2),
    ).toBeLessThan(2000)
  })

  it('applique le coefficient DPE (A > G)', async () => {
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const dpeA = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      dpe: 'A',
    })
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const dpeG = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      dpe: 'G',
    })
    expect(dpeA.valeur_mediane).toBeGreaterThan(dpeG.valeur_mediane)
  })

  it('expose un breakdown cohérent (prix_calcule = prix_de_base + total_ajustement_eur)', async () => {
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      etat: 'tres_bon_etat',
      dpe: 'B',
      equipements: ['Piscine'],
      delai: 'immediat',
    })
    expect(r.prix_calcule).toBe(r.prix_de_base + r.total_ajustement_eur)
    const keys = r.ajustements.map((a) => a.key)
    expect(keys).toContain('etat')
    expect(keys).toContain('dpe')
    expect(keys).toContain('eq:Piscine')
    expect(keys).toContain('delai')
  })

  it('omet du breakdown les coefficients neutres (état « bon_etat », DPE « D », pas d’équipement, délai « 3_6_mois »)', async () => {
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      etat: 'bon_etat',
      dpe: 'D',
      equipements: [],
      delai: '3_6_mois',
    })
    expect(r.ajustements).toEqual([])
    expect(r.total_ajustement_eur).toBe(0)
    expect(r.total_ajustement_pct).toBe(0)
    expect(r.prix_calcule).toBe(r.prix_de_base)
  })

  it('liste les points forts attendus (piscine, jardin, bon DPE)', async () => {
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      dpe: 'B',
      equipements: ['Piscine', 'Jardin'],
    })
    expect(r.points_forts).toContain('Piscine')
    expect(r.points_forts).toContain('Jardin')
    expect(r.points_forts).toContain('Bonne performance énergétique')
  })

  it('augmente la probabilité de vente rapide quand le délai est immédiat', async () => {
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const standard = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      delai: '3_6_mois',
    })
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const urgent = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      delai: 'immediat',
    })
    expect(urgent.strategie.probabilite_vente_rapide_pct).toBeGreaterThan(
      standard.strategie.probabilite_vente_rapide_pct,
    )
  })

  it('augmente la confiance avec le nombre de transactions (5 → 65, 20 → 85)', async () => {
    mockFetch([dvfResp(Array.from({ length: 5 }, () => mut()))])
    const c5 = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
    })
    mockFetch([dvfResp(Array.from({ length: 20 }, () => mut()))])
    const c20 = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
    })
    expect(c5.confiance).toBe(65)
    expect(c20.confiance).toBe(85)
    expect(c20.confiance).toBeGreaterThan(c5.confiance)
  })
})
