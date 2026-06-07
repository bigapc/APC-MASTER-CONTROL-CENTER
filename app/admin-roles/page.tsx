import { Shield, UserCheck, Crown } from "lucide-react";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import DataSourceBadge from "@/components/DataSourceBadge";
import DatasetSourceList from "@/components/DatasetSourceList";
import { getAdminRoleItemsWithSource } from "@/lib/supabaseAdapter";

export default async function AdminRolesPage() {
  const adminRoleItemsResult = await getAdminRoleItemsWithSource();
  const adminRoleItems = adminRoleItemsResult.data;

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Access Control</div>
        <div className="mt-4">
          <DataSourceBadge />
        </div>

        <DatasetSourceList
          className="mt-4 border-white/20 bg-white/5"
          title="Admin Roles Dataset Sources"
          statuses={[adminRoleItemsResult.status]}
        />

        <h1 className="mt-4 text-4xl font-black text-white">
          APC Admin Roles Center
        </h1>

        <p className="mt-4 text-zinc-300">
          Role management and permissions across all APC platforms.
        </p>
        <p className="mt-3 text-zinc-400">{APC_COMMAND.mission}</p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <div className="apc-card p-6">
          <Crown className="text-[#c1121f]" />
          <p className="mt-3 font-bold">Super Admins</p>
          <p className="text-4xl font-black">
            {adminRoleItems.find((item) => item.role === "APC Super Admin")?.users ?? 0}
          </p>
        </div>

        <div className="apc-card p-6">
          <Shield className="text-[#c1121f]" />
          <p className="mt-3 font-bold">Platform Admins</p>
          <p className="text-4xl font-black">
            {adminRoleItems.find((item) => item.role === "Application Admin")?.users ?? 0}
          </p>
        </div>

        <div className="apc-card p-6">
          <UserCheck className="text-[#c1121f]" />
          <p className="mt-3 font-bold">Dispatchers</p>
          <p className="text-4xl font-black">
            {adminRoleItems.find((item) => item.role === "Dispatcher")?.users ?? 0}
          </p>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Role Directory</h2>

        <div className="mt-5 space-y-4">
          {adminRoleItems.map((role) => (
            <div key={role.role} className="rounded-xl bg-zinc-50 p-5">
              <h3 className="font-black">{role.role}</h3>

              <p className="text-sm text-zinc-600">{role.access}</p>

              <p className="text-sm text-zinc-600">
                Assigned Users: {role.users}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
