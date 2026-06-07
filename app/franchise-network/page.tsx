import { Globe, Building2 } from "lucide-react";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import DataSourceBadge from "@/components/DataSourceBadge";
import DatasetSourceList from "@/components/DatasetSourceList";
import { getFranchiseMetricsWithSource } from "@/lib/supabaseAdapter";

export default async function FranchiseNetworkPage() {
  const franchiseMetricsResult = await getFranchiseMetricsWithSource();
  const franchiseMetrics = franchiseMetricsResult.data;

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">APC Growth Network</div>
        <div className="mt-4">
          <DataSourceBadge />
        </div>

        <DatasetSourceList
          className="mt-4 border-white/20 bg-white/5"
          title="Franchise Dataset Sources"
          statuses={[franchiseMetricsResult.status]}
        />

        <h1 className="mt-4 text-4xl font-black text-white">
          Franchise Operations Center
        </h1>

        <p className="mt-4 text-zinc-300">
          Future dispatch franchise and licensing management network.
        </p>
        <p className="mt-3 text-zinc-400">{APC_COMMAND.mission}</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="apc-card p-6">
          <Building2 className="text-[#c1121f]" />
          <h2 className="mt-4 text-2xl font-black">Active Franchises</h2>
          <p className="mt-2 text-4xl font-black">{franchiseMetrics.activeFranchises}</p>
        </div>

        <div className="apc-card p-6">
          <Globe className="text-[#c1121f]" />
          <h2 className="mt-4 text-2xl font-black">Expansion Regions</h2>
          <p className="mt-2 text-4xl font-black">{franchiseMetrics.expansionRegions}</p>
        </div>
      </section>
    </div>
  );
}
