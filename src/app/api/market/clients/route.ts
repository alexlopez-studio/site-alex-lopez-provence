import { NextRequest, NextResponse } from 'next/server'
import { rejectIfNoAdmin, type AdminClientDossier } from '@/lib/market/client-admin'
import { supabaseAdmin } from '@/lib/supabase'
import type { Database, Json } from '@/types/supabase'

type ClientDocument = Database['public']['Tables']['client_documents']['Row']
type ClientDossierEvent = Database['public']['Tables']['client_dossier_events']['Row']

const DEFAULT_DOCUMENTS = [
  { label: 'Titre de propriété', category: 'propriete' },
  { label: 'Pièce d’identité', category: 'identite' },
  { label: 'Diagnostics immobiliers', category: 'diagnostics' },
  { label: 'Taxe foncière', category: 'fiscalite' },
]

const DEFAULT_BUYER_DOCUMENTS = [
  { label: 'Pièce d’identité', category: 'identite' },
  { label: 'Mandat de recherche signé', category: 'mandat_recherche' },
  { label: 'Plan de financement', category: 'financement' },
  { label: 'Attestation bancaire ou courtier', category: 'financement' },
]

const DEFAULT_EVENTS = [
  {
    title: 'Dossier vendeur ouvert',
    description: 'Votre espace centralise les informations utiles pour préparer la vente.',
    status: 'done',
  },
  {
    title: 'Préparation des pièces',
    description: 'Les documents demandés apparaissent dans la checklist.',
    status: 'todo',
  },
]

const DEFAULT_BUYER_EVENTS = [
  {
    title: 'Dossier acquéreur ouvert',
    description: 'Votre espace centralise les critères de recherche, les biens proposés et les prochaines étapes.',
    status: 'done',
  },
  {
    title: 'Mandat de recherche signé',
    description: 'Le mandat de recherche est signé.',
    status: 'done',
  },
]

