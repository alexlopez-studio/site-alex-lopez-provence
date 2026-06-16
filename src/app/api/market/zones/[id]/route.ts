import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { Database } from '@/types/supabase'

type ZonesUpdate = Database['public']['Tables']['monitored_zones']['Update']

/**
 * GET /api/market/zones/[id]
 * Détail d'une zone surveillée.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const { data: zone, error } = await supabaseAdmin
      .from('monitored_zones')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Zone introuvable' }, { status: 404 })
      }
      console.error('[API /market/zones/[id]] GET error:', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    return NextResponse.json({ zone })
  } catch (e) {
    console.error('[API /market/zones/[id]] GET', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * PATCH /api/market/zones/[id]
 * Met à jour une zone surveillée.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await req.json()

    // Vérifier que la zone existe
    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('monitored_zones')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Zone introuvable' }, { status: 404 })
    }

    const updateData: ZonesUpdate = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.zipcode !== undefined) updateData.zipcode = body.zipcode
    if (body.city !== undefined) updateData.city = body.city
    if (body.radius_km !== undefined) updateData.radius_km = body.radius_km
    if (body.active !== undefined) updateData.active = Boolean(body.active)
    if (body.sync_frequency !== undefined) updateData.sync_frequency = body.sync_frequency

    const { data: zone, error } = await supabaseAdmin
      .from('monitored_zones')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[API /market/zones/[id]] PATCH error:', error)
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
    }

    return NextResponse.json({ zone })
  } catch (e) {
    console.error('[API /market/zones/[id]] PATCH', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * DELETE /api/market/zones/[id]
 * Supprime une zone surveillée.
 */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const { data: existing, error: fetchError } = await supabaseAdmin
      .from('monitored_zones')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Zone introuvable' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('monitored_zones')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[API /market/zones/[id]] DELETE error:', error)
      return NextResponse.json({ error: 'Erreur suppression' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[API /market/zones/[id]] DELETE', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}