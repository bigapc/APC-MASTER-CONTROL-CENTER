import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import APCUnitStatusBoard from "@/components/APCUnitStatusBoard";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import { getUnitsUser } from "@/lib/units/api";
import { getUnitDirectoryForUser } from "@/lib/units/service";
import type { UnitDirectorySnapshot } from "@/lib/units/types";

export default async function UnitsPage() {
  const result = await getUnitDirectoryForUser(await getUnitsUser());
  const snapshot: UnitDirectorySnapshot = result.ok ? result.data : { units: [], sourceStatus: "NOT_CONNECTED" };
  return (
    <AuthGuard>
      <ExecutiveLayout>
        <div className="space-y-8">
          <section className="apc-card-dark p-8">
            <div className="apc-badge">APC Operations</div>
            <h1 className="mt-4 text-4xl font-black text-white">APC Unit Directory</h1>
            <p className="mt-4 max-w-3xl text-zinc-300">
              A centralized directory for {APC_COMMAND.companyName} units, future products,
              and integration-ready operating surfaces.
            </p>
            <p className="mt-3 text-sm text-zinc-400">{APC_COMMAND.mission}</p>
          </section>
          <p className="text-sm text-zinc-500">Unit source: {snapshot.sourceStatus}</p>
          <APCUnitStatusBoard units={snapshot.units} />
        </div>
      </ExecutiveLayout>
    </AuthGuard>
  );
}