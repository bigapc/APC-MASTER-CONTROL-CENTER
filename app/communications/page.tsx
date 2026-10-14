import { Bell, Mail, MessageSquare, Radio, ShieldAlert } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import CommunicationsAdministration from "@/components/CommunicationsAdministration";
import { getCommunicationsUser } from "@/lib/communications/api";
import { getCommunications } from "@/lib/communications/service";

const areas = [
  [Bell, "Command Communications", "Executive notices and leadership communications."],
  [MessageSquare, "Unit Communications", "Unit-specific notices using existing APC Unit references."],
  [Radio, "Announcements and Escalations", "Operational messages with internal priority classification."],
  [Mail, "Notifications", "Future provider-independent notification delivery."],
  [ShieldAlert, "Communication History", "Actual local records and lifecycle history when created."],
] as const;

export default async function CommunicationsPage() {
  const result = await getCommunications(await getCommunicationsUser());
  const snapshot = result.ok ? result.data : { communications: [], sourceStatus: "LOCAL_DEVELOPMENT" as const };
  return <AuthGuard><ExecutiveLayout><div className="space-y-8">
    <section className="apc-card-dark p-8"><div className="apc-badge">Communications Architecture Active</div><h1 className="mt-4 text-4xl font-black text-white">APC Communications Center</h1><p className="mt-4 max-w-3xl text-zinc-300">Protected command collaboration architecture for executive, unit, operational, incident, work, and governance references.</p></section>
    <section className="apc-card border-yellow-200 bg-yellow-50 p-6"><h2 className="text-2xl font-black">Local Development Status</h2><p className="mt-3 text-yellow-800">Communications Architecture: ACTIVE | Local Persistence: AVAILABLE | External Messaging: NOT CONNECTED | Live Delivery: NOT CONNECTED</p><p className="mt-2 text-sm text-yellow-700">No live delivery metrics are available. Delivery and read states are never inferred without an approved provider.</p></section>
    <section className="apc-card p-6"><h2 className="text-2xl font-black">Communication Command</h2>{snapshot.communications.length === 0 ? <p className="mt-4 text-sm text-zinc-600">NO LOCAL COMMUNICATIONS</p> : <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[["Drafts", snapshot.communications.filter((item) => item.status === "DRAFT").length], ["Ready for Delivery", snapshot.communications.filter((item) => item.status === "READY").length], ["Active / Recent", snapshot.communications.filter((item) => !["DRAFT", "READY", "ARCHIVED", "CANCELLED"].includes(item.status)).length], ["Archived", snapshot.communications.filter((item) => item.status === "ARCHIVED").length]].map(([label, count]) => <div key={label} className="rounded-xl border border-zinc-200 p-4"><p className="text-sm font-bold text-zinc-500">{label}</p><p className="mt-2 text-2xl font-black">{count}</p></div>)}</div>}</section>
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{areas.map(([Icon, title, description]) => <article key={title} className="apc-card p-6"><Icon className="text-[#c1121f]" /><h2 className="mt-4 text-xl font-black">{title}</h2><p className="mt-3 text-sm text-zinc-600">{description}</p><p className="mt-5 text-xs font-black uppercase tracking-wide text-[#c1121f]">Architecture Ready</p></article>)}</section>
    <section className="apc-card p-6"><h2 className="text-2xl font-black">Reference Context</h2><p className="mt-3 text-sm text-zinc-600">Executive, unit, incident, work, and governance relationships remain reference-only and do not create or modify records in those systems.</p><p className="mt-2 text-sm text-zinc-500">Incident Reference: LOCAL REFERENCE ONLY | Recipient Directory: NOT CONNECTED</p></section>
    <section className="apc-card p-6"><h2 className="text-2xl font-black">Communication records</h2><p className="mt-3 text-sm text-zinc-600">{snapshot.communications.length === 0 ? "NO LOCAL COMMUNICATIONS" : `${snapshot.communications.length} local communication record(s).`}</p><p className="mt-2 text-sm text-zinc-500">Source status: {snapshot.sourceStatus}. Local status is not production delivery confirmation.</p></section>
    <CommunicationsAdministration initialSnapshot={snapshot} />
  </div></ExecutiveLayout></AuthGuard>;
}
