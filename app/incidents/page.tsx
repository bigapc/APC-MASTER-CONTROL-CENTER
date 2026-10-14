import { AlertTriangle, Bell, ClipboardCheck, Radio, ShieldAlert } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import IncidentLocalConsole from "@/components/IncidentLocalConsole";
import { APC_COMMAND } from "@/lib/apcCommandCenter";
import { INCIDENT_CATEGORIES, INCIDENT_SEVERITIES, INCIDENT_STATUSES } from "@/lib/incidents/catalog";
import { getIncidentUser } from "@/lib/incidents/api";
import { getIncidentSnapshotForUser } from "@/lib/incidents/service";
import { EMPTY_INCIDENT_SNAPSHOT } from "@/lib/incidents/types";

const sections = [
  { title: "Active Incident Overview", empty: "No Incident Records Connected", icon: AlertTriangle },
  { title: "Critical Alerts", empty: "No Live Critical Alert Feed Connected", icon: ShieldAlert },
  { title: "Incidents Awaiting Review", empty: "Incident Integration Pending", icon: ClipboardCheck },
  { title: "Escalation Queue", empty: "No Incident Records Connected", icon: Radio },
  { title: "Unit Incident Sources", empty: "No Unit Incident Integrations Connected", icon: Bell },
  { title: "Resolution Tracking", empty: "Incident Integration Pending", icon: ClipboardCheck },
];

export default async function IncidentsPage() {
  const result = await getIncidentSnapshotForUser(await getIncidentUser());
  const snapshot = result.ok ? result.data : EMPTY_INCIDENT_SNAPSHOT;

  return (
    <AuthGuard>
      <ExecutiveLayout>
        <div className="space-y-8">
          <section className="apc-card-dark p-8">
            <div className="apc-badge">Incident Command Architecture Active</div>
            <h1 className="mt-4 text-4xl font-black text-white">APC Incident Command</h1>
            <p className="mt-4 max-w-3xl text-zinc-300">A future command and oversight layer for reviewing, coordinating, escalating, and resolving approved operational signals from APC units.</p>
            <p className="mt-3 text-sm text-zinc-400">{APC_COMMAND.mission}</p>
          </section>

          <section className="apc-card border-yellow-200 bg-yellow-50 p-6">
            <h2 className="text-2xl font-black">Incident System Status</h2>
            <p className="mt-3 text-yellow-800">No Live Incident Feed Connected | Persistence Integration Pending</p>
            <p className="mt-2 text-sm text-yellow-700">This is not an active emergency response system. Critical severity is an internal classification and does not automatically contact emergency services.</p>
          </section>

          <IncidentLocalConsole incidents={snapshot.incidents} />

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {sections.map(({ title, empty, icon: Icon }) => (
              <article key={title} className="apc-card p-6">
                <Icon className="text-[#c1121f]" />
                <h2 className="mt-4 text-xl font-black">{title}</h2>
                <p className="mt-3 text-sm text-zinc-600">{empty}</p>
              </article>
            ))}
          </section>

          <section className="apc-card p-6">
            <h2 className="text-2xl font-black">Incident Architecture</h2>
            <p className="mt-3 text-sm text-zinc-600">Source status: {snapshot.sourceStatus} | No incidents are fabricated or stored by this local foundation.</p>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div><h3 className="font-black">Statuses</h3><p className="mt-2 text-sm text-zinc-600">{INCIDENT_STATUSES.join(" | ")}</p></div>
              <div><h3 className="font-black">Severity</h3><p className="mt-2 text-sm text-zinc-600">{INCIDENT_SEVERITIES.join(" | ")}</p></div>
              <div><h3 className="font-black">Categories</h3><p className="mt-2 text-sm text-zinc-600">{INCIDENT_CATEGORIES.join(" | ")}</p></div>
            </div>
          </section>

          <section className="apc-card p-6">
            <h2 className="text-2xl font-black">Internal Escalation Workflow</h2>
            <p className="mt-3 text-sm text-zinc-600">Incident Reported → Initial Review → Acknowledgement → Assignment → Escalation Decision → Authorized Coordination → Resolution Review → Closure</p>
            <p className="mt-4 text-sm font-bold text-[#c1121f]">Escalation, notifications, and external emergency contact remain disconnected.</p>
          </section>
        </div>
      </ExecutiveLayout>
    </AuthGuard>
  );
}
