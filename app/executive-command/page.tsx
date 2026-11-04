import { Crown, Landmark, BriefcaseBusiness, Megaphone, Cpu, ShieldCheck, Activity, Database } from "lucide-react";
import Link from "next/link";
import DataSourceBadge from "@/components/DataSourceBadge";
import AuthGuard from "@/components/AuthGuard";
import RoleGuard from "@/components/RoleGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import APCUnitStatusBoard from "@/components/APCUnitStatusBoard";
import { APC_AI_ASSISTANTS } from "@/lib/ai/registry";
import { APC_DEPARTMENTS, APC_POSITIONS } from "@/lib/organization/structure";
import { EMPTY_APC_WORK } from "@/lib/work/types";
import { EMPTY_INCIDENT_SNAPSHOT } from "@/lib/incidents/types";
import { EMPTY_ACCESS_SNAPSHOT } from "@/lib/access/types";
import { getGatewayStatus } from "@/lib/events/gatewayService";

const executives = [
  {
    role: "CFO",
    title: "Chief Financial Officer",
    description: "Financial oversight and authorized enterprise financial health.",
    icon: Landmark,
    status: "Data integration pending authorization",
  },
  {
    role: "COO",
    title: "Chief Operating Officer",
    description: "Enterprise operations, execution, and cross-unit performance oversight.",
    icon: BriefcaseBusiness,
    status: "Operational integration pending authorization",
  },
  {
    role: "CMO",
    title: "Chief Marketing Officer",
    description: "Brand, growth, communications, and authorized marketing performance oversight.",
    icon: Megaphone,
    status: "Marketing integration pending authorization",
  },
  {
    role: "CTO",
    title: "Chief Technology Officer",
    description: "Technology health, platform architecture, and approved systems oversight.",
    icon: Cpu,
    status: "Technology integration pending authorization",
  },
  {
    role: "CSO",
    title: "Chief Safety Officer",
    description: "Safety governance, critical oversight, and authorized risk visibility.",
    icon: ShieldCheck,
    status: "Safety integration pending authorization",
  },
];

