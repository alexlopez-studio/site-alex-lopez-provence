import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type OpportunitiesUpdate = Database['public']['Tables']['opportunities']['Update']

/**
 * GET /api/market/opportunities/[id]
 * Détail d'une opportunité.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const { data: opportunity, error } = await supabaseAdmin
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Opportunité introuvable' }, { status: 404 })
      }
      console.error('[API /market/opportunities/[id]] GET error:', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    return NextResponse.json({ opportunity })
  } catch (e) {
    console.error('[API /market/opportunities/[id]] GET', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * PATCH /api/market/opportunities/[id]
 * Met à jour une opportunité (stage, priorité, notes, etc.).
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await req.json()

    // Vérifier que l'opportunité existe
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('opportunities')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Opportunité introuvable' }, { status: 404 })
    }

    const updateData: OpportunitiesUpdate = {}
    if (body.market_property_id !== undefined) updateData.market_property_id = body.market_property_id
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.stage !== undefined) updateData.stage = body.stage
    if (body.priority !== undefined) updateData.priority = body.priority
    if (body.signal_type !== undefined) updateData.signal_type = body.signal_type
    if (body.next_action !== undefined) updateData.next_action = body.next_action
    if (body.due_date !== undefined) updateData.due_date = body.due_date
    if (body.note !== undefined) updateData.note = body.note

    const { data: opportunity, error } = await supabaseAdmin
      .from('opportunities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[API /market/opportunities/[id]] PATCH error:', error)
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
    }

    return NextResponse.json({ opportunity })
  } catch (e) {
    console.error('[API /market/opportunities/[id]] PATCH', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * DELETE /api/market/opportunities/[id]
 * Supprime une opportunité.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('opportunities')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Opportunité introuvable' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('opportunities')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[API /market/opportunities/[id]] DELETE error:', error)
      return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[API /market/opportunities/[id]] DELETE', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}