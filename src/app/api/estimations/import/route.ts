import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { estimationImportSchema } from '@/lib/schemas/estimation-import'
import type { Database, Json } from '@/types/supabase'

type OpportunityRow = Database['public']['Tables']['opportunities']['Row']

/**
 * POST /api/estimations/import
 *
 * Reçoit les pré-estimations / estimations produites par la Skill Claude
 * externe (claude.ai) et les enregistre dans Supabase de façon obligatoire :
 * toute erreur d'écriture fait échouer la requête (pas de mode best-effort).
 *
 * Protégé par un secret partagé : la variable d'env ESTIMATION_IMPORT_API_KEY,
 * envoyée en `Authorization: Bearer <secret>`.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.ESTIMATION_IMPORT_API_KEY
  if (!secret) {
    return NextResponse.json({ error: 'Import désactivé' }, { status: 404 })
  }

  const authHeader = req.headers.get('authorization') ?? ''
  const bearerToken = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : ''
  if (bearerToken !== secret) {
    return NextResponse.json({ error: 'Secret invalide' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps de requête JSON invalide' }, { status: 400 })
  }

  const parsed = estimationImportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation échouée', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const input = parsed.data
  const contactName = input.contact?.name?.trim() || null
  const contactEmail = input.contact?.email?.trim().toLowerCase() || null
  const contactPhone = input.contact?.phone?.trim() || null
  const propertyAddress = input.property?.address?.trim() || null
  const propertyCity = input.property?.city?.trim() || null

  try {
    let opportunity: OpportunityRow | null = null

    if (contactEmail || contactPhone) {
      let query = supabaseAdmin
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (contactEmail && contactPhone) {
        query = query.or(`seller_email.ilike.${contactEmail},seller_phone.ilike.${contactPhone}`)
      } else if (contactEmail) {
        query = query.ilike('seller_email', contactEmail)
      } else if (contactPhone) {
        query = query.ilike('seller_phone', contactPhone as string)
      }

      const { data, error } = await query
      if (error) throw error
      opportunity = (data?.[0] as OpportunityRow | undefined) ?? null
    }

    let opportunityCreated = false

    if (!opportunity && (contactName || contactEmail || contactPhone || propertyAddress)) {
      const title = [contactName, propertyCity].filter(Boolean).join(' - ') || 'Estimation Skill Claude'
      const stage = input.kind === 'pre_estimation' ? 'Pré-estimation' : "Remise de l'estimation"

      const { data: created, error: createError } = await supabaseAdmin
        .from('opportunities')
        .insert({
          title,
          description: '',
          stage,
          signal_type: 'manual',
          created_from: 'estimation_import',
          seller_name: contactName,
          seller_phone: contactPhone,
          seller_email: contactEmail,
          source_channel: 'estimation_skill',
          property_address: propertyAddress,
          property_city: propertyCity,
          property_type: input.property?.type ?? null,
          property_surface: input.property?.surface ?? null,
          estimated_price_min: input.result?.price_low ?? null,
          estimated_price_max: input.result?.price_high ?? null,
        } as never)
        .select('*')
        .single()

      if (createError) throw createError
      opportunity = created as OpportunityRow
      opportunityCreated = true
    }

    const { data: importRow, error: importError } = await supabaseAdmin
      .from('estimation_imports')
      .insert({
        opportunity_id: opportunity?.id ?? null,
        kind: input.kind,
        source: 'claude_skill',
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        property_address: propertyAddress,
        property_city: propertyCity,
        property_type: input.property?.type ?? null,
        property_surface: input.property?.surface ?? null,
        price_low: input.result?.price_low ?? null,
        price_high: input.result?.price_high ?? null,
        price_m2: input.result?.price_m2 ?? null,
        confidence: input.result?.confidence ?? null,
        summary: input.result?.summary ?? null,
        payload: input.raw as Json,
        raw_filename: input.raw_filename ?? null,
        raw_format: input.raw_format ?? null,
      } as never)
      .select('*')
      .single()

    if (importError) throw importError

    if (opportunity) {
      const label = input.kind === 'pre_estimation' ? 'Pré-estimation importée (Skill Claude)' : 'Estimation importée (Skill Claude)'
      const { error: eventError } = await supabaseAdmin.from('opportunity_events').insert({
        opportunity_id: opportunity.id,
        type: 'estimation',
        title: label,
        content: input.result?.summary ?? null,
        metadata: {
          estimation_import_id: (importRow as { id: string }).id,
          price_low: input.result?.price_low ?? null,
          price_high: input.result?.price_high ?? null,
          opportunity_created: opportunityCreated,
        },
        created_by: 'estimation_import',
      } as never)
      if (eventError) throw eventError
    }

    return NextResponse.json({
      success: true,
      id: (importRow as { id: string }).id,
      opportunity_id: opportunity?.id ?? null,
      opportunity_created: opportunityCreated,
    })
  } catch (error) {
    console.error('[API POST /estimations/import]', error)
    return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
  }
}
