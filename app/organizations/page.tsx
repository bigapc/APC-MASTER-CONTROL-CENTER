import { Building2, Users, Shield } from "lucide-react";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import DataSourceBadge from "@/components/DataSourceBadge";
import DatasetSourceList from "@/components/DatasetSourceList";
import { getOrganizationItemsWithSource } from "@/lib/supabaseAdapter";

export default async function OrganizationsPage() {
  const organizationItemsResult = await getOrganizationItemsWithSource();
  const organizationItems = organizationItemsResult.data;

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">APC Organizations</div>
        <div className="mt-4">
          <DataSourceBadge />
        </div>

        <DatasetSourceList
          className="mt-4 border-white/20 bg-white/5"
          title="Organizations Dataset Sources"
          statuses={[organizationItemsResult.status]}
        />

        <h1 className="mt-4 text-4xl font-black text-white">
          Organizations Command Center
        </h1>

        <p className="mt-4 text-zinc-300">
          Monitor community partners, agencies, nonprofits and APC affiliates.
        </p>
        <p className="mt-3 text-zinc-400">{APC_COMMAND.mission}</p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="apc-card p-6">
          <Building2 className="text-[#c1121f]" />
          <p className="mt-3 font-bold">Organizations</p>
          <p className="text-4xl font-black">{organizationItems.length}</p>
        </div>

        <div className="apc-card p-6">
          <Users className="text-[#c1121f]" />
          <p className="mt-3 font-bold">Members</p>
          <p className="text-4xl font-black">
            {organizationItems.reduce((sum, item) => sum + item.members, 0)}
          </p>
        </div>

        <div className="apc-card p-6">
          <Shield className="text-[#c1121f]" />
          <p className="mt-3 font-bold">Active Partners</p>
          <p className="text-4xl font-black">
            {organizationItems.filter((item) => item.status === "Active").length}
          </p>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Partner Organizations</h2>

        <div className="mt-5 space-y-4">
          {organizationItems.map((org) => (
            <div key={org.name} className="rounded-xl bg-zinc-50 p-5">
              <h3 className="font-black">{org.name}</h3>

              <p className="text-sm text-zinc-600">Members: {org.members}</p>

              <p className="text-sm text-zinc-600">Status: {org.status}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
