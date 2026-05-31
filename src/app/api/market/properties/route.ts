import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/market/properties
 * Retourne la liste des biens filtrée.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const zipcode = searchParams.get('zipcode')
    const city = searchParams.get('city')
    const propertyType = searchParams.get('property_type')
    const dpe = searchParams.get('dpe')
    const status = searchParams.get('status')
    const priceMin = searchParams.get('price_min')
    const priceMax = searchParams.get('price_max')
    const surfaceMin = searchParams.get('surface_min')
    const surfaceMax = searchParams.get('surface_max')
    const landSurfaceMin = searchParams.get('land_surface_min')
    const tag = searchParams.get('tag')
    const sort = searchParams.get('sort') ?? 'last_seen_at.desc'
    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit')) || 30))
    const offset = (page - 1) * limit

    let query = supabaseAdmin
      .from('market_properties')
      .select('*', { count: 'exact' })

    // Filtres
    if (zipcode) query = query.eq('zipcode', zipcode)
    if (city) query = query.ilike('city', `%${city}%`)
    if (propertyType) query = query.eq('property_type', propertyType)
    if (dpe) query = query.eq('dpe', dpe)
    if (status) query = query.eq('status', status)
    if (priceMin) query = query.gte('price', Number(priceMin))
    if (priceMax) query = query.lte('price', Number(priceMax))
    if (surfaceMin) query = query.gte('surface', Number(surfaceMin))
    if (surfaceMax) query = query.lte('surface', Number(surfaceMax))
    if (landSurfaceMin) query = query.gte('land_surface', Number(landSurfaceMin))

    // Tri
    const [sortField, sortDir] = sort.split('.')
    const validSortFields = [
      'price', 'surface', 'price_per_m2', 'rooms', 'bedrooms',
      'created_at', 'last_seen_at', 'first_seen_at', 'city', 'zipcode',
    ]
    if (validSortFields.includes(sortField)) {
      query = query.order(sortField, { ascending: sortDir === 'asc' })
    } else {
      query = query.order('last_seen_at', { ascending: false })
    }

    // Pagination
    query = query.range(offset, offset + limit - 1)

    const { data: properties, count, error } = await query

    if (error) {
      console.error('[API /market/properties]', error)
      return NextResponse.json({ error: 'Erreur base de données' }, { status: 500 })
    }

    // Si tag filter, on filtre après (car relation dans property_tags)
    let filtered = properties
    if (tag && filtered.length > 0) {
      const { data: taggedIds } = await supabaseAdmin
        .from('property_tags')
        .select('market_property_id')
        .eq('tag', tag)

      const idsWithTag = new Set(taggedIds?.map(t => t.market_property_id) ?? [])
      filtered = filtered.filter(p => idsWithTag.has(p.id))
    }

    return NextResponse.json({
      properties: filtered,
      total: count ?? filtered.length,
      page,
      limit,
    })
  } catch (e) {
    console.error('[API /market/properties]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}