export default function ExecutiveCommandPage() {
  const gatewayStatus = getGatewayStatus();

  return (
    <AuthGuard>
      <RoleGuard allowedRoles={["super_admin"]}>
        <ExecutiveLayout>
          <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div>
            <div className="apc-badge">Private Oversight</div>
            <h1 className="mt-4 flex items-center gap-3 text-4xl font-black text-white">
              <Crown className="text-[#c1121f]" />
              APC Executive Command
            </h1>
            <p className="mt-4 max-w-3xl text-zinc-300">
              Owner-level oversight for authorized executive leadership, enterprise health,
              and strategic decision support across the Armstrong Pack Company ecosystem.
            </p>
            <p className="mt-3 text-sm text-zinc-400">
              Executive Command does not invent metrics. Live data appears only after an
              approved and authorized integration is connected.
            </p>
          </div>
          <DataSourceBadge />
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {executives.map(({ role, title, description, icon: Icon, status }) => (
          <article key={role} className="apc-card p-6">
            <Icon className="text-[#c1121f]" />
            <p className="mt-4 text-sm font-bold tracking-wide text-zinc-500">{role}</p>
            <h2 className="mt-1 text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm text-zinc-600">{description}</p>
            <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-600">
              {status}
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="apc-card p-6">
          <Activity className="text-[#c1121f]" />
          <h2 className="mt-4 text-2xl font-black">Enterprise Command Status</h2>
          <p className="mt-3 text-zinc-600">
            This foundation is ready to receive authorized summaries from APC operating
            units without replacing their local Command, Dispatcher, Hub, or management teams.
          </p>
        </article>

        <article className="apc-card p-6">
          <Database className="text-[#c1121f]" />
          <h2 className="mt-4 text-2xl font-black">Data Governance</h2>
          <p className="mt-3 text-zinc-600">
            Cross-platform information must retain source ownership, authorization boundaries,
            and least-privilege access. Unavailable data is shown as unavailable rather than
            simulated as live enterprise information.
          </p>
        </article>
      </section>

      <APCUnitStatusBoard compact />

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">APC AI Oversight</h2>
        <p className="mt-3 text-sm text-zinc-600">Provider connection: NOT_CONNECTED | Integration readiness: INTEGRATION_PENDING</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {APC_AI_ASSISTANTS.map((assistant) => (
            <div key={assistant.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-black">{assistant.name}</p>
              <p className="mt-2 text-sm text-zinc-600">Access roles: {assistant.permittedRoles.join(", ")}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#c1121f]">Human review required</p>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm font-bold text-zinc-600">No Live AI Activity</p>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Owner Organizational Oversight</h2>
        <p className="mt-3 text-sm text-zinc-600">Personnel Integration Pending | No live personnel or reporting data connected.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Executive positions</p><p className="mt-2 text-2xl font-black">{APC_POSITIONS.filter((position) => position.level === "EXECUTIVE_LEADERSHIP").length}</p><p className="mt-2 text-xs text-zinc-500">Position definitions only</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Departments</p><p className="mt-2 text-2xl font-black">{APC_DEPARTMENTS.length}</p><p className="mt-2 text-xs text-zinc-500">No leaders assigned</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Personnel records</p><p className="mt-2 text-2xl font-black">0</p><p className="mt-2 text-xs text-zinc-500">Integration pending</p></div>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Workflow and Project Oversight</h2>
        <p className="mt-3 text-sm text-zinc-600">No Live Workflow Data Connected</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Projects</p><p className="mt-2 text-2xl font-black">{EMPTY_APC_WORK.projects.length}</p><p className="mt-2 text-xs text-zinc-500">Future company and unit initiatives</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Tasks</p><p className="mt-2 text-2xl font-black">{EMPTY_APC_WORK.tasks.length}</p><p className="mt-2 text-xs text-zinc-500">Future assignments and follow-ups</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Approvals</p><p className="mt-2 text-2xl font-black">{EMPTY_APC_WORK.approvals.length}</p><p className="mt-2 text-xs text-zinc-500">No approval requests connected</p></div>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Critical Operations</h2>
        <p className="mt-3 text-sm text-zinc-600">No Live Critical Operations Data</p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Incidents</p><p className="mt-2 text-2xl font-black">{EMPTY_INCIDENT_SNAPSHOT.incidents.length}</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Escalations</p><p className="mt-2 text-2xl font-black">0</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Unit Alerts</p><p className="mt-2 text-2xl font-black">0</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Executive Attention</p><p className="mt-2 text-sm font-black">No live feed connected</p></div>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Identity and Access Oversight</h2>
        <p className="mt-3 text-sm text-zinc-600">No Live Identity Administration Data</p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Active accounts</p><p className="mt-2 text-2xl font-black">{EMPTY_ACCESS_SNAPSHOT.identities.length}</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Access requests</p><p className="mt-2 text-2xl font-black">{EMPTY_ACCESS_SNAPSHOT.requests.length}</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Unit access reviews</p><p className="mt-2 text-2xl font-black">{EMPTY_ACCESS_SNAPSHOT.unitAccess.length}</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Critical access concerns</p><p className="mt-2 text-sm font-black">No live data</p></div>
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Integration Oversight</h2>
        <p className="mt-3 text-sm text-zinc-600">No Live APC Integrations Connected</p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Connected units</p><p className="mt-2 text-2xl font-black">0</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Pending integrations</p><p className="mt-2 text-2xl font-black">{gatewayStatus.persistence === "NOT_CONNECTED" ? "All" : "Pending"}</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Event processing</p><p className="mt-2 text-sm font-black">No live events</p></div>
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4"><p className="text-sm font-bold text-zinc-500">Critical attention</p><p className="mt-2 text-sm font-black">No live feed</p></div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="apc-card p-6">
          <h2 className="text-2xl font-black">Strategic Priorities</h2>
          <ol className="mt-4 space-y-3 text-sm text-zinc-600">
            <li>1. Complete APC Master Control Center</li>
            <li>2. Verify live authentication when services are available</li>
            <li>3. Connect SafeConnect operational systems</li>
            <li>4. Complete APC Academy</li>
            <li>5. Prepare APC AI integration architecture</li>
            <li>6. Organize APC unit integration strategy</li>
            <li>7. Prepare SafeWorkConnect as a future standalone product</li>
          </ol>
        </article>
        <article className="apc-card border-yellow-200 bg-yellow-50 p-6">
          <h2 className="text-2xl font-black">System Alerts</h2>
          <p className="mt-4 font-bold text-yellow-800">No Live Monitoring Connection</p>
          <p className="mt-2 text-sm text-yellow-700">
            Integration alerts and service incidents will appear here after approved monitoring connections are configured.
          </p>
        </article>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Executive Control Links</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/admin-roles" className="rounded-xl bg-black px-4 py-3 font-bold text-white hover:bg-zinc-800">
            APC Admin Roles Center
          </Link>
          <Link href="/dashboard" className="rounded-xl border border-zinc-300 px-4 py-3 font-bold hover:bg-zinc-50">
            Enterprise Operations Dashboard
          </Link>
        </div>
      </section>
          </div>
        </ExecutiveLayout>
      </RoleGuard>
    </AuthGuard>
  );
}
