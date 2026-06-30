import { APP_CONFIG } from "@/lib/appConfig";
import { getRuntimeStatus } from "@/lib/runtimeStatus";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default async function AppsPage() {
  const runtime = await getRuntimeStatus();

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Application Registry</div>
        <h1 className="mt-4 text-4xl font-black text-white">Connected APC Platforms</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Manage each individual app while keeping all monitoring connected to one APC Master Control Center.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {APP_CONFIG.apps.map((app) => {
          const platform = runtime.platforms.find((entry) => entry.id === app.id);

          return (
          <div key={app.id} className="apc-card p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <ShieldCheck size={24} />
            </div>

            <h2 className="mt-5 text-2xl font-black text-zinc-950">{app.name}</h2>
            <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#c1121f]">{app.division}</p>
            <p className="mt-4 leading-7 text-zinc-600">{app.description}</p>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-black uppercase text-zinc-500">App ID</p>
                <p className="mt-1 font-mono text-sm text-zinc-900">{app.id}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-black uppercase text-zinc-500">Health</p>
                <p className="mt-1 font-bold text-green-700">{app.health}</p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-black uppercase text-zinc-500">Connection</p>
                <p className="mt-1 font-bold text-zinc-900">
                  {platform?.ready
                    ? "Configured"
                    : "Pending"}
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-black uppercase text-zinc-500">Reachability</p>
                <p className={`mt-1 font-bold ${platform?.publicReachable && platform?.adminReachable ? "text-green-700" : "text-yellow-800"}`}>
                  {platform?.publicReachable && platform?.adminReachable ? "Reachable" : "Not reachable"}
                </p>
              </div>
              <div className="rounded-2xl bg-zinc-50 p-4">
                <p className="text-xs font-black uppercase text-zinc-500">Division Focus</p>
                <p className="mt-1 font-bold text-zinc-900">{app.accent}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {platform?.ready ? (
                <>
                  <a href={app.adminUrl} className="apc-button-primary flex-1">
                    <ExternalLink size={16} /> Admin
                  </a>
                  <a href={app.publicUrl} className="apc-button-secondary flex-1">
                    <ExternalLink size={16} /> Public
                  </a>
                </>
              ) : (
                <p className="w-full rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-900">
                  Missing env: {platform?.missingEnvVars.join(", ")}
                </p>
              )}
            </div>

            {platform?.ready ? (
              <p className="mt-3 text-xs font-bold text-zinc-600">
                Probe status: public {platform.publicStatusCode ?? "n/a"}, admin {platform.adminStatusCode ?? "n/a"}
              </p>
            ) : null}
          </div>
        );
        })}
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Architecture Note</h2>
        <p className="mt-3 leading-7 text-zinc-600">
          Each app remains separate for public use and individual admin control. The APC Master Control Center monitors them through shared app IDs, role-based access, unified reports, analytics events, and audit logs.
        </p>
      </section>
    </div>
  );
}
