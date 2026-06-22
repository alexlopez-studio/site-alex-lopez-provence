import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchListings, StreamEstateRequestLimitError } from '@/lib/stream-estate'
import { runMatchingForProperty } from '@/lib/market/matching-engine'
import { rescoreAndPersist } from '@/lib/market/mandate-score-persist'
import { getSetting } from '@/lib/settings'
import {
  canSpendStreamEstateItems,
  getAvailableStreamEstateItems,
  getStreamEstateBudgetSnapshot,
  recordStreamEstateUsageEvent,
} from '@/lib/stream-estate-budget'

const ZIPCODE_RE = /^\d{5}$/

// Moteur de règles `management_rules` neutralisé : le mandate_score est la source de
// vérité (motivation + dimensions + alertes). Les règles seed à conditions vides
// généraient un bruit massif de notifications `rule_triggered`. Réversible : passer à true.
const RULES_ENGINE_ENABLED = false

// Fenêtre anti-re-sync : on ne re-synchronise pas une zone vue récemment (0 appel API).
const STREAM_ESTATE_RESYNC_WINDOW_KEY = 'stream_estate_resync_window_minutes'
const DEFAULT_RESYNC_WINDOW_MINUTES = 360 // 6 h

async function getResyncWindowMinutes(): Promise<number> {
  const raw = await getSetting<number>(STREAM_ESTATE_RESYNC_WINDOW_KEY, DEFAULT_RESYNC_WINDOW_MINUTES)
  const n = typeof raw === 'number' ? raw : Number(raw)
  return Number.isFinite(n) ? Math.max(0, Math.floor(n)) : DEFAULT_RESYNC_WINDOW_MINUTES
}

function errorResponse(error: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error, ...extra }, { status })
}

function estimatedBalanceAfter(manualBalanceEur: number, totalSpentEur: number, currentRunCostEur: number) {
  return Math.max(0, manualBalanceEur - totalSpentEur - currentRunCostEur)
}

async function updateSyncRun(syncId: string | undefined, payload: Record<string, unknown>) {
  if (!syncId) return
  const { error } = await supabaseAdmin
    .from('sync_runs')
    .update(payload as never)
    .eq('id', syncId)

  if (error) {
    console.error('[API /market/sync] sync_run update failed:', error.message)
  }
}

async function createSyncRun(zoneId: string, status: 'running' | 'blocked', blockedReason?: string) {
  const now = new Date().toISOString()

  const fullPayload = {
    zone_id: zoneId,
    provider: 'stream_estate',
    status,
    started_at: now,
    finished_at: status === 'blocked' ? now : null,
    fetched_count: 0,
    created_count: 0,
    updated_count: 0,
    external_request_count: 0,
    external_item_count: 0,
    estimated_cost_eur: 0,
    blocked_reason: blockedReason ?? null,
    error_message: blockedReason ?? null,
  }

  const legacyPayload = {
    zone_id: zoneId,
    provider: 'stream_estate',
    status,
    started_at: now,
    finished_at: status === 'blocked' ? now : null,
    fetched_count: 0,
    created_count: 0,
    updated_count: 0,
    error_message: blockedReason ?? null,
  }

  let { data, error } = await supabaseAdmin
    .from('sync_runs')
    .insert(fullPayload as never)
    .select('id')
    .single()

  if (error) {
    const retry = await supabaseAdmin
      .from('sync_runs')
      .insert(legacyPayload as never)
      .select('id')
      .single()
    data = retry.data
    error = retry.error
  }

  if (error) {
    throw new Error(`Impossible de créer le journal de synchronisation: ${error.message}`)
  }

  return data?.id as string | undefined
}

function readMaxItems(body: Record<string, unknown> | null | undefined, fallback: number): number {
  const raw = body?.max_items ?? body?.maxItems ?? body?.max_requests_per_sync ?? body?.maxRequestsPerSync
  const parsed = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(1, Math.floor(parsed))
}

type ZoneInfo = { id: string; inseeCode: string | null; lastSyncedAt: string | null }

type ZoneLookup = { zipcode: string; inseeCode?: string | null; name?: string | null; city?: string | null }

