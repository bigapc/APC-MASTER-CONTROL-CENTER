# APC Master Control Center

APC Master Control Center is the executive operations dashboard for Armstrong Pack Company. It provides a single control surface for SafeConnect, CommunitySafeConnect, and CommunitySafeConnect-CSC-2.0 with demo/live runtime switching, signed session auth, and platform readiness tracking.

## What It Includes

- Signed login session flow with protected routes
- APC landing page, login page, and executive dashboard
- Backend status and control hub pages for platform connection tracking
- Demo data mode and live Supabase mode
- Platform readiness indicators for SafeConnect, CommunitySafeConnect, and CSC 2.0

## Master Platform Scope

The APC master platform is being tightened around these core capability domains:

- Live command maps
- GPS tracking
- Alerts and escalation command
- Historical school data access
- Financial data and analytics

These capabilities are tracked in the shared registry used by frontend and backend at `lib/config/masterPlatformCapabilities.ts` and exposed via `GET /api/platform-capabilities`.

## Local Development

1. Install dependencies.
2. Run the dev server with `npm run dev`.
3. Open `http://localhost:3000`.
4. Sign in with the demo credentials shown on the login page.

### Smoke Test

Run a one-command pre-deploy smoke check (build + startup + critical routes/APIs):

- `npm run smoke`

The smoke run treats protected routes/APIs as healthy when they either:

- return `200`, or
- return `307` redirecting to `/login` (expected when auth enforcement is on)

Optional environment overrides:

- `SMOKE_PORT` (default `4010`)
- `SMOKE_STARTUP_TIMEOUT_SECONDS` (default `90`)

## Live Platform Connection

The app already supports live backend wiring. To connect all platforms, set these environment variables in `.env.local`:

- `NEXT_PUBLIC_DATA_MODE=live`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SAFECONNECT_PUBLIC_URL`
- `NEXT_PUBLIC_SAFECONNECT_ADMIN_URL`
- `SAFECONNECT_WEBHOOK_SECRET`
- `SAFECONNECT_SERVICE_TOKEN`
- `NEXT_PUBLIC_COMMUNITYSAFECONNECT_PUBLIC_URL`
- `NEXT_PUBLIC_COMMUNITYSAFECONNECT_ADMIN_URL`
- `COMMUNITYSAFECONNECT_WEBHOOK_SECRET`
- `COMMUNITYSAFECONNECT_SERVICE_TOKEN`
- `NEXT_PUBLIC_CSC_2_PUBLIC_URL`
- `NEXT_PUBLIC_CSC_2_ADMIN_URL`
- `CSC_2_WEBHOOK_SECRET`
- `CSC_2_SERVICE_TOKEN`

Capability readiness connector variables:

- `APC_MAP_PROVIDER_URL`
- `APC_GPS_STREAM_URL`
- `APC_GPS_STREAM_TOKEN`
- `APC_SCHOOL_DATA_SOURCE_URL`
- `APC_SCHOOL_DATA_ACCESS_TOKEN`
- `APC_FINANCE_DATA_SOURCE_URL`
- `APC_FINANCE_DATA_ACCESS_TOKEN`

Optional but recommended:

- `GITHUB_TOKEN` for live GitHub status data
- `APC_SESSION_SECRET` for production session signing
- `APC_OWNER_EMAIL` and `APC_OWNER_PASSWORD` for production local-fallback owner login
- `APC_DISPATCHER_EMAIL` and `APC_DISPATCHER_PASSWORD` for production local-fallback dispatcher login
- `APC_ENABLE_DEMO_CREDENTIALS=false` to explicitly disable demo credential fallback
- `APC_PREVIEW_BYPASS_AUTH=true` to enable the development-only demo-mode auth bypass

These values feed APC's configuration and endpoint-readiness checks; they do not by themselves implement authenticated API clients for the separate applications. See [Integration Status and Boundaries](#integration-status-and-boundaries) for the current connector scope.

### CSC-CorePlatform Same-Origin Local Mode

If your current stack runs CommunitySafeConnect public app and the dispatcher control hub from one local origin, use this mapping in APC:

- `NEXT_PUBLIC_COMMUNITYSAFECONNECT_PUBLIC_URL=http://localhost:4173`
- `NEXT_PUBLIC_COMMUNITYSAFECONNECT_ADMIN_URL=http://localhost:4173`
- `NEXT_PUBLIC_CSC_2_PUBLIC_URL=http://localhost:4173/hub/`
- `NEXT_PUBLIC_CSC_2_ADMIN_URL=http://localhost:4173/hub/`

CSC-CorePlatform run flow:

- `npm run build:same-origin`
- `npm run serve:same-origin` (or `npm run preview:same-origin`)
- Public app URL: `http://localhost:4173/`
- Control hub URL: `http://localhost:4173/hub/`

For these three APC apps, the intended long-term onboarding model is:

