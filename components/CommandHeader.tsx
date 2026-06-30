import Link from "next/link";
import LiveNotificationBell from "@/components/LiveNotificationBell";
import { getLaunchReadiness } from "@/lib/launch/readiness";

export default async function CommandHeader() {
  const readiness = await getLaunchReadiness();

  return (
    <div className="mb-8 space-y-4 rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 shadow-xl shadow-black/20 backdrop-blur md:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="inline-flex rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-red-200">
            Executive Operations Platform
          </div>

          <h1 className="text-3xl font-black tracking-tight md:text-4xl">
            APC Master Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <LiveNotificationBell />
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-semibold text-white">
            Super Admin
          </div>
        </div>
      </div>

      <div className={`rounded-2xl border px-4 py-3 text-sm ${readiness.launchReady ? "border-green-300/30 bg-green-500/10 text-green-100" : "border-yellow-300/30 bg-yellow-500/10 text-yellow-100"}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-bold">
            {readiness.launchReady
              ? "Launch status: ready"
              : "Launch status: blocked by active gates"}
          </div>
          <div className="flex items-center gap-2">
            <span className="apc-status apc-status-black">Passed {readiness.passedCount}/{readiness.gates.length}</span>
            <Link href="/checklist" className="rounded-lg border border-white/20 px-3 py-1 text-xs font-black uppercase tracking-wide hover:bg-white/10">
              View Gates
            </Link>
          </div>
        </div>

        {readiness.previewBypass ? (
          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-yellow-200">
            Preview auth bypass is enabled. Set APC_PREVIEW_BYPASS_AUTH=false before launch.
          </p>
        ) : null}
      </div>
    </div>
  );
}
