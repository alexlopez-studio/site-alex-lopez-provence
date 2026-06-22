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
import { monitorKnownLeads } from '@/lib/market/lead-monitor'

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

  // ── 3. Monitoring quotidien : suivi ciblé des leads connus (pas cher) ──
  // Re-fetch par-id de nos annonces actives → baisse de prix / retrait + re-score.
  const monitoring = await monitorKnownLeads()

  // ── 4. Découverte des nouveaux leads (scan de zone, coûteux, non ciblable) ──
  // Non ciblable → on l'espace : 1×/semaine (lundi, Europe/Paris) ou forcée via ?discover=1.
  const weekdayParis = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Paris', weekday: 'short' }).format(new Date())
  const discoverParam = new URL(req.url).searchParams.get('discover')
  const isDiscoveryDay = discoverParam !== '0' && (weekdayParis === 'Mon' || discoverParam === '1')

  const discovery: {
    ran: boolean
    zones: number
    totals: { created: number; updated: number; billed_items: number; estimated_cost_eur: number }
    results: Array<Record<string, unknown>>
  } = { ran: false, zones: 0, totals: { created: 0, updated: 0, billed_items: 0, estimated_cost_eur: 0 }, results: [] }

  if (isDiscoveryDay) {
    const { data: zones, error } = await supabaseAdmin
      .from('monitored_zones')
      .select('id, zipcode, insee_code, name, city, active')
      .eq('active', true)
      .order('last_synced_at', { ascending: true, nullsFirst: true })
      .limit(MAX_ZONES_PER_RUN)

    if (error) {
      console.error('[Cron sync-zones] lecture zones impossible:', error.message)
    } else if (zones && zones.length > 0) {
      discovery.ran = true
      discovery.zones = zones.length
      const base = resolveBaseUrl(req)
      // Séquentiel : respecte maxDuration et laisse le budget se décrémenter entre zones.
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
          discovery.totals.created += Number(payload?.created) || 0
          discovery.totals.updated += Number(payload?.updated) || 0
          discovery.totals.billed_items += Number(payload?.billed_items) || 0
          discovery.totals.estimated_cost_eur += Number(payload?.estimated_cost_eur) || 0
          discovery.results.push({
            zone_id: zone.id,
            zipcode: zone.zipcode,
            status: res.status,
            from_cache: payload?.from_cache ?? false,
            skipped_reason: payload?.skipped_reason ?? payload?.blocked_reason ?? null,
            created: Number(payload?.created) || 0,
            billed_items: Number(payload?.billed_items) || 0,
          })
        } catch (e) {
          console.error(`[Cron sync-zones] échec zone ${zone.zipcode}:`, e)
          discovery.results.push({ zone_id: zone.id, zipcode: zone.zipcode, status: 'error', error: e instanceof Error ? e.message : 'unknown' })
        }
      }
      discovery.totals.estimated_cost_eur = Math.round(discovery.totals.estimated_cost_eur * 100) / 100
    }
  }

  console.log(
    `[Cron sync-zones] monitoring: ${monitoring.checked} vérifiés, ${monitoring.price_changes} baisses, ` +
      `${monitoring.expired} retirés (~${monitoring.estimated_cost_eur} €) | découverte: ${discovery.ran ? `${discovery.zones} zone(s), ${discovery.totals.created} nouveaux` : 'non (hors jour)'}`,
  )

  return NextResponse.json({
    success: true,
    test: isTest,
    monitoring,
    discovery,
  })
}
