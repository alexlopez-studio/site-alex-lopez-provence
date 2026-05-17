/**
 * POST /api/leads — mode estimation autonome.
 *
 * Priorité actuelle : l'outil d'estimation ne doit plus dépendre de Supabase.
 * La route calcule donc les résultats, renvoie un token utilisable côté front,
 * envoie le magic link en best-effort et sauvegarde une copie Notion si les
 * variables Notion sont configurées.
 */
import { NextRequest, NextResponse } from 'next/server'
import { sendMagicLinkEmail } from '@/lib/resend'
import {
  computeLeadResults,
  type LeadType,
} from '@/lib/leads/compute-results'
import { saveEstimationToNotion } from '@/lib/notion-estimations'

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

function resolveSiteUrl(req: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL
  if (env && env.length > 0) return env.replace(/\/+$/, '')
  try {
    return new URL(req.url).origin
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
  const dryRun = Boolean(payload.dry_run)
  const formData = asRecord(payload.form_data ?? payload)

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
  const token = asNonEmptyString(payload.token) ?? crypto.randomUUID()
  const siteUrl = resolveSiteUrl(req)

  let results: Record<string, unknown> = {}
  try {
    const computed = await computeLeadResults({ type: tool, formData })
    if (computed && typeof computed === 'object') {
      results = computed as Record<string, unknown>
    }
  } catch (err) {
    console.error('[API /leads] computeLeadResults a échoué :', err)
    return NextResponse.json(
      { success: false, error: 'calcul estimation échoué' },
      { status: 500 },
    )
  }

  const magicLinkUrl = `${siteUrl}/resultats/${token}`

  if (dryRun) {
    return NextResponse.json({
      success: true,
      dryRun: true,
      token,
      leadId: token,
      magicLinkUrl,
      emailSent: false,
      notionBackup: { ok: false, skipped: true, reason: 'dry_run' },
      results,
    })
  }

  const [emailSent, notionBackup] = await Promise.all([
    sendMagicLinkEmail({
      to: email,
      prenom: prenom ?? null,
      token,
      type: tool,
      siteUrl,
    }),
    saveEstimationToNotion({
      token,
      type: tool,
      email,
      prenom,
      nom,
      telephone,
      formData,
      results,
      magicLinkUrl,
    }),
  ])

  if (!notionBackup.ok && !notionBackup.skipped) {
    console.error('[API /leads] sauvegarde Notion échouée :', notionBackup.error)
  }

  return NextResponse.json({
    success: true,
    token,
    leadId: token,
    magicLinkUrl,
    emailSent,
    notionBackup,
    results,
  })
}
