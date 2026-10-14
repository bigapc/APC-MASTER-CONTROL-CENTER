import type { ExecutiveOversightSnapshot } from "@/lib/executive/oversight";

export default function ExecutiveOversight({ snapshot }: { snapshot: ExecutiveOversightSnapshot }) {
  return <section className="space-y-5">
    <div className="apc-card p-6"><div className="apc-badge">Read-Only Oversight</div><h2 className="mt-4 text-2xl font-black">System Readiness</h2><p className="mt-3 text-sm text-zinc-600">Architecture and integration state only. No operational performance, compliance, delivery, or personnel metrics are inferred from missing data.</p></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{snapshot.domains.map((domain) => <article key={domain.domain} className="apc-card p-5"><div className="flex items-start justify-between gap-4"><h3 className="font-black">{domain.domain}</h3><span className="rounded-full border border-zinc-200 px-2 py-1 text-[11px] font-black uppercase tracking-wide text-zinc-600">{domain.architectureStatus}</span></div><p className="mt-4 text-sm text-zinc-600">Persistence: {domain.persistenceStatus}</p><p className="mt-2 text-sm text-zinc-600">Integration: {domain.integrationStatus}</p><p className="mt-3 text-xs font-bold uppercase tracking-wide text-[#c1121f]">{domain.attentionStatus}</p></article>)}</div>
  </section>;
}
