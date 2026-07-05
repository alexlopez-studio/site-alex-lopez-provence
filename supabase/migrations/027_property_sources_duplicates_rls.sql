-- =============================================================
-- Migration 027 — Active la RLS sur market_property_sources et
-- market_property_duplicate_candidates (oubliée en migration 020).
--
-- Ces tables ne sont accédées que via supabaseAdmin (service_role) :
-- aucune policy n'est nécessaire, le service_role bypass la RLS.
-- Même convention que public.listings / listing_snapshots (migration 005).
-- =============================================================

alter table public.market_property_sources             enable row level security;
alter table public.market_property_duplicate_candidates enable row level security;
