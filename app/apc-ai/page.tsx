import { BrainCircuit, Bot, ShieldCheck, Database, Route, Sparkles } from "lucide-react";
import Link from "next/link";

const assistants = [
  { name: "LHM™", title: "Logical Human Mentor", description: "Planned decision-support assistance for authorized frontline and operational users.", icon: Route },
  { name: "HERMES™", title: "Enterprise Resource Manager", description: "Planned enterprise resource analysis and optimization assistance within approved data boundaries.", icon: Database },
  { name: "Mission Intelligence™", title: "Strategic Insight Layer", description: "Planned strategic and operational insight support for authorized APC leadership.", icon: Sparkles },
];

export default function APCAIPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">APC Intelligence</div>
        <h1 className="mt-4 flex items-center gap-3 text-4xl font-black text-white">
          <BrainCircuit className="text-[#c1121f]" /> APC Command AI
        </h1>
        <p className="mt-4 max-w-3xl text-zinc-300">
          APC Command AI is the approved workspace for future decision-support capabilities across authorized operations, dispatch, reporting, analytics, and enterprise oversight.
        </p>
        <div className="mt-5 rounded-xl border border-yellow-300/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
          AI services are not presented as live until an approved provider, API configuration, data authorization, and human-review workflow are connected.
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {assistants.map(({ name, title, description, icon: Icon }) => (
          <article key={name} className="apc-card p-6">
            <Icon className="text-[#c1121f]" />
            <p className="mt-4 text-sm font-black tracking-wide text-zinc-500">{name}</p>
            <h2 className="mt-1 text-xl font-black">{title}</h2>
            <p className="mt-3 text-sm text-zinc-600">{description}</p>
            <div className="mt-5 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold text-zinc-600">Planned — integration not connected</div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="apc-card p-6">
          <ShieldCheck className="text-[#c1121f]" />
          <h2 className="mt-4 text-2xl font-black">Human Decision Authority</h2>
          <p className="mt-3 text-zinc-600">APC AI is designed to support authorized people, not replace authorized human judgment. Recommendations require appropriate review according to the operational context.</p>
        </article>
        <article className="apc-card p-6">
          <Database className="text-[#c1121f]" />
          <h2 className="mt-4 text-2xl font-black">Authorization First</h2>
          <p className="mt-3 text-zinc-600">AI capabilities must respect the same source ownership, access permissions, and least-privilege boundaries as the person requesting assistance.</p>
        </article>
      </section>

      <section className="apc-card p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-2xl font-black"><Bot className="text-[#c1121f]" /> AI Integration Status</div>
            <p className="mt-2 text-zinc-600">No live assistant is connected in this foundation yet.</p>
          </div>
          <Link href="/dashboard" className="rounded-xl bg-black px-4 py-3 font-bold text-white hover:bg-zinc-800">Return to Operations</Link>
        </div>
      </section>
    </div>
  );
}
