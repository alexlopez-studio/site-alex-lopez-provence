/**
 * POST /api/leads — Phase B v2.
 *
 * Pipeline :
 *   1. Validation basique (email, type, opt-in RGPD).
 *   2. Calcul des `results` côté serveur via `computeLeadResults` (best-effort).
 *   3. `upsertProspect` (atomique sur l'email) puis `createLead` via le repo.
 *   4. Le `id` UUID généré par Supabase devient le token magic link.
 *   5. Envoi de l'email Resend pointant vers `/resultats/[id]`.
 *   6. `markMagicLinkSent` pour l'audit trail.
 *
 * Retiré par rapport à la Phase A : signature JWT (`signMagicToken`) et push
 * Attio (`pushLeadToAttio`). Les anciens magic links Phase A restent
 * déchiffrables côté lecture (Step 4 fera le pivot complet).
 *
 * Réponse (backward-compat avec Phase A) :
 *   { success: true, token: leadId, leadId, magicLinkUrl, emailSent }
 */
import { NextRequest, NextResponse } from 'next/server'
import {
  upsertProspect,
  createLead,
  markMagicLinkSent,
  RepoError,
} from '@/lib/leads-repo'
import { sendMagicLinkEmail } from '@/lib/resend'
import {
  computeLeadResults,
  type LeadType,
} from '@/lib/leads/compute-results'

function isLeadType(value: unknown): value is LeadType {
  return value === 'vendre' || value === 'acheter' || value === 'audit'
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}
}

function extractCommune(formData: Record<string, unknown>): string | null {
  return (
    asNonEmptyString(formData.commune) ??
    asNonEmptyString(formData.ville) ??
    asNonEmptyString(formData.city) ??
    null
  )
}

function resolveSiteUrl(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL
  if (env && env.length > 0) return env.replace(/\/+$/, '')
  // Fallback : reconstruction depuis l'origin de la requête (preview Vercel).
  try {
    const origin = new URL(req.url).origin
    return origin
  } catch {
    return 'https://alexlopez-provence.fr'
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'JSON invalide' },
      { status: 400 },
    )
  }

  const payload = asRecord(body)
  const email = asNonEmptyString(payload.email)
  const rawType = payload.type ?? 'vendre'
  const prenom = asNonEmptyString(payload.prenom)
  const nom = asNonEmptyString(payload.nom)
  const telephone = asNonEmptyString(payload.telephone)
  const optIn = Boolean(payload.opt_in)
  const formData = asRecord(payload.form_data ?? payload)

  // 1. Validation
  if (!email) {
    return NextResponse.json(
      { success: false, error: 'email requis' },
      { status: 400 },
    )
  }
  if (!isLeadType(rawType)) {
    return NextResponse.json(
      { success: false, error: 'type invalide' },
      { status: 400 },
    )
  }
  if (!optIn) {
    return NextResponse.json(
      { success: false, error: 'opt-in RGPD requis' },
      { status: 400 },
    )
  }

  const tool: LeadType = rawType
  const siteUrl = resolveSiteUrl(req)

  // 2. Calcul des results (best-effort, ne bloque pas la création du lead).
  let results: Record<string, unknown> = {}
  try {
    const computed = await computeLeadResults({ type: tool, formData })
    if (computed && typeof computed === 'object') {
      results = computed as Record<string, unknown>
    }
  } catch (err) {
    console.error('[API /leads] computeLeadResults a échoué :', err)
  }

  // 3. + 4. Persistance Supabase.
  let leadId: string
  try {
    const prospect = await upsertProspect({
      email,
      firstName: prenom,
      lastName: nom,
      phone: telephone ?? null,
      rgpdConsentAt: new Date().toISOString(),
    })
    const lead = await createLead({
      prospectId: prospect.id,
      tool,
      formData,
      results,
      commune: extractCommune(formData),
    })
    leadId = lead.id
  } catch (err) {
    const detail =
      err instanceof RepoError ? err.message : (err as Error)?.message ?? 'unknown'
    console.error('[API /leads] persistance Supabase :', detail)
    return NextResponse.json(
      { success: false, error: 'persistance échouée' },
      { status: 500 },
    )
  }

  const magicLinkUrl = `${siteUrl}/resultats/${leadId}`

  // 5. Envoi du magic link.
  const emailSent = await sendMagicLinkEmail({
    to: email,
    prenom: prenom ?? null,
    token: leadId,
    type: tool,
    siteUrl,
  })

  // 6. Audit trail (best-effort).
  if (emailSent) {
    try {
      await markMagicLinkSent(leadId)
    } catch (err) {
      console.error('[API /leads] markMagicLinkSent :', err)
    }
  }

  return NextResponse.json({
    success: true,
    /** Backward-compat avec la Phase A : le front utilise `token` pour le redirect. */
    token: leadId,
    leadId,
    magicLinkUrl,
    emailSent,
  })
}
