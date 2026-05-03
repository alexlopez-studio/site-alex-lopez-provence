/**
 * Création de lead — Phase A (magic link JWT, calcul serveur).
 *
 * 1. Calcul des results côté serveur (computeLeadResults).
 * 2. Signature d'un magic-token JWT (signMagicToken, HS256, 30j).
 * 3. Persistance Supabase + push Attio (env-guardés, supprimés en Phase B).
 * 4. Envoi du magic link Resend avec le JWT en URL.
 */
import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { pushLeadToAttio } from '@/lib/attio'
import { sendMagicLinkEmail } from '@/lib/resend'
import { signMagicToken, MagicTokenError } from '@/lib/magic-token'
import { computeLeadResults, type LeadType } from '@/lib/leads/compute-results'

function isLeadType(v: unknown): v is LeadType {
  return v === 'vendre' || v === 'acheter' || v === 'audit'
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      prenom,
      nom,
      email,
      telephone,
      type: rawType = 'vendre',
      form_data,
      opt_in = false,
    } = body ?? {}

    if (!email) {
      return NextResponse.json({ error: 'email requis' }, { status: 400 })
    }
    if (!isLeadType(rawType)) {
      return NextResponse.json({ error: 'type invalide' }, { status: 400 })
    }

    const type: LeadType = rawType
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alexlopez-provence.fr'
    const jti = randomUUID()
    const formData =
      (form_data ?? body) as Record<string, unknown>

    // 1. Calcul serveur des results (DVF / scoring audit / passthrough acheter).
    let results: Record<string, unknown> = {}
    try {
      results = await computeLeadResults({ type, formData })
    } catch (err) {
      console.error('[API /leads] computeLeadResults a échoué :', err)
      // On continue sans bloquer le prospect : email envoyé quand même.
      results = {}
    }

    // 2. Signature JWT magic-token (Phase A : payload stateless).
    let magicToken: string | null = null
    try {
      magicToken = signMagicToken({ jti, type, formData, results })
    } catch (err) {
      if (err instanceof MagicTokenError && err.code === 'missing_secret') {
        console.error(
          '[API /leads] MAGIC_LINK_JWT_SECRET manquant — fallback UUID.',
        )
      } else {
        console.error('[API /leads] signMagicToken a échoué :', err)
      }
    }

    // En l'absence de JWT (env mal configuré), on retombe sur le jti UUID :
    // l'émail garde un lien valide vers la page legacy (localStorage).
    const tokenForUrl = magicToken ?? jti
    const magicLinkUrl = `${siteUrl}/resultats/${tokenForUrl}`

    // 3. Supabase (legacy, env-guardé — sera supprimé en Phase B).
    let attioRecordId: string | null = null
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      // NOTE: `as never` pattern jusqu'à ce que le générique `Database` soit
      // câblé dans createClient(). Cf. commit 419cf28 (resend-magic-link).
      const { error } = await supabaseAdmin
        .from('leads')
        .insert({
          type,
          prenom: prenom ?? null,
          nom: nom ?? null,
          email,
          telephone: telephone ?? null,
          form_data: formData,
          results,
          token: jti,
          opt_in: Boolean(opt_in),
          opt_in_date: opt_in ? new Date().toISOString() : null,
        } as never)

      if (error) console.error('[API /leads] Supabase :', error)

      // 3b. Attio (legacy, sera supprimé en Phase B).
      attioRecordId = await pushLeadToAttio({
        prenom: prenom ?? null,
        nom: nom ?? null,
        email,
        telephone: telephone ?? null,
        type,
        token: jti,
        siteUrl,
      })
      if (attioRecordId) {
        await supabaseAdmin
          .from('leads')
          .update({ attio_record_id: attioRecordId } as never)
          .eq('token', jti)
      }
    }

    // 4. Magic link (URL = JWT si signature OK, sinon jti UUID en fallback).
    await sendMagicLinkEmail({
      to: email,
      prenom: prenom ?? null,
      token: tokenForUrl,
      type,
      siteUrl,
    })

    return NextResponse.json({
      success: true,
      token: tokenForUrl,
      jti,
      magicLinkUrl,
    })
  } catch (e) {
    console.error('[API /leads]', e)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
