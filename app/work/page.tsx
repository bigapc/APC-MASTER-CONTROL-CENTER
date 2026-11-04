import { CheckSquare, ClipboardCheck, FolderKanban, ListChecks } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import WorkTaskFilters from "@/components/WorkTaskFilters";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import { getWorkUser } from "@/lib/work/api";
import { getWorkSnapshotForUser } from "@/lib/work/service";
import { EMPTY_APC_WORK } from "@/lib/work/types";

const workAreas = [
  { title: "My Future Assignments", empty: "No Assigned Work Available", icon: CheckSquare },
  { title: "Unit Projects", empty: "No Task System Connected", icon: FolderKanban },
  { title: "Company Initiatives", empty: "Task Integration Pending", icon: ListChecks },
  { title: "Department Work", empty: "No Assigned Work Available", icon: CheckSquare },
  { title: "Approval Queue", empty: "No Approval Requests Connected", icon: ClipboardCheck },
  { title: "Operational Follow-Ups", empty: "Task Integration Pending", icon: ListChecks },
];

const workflowStates = [
  ["Project statuses", "Planned | Active | On Hold | Needs Attention | Completed | Cancelled"],
  ["Task statuses", "Not Started | In Progress | Blocked | Awaiting Approval | Completed | Cancelled"],
  ["Approval states", "Not Required | Pending | Approved | Changes Requested | Rejected"],
  ["Priority levels", "Critical | High | Normal | Low"],
];

export default async function WorkPage() {
  const result = await getWorkSnapshotForUser(await getWorkUser());
  const workSnapshot = result.ok ? result.data : EMPTY_APC_WORK;

  return (
    <AuthGuard>
      <ExecutiveLayout>
        <div className="space-y-8">
          <section className="apc-card-dark p-8">
            <div className="apc-badge">Workflow Architecture</div>
            <h1 className="mt-4 text-4xl font-black text-white">APC Work Management</h1>
            <p className="mt-4 max-w-3xl text-zinc-300">A central workspace for company initiatives, APC unit projects, department work, assignments, approvals, and operational follow-ups.</p>
            <p className="mt-3 text-sm text-zinc-400">{APC_COMMAND.mission}</p>
          </section>

          <section className="apc-card border-yellow-200 bg-yellow-50 p-6">
            <h2 className="text-2xl font-black">No Live Workflow Data Connected</h2>
            <p className="mt-3 text-yellow-800">No Task System Connected | Task Integration Pending</p>
            <p className="mt-2 text-sm text-yellow-700">No projects, tasks, assignments, approvals, or operational history are seeded in this architecture.</p>
          </section>

          <WorkTaskFilters tasks={workSnapshot.tasks} />

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {workAreas.map(({ title, empty, icon: Icon }) => (
              <article key={title} className="apc-card p-6">
                <Icon className="text-[#c1121f]" />
                <h2 className="mt-4 text-xl font-black">{title}</h2>
                <p className="mt-3 text-sm text-zinc-600">{empty}</p>
              </article>
            ))}
          </section>

          <section className="apc-card p-6">
            <h2 className="text-2xl font-black">Workflow State Architecture</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {workflowStates.map(([label, values]) => (
                <div key={label} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  <h3 className="font-black">{label}</h3>
                  <p className="mt-2 text-sm text-zinc-600">{values}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <article className="apc-card p-6">
              <h2 className="text-2xl font-black">Approval Flow</h2>
              <p className="mt-3 text-sm text-zinc-600">Request Created → Appropriate Reviewer → Approved / Changes Requested / Rejected → Authorized Action</p>
              <p className="mt-4 text-sm font-bold text-[#c1121f]">Actions are never automatically approved.</p>
            </article>
            <article className="apc-card p-6">
              <h2 className="text-2xl font-black">Future AI Assistance</h2>
              <p className="mt-3 text-sm text-zinc-600">Priority recommendations, workflow organization, summaries, blocker detection, and follow-up suggestions remain subject to authorized human review.</p>
              <p className="mt-4 text-sm font-bold text-[#c1121f]">AI cannot assign work, approve actions, change statuses, or make personnel decisions.</p>
            </article>
          </section>

          <section className="apc-card p-6">
            <h2 className="text-2xl font-black">Integration-Ready Data Boundary</h2>
            <p className="mt-3 text-sm text-zinc-600">Projects and tasks reference the centralized APC Unit Registry, organization departments, and future authorized personnel identifiers without creating duplicate units, users, or records.</p>
            <p className="mt-4 text-xs font-black uppercase tracking-wide text-[#c1121f]">Work source: {workSnapshot.sourceStatus}</p>
          </section>
        </div>
      </ExecutiveLayout>
    </AuthGuard>
  );
}
