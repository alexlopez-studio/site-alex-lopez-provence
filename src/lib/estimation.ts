import { fetchDvfMutations, median } from './dvf'

const COEF_ETAT: Record<string, number> = {
  neuf: 1.2, tres_bon_etat: 1.08, bon_etat: 1.0, rafraichir: 0.93, travaux: 0.82,
}
const COEF_DPE: Record<string, number> = {
  A: 1.06, B: 1.04, C: 1.02, D: 1.0, E: 0.98, F: 0.95, G: 0.9, NC: 1.0,
}

function coefEquipements(equipements: string[]): number {
  let c = 1.0
  if (equipements.includes('Piscine')) c *= 1.06
  if (equipements.includes('Vue exceptionnelle')) c *= 1.07
  if (equipements.includes('Jardin')) c *= 1.03
  if (equipements.includes('Garage')) c *= 1.02
  if (equipements.includes('Terrasse')) c *= 1.01
  return c
}

function coefDelai(delai: string): number {
  switch (delai) {
    case 'immediat': return 0.97
    case '1_3_mois': return 0.99
    case '6_mois': return 1.01
    default: return 1.0
  }
}

export interface EstimationInput {
  lat: number; lng: number; surface: number
  type_bien?: string; etat?: string; dpe?: string
  equipements?: string[]; delai?: string
}

export interface EstimationOutput {
  fourchette_basse: number; fourchette_haute: number; valeur_mediane: number
  prix_m2_median: number; prix_m2_brut_dvf: number; nb_transactions: number
  rayon_km: number; source: 'dvf' | 'fallback'; confiance: number; generated_at: string
}

export async function calculerEstimation(input: EstimationInput): Promise<EstimationOutput> {
  const { lat, lng, surface, type_bien = 'maison', etat = 'bon_etat', dpe = 'D', equipements = [], delai = '3_6_mois' } = input

  let mutations = await fetchDvfMutations(lat, lng, type_bien, 1500)
  let rayon = 1500
  if (mutations.length < 5) { mutations = await fetchDvfMutations(lat, lng, type_bien, 5000); rayon = 5000 }

  const BASE_M2: Record<string, number> = { maison: 3200, appartement: 2800, terrain: 120, autre: 2500 }
  if (mutations.length < 3) return build(surface, BASE_M2[type_bien] ?? 2800, etat, dpe, equipements, delai, 0, 'fallback', rayon)

  const prixM2List = mutations
    .filter((m) => m.surface_reelle_bati >= surface * 0.65 && m.surface_reelle_bati <= surface * 1.45 && m.valeur_fonciere > 0)
    .map((m) => m.valeur_fonciere / m.surface_reelle_bati)
    .filter((p) => p > 500 && p < 20000)

  if (prixM2List.length < 2) return build(surface, BASE_M2[type_bien] ?? 2800, etat, dpe, equipements, delai, 0, 'fallback', rayon)
  return build(surface, median(prixM2List), etat, dpe, equipements, delai, prixM2List.length, 'dvf', rayon)
}

function build(
  surface: number, prixM2Brut: number, etat: string, dpe: string,
  equipements: string[], delai: string, nbTx: number, source: 'dvf' | 'fallback', rayon: number
): EstimationOutput {
  const coef = (COEF_ETAT[etat] ?? 1.0) * (COEF_DPE[dpe] ?? 1.0) * coefEquipements(equipements) * coefDelai(delai)
  const prixM2 = prixM2Brut * coef
  const med = Math.round((prixM2 * surface) / 1000) * 1000
  let confiance = 40
  if (source === 'dvf') {
    if (nbTx >= 20) confiance = 85
    else if (nbTx >= 10) confiance = 75
    else if (nbTx >= 5) confiance = 65
    else confiance = 55
  }
  return {
    fourchette_basse: Math.round((med * 0.93) / 1000) * 1000,
    fourchette_haute: Math.round((med * 1.07) / 1000) * 1000,
    valeur_mediane: med,
    prix_m2_median: Math.round(prixM2),
    prix_m2_brut_dvf: Math.round(prixM2Brut),
    nb_transactions: nbTx,
    rayon_km: rayon / 1000,
    source, confiance,
    generated_at: new Date().toISOString(),
  }
}
