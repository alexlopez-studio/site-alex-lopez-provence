import { supabaseAdmin } from '@/lib/supabase'
import { searchStreamEstateProperties, type StreamEstatePropertySummary } from '@/lib/stream-estate'

type JsonRecord = Record<string, unknown>

export type MarketPropertyRow = {
  id: string
  external_id: string
  source: string
  title: string | null
  description: string | null
  city: string | null
  zipcode: string | null
  insee_code: string | null
  lat: number | null
  lon: number | null
  property_type: string | null
  price: number | null
  surface: number | null
  price_per_m2: number | null
  land_surface: number | null
  rooms: number | null
  bedrooms: number | null
  dpe: string | null
  ges: string | null
  url: string | null
  status: string
  first_seen_at: string
  last_seen_at: string
  published_at: string | null
  expired_at: string | null
  raw_json: JsonRecord
  created_at: string
  updated_at: string
  tags?: string[]
  price_variation_percent?: number | null
  days_online?: number | null
  opportunity_score?: number
  recommended_action?: string
}

export type ManagementRuleRow = {
  id: string
  name: string
  description: string
  active: boolean
  trigger_type: string
  conditions_json: JsonRecord
  actions_json: JsonRecord
  priority: string
  last_run_at: string | null
  created_at: string
  updated_at: string
}

export type NotificationRow = {
  id: string
  type: string
  title: string
  message: string
  priority: string
  market_property_id: string | null
  rule_id: string | null
  opportunity_id: string | null
  status: string
  action_label: string | null
  created_at: string
  read_at: string | null
  resolved_at: string | null
}

export type OpportunityRow = {
  id: string
  market_property_id: string | null
  title: string
  description: string
  stage: string
  priority: string
  signal_type: string | null
  next_action: string | null
  due_date: string | null
  note: string | null
  created_from: string
  created_at: string
  updated_at: string
}

export type ListMarketPropertiesFilters = {
  zipcode?: string
  city?: string
  status?: string
  q?: string
  tag?: string
  limit?: number
}

export async function listMarketProperties(filters: ListMarketPropertiesFilters = {}): Promise<MarketPropertyRow[]> {
  let query = supabaseAdmin
    .from('market_properties')
    .select('*')
    .order('last_seen_at', { ascending: false })
    .limit(Math.min(filters.limit ?? 200, 500))

  if (filters.zipcode) query = query.eq('zipcode', filters.zipcode)
  if (filters.city) query = query.ilike('city', `%${filters.city}%`)
  if (filters.status) query = query.eq('status', filters.status)
  if (filters.q) {
    query = query.or(`title.ilike.%${filters.q}%,city.ilike.%${filters.q}%,source.ilike.%${filters.q}%`)
  }

  const { data, error } = await query
  if (error) throw new MarketRepoError('listMarketProperties', error.message, error)

  const rows = (data ?? []) as unknown as MarketPropertyRow[]
  const tagsByProperty = await loadTags(rows.map((row) => row.id))
  const variationsByProperty = await loadLastVariations(rows.map((row) => row.id))

  return rows
    .map((row) => enrichRow(row, tagsByProperty[row.id] ?? [], variationsByProperty[row.id] ?? null))
    .filter((row) => !filters.tag || row.tags?.includes(filters.tag))
}

export async function getMarketProperty(id: string): Promise<MarketPropertyRow | null> {
  const { data, error } = await supabaseAdmin
    .from('market_properties')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) throw new MarketRepoError('getMarketProperty', error.message, error)
  if (!data) return null

  const tags = await loadTags([id])
  const variations = await loadLastVariations([id])
  return enrichRow(data as unknown as MarketPropertyRow, tags[id] ?? [], variations[id] ?? null)
}

export async function syncMarketPropertiesByZipcode(zipcode: string): Promise<{ fetched: number; created: number; updated: number; properties: MarketPropertyRow[] }> {
  const zone = await ensureZone(zipcode)
  const syncRunId = await createSyncRun(zone.id)

  try {
    const result = await searchStreamEstateProperties({
      includedZipcodes: [zipcode],
      propertyTypes: ['house'],
      transactionType: 'sell',
      withCoherentPrice: true,
      itemsPerPage: 30,
      orderBy: 'updatedAt',
      order: 'desc',
    })

    if (!result.ok) {
      throw new Error(result.skipped ? 'STREAMESTATE_API_KEY manquante' : result.error ?? 'Erreur Stream Estate')
    }

    let created = 0
    let updated = 0

    for (const property of result.properties) {
      const change = await upsertMarketProperty(property)
      if (change === 'created') created += 1
      else updated += 1
    }

    await runRulesForZipcode(zipcode)
    await finishSyncRun(syncRunId, 'success', result.properties.length, created, updated)
    const properties = await listMarketProperties({ zipcode })
    return { fetched: result.properties.length, created, updated, properties }
  } catch (error) {
    await finishSyncRun(syncRunId, 'error', 0, 0, 0, error instanceof Error ? error.message : 'Erreur inconnue')
    throw error
  }
}

