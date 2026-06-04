/**
 * POST /api/leads — mode estimation autonome.
 *
 * Priorité actuelle : l'outil d'estimation ne doit plus dépendre de Supabase.
 * La route calcule donc les résultats, renvoie un token utilisable côté front,
 * envoie le magic link en best-effort, sauvegarde une copie Notion si les
 * variables Notion sont configurées et synchronise Attio si le CRM est configuré.
 */
import { NextRequest, NextResponse } from 'next/server'
import { sendMagicLinkEmail } from '@/lib/resend'
import {
  computeLeadResults,
  type LeadType,
} from '@/lib/leads/compute-results'
import { saveEstimationToNotion } from '@/lib/notion-estimations'
import { syncLeadToAttio } from '@/lib/attio'
import { logServerConversionEvent } from '@/lib/server-analytics'
import { supabaseAdmin } from '@/lib/supabase'
import { runMatchingForBuyer } from '@/lib/market/matching-engine'

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
    logServerConversionEvent('lead_submit_error', {
      lead_type: tool,
      error_step: 'compute_results',
    })
    return NextResponse.json(
      { success: false, error: 'calcul estimation échoué' },
      { status: 500 },
    )
  }

  const magicLinkUrl = `${siteUrl}/resultats/${token}`

  // ── Matching : stocker les critères acheteur/vendeur ────────
  if (tool === 'acheter') {
    const buyerData = {
      lead_id: token,
      type_bien: typeof formData.type_bien === 'string' ? formData.type_bien : null,
      communes: Array.isArray(formData.communes) ? formData.communes
        : typeof formData.communes === 'string' ? formData.communes.split(',').map((s: string) => s.trim())
        : null,
      budget_max: typeof formData.budget_max === 'number' ? formData.budget_max : null,
      surface_min: typeof formData.surface_min === 'number' ? formData.surface_min : null,
      pieces_min: typeof formData.nb_pieces_min === 'number' ? formData.nb_pieces_min : null,
      criteres: Array.isArray(formData.criteres) ? formData.criteres : null,
    }

    const { error: bcError } = await supabaseAdmin
      .from('buyer_criteria')
      .upsert(buyerData, { onConflict: 'lead_id', ignoreDuplicates: false })

    if (bcError) {
      console.error('[API /leads] Erreur sauvegarde buyer_criteria:', bcError)
    } else {
      // Lancer le matching en arrière-plan (non bloquant)
      runMatchingForBuyer(buyerData).catch((err) =>
        console.error('[API /leads] Erreur matching acheteur:', err)
      )
    }
  }

  if (tool === 'vendre') {
    const sellerData = {
      lead_id: token,
      adresse: typeof formData.adresse === 'string' ? formData.adresse : null,
      lat: typeof formData.lat === 'number' ? formData.lat : null,
      lon: typeof formData.lng === 'number' ? formData.lng : null,
      type_bien: typeof formData.type_bien === 'string' ? formData.type_bien : null,
      sous_type: typeof formData.sous_type === 'string' ? formData.sous_type : null,
      surface: typeof formData.surface === 'number' ? formData.surface : null,
      surface_terrain: typeof formData.surface_terrain === 'number' ? formData.surface_terrain : null,
      nb_pieces: typeof formData.nb_pieces === 'number' ? formData.nb_pieces : null,
      etat: typeof formData.etat === 'string' ? formData.etat : null,
      dpe: typeof formData.dpe === 'string' ? formData.dpe : null,
      annee_construction: typeof formData.annee_construction === 'number' ? formData.annee_construction : null,
      equipements: Array.isArray(formData.equipements) ? formData.equipements : null,
      delai: typeof formData.delai === 'string' ? formData.delai : null,
    }

    const { error: spError } = await supabaseAdmin
      .from('seller_properties')
      .upsert(sellerData, { onConflict: 'lead_id', ignoreDuplicates: false })

    if (spError) {
      console.error('[API /leads] Erreur sauvegarde seller_properties:', spError)
    }
  }

  if (dryRun) {
    return NextResponse.json({
      success: true,
      dryRun: true,
      token,
      leadId: token,
      magicLinkUrl,
      emailSent: false,
      notionBackup: { ok: false, skipped: true, reason: 'dry_run' },
      attioSync: { ok: false, skipped: true, reason: 'dry_run' },
      results,
    })
  }

  const [emailSent, notionBackup, attioSync] = await Promise.all([
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
    syncLeadToAttio({
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

  if (!attioSync.ok && !attioSync.skipped) {
    console.error('[API /leads] synchronisation Attio échouée :', attioSync.error)
  }

  logServerConversionEvent('lead_submit', {
    lead_type: tool,
    email_sent: Boolean(emailSent),
    notion_backup_ok: Boolean(notionBackup.ok),
    notion_backup_skipped: Boolean(notionBackup.skipped),
    attio_sync_ok: Boolean(attioSync.ok),
    attio_sync_skipped: Boolean(attioSync.skipped),
  })

  return NextResponse.json({
    success: true,
    token,
    leadId: token,
    magicLinkUrl,
    emailSent,
    notionBackup,
    attioSync,
    results,
  })
}
