import { FileKey2 } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import RoleGuard from "@/components/RoleGuard";
import { getAccessUser } from "@/lib/access/api";
import { getAccessAuditSnapshotForUser } from "@/lib/access/service";
import { EMPTY_ACCESS_SNAPSHOT } from "@/lib/access/types";

export default async function AccessAuditPage() {
  const result = await getAccessAuditSnapshotForUser(await getAccessUser());
  const snapshot = result.ok ? result.data : EMPTY_ACCESS_SNAPSHOT;
  return <AuthGuard><RoleGuard allowedRoles={["super_admin"]}><ExecutiveLayout><div className="space-y-8">
    <section className="apc-card-dark p-8"><div className="apc-badge">Access Audit Architecture</div><h1 className="mt-4 flex items-center gap-3 text-4xl font-black text-white"><FileKey2 className="text-[#c1121f]" /> Access Audit</h1><p className="mt-4 max-w-3xl text-zinc-300">A protected future boundary for identity and authorization changes.</p></section>
    <section className="apc-card border-yellow-200 bg-yellow-50 p-6"><h2 className="text-2xl font-black">Access Review Integration Pending</h2><p className="mt-3 text-yellow-800">No Live Identity Administration Data</p><p className="mt-2 text-sm text-yellow-700">No access audit records are connected. Source status: {snapshot.sourceStatus}.</p></section>
  </div></ExecutiveLayout></RoleGuard></AuthGuard>;
}