async function upsertMarketProperty(property: StreamEstatePropertySummary): Promise<'created' | 'updated'> {
  const existing = await findByExternalId(property.id)
  const nextPrice = integer(property.price)

  const payload = {
    external_id: property.id,
    source: 'stream_estate',
    title: property.title ?? null,
    description: property.description ?? null,
    city: property.city ?? null,
    zipcode: property.zipcode ?? null,
    insee_code: property.insee ?? null,
    lat: property.lat ?? null,
    lon: property.lon ?? null,
    property_type: property.propertyType != null ? String(property.propertyType) : null,
    price: nextPrice,
    surface: property.surface ?? null,
    price_per_m2: property.pricePerMeter ?? null,
    land_surface: property.landSurface ?? null,
    rooms: integer(property.room),
    bedrooms: integer(property.bedroom),
    dpe: property.energyCategory ?? null,
    ges: property.greenHouseGasCategory ?? null,
    url: property.url ?? null,
    status: 'active',
    last_seen_at: new Date().toISOString(),
    published_at: property.createdAt ?? null,
    raw_json: property as unknown as JsonRecord,
  }

  const { data, error } = await supabaseAdmin
    .from('market_properties')
    .upsert(payload as never, { onConflict: 'source,external_id' })
    .select('*')
    .single()

  if (error) throw new MarketRepoError('upsertMarketProperty', error.message, error)

  if (existing && existing.price != null && nextPrice != null && existing.price !== nextPrice) {
    await insertPriceHistory((data as unknown as MarketPropertyRow).id, existing.price, nextPrice)
  }

  return existing ? 'updated' : 'created'
}

async function findByExternalId(externalId: string): Promise<MarketPropertyRow | null> {
  const { data, error } = await supabaseAdmin
    .from('market_properties')
    .select('*')
    .eq('source', 'stream_estate')
    .eq('external_id', externalId)
    .maybeSingle()

  if (error) throw new MarketRepoError('findByExternalId', error.message, error)
  return (data as unknown as MarketPropertyRow | null) ?? null
}

async function insertPriceHistory(propertyId: string, oldPrice: number, newPrice: number): Promise<void> {
  const variationAmount = newPrice - oldPrice
  const variationPercent = oldPrice > 0 ? Math.round((variationAmount / oldPrice) * 1000) / 10 : null
  const { error } = await supabaseAdmin
    .from('property_price_history')
    .insert({
      market_property_id: propertyId,
      old_price: oldPrice,
      new_price: newPrice,
      variation_amount: variationAmount,
      variation_percent: variationPercent,
    } as never)

  if (error) throw new MarketRepoError('insertPriceHistory', error.message, error)
}

async function loadTags(propertyIds: string[]): Promise<Record<string, string[]>> {
  if (propertyIds.length === 0) return {}
  const { data, error } = await supabaseAdmin
    .from('property_tags')
    .select('market_property_id, tag')
    .in('market_property_id', propertyIds)

  if (error) throw new MarketRepoError('loadTags', error.message, error)
  const map: Record<string, string[]> = {}
  for (const row of (data ?? []) as unknown as Array<{ market_property_id: string; tag: string }>) {
    map[row.market_property_id] = [...(map[row.market_property_id] ?? []), row.tag]
  }
  return map
}

async function loadLastVariations(propertyIds: string[]): Promise<Record<string, number | null>> {
  if (propertyIds.length === 0) return {}
  const { data, error } = await supabaseAdmin
    .from('property_price_history')
    .select('market_property_id, variation_percent, detected_at')
    .in('market_property_id', propertyIds)
    .order('detected_at', { ascending: false })

  if (error) throw new MarketRepoError('loadLastVariations', error.message, error)
  const map: Record<string, number | null> = {}
  for (const row of (data ?? []) as unknown as Array<{ market_property_id: string; variation_percent: number | null }>) {
    if (!(row.market_property_id in map)) map[row.market_property_id] = row.variation_percent
  }
  return map
}

