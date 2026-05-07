# APC Master Control Center

Central private control center for monitoring and managing:

- SafeConnect (`safeconnect`)
- CommunitySafeConnect (`communitysafeconnect`)
- CSC 2.0 (`csc_2_0`)

Each child app remains independent (repo, deployment, public/admin UX), while all apps send operational data into one shared APC backend.

## Architecture

- **One central Supabase project** for all backend data.
- **App data partitioning by `app_id`** in core operational tables.
- **One private control-center app** for APC staff and approved partners.
- **Role + app-scoped access control** with Supabase RLS.

## Required environment variables (per child app)

Use the same Supabase project for all child apps:

```bash
NEXT_PUBLIC_SUPABASE_URL=<apc-central-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<apc-central-supabase-anon-key>
```

Set a unique app identifier per app deployment:

```bash
# SafeConnect
NEXT_PUBLIC_APP_ID=safeconnect

# CommunitySafeConnect
NEXT_PUBLIC_APP_ID=communitysafeconnect

# CommunitySafeConnect-CSC-2.0
NEXT_PUBLIC_APP_ID=csc_2_0
```

## Database setup

Apply this migration in your Supabase project:

- `supabase/migrations/0001_apc_master_control_center.sql`

What it creates:

- `apps`
- `organizations`
- `apc_admins`
- `unified_reports`
- `audit_logs`
- `analytics_events`

It also enables RLS and provides baseline policies that:

- allow `super_admin` full visibility
- restrict scoped admins to rows where `app_id` is in their `app_access`

## Recommended control center routes

Start with:

- `/dashboard`
- `/reports`
- `/users`
- `/apps`
- `/audit-logs`
- `/settings`

Then expand with:

- `/dispatch`
- `/couriers`
- `/organizations`
- `/analytics`
- `/billing`
- `/system-health`

## App-level runtime config example

Use a shared app config pattern in each child app:

```ts
export const APP_CONFIG = {
  appId: process.env.NEXT_PUBLIC_APP_ID || '__unset__',
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'SafeConnect',
};

if (APP_CONFIG.appId === '__unset__') {
  throw new Error('NEXT_PUBLIC_APP_ID is required');
}
```

And ensure writes include `app_id`:

```ts
await supabase.from('unified_reports').insert({
  app_id: APP_CONFIG.appId,
  report_type: 'safety_request',
  title: 'New safety request',
  description: 'User submitted a request',
  priority: 'normal',
  status: 'open',
});
```

## Notes

- Keep the three products separate: each app should retain its own repository, deployment pipeline, and public/admin UX.
- Do not merge them into one monolith; only share the central backend operational data layer.
- Use this repository as the central APC control-center foundation.
