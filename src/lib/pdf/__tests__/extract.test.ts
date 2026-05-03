import { describe, it, expect } from 'vitest'
import { extractEstimationPdfData, extractAuditPdfData } from '../extract'
import type { MagicTokenPayload } from '../../magic-token'

const baseEstimationResults = {
  fourchette_basse: 250000,
  fourchette_haute: 320000,
  valeur_mediane: 285000,
  prix_m2_median: 3200,
  prix_m2_brut_dvf: 3000,
  nb_transactions: 12,
  rayon_km: 1.5,
  source: 'dvf' as const,
  confiance: 75,
  generated_at: '2026-05-03T10:00:00Z',
  prix_de_base: 270000,
  ajustements: [],
  total_ajustement_pct: 5.5,
  total_ajustement_eur: 15000,
  prix_calcule: 285000,
  strategie: {
    probabilite_vente_rapide_pct: 70,
    delai_estime: '1-2 mois',
    frequence_visites: 'Soutenues',
    negociation: 'Minimale',
  },
  points_forts: [],
}

const baseAuditResults = {
  score_global: 65,
  score_structure: 70,
  score_energie: 60,
  score_confort: 65,
  points_forts: [],
  points_attention: [],
  recommandations: [],
  generated_at: '2026-05-03T10:00:00Z',
}

function makeVendrePayload(
  formData: Record<string, unknown> = {},
): MagicTokenPayload {
  return {
    jti: 'abc12345',
    type: 'vendre',
    formData,
    results: baseEstimationResults as unknown as Record<string, unknown>,
    iat: 0,
    exp: 9999999999,
  }
}

function makeAuditPayload(
  formData: Record<string, unknown> = {},
): MagicTokenPayload {
  return {
    jti: 'abc12345',
    type: 'audit',
    formData,
    results: baseAuditResults as unknown as Record<string, unknown>,
    iat: 0,
    exp: 9999999999,
  }
}

describe('extractEstimationPdfData', () => {
  it('extrait les champs canoniques', () => {
    const out = extractEstimationPdfData(
      makeVendrePayload({
        prenom: 'Marie',
        surface: 90,
        type_bien: 'appartement',
        ville: 'Brignoles',
      }),
    )
    expect(out.prenom).toBe('Marie')
    expect(out.surface).toBe(90)
    expect(out.type_bien).toBe('appartement')
    expect(out.ville).toBe('Brignoles')
    expect(out.estimation.valeur_mediane).toBe(285000)
  })

  it('retombe sur maison quand type_bien manque', () => {
    const out = extractEstimationPdfData(makeVendrePayload({ surface: 100 }))
    expect(out.type_bien).toBe('maison')
  })

  it('renvoie null prenom quand absent ou whitespace', () => {
    expect(extractEstimationPdfData(makeVendrePayload({})).prenom).toBeNull()
    expect(
      extractEstimationPdfData(makeVendrePayload({ prenom: '   ' })).prenom,
    ).toBeNull()
  })

  it('coerce surface stringifiee en number', () => {
    const out = extractEstimationPdfData(
      makeVendrePayload({ surface: '120' }),
    )
    expect(out.surface).toBe(120)
  })

  it('renvoie 0 pour surface absente', () => {
    expect(extractEstimationPdfData(makeVendrePayload({})).surface).toBe(0)
  })

  it('throw quand type non vendre', () => {
    expect(() => extractEstimationPdfData(makeAuditPayload())).toThrow(
      /expects type=vendre/,
    )
  })
})

describe('extractAuditPdfData', () => {
  it('extrait prenom, objectif et audit', () => {
    const out = extractAuditPdfData(
      makeAuditPayload({ prenom: 'Paul', objectif: 'vente' }),
    )
    expect(out.prenom).toBe('Paul')
    expect(out.objectif).toBe('vente')
    expect(out.audit.score_global).toBe(65)
  })

  it('renvoie null objectif quand absent', () => {
    expect(extractAuditPdfData(makeAuditPayload({})).objectif).toBeNull()
  })

  it('throw pour type non audit', () => {
    expect(() => extractAuditPdfData(makeVendrePayload())).toThrow(
      /expects type=audit/,
    )
  })
})
