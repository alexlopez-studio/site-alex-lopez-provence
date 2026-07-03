import type { SupabaseClient } from '@supabase/supabase-js'
import { supabaseAdmin } from '@/lib/supabase'
import type { Database, Json } from '@/types/supabase'

type ClientProfile = Database['public']['Tables']['client_profiles']['Row']
type ClientDossier = Database['public']['Tables']['client_dossiers']['Row']
type ClientDocument = Database['public']['Tables']['client_documents']['Row']
type ClientDossierEvent = Database['public']['Tables']['client_dossier_events']['Row']
type Lead = Database['public']['Tables']['leads']['Row']
type Prospect = Database['public']['Tables']['prospects']['Row']
type SellerProperty = Database['public']['Tables']['seller_properties']['Row']
type Opportunity = Database['public']['Tables']['opportunities']['Row']

export type ClientLead = Lead & {
  prospect?: Pick<Prospect, 'id' | 'email' | 'first_name' | 'last_name' | 'phone'> | null
}

export type ClientDocumentWithUrl = ClientDocument & {
  signed_url?: string | null
}

export type ClientPortalDossier = {
  profile: ClientProfile
  dossier: ClientDossier
  lead: ClientLead | null
  sellerProperty: SellerProperty | null
  opportunity: Opportunity | null
  documents: ClientDocumentWithUrl[]
  events: ClientDossierEvent[]
}

type LeadWithProspect = Lead & {
  prospect?: Pick<Prospect, 'id' | 'email' | 'first_name' | 'last_name' | 'phone'> | null
}

const DEFAULT_DOCUMENTS = [
  { label: 'Titre de propriété', category: 'propriete' },
  { label: 'Pièce d’identité', category: 'identite' },
  { label: 'Diagnostics immobiliers', category: 'diagnostics' },
  { label: 'Taxe foncière', category: 'fiscalite' },
]

const DEFAULT_EVENTS = [
  {
    title: 'Dossier vendeur ouvert',
    description: 'Votre espace centralise les informations utiles pour préparer la vente.',
    status: 'done',
  },
  {
    title: 'Préparation des pièces',
    description: 'Déposez les documents disponibles pour accélérer le montage du dossier.',
    status: 'todo',
  },
  {
    title: 'Avis de valeur conseiller',
    description: 'La valeur retenue sera affinée après analyse terrain et concurrence active.',
    status: 'todo',
  },
]

