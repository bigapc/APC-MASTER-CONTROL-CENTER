import { BrainCircuit, Bot, ShieldCheck, Database, Route, Sparkles } from "lucide-react";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import { APC_AI_ASSISTANTS } from "@/lib/ai/registry";
import { unavailableAIProvider } from "@/lib/ai/provider";

const assistantIcons = { lhm: Route, hermes: Database, "mission-intelligence": Sparkles } as const;
const workflowSteps = ["Authorized User", "Permission Check", "Assistant Selection", "Approved Data Context", "AI Provider", "Recommendation", "Human Review", "Authorized Action"];

export default function APCAIPage() {
  return (
    <AuthGuard>
      <ExecutiveLayout>
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
        {APC_AI_ASSISTANTS.map((assistant) => {
          const Icon = assistantIcons[assistant.id];
          return (
          <article key={assistant.id} className="apc-card p-6">
            <Icon className="text-[#c1121f]" />
            <p className="mt-4 text-sm font-black tracking-wide text-zinc-500">{assistant.name}</p>
            <h2 className="mt-1 text-xl font-black">{assistant.title}</h2>
            <p className="mt-3 text-sm text-zinc-600">{assistant.purpose}</p>
            <div className="mt-5 inline-flex rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-bold text-zinc-600">{assistant.status}</div>
          </article>
          );
        })}
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

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="apc-card p-6">
          <ShieldCheck className="text-[#c1121f]" />
          <h2 className="mt-4 text-2xl font-black">AI Governance</h2>
          <p className="mt-3 text-zinc-600">AI assists authorized human decision-making. AI does not replace authorized human judgment.</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-600">
            <li>Human review is required before a recommendation becomes an action.</li>
            <li>Assistant access follows existing APC roles and approved data boundaries.</li>
            <li>Recommendations remain transparent and can escalate to authorized personnel.</li>
          </ul>
        </article>
        <article className="apc-card p-6">
          <Database className="text-[#c1121f]" />
          <h2 className="mt-4 text-2xl font-black">Access and Data Boundaries</h2>
          <p className="mt-3 text-zinc-600">The existing APC role architecture governs assistant access. Provider keys are server-side only and no live data source is connected.</p>
          <div className="mt-4 space-y-2 text-sm text-zinc-600">
            <p>Executive access: Mission Intelligence™</p>
            <p>Authorized staff access: LHM™ and HERMES™</p>
            <p>Provider status: {unavailableAIProvider.status}</p>
          </div>
        </article>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">AI Request Workflow</h2>
        <p className="mt-3 text-sm text-zinc-600">AI Request Simulation Not Connected</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <div key={step} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="text-xs font-black text-[#c1121f]">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 font-bold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="apc-card p-6">
          <h2 className="text-2xl font-black">Provider Integration Boundary</h2>
          <p className="mt-3 text-zinc-600">Future model, knowledge retrieval, operational data, analytics, and notification providers connect through a server-side adapter.</p>
          <p className="mt-5 text-xs font-black uppercase tracking-wide text-[#c1121f]">NOT_CONNECTED</p>
        </article>
        <article className="apc-card p-6">
          <h2 className="text-2xl font-black">AI Audit Readiness</h2>
          <p className="mt-3 text-zinc-600">No Live AI Activity</p>
          <p className="mt-2 text-sm text-zinc-500">Future records will include request ID, authorized user reference, assistant type, request category, data classification, human review status, timestamp, and outcome reference.</p>
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
      </ExecutiveLayout>
    </AuthGuard>
  );
}
