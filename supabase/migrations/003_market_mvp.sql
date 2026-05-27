-- =============================================================
-- Market MVP — Base marché interne (27 mai 2026)
-- Tables pour l'outil interne /admin/base-marche.
-- =============================================================

create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- Zones surveillées
-- ============================================================
create table if not exists public.monitored_zones (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  zipcode         text not null unique,
  city            text,
  radius_km       numeric,
  active          boolean not null default true,
  sync_frequency  text not null default 'manual',
  last_synced_at  timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists monitored_zones_zipcode_idx on public.monitored_zones (zipcode);
create index if not exists monitored_zones_active_idx on public.monitored_zones (active);

drop trigger if exists monitored_zones_updated_at on public.monitored_zones;
create trigger monitored_zones_updated_at
  before update on public.monitored_zones
  for each row execute function public.set_updated_at();

-- ============================================================
-- Biens marché normalisés
-- ============================================================
create table if not exists public.market_properties (
  id              uuid primary key default gen_random_uuid(),
  external_id     text not null,
  source          text not null default 'stream_estate',
  title           text,
  description     text,
  city            text,
  zipcode         text,
  insee_code      text,
  lat             numeric,
  lon             numeric,
  property_type   text,
  price           integer,
  surface         numeric,
  price_per_m2    numeric,
  land_surface    numeric,
  rooms           integer,
  bedrooms        integer,
  dpe             text,
  ges             text,
  url             text,
  status          text not null default 'active',
  first_seen_at   timestamptz not null default now(),
  last_seen_at    timestamptz not null default now(),
  published_at    timestamptz,
  expired_at      timestamptz,
  raw_json        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (source, external_id)
);

create index if not exists market_properties_zipcode_idx on public.market_properties (zipcode);
create index if not exists market_properties_city_idx on public.market_properties (city);
create index if not exists market_properties_status_idx on public.market_properties (status);
create index if not exists market_properties_price_idx on public.market_properties (price);
create index if not exists market_properties_surface_idx on public.market_properties (surface);
create index if not exists market_properties_last_seen_idx on public.market_properties (last_seen_at desc);
create index if not exists market_properties_raw_json_idx on public.market_properties using gin (raw_json);

drop trigger if exists market_properties_updated_at on public.market_properties;
create trigger market_properties_updated_at
  before update on public.market_properties
  for each row execute function public.set_updated_at();

-- ============================================================
-- Historique de prix
-- ============================================================
create table if not exists public.property_price_history (
  id                  uuid primary key default gen_random_uuid(),
  market_property_id  uuid not null references public.market_properties(id) on delete cascade,
  old_price           integer,
  new_price           integer,
  variation_amount    integer,
  variation_percent   numeric,
  detected_at         timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create index if not exists property_price_history_property_idx on public.property_price_history (market_property_id, detected_at desc);

-- ============================================================
-- Tags
-- ============================================================
create table if not exists public.property_tags (
  id                  uuid primary key default gen_random_uuid(),
  market_property_id  uuid not null references public.market_properties(id) on delete cascade,
  tag                 text not null,
  source              text not null default 'system',
  rule_id             uuid,
  created_at          timestamptz not null default now(),
  unique (market_property_id, tag)
);

create index if not exists property_tags_property_idx on public.property_tags (market_property_id);
create index if not exists property_tags_tag_idx on public.property_tags (tag);

-- ============================================================
-- Règles de gestion
-- ============================================================
create table if not exists public.management_rules (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  description     text not null default '',
  active          boolean not null default true,
  trigger_type    text not null,
  conditions_json jsonb not null default '{}'::jsonb,
  actions_json    jsonb not null default '{}'::jsonb,
  priority        text not null default 'medium',
  last_run_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists management_rules_active_idx on public.management_rules (active);

drop trigger if exists management_rules_updated_at on public.management_rules;
create trigger management_rules_updated_at
  before update on public.management_rules
  for each row execute function public.set_updated_at();

-- ============================================================
-- Opportunités kanban
-- ============================================================
create table if not exists public.opportunities (
  id                  uuid primary key default gen_random_uuid(),
  market_property_id  uuid references public.market_properties(id) on delete set null,
  title               text not null,
  description         text not null default '',
  stage               text not null default 'À qualifier',
  priority            text not null default 'medium',
  signal_type         text,
  next_action         text,
  due_date            date,
  note                text,
  created_from        text not null default 'manual',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index if not exists opportunities_stage_idx on public.opportunities (stage);
create index if not exists opportunities_property_idx on public.opportunities (market_property_id);
create unique index if not exists opportunities_market_property_unique on public.opportunities (market_property_id) where market_property_id is not null;

drop trigger if exists opportunities_updated_at on public.opportunities;
create trigger opportunities_updated_at
  before update on public.opportunities
  for each row execute function public.set_updated_at();

-- ============================================================
-- Notifications internes
-- ============================================================
create table if not exists public.notifications (
  id                  uuid primary key default gen_random_uuid(),
  type                text not null,
  title               text not null,
  message             text not null default '',
  priority            text not null default 'medium',
  market_property_id  uuid references public.market_properties(id) on delete set null,
  rule_id             uuid references public.management_rules(id) on delete set null,
  opportunity_id      uuid references public.opportunities(id) on delete set null,
  status              text not null default 'unread',
  action_label        text,
  created_at          timestamptz not null default now(),
  read_at             timestamptz,
  resolved_at         timestamptz
);

create index if not exists notifications_status_idx on public.notifications (status, created_at desc);
create index if not exists notifications_property_idx on public.notifications (market_property_id);

-- ============================================================
-- Notes internes
-- ============================================================
create table if not exists public.property_notes (
  id                  uuid primary key default gen_random_uuid(),
  market_property_id  uuid references public.market_properties(id) on delete cascade,
  opportunity_id      uuid references public.opportunities(id) on delete cascade,
  note                text not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  check (market_property_id is not null or opportunity_id is not null)
);

drop trigger if exists property_notes_updated_at on public.property_notes;
create trigger property_notes_updated_at
  before update on public.property_notes
  for each row execute function public.set_updated_at();

-- ============================================================
-- Journal synchronisation
-- ============================================================
create table if not exists public.sync_runs (
  id              uuid primary key default gen_random_uuid(),
  zone_id         uuid references public.monitored_zones(id) on delete set null,
  provider        text not null default 'stream_estate',
  status          text not null,
  started_at      timestamptz not null default now(),
  finished_at     timestamptz,
  fetched_count   integer not null default 0,
  created_count   integer not null default 0,
  updated_count   integer not null default 0,
  error_message   text
);

create index if not exists sync_runs_started_at_idx on public.sync_runs (started_at desc);

-- ============================================================
-- RLS : service role only pour le MVP privé
-- ============================================================
alter table public.monitored_zones enable row level security;
alter table public.market_properties enable row level security;
alter table public.property_price_history enable row level security;
alter table public.property_tags enable row level security;
alter table public.management_rules enable row level security;
alter table public.notifications enable row level security;
alter table public.opportunities enable row level security;
alter table public.property_notes enable row level security;
alter table public.sync_runs enable row level security;

-- ============================================================
-- Seed zone + règles MVP
-- ============================================================
insert into public.monitored_zones (name, zipcode, active)
values ('Pontevès / Barjols', '83670', true)
on conflict (zipcode) do nothing;

insert into public.management_rules (name, description, active, trigger_type, conditions_json, actions_json, priority)
values
  ('Nouvelle annonce sur la zone', 'Tague les annonces nouvelles du code postal surveillé.', true, 'new_listing', '{"days_online_lte":14}'::jsonb, '{"tags":["Nouvelle annonce"],"notification":true}'::jsonb, 'low'),
  ('Bien en ligne depuis plus de 90 jours', 'Détecte les annonces qui stagnent.', true, 'days_online', '{"days_online_gte":90}'::jsonb, '{"tags":["Plus de 90 jours"],"notification":true}'::jsonb, 'medium'),
  ('DPE F ou G', 'Détecte les biens avec DPE faible.', true, 'dpe', '{"dpe_in":["F","G"]}'::jsonb, '{"tags":["DPE faible"],"notification":true}'::jsonb, 'medium'),
  ('Maison avec terrain supérieur à 500 m²', 'Repère les maisons avec terrain intéressant.', true, 'land_surface', '{"land_surface_gte":500}'::jsonb, '{"tags":["Terrain intéressant"]}'::jsonb, 'low'),
  ('Score opportunité élevé', 'Crée une opportunité quand plusieurs signaux sont cumulés.', true, 'opportunity_score', '{"opportunity_score_gte":70}'::jsonb, '{"tags":["Opportunité mandat"],"notification":true,"opportunity":true}'::jsonb, 'high')
on conflict do nothing;

comment on table public.market_properties is 'Base marché interne : biens normalisés depuis Stream Estate.';
comment on table public.management_rules is 'Règles de gestion configurables pour tags, notifications et opportunités.';
comment on table public.opportunities is 'Kanban simple d’opportunités issues de la veille marché.';