export async function GET(req: NextRequest) {
  const denied = await rejectIfNoAdmin()
  if (denied) return denied

  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page') ?? '1') || 1)
    const pageSize = Math.min(100, Math.max(1, Number(searchParams.get('page_size') ?? '20') || 20))
    const status = searchParams.get('status')?.trim()
    const clientType = searchParams.get('client_type')?.trim() || 'seller'
    const q = searchParams.get('q')?.trim().toLowerCase()

    let query = supabaseAdmin
      .from('client_dossiers')
      .select('*, client_profile:client_profiles(*)', { count: 'exact' })
      .order('updated_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    } else {
      query = query.in('status', ['active', 'archived'])
    }

    if (clientType === 'seller' || clientType === 'buyer') {
      query = query.eq('client_type', clientType)
    }

    const rangeStart = q ? 0 : (page - 1) * pageSize
    const rangeEnd = q ? 249 : rangeStart + pageSize - 1
    const { data, error, count } = await query.range(rangeStart, rangeEnd)

    if (error) {
      console.error('[GET /api/market/clients]', error)
      return NextResponse.json({ success: false, error: 'Erreur lecture clients' }, { status: 500 })
    }

    let rows = ((data ?? []) as AdminClientDossier[])
    if (q) {
      rows = rows.filter((row) => dossierMatches(row, q))
    }

    const total = q ? rows.length : (count ?? rows.length)
    const paginated = q ? rows.slice((page - 1) * pageSize, page * pageSize) : rows
    const dossierIds = paginated.map((row) => row.id)
    const stats = await loadStats(dossierIds)

    return NextResponse.json({
      success: true,
      data: paginated.map((row) => ({
        ...row,
        stats: stats.get(row.id) ?? emptyStats(),
      })),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (err) {
    console.error('[GET /api/market/clients]', err)
    return NextResponse.json({ success: false, error: 'Erreur clients' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const denied = await rejectIfNoAdmin()
  if (denied) return denied

  try {
    const body = asRecord(await req.json())
    const profile = asRecord(body.profile)
    const snapshot = compactObject(asRecord(body.property_snapshot))
    const clientType = text(body.client_type) === 'buyer' ? 'buyer' : 'seller'
    const email = text(profile.email).toLowerCase()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Email client requis' }, { status: 400 })
    }
    if (Object.keys(snapshot).length === 0) {
      return NextResponse.json({ success: false, error: 'Informations bien requises' }, { status: 400 })
    }

    const { data: clientProfile, error: profileError } = await supabaseAdmin
      .from('client_profiles')
      .upsert({
        email,
        first_name: text(profile.first_name),
        last_name: text(profile.last_name),
        phone: text(profile.phone) || null,
        is_active: true,
      } as never, { onConflict: 'email' })
      .select('*')
      .single()

    if (profileError || !clientProfile) {
      console.error('[POST /api/market/clients] profile:', profileError)
      return NextResponse.json({ success: false, error: 'Erreur création client' }, { status: 500 })
    }

    const title = text(body.title) || buildTitle(snapshot, clientType)
    const { data: dossier, error: dossierError } = await supabaseAdmin
      .from('client_dossiers')
      .insert({
        client_profile_id: clientProfile.id,
        client_type: clientType,
        status: text(body.status) || 'active',
        title,
        property_snapshot: snapshot as Json,
        advisor_note: text(body.advisor_note) || 'Je garde ce dossier à jour pour vous donner une lecture claire de la vente et des prochaines étapes.',
      } as never)
      .select('id')
      .single()

    if (dossierError || !dossier) {
      console.error('[POST /api/market/clients] dossier:', dossierError)
      return NextResponse.json({ success: false, error: 'Erreur création dossier' }, { status: 500 })
    }

    await Promise.all([
      supabaseAdmin
        .from('client_documents')
        .insert((clientType === 'buyer' ? DEFAULT_BUYER_DOCUMENTS : DEFAULT_DOCUMENTS).map((document) => ({
          dossier_id: dossier.id,
          label: document.label,
          category: document.category,
          status: 'requested',
        })) as never),
      supabaseAdmin
        .from('client_dossier_events')
        .insert((clientType === 'buyer' ? DEFAULT_BUYER_EVENTS : DEFAULT_EVENTS).map((event) => ({
          dossier_id: dossier.id,
          type: 'milestone',
          title: event.title,
          description: event.description,
          status: event.status,
          visible_to_client: true,
          created_by: 'admin',
        })) as never),
    ])

    return NextResponse.json({ success: true, data: { id: dossier.id } })
  } catch (err) {
    console.error('[POST /api/market/clients]', err)
    return NextResponse.json({ success: false, error: 'Erreur création dossier client' }, { status: 500 })
  }
}

function dossierMatches(row: AdminClientDossier, q: string) {
  const snapshot = asRecord(row.property_snapshot)
  const haystack = [
    row.title,
    row.status,
    row.client_type,
    row.client_profile.email,
    row.client_profile.first_name,
    row.client_profile.last_name,
    row.client_profile.phone,
    text(snapshot.adresse),
    text(snapshot.commune),
    text(snapshot.type_bien),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()

  return haystack.includes(q)
}

async function loadStats(dossierIds: string[]) {
  const map = new Map<string, ReturnType<typeof emptyStats>>()
  for (const id of dossierIds) map.set(id, emptyStats())
  if (dossierIds.length === 0) return map

  const [{ data: documents }, { data: events }] = await Promise.all([
    supabaseAdmin
      .from('client_documents')
      .select('dossier_id, status, updated_at')
      .in('dossier_id', dossierIds),
    supabaseAdmin
      .from('client_dossier_events')
      .select('dossier_id, created_at')
      .in('dossier_id', dossierIds)
      .order('created_at', { ascending: false }),
  ])

  for (const document of (documents ?? []) as Pick<ClientDocument, 'dossier_id' | 'status' | 'updated_at'>[]) {
    const stats = map.get(document.dossier_id)
    if (!stats) continue
    stats.documents_total += 1
    if (document.status === 'validated') stats.documents_validated += 1
    if (['missing', 'requested', 'rejected'].includes(document.status)) stats.documents_missing += 1
    if (!stats.last_activity_at || document.updated_at > stats.last_activity_at) stats.last_activity_at = document.updated_at
  }

  for (const event of (events ?? []) as Pick<ClientDossierEvent, 'dossier_id' | 'created_at'>[]) {
    const stats = map.get(event.dossier_id)
    if (!stats) continue
    if (!stats.last_activity_at || event.created_at > stats.last_activity_at) stats.last_activity_at = event.created_at
  }

  return map
}

function emptyStats() {
  return {
    documents_total: 0,
    documents_missing: 0,
    documents_validated: 0,
    last_activity_at: null as string | null,
  }
}

function asRecord(value: Json | null | undefined): Record<string, Json | undefined> {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value
  return {}
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function compactObject(value: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(value).map(([key, raw]) => {
    if (typeof raw === 'string') {
      const trimmed = raw.trim()
      const numeric = new Set(['surface', 'surface_terrain', 'nb_pieces', 'prix_estime', 'fourchette_basse', 'fourchette_haute'])
      if (numeric.has(key)) {
        const parsed = Number(trimmed.replace(/\s/g, '').replace(',', '.'))
        return [key, Number.isFinite(parsed) && trimmed !== '' ? parsed : null]
      }
      return [key, trimmed || null]
    }
    return [key, raw ?? null]
  }).filter(([, value]) => value !== null && value !== ''))
}

function buildTitle(snapshot: Record<string, unknown>, clientType: 'seller' | 'buyer' = 'seller') {
  const city = text(snapshot.commune)
  if (clientType === 'buyer') return city ? `Recherche acquéreur - ${city}` : 'Recherche acquéreur'
  return city ? `Projet de vente - ${city}` : 'Projet de vente'
}