async function ensureZone(zipcode: string): Promise<{ id: string }> {
  const { data, error } = await supabaseAdmin
    .from('monitored_zones')
    .upsert({ name: `Zone ${zipcode}`, zipcode, active: true } as never, { onConflict: 'zipcode' })
    .select('id')
    .single()

  if (error) throw new MarketRepoError('ensureZone', error.message, error)
  return data as unknown as { id: string }
}

async function createSyncRun(zoneId: string): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from('sync_runs')
    .insert({ zone_id: zoneId, provider: 'stream_estate', status: 'running' } as never)
    .select('id')
    .single()

  if (error) throw new MarketRepoError('createSyncRun', error.message, error)
  return (data as unknown as { id: string }).id
}

async function finishSyncRun(id: string, status: string, fetched: number, created: number, updated: number, errorMessage?: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('sync_runs')
    .update({
      status,
      fetched_count: fetched,
      created_count: created,
      updated_count: updated,
      error_message: errorMessage ?? null,
      finished_at: new Date().toISOString(),
    } as never)
    .eq('id', id)

  if (error) throw new MarketRepoError('finishSyncRun', error.message, error)
}

function enrichRow(row: MarketPropertyRow, existingTags: string[], priceVariation: number | null): MarketPropertyRow {
  const tags = new Set(existingTags)
  const days = daysOnline(row.published_at ?? row.first_seen_at)

  if (days != null && days <= 14) tags.add('Nouvelle annonce')
  if (days != null && days >= 90) tags.add('Plus de 90 jours')
  if (priceVariation != null && priceVariation <= -5) tags.add('Baisse de prix')
  if (priceVariation != null && priceVariation <= -10) tags.add('Forte baisse')
  if (row.dpe === 'F' || row.dpe === 'G') tags.add('DPE faible')
  if ((row.land_surface ?? 0) >= 500) tags.add('Terrain intéressant')

  const opportunityScore = Math.min(100, 20 + tags.size * 12 + (priceVariation != null && priceVariation <= -5 ? 18 : 0))
  if (opportunityScore >= 70) tags.add('Opportunité mandat')

  return {
    ...row,
    tags: Array.from(tags),
    days_online: days,
    price_variation_percent: priceVariation,
    opportunity_score: opportunityScore,
    recommended_action: opportunityScore >= 70
      ? 'Créer une opportunité et préparer une lecture marché.'
      : tags.has('Plus de 90 jours')
        ? 'Surveiller la durée de publication et la prochaine variation.'
        : 'Conserver dans la veille marché.',
  }
}

export async function runRulesForZipcode(zipcode: string): Promise<void> {
  const properties = await listMarketProperties({ zipcode })
  const rules = await listRules()
  for (const property of properties) {
    for (const tag of property.tags ?? []) {
      await addTag(property.id, tag)
    }

    const shouldNotify = rules.some((rule) => rule.active && (
      (rule.trigger_type === 'days_online' && (property.days_online ?? 0) >= 90)
      || (rule.trigger_type === 'dpe' && ['F', 'G'].includes(property.dpe ?? ''))
      || (rule.trigger_type === 'opportunity_score' && (property.opportunity_score ?? 0) >= 70)
      || (rule.trigger_type === 'new_listing' && (property.days_online ?? 999) <= 14)
    ))

    if (shouldNotify) await createNotificationForProperty(property)
    if ((property.opportunity_score ?? 0) >= 70) await createOpportunityFromProperty(property, 'rule')
  }
}

async function addTag(propertyId: string, tag: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('property_tags')
    .upsert({ market_property_id: propertyId, tag, source: 'system' } as never, { onConflict: 'market_property_id,tag' })
  if (error) throw new MarketRepoError('addTag', error.message, error)
}

async function createNotificationForProperty(property: MarketPropertyRow): Promise<void> {
  const title = (property.opportunity_score ?? 0) >= 70 ? 'Opportunité détectée' : 'Signal marché détecté'
  const { error } = await supabaseAdmin
    .from('notifications')
    .insert({
      type: 'market_signal',
      title,
      message: `${property.title ?? 'Bien'} · ${property.city ?? ''} · ${(property.tags ?? []).join(', ')}`,
      priority: (property.opportunity_score ?? 0) >= 70 ? 'high' : 'medium',
      market_property_id: property.id,
      status: 'unread',
      action_label: 'Ouvrir le bien',
    } as never)
  if (error) throw new MarketRepoError('createNotificationForProperty', error.message, error)
}

