import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { previewListings } from '@/lib/stream-estate'
import { getAvailableStreamEstateItems, getStreamEstateBudgetSnapshot } from '@/lib/stream-estate-budget'

const ZIPCODE_RE = /^\d{5}$/

function readMaxItems(body: Record<string, unknown> | null | undefined, fallback: number): number {
  const raw = body?.max_items ?? body?.maxItems ?? body?.max_requests_per_sync ?? body?.maxRequestsPerSync
  const parsed = typeof raw === 'number' ? raw : Number(raw)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(1, Math.floor(parsed))
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const zipcode = body?.zipcode

    if (typeof zipcode !== 'string' || !ZIPCODE_RE.test(zipcode)) {
      return NextResponse.json({ error: 'zipcode invalide : un seul code postal à 5 chiffres est attendu' }, { status: 400 })
    }

    const budget = await getStreamEstateBudgetSnapshot()
    const requestedMaxItems = readMaxItems(body as Record<string, unknown>, budget.maxItemsPerSync)
    const effectiveMaxItems = Math.min(requestedMaxItems, budget.maxItemsPerSync)

    // Comptage via itemsPerPage=0 (gratuit en facturation à l'item). On prend l'INSEE fourni
    // par le client (commune visée dans le panneau) en priorité, sinon on retombe sur la zone
    // CP existante. On évite `.maybeSingle()` qui plante dès que deux communes partagent un CP.
    const rawInsee = (body as Record<string, unknown>)?.insee_code ?? (body as Record<string, unknown>)?.inseeCode
    let inseeCode: string | null =
      typeof rawInsee === 'string' && /^\d{5}$/.test(rawInsee) ? rawInsee : null

    if (!inseeCode) {
      const { data: zoneRows } = await supabaseAdmin
        .from('monitored_zones')
        .select('insee_code')
        .eq('zipcode', zipcode)
        .order('created_at', { ascending: true })
        .limit(1)
      inseeCode = (zoneRows?.[0]?.insee_code as string | null) ?? null
    }

    const preview = await previewListings({ zipcode, inseeCode })
    const estimatedItems = Math.min(preview.totalAvailable, effectiveMaxItems)
    const estimatedCostEur = estimatedItems * budget.costPerItemEur
    const availableItems = Math.min(budget.maxItemsPerSync, getAvailableStreamEstateItems(budget))
    const spendable = Math.max(0, budget.estimatedBalanceEur - budget.minBalanceEur)
    const maxItemsBlocked = requestedMaxItems > budget.maxItemsPerSync

    return NextResponse.json({
      zipcode,
      requested_max_items: requestedMaxItems,
      budget_max_items_per_sync: budget.maxItemsPerSync,
      effective_max_items: effectiveMaxItems,
      max_items: effectiveMaxItems,
      total_available: preview.totalAvailable,
      estimated_items: estimatedItems,
      estimated_cost_eur: estimatedCostEur,
      estimated_balance_after: Math.max(0, budget.manualBalanceEur - budget.estimatedSpentTotalEur - estimatedCostEur),
      sync_enabled: budget.syncEnabled,
      can_confirm: budget.syncEnabled && availableItems >= 1 && estimatedCostEur <= spendable && !maxItemsBlocked,
      blocked_reason: !budget.syncEnabled
        ? 'stream_estate_sync_disabled'
        : maxItemsBlocked
          ? 'stream_estate_max_items_exceeded'
          : availableItems < 1 || estimatedCostEur > spendable
          ? 'stream_estate_budget_insufficient'
          : null,
      cost_per_item_eur: budget.costPerItemEur,
      min_balance_eur: budget.minBalanceEur,
      estimated_balance_eur: budget.estimatedBalanceEur,
    })
  } catch (e) {
    const errMsg = e instanceof Error ? e.message : String(e)
    console.error('[API /market/sync-preview]', errMsg)
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
