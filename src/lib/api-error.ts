export function formatInternalApiError(error: unknown): string {
  const message = error instanceof Error ? error.message : 'Erreur serveur'

  if (
    message.includes("Could not find the table 'public.monitored_zones'")
    || message.includes("Could not find the table 'public.market_properties'")
    || message.includes('schema cache')
  ) {
    return 'Migration Supabase du MVP marché non appliquée : exécuter supabase/migrations/003_market_mvp.sql dans le SQL Editor Supabase.'
  }

  return message
}
