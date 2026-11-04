import { KeyRound, ShieldCheck, Users } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import { getAccessUser } from "@/lib/access/api";
import { getAccessSnapshotForUser } from "@/lib/access/service";
import { EMPTY_ACCESS_SNAPSHOT } from "@/lib/access/types";

const areas = ["Identity Directory", "Access Requests", "Role Assignments", "Unit Access", "Account Lifecycle", "Access Review"];

export default async function AccessManagementPage() {
  const result = await getAccessSnapshotForUser(await getAccessUser());
  const snapshot = result.ok ? result.data : EMPTY_ACCESS_SNAPSHOT;
  return <AuthGuard><ExecutiveLayout><div className="space-y-8">
    <section className="apc-card-dark p-8"><div className="apc-badge">Secure Access Architecture Active</div><h1 className="mt-4 flex items-center gap-3 text-4xl font-black text-white"><KeyRound className="text-[#c1121f]" /> Access Management</h1><p className="mt-4 max-w-3xl text-zinc-300">Identity, authorization, unit access, approvals, and account lifecycle architecture for authorized APC administration.</p></section>
    <section className="apc-card border-yellow-200 bg-yellow-50 p-6"><h2 className="text-2xl font-black">Identity Provider Not Connected</h2><p className="mt-3 text-yellow-800">Personnel Integration Pending | Access Request Persistence Not Connected</p><p className="mt-2 text-sm text-yellow-700">No live account administration is available and no identities or requests are seeded.</p></section>
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{areas.map((area) => <article key={area} className="apc-card p-6"><ShieldCheck className="text-[#c1121f]" /><h2 className="mt-4 text-xl font-black">{area}</h2><p className="mt-3 text-sm text-zinc-600">Integration Pending</p></article>)}</section>
    <section className="apc-card p-6"><div className="flex items-center gap-3"><Users className="text-[#c1121f]" /><h2 className="text-2xl font-black">Account Lifecycle</h2></div><p className="mt-3 text-sm text-zinc-600">Invited | Pending Activation | Active | Suspended | Deactivated | Archived</p><p className="mt-4 text-sm font-bold text-[#c1121f]">Invitation Delivery Not Connected</p><p className="mt-2 text-sm text-zinc-500">Access source: {snapshot.sourceStatus}. Deactivation preserves future auditability and does not delete identities automatically.</p></section>
  </div></ExecutiveLayout></AuthGuard>;
}
