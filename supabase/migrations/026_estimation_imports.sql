-- =============================================================
-- Migration 026 — Import des pré-estimations / estimations
-- produites par la Skill Claude externe (claude.ai).
-- =============================================================

create table if not exists public.estimation_imports (
  id               uuid primary key default gen_random_uuid(),
  opportunity_id   uuid references public.opportunities(id) on delete set null,
  kind             text not null check (kind in ('pre_estimation', 'estimation')),
  source           text not null default 'claude_skill',
  contact_name     text,
  contact_email    text,
  contact_phone    text,
  property_address text,
  property_city    text,
  property_type    text,
  property_surface numeric(10,2),
  price_low        numeric(12,2),
  price_high       numeric(12,2),
  price_m2         numeric(10,2),
  confidence       numeric(5,2),
  summary          text,
  payload          jsonb not null,
  raw_filename     text,
  raw_format       text,
  created_at       timestamptz not null default now()
);

create index if not exists estimation_imports_opportunity_idx on public.estimation_imports(opportunity_id);
create index if not exists estimation_imports_created_at_idx on public.estimation_imports(created_at desc);

alter table public.estimation_imports enable row level security;

-- Écritures uniquement via service_role (endpoint d'import) : pas de policy insert
-- pour anon/authenticated. Lecture ouverte aux comptes admin connectés.
drop policy if exists estimation_imports_admin_read on public.estimation_imports;
create policy estimation_imports_admin_read
  on public.estimation_imports
  for select
  to authenticated
  using (true);

comment on table public.estimation_imports is
  'Pré-estimations et estimations reçues depuis la Skill Claude externe (claude.ai), rattachées à une opportunité.';
comment on column public.estimation_imports.payload is
  'Donnée brute complète envoyée par la skill, conservée intégralement pour fidélité totale.';
