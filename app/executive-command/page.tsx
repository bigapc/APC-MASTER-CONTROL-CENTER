import { Crown, Landmark, BriefcaseBusiness, Megaphone, Cpu, ShieldCheck, Activity, Database } from "lucide-react";
import Link from "next/link";
import DataSourceBadge from "@/components/DataSourceBadge";

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
  return (
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
  );
}
