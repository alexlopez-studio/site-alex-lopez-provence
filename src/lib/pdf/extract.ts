import type { MagicTokenPayload } from '../magic-token'
import type { LeadWithProspect } from '../leads-repo'
import type { EstimationOutput } from '../estimation'
import type { AuditOutput } from '../audit'

/**
 * Donnees consommees par EstimationPDFDocument.
 * Phase A : extraites du payload JWT magic link.
 * Phase B : extraites depuis la ligne `leads` jointe au prospect.
 */
export type EstimationPdfData = {
  prenom: string | null
  surface: number
  type_bien: string
  ville: string | null
  estimation: EstimationOutput
}

/**
 * Donnees consommees par AuditPDFDocument.
 */
export type AuditPdfData = {
  prenom: string | null
  objectif: string | null
  audit: AuditOutput
}

function readString(
  obj: Record<string, unknown>,
  key: string,
): string | null {
  const v = obj[key]
  if (typeof v !== 'string') return null
  const trimmed = v.trim()
  return trimmed.length === 0 ? null : trimmed
}

function readNumber(obj: Record<string, unknown>, key: string): number {
  const v = obj[key]
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string') {
    const n = Number(v)
    if (Number.isFinite(n)) return n
  }
  return 0
}

// ---------------------------------------------------------------------------
// Phase A extractors (kept for safety, removed at Step 12 cleanup)
// ---------------------------------------------------------------------------

export function extractEstimationPdfData(
  payload: MagicTokenPayload,
): EstimationPdfData {
  if (payload.type !== 'vendre') {
    throw new Error(
      `extractEstimationPdfData expects type=vendre, got ${payload.type}`,
    )
  }
  const fd = payload.formData ?? {}
  return {
    prenom: readString(fd, 'prenom'),
    surface: readNumber(fd, 'surface'),
    type_bien: readString(fd, 'type_bien') ?? 'maison',
    ville: readString(fd, 'ville'),
    estimation: payload.results as unknown as EstimationOutput,
  }
}

export function extractAuditPdfData(
  payload: MagicTokenPayload,
): AuditPdfData {
  if (payload.type !== 'audit') {
    throw new Error(
      `extractAuditPdfData expects type=audit, got ${payload.type}`,
    )
  }
  const fd = payload.formData ?? {}
  return {
    prenom: readString(fd, 'prenom'),
    objectif: readString(fd, 'objectif'),
    audit: payload.results as unknown as AuditOutput,
  }
}

// ---------------------------------------------------------------------------
// Phase B extractors (used by /api/pdf v2 in Step 4+)
// ---------------------------------------------------------------------------

export function extractEstimationPdfDataFromLead(
  lead: LeadWithProspect,
): EstimationPdfData {
  if (lead.tool !== 'vendre') {
    throw new Error(
      `extractEstimationPdfDataFromLead expects tool=vendre, got ${lead.tool}`,
    )
  }
  const fd = (lead.form_data ?? {}) as Record<string, unknown>
  const prenomFromProspect =
    (lead.prospect?.first_name ?? '').trim() || null
  return {
    prenom: prenomFromProspect ?? readString(fd, 'prenom'),
    surface: readNumber(fd, 'surface'),
    type_bien: readString(fd, 'type_bien') ?? 'maison',
    ville: readString(fd, 'ville') ?? lead.commune,
    estimation: (lead.results ?? {}) as unknown as EstimationOutput,
  }
}

export function extractAuditPdfDataFromLead(
  lead: LeadWithProspect,
): AuditPdfData {
  if (lead.tool !== 'audit') {
    throw new Error(
      `extractAuditPdfDataFromLead expects tool=audit, got ${lead.tool}`,
    )
  }
  const fd = (lead.form_data ?? {}) as Record<string, unknown>
  const prenomFromProspect =
    (lead.prospect?.first_name ?? '').trim() || null
  return {
    prenom: prenomFromProspect ?? readString(fd, 'prenom'),
    objectif: readString(fd, 'objectif'),
    audit: (lead.results ?? {}) as unknown as AuditOutput,
  }
}