export async function listRules(): Promise<ManagementRuleRow[]> {
  const { data, error } = await supabaseAdmin.from('management_rules').select('*').order('created_at', { ascending: true })
  if (error) throw new MarketRepoError('listRules', error.message, error)
  return (data ?? []) as unknown as ManagementRuleRow[]
}

export async function updateRule(id: string, patch: Partial<Pick<ManagementRuleRow, 'active' | 'name' | 'description' | 'priority'>>): Promise<ManagementRuleRow> {
  const { data, error } = await supabaseAdmin
    .from('management_rules')
    .update(patch as never)
    .eq('id', id)
    .select('*')
    .single()
  if (error) throw new MarketRepoError('updateRule', error.message, error)
  return data as unknown as ManagementRuleRow
}

export async function listNotifications(): Promise<NotificationRow[]> {
  const { data, error } = await supabaseAdmin.from('notifications').select('*').order('created_at', { ascending: false }).limit(100)
  if (error) throw new MarketRepoError('listNotifications', error.message, error)
  return (data ?? []) as unknown as NotificationRow[]
}

export async function updateNotification(id: string, status: string): Promise<NotificationRow> {
  const patch = {
    status,
    ...(status === 'read' ? { read_at: new Date().toISOString() } : {}),
    ...(status === 'resolved' ? { resolved_at: new Date().toISOString() } : {}),
  }
  const { data, error } = await supabaseAdmin.from('notifications').update(patch as never).eq('id', id).select('*').single()
  if (error) throw new MarketRepoError('updateNotification', error.message, error)
  return data as unknown as NotificationRow
}

export async function listOpportunities(): Promise<OpportunityRow[]> {
  const { data, error } = await supabaseAdmin.from('opportunities').select('*').order('created_at', { ascending: false }).limit(200)
  if (error) throw new MarketRepoError('listOpportunities', error.message, error)
  return (data ?? []) as unknown as OpportunityRow[]
}

export async function createOpportunityFromProperty(property: MarketPropertyRow, createdFrom = 'manual'): Promise<OpportunityRow> {
  const { data, error } = await supabaseAdmin
    .from('opportunities')
    .upsert({
      market_property_id: property.id,
      title: property.title ?? 'Bien à qualifier',
      description: `${property.city ?? ''} · ${formatPrice(property.price)} · ${(property.tags ?? []).join(', ')}`,
      stage: 'À qualifier',
      priority: (property.opportunity_score ?? 0) >= 70 ? 'high' : 'medium',
      signal_type: (property.tags ?? [])[0] ?? 'market_signal',
      next_action: property.recommended_action ?? null,
      created_from: createdFrom,
    } as never, { onConflict: 'market_property_id' })
    .select('*')
    .single()

  if (error) throw new MarketRepoError('createOpportunityFromProperty', error.message, error)
  return data as unknown as OpportunityRow
}

export async function createOpportunity(propertyId: string): Promise<OpportunityRow> {
  const property = await getMarketProperty(propertyId)
  if (!property) throw new MarketRepoError('createOpportunity', 'Bien introuvable')
  return createOpportunityFromProperty(property, 'manual')
}

export async function updateOpportunity(id: string, patch: Partial<Pick<OpportunityRow, 'stage' | 'priority' | 'next_action' | 'note'>>): Promise<OpportunityRow> {
  const { data, error } = await supabaseAdmin.from('opportunities').update(patch as never).eq('id', id).select('*').single()
  if (error) throw new MarketRepoError('updateOpportunity', error.message, error)
  return data as unknown as OpportunityRow
}

function integer(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value)
  return null
}

function daysOnline(value?: string | null): number | null {
  if (!value) return null
  const t = new Date(value).getTime()
  if (!Number.isFinite(t)) return null
  return Math.max(0, Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24)))
}

function formatPrice(value: number | null): string {
  return value == null ? 'prix non renseigné' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
}

export class MarketRepoError extends Error {
  readonly fn: string
  readonly cause: unknown

  constructor(fn: string, message: string, cause?: unknown) {
    super(`[market-repo:${fn}] ${message}`)
    this.name = 'MarketRepoError'
    this.fn = fn
    this.cause = cause
  }
}
