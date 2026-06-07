-- ============================================================
-- APC Master Control Center — Phase 9 Supabase Schema
-- Run each block in the Supabase SQL editor.
-- ============================================================

-- ── apc_users ───────────────────────────────────────────────
-- Mirrors Supabase Auth users; stores APC-specific role + name.
create table if not exists apc_users (
  id          uuid primary key default gen_random_uuid(),
  auth_id     uuid unique references auth.users(id) on delete cascade,
  name        text not null,
  email       text not null unique,
  role        text not null check (role in ('super_admin','app_admin','dispatcher','organization_manager','agency_manager')),
  created_at  timestamptz not null default now()
);

create index if not exists idx_apc_users_role on apc_users(role);
create index if not exists idx_apc_users_auth_id on apc_users(auth_id);

-- Row-level security: users can only read their own row; service role bypasses.
alter table apc_users enable row level security;

create policy "apc_users_self_read" on apc_users
  for select using (auth.uid() = auth_id);

create policy "apc_users_service_all" on apc_users
  using (true)
  with check (true);


-- ── apc_reports ─────────────────────────────────────────────
create table if not exists apc_reports (
  id          uuid primary key default gen_random_uuid(),
  app_id      text not null check (app_id in ('safeconnect','communitysafeconnect','csc_2_0')),
  title       text not null,
  status      text not null default 'open',
  created_at  timestamptz not null default now()
);

create index if not exists idx_apc_reports_app_id on apc_reports(app_id);
create index if not exists idx_apc_reports_status on apc_reports(status);
create index if not exists idx_apc_reports_created_at on apc_reports(created_at desc);

alter table apc_reports enable row level security;

create policy "apc_reports_read_authenticated" on apc_reports
  for select using (auth.role() = 'authenticated');


-- ── apc_audit_logs ──────────────────────────────────────────
create table if not exists apc_audit_logs (
  id          uuid primary key default gen_random_uuid(),
  action      text not null,
  actor       text not null,
  source      text not null default 'apc',
  timestamp   timestamptz not null default now()
);

create index if not exists idx_apc_audit_actor on apc_audit_logs(actor);
create index if not exists idx_apc_audit_timestamp on apc_audit_logs(timestamp desc);

alter table apc_audit_logs enable row level security;

create policy "apc_audit_read_authenticated" on apc_audit_logs
  for select using (auth.role() = 'authenticated');

create policy "apc_audit_insert_authenticated" on apc_audit_logs
  for insert with check (auth.role() = 'authenticated');


-- ── apc_dispatch_cases ──────────────────────────────────────
create table if not exists apc_dispatch_cases (
  id          uuid primary key default gen_random_uuid(),
  subject     text not null,
  status      text not null default 'queued'
              check (status in ('queued','active','escalated','closed')),
  assigned_to uuid references apc_users(id) on delete set null,
  priority    text not null default 'medium'
              check (priority in ('low','medium','high','critical')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists idx_dispatch_status on apc_dispatch_cases(status);
create index if not exists idx_dispatch_priority on apc_dispatch_cases(priority);
create index if not exists idx_dispatch_assigned on apc_dispatch_cases(assigned_to);
create index if not exists idx_dispatch_created on apc_dispatch_cases(created_at asc);

alter table apc_dispatch_cases enable row level security;

create policy "apc_dispatch_read_authenticated" on apc_dispatch_cases
  for select using (auth.role() = 'authenticated');

create policy "apc_dispatch_write_authenticated" on apc_dispatch_cases
  for all using (auth.role() = 'authenticated');


-- ── apc_dispatch_escalations ────────────────────────────────
create table if not exists apc_dispatch_escalations (
  id           uuid primary key default gen_random_uuid(),
  case_id      uuid not null references apc_dispatch_cases(id) on delete cascade,
  reason       text not null,
  escalated_at timestamptz not null default now()
);

create index if not exists idx_escalations_case on apc_dispatch_escalations(case_id);

alter table apc_dispatch_escalations enable row level security;

create policy "apc_escalations_read_authenticated" on apc_dispatch_escalations
  for select using (auth.role() = 'authenticated');

create policy "apc_escalations_insert_authenticated" on apc_dispatch_escalations
  for insert with check (auth.role() = 'authenticated');


-- ── apc_organizations ────────────────────────────────────────
-- Community organizations for CommunitySafeConnect
create table if not exists apc_organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  region     text not null,
  status     text not null default 'pending'
             check (status in ('active', 'pending')),
  created_at timestamptz not null default now()
);

create index if not exists idx_apc_orgs_status on apc_organizations(status);
create index if not exists idx_apc_orgs_region on apc_organizations(region);

alter table apc_organizations enable row level security;

create policy "apc_orgs_read_authenticated" on apc_organizations
  for select using (auth.role() = 'authenticated');

create policy "apc_orgs_write_authenticated" on apc_organizations
  for all using (auth.role() = 'authenticated');