- create or deploy the app independently
- set its public/admin URLs in APC
- add its webhook secret and service token to APC
- let APC consume events, status checks, and oversight data from one master control center

That means you should not need a separate master-center rewrite for each app once SafeConnect, CommunitySafeConnect, and CSC 2.0 are fully built. You will mainly be supplying credentials and endpoint configuration.

## Inbound Webhooks

APC now exposes per-platform webhook intake endpoints so each app can push activity into the master control center:

- `/api/webhooks/safeconnect`
- `/api/webhooks/communitysafeconnect`
- `/api/webhooks/csc_2_0`

Each request should include:

- header: `x-apc-timestamp: <unix seconds>`
- header: `x-apc-signature: sha256=<hex hmac>` where
  - signature payload format is `<timestamp>.<raw json body>`
  - hmac algorithm is SHA-256
  - key is the platform webhook secret (for example `SAFECONNECT_WEBHOOK_SECRET`)
- JSON body with optional fields:
	- `eventType`
	- `actor`
	- `title`
	- `message`
	- `level` (`info`, `warning`, `critical`)
	- `payload`

Example payload:

```json
{
	"eventType": "manager.reviewed_case",
	"actor": "SafeConnect Supervisor",
	"title": "Supervisor activity received",
	"message": "Case SC-1042 was reviewed in SafeConnect.",
	"level": "info",
	"payload": {
		"caseId": "SC-1042",
		"appRole": "supervisor"
	}
}
```

Inbound webhook events are converted into APC audit activity and notifications so they appear in the master control center without custom per-page wiring.

Compatibility mode (temporary migration only):

- set `APC_ALLOW_LEGACY_WEBHOOK_SECRET_HEADER=1` to allow the older header auth
- older header auth uses: `x-apc-webhook-secret: <platform webhook secret>`
- disable this as soon as all apps are sending signed requests

## Backend Notes

- Supabase reads are handled through the shared helpers in `lib/supabase/*`.
- Connectors can fall back to demo fixtures when Supabase is unavailable or a query returns no rows, including in live mode; review each integration's readiness before treating data as operational.
- The login flow uses APC session cookies and redirects unauthenticated users to `/login`.

## Integration Status and Boundaries

The three platform connectors currently read APC's shared Supabase tables when live mode and credentials are configured; otherwise they return local demo fixtures. They do not yet make authenticated requests to the separate platform applications. The configured service-token variables are currently used for readiness checks, not for outbound API calls.

- **SafeConnect:** Reads shared APC reports and dispatcher users, with demo fallbacks. GitHub repository/workflow data is separate from application health.
- **CommunitySafeConnect:** Reads shared APC reports, users, and organizations, with demo fallbacks. A dedicated application API connector is not implemented.
- **CommunitySafeConnect-CSC-2.0:** Reads reports and users from shared APC tables, with demo fallbacks. A dedicated application API connector and write lifecycle are not implemented.

Signed inbound webhook routes exist for all three platforms. They validate timestamped HMAC signatures and publish events to APC's in-memory audit and notification services; durable webhook storage and outbound service-token authentication are not implemented. Check `/api/platforms` for configured/reachable readiness. Connectivity probes run only in live mode, so a false `reachable` value in demo mode means "not probed," not that the remote application is offline.

On a fresh local setup, use demo mode to work without Supabase credentials. All three applications need their independent URLs, webhook secrets, and service/API contracts configured before their readiness can be verified; this repository does not replace or combine the separate application repositories.

## Stealth Operations Rule

APC is an internal-only command layer and should remain non-visible from the public or standard admin UX of SafeConnect, CommunitySafeConnect, and CSC 2.0.

- Do not render APC labels, links, or badges in downstream app UIs.
- Keep APC integration server-to-server (webhooks, tokens, service connectors).
- Treat APC as a silent monitoring and oversight plane (internal operators only).

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

This project is intentionally safe to run in demo mode. `NEXT_PUBLIC_DATA_MODE=live` selects live mode, but Supabase-backed reads require valid Supabase configuration and platform readiness requires configured, reachable endpoints.

For local development in demo mode, authentication is bypassed only when `APC_PREVIEW_BYPASS_AUTH=true`. Missing or false values require sign-in. The bypass is disabled whenever `NODE_ENV` is not `development` or `NEXT_PUBLIC_DATA_MODE=live`; production always enforces authentication regardless of this setting.

## Brand Identity and Emergency Backup Standard

The official APC logo and the separate APPC LLC logo concept are governed by [`docs/APC-BRAND-IDENTITY-AND-LOGO-REGISTER.md`](docs/APC-BRAND-IDENTITY-AND-LOGO-REGISTER.md). The document defines the unchanged APC master mark, APC Daily Pay Card naming and card colorways, the separate APPC LLC concept, and the plan for a dedicated emergency backup repository. The dedicated backup repository is planned separately and is not this application repository.
