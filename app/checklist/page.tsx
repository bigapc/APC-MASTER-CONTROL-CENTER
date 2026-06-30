import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { getLaunchReadiness } from "@/lib/launch/readiness";

function gateBadge(passed: boolean) {
  return passed ? "apc-status apc-status-green" : "apc-status apc-status-red";
}

export default async function ChecklistPage() {
  const { runtime, gates, passedCount, failedCount, launchReady } = await getLaunchReadiness();

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Launch Readiness</div>
        <h1 className="mt-4 text-4xl font-black text-white">APC Launch Gate Checklist</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Hard go/no-go gates for production launch across authentication, backend connectivity, and platform endpoints.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-bold">
          <span className={launchReady ? "apc-status apc-status-green" : "apc-status apc-status-red"}>
            {launchReady ? "Launch Ready" : "Not Launch Ready"}
          </span>
          <span className="apc-status apc-status-black">Passed: {passedCount}/{gates.length}</span>
          <span className="apc-status apc-status-yellow">Failed: {failedCount}</span>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Gate Results</h2>
        <div className="mt-6 grid gap-4">
          {gates.map((gate) => (
            <div key={gate.id} className="rounded-2xl border border-black/5 bg-zinc-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="text-[#c1121f]">
                    {gate.passed ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                  </div>
                  <p className="font-black text-zinc-950">{gate.label}</p>
                </div>
                <span className={gateBadge(gate.passed)}>{gate.passed ? "PASS" : "FAIL"}</span>
              </div>

              <p className="mt-2 text-sm text-zinc-600">{gate.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {!launchReady ? (
        <section className="apc-card p-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-[#c1121f]" />
            <h2 className="text-2xl font-black">Launch Blockers</h2>
          </div>

          <div className="mt-4 space-y-2 text-sm text-zinc-700">
            {gates
              .filter((gate) => !gate.passed)
              .map((gate) => (
                <div key={gate.id} className="rounded-xl border border-red-200 bg-red-50 px-3 py-2">
                  <p className="font-black text-red-900">{gate.label}</p>
                  <p className="mt-1 text-red-800">{gate.detail}</p>
                </div>
              ))}
          </div>
        </section>
      ) : (
        <section className="apc-card p-6">
          <h2 className="text-2xl font-black">Go Signal</h2>
          <p className="mt-2 text-zinc-700">
            All launch gates are passing. You can proceed with controlled production rollout.
          </p>
        </section>
      )}

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Platform Detail</h2>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {runtime.platforms.map((platform) => (
            <div key={platform.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="font-black text-zinc-900">{platform.name}</p>
                <span className={platform.ready ? "apc-status apc-status-green" : "apc-status apc-status-yellow"}>
                  {platform.ready ? "Configured" : "Pending"}
                </span>
              </div>

              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-zinc-500">
                Public {platform.publicStatusCode ?? "n/a"} | Admin {platform.adminStatusCode ?? "n/a"}
              </p>
              <p className="mt-2 text-sm text-zinc-700">
                {platform.publicReachable && platform.adminReachable
                  ? "Public and admin endpoints reachable."
                  : platform.probeError ?? "Endpoint connectivity still pending."}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
