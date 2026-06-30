import { getCapabilityCounts, MASTER_PLATFORM_CAPABILITIES, type CapabilityStatus } from "@/lib/config/masterPlatformCapabilities";
import { getCapabilityReadiness, type CapabilityRuntimeState } from "@/lib/launch/capabilityReadiness";

const statusClasses: Record<CapabilityStatus, string> = {
  active: "bg-green-100 text-green-800",
  "in-progress": "bg-amber-100 text-amber-900",
  planned: "bg-zinc-200 text-zinc-800",
};

const readinessClasses: Record<CapabilityRuntimeState, string> = {
  ready: "bg-green-100 text-green-800",
  degraded: "bg-amber-100 text-amber-900",
  "not-configured": "bg-red-100 text-red-800",
};

export default async function MasterPlatformScope() {
  const counts = getCapabilityCounts();
  const readiness = await getCapabilityReadiness();
  const readinessById = Object.fromEntries(
    readiness.capabilities.map((capability) => [capability.id, capability])
  );

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-300">Platform Scope</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-white md:text-4xl">Master Platform Intelligence Domains</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
            APC is anchored around live maps, GPS tracking, alert operations, historical school data access, and financial analytics.
          </p>
        </div>

        <div className="rounded-2xl border border-white/15 bg-black/20 px-4 py-3 text-sm font-bold text-zinc-100">
          {counts.active} active • {counts.inProgress} in-progress • {counts.planned} planned
          <div className="mt-2 text-xs font-bold text-zinc-300">
            Runtime: {readiness.readyCount} ready • {readiness.degradedCount} degraded • {readiness.notConfiguredCount} not configured
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MASTER_PLATFORM_CAPABILITIES.map((capability) => {
          const runtime = readinessById[capability.id] ?? {
            id: capability.id,
            title: capability.title,
            domain: capability.domain,
            state: "not-configured" as const,
            detail: "Readiness data unavailable for this capability.",
            missingRequirements: ["Capability readiness mapping"],
          };

          return (
            <article key={capability.id} className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-black text-white">{capability.title}</h3>
                <span className={`rounded-full px-3 py-1 text-xs font-black uppercase ${statusClasses[capability.status]}`}>
                  {capability.status}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${readinessClasses[runtime.state]}`}>
                  {runtime.state}
                </span>
                <p className="text-xs font-bold text-zinc-400">runtime readiness</p>
              </div>

              <p className="mt-3 text-sm leading-6 text-zinc-300">{capability.description}</p>
              <p className="mt-3 text-xs font-bold text-zinc-300">{runtime.detail}</p>
              {runtime.missingRequirements.length > 0 ? (
                <p className="mt-2 text-xs font-bold text-red-300">
                  Missing: {runtime.missingRequirements.join(", ")}
                </p>
              ) : null}
              <p className="mt-4 text-xs font-black uppercase tracking-wide text-zinc-400">Primary Sources</p>
              <p className="mt-2 text-sm text-zinc-200">{capability.dataSources.join(" • ")}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}