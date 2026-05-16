import { describe, it, expect, afterEach, vi } from 'vitest'
import { calculerEstimation } from '@/lib/estimation'

/**
 * Tests baseline du moteur d'estimation.
 *
 * Objectif : figer le comportement actuel avant d'améliorer le moteur
 * estimation (DVF prod, outliers, pondération, confiance, enrichissements).
 */

const LAT = 43.5283
const LNG = 6.1494

type DvfMockMutation = {
  valeur_fonciere: number
  surface_reelle_bati: number
  type_local: string
  date_mutation: string
  code_postal: string
}

function mut(overrides: Partial<DvfMockMutation> = {}): DvfMockMutation {
  return {
    valeur_fonciere: 400_000,
    surface_reelle_bati: 100,
    type_local: 'Maison',
    date_mutation: '2024-06-15',
    code_postal: '83570',
    ...overrides,
  }
}

function mockDvfFetch(calls: DvfMockMutation[][]) {
  let callIndex = 0
  const fn = vi.fn(async (input: unknown): Promise<Response> => {
    const index = Math.min(callIndex, calls.length - 1)
    callIndex += 1
    const mutations = calls[index] ?? []
    return new Response(JSON.stringify({ results: mutations }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  })
  vi.stubGlobal('fetch', fn as unknown as typeof fetch)
  return fn
}

describe('lib/estimation.calculerEstimation — scénarios DVF nominaux', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('produit une fourchette cohérente avec 5 mutations alignées', async () => {
    mockDvfFetch([Array.from({ length: 5 }, () => mut())])

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
    expect(r.fourchette_basse).toBe(372_000)
    expect(r.fourchette_haute).toBe(428_000)
    expect(r.confiance).toBe(65)
    expect(r.rayon_km).toBe(1.5)
    expect(r.generated_at).toMatch(/^\d{4}-\d{2}-\d{2}T/)
  })

  it('escalade le rayon à 5 km quand moins de 5 mutations sont trouvées au rayon initial', async () => {
    const fetchMock = mockDvfFetch([
      [mut(), mut()],
      Array.from({ length: 5 }, () => mut()),
    ])

    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
    })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(r.rayon_km).toBe(5)
    expect(r.source).toBe('dvf')
  })

  it('utilise le fallback BASE_M2 quand aucune mutation DVF n’est disponible', async () => {
    mockDvfFetch([[], []])

    const r = await calculerEstimation({
      lat: 0,
      lng: 0,
      surface: 100,
      type_bien: 'maison',
    })

    expect(r.source).toBe('fallback')
    expect(r.nb_transactions).toBe(0)
    expect(r.confiance).toBe(40)
    expect(r.prix_m2_brut_dvf).toBe(3200)
    expect(r.valeur_mediane).toBe(320_000)
    expect(r.rayon_km).toBe(5)
  })

  it('utilise BASE_M2.appartement pour un appartement en fallback', async () => {
    mockDvfFetch([[], []])

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

  it('passe bien le type Appartement dans l’URL DVF pour un appartement', async () => {
    const fetchMock = mockDvfFetch([[], []])

    await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 60,
      type_bien: 'appartement',
    })

    const calledUrl = String(fetchMock.mock.calls[0]?.[0])
    expect(calledUrl).toContain('in_type_local=Appartement')
    expect(calledUrl).toContain('nature_mutation=Vente')
  })
})

describe('lib/estimation.calculerEstimation — filtres comparables', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('exclut les mutations dont la surface est hors range', async () => {
    const mutations = [
      mut({ surface_reelle_bati: 100, valeur_fonciere: 400_000 }),
      mut({ surface_reelle_bati: 110, valeur_fonciere: 440_000 }),
      mut({ surface_reelle_bati: 300, valeur_fonciere: 600_000 }),
    ]
    mockDvfFetch([mutations, mutations])

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

  it('exclut les prix au m² aberrants', async () => {
    const mutations = [
      mut({ valeur_fonciere: 400_000, surface_reelle_bati: 100 }),
      mut({ valeur_fonciere: 440_000, surface_reelle_bati: 110 }),
      mut({ valeur_fonciere: 3_000_000, surface_reelle_bati: 100 }),
      mut({ valeur_fonciere: 10_000, surface_reelle_bati: 100 }),
    ]
    mockDvfFetch([mutations, mutations])

    const r = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
    })

    expect(r.prix_m2_brut_dvf).toBe(4000)
    expect(r.nb_transactions).toBe(2)
  })

  it('bascule en fallback quand moins de 2 mutations restent valides après filtres', async () => {
    const mutations = [
      mut({ surface_reelle_bati: 100, valeur_fonciere: 400_000 }),
      mut({ surface_reelle_bati: 300 }),
      mut({ surface_reelle_bati: 310 }),
    ]
    mockDvfFetch([mutations, mutations])

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

  it('applique le coefficient d’état neuf', async () => {
    mockDvfFetch([Array.from({ length: 5 }, () => mut())])
    const ref = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      etat: 'bon_etat',
      dpe: 'D',
    })

    mockDvfFetch([Array.from({ length: 5 }, () => mut())])
    const neuf = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      etat: 'neuf',
      dpe: 'D',
    })

    expect(neuf.valeur_mediane).toBeGreaterThan(ref.valeur_mediane)
    expect(Math.abs(neuf.valeur_mediane - ref.valeur_mediane * 1.2)).toBeLessThan(2000)
  })

  it('applique le coefficient DPE', async () => {
    mockDvfFetch([Array.from({ length: 5 }, () => mut())])
    const dpeA = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      dpe: 'A',
    })

    mockDvfFetch([Array.from({ length: 5 }, () => mut())])
    const dpeG = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      dpe: 'G',
    })

    expect(dpeA.valeur_mediane).toBeGreaterThan(dpeG.valeur_mediane)
  })

  it('expose un breakdown cohérent des ajustements', async () => {
    mockDvfFetch([Array.from({ length: 5 }, () => mut())])

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
    expect(r.ajustements.map((a) => a.key)).toEqual([
      'etat',
      'dpe',
      'eq:Piscine',
      'delai',
    ])
  })

  it('omet les coefficients neutres du breakdown', async () => {
    mockDvfFetch([Array.from({ length: 5 }, () => mut())])

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

  it('liste les points forts attendus', async () => {
    mockDvfFetch([Array.from({ length: 5 }, () => mut())])

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
    mockDvfFetch([Array.from({ length: 5 }, () => mut())])
    const standard = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
      delai: '3_6_mois',
    })

    mockDvfFetch([Array.from({ length: 5 }, () => mut())])
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

  it('augmente la confiance avec le nombre de transactions', async () => {
    mockDvfFetch([Array.from({ length: 5 }, () => mut())])
    const c5 = await calculerEstimation({
      lat: LAT,
      lng: LNG,
      surface: 100,
      type_bien: 'maison',
    })

    mockDvfFetch([Array.from({ length: 20 }, () => mut())])
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
