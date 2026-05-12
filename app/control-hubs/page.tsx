import Link from "next/link";
import { APP_CONFIG } from "@/lib/appConfig";
import { ExternalLink, ShieldCheck } from "lucide-react";

export default function ControlHubsPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Control Hub Links</div>
        <h1 className="mt-4 text-4xl font-black text-white">Application Control Hubs</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Open or monitor each individual app control center while keeping APC executive oversight in one place.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {APP_CONFIG.apps.map((app) => (
          <div key={app.id} className="apc-card p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-950 text-white">
              <ShieldCheck size={24} />
            </div>
            <h2 className="mt-5 text-2xl font-black text-zinc-950">{app.name}</h2>
            <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#c1121f]">{app.division}</p>
            <p className="mt-4 leading-7 text-zinc-600">{app.description}</p>
            <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs font-black uppercase text-zinc-500">App ID</p>
              <p className="mt-1 font-mono text-sm font-bold">{app.id}</p>
            </div>
            <div className="mt-6 flex gap-3">
              <Link href={app.adminUrl} className="apc-button-primary flex-1"><ExternalLink size={16} /> Admin</Link>
              <Link href={app.publicUrl} className="apc-button-secondary flex-1"><ExternalLink size={16} /> Public</Link>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
