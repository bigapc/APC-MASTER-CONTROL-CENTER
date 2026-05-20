import { APP_CONFIG } from "@/lib/appConfig";
import { Database, KeyRound, Lock, Server, Shield } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">System Configuration</div>
        <h1 className="mt-4 text-4xl font-black text-white">Control Center Settings</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Configure app access, backend connection, role permissions, environment settings, and APC platform identity.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Backend", text: "Connect Supabase database, auth, RLS, and storage.", icon: Database },
          { title: "Access", text: "Manage admin protection, app access, and permissions.", icon: Lock },
          { title: "API Health", text: "Monitor service status and backend checks.", icon: Server },
          { title: "Keys", text: "Prepare public app IDs and private server keys.", icon: KeyRound },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="apc-card p-6">
              <Icon className="text-[#c1121f]" />
              <h2 className="mt-4 text-xl font-black">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
            </div>
          );
        })}
      </section>

      <section className="apc-card p-6">
        <div className="flex items-center gap-3">
          <Shield className="text-[#c1121f]" />
          <h2 className="text-2xl font-black">APC Brand Identity</h2>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase text-zinc-500">Company</p>
            <p className="mt-2 text-lg font-black">{APP_CONFIG.companyName}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase text-zinc-500">Platform</p>
            <p className="mt-2 text-lg font-black">{APP_CONFIG.appName}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase text-zinc-500">Owner</p>
            <p className="mt-2 text-lg font-black">{APP_CONFIG.ownerName}</p>
            <p className="mt-1 text-sm font-bold text-[#c1121f]">{APP_CONFIG.ownerEmail}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5">
            <p className="text-xs font-black uppercase text-zinc-500">Theme</p>
            <p className="mt-2 text-lg font-black">Red, Black, White</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5 md:col-span-2">
            <p className="text-xs font-black uppercase text-zinc-500">Mission Statement</p>
            <p className="mt-2 text-lg font-black">“{APP_CONFIG.mission}”</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 p-5 md:col-span-2">
            <p className="text-xs font-black uppercase text-zinc-500">Company Pride Statement</p>
            <p className="mt-2 leading-7 text-zinc-700">{APP_CONFIG.prideStatement}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
