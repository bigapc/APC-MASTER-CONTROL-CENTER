import { BadgeCheck, BookOpenCheck, FileCheck2, GitBranch, LockKeyhole, ShieldCheck } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import GovernanceAdministration from "@/components/GovernanceAdministration";
import { getGovernanceUser } from "@/lib/governance/api";
import { getGovernance } from "@/lib/governance/service";

const domains = [
  [FileCheck2, "Policies", "Versioned policy records and controlled lifecycle"],
  [BookOpenCheck, "Procedures", "Operational procedures kept separate from policy"],
  [GitBranch, "Review and approval", "Draft, review, approval, and activation workflow"],
  [BadgeCheck, "Acknowledgments", "Future evidence that a policy version was received"],
  [ShieldCheck, "AI and incident governance", "Relationship-ready architecture without provider enforcement"],
  [LockKeyhole, "Access governance", "Governance relationships complement AuthGuard and RoleGuard"],
] as const;

export default async function GovernancePage() {
  const result = await getGovernance(await getGovernanceUser());
  const snapshot = result.ok ? result.data : { policies: [], procedures: [], policyVersions: [], approvals: [], acknowledgments: [], sourceStatus: "LOCAL_DEVELOPMENT" as const };
  const sections = [
    ["Policies", snapshot.policies.length === 0 ? "No governance policies have been created yet." : `${snapshot.policies.length} locally stored policy record(s).`],
    ["Procedures", snapshot.procedures.length === 0 ? "No procedures have been created yet." : `${snapshot.procedures.length} locally stored procedure record(s).`],
    ["Policy versions", snapshot.policyVersions.length === 0 ? "No policy versions have been created yet." : `${snapshot.policyVersions.length} locally stored policy version(s).`],
    ["Approvals", snapshot.approvals.length === 0 ? "No approvals have been recorded." : `${snapshot.approvals.length} locally recorded approval(s).`],
    ["Acknowledgments", snapshot.acknowledgments.length === 0 ? "No acknowledgments have been recorded." : `${snapshot.acknowledgments.length} locally recorded acknowledgment(s).`],
  ] as const;
  return <AuthGuard><ExecutiveLayout><div className="space-y-8">
    <section className="apc-card-dark p-8"><div className="apc-badge">Governance Architecture Active</div><h1 className="mt-4 text-4xl font-black text-white">Policy, Compliance &amp; Governance Center</h1><p className="mt-4 max-w-3xl text-zinc-300">Internal governance architecture for APC policies, procedures, review, approval, acknowledgment, access, AI, incidents, and unit operations.</p></section>
    <section className="apc-card border-yellow-200 bg-yellow-50 p-6"><h2 className="text-2xl font-black">Local Development Persistence Active</h2><p className="mt-3 text-yellow-800">Production Persistence Not Connected | Supabase Not Connected</p><p className="mt-2 text-sm text-yellow-700">Live Governance Records: None. Local in-memory state is development-only and does not represent compliance.</p></section>
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{domains.map(([Icon, title, description]) => <article key={title} className="apc-card p-6"><Icon className="text-[#c1121f]" /><h2 className="mt-4 text-xl font-black">{title}</h2><p className="mt-3 text-sm text-zinc-600">{description}</p><p className="mt-4 text-sm font-bold text-[#c1121f]">Architecture Ready | Local / In-Memory Only</p></article>)}</section>
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{sections.map(([title, message]) => <article key={title} className="apc-card p-6"><h2 className="text-xl font-black">{title}</h2><p className="mt-3 text-sm text-zinc-600">{message}</p></article>)}</section>
    <GovernanceAdministration initialSnapshot={snapshot} />
    <section className="apc-card p-6"><h2 className="text-2xl font-black">Policy lifecycle</h2><p className="mt-3 text-sm text-zinc-600">Draft → Under Review → Changes Requested → Pending Approval → Approved → Active → Superseded / Archived / Retired</p><p className="mt-4 text-sm text-zinc-500">Administrative authority remains limited to <strong>super_admin</strong> until formal APC governance permissions are approved.</p><p className="mt-2 text-sm text-zinc-500">Adapter status: {snapshot?.sourceStatus ?? "LOCAL_DEVELOPMENT"}. Local records begin empty and are not live compliance data.</p></section>
  </div></ExecutiveLayout></AuthGuard>;
}