/**
 * Identifie la zone à synchroniser. Une commune (code INSEE) est l'identité fine :
 * plusieurs communes peuvent partager un même code postal, donc on cible d'abord par INSEE
 * quand il est connu, et seulement sinon par CP (zone « catch-all » sans INSEE).
 * On évite `.maybeSingle()` qui plante dès que deux zones partagent un CP.
 */
async function getOrCreateZone({ zipcode, inseeCode, name, city }: ZoneLookup): Promise<ZoneInfo> {
  const normalizedInsee = inseeCode && /^\d{5}$/.test(inseeCode) ? inseeCode : null

  const baseSelect = supabaseAdmin
    .from('monitored_zones')
    .select('id, insee_code, last_synced_at')

  const query = normalizedInsee
    ? baseSelect.eq('insee_code', normalizedInsee)
    : baseSelect.eq('zipcode', zipcode).is('insee_code', null)

  const { data: matches } = await query
    .order('created_at', { ascending: true })
    .limit(1)

  const existingZone = matches?.[0]
  if (existingZone) {
    return {
      id: existingZone.id as string,
      inseeCode: (existingZone.insee_code as string | null) ?? null,
      lastSyncedAt: (existingZone.last_synced_at as string | null) ?? null,
    }
  }

  const { data: created } = await supabaseAdmin
    .from('monitored_zones')
    .insert({
      name: name?.trim() || (city?.trim() ? city.trim() : `Zone ${zipcode}`),
      zipcode,
      city: city?.trim() || null,
      insee_code: normalizedInsee,
      sync_frequency: 'manual',
    })
    .select('id, insee_code, last_synced_at')
    .single()

  if (!created) {
    throw new Error('Impossible de créer la zone')
  }

  return { id: created.id as string, inseeCode: (created.insee_code as string | null) ?? null, lastSyncedAt: null }
}

