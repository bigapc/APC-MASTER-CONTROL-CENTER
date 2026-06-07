import { Building2, Users } from "lucide-react";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import DataSourceBadge from "@/components/DataSourceBadge";
import DatasetSourceList from "@/components/DatasetSourceList";
import { getAgencyItemsWithSource } from "@/lib/supabaseAdapter";

export default async function AgencyManagementPage() {
  const agencyItemsResult = await getAgencyItemsWithSource();
  const agencyItems = agencyItemsResult.data;

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Agency Oversight</div>
        <div className="mt-4">
          <DataSourceBadge />
        </div>

        <DatasetSourceList
          className="mt-4 border-white/20 bg-white/5"
          title="Agency Dataset Sources"
          statuses={[agencyItemsResult.status]}
        />

        <h1 className="mt-4 text-4xl font-black text-white">
          Agency Management Center
        </h1>

        <p className="mt-4 text-zinc-300">
          Manage APC partner agencies, organizations and affiliates.
        </p>
        <p className="mt-3 text-zinc-400">{APC_COMMAND.mission}</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="apc-card p-6">
          <Building2 className="text-[#c1121f]" />
          <p className="mt-3 font-bold">Agencies</p>
          <p className="text-4xl font-black">{agencyItems.length}</p>
        </div>

        <div className="apc-card p-6">
          <Users className="text-[#c1121f]" />
          <p className="mt-3 font-bold">Active Members</p>
          <p className="text-4xl font-black">
            {agencyItems.filter((item) => item.status === "Active").length * 18}
          </p>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Agency Directory</h2>

        <div className="mt-5 space-y-4">
          {agencyItems.map((agency) => (
            <div key={agency.name} className="rounded-xl bg-zinc-50 p-5">
              <h3 className="font-black">{agency.name}</h3>

              <p className="text-sm text-zinc-600">{agency.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
