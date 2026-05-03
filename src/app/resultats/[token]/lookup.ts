/**
 * Lookup côté lecture pour /resultats/[token] et /api/pdf.
 *
 * Retourne un état discriminé décrivant ce qu'il faut afficher au prospect.
 * Pas de side-effects autres que la requête DB et un log d'erreur.
 */
import { getLeadById, type LeadWithProspect } from '@/lib/leads-repo'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type LookupState =
  | { kind: 'ok'; lead: LeadWithProspect }
  | { kind: 'expired' }
  | { kind: 'not-found' }
  | { kind: 'invalid-format' }
  | { kind: 'error' }

export function isUuidToken(token: string): boolean {
  return UUID_RE.test(token)
}

export async function lookupLead(token: string): Promise<LookupState> {
  if (!isUuidToken(token)) {
    return { kind: 'invalid-format' }
  }

  let lead: LeadWithProspect | null
  try {
    lead = await getLeadById(token)
  } catch (err) {
    console.error('[lookupLead] getLeadById a échoué :', err)
    return { kind: 'error' }
  }

  if (!lead) {
    return { kind: 'not-found' }
  }

  const expiresMs = new Date(lead.magic_link_expires_at).getTime()
  if (Number.isFinite(expiresMs) && expiresMs < Date.now()) {
    return { kind: 'expired' }
  }

  return { kind: 'ok', lead }
}
