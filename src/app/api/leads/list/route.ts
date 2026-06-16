import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/leads/list — Liste paginée/filtrée des leads
 *
 * Query params :
 *   - status    : filtre par statut (ex: "nouveau,contacte")
 *   - tool      : filtre par outil (ex: "vendre,acheter")
 *   - q         : recherche texte (email, nom, prénom)
 *   - from      : date début ISO (created_at >=)
 *   - to        : date fin ISO (created_at <=)
 *   - page      : numéro de page (défaut: 1)
 *   - page_size : taille de page (défaut: 20, max: 100)
 *   - sort_by   : champ de tri (défaut: created_at)
 *   - sort_dir  : asc|desc (défaut: desc)
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(req.url)
    const statusFilter = searchParams.get('status')       // "nouveau,contacte"
    const toolFilter = searchParams.get('tool')           // "vendre,acheter"
    const q = searchParams.get('q')                       // recherche texte
    const dateFrom = searchParams.get('from')             // ISO date
    const dateTo = searchParams.get('to')                 // ISO date
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1)
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('page_size') ?? '20', 10) || 20))
    const sortBy = searchParams.get('sort_by') ?? 'created_at'
    const sortDir = searchParams.get('sort_dir') === 'asc' ? 'asc' as const : 'desc' as const

    const offset = (page - 1) * pageSize

    // Construire la requête
    let query = supabaseAdmin
        .from('leads')
        .select(
            `
        id,
        tool,
        status,
        form_data,
        commune,
        magic_link_sent_at,
        created_at,
        updated_at,
        prospect:prospects!leads_prospect_id_fkey (
          id,
          email,
          first_name,
          last_name,
          phone
        )
      `,
            { count: 'exact' },
        )
        .is('deleted_at', null)

    // Filtres
    if (statusFilter) {
        const statuses = statusFilter.split(',').map((s) => s.trim()).filter(Boolean)
        if (statuses.length > 0) {
            query = query.in('status', statuses as never)
        }
    }

    if (toolFilter) {
        const tools = toolFilter.split(',').map((t) => t.trim()).filter(Boolean)
        if (tools.length > 0) {
            query = query.in('tool', tools as never)
        }
    }

    if (dateFrom) {
        query = query.gte('created_at', dateFrom)
    }

    if (dateTo) {
        query = query.lte('created_at', dateTo)
    }

    // Recherche texte — on filtre côté serveur par email via prospect join first
    // Puis on complète par une deuxième requête si q est fourni
    let leads: unknown[] = []
    let totalCount = 0

    if (q && q.trim().length > 0) {
        // Recherche par email dans prospects
        const searchTerm = q.trim()
        const { data: matchedProspects } = await supabaseAdmin
            .from('prospects')
            .select('id')
            .or(
                `email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%`,
            )
            .limit(100)

        const prospectIds = matchedProspects?.map((p) => p.id) ?? []

        if (prospectIds.length > 0) {
            query = query.in('prospect_id', prospectIds)
        } else {
            // Aucun prospect trouvé → résultat vide
            return NextResponse.json({
                success: true,
                data: [],
                pagination: { page, pageSize, total: 0, totalPages: 0 },
            })
        }
    }

    // Tri
    const allowedSortFields = ['created_at', 'updated_at', 'status', 'tool', 'magic_link_sent_at']
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at'
    query = query.order(sortField, { ascending: sortDir === 'asc' })

    // Pagination
    const { data, error, count } = await query.range(offset, offset + pageSize - 1)

    if (error) {
        console.error('[API GET /leads/list]', error)
        return NextResponse.json(
            { success: false, error: 'Erreur base de données' },
            { status: 500 },
        )
    }

    leads = data ?? []
    totalCount = count ?? 0

    return NextResponse.json({
        success: true,
        data: leads,
        pagination: {
            page,
            pageSize,
            total: totalCount,
            totalPages: Math.ceil(totalCount / pageSize),
        },
    })
}