/**
 * GET /api/market/buyers/[id] — Détail d'un acheteur
 * PUT /api/market/buyers/[id] — Modifier un acheteur
 * DELETE /api/market/buyers/[id] — Soft-delete (désactiver) un acheteur
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: buyer, error } = await supabaseAdmin
      .from('buyer_criteria')
      .select('*')
      .eq('lead_id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Acheteur non trouvé' }, { status: 404 })
      }
      console.error('[API /market/buyers/[id]] GET error:', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    return NextResponse.json({ buyer })
  } catch (e) {
    console.error('[API /market/buyers/[id]] GET exception:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const { type_bien, communes, budget_max, surface_min, pieces_min, criteres, active } = body

    const updateData: {
      type_bien?: string | null
      communes?: string[] | null
      budget_max?: number | null
      surface_min?: number | null
      pieces_min?: number | null
      criteres?: string[] | null
      active?: boolean
    } = {}

    if (type_bien !== undefined) updateData.type_bien = type_bien
    if (communes !== undefined) updateData.communes = communes
    if (budget_max !== undefined) updateData.budget_max = budget_max
    if (surface_min !== undefined) updateData.surface_min = surface_min
    if (pieces_min !== undefined) updateData.pieces_min = pieces_min
    if (criteres !== undefined) updateData.criteres = criteres
    if (active !== undefined) updateData.active = active

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('buyer_criteria')
      .update(updateData)
      .eq('lead_id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Acheteur non trouvé' }, { status: 404 })
      }
      console.error('[API /market/buyers/[id]] PUT error:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
    }

    return NextResponse.json({ buyer: data, success: true })
  } catch (e) {
    console.error('[API /market/buyers/[id]] PUT exception:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Soft-delete : on désactive l'acheteur
    const { data, error } = await supabaseAdmin
      .from('buyer_criteria')
      .update({ active: false })
      .eq('lead_id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Acheteur non trouvé' }, { status: 404 })
      }
      console.error('[API /market/buyers/[id]] DELETE error:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
    }

    return NextResponse.json({ success: true, buyer: data })
  } catch (e) {
    console.error('[API /market/buyers/[id]] DELETE exception:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}