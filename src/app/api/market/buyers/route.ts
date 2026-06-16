/**
 * GET /api/market/buyers — Liste tous les acheteurs (buyer_criteria)
 * POST /api/market/buyers — Crée un nouvel acheteur
 *
 * Query params (GET) :
 *   search   — Filtre par type_bien, lead_id ou commune
 *   active   — Filtre par statut actif (true | false | all)
 *   limit    — Nombre max de résultats (défaut: 100)
 *   offset   — Pagination (défaut: 0)
 *
 * Body (POST) :
 *   type_bien   — Type de bien recherché
 *   communes    — Tableau de communes
 *   budget_max  — Budget maximum
 *   surface_min — Surface minimum
 *   pieces_min  — Nombre de pièces minimum
 *   criteres    — Critères additionnels (tableau de strings)
 *   active      — Statut actif (défaut: true)
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { runMatchingForBuyer } from '@/lib/market/matching-engine'
import crypto from 'crypto'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search')?.trim()
    const activeFilter = searchParams.get('active') ?? 'true'
    const limit = Math.min(200, Math.max(1, Number(searchParams.get('limit')) || 100))
    const offset = Math.max(0, Number(searchParams.get('offset')) || 0)

    let query = supabaseAdmin
      .from('buyer_criteria')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Filtre par statut actif
    if (activeFilter === 'true') {
      query = query.eq('active', true)
    } else if (activeFilter === 'false') {
      query = query.eq('active', false)
    }

    // Recherche textuelle
    if (search) {
      query = query.or(
        `type_bien.ilike.%${search}%,lead_id.ilike.%${search}%,communes.cs.{${search}}`
      )
    }

    const { data: buyers, error, count } = await query
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[API /market/buyers] GET error:', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    return NextResponse.json({
      buyers: buyers ?? [],
      total: count ?? 0,
      limit,
      offset,
    })
  } catch (e) {
    console.error('[API /market/buyers] GET exception:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type_bien, communes, budget_max, surface_min, pieces_min, criteres, active } = body

    // Validation basique
    if (!type_bien && !communes?.length && !budget_max) {
      return NextResponse.json(
        { error: 'Au moins un critère est requis (type_bien, communes ou budget_max)' },
        { status: 400 }
      )
    }

    // Générer un lead_id unique
    const lead_id = `admin_${crypto.randomUUID()}`

    const buyerData = {
      lead_id,
      type_bien: typeof type_bien === 'string' ? type_bien : null,
      communes: Array.isArray(communes) ? communes : null,
      budget_max: typeof budget_max === 'number' ? budget_max : null,
      surface_min: typeof surface_min === 'number' ? surface_min : null,
      pieces_min: typeof pieces_min === 'number' ? pieces_min : null,
      criteres: Array.isArray(criteres) ? criteres : null,
      active: active !== false, // défaut: true
    }

    const { data, error } = await supabaseAdmin
      .from('buyer_criteria')
      .insert(buyerData)
      .select()
      .single()

    if (error) {
      console.error('[API /market/buyers] POST error:', error)
      return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
    }

    // Lancer le matching en arrière-plan (non bloquant)
    runMatchingForBuyer(buyerData).catch((err) =>
      console.error('[API /market/buyers] Erreur matching:', err)
    )

    return NextResponse.json({ buyer: data, success: true }, { status: 201 })
  } catch (e) {
    console.error('[API /market/buyers] POST exception:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}