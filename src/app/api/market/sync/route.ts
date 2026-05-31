import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { fetchListings } from '@/lib/stream-estate'

/**
 * POST /api/market/sync
 * Lance une synchronisation Stream Estate pour une zone surveillée.
 * Body : { zipcode: string }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const zipcode: string = body.zipcode

    if (!zipcode) {
      return NextResponse.json({ error: 'zipcode requis' }, { status: 400 })
    }

    // 1. Créer ou récupérer la zone surveillée
    const { data: existingZone } = await supabaseAdmin
      .from('monitored_zones')
      .select('id')
      .eq('zipcode', zipcode)
      .maybeSingle()

    let zoneId: string
    if (existingZone) {
      zoneId = existingZone.id
    } else {
      const { data: created } = await supabaseAdmin
        .from('monitored_zones')
        .insert({ name: `Zone ${zipcode}`, zipcode, sync_frequency: 'manual' })
        .select('id')
        .single()

      if (!created) {
        return NextResponse.json({ error: 'Impossible de créer la zone' }, { status: 500 })
      }
      zoneId = created.id
    }

    // 2. Journal de synchronisation
    const { data: syncRun } = await supabaseAdmin
      .from('sync_runs')
      .insert({
        zone_id: zoneId,
        provider: 'stream_estate',
        status: 'running',
        started_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    const syncId = syncRun?.id

    try {
      // 3. Appel Stream Estate
      const result = await fetchListings({ zipcode })
      const { listings } = result

      let createdCount = 0
      let updatedCount = 0

      // 4. Upsert des biens dans market_properties
      for (const listing of listings) {
        const externalId = listing.externalId || listing.id

        // Vérifier si le bien existe déjà
        const { data: existing } = await supabaseAdmin
          .from('market_properties')
          .select('id, price')
          .eq('external_id', externalId)
          .eq('source', 'stream_estate')
          .maybeSingle()

        if (existing) {
          // Mise à jour
          await supabaseAdmin
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
              url: listing.url ?? null,
              raw_json: (listing.raw ?? {}) as never,
            })
            .eq('id', existing.id)

          // Détection variation de prix
          if (existing.price != null && listing.price != null && existing.price !== listing.price) {
            await supabaseAdmin
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
          }

          updatedCount++
        } else {
          // Création
          const pricePerM2 =
            listing.price && listing.surface && listing.surface > 0
              ? Math.round(listing.price / listing.surface)
              : null

          const { data: newProperty } = await supabaseAdmin
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
              published_at: listing.publishedAt ?? null,
              raw_json: (listing.raw ?? {}) as never,
            })
            .select('id')
            .single()

          // Tag automatique "Nouvelle annonce"
          if (newProperty?.id) {
            await supabaseAdmin
              .from('property_tags')
              .insert({
                market_property_id: newProperty.id,
                tag: 'Nouvelle annonce',
                source: 'system',
              })
          }

          createdCount++
        }
      }

      // 5. Marquer les biens non vus comme expirés (sera fait par un job planifié)
      // Note MVP : les biens expirés sont détectés lors des synchronisations suivantes.

      // 6. Exécuter les règles actives
      await executeRulesForZone(zoneId)

      // 7. Mettre à jour le journal
      if (syncId) {
        await supabaseAdmin
          .from('sync_runs')
          .update({
            status: 'success',
            finished_at: new Date().toISOString(),
            fetched_count: listings.length,
            created_count: createdCount,
            updated_count: updatedCount,
          })
          .eq('id', syncId)
      }

      // 8. Mettre à jour last_synced_at de la zone
      await supabaseAdmin
        .from('monitored_zones')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('id', zoneId)

      return NextResponse.json({
        success: true,
        zone_id: zoneId,
        sync_id: syncId,
        fetched: listings.length,
        created: createdCount,
        updated: updatedCount,
      })
    } catch (err) {
      // Erreur pendant la sync
      if (syncId) {
        await supabaseAdmin
          .from('sync_runs')
          .update({
            status: 'error',
            finished_at: new Date().toISOString(),
            error_message: String(err),
          })
          .eq('id', syncId)
      }
      throw err
    }
  } catch (e) {
    console.error('[API /market/sync]', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
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