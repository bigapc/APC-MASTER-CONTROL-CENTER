import Link from "next/link";
import { APP_CONFIG } from "@/lib/appConfig";
import { getRuntimeStatus } from "@/lib/runtimeStatus";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default async function ControlHubsPage() {
  const runtime = await getRuntimeStatus();
  const separatedPlatformIds = new Set(["csc_2_0", "csc_nextgen"]);

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Control Hub Links</div>
        <h1 className="mt-4 text-4xl font-black text-white">Application Control Hubs</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Open or monitor each individual app control center while keeping APC executive oversight in one place.
        </p>
      </section>

      <section className="apc-card p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black">Connection Readiness</h2>
            <p className="mt-1 text-zinc-600">Live indicators for platform URLs plus webhook and service credentials.</p>
          </div>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${runtime.liveReady ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
            {runtime.liveReady ? "Ready for live platform connections" : "Platform integration config still needs completion"}
          </span>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {runtime.platforms.map((platform) => (
            <div key={platform.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide text-[#c1121f]">{platform.id}</p>
                  <h3 className="mt-1 text-xl font-black text-zinc-950">{platform.name}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${platform.ready ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"}`}>
                  {platform.ready ? "Configured" : "Pending"}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-black uppercase text-zinc-500">Public URL</p>
                  <p className="mt-1 break-all font-mono text-zinc-900">{platform.publicUrl}</p>
                  <p className={`mt-2 text-xs font-bold ${platform.publicReachable ? "text-green-700" : "text-yellow-800"}`}>
                    {platform.publicReachable
                      ? `Reachable (${platform.publicStatusCode ?? "n/a"})`
                      : "Not reachable"}
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4">
                  <p className="text-xs font-black uppercase text-zinc-500">Admin URL</p>
                  <p className="mt-1 break-all font-mono text-zinc-900">{platform.adminUrl}</p>
                  <p className={`mt-2 text-xs font-bold ${platform.adminReachable ? "text-green-700" : "text-yellow-800"}`}>
                    {platform.adminReachable
                      ? `Reachable (${platform.adminStatusCode ?? "n/a"})`
                      : "Not reachable"}
                  </p>
                </div>
              </div>

              {!platform.ready ? (
                <p className="mt-3 text-xs font-bold text-yellow-800">
                  Missing env: {platform.missingEnvVars.join(", ")}
                </p>
              ) : platform.probeError ? (
                <p className="mt-3 text-xs font-bold text-zinc-600">Probe note: {platform.probeError}</p>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {APP_CONFIG.apps.map((app) => (
          <div key={app.id} className="apc-card p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <ShieldCheck size={24} />
            </div>
            <h2 className="mt-5 text-2xl font-black text-zinc-950">{app.name}</h2>
            <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#c1121f]">{app.division}</p>
            <p className="mt-4 leading-7 text-zinc-600">{app.description}</p>

            {separatedPlatformIds.has(app.id) ? (
              <Link
                href={app.separationPolicyUrl || "/apps#app-separation-policy"}
                className="mt-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-800"
              >
                App Separation Policy
              </Link>
            ) : null}

            <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs font-black uppercase text-zinc-500">App ID</p>
              <p className="mt-1 font-mono text-sm font-bold">{app.id}</p>
            </div>
            <div className="mt-6 flex gap-3">
              {runtime.platforms.find((platform) => platform.id === app.id)?.ready ? (
                <>
                  <Link href={app.adminUrl} className="apc-button-primary flex-1"><ExternalLink size={16} /> Admin</Link>
                  <Link href={app.publicUrl} className="apc-button-secondary flex-1"><ExternalLink size={16} /> Public</Link>
                </>
              ) : (
                <div className="w-full rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-900">
                  Configure platform URLs, webhook secret, and service token to enable full integration.
                </div>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
