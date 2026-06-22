import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { scoreMarketProperty } from '@/lib/market/mandate-score'
import { median, undervaluationPct } from '@/lib/market/zone-valuation'

/**
 * GET /api/market/properties/:id
 * Retourne le détail d'un bien avec historique, tags, notes et opportunité liée.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params

    const { data: property, error } = await supabaseAdmin
      .from('market_properties')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !property) {
      if (error?.code === 'PGRST116') {
        return NextResponse.json({ error: 'Bien non trouvé' }, { status: 404 })
      }
      console.error('[API /market/properties/:id]', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    // Historique des prix
    const { data: priceHistory } = await supabaseAdmin
      .from('property_price_history')
      .select('*')
      .eq('market_property_id', id)
      .order('detected_at', { ascending: false })

    // Tags
    const { data: tags } = await supabaseAdmin
      .from('property_tags')
      .select('*')
      .eq('market_property_id', id)
      .order('created_at', { ascending: false })

    // Notes
    const { data: notes } = await supabaseAdmin
      .from('property_notes')
      .select('*')
      .eq('market_property_id', id)
      .order('created_at', { ascending: false })

    // Opportunité liée
    const { data: opportunity } = await supabaseAdmin
      .from('opportunities')
      .select('*')
      .eq('market_property_id', id)
      .maybeSingle()

    // Notifications liées
    const { data: notifications } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('market_property_id', id)
      .order('created_at', { ascending: false })
      .limit(10)

    // Score métier (MandateProbabilityScore) sur le bien réel
    const mandateScore = scoreMarketProperty(property, priceHistory ?? [])

    // Sous-évaluation : médiane prix/m² de la zone (commune INSEE sinon CP).
    const zoneFilter = property.insee_code
      ? { col: 'insee_code' as const, val: property.insee_code }
      : { col: 'zipcode' as const, val: property.zipcode }
    let undervaluation = 0
    if (zoneFilter.val) {
      const { data: zoneRows } = await supabaseAdmin
        .from('market_properties')
        .select('price_per_m2, status')
        .eq(zoneFilter.col, zoneFilter.val)
        .limit(2000)
      const ppms = (zoneRows ?? [])
        .filter((r) => !['expired', 'removed', 'sold', 'vendu'].includes(String(r.status)))
        .map((r) => Number(r.price_per_m2))
        .filter((n) => Number.isFinite(n) && n > 0)
      undervaluation = undervaluationPct(property.price_per_m2, median(ppms))
    }

    return NextResponse.json({
      property,
      price_history: priceHistory ?? [],
      tags: tags ?? [],
      notes: notes ?? [],
      opportunity: opportunity ?? null,
      notifications: notifications ?? [],
      mandate_score: mandateScore,
      undervaluation_pct: undervaluation,
    })
  } catch (e) {
    console.error('[API /market/properties/:id]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

/**
 * PATCH /api/market/properties/:id
 * Met à jour un bien (statut, etc.)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const body = await req.json()

    const { error } = await supabaseAdmin
      .from('market_properties')
      .update(body)
      .eq('id', id)

    if (error) {
      console.error('[API /market/properties/:id PATCH]', error)
      return NextResponse.json({ error: 'Erreur mise à jour' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[API /market/properties/:id PATCH]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