export async function ensureClientDossierForLead(leadId: string) {
  const { data: lead, error: leadError } = await supabaseAdmin
    .from('leads')
    .select(`
      *,
      prospect:prospects!leads_prospect_id_fkey (
        id,
        email,
        first_name,
        last_name,
        phone
      )
    `)
    .eq('id', leadId)
    .is('deleted_at', null)
    .maybeSingle()

  if (leadError) throw new Error(`Lecture lead impossible: ${leadError.message}`)
  if (!lead) throw new Error('Lead introuvable')

  const leadRecord = lead as LeadWithProspect
  const prospect = leadRecord.prospect
  const email = prospect?.email?.trim().toLowerCase()
  if (!email) throw new Error('Ce lead ne contient pas d’email client')

  const [sellerResult, opportunityResult] = await Promise.all([
    supabaseAdmin
      .from('seller_properties')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin
      .from('opportunities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  if (sellerResult.error) throw new Error(`Lecture bien vendeur impossible: ${sellerResult.error.message}`)
  if (opportunityResult.error) throw new Error(`Lecture opportunité impossible: ${opportunityResult.error.message}`)

  const sellerProperty = sellerResult.data as SellerProperty | null
  const opportunity = opportunityResult.data as Opportunity | null

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('client_profiles')
    .upsert({
      email,
      first_name: prospect?.first_name ?? '',
      last_name: prospect?.last_name ?? '',
      phone: prospect?.phone ?? null,
      is_active: true,
    } as never, { onConflict: 'email' })
    .select('*')
    .single()

  if (profileError) throw new Error(`Préparation profil client impossible: ${profileError.message}`)
  if (!profile) throw new Error('Profil client non retourné')

  const existing = await supabaseAdmin
    .from('client_dossiers')
    .select('*')
    .eq('lead_id', leadId)
    .maybeSingle()

  if (existing.error) throw new Error(`Lecture dossier client impossible: ${existing.error.message}`)

  const payload = {
    client_profile_id: (profile as ClientProfile).id,
    lead_id: leadId,
    seller_property_id: sellerProperty?.id ?? null,
    opportunity_id: opportunity?.id ?? null,
    status: 'active',
    title: buildDossierTitle(leadRecord, sellerProperty, opportunity),
    property_snapshot: buildPropertySnapshot(leadRecord, sellerProperty, opportunity) as Json,
    advisor_note: 'Je garde ce dossier à jour pour vous donner une lecture claire de la vente et des prochaines étapes.',
  }

  const dossierResult = existing.data
    ? await supabaseAdmin
        .from('client_dossiers')
        .update(payload as never)
        .eq('id', (existing.data as ClientDossier).id)
        .select('*')
        .single()
    : await supabaseAdmin
        .from('client_dossiers')
        .insert(payload as never)
        .select('*')
        .single()

  if (dossierResult.error) throw new Error(`Préparation dossier client impossible: ${dossierResult.error.message}`)
  if (!dossierResult.data) throw new Error('Dossier client non retourné')

  const dossier = dossierResult.data as ClientDossier
  await ensureDefaultDocuments(dossier.id)
  await ensureDefaultEvents(dossier.id)

  return { profile: profile as ClientProfile, dossier }
}

export async function getCurrentClientDossier(
  supabase: SupabaseClient<Database>,
): Promise<ClientPortalDossier | null> {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user?.email) return null

  const profile = await findClientProfile(supabase, user.id, user.email)
  if (!profile) return null

  const { data: dossiers, error: dossierError } = await supabase
    .from('client_dossiers')
    .select('*')
    .eq('client_profile_id', profile.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)

  if (dossierError) throw new Error(`Lecture dossier client impossible: ${dossierError.message}`)
  const dossier = (dossiers?.[0] as ClientDossier | undefined) ?? null
  if (!dossier) return null

  const [lead, sellerProperty, opportunity, documents, events] = await Promise.all([
    loadLead(supabase, dossier.lead_id),
    loadSellerProperty(supabase, dossier),
    loadOpportunity(supabase, dossier),
    loadDocuments(supabase, dossier.id),
    loadEvents(supabase, dossier.id),
  ])

  return {
    profile,
    dossier,
    lead,
    sellerProperty,
    opportunity,
    documents,
    events,
  }
}

async function findClientProfile(
  supabase: SupabaseClient<Database>,
  userId: string,
  email: string,
) {
  const byUser = await supabase
    .from('client_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (byUser.error) throw new Error(`Lecture profil client impossible: ${byUser.error.message}`)
  if (byUser.data) return byUser.data as ClientProfile

  const byEmail = await supabase
    .from('client_profiles')
    .select('*')
    .eq('email', email)
    .maybeSingle()

  if (byEmail.error) throw new Error(`Lecture profil client impossible: ${byEmail.error.message}`)
  return (byEmail.data as ClientProfile | null) ?? null
}

async function loadLead(supabase: SupabaseClient<Database>, leadId: string | null) {
  if (!leadId) return null
  const { data, error } = await supabase
    .from('leads')
    .select(`
      *,
      prospect:prospects!leads_prospect_id_fkey (
        id,
        email,
        first_name,
        last_name,
        phone
      )
    `)
    .eq('id', leadId)
    .maybeSingle()

  if (error) throw new Error(`Lecture lead client impossible: ${error.message}`)
  return (data as ClientLead | null) ?? null
}

async function loadSellerProperty(
  supabase: SupabaseClient<Database>,
  dossier: ClientDossier,
) {
  if (dossier.seller_property_id) {
    const { data, error } = await supabase
      .from('seller_properties')
      .select('*')
      .eq('id', dossier.seller_property_id)
      .maybeSingle()

    if (error) throw new Error(`Lecture bien client impossible: ${error.message}`)
    return (data as SellerProperty | null) ?? null
  }

  if (!dossier.lead_id) return null
  const { data, error } = await supabase
    .from('seller_properties')
    .select('*')
    .eq('lead_id', dossier.lead_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`Lecture bien client impossible: ${error.message}`)
  return (data as SellerProperty | null) ?? null
}

async function loadOpportunity(
  supabase: SupabaseClient<Database>,
  dossier: ClientDossier,
) {
  if (dossier.opportunity_id) {
    const { data, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', dossier.opportunity_id)
      .maybeSingle()

    if (error) throw new Error(`Lecture opportunité client impossible: ${error.message}`)
    return (data as Opportunity | null) ?? null
  }

  if (!dossier.lead_id) return null
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('lead_id', dossier.lead_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw new Error(`Lecture opportunité client impossible: ${error.message}`)
  return (data as Opportunity | null) ?? null
}

async function loadDocuments(supabase: SupabaseClient<Database>, dossierId: string) {
  const { data, error } = await supabase
    .from('client_documents')
    .select('*')
    .eq('dossier_id', dossierId)
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Lecture documents client impossible: ${error.message}`)

  const documents = (data ?? []) as ClientDocument[]
  return Promise.all(
    documents.map(async (document) => {
      if (!document.storage_path) return { ...document, signed_url: null }
      const signed = await supabase
        .storage
        .from('client-documents')
        .createSignedUrl(document.storage_path, 60 * 15)

      return {
        ...document,
        signed_url: signed.data?.signedUrl ?? null,
      }
    }),
  )
}

async function loadEvents(supabase: SupabaseClient<Database>, dossierId: string) {
  const { data, error } = await supabase
    .from('client_dossier_events')
    .select('*')
    .eq('dossier_id', dossierId)
    .order('event_date', { ascending: true, nullsFirst: false })
    .order('created_at', { ascending: true })

  if (error) throw new Error(`Lecture jalons client impossible: ${error.message}`)
  return (data ?? []) as ClientDossierEvent[]
}

async function ensureDefaultDocuments(dossierId: string) {
  const { count, error } = await supabaseAdmin
    .from('client_documents')
    .select('id', { count: 'exact', head: true })
    .eq('dossier_id', dossierId)

  if (error) throw new Error(`Lecture checklist impossible: ${error.message}`)
  if ((count ?? 0) > 0) return

  const { error: insertError } = await supabaseAdmin
    .from('client_documents')
    .insert(DEFAULT_DOCUMENTS.map((document) => ({
      dossier_id: dossierId,
      label: document.label,
      category: document.category,
      status: 'requested',
    })) as never)

  if (insertError) throw new Error(`Création checklist impossible: ${insertError.message}`)
}

async function ensureDefaultEvents(dossierId: string) {
  const { count, error } = await supabaseAdmin
    .from('client_dossier_events')
    .select('id', { count: 'exact', head: true })
    .eq('dossier_id', dossierId)

  if (error) throw new Error(`Lecture jalons impossible: ${error.message}`)
  if ((count ?? 0) > 0) return

  const { error: insertError } = await supabaseAdmin
    .from('client_dossier_events')
    .insert(DEFAULT_EVENTS.map((event) => ({
      dossier_id: dossierId,
      type: 'milestone',
      title: event.title,
      description: event.description,
      status: event.status,
      visible_to_client: true,
      created_by: 'system',
    })) as never)

  if (insertError) throw new Error(`Création jalons impossible: ${insertError.message}`)
}

function buildDossierTitle(
  lead: LeadWithProspect,
  sellerProperty: SellerProperty | null,
  opportunity: Opportunity | null,
) {
  if (opportunity?.title) return opportunity.title
  const city = lead.commune ?? sellerProperty?.adresse ?? null
  if (city) return `Projet de vente - ${city}`
  return 'Projet de vente'
}

function buildPropertySnapshot(
  lead: LeadWithProspect,
  sellerProperty: SellerProperty | null,
  opportunity: Opportunity | null,
) {
  const formData = isRecord(lead.form_data) ? lead.form_data : {}
  return {
    adresse: sellerProperty?.adresse ?? text(formData.adresse) ?? opportunity?.property_address ?? null,
    commune: lead.commune ?? opportunity?.property_city ?? null,
    type_bien: sellerProperty?.type_bien ?? text(formData.type_bien) ?? opportunity?.property_type ?? null,
    surface: sellerProperty?.surface ?? numberValue(formData.surface) ?? opportunity?.property_surface ?? null,
    surface_terrain: sellerProperty?.surface_terrain ?? numberValue(formData.surface_terrain) ?? opportunity?.property_land_surface ?? null,
    nb_pieces: sellerProperty?.nb_pieces ?? numberValue(formData.nb_pieces) ?? opportunity?.property_rooms ?? null,
    prix_estime: sellerProperty?.prix_estime ?? numberValue(formData.prix_estime) ?? null,
  }
}

function isRecord(value: Json): value is Record<string, Json | undefined> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function numberValue(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}
