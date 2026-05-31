import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

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

    // Déduction métier : lecture du signal
    const signal = buildBusinessSignal(property, priceHistory ?? [])

    return NextResponse.json({
      property,
      price_history: priceHistory ?? [],
      tags: tags ?? [],
      notes: notes ?? [],
      opportunity: opportunity ?? null,
      notifications: notifications ?? [],
      signal,
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

// ── Lecture métier ───────────────────────────────────────────

function buildBusinessSignal(
  property: Record<string, unknown>,
  priceHistory: Array<Record<string, unknown>>,
): {
  summary: string
  interesting: string[]
  concerns: string[]
  recommendedAction: string
} {
  const interesting: string[] = []
  const concerns: string[] = []

  const daysOnline = property.days_online ?? 0
  const price = Number(property.price) || 0
  const surface = Number(property.surface) || 0
  const pricePerM2 = Number(property.price_per_m2) || 0
  const dpe = String(property.dpe ?? '')
  const landSurface = Number(property.land_surface) || 0
  const status = String(property.status ?? '')

  // Durée en ligne
  if (Number(daysOnline) > 90) {
    concerns.push(`En ligne depuis ${daysOnline} jours, peut indiquer un positionnement prix inadapté`)
  }

  // DPE
  if (dpe === 'F' || dpe === 'G') {
    concerns.push('DPE F ou G — forte contrainte réglementaire')
  } else if (dpe === 'A' || dpe === 'B') {
    interesting.push('DPE performant (A/B)')
  }

  // Terrain
  if (landSurface >= 500) {
    interesting.push(`Terrain intéressant : ${landSurface} m²`)
  }

  // Prix / m²
  if (pricePerM2 > 0 && surface > 0) {
    interesting.push(`Prix / m² : ${pricePerM2} €`)
  }

  // Baisse de prix
  if (priceHistory.length > 0) {
    const lastVariation = priceHistory[0] as Record<string, unknown> | undefined
    if (lastVariation) {
      const variation = Number(lastVariation.variation_percent) || 0
      if (variation < -5) {
        interesting.push(`Baisse de ${Math.abs(variation)} %`)
      }
      if (variation < -10) {
        concerns.push('Forte baisse de prix (> 10 %) — peut indiquer une urgence de vente')
      }
    }
  }

  // Synthèse
  let summary = ''
  if (daysOnline && Number(daysOnline) > 90 && priceHistory.length > 0) {
    const variation = Number((priceHistory[0] as Record<string, unknown>)?.variation_percent) || 0
    if (variation < 0) {
      summary = `Ce bien est en ligne depuis ${daysOnline} jours et a baissé de ${Math.abs(variation)} %. Il peut indiquer une difficulté de positionnement prix sur ce segment.`
    } else {
      summary = `Ce bien est en ligne depuis ${daysOnline} jours sans baisse de prix.`
    }
  } else {
    summary = `Bien ${property.title ?? ''} à ${property.city ?? property.zipcode ?? ''} — ${status}`
  }

  let recommendedAction = 'À surveiller'
  if (priceHistory.length > 0 && Number((priceHistory[0] as Record<string, unknown>)?.variation_percent) < -10) {
    recommendedAction = 'Opportunité à qualifier — forte baisse détectée'
  } else if (dpe === 'F' || dpe === 'G') {
    recommendedAction = 'Analyser le potentiel de rénovation'
  } else if (Number(daysOnline) > 90) {
    recommendedAction = 'Vérifier la marge de négociation possible'
  }

  return { summary, interesting, concerns, recommendedAction }
}