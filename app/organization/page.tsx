import { Building2, Network, Users } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import { getOrganizationUser } from "@/lib/organization/api";
import { getOrganizationSnapshotForUser } from "@/lib/organization/service";
import { EMPTY_ORGANIZATION_SNAPSHOT } from "@/lib/organization/structure";

const levelLabels = {
  OWNER_EXECUTIVE: "Level 1 - Owner / Executive Authority",
  EXECUTIVE_LEADERSHIP: "Level 2 - Executive Leadership",
  UNIT_LEADERSHIP: "Level 3 - Unit Leadership",
  SUPERVISORS: "Level 4 - Supervisors",
  STAFF: "Level 5 - Staff / Team Members",
} as const;

export default async function OrganizationPage() {
  const result = await getOrganizationSnapshotForUser(await getOrganizationUser());
  const snapshot = result.ok ? result.data : EMPTY_ORGANIZATION_SNAPSHOT;
  return (
    <AuthGuard>
      <ExecutiveLayout>
        <div className="space-y-8">
          <section className="apc-card-dark p-8">
            <div className="apc-badge">Organizational Architecture</div>
            <h1 className="mt-4 flex items-center gap-3 text-4xl font-black text-white"><Building2 className="text-[#c1121f]" /> {APC_COMMAND.companyName} Organization</h1>
            <p className="mt-4 max-w-3xl text-zinc-300">A future-ready structure for executive leadership, departments, APC unit leadership, supervisors, staff, contractors, and authorized partners.</p>
            <p className="mt-3 text-sm text-zinc-400">{APC_COMMAND.mission}</p>
          </section>

          {(Object.keys(levelLabels) as Array<keyof typeof levelLabels>).map((level) => (
            <section key={level} className="apc-card p-6">
              <h2 className="text-2xl font-black">{levelLabels[level]}</h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {snapshot.positions.filter((position) => position.level === level).map((position) => (
                  <article key={position.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                    <h3 className="font-black">{position.title}</h3>
                    <p className="mt-2 text-sm text-zinc-600">{position.responsibility}</p>
                    <p className="mt-4 text-xs font-black uppercase tracking-wide text-[#c1121f]">Position Not Assigned</p>
                    <p className="mt-2 text-xs text-zinc-500">Reports to: {position.reportsToPositionId ?? "APC Executive Authority"}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section className="apc-card p-6">
            <div className="flex items-center gap-3"><Network className="text-[#c1121f]" /><h2 className="text-2xl font-black">Departments</h2></div>
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {snapshot.departments.map((department) => (
                <article key={department.id} className="rounded-xl border border-zinc-200 p-5">
                  <h3 className="font-black">{department.name}</h3>
                  <p className="mt-3 text-sm text-zinc-600">Leader: Position Not Assigned</p>
                  <p className="mt-2 text-sm text-zinc-600">Assigned staff: None connected</p>
                  <p className="mt-3 text-xs text-zinc-500">{department.responsibilities.join(" | ")}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="apc-card p-6"><div className="flex items-center gap-3"><Users className="text-[#c1121f]" /><h2 className="text-2xl font-black">Access Separation</h2></div><p className="mt-3 text-sm text-zinc-600">Organizational positions do not grant application access. Application authorization roles, including super_admin, remain separately assigned through existing APC authorization mechanisms.</p></section>
        </div>
      </ExecutiveLayout>
    </AuthGuard>
  );
}
