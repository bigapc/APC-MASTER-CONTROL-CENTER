import { LockKeyhole, UserRound } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import PersonnelRoster from "@/components/PersonnelRoster";
import { PERSONNEL_DIRECTORY_FIELDS } from "@/lib/organization/structure";
import { getPersonnelUser } from "@/lib/personnel/api";
import { getPersonnelSnapshotForUser } from "@/lib/personnel/service";
import { EMPTY_PERSONNEL_SNAPSHOT } from "@/lib/personnel/types";

export default async function PersonnelPage() {
  const result = await getPersonnelSnapshotForUser(await getPersonnelUser());
  const snapshot = result.ok ? result.data : EMPTY_PERSONNEL_SNAPSHOT;
  return (
    <AuthGuard>
      <ExecutiveLayout>
        <div className="space-y-8">
          <section className="apc-card-dark p-8">
            <div className="apc-badge">Personnel Architecture</div>
            <h1 className="mt-4 flex items-center gap-3 text-4xl font-black text-white"><UserRound className="text-[#c1121f]" /> APC Personnel Directory</h1>
            <p className="mt-4 max-w-3xl text-zinc-300">A future-ready directory boundary for authorized personnel records without creating sample employee profiles.</p>
          </section>
          <section className="apc-card border-yellow-200 bg-yellow-50 p-8"><h2 className="text-2xl font-black">Personnel Directory Integration Pending</h2><p className="mt-3 text-yellow-800">No Personnel Records Connected</p><p className="mt-2 text-sm text-yellow-700">Personnel data requires an approved source, privacy design, and explicit authorization before records are displayed.</p><p className="mt-2 text-sm text-yellow-700">Source: {snapshot.sourceStatus} | Records: {snapshot.personnel.length}</p></section>
          <PersonnelRoster personnel={snapshot.personnel} />
          <section className="apc-card p-6"><div className="flex items-center gap-3"><LockKeyhole className="text-[#c1121f]" /><h2 className="text-2xl font-black">Future Directory Fields</h2></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{PERSONNEL_DIRECTORY_FIELDS.map((field) => <div key={field} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm font-bold">{field}</div>)}</div><p className="mt-5 text-sm text-zinc-500">Family, trusted team, professional staff, contractors, and partners must all receive explicit authorization. No access is automatic because of a personal relationship.</p></section>
        </div>
      </ExecutiveLayout>
    </AuthGuard>
  );
}
