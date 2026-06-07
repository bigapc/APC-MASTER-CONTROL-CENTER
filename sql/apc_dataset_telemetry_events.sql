create table if not exists public.apc_dataset_telemetry_events (
  id bigint generated always as identity primary key,
  dataset_key text not null,
  dataset_label text not null,
  table_name text not null,
  mode text not null check (mode in ('demo', 'live')),
  source text not null check (source in ('demo', 'live')),
  reason text,
  recorded_at timestamptz not null default now()
);

create index if not exists idx_apc_dataset_telemetry_events_recorded_at
  on public.apc_dataset_telemetry_events (recorded_at desc);

create index if not exists idx_apc_dataset_telemetry_events_dataset_key
  on public.apc_dataset_telemetry_events (dataset_key);
