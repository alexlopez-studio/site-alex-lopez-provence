import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/market/opportunities
 * Liste les opportunités.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const stage = searchParams.get('stage')
    const priority = searchParams.get('priority')
    const signalType = searchParams.get('signal_type')
    const sort = searchParams.get('sort') ?? 'created_at.desc'
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 50))
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('opportunities')
      .select('*', { count: 'exact' })

    // Filtres
    if (stage) query = query.eq('stage', stage)
    if (priority) query = query.eq('priority', priority)
    if (signalType) query = query.eq('signal_type', signalType)

    // Tri
    const [sortField, sortDir] = sort.split('.')
    const validSortFields = ['stage', 'priority', 'due_date', 'created_at', 'updated_at']
    if (validSortFields.includes(sortField)) {
      query = query.order(sortField, { ascending: sortDir === 'asc' })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data: opportunities, count, error } = await query

    if (error) {
      console.error('[API /market/opportunities] GET error:', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    // Enrichissement : on attache le bien lié (titre/ville/prix) sans dépendre d'une
    // relation PostgREST — une seule requête groupée sur les market_property_id présents.
    const rows = opportunities ?? []
    const propertyIds = [...new Set(
      rows.map((o) => o.market_property_id).filter((id): id is string => Boolean(id)),
    )]

    const propertyMap: Record<string, { id: string; title: string | null; city: string | null; zipcode: string | null; price: number | null }> = {}
    if (propertyIds.length > 0) {
      const { data: properties } = await supabaseAdmin
        .from('market_properties')
        .select('id, title, city, zipcode, price')
        .in('id', propertyIds)
      for (const p of properties ?? []) {
        propertyMap[p.id as string] = {
          id: p.id as string,
          title: (p.title as string | null) ?? null,
          city: (p.city as string | null) ?? null,
          zipcode: (p.zipcode as string | null) ?? null,
          price: (p.price as number | null) ?? null,
        }
      }
    }

    const enriched = rows.map((o) => ({
      ...o,
      property: o.market_property_id ? propertyMap[o.market_property_id] ?? null : null,
    }))

    return NextResponse.json({
      opportunities: enriched,
      total: count ?? 0,
      page,
      limit,
    })
  } catch (e) {
    console.error('[API /market/opportunities] GET', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * POST /api/market/opportunities
 * Crée une nouvelle opportunité.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validation minimale
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json({ error: 'title requis (string non vide)' }, { status: 400 })
    }

    const { data: opportunity, error } = await supabaseAdmin
      .from('opportunities')
      .insert({
        market_property_id: body.market_property_id ?? null,
        title: body.title.trim(),
        description: body.description ?? '',
        stage: body.stage ?? 'À qualifier',
        priority: body.priority ?? 'medium',
        signal_type: body.signal_type ?? null,
        next_action: body.next_action ?? null,
        due_date: body.due_date ?? null,
        note: body.note ?? null,
        created_from: body.created_from ?? 'manual',
      })
      .select()
      .single()

    if (error) {
      console.error('[API /market/opportunities] POST error:', error)
      return NextResponse.json({ error: 'Erreur création opportunité' }, { status: 500 })
    }

    return NextResponse.json({ opportunity }, { status: 201 })
  } catch (e) {
    console.error('[API /market/opportunities] POST', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}