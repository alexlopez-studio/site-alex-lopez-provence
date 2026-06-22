// ═══════════════════════════════════════════════════════════════
// MandatFinder — Suivi ciblé des leads connus (économie de crédits)
// Au lieu de re-scanner toute la zone (on re-paierait tous les items),
// on re-récupère NOS annonces actives une par une par leur id
// (~1 item chacune) pour détecter baisse de prix / retrait, puis on
// re-score. Cf. mémoire stream-estate-credit-optimization.
// ═══════════════════════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabase'
import { fetchListingStatusById } from '@/lib/stream-estate'
import {
  getStreamEstateBudgetSnapshot,
  getAvailableStreamEstateItems,
  recordStreamEstateUsageEvent,
} from '@/lib/stream-estate-budget'
import { rescoreAndPersist } from './mandate-score-persist'

export interface LeadMonitorResult {
  skipped: boolean
  reason?: string
  checked: number
  price_changes: number
  expired: number
  billed_items: number
  estimated_cost_eur: number
}

const TERMINAL_STATUSES = ['expired', 'removed', 'sold', 'vendu']

/**
 * Re-vérifie l'état des leads connus actifs (prix + retrait) via l'endpoint
 * par-id, dans la limite du budget Stream Estate. Best-effort, par bien.
 */
export async function monitorKnownLeads(maxLeads = 200): Promise<LeadMonitorResult> {
  const empty: LeadMonitorResult = {
    skipped: true, checked: 0, price_changes: 0, expired: 0, billed_items: 0, estimated_cost_eur: 0,
  }

  const snapshot = await getStreamEstateBudgetSnapshot()
  if (!snapshot.syncEnabled) return { ...empty, reason: 'stream_estate_sync_disabled' }

  const available = getAvailableStreamEstateItems(snapshot)
  if (available < 1) return { ...empty, reason: 'stream_estate_budget_insufficient' }

  const limit = Math.min(maxLeads, available)
  const { data: leads, error } = await supabaseAdmin
    .from('market_properties')
    .select('id, external_id, zipcode, price, status')
    .eq('source', 'stream_estate')
    .not('status', 'in', `(${TERMINAL_STATUSES.join(',')})`)
    .order('scored_at', { ascending: true, nullsFirst: true })
    .limit(limit)

  if (error) {
    console.error('[monitorKnownLeads] lecture leads:', error.message)
    return { ...empty, reason: 'read_error' }
  }
  if (!leads || leads.length === 0) {
    return { ...empty, skipped: false }
  }

  const cost = snapshot.costPerItemEur
  let checked = 0
  let priceChanges = 0
  let expiredCount = 0
  let billed = 0

  for (const lead of leads) {
    if (!lead.external_id) continue
    const startedAt = new Date().toISOString()
    let detail
    try {
      detail = await fetchListingStatusById(lead.external_id)
    } catch (e) {
      await recordStreamEstateUsageEvent({
        syncRunId: null, zipcode: lead.zipcode ?? '', endpoint: '/documents/properties/{id}',
        page: 1, requestStatus: 'error', itemCount: 0, estimatedCostEur: 0,
        startedAt, finishedAt: new Date().toISOString(),
        errorMessage: e instanceof Error ? e.message : 'unknown',
      })
      continue
    }

    billed++
    checked++
    await recordStreamEstateUsageEvent({
      syncRunId: null, zipcode: lead.zipcode ?? '', endpoint: '/documents/properties/{id}',
      page: 1, requestStatus: 'success', itemCount: 1, estimatedCostEur: cost,
      startedAt, finishedAt: new Date().toISOString(),
    })

    const now = new Date().toISOString()

    if (detail === null || detail.expired) {
      await supabaseAdmin
        .from('market_properties')
        .update({ status: 'expired', expired_at: now, last_seen_at: now })
        .eq('id', lead.id)
      expiredCount++
    } else {
      const newPrice = detail.price ?? null
      if (newPrice != null && lead.price != null && newPrice !== lead.price) {
        await supabaseAdmin.from('property_price_history').insert({
          market_property_id: lead.id,
          old_price: lead.price,
          new_price: newPrice,
          variation_amount: newPrice - lead.price,
          variation_percent: lead.price > 0
            ? Math.round(((newPrice - lead.price) / lead.price) * 10000) / 100
            : 0,
        })
        priceChanges++
      }
      await supabaseAdmin
        .from('market_properties')
        .update({ price: newPrice ?? lead.price, last_seen_at: now })
        .eq('id', lead.id)
    }

    // Re-score + alerte éventuelle (passage hot/golden).
    await rescoreAndPersist(lead.id)
  }

  return {
    skipped: false,
    checked,
    price_changes: priceChanges,
    expired: expiredCount,
    billed_items: billed,
    estimated_cost_eur: Math.round(billed * cost * 100) / 100,
  }
}
