import { APP_CONFIG, SAFECONNECT_TEST_ACCOUNTS } from "@/lib/appConfig";
import { Database, Server, ShieldCheck, UserCheck } from "lucide-react";

export default function BackendStatusPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "Not connected yet";
  const projectRef = supabaseUrl.includes("https://")
    ? supabaseUrl.replace("https://", "").replace(".supabase.co", "")
    : "Not detected";

  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8">
        <div className="apc-badge">Backend Verification</div>
        <h1 className="mt-4 text-4xl font-black text-white">Supabase Backend Status</h1>
        <p className="mt-3 max-w-3xl leading-7 text-zinc-300">
          Confirm the APC Master Control Center is connected to the correct Supabase project and expected owner identity before production launch.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="apc-card p-6"><UserCheck className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Expected Owner</p><p className="mt-3 text-xl font-black">{APP_CONFIG.ownerName}</p><p className="mt-1 text-sm font-bold text-[#c1121f]">{APP_CONFIG.ownerEmail}</p></div>
        <div className="apc-card p-6"><Database className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Supabase URL</p><p className="mt-3 break-all font-mono text-sm font-black">{supabaseUrl}</p></div>
        <div className="apc-card p-6"><Server className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Project Ref</p><p className="mt-3 break-all font-mono text-sm font-black">{projectRef}</p></div>
        <div className="apc-card p-6"><ShieldCheck className="text-[#c1121f]" /><p className="mt-4 text-sm font-bold text-zinc-500">Control Center</p><p className="mt-3 text-xl font-black">{APP_CONFIG.appName}</p></div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">SafeConnect Test Accounts</h2>
        <p className="mt-2 text-zinc-600">These are the three accounts you are testing with now.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {SAFECONNECT_TEST_ACCOUNTS.map((account) => (
            <div key={account.email} className="rounded-2xl bg-zinc-50 p-5">
              <p className="text-xs font-black uppercase tracking-wide text-[#c1121f]">{account.label}</p>
              <p className="mt-2 text-lg font-black">{account.name}</p>
              <p className="mt-1 break-all text-sm font-bold text-zinc-600">{account.email}</p>
              <p className="mt-3 font-mono text-xs">role: {account.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="apc-card p-6">
        <h2 className="text-2xl font-black">Required Supabase Tables</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {["apps", "apc_admins", "admin_roles", "unified_reports", "dispatch_cases", "organizations", "analytics_events", "audit_logs", "system_health"].map((table) => (
            <div key={table} className="rounded-2xl border border-black/5 bg-white p-4 font-mono text-sm font-black">{table}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
