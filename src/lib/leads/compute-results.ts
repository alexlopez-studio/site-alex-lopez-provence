import {
  calculerEstimation as defaultEstimator,
  type EstimationInput,
  type EstimationOutput,
} from '../estimation'
import {
  calculerAudit as defaultAuditor,
  type AuditInput,
  type AuditOutput,
} from '../audit'

/**
 * Type d'outil prospect à l'origine du dossier.
 * Doit rester aligné avec MagicLeadType (cf. lib/magic-token.ts).
 */
export type LeadType = 'vendre' | 'acheter' | 'audit'

export type ComputeLeadResultsInput = {
  type: LeadType
  /** Snapshot du formulaire prospect (peut être null/undefined). */
  formData: Record<string, unknown> | null | undefined
}

/**
 * Résultats calculés côté serveur, prêts à être embarqués tels quels dans
 * le payload JWT du magic link. Tout doit être sérialisable JSON.
 */
export type LeadResults = Record<string, unknown>

export type ComputeLeadResultsDeps = {
  estimator?: (input: EstimationInput) => Promise<EstimationOutput>
  auditor?: (input: AuditInput) => AuditOutput
}

/**
 * Calcule les `results` à signer dans le magic-token, en réutilisant les
 * helpers existants :
 * - `vendre` → {@link calculerEstimation} (DVF + ajustements)
 * - `audit`  → {@link calculerAudit} (scoring déterministe)
 * - `acheter` → objet vide (le rendu /resultats utilise directement formData)
 *
 * Phase A : pure dispatch sans I/O Supabase ni Attio. L'injection de
 * dépendances permet des tests déterministes (sans appel DVF réseau).
 */
export async function computeLeadResults(
  { type, formData }: ComputeLeadResultsInput,
  {
    estimator = defaultEstimator,
    auditor = defaultAuditor,
  }: ComputeLeadResultsDeps = {},
): Promise<LeadResults> {
  const data = (formData ?? {}) as Record<string, unknown>

  if (type === 'vendre') {
    const lat = num(data.lat)
    const lng = num(data.lng)
    const surface = num(data.surface)
    if (lat === undefined || lng === undefined || surface === undefined) {
      throw new Error(
        'compute-results vendre : lat, lng, surface requis dans formData.',
      )
    }
    const output = await estimator({
      lat,
      lng,
      surface,
      type_bien: str(data.type_bien),
      etat: str(data.etat),
      dpe: str(data.dpe),
      equipements: arr(data.equipements),
      delai: str(data.delai),
    })
    return { ...output } as LeadResults
  }

  if (type === 'audit') {
    const output = auditor({
      etat_toiture: str(data.etat_toiture),
      etat_facade: str(data.etat_facade),
      etat_menuiseries: str(data.etat_menuiseries),
      etat_plomberie: str(data.etat_plomberie),
      etat_electricite: str(data.etat_electricite),
      humidite: bool(data.humidite),
      isolation_murs: str(data.isolation_murs),
      isolation_combles: str(data.isolation_combles),
      isolation_fenetres: str(data.isolation_fenetres),
      type_chauffage: str(data.type_chauffage),
      age_chauffage: num(data.age_chauffage),
      dpe: str(data.dpe),
      objectif: str(data.objectif),
    })
    return { ...output } as LeadResults
  }

  // acheter : le front affiche directement formData, pas de calcul backend.
  return {}
}

function num(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v)
    if (Number.isFinite(n)) return n
  }
  return undefined
}

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined
}

function bool(v: unknown): boolean | undefined {
  return typeof v === 'boolean' ? v : undefined
}

function arr(v: unknown): string[] | undefined {
  if (!Array.isArray(v)) return undefined
  const onlyStrings = v.filter((x): x is string => typeof x === 'string')
  return onlyStrings.length > 0 ? onlyStrings : undefined
}
