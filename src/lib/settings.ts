// ═══════════════════════════════════════════════════════════════
// App Settings — paramètres clé/valeur persistés dans Supabase
// (table public.app_settings, voir migration 006)
// ═══════════════════════════════════════════════════════════════

import { supabaseAdmin } from '@/lib/supabase'
import type { Json } from '@/types/supabase'

export const MANDATFINDER_PIPELINE_ENABLED_KEY = 'mandatfinder_pipeline_enabled'

/**
 * Lit un paramètre par sa clé. Retourne `fallback` si la clé n'existe
 * pas ou si Supabase est inaccessible (ne doit jamais faire planter
 * un cron ou une API route).
 */
export async function getSetting<T extends Json>(key: string, fallback: T): Promise<T> {
    try {
        const { data, error } = await supabaseAdmin
            .from('app_settings')
            .select('value')
            .eq('key', key)
            .maybeSingle()

        if (error || !data) return fallback
        return (data.value as T) ?? fallback
    } catch (err) {
        console.error(`[settings] Erreur lecture "${key}":`, err)
        return fallback
    }
}

/**
 * Écrit (upsert) un paramètre.
 */
export async function setSetting(key: string, value: Json): Promise<void> {
    const { error } = await supabaseAdmin
        .from('app_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' })

    if (error) throw error
}

/**
 * Indique si le pipeline MandatFinder (import Stream Estate + scoring)
 * est activé. Par défaut `true` pour conserver le comportement actuel
 * si le paramètre n'existe pas encore.
 */
export async function isMandatFinderPipelineEnabled(): Promise<boolean> {
    return getSetting<boolean>(MANDATFINDER_PIPELINE_ENABLED_KEY, true)
}
