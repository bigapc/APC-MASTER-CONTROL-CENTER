-- APC Master Control Center baseline schema

create extension if not exists pgcrypto;

create table if not exists public.apps (
  id text primary key,
  name text not null,
  slug text unique not null,
  status text not null default 'active' check (status in ('active', 'inactive', 'maintenance')),
  public_url text,
  admin_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  app_id text not null references public.apps(id),
  name text not null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create table if not exists public.apc_admins (
  id uuid primary key default gen_random_uuid(),
  -- on delete set null preserves historical admin-linked records (audit/report assignments)
  -- when an auth user is removed.
  user_id uuid references auth.users(id) on delete set null,
  email text unique not null,
  full_name text,
  role text not null default 'viewer' check (
    role in (
      'super_admin',
      'apc_owner',
      'app_admin',
      'dispatcher',
      'agency_admin',
      'courier_manager',
      'support_staff',
      'viewer'
    )
  ),
  app_access text[] not null default '{}',
  organization_id uuid references public.organizations(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.unified_reports (
  id uuid primary key default gen_random_uuid(),
  app_id text not null references public.apps(id),
  report_type text not null,
  title text,
  description text,
  priority text not null default 'normal' check (priority in ('low', 'normal', 'high', 'critical')),
  status text not null default 'open' check (status in ('open', 'pending', 'in_progress', 'resolved', 'closed')),
  -- nullable FKs preserve report history if related users/admin records are removed.
  submitted_by uuid references auth.users(id) on delete set null,
  assigned_to uuid references public.apc_admins(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  app_id text not null references public.apps(id),
  admin_id uuid references public.apc_admins(id) on delete set null,
  action text not null,
  target_table text,
  -- target_id is text to support UUID and non-UUID identifiers across audited tables.
  target_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  app_id text not null references public.apps(id),
  event_name text not null,
  user_id uuid references auth.users(id) on delete set null,
  session_id text,
  page_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_unified_reports_app_id_status on public.unified_reports(app_id, status);
create index if not exists idx_unified_reports_created_at on public.unified_reports(created_at desc);
create index if not exists idx_audit_logs_app_id_created_at on public.audit_logs(app_id, created_at desc);
create index if not exists idx_analytics_events_app_id_created_at on public.analytics_events(app_id, created_at desc);
create index if not exists idx_apc_admins_user_id on public.apc_admins(user_id) where user_id is not null;
-- one auth user maps to at most one admin profile; null user_id records are allowed pre-linking.
create unique index if not exists uniq_apc_admins_user_id_not_null on public.apc_admins(user_id) where user_id is not null;
create index if not exists idx_organizations_app_id on public.organizations(app_id);

create or replace function public.current_admin_role()
returns text
language sql
stable
as $$
  select coalesce((
    select a.role
    from public.apc_admins a
    where a.user_id = auth.uid() and a.is_active = true
    limit 1
  ), 'none');
$$;

create or replace function public.current_admin_id()
returns uuid
language sql
stable
as $$
  select (
    select a.id
    from public.apc_admins a
    where a.user_id = auth.uid() and a.is_active = true
    limit 1
  );
$$;

create or replace function public.current_admin_app_access()
returns text[]
language sql
stable
as $$
  select coalesce((
    select a.app_access
    from public.apc_admins a
    where a.user_id = auth.uid() and a.is_active = true
    limit 1
  ), '{}'::text[]);
$$;

alter table public.apps enable row level security;
alter table public.organizations enable row level security;
alter table public.apc_admins enable row level security;
alter table public.unified_reports enable row level security;
alter table public.audit_logs enable row level security;
alter table public.analytics_events enable row level security;

-- Super admin can see everything
drop policy if exists "super_admin_all_apps_select" on public.apps;
create policy "super_admin_all_apps_select"
on public.apps for select
using (public.current_admin_role() = 'super_admin');

drop policy if exists "super_admin_all_admins_select" on public.apc_admins;
create policy "super_admin_all_admins_select"
on public.apc_admins for select
using (public.current_admin_role() = 'super_admin');

drop policy if exists "super_admin_all_organizations_select" on public.organizations;
create policy "super_admin_all_organizations_select"
on public.organizations for select
using (public.current_admin_role() = 'super_admin');

drop policy if exists "super_admin_reports_all" on public.unified_reports;
create policy "super_admin_reports_all"
on public.unified_reports for all
using (public.current_admin_role() = 'super_admin')
with check (public.current_admin_role() = 'super_admin');

drop policy if exists "super_admin_audit_all" on public.audit_logs;
create policy "super_admin_audit_all"
on public.audit_logs for all
using (public.current_admin_role() = 'super_admin')
with check (public.current_admin_role() = 'super_admin');

drop policy if exists "super_admin_analytics_all" on public.analytics_events;
create policy "super_admin_analytics_all"
on public.analytics_events for all
using (public.current_admin_role() = 'super_admin')
with check (public.current_admin_role() = 'super_admin');

-- Scoped admins: only their app_access rows
drop policy if exists "scoped_reports_access" on public.unified_reports;
create policy "scoped_reports_access"
on public.unified_reports for select
using (
  public.current_admin_role() <> 'none'
  and cardinality(public.current_admin_app_access()) > 0
  and app_id = any(public.current_admin_app_access())
);

drop policy if exists "scoped_organizations_access" on public.organizations;
create policy "scoped_organizations_access"
on public.organizations for select
using (
  public.current_admin_role() <> 'none'
  and cardinality(public.current_admin_app_access()) > 0
  and app_id = any(public.current_admin_app_access())
);

drop policy if exists "scoped_reports_write" on public.unified_reports;
create policy "scoped_reports_write"
on public.unified_reports for insert
with check (
  public.current_admin_role() <> 'none'
  and cardinality(public.current_admin_app_access()) > 0
  and app_id = any(public.current_admin_app_access())
);

drop policy if exists "scoped_reports_update" on public.unified_reports;
create policy "scoped_reports_update"
on public.unified_reports for update
using (
  public.current_admin_role() <> 'none'
  and cardinality(public.current_admin_app_access()) > 0
  and app_id = any(public.current_admin_app_access())
)
with check (
  public.current_admin_role() <> 'none'
  and cardinality(public.current_admin_app_access()) > 0
  and app_id = any(public.current_admin_app_access())
);

drop policy if exists "scoped_audit_access" on public.audit_logs;
create policy "scoped_audit_access"
on public.audit_logs for select
using (
  public.current_admin_role() <> 'none'
  and cardinality(public.current_admin_app_access()) > 0
  and app_id = any(public.current_admin_app_access())
);

drop policy if exists "scoped_audit_write" on public.audit_logs;
create policy "scoped_audit_write"
on public.audit_logs for insert
with check (
  public.current_admin_role() <> 'none'
  and cardinality(public.current_admin_app_access()) > 0
  and app_id = any(public.current_admin_app_access())
  and (admin_id is null or admin_id = public.current_admin_id())
);

drop policy if exists "scoped_analytics_access" on public.analytics_events;
create policy "scoped_analytics_access"
on public.analytics_events for select
using (
  public.current_admin_role() <> 'none'
  and cardinality(public.current_admin_app_access()) > 0
  and app_id = any(public.current_admin_app_access())
);

drop policy if exists "scoped_analytics_write" on public.analytics_events;
create policy "scoped_analytics_write"
on public.analytics_events for insert
with check (
  public.current_admin_role() <> 'none'
  and cardinality(public.current_admin_app_access()) > 0
  and app_id = any(public.current_admin_app_access())
);

insert into public.apps (id, name, slug, status)
values
  ('safeconnect', 'SafeConnect', 'safeconnect', 'active'),
  ('communitysafeconnect', 'CommunitySafeConnect', 'communitysafeconnect', 'active'),
  ('csc_2_0', 'CommunitySafeConnect-CSC-2.0', 'csc_2_0', 'active')
on conflict (id) do nothing;
