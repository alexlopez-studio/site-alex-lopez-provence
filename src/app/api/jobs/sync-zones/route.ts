// ═══════════════════════════════════════════════════════════════
// Cron : sync récurrente des zones surveillées (pipeline market_properties)
// Itère monitored_zones et déclenche /api/market/sync par zone, en
// réutilisant TOUS les garde-fous existants (budget, fenêtre anti-re-sync).
//
// Contrairement à /api/jobs/import-stream-estate (qui alimente la table
// `listings` du monde radar mort), ce job alimente `market_properties`,
// la source de vérité sur laquelle tourne le mandate_score.
//
// Sécurité — deux filets pour « zéro crédit brûlé par surprise » :
//   1. STREAM_ESTATE_CRON_ENABLED doit valoir 'true' (défaut OFF) pour exécuter.
//      C'est l'interrupteur volontaire : sans lui, le job no-op (0 appel API).
//   2. Chaque /api/market/sync respecte le budget Stream Estate : si la sync
//      est désactivée ou le solde insuffisant, 0 item facturé.
// Auth cron : si CRON_SECRET est défini, l'en-tête Authorization Bearer est exigé.
// ═══════════════════════════════════════════════════════════════

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60 // limite plan Hobby Vercel

// Plafond de zones traitées par exécution (évite de dépasser maxDuration).
const MAX_ZONES_PER_RUN = 20

function resolveBaseUrl(req: NextRequest): string {
  if (process.env.SYNC_CRON_BASE_URL) return process.env.SYNC_CRON_BASE_URL.replace(/\/$/, '')
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  const proto = req.headers.get('x-forwarded-proto') ?? 'http'
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? 'localhost:3002'
  return `${proto}://${host}`
}

export async function GET(req: NextRequest) {
  // 1. Auth cron (si un secret est configuré).
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
  }

  // 2. Interrupteur volontaire. `?test=1` permet de tester l'orchestration à la
  //    main (les garde-fous budget restent actifs → reste sans danger).
  const isTest = new URL(req.url).searchParams.get('test') === '1'
  const cronEnabled = process.env.STREAM_ESTATE_CRON_ENABLED === 'true'
  if (!cronEnabled && !isTest) {
    console.log('[Cron sync-zones] désactivé (STREAM_ESTATE_CRON_ENABLED != true), arrêt.')
    return NextResponse.json({ success: true, skipped: true, reason: 'cron_disabled' })
  }

  const { data: zones, error } = await supabaseAdmin
    .from('monitored_zones')
    .select('id, zipcode, insee_code, name, city, active')
    .eq('active', true)
    .order('last_synced_at', { ascending: true, nullsFirst: true })
    .limit(MAX_ZONES_PER_RUN)

  if (error) {
    console.error('[Cron sync-zones] lecture zones impossible:', error.message)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  if (!zones || zones.length === 0) {
    return NextResponse.json({ success: true, zones: 0, results: [] })
  }

  const base = resolveBaseUrl(req)
  const results: Array<Record<string, unknown>> = []
  let totalCreated = 0
  let totalUpdated = 0
  let totalBilledItems = 0
  let totalCostEur = 0

  // Séquentiel : on respecte maxDuration et on laisse le budget se décrémenter
  // proprement entre zones (chaque appel relit le snapshot budget).
  for (const zone of zones) {
    try {
      const res = await fetch(`${base}/api/market/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          zipcode: zone.zipcode,
          insee_code: zone.insee_code,
          name: zone.name,
          city: zone.city,
        }),
      })
      const payload = await res.json().catch(() => ({}))
      const created = Number(payload?.created) || 0
      const updated = Number(payload?.updated) || 0
      const billed = Number(payload?.billed_items) || 0
      const cost = Number(payload?.estimated_cost_eur) || 0
      totalCreated += created
      totalUpdated += updated
      totalBilledItems += billed
      totalCostEur += cost
      results.push({
        zone_id: zone.id,
        zipcode: zone.zipcode,
        insee_code: zone.insee_code,
        status: res.status,
        from_cache: payload?.from_cache ?? false,
        skipped_reason: payload?.skipped_reason ?? payload?.blocked_reason ?? null,
        created,
        updated,
        billed_items: billed,
        estimated_cost_eur: cost,
      })
    } catch (e) {
      console.error(`[Cron sync-zones] échec zone ${zone.zipcode}:`, e)
      results.push({
        zone_id: zone.id,
        zipcode: zone.zipcode,
        status: 'error',
        error: e instanceof Error ? e.message : 'unknown',
      })
    }
  }

  console.log(
    `[Cron sync-zones] ${zones.length} zone(s) — ${totalCreated} créés, ${totalUpdated} MAJ, ` +
      `${totalBilledItems} items facturés (~${totalCostEur.toFixed(2)} €)`,
  )

  return NextResponse.json({
    success: true,
    test: isTest,
    zones: zones.length,
    totals: {
      created: totalCreated,
      updated: totalUpdated,
      billed_items: totalBilledItems,
      estimated_cost_eur: Math.round(totalCostEur * 100) / 100,
    },
    results,
  })
}
