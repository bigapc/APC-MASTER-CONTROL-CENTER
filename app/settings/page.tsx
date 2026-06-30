import { APP_CONFIG } from "@/lib/appConfig";
import { getRuntimeStatus } from "@/lib/runtimeStatus";
import { Database, KeyRound, Lock, Server, Shield } from "lucide-react";

export default async function SettingsPage() {
  const runtime = await getRuntimeStatus();

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">System Configuration</div>
        <h1 className="mt-4 text-4xl font-black text-white">Control Center Settings</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Configure app access, backend connection, role permissions, environment settings, and APC platform identity.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Backend", text: "Connect Supabase database, auth, RLS, and storage.", icon: Database },
          { title: "Access", text: "Manage admin protection, app access, and permissions.", icon: Lock },
          { title: "API Health", text: "Monitor service status and backend checks.", icon: Server },
          { title: "Keys", text: "Prepare public app IDs and private server keys.", icon: KeyRound },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="apc-card p-6">
              <Icon className="text-[#c1121f]" />
              <h2 className="mt-4 text-xl font-black">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="apc-card p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Live Connection Checklist</h2>
            <p className="mt-1 text-zinc-600">
              Track backend and per-platform integration status before switching operations to live mode.
            </p>
          </div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${runtime.liveReady ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
            {runtime.liveReady ? "Ready for live mode" : "Live mode not ready"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Runtime Mode</p>
            <p className="mt-2 text-lg font-black">{runtime.label}</p>
            {!runtime.liveRequested ? (
              <p className="mt-2 text-sm font-bold text-yellow-800">Set NEXT_PUBLIC_DATA_MODE=live when ready.</p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Backend Keys</p>
            <p className="mt-2 text-lg font-black">
              {runtime.missingBackendEnvVars.length === 0 ? "Configured" : "Missing Keys"}
            </p>
            {runtime.missingBackendEnvVars.length > 0 ? (
              <p className="mt-2 text-sm font-bold text-yellow-800">
                Missing env: {runtime.missingBackendEnvVars.join(", ")}
              </p>
            ) : (
              <p className="mt-2 text-sm font-bold text-green-700">Supabase live credentials detected.</p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Backend Reachability</p>
            <p className={`mt-2 text-lg font-black ${runtime.backendReachable ? "text-green-700" : "text-yellow-800"}`}>
              {runtime.backendReachable ? "Reachable" : "Not reachable"}
            </p>
            <p className="mt-2 text-sm font-bold text-zinc-700">
              HTTP status: {runtime.backendStatusCode ?? "Not checked"}
              {runtime.backendLatencyMs !== null ? ` (${runtime.backendLatencyMs} ms)` : ""}
            </p>
            {runtime.backendProbeError ? (
              <p className="mt-2 text-xs font-bold text-zinc-600">Probe note: {runtime.backendProbeError}</p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase tracking-wide text-zinc-500">Platform Reachability</p>
            <p className={`mt-2 text-lg font-black ${runtime.platformsReachable ? "text-green-700" : "text-yellow-800"}`}>
              {runtime.platformsReachable ? "All reachable" : "One or more unreachable"}
            </p>
            <p className="mt-2 text-sm font-bold text-zinc-700">
              Reachable endpoints: {runtime.platforms.filter((platform) => platform.publicReachable && platform.adminReachable).length}/{runtime.platformCount}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {runtime.platforms.map((platform) => (
            <div key={platform.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-base font-black text-zinc-900">{platform.name}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${platform.ready ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
                  {platform.ready ? "Configured" : "Pending"}
                </span>
              </div>
              {!platform.ready ? (
                <p className="mt-2 text-xs font-bold text-yellow-800">
                  Missing env: {platform.missingEnvVars.join(", ")}
                </p>
              ) : (
                <p className="mt-2 text-xs font-bold text-green-700">URLs and integration credentials configured.</p>
              )}
              {platform.ready ? (
                <p className={`mt-2 text-xs font-bold ${platform.publicReachable && platform.adminReachable ? "text-green-700" : "text-yellow-800"}`}>
                  Probe: public {platform.publicStatusCode ?? "n/a"}, admin {platform.adminStatusCode ?? "n/a"}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="apc-card p-6">
        <div className="flex items-center gap-3">
          <Shield className="text-[#c1121f]" />
          <h2 className="text-2xl font-black">APC Brand Identity</h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase text-zinc-500">Company</p>
            <p className="mt-2 text-lg font-black">{APP_CONFIG.companyName}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase text-zinc-500">Platform</p>
            <p className="mt-2 text-lg font-black">{APP_CONFIG.appName}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase text-zinc-500">Owner</p>
            <p className="mt-2 text-lg font-black">{APP_CONFIG.ownerName}</p>
            <p className="mt-1 text-sm font-bold text-[#c1121f]">{APP_CONFIG.ownerEmail}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase text-zinc-500">Theme</p>
            <p className="mt-2 text-lg font-black">Red, Black, White</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5 md:col-span-2">
            <p className="text-xs font-black uppercase text-zinc-500">Mission Statement</p>
            <p className="mt-2 text-lg font-black">“{APP_CONFIG.mission}”</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5 md:col-span-2">
            <p className="text-xs font-black uppercase text-zinc-500">Company Pride Statement</p>
            <p className="mt-2 leading-7 text-zinc-700">{APP_CONFIG.prideStatement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
