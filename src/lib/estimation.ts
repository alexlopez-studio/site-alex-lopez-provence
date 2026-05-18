import { fetchDvfMutations, median } from './dvf'

const COEF_ETAT: Record<string, number> = {
  neuf: 1.2, tres_bon_etat: 1.08, bon_etat: 1.0, rafraichir: 0.93, travaux: 0.82,
}
const COEF_DPE: Record<string, number> = {
  A: 1.06, B: 1.04, C: 1.02, D: 1.0, E: 0.98, F: 0.95, G: 0.9, NC: 1.0,
}
const ETAT_LABEL: Record<string, string> = {
  neuf: 'Neuf / récent', tres_bon_etat: 'Très bon état', bon_etat: 'Bon état',
  rafraichir: 'À rafraîchir', travaux: 'Travaux importants',
}
const EQUIPEMENT_COEF: Record<string, number> = {
  Piscine: 1.06, 'Vue exceptionnelle': 1.07, Jardin: 1.03, Garage: 1.02,
  Terrasse: 1.01, Balcon: 1.01, Cave: 1.005, Stationnement: 1.02, Cheminée: 1.005,
}

function coefEquipementsTotal(equipements: string[]): number {
  let c = 1.0
  for (const eq of equipements) {
    const v = EQUIPEMENT_COEF[eq]
    if (v) c *= v
  }
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

function coefAnneeConstruction(annee?: number): number {
  if (!annee || !Number.isFinite(annee)) return 1.0
  if (annee >= 2013) return 1.035
  if (annee >= 2006) return 1.02
  if (annee >= 1975) return 1.0
  if (annee >= 1948) return 0.98
  return 0.965
}

function constructionLabel(annee?: number): string | null {
  if (!annee || !Number.isFinite(annee)) return null
  if (annee >= 2013) return 'construction récente (' + annee + ')'
  if (annee >= 2006) return 'construction après 2006 (' + annee + ')'
  if (annee >= 1975) return 'construction après 1975 (' + annee + ')'
  if (annee >= 1948) return 'construction ancienne (' + annee + ')'
  return 'bâti ancien (' + annee + ')'
}

export interface EstimationInput {
  lat: number; lng: number; surface: number
  type_bien?: string; etat?: string; dpe?: string
  equipements?: string[]; delai?: string
  annee_construction?: number
  dpe_verifie?: boolean
  numero_dpe?: string
}

export interface AjustementBreakdown {
  key: string
  label: string
  pct: number
  montant_eur: number
  sign: 'positive' | 'negative' | 'neutral'
}

export interface StrategiePrix {
  probabilite_vente_rapide_pct: number
  delai_estime: string
  frequence_visites: string
  negociation: string
}

export interface EstimationOutput {
  fourchette_basse: number
  fourchette_haute: number
  valeur_mediane: number
  prix_m2_median: number
  prix_m2_brut_dvf: number
  nb_transactions: number
  rayon_km: number
  source: 'dvf' | 'fallback'
  confiance: number
  generated_at: string
  prix_de_base: number
  ajustements: AjustementBreakdown[]
  total_ajustement_pct: number
  total_ajustement_eur: number
  prix_calcule: number
  strategie: StrategiePrix
  points_forts: string[]
}

export async function calculerEstimation(input: EstimationInput): Promise<EstimationOutput> {
  const {
    lat, lng, surface, type_bien = 'maison', etat = 'bon_etat',
    dpe = 'D', equipements = [], delai = '3_6_mois', annee_construction,
    dpe_verifie = false, numero_dpe,
  } = input

  let mutations = await fetchDvfMutations(lat, lng, type_bien, 1500)
  let rayon = 1500
  if (mutations.length < 5) {
    mutations = await fetchDvfMutations(lat, lng, type_bien, 5000)
    rayon = 5000
  }

  const BASE_M2: Record<string, number> = { maison: 3200, appartement: 2800, terrain: 120, autre: 2500 }

  if (mutations.length < 3) {
    return build(surface, BASE_M2[type_bien] ?? 2800, etat, dpe, equipements, delai, 0, 'fallback', rayon, annee_construction, dpe_verifie, numero_dpe)
  }

  const prixM2List = mutations
    .filter((m) => m.surface_reelle_bati >= surface * 0.65 && m.surface_reelle_bati <= surface * 1.45 && m.valeur_fonciere > 0)
    .map((m) => m.valeur_fonciere / m.surface_reelle_bati)
    .filter((p) => p > 500 && p < 20000)

  if (prixM2List.length < 2) {
    return build(surface, BASE_M2[type_bien] ?? 2800, etat, dpe, equipements, delai, 0, 'fallback', rayon, annee_construction, dpe_verifie, numero_dpe)
  }
  return build(surface, median(prixM2List), etat, dpe, equipements, delai, prixM2List.length, 'dvf', rayon, annee_construction, dpe_verifie, numero_dpe)
}

function computeAjustements(
  prixDeBase: number, etat: string, dpe: string,
  equipements: string[], delai: string, anneeConstruction?: number,
): AjustementBreakdown[] {
  const list: AjustementBreakdown[] = []
  const ce = COEF_ETAT[etat] ?? 1.0
  if (ce !== 1.0) {
    const pct = ce - 1
    list.push({
      key: 'etat',
      label: 'État déclaré (' + (ETAT_LABEL[etat] ?? etat) + ')',
      pct: Math.round(pct * 1000) / 10,
      montant_eur: Math.round(prixDeBase * pct),
      sign: pct > 0 ? 'positive' : 'negative',
    })
  }
  const ca = coefAnneeConstruction(anneeConstruction)
  const caLabel = constructionLabel(anneeConstruction)
  if (ca !== 1.0 && caLabel) {
    const pct = ca - 1
    list.push({
      key: 'annee_construction',
      label: 'Âge du bâti (' + caLabel + ')',
      pct: Math.round(pct * 1000) / 10,
      montant_eur: Math.round(prixDeBase * pct),
      sign: pct > 0 ? 'positive' : 'negative',
    })
  }
  const cd = COEF_DPE[dpe] ?? 1.0
  if (cd !== 1.0 && dpe !== 'NC') {
    const pct = cd - 1
    list.push({
      key: 'dpe',
      label: 'Performance énergétique (DPE ' + dpe + ')',
      pct: Math.round(pct * 1000) / 10,
      montant_eur: Math.round(prixDeBase * pct),
      sign: pct > 0 ? 'positive' : 'negative',
    })
  }
  for (const eq of equipements ?? []) {
    const c = EQUIPEMENT_COEF[eq]
    if (c && c !== 1.0) {
      const pct = c - 1
      list.push({
        key: 'eq:' + eq,
        label: eq,
        pct: Math.round(pct * 1000) / 10,
        montant_eur: Math.round(prixDeBase * pct),
        sign: pct > 0 ? 'positive' : 'negative',
      })
    }
  }
  const cdel = coefDelai(delai)
  if (cdel !== 1.0) {
    const pct = cdel - 1
    list.push({
      key: 'delai',
      label: 'Délai souhaité',
      pct: Math.round(pct * 1000) / 10,
      montant_eur: Math.round(prixDeBase * pct),
      sign: pct > 0 ? 'positive' : 'negative',
    })
  }
  return list
}

function computeStrategie(confiance: number, delai: string): StrategiePrix {
  let p = 50
  if (confiance >= 65) p = 60
  if (confiance >= 75) p = 70
  if (confiance >= 85) p = 80
  if (delai === 'immediat') p = Math.min(95, p + 12)
  else if (delai === '1_3_mois') p = Math.min(95, p + 5)
  else if (delai === '6_mois' || delai === 'pas_decide') p = Math.max(30, p - 10)
  let delai_estime = '2-3 mois'
  if (p >= 75) delai_estime = '1-2 mois'
  else if (p < 50) delai_estime = '3-6 mois'
  let frequence_visites = 'Régulières'
  if (p >= 75) frequence_visites = 'Soutenues'
  else if (p < 50) frequence_visites = 'Espacées'
  let negociation = 'Légère'
  if (p >= 75) negociation = 'Minimale'
  else if (p < 50) negociation = 'Importante'
  return { probabilite_vente_rapide_pct: p, delai_estime, frequence_visites, negociation }
}

function computePointsForts(equipements: string[], dpe: string, anneeConstruction?: number, dpeVerifie?: boolean, numeroDpe?: string): string[] {
  const arr: string[] = []
  const eq = equipements ?? []
  if (eq.includes('Balcon')) arr.push('Balcon disponible')
  if (eq.includes('Stationnement') || eq.includes('Garage')) arr.push('Stationnement inclus')
  if (eq.includes('Piscine')) arr.push('Piscine')
  if (eq.includes('Jardin')) arr.push('Jardin')
  if (eq.includes('Terrasse')) arr.push('Terrasse')
  if (eq.includes('Vue exceptionnelle')) arr.push('Vue exceptionnelle')
  if (eq.includes('Cave')) arr.push('Cave')
  if (dpeVerifie) arr.push('DPE vérifié dans la base ADEME' + (numeroDpe ? ' (' + numeroDpe + ')' : ''))
  if (anneeConstruction && Number.isFinite(anneeConstruction)) arr.push('Année de construction documentée : ' + anneeConstruction)
  if (['A', 'B', 'C'].includes(dpe)) arr.push('Bonne performance énergétique')
  return arr
}

function build(
  surface: number, prixM2Brut: number, etat: string, dpe: string,
  equipements: string[], delai: string, nbTx: number,
  source: 'dvf' | 'fallback', rayon: number, anneeConstruction?: number,
  dpeVerifie?: boolean, numeroDpe?: string,
): EstimationOutput {
  const coef = (COEF_ETAT[etat] ?? 1.0) * coefAnneeConstruction(anneeConstruction) * (COEF_DPE[dpe] ?? 1.0) * coefEquipementsTotal(equipements) * coefDelai(delai)
  const prixM2 = prixM2Brut * coef
  const med = Math.round((prixM2 * surface) / 1000) * 1000
  let confiance = 40
  if (source === 'dvf') {
    if (nbTx >= 20) confiance = 85
    else if (nbTx >= 10) confiance = 75
    else if (nbTx >= 5) confiance = 65
    else confiance = 55
  }
  if (dpeVerifie) confiance = Math.min(95, confiance + 5)
  if (anneeConstruction && Number.isFinite(anneeConstruction)) confiance = Math.min(95, confiance + 3)
  const prix_de_base = Math.round(prixM2Brut * surface)
  const ajustements = computeAjustements(prix_de_base, etat, dpe, equipements, delai, anneeConstruction)
  const total_ajustement_eur = ajustements.reduce(function (s, a) { return s + a.montant_eur }, 0)
  const total_ajustement_pct = prix_de_base > 0
    ? Math.round((total_ajustement_eur / prix_de_base) * 1000) / 10
    : 0
  const prix_calcule = prix_de_base + total_ajustement_eur
  const strategie = computeStrategie(confiance, delai)
  const points_forts = computePointsForts(equipements, dpe, anneeConstruction, dpeVerifie, numeroDpe)
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
    prix_de_base,
    ajustements,
    total_ajustement_pct,
    total_ajustement_eur,
    prix_calcule,
    strategie,
    points_forts,
  }
}
