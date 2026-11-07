-- Isolated integration tests for migrations 20261104_001 and 20261107_002.
--
-- Run only against a disposable Supabase/PostgreSQL database after both
-- migrations have been applied. The test inserts fixture auth.users and schema
-- rows, simulates authenticated JWT subjects, and rolls everything back.
-- It does not test JWT signature or expiration validation; Supabase Auth/PostgREST
-- is responsible for rejecting expired tokens before a database request.

begin;

do $$
declare
  admin_uid uuid := gen_random_uuid();
  expired_app_uid uuid := gen_random_uuid();
  expired_control_uid uuid := gen_random_uuid();
  ungranted_uid uuid := gen_random_uuid();
  admin_principal_id uuid;
  expired_app_principal_id uuid;
  expired_control_principal_id uuid;
  ungranted_principal_id uuid;
  control_entity_id uuid;
  application_entity_id uuid;
begin
  insert into auth.users (id, aud, role, email, encrypted_password, email_confirmed_at)
  values
    (admin_uid, 'authenticated', 'authenticated', 'rls-admin-' || admin_uid || '@example.test', '', now()),
    (expired_app_uid, 'authenticated', 'authenticated', 'rls-exp-app-' || expired_app_uid || '@example.test', '', now()),
    (expired_control_uid, 'authenticated', 'authenticated', 'rls-exp-control-' || expired_control_uid || '@example.test', '', now()),
    (ungranted_uid, 'authenticated', 'authenticated', 'rls-ungranted-' || ungranted_uid || '@example.test', '', now());

  insert into public.apc_principals (supabase_uid, email, account_status)
  values (admin_uid, 'rls-admin-' || admin_uid || '@example.test', 'active')
  returning id into admin_principal_id;

  insert into public.apc_principals (supabase_uid, email, account_status)
  values (expired_app_uid, 'rls-exp-app-' || expired_app_uid || '@example.test', 'active')
  returning id into expired_app_principal_id;

  insert into public.apc_principals (supabase_uid, email, account_status)
  values (expired_control_uid, 'rls-exp-control-' || expired_control_uid || '@example.test', 'active')
  returning id into expired_control_principal_id;

  insert into public.apc_principals (supabase_uid, email, account_status)
  values (ungranted_uid, 'rls-ungranted-' || ungranted_uid || '@example.test', 'active')
  returning id into ungranted_principal_id;

  insert into public.apc_entities (
    canonical_key,
    display_name,
    entity_type,
    classification,
    classification_status,
    classification_approved_by,
    classification_approved_at
  )
  values (
    'apc_control_center',
    'APC Control Center (RLS test)',
    'application',
    'control_plane',
    'approved',
    admin_principal_id,
    now()
  )
  returning id into control_entity_id;

  insert into public.apc_entities (
    canonical_key,
    display_name,
    entity_type,
    classification,
    classification_status,
    classification_approved_by,
    classification_approved_at
  )
  values (
    'safeconnect',
    'SafeConnect (RLS test)',
    'application',
    'application',
    'approved',
    admin_principal_id,
    now()
  )
  returning id into application_entity_id;

  update public.apc_entities
  set lifecycle = 'active'
  where id in (control_entity_id, application_entity_id);

  insert into public.apc_grants (
    principal_id, entity_id, permission, status, effective_at, expires_at, issued_by
  )
  values
    (
      admin_principal_id, control_entity_id, 'control_plane.execute',
      'active', now() - interval '1 day', null, expired_app_principal_id
    ),
    (
      expired_app_principal_id, application_entity_id, 'application.access',
      'active', now() - interval '2 days', now() - interval '1 day', admin_principal_id
    ),
    (
      expired_control_principal_id, control_entity_id, 'control_plane.execute',
      'active', now() - interval '2 days', now() - interval '1 day', admin_principal_id
    );

  perform set_config('apc.test.admin_uid', admin_uid::text, true);
  perform set_config('apc.test.expired_app_uid', expired_app_uid::text, true);
  perform set_config('apc.test.expired_control_uid', expired_control_uid::text, true);
  perform set_config('apc.test.ungranted_uid', ungranted_uid::text, true);
  perform set_config('apc.test.admin_principal_id', admin_principal_id::text, true);
  perform set_config('apc.test.expired_app_principal_id', expired_app_principal_id::text, true);
  perform set_config('apc.test.expired_control_principal_id', expired_control_principal_id::text, true);
  perform set_config('apc.test.ungranted_principal_id', ungranted_principal_id::text, true);
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub', current_setting('apc.test.admin_uid'), true);

do $$
begin
  if not public.check_principal_permission('apc_control_center', 'control_plane.execute') then
    raise exception 'TEST FAILURE: active control-plane grant was not recognized.';
  end if;

  if public.check_principal_permission('safeconnect', 'application.access') then
    raise exception 'TEST FAILURE: permission was granted outside its entity scope.';
  end if;

  if (select count(*) from public.apc_principals) <> 1 then
    raise exception 'TEST FAILURE: principal SELECT policy did not limit results to the caller.';
  end if;

  if (select count(*) from public.apc_principals
      where id = current_setting('apc.test.admin_principal_id')::uuid) <> 1 then
    raise exception 'TEST FAILURE: caller could not read their own principal record.';
  end if;

  if (
    select count(*)
    from public.apc_grants
    where principal_id in (
      current_setting('apc.test.admin_principal_id')::uuid,
      current_setting('apc.test.expired_app_principal_id')::uuid,
      current_setting('apc.test.expired_control_principal_id')::uuid,
      current_setting('apc.test.ungranted_principal_id')::uuid
    )
  ) <> 3 then
    raise exception 'TEST FAILURE: control-plane grant did not expose the expected grant rows.';
  end if;
end;
$$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('apc.test.expired_app_uid'), true);
set local role authenticated;

do $$
begin
  if public.check_principal_permission('safeconnect', 'application.access') then
    raise exception 'TEST FAILURE: expired application grant permitted access.';
  end if;

  if (select count(*) from public.apc_principals) <> 1
      or (select count(*) from public.apc_principals
          where id = current_setting('apc.test.expired_app_principal_id')::uuid) <> 1 then
    raise exception 'TEST FAILURE: expired-grant principal could not read only their own record.';
  end if;

  if (select count(*) from public.apc_grants) <> 0 then
    raise exception 'TEST FAILURE: principal without control-plane access could read grants.';
  end if;
end;
$$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('apc.test.expired_control_uid'), true);
set local role authenticated;

do $$
begin
  if public.check_principal_permission('apc_control_center', 'control_plane.execute') then
    raise exception 'TEST FAILURE: expired control-plane grant permitted access.';
  end if;

  if (select count(*) from public.apc_grants) <> 0 then
    raise exception 'TEST FAILURE: expired control-plane grant exposed grant rows.';
  end if;
end;
$$;

reset role;
select set_config('request.jwt.claim.sub', current_setting('apc.test.ungranted_uid'), true);
set local role authenticated;

do $$
begin
  if public.check_principal_permission('safeconnect', 'application.access') then
    raise exception 'TEST FAILURE: ungranted principal was authorized.';
  end if;

  if (select count(*) from public.apc_principals) <> 1
      or (select count(*) from public.apc_principals
          where id = current_setting('apc.test.ungranted_principal_id')::uuid) <> 1 then
    raise exception 'TEST FAILURE: ungranted principal could not read only their own record.';
  end if;

  if (select count(*) from public.apc_grants) <> 0 then
    raise exception 'TEST FAILURE: ungranted principal could read grants.';
  end if;
end;
$$;

reset role;
rollback;
