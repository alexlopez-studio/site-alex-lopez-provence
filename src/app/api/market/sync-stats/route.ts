import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/market/sync-stats
 * Agrège les statistiques de consommation Stream Estate et la fraîcheur par zone.
 */
export async function GET() {
  try {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString()

    // Tous les sync_runs (cap 2000 pour éviter de charger trop)
    const { data: allRuns } = await supabaseAdmin
      .from('sync_runs')
      .select('id, zone_id, started_at, fetched_count, status')
      .order('started_at', { ascending: false })
      .limit(2000)

    const runs = allRuns ?? []
    const todayRuns = runs.filter((r) => (r.started_at ?? '') >= todayStart)
    const monthRuns = runs.filter((r) => (r.started_at ?? '') >= monthStart)

    const total_syncs = runs.length
    const syncs_today = todayRuns.length
    const syncs_this_month = monthRuns.length
    const properties_fetched_total = runs.reduce((s, r) => s + (r.fetched_count ?? 0), 0)
    const properties_fetched_today = todayRuns.reduce((s, r) => s + (r.fetched_count ?? 0), 0)
    const properties_fetched_month = monthRuns.reduce((s, r) => s + (r.fetched_count ?? 0), 0)
    const last_sync_at = runs[0]?.started_at ?? null

    // Sparkline : appels par jour sur les 30 derniers jours
    const sparklineMap: Record<string, { syncs: number; fetched: number }> = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000)
      const key = d.toISOString().slice(0, 10)
      sparklineMap[key] = { syncs: 0, fetched: 0 }
    }
    for (const run of runs.filter((r) => (r.started_at ?? '') >= thirtyDaysAgo)) {
      const key = (run.started_at ?? '').slice(0, 10)
      if (sparklineMap[key]) {
        sparklineMap[key].syncs++
        sparklineMap[key].fetched += run.fetched_count ?? 0
      }
    }
    const sparkline = Object.entries(sparklineMap).map(([date, v]) => ({ date, ...v }))

    // Zones avec statut de fraîcheur et nombre de biens
    const { data: zones } = await supabaseAdmin
      .from('monitored_zones')
      .select('id, name, zipcode, city, last_synced_at, active, sync_frequency')
      .order('created_at', { ascending: true })

    const zoneStats = await Promise.all(
      (zones ?? []).map(async (zone) => {
        // Dernier run pour cette zone
        const lastRun = runs.find((r) => r.zone_id === zone.id)

        // Nombre de biens en base pour ce code postal
        const { count: property_count } = await supabaseAdmin
          .from('market_properties')
          .select('id', { count: 'exact', head: true })
          .eq('zipcode', zone.zipcode)

        return {
          zone_id: zone.id,
          name: zone.name,
          zipcode: zone.zipcode,
          city: zone.city,
          last_synced_at: zone.last_synced_at,
          active: zone.active,
          sync_frequency: zone.sync_frequency,
          last_sync_status: lastRun?.status ?? null,
          property_count: property_count ?? 0,
        }
      }),
    )

    return NextResponse.json({
      total_syncs,
      syncs_today,
      syncs_this_month,
      properties_fetched_total,
      properties_fetched_today,
      properties_fetched_month,
      last_sync_at,
      sparkline,
      zones: zoneStats,
    })
  } catch (e) {
    console.error('[API /market/sync-stats]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