/**
 * POST /api/market/sync
 * Lance une synchronisation Stream Estate pour une zone surveillée.
 * Body : { zipcode: string, max_items?: number }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const zipcode = body?.zipcode

    if (typeof zipcode !== 'string' || !ZIPCODE_RE.test(zipcode)) {
      return errorResponse('zipcode invalide : un seul code postal à 5 chiffres est attendu', 400)
    }

    const budget = await getStreamEstateBudgetSnapshot()
    const force = (body as Record<string, unknown>)?.force === true
    const rawInsee = (body as Record<string, unknown>)?.insee_code ?? (body as Record<string, unknown>)?.inseeCode
    const inseeCode = typeof rawInsee === 'string' && /^\d{5}$/.test(rawInsee) ? rawInsee : null
    const rawName = (body as Record<string, unknown>)?.name
    const rawCity = (body as Record<string, unknown>)?.city
    const zone = await getOrCreateZone({
      zipcode,
      inseeCode,
      name: typeof rawName === 'string' ? rawName : null,
      city: typeof rawCity === 'string' ? rawCity : null,
    })
    const zoneId = zone.id

    // 0. Garde-fou anti-re-sync : zone synchronisée récemment → on renvoie la base, 0 appel API.
    if (!force && zone.lastSyncedAt) {
      const windowMinutes = await getResyncWindowMinutes()
      const ageMs = Date.now() - new Date(zone.lastSyncedAt).getTime()
      if (windowMinutes > 0 && Number.isFinite(ageMs) && ageMs >= 0 && ageMs < windowMinutes * 60_000) {
        const cacheCountQuery = supabaseAdmin
          .from('market_properties')
          .select('id', { count: 'exact', head: true })
          .eq('source', 'stream_estate')
        const { count } = await (zone.inseeCode
          ? cacheCountQuery.eq('insee_code', zone.inseeCode)
          : cacheCountQuery.eq('zipcode', zipcode))
        return NextResponse.json({
          success: true,
          from_cache: true,
          skipped_reason: 'recently_synced',
          zone_id: zoneId,
          last_synced_at: zone.lastSyncedAt,
          resync_window_minutes: windowMinutes,
          fetched: count ?? 0,
          created: 0,
          updated: 0,
          external_requests: 0,
          billed_items: 0,
          estimated_cost_eur: 0,
          estimated_balance_after: budget.estimatedBalanceEur,
        })
      }
    }

    if (!budget.syncEnabled) {
      const syncId = await createSyncRun(zoneId, 'blocked', 'stream_estate_sync_disabled')
      return errorResponse('Synchronisation Stream Estate désactivée', 403, {
        sync_id: syncId,
        blocked_reason: 'stream_estate_sync_disabled',
        estimated_items: 0,
        external_requests: 0,
        fetched: 0,
        billed_items: 0,
        estimated_cost_eur: 0,
        estimated_balance_after: budget.estimatedBalanceEur,
      })
    }

    const availableItems = Math.min(
      budget.maxItemsPerSync,
      getAvailableStreamEstateItems(budget),
    )

    if (availableItems < 1) {
      const syncId = await createSyncRun(zoneId, 'blocked', 'stream_estate_budget_insufficient')
      return errorResponse('Budget Stream Estate insuffisant', 402, {
        sync_id: syncId,
        blocked_reason: 'stream_estate_budget_insufficient',
        estimated_items: 0,
        external_requests: 0,
        fetched: 0,
        billed_items: 0,
        estimated_cost_eur: 0,
        estimated_balance_after: budget.estimatedBalanceEur,
      })
    }

    // maxItems borné par le budget disponible → plus besoin d'un appel preview facturé séparé.
    const requestedMaxItems = Math.min(
      readMaxItems(body as Record<string, unknown>, budget.maxItemsPerSync),
      budget.maxItemsPerSync,
    )
    const maxItems = Math.min(requestedMaxItems, availableItems)

    const syncId = await createSyncRun(zoneId, 'running')
    let externalRequestCount = 0
    let estimatedCostEur = 0
    let billedItemCount = 0

    try {
      // 3. Appel Stream Estate
      const result = await fetchListings({
        zipcode,
        inseeCode: zone.inseeCode,
        maxItems,
        beforeRequest: async () => {
          const allowed = await canSpendStreamEstateItems()
          if (!allowed.ok) {
            throw new StreamEstateRequestLimitError(allowed.reason, allowed.reason)
          }
        },
        onRequest: async (event) => {
          externalRequestCount++
          billedItemCount += event.itemCount
          estimatedCostEur += event.itemCount * budget.costPerItemEur
          await recordStreamEstateUsageEvent({
            syncRunId: syncId ?? null,
            zipcode,
            endpoint: event.endpoint,
            page: event.page,
            requestStatus: event.requestStatus,
            itemCount: event.itemCount,
            estimatedCostEur: event.itemCount * budget.costPerItemEur,
            startedAt: event.startedAt,
            finishedAt: event.finishedAt,
            errorMessage: event.errorMessage ?? null,
          })
        },
      })
      const listings = result.listings
      // totalAvailable provient de la page 1 (hydra:totalItems) → estimation sans appel séparé.
      const estimatedItems = Math.min(result.totalAvailable, maxItems)

      let createdCount = 0
      let updatedCount = 0
      const skippedCount = 0

      // 4. Upsert des biens dans market_properties
      for (const listing of listings) {
        const externalId = listing.externalId || listing.id

        // Vérifier si le bien existe déjà
        const { data: existing, error: existingError } = await supabaseAdmin
          .from('market_properties')
          .select('id, price, published_at, seller_type')
          .eq('external_id', externalId)
          .eq('source', 'stream_estate')
          .maybeSingle()

        if (existingError) {
          throw new Error(`Lecture bien ${externalId} impossible: ${existingError.message}`)
        }

        if (existing) {
          // Mise à jour
          const { error: updateError } = await supabaseAdmin
            .from('market_properties')
            .update({
              title: listing.title ?? null,
              description: listing.description ?? null,
              price: listing.price ?? null,
              surface: listing.surface ?? null,
              land_surface: listing.landSurface ?? null,
              rooms: listing.rooms ?? null,
              bedrooms: listing.bedrooms ?? null,
              dpe: listing.dpe ?? null,
              ges: listing.ges ?? null,
              status: listing.status ?? 'active',
              last_seen_at: new Date().toISOString(),
              // published_at suit la date de publication courante (figée par
              // first_seen_at) : son avancée révèle une republication (axe Comportement).
              published_at: listing.publishedAt ?? existing.published_at ?? null,
              // seller_type : ne pas écraser une valeur connue si la découverte ne l'a pas.
              seller_type: listing.sellerType ?? existing.seller_type ?? null,
              url: listing.url ?? null,
              raw_json: (listing.raw ?? {}) as never,
            })
            .eq('id', existing.id)

          if (updateError) {
            throw new Error(`Mise à jour bien ${externalId} impossible: ${updateError.message}`)
          }

          // Détection variation de prix
          if (existing.price != null && listing.price != null && existing.price !== listing.price) {
            const { error: historyError } = await supabaseAdmin
              .from('property_price_history')
              .insert({
                market_property_id: existing.id,
                old_price: existing.price,
                new_price: listing.price,
                variation_amount: listing.price - existing.price,
                variation_percent: existing.price > 0
                  ? Math.round(((listing.price - existing.price) / existing.price) * 10000) / 100
                  : 0,
              })

            if (historyError) {
              throw new Error(`Historique prix ${externalId} impossible: ${historyError.message}`)
            }
          }

          // Recalcul + persistance du score, alerte si passage hot/golden.
          await rescoreAndPersist(existing.id)

          updatedCount++
        } else {
          // Création
          const pricePerM2 =
            listing.price && listing.surface && listing.surface > 0
              ? Math.round(listing.price / listing.surface)
              : null

          const { data: newProperty, error: insertError } = await supabaseAdmin
            .from('market_properties')
            .insert({
              external_id: externalId,
              source: 'stream_estate',
              title: listing.title ?? null,
              description: listing.description ?? null,
              city: listing.city ?? null,
              zipcode: listing.zipcode ?? zipcode,
              insee_code: listing.inseeCode ?? null,
              lat: listing.lat ?? null,
              lon: listing.lon ?? null,
              property_type: listing.propertyType ?? null,
              price: listing.price ?? null,
              surface: listing.surface ?? null,
              price_per_m2: pricePerM2,
              land_surface: listing.landSurface ?? null,
              rooms: listing.rooms ?? null,
              bedrooms: listing.bedrooms ?? null,
              dpe: listing.dpe ?? null,
              ges: listing.ges ?? null,
              url: listing.url ?? null,
              status: listing.status ?? 'active',
              first_seen_at: listing.publishedAt || new Date().toISOString(),
              last_seen_at: new Date().toISOString(),
              published_at: listing.publishedAt || null,
              seller_type: listing.sellerType ?? null,
              raw_json: (listing.raw ?? {}) as never,
            })
            .select('id')
            .single()

          if (insertError) {
            throw new Error(`Création bien ${externalId} impossible: ${insertError.message}`)
          }

          // Tag automatique "Nouvelle annonce"
          if (newProperty?.id) {
            const { error: tagError } = await supabaseAdmin
              .from('property_tags')
              .insert({
                market_property_id: newProperty.id,
                tag: 'Nouvelle annonce',
                source: 'system',
              })

            if (tagError) {
              throw new Error(`Tag bien ${externalId} impossible: ${tagError.message}`)
            }

            // Lancer le matching automatique contre les acheteurs
            runMatchingForProperty(newProperty.id, 'market').then(async (matches) => {
              // Créer des notifications pour les bons matchs (score ≥ 60)
              const goodMatches = matches.filter((m) => m.score >= 60)
              if (goodMatches.length === 0) return

              const { data: propertyInfo } = await supabaseAdmin
                .from('market_properties')
                .select('title, city, price')
                .eq('id', newProperty.id)
                .single()

              const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

              for (const match of goodMatches) {
                await supabaseAdmin.from('notifications').insert({
                  type: 'matching_buyer',
                  title: `Nouveau bien matché pour un acheteur`,
                  message: `${propertyInfo?.title ?? 'Nouveau bien'} à ${propertyInfo?.city ?? ''} — ${propertyInfo?.price ? formatter.format(propertyInfo.price) : ''} — Score: ${match.score}%`,
                  priority: match.score >= 80 ? 'high' : 'medium',
                  market_property_id: newProperty.id,
                  status: 'unread',
                  action_label: 'Voir le matching',
                } as never)
              }
            }).catch((err) =>
              console.error('[Sync] Erreur matching auto pour nouveau bien:', err)
            )

            // Notification déterministe « nouveau bien » (push in-app, type new_listing).
            const fmtPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
            const isPap = listing.sellerType === 'individual'
            const where = [listing.city, listing.zipcode ?? zipcode].filter(Boolean).join(' ')
            const sellerLabel = isPap ? ' · Particulier' : listing.sellerType === 'agency' ? ' · Agence' : ''
            const { error: newListingNotifError } = await supabaseAdmin.from('notifications').insert({
              type: 'new_listing',
              title: `Nouveau bien : ${listing.title ?? 'annonce'}`,
              message: `${where}${listing.price ? ` — ${fmtPrice.format(listing.price)}` : ''}${sellerLabel}`,
              priority: isPap ? 'high' : 'medium',
              market_property_id: newProperty.id,
              status: 'unread',
              action_label: 'Voir le bien',
            } as never)
            if (newListingNotifError) {
              console.error(`[Sync] Notif nouveau bien ${externalId} impossible:`, newListingNotifError.message)
            }
          }

          // Score initial persisté (alerte possible si déjà hot/golden à la 1re vue).
          if (newProperty?.id) await rescoreAndPersist(newProperty.id)

          createdCount++
        }
      }

      // 5. Marquer les biens non vus comme expirés (sera fait par un job planifié)
      // Note MVP : les biens expirés sont détectés lors des synchronisations suivantes.

      // 6. Exécuter les règles actives (neutralisé — cf. RULES_ENGINE_ENABLED)
      if (RULES_ENGINE_ENABLED) {
        await executeRulesForZone(zoneId)
      }

      // 7. Mettre à jour le journal
      const syncStatus = result.truncated ? 'blocked' : 'success'
      const blockedReason = result.truncated ? 'stream_estate_item_limit_reached' : null

      if (syncId) {
        await updateSyncRun(syncId, {
          status: syncStatus,
          finished_at: new Date().toISOString(),
          fetched_count: listings.length,
          external_item_count: billedItemCount,
          created_count: createdCount,
          updated_count: updatedCount,
          external_request_count: externalRequestCount,
          estimated_cost_eur: estimatedCostEur,
          blocked_reason: blockedReason,
        })
      }

      // 8. Mettre à jour last_synced_at de la zone
      await supabaseAdmin
        .from('monitored_zones')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('id', zoneId)

      return NextResponse.json({
        success: true,
        partial: result.truncated,
        blocked_reason: blockedReason,
        zone_id: zoneId,
        sync_id: syncId,
        fetched: listings.length,
        skipped: skippedCount,
        created: createdCount,
        updated: updatedCount,
        estimated_items: estimatedItems,
        external_requests: externalRequestCount,
        billed_items: billedItemCount,
        estimated_cost_eur: estimatedCostEur,
        estimated_balance_after: estimatedBalanceAfter(
          budget.manualBalanceEur,
          budget.estimatedSpentTotalEur,
          estimatedCostEur,
        ),
      })
    } catch (err) {
      // Erreur pendant la sync
      const errMsg = err instanceof Error ? err.message : String(err)
      if (syncId) {
        await updateSyncRun(syncId, {
          status: 'error',
          finished_at: new Date().toISOString(),
          error_message: errMsg,
          blocked_reason: null,
          external_request_count: externalRequestCount,
          external_item_count: billedItemCount,
          estimated_cost_eur: estimatedCostEur,
        })
      }
      return errorResponse(errMsg, 500, {
        blocked_reason: null,
        external_requests: externalRequestCount,
        billed_items: billedItemCount,
        estimated_cost_eur: estimatedCostEur,
        estimated_balance_after: estimatedBalanceAfter(
          budget.manualBalanceEur,
          budget.estimatedSpentTotalEur,
          estimatedCostEur,
        ),
      })
    }
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    console.error('[API /market/sync]', errMsg)
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}

// ── Exécution des règles ─────────────────────────────────────

async function executeRulesForZone(zoneId: string) {
  const { data: rules } = await supabaseAdmin
    .from('management_rules')
    .select('*')
    .eq('active', true)

  if (!rules || rules.length === 0) return

  // Récupérer les biens de la zone mis à jour dans la dernière heure
  const oneHourAgo = new Date(Date.now() - 3600000).toISOString()
  const { data: latestZone } = await supabaseAdmin
    .from('monitored_zones')
    .select('zipcode')
    .eq('id', zoneId)
    .single()

  if (!latestZone?.zipcode) return

  const { data: zoneProperties } = await supabaseAdmin
    .from('market_properties')
    .select('*')
    .eq('zipcode', latestZone.zipcode)
    .gte('updated_at', oneHourAgo)

  const propsToCheck = zoneProperties ?? []

  for (const rule of rules) {
    try {
      const conditions = rule.conditions_json as { all?: Array<{ field: string; operator: string; value: unknown }> } | null
      if (!conditions?.all) continue

      for (const property of propsToCheck) {
        const matches = conditions.all.every(cond => evaluateCondition(property as unknown as Record<string, unknown>, cond))
        if (!matches) continue

        const actions = rule.actions_json as { actions?: Array<{ type: string; value?: string; stage?: string; priority?: string }> } | null
        if (!actions?.actions) continue

        for (const action of actions.actions) {
          switch (action.type) {
            case 'add_tag':
              await supabaseAdmin.from('property_tags').upsert({
                market_property_id: property.id,
                tag: action.value ?? 'Signal',
                source: 'rule',
                rule_id: rule.id,
              } as never, { onConflict: 'market_property_id,tag' as never })
              break

            case 'create_notification':
              await supabaseAdmin.from('notifications').insert({
                type: 'rule_triggered',
                title: `Règle : ${rule.name}`,
                message: `${property.title ?? 'Bien'} à ${property.city ?? property.zipcode} — ${action.value ?? ''}`,
                priority: action.priority ?? 'medium',
                market_property_id: property.id,
                rule_id: rule.id,
              } as never)
              break

            case 'create_opportunity':
              await supabaseAdmin.from('opportunities').insert({
                market_property_id: property.id,
                title: `${property.title ?? 'Bien'} — ${rule.name}`,
                description: `Créé automatiquement par la règle "${rule.name}"`,
                stage: action.stage ?? 'À qualifier',
                priority: action.priority ?? 'medium',
                signal_type: rule.trigger_type,
                created_from: 'rule',
              } as never)
              break
          }
        }
      }

      // Mettre à jour last_run_at
      await supabaseAdmin
        .from('management_rules')
        .update({ last_run_at: new Date().toISOString() })
        .eq('id', rule.id)
    } catch (ruleErr) {
      console.error(`[executeRulesForZone] Rule "${rule.name}" failed:`, ruleErr)
    }
  }
}

// ── Évaluateur de condition ──────────────────────────────────

function evaluateCondition(
  property: Record<string, unknown>,
  condition: { field: string; operator: string; value: unknown },
): boolean {
  const { field, operator, value } = condition
  const fieldValue = property[field]

  switch (operator) {
    case 'equals':
      return fieldValue === value
    case 'not_equals':
      return fieldValue !== value
    case 'gt':
      return Number(fieldValue) > Number(value)
    case 'gte':
      return Number(fieldValue) >= Number(value)
    case 'lt':
      return Number(fieldValue) < Number(value)
    case 'lte':
      return Number(fieldValue) <= Number(value)
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue)
    case 'between':
      if (Array.isArray(value) && value.length === 2) {
        return Number(fieldValue) >= Number(value[0]) && Number(fieldValue) <= Number(value[1])
      }
      return false
    default:
      return false
  }
}
