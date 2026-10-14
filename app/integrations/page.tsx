import AuthGuard from "@/components/AuthGuard";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import { APC_UNITS } from "@/lib/apcUnits";

const connectionCategories = [
  "Authentication",
  "Data",
  "Communications",
  "Maps",
  "Payments",
  "AI",
  "Analytics",
  "Notifications",
];

export default function IntegrationsPage() {
  return (
    <AuthGuard>
      <ExecutiveLayout>
        <div className="space-y-8">
          <section className="apc-card-dark p-8">
            <div className="apc-badge">Integration Pending</div>
            <h1 className="mt-4 text-4xl font-black text-white">APC Integration Architecture</h1>
            <p className="mt-4 max-w-3xl text-zinc-300">
              The Master Control Center is prepared to coordinate APC units through approved
              APIs, webhooks, databases, and external services.
            </p>
          </section>

          <section className="apc-card p-6">
            <h2 className="text-2xl font-black">Connection Layers</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ["APC Master Control Center", "Configuration Required"],
                ["APC Units", "Development Ready"],
                ["APIs / Webhooks / Databases / External Services", "Not Connected"],
              ].map(([name, status]) => (
                <div key={name} className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
                  <h3 className="font-black">{name}</h3>
                  <p className="mt-3 text-sm font-bold text-[#c1121f]">{status}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="apc-card p-6">
            <h2 className="text-2xl font-black">Integration Categories</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {connectionCategories.map((category) => (
                <div key={category} className="rounded-xl border border-zinc-200 p-4">
                  <p className="font-bold">{category}</p>
                  <p className="mt-1 text-sm text-zinc-500">Configuration Required</p>
                </div>
              ))}
            </div>
          </section>

          <section className="apc-card p-6">
            <h2 className="text-2xl font-black">Unit Connection Readiness</h2>
            <div className="mt-5 divide-y divide-zinc-200">
              {APC_UNITS.map((unit) => (
                <div key={unit.id} className="flex flex-col justify-between gap-2 py-4 sm:flex-row sm:items-center">
                  <span className="font-bold">{unit.name}</span>
                  <span className="text-sm font-bold text-zinc-500">{unit.integrationStatus.replaceAll("_", " ")}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ExecutiveLayout>
    </AuthGuard>
  );
}