import { APP_CONFIG, SAFECONNECT_TEST_ACCOUNTS } from "@/lib/appConfig";
import { getRuntimeStatus } from "@/lib/runtimeStatus";
import { ExternalLink, Database, Server, ShieldCheck, UserCheck, Wifi } from "lucide-react";

export default async function BackendStatusPage() {
  const runtime = await getRuntimeStatus();
  const supabaseUrl = runtime.supabaseUrl;
  const projectRef = supabaseUrl.includes("https://")
    ? supabaseUrl.replace("https://", "").replace(".supabase.co", "")
    : "Not detected";

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Backend Verification</div>
        <h1 className="mt-4 text-4xl font-black text-white">Supabase Backend Status</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Confirm the APC Master Control Center is connected to the correct backend project and expected owner identity before production launch.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        <div className="apc-card p-6">
          <Wifi className="text-[#c1121f]" />
          <p className="mt-4 text-sm font-bold text-zinc-500">Runtime Mode</p>
          <p className="mt-3 text-xl font-black">{runtime.label}</p>
          <p className="mt-1 text-xs font-bold text-zinc-500">Set NEXT_PUBLIC_DATA_MODE to demo or live.</p>
        </div>
        <div className="apc-card p-6"><UserCheck className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Expected Owner</p><p className="mt-3 text-xl font-black">{APP_CONFIG.ownerName}</p><p className="mt-1 text-sm font-bold text-[#c1121f]">{APP_CONFIG.ownerEmail}</p></div>
        <div className="apc-card p-6"><Database className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Supabase URL</p><p className="mt-3 break-all font-mono text-sm font-black">{supabaseUrl}</p></div>
        <div className="apc-card p-6"><Server className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Project Ref</p><p className="mt-3 break-all font-mono text-sm font-black">{projectRef}</p></div>
        <div className="apc-card p-6"><ShieldCheck className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Control Center</p><p className="mt-3 text-xl font-black">{APP_CONFIG.appName}</p></div>
        <div className="apc-card p-6 md:col-span-2 xl:col-span-1">
          <ShieldCheck className="text-[#c1121f]" />
          <p className="mt-4 text-sm font-bold text-zinc-500">Platform Readiness</p>
          <p className="mt-3 text-xl font-black">{runtime.liveReady ? "Ready" : "Pending"}</p>
          <p className="mt-1 text-sm font-bold text-zinc-500">
            {runtime.platformsConfigured ? "All platform endpoints are configured." : "One or more platform URLs still need env configuration."}
          </p>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Platform Connection Matrix</h2>
        <p className="mt-2 text-zinc-600">
          The APC Control Center uses these links to open each platform’s public and admin surfaces.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {runtime.platforms.map((platform) => (
            <div key={platform.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[#c1121f]">{platform.id}</p>
                  <h3 className="mt-1 text-xl font-black">{platform.name}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${platform.ready ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
                  {platform.ready ? "Configured" : "Needs URLs"}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-black uppercase text-zinc-500">Public URL</p>
                  <p className="mt-1 break-all font-mono text-zinc-900">{platform.publicUrl}</p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-black uppercase text-zinc-500">Admin URL</p>
                  <p className="mt-1 break-all font-mono text-zinc-900">{platform.adminUrl}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                {platform.ready ? (
                  <>
                    <a href={platform.adminUrl} className="apc-button-primary flex-1">
                      <ExternalLink size={16} /> Admin
                    </a>
                    <a href={platform.publicUrl} className="apc-button-secondary flex-1">
                      <ExternalLink size={16} /> Public
                    </a>
                  </>
                ) : (
                  <div className="w-full rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-900">
                    Missing env: {platform.missingEnvVars.join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Mode Instructions</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="font-black">Demo Mode</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Use this while Supabase is unavailable. The app runs from local demo data and does not require paid backend usage.</p>
            <p className="mt-3 rounded-xl bg-white p-3 font-mono text-xs">NEXT_PUBLIC_DATA_MODE=demo</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="font-black">Live Mode</p>
            <p className="mt-2 text-sm leading-6 text-zinc-600">Use this later when the correct APC Supabase backend is ready and environment keys are configured.</p>
            <p className="mt-3 rounded-xl bg-white p-3 font-mono text-xs">NEXT_PUBLIC_DATA_MODE=live</p>
          </div>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">SafeConnect Test Accounts</h2>
        <p className="mt-2 text-zinc-600">These are the three accounts you are testing with now.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {SAFECONNECT_TEST_ACCOUNTS.map((account) => (
            <div key={account.email} className="rounded-2xl bg-zinc-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-[#c1121f]">{account.label}</p>
              <p className="mt-2 text-lg font-black">{account.name}</p>
              <p className="mt-1 break-all text-sm font-bold text-zinc-600">{account.email}</p>
              <p className="mt-3 font-mono text-xs">role: {account.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Required Backend Tables</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["apps", "apc_admins", "admin_roles", "unified_reports", "dispatch_cases", "organizations", "analytics_events", "audit_logs", "system_health"].map((table) => (
            <div key={table} className="rounded-2xl border border-black/5 bg-white p-4 font-mono text-sm font-black">{table}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
