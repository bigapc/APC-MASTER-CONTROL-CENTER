import Link from "next/link";
import { APC_UNITS, type APCIntegrationStatus, type APCUnit, type APCUnitStatus } from "@/lib/apcUnits";

function statusLabel(status: APCUnitStatus | APCIntegrationStatus) {
  return status.replaceAll("_", " ");
}

function statusClass(status: APCUnitStatus) {
  if (status === "DEVELOPMENT") return "border-blue-200 bg-blue-50 text-blue-700";
  if (status === "OPERATIONAL") return "border-green-200 bg-green-50 text-green-700";
  if (status === "ATTENTION_REQUIRED") return "border-red-200 bg-red-50 text-red-700";
  if (status === "OFFLINE") return "border-zinc-300 bg-zinc-100 text-zinc-700";
  return "border-yellow-200 bg-yellow-50 text-yellow-700";
}

export default function APCUnitStatusBoard({ compact = false, units: providedUnits }: { compact?: boolean; units?: readonly APCUnit[] }) {
  const allUnits = providedUnits ?? APC_UNITS;
  const units = compact ? allUnits.slice(0, 10) : allUnits;

  return (
    <section className="apc-card p-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="apc-badge">Development Data</p>
          <h2 className="mt-3 text-2xl font-black">APC Unit Directory</h2>
          <p className="mt-2 text-sm text-zinc-600">Honest readiness states for APC units awaiting approved connections.</p>
        </div>
        {compact ? <Link href="/units" className="font-bold text-[#c1121f] hover:underline">View all units</Link> : null}
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {units.map((unit) => (
          <article key={unit.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-black">{unit.name}</h3>
              <span className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-wide ${statusClass(unit.status)}`}>{statusLabel(unit.status)}</span>
            </div>
            <p className="mt-3 text-sm text-zinc-600">{unit.description}</p>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-zinc-500">Integration: {statusLabel(unit.integrationStatus)}</p>
            <p className="mt-2 text-xs text-zinc-500">{unit.primaryRoute ? `APC route: ${unit.primaryRoute}` : "Future connection placeholder"}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
