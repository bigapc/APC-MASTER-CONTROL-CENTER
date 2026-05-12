import Link from "next/link";
import { APP_CONFIG, DAILY_OPERATION_CHECKLIST, DEMO_ALERTS, STAFF_PERFORMANCE } from "@/lib/appConfig";
import { Activity, AlertTriangle, ArrowRight, Building2, CheckSquare, FileText, Map, Radio, Shield, Trophy, Users } from "lucide-react";

const stats = [
  { label: "Connected Apps", value: "3", icon: Activity },
  { label: "Open Reports", value: "3", icon: FileText },
  { label: "Active Staff", value: "3", icon: Users },
  { label: "Priority Alerts", value: "1", icon: AlertTriangle },
];

const commandTiles = [
  { title: "Operations", href: "/operations", icon: Radio, text: "Dispatcher queue, assignments, and live operations readiness." },
  { title: "Live Map", href: "/live-map", icon: Map, text: "Prepared map monitor for dispatch zones and future Mapbox tracking." },
  { title: "Checklist", href: "/checklist", icon: CheckSquare, text: "Daily operational readiness tasks for APC staff." },
  { title: "Staff Performance", href: "/staff-performance", icon: Trophy, text: "Track role activity, output, and pending setup items." },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <section className="apc-card-dark p-8 md:p-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="apc-badge">APC Unified Command Environment</div>
            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">Master Dashboard</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
              Executive oversight for SafeConnect, CommunitySafeConnect, and CommunitySafeConnect-CSC-2.0 — built for safety, coordination, and stronger communities.
            </p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Mission Statement</p>
              <p className="mt-2 text-lg font-semibold text-white">“{APP_CONFIG.mission}”</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/control-hubs" className="apc-button-primary">Open Control Hubs</Link>
              <Link href="/backend-status" className="apc-button-secondary">Verify Backend</Link>
            </div>
          </div>
          <div className="grid w-full max-w-md gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3"><Shield className="text-[#ff5a66]" size={20} /><div><p className="text-sm font-semibold text-white">Owner Identity</p><p className="text-sm text-zinc-400">{APP_CONFIG.ownerName} · {APP_CONFIG.ownerEmail}</p></div></div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center gap-3"><AlertTriangle className="text-[#ff5a66]" size={20} /><div><p className="text-sm font-semibold text-white">Priority Monitoring</p><p className="text-sm text-zinc-400">Alerts, dispatch, reports, and backend checks staged</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return <div key={stat.label} className="apc-card p-6"><div className="flex items-center justify-between"><p className="text-sm font-bold text-zinc-500">{stat.label}</p><Icon size={20} className="text-[#c1121f]" /></div><p className="mt-4 text-4xl font-black text-zinc-950">{stat.value}</p></div>;
        })}
      </section>

      <section className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">
        <div className="apc-card p-6 md:p-8">
          <div className="mb-6"><div className="apc-red-line" /><h2 className="mt-3 text-2xl font-black">Connected Applications</h2><p className="mt-2 text-zinc-600">Each app stays separate while APC monitors them together.</p></div>
          <div className="grid gap-4 md:grid-cols-3">
            {APP_CONFIG.apps.map((app) => (
              <div key={app.id} className="rounded-3xl border border-black/5 bg-gradient-to-b from-white to-zinc-50 p-5 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-950 text-white">{app.id === "safeconnect" ? <Shield size={22} /> : app.id === "communitysafeconnect" ? <Building2 size={22} /> : <Radio size={22} />}</div>
                <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-black text-zinc-950">{app.name}</h3><span className="apc-status apc-status-green">{app.status}</span></div>
                <p className="mt-1 text-xs font-black uppercase tracking-wide text-[#c1121f]">{app.division}</p>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{app.description}</p>
                <p className="mt-4 rounded-xl bg-zinc-100 px-3 py-2 text-xs font-mono text-zinc-700">app_id: {app.id}</p>
                <Link href="/control-hubs" className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#c1121f]">Open Control Hub <ArrowRight size={16} /></Link>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="apc-card p-6"><h2 className="text-2xl font-black">Command Shortcuts</h2><div className="mt-4 space-y-3">{commandTiles.map((tile) => { const Icon = tile.icon; return <Link key={tile.href} href={tile.href} className="flex items-center justify-between rounded-2xl border border-black/5 bg-white p-4 hover:bg-zinc-50"><span className="flex items-center gap-3"><Icon className="text-[#c1121f]" size={18} /><span><span className="block font-black">{tile.title}</span><span className="block text-xs text-zinc-500">{tile.text}</span></span></span><ArrowRight size={16} /></Link>; })}</div></div>
          <div className="apc-card p-6"><h2 className="text-2xl font-black">Priority Alerts</h2><div className="mt-4 space-y-3">{DEMO_ALERTS.slice(0,2).map((alert) => <div key={alert.title} className="rounded-2xl bg-zinc-50 p-4"><p className="font-black">{alert.title}</p><p className="mt-1 text-sm text-zinc-600">{alert.app} · {alert.priority}</p></div>)}</div></div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="apc-card p-6"><h2 className="text-2xl font-black">Daily Readiness</h2><div className="mt-4 space-y-3">{DAILY_OPERATION_CHECKLIST.slice(0,4).map((item) => <div key={item} className="flex gap-3 rounded-2xl bg-zinc-50 p-4"><CheckSquare className="text-[#c1121f]" size={18} /><p className="font-bold text-zinc-800">{item}</p></div>)}</div></div>
        <div className="apc-card p-6"><h2 className="text-2xl font-black">Staff Snapshot</h2><div className="mt-4 space-y-3">{STAFF_PERFORMANCE.map((staff) => <div key={staff.name} className="rounded-2xl bg-zinc-50 p-4"><p className="font-black">{staff.name}</p><p className="mt-1 text-sm text-zinc-600">{staff.role} · {staff.app} · Score: {staff.score}</p></div>)}</div></div>
      </section>
    </div>
  );
}
