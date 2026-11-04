import { Cable, Database, Radio, ShieldAlert } from "lucide-react";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import { APC_INTEGRATIONS } from "@/lib/integrations/registry";
import { getGatewayStatus } from "@/lib/events/gatewayService";

const readiness = [
  ["Connected Units", "No APC Unit Connections Active"],
  ["Pending Units", `${APC_INTEGRATIONS.length} Integration Pending`],
  ["Event Readiness", "Integration Gateway Architecture Ready"],
  ["Webhook Readiness", "External Event Sources Not Connected"],
  ["API Readiness", "Source Authorization Not Configured"],
  ["Connection Status", "No Live APC Integrations Connected"],
];

export default function GatewayPage() {
  const status = getGatewayStatus();
  return (
    <AuthGuard>
      <ExecutiveLayout>
        <div className="space-y-8">
          <section className="apc-card-dark p-8">
            <div className="apc-badge">APC Event Gateway Architecture Active</div>
            <h1 className="mt-4 flex items-center gap-3 text-4xl font-black text-white"><Cable className="text-[#c1121f]" /> Integration Gateway</h1>
            <p className="mt-4 max-w-3xl text-zinc-300">A central server-side boundary for approved APC unit events, validation, source authorization, routing candidates, and future persistence.</p>
          </section>
          <section className="apc-card border-yellow-200 bg-yellow-50 p-6"><h2 className="text-2xl font-black">Gateway Status</h2><p className="mt-3 text-yellow-800">{status.gateway} | External Sources {status.externalSources} | Persistence {status.persistence}</p><p className="mt-2 text-sm text-yellow-700">This architecture does not provide real-time APC monitoring or automatically perform downstream actions.</p></section>
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{readiness.map(([label, value]) => <article key={label} className="apc-card p-6"><Radio className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">{label}</p><p className="mt-2 font-black">{value}</p></article>)}</section>
          <section className="apc-card p-6"><div className="flex items-center gap-3"><Database className="text-[#c1121f]" /><h2 className="text-2xl font-black">Integration Registry</h2></div><div className="mt-5 divide-y divide-zinc-200">{APC_INTEGRATIONS.map((integration) => <div key={integration.integrationId} className="flex flex-col justify-between gap-2 py-4 sm:flex-row"><span className="font-bold">{integration.unitId}</span><span className="text-sm text-zinc-500">{integration.configurationStatus} | {integration.authenticationStatus}</span></div>)}</div></section>
          <section className="apc-card p-6"><div className="flex items-center gap-3"><ShieldAlert className="text-[#c1121f]" /><h2 className="text-2xl font-black">Future Routing Candidates</h2></div><p className="mt-3 text-sm text-zinc-600">Validated events may become review candidates for Incident Command, Operations, Work Management, Executive Command, Analytics, Communications, or a notification adapter.</p><p className="mt-4 text-sm font-bold text-[#c1121f]">No automatic dispatch, emergency contact, payment approval, personnel change, or incident resolution occurs.</p></section>
        </div>
      </ExecutiveLayout>
    </AuthGuard>
  );
}
