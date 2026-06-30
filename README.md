# APC Master Control Center

APC Master Control Center is the executive operations dashboard for Armstrong Pack Company. It provides a single control surface for SafeConnect, CommunitySafeConnect, and CommunitySafeConnect-CSC-2.0 with demo/live runtime switching, signed session auth, and platform readiness tracking.

## What It Includes

- Signed login session flow with protected routes
- APC landing page, login page, and executive dashboard
- Backend status and control hub pages for platform connection tracking
- Demo data mode and live Supabase mode
- Platform readiness indicators for SafeConnect, CommunitySafeConnect, and CSC 2.0

## Local Development

1. Install dependencies.
2. Run the dev server with `npm run dev`.
3. Open `http://localhost:3000`.
4. Sign in with the demo credentials shown on the login page.

## Live Platform Connection

The app already supports live backend wiring. To connect all platforms, set these environment variables in `.env.local`:

- `NEXT_PUBLIC_DATA_MODE=live`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SAFECONNECT_PUBLIC_URL`
- `NEXT_PUBLIC_SAFECONNECT_ADMIN_URL`
- `NEXT_PUBLIC_COMMUNITYSAFECONNECT_PUBLIC_URL`
- `NEXT_PUBLIC_COMMUNITYSAFECONNECT_ADMIN_URL`
- `NEXT_PUBLIC_CSC_2_PUBLIC_URL`
- `NEXT_PUBLIC_CSC_2_ADMIN_URL`

Optional but recommended:

- `GITHUB_TOKEN` for live GitHub status data
- `APC_SESSION_SECRET` for production session signing
- `APC_OWNER_EMAIL` and `APC_OWNER_PASSWORD` for production local-fallback owner login
- `APC_DISPATCHER_EMAIL` and `APC_DISPATCHER_PASSWORD` for production local-fallback dispatcher login
- `APC_ENABLE_DEMO_CREDENTIALS=false` to explicitly disable demo credential fallback

Once those values are present, the backend status and control hubs pages will automatically switch from pending placeholders to configured platform links.

## Backend Notes

- Supabase reads are handled through the shared helpers in `lib/supabase/*`.
- The app falls back to demo data when live keys are missing.
- The login flow uses APC session cookies and redirects unauthenticated users to `/login`.

## Useful Pages

- `/` for the landing page
- `/login` for authentication
- `/dashboard` for the command center
- `/backend-status` for live backend readiness
- `/control-hubs` for platform connection links
- `/apps` for the connected platform registry

## Demo Credentials

The login screen can expose demo credentials in development.

- `owner@apc.local` / `apc_owner_2026`
- `dispatcher@apc.local` / `dispatch_2026`

In production, demo credentials are disabled by default unless explicitly enabled with `APC_ENABLE_DEMO_CREDENTIALS=true`.

## Notes

This project is intentionally safe to run in demo mode. Live mode only becomes active when the required Supabase and platform URL environment variables are present.
