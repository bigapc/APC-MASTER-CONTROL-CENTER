-- APC authorization Stage 2: narrowly scoped read policies for the isolated
-- authorization foundation introduced by 20261104_001.
--
-- Do not run against production. Review the deployed catalog and exercise this
-- migration with authenticated JWTs in an isolated Supabase/PostgreSQL database
-- before approval. This migration grants read access only; it creates no write
-- policies and does not change legacy tables.
--
-- The foundation schema uses apc_entities.canonical_key and apc_grants.entity_id,
-- permission, status, and effective_at. It does not use app_entity_id,
-- required_permission, or the account status "pending".

do $$
begin
  if not exists (
    select 1
    from pg_catalog.pg_roles
    where rolname = current_user
      and (rolsuper or rolbypassrls)
  ) then
    raise exception
      'This migration must be created by a role that bypasses row-level security.';
  end if;
end;
$$;

create or replace function public.check_principal_permission(
  target_entity_key text,
  target_permission text
)
returns boolean
language sql
security definer
stable
set search_path = pg_catalog
set row_security = off
as $$
  select exists (
    select 1
    from public.apc_principals as p
    join public.apc_grants as g
      on g.principal_id = p.id
    join public.apc_entities as e
      on e.id = g.entity_id
    where p.supabase_uid = (select auth.uid())
      and p.account_status = 'active'
      and g.status = 'active'
      and g.effective_at <= statement_timestamp()
      and (g.expires_at is null or g.expires_at > statement_timestamp())
      and e.canonical_key = target_entity_key
      and e.lifecycle = 'active'
      and g.permission = target_permission
  );
$$;

revoke all privileges on function public.check_principal_permission(text, text)
  from public, anon, authenticated, service_role;
grant execute on function public.check_principal_permission(text, text)
  to authenticated;

revoke all privileges on table public.apc_principals, public.apc_grants
  from public, anon, authenticated, service_role;
grant select on table public.apc_principals, public.apc_grants
  to authenticated;

create policy "Principals can view their own record"
  on public.apc_principals
  for select
  to authenticated
  using (supabase_uid = (select auth.uid()));

create policy "Principals with control plane access can view grants"
  on public.apc_grants
  for select
  to authenticated
  using (
    public.check_principal_permission(
      'apc_control_center',
      'control_plane.execute'
    )
  